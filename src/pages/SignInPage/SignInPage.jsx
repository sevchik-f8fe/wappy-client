import { Box, Typography, Button, Step, Stepper, StepLabel } from "@mui/material";
import { MuiOtpInput } from 'mui-one-time-password-input';
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import React from 'react'; //for test

import { setSimpleField } from "../SignUpPage/AuthSlice";
import { AuthField } from "../../components/AuthField";
import { useCodeHandle, useEmailHandle, usePasswordHandle, useTimer, useServer } from "../../util/authHooks";
import AuthContainer from "../../components/AuthContainer.jsx";

const SignInPage = () => {
    const dispatch = useDispatch();
    const { email, password, timer, code, step, loading } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.global)

    const emailHandle = useEmailHandle();
    const passwordHandle = usePasswordHandle();
    const codeHandle = useCodeHandle();
    const { resendDisabled, handleButtonClick, formatTime } = useTimer();
    const { setOldUser, sendMail, confirmMail } = useServer();

    const fieldsOk = useMemo(() => {
        if (step === 0) {
            return !password.error &&
                !email.error &&
                email.value.length > 0 &&
                password.value.length > 0;
        }
        return code.length === 6;
    }, [step, password.error, email.error, email.value, password.value, code]);

    const setCurrentStep = useCallback((to) => {
        if (to < 0 || to >= 2 || typeof to !== 'number') return;
        dispatch(setSimpleField({ field: 'step', value: to }));
    }, [dispatch]);

    const handleNextStep = useCallback(async () => {
        if (step === 0) {
            try {
                await setOldUser({ email: email.value, password: password.value });
                setCurrentStep(step + 1);
                handleButtonClick();
            } catch (error) {
                console.error('Sign in failed:', error);
            }
        } else if (step === 1) {
            confirmMail(code, 'signInVerification');
        }
    }, [step, email.value, password.value, code, setOldUser, confirmMail, setCurrentStep, handleButtonClick]);

    const handleResendCode = useCallback(async () => {
        await sendMail(user?.email, 'signInVerification');
        handleButtonClick();
    }, [sendMail, user?.email, handleButtonClick]);

    const handleBackStep = useCallback(() => {
        setCurrentStep(step - 1);
    }, [step, setCurrentStep]);

    const steps = useMemo(() => ['введите данные аккаунта', 'подтвердите вход'], []);

    const stepContent = useMemo(() => {
        if (step === 0) {
            return (
                <>
                    <AuthField
                        help="введите адрес электронной почты"
                        onchange={emailHandle}
                        value={email.value}
                        error={email.error}
                        label="эл. почта"
                        type="email"
                        placeholder="wappy@yandex.ru"
                    />
                    <AuthField
                        help="мин. длинна пароля - 8 символов, разрешены спец-символы: ! @ # $ ? % & { } _ ( )"
                        onchange={passwordHandle}
                        value={password.value}
                        error={password.error}
                        label="пароль"
                        type="password"
                    />
                </>
            );
        }

        return (
            <>
                <Typography sx={{ minWidth: '100%' }} variant="body2">
                    на указанную почту придет письмо с кодом подтверждения <br />
                    если письмо не приходит проверьте папку спама
                </Typography>
                <MuiOtpInput
                    length={6}
                    value={code}
                    onChange={codeHandle}
                />
                <Button
                    disabled={resendDisabled}
                    sx={{ alignSelf: 'end' }}
                    loading={loading}
                    color="linkColor"
                    variant="text"
                    onClick={handleResendCode}
                    size="small"
                >
                    {resendDisabled ? formatTime(timer) : 'отправить снова'}
                </Button>
            </>
        );
    }, [step, email, password, code, resendDisabled, loading, timer, emailHandle, passwordHandle, codeHandle, handleResendCode, formatTime]);

    return (
        <AuthContainer text='еще нет аккаунта?' href='/signup' link='регистрация'>
            <Box sx={{ mt: '1em', display: 'flex', alignItems: 'start', gap: '1em' }}>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'end' }}>
                    <Stepper alternativeLabel activeStep={step}>
                        {steps.map((label, i) => (
                            <Step key={label}>
                                <StepLabel>
                                    <Typography variant={step >= i ? 'subtitle1' : 'subtitle2'}>
                                        {label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Box component="form" sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1em' }}>
                    {stepContent}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', minWidth: '100%' }}>
                        <Button
                            onClick={handleBackStep}
                            disabled={loading || step === 0}
                            color="secondary"
                            variant="outlined"
                        >
                            назад
                        </Button>
                        <Button
                            loading={loading}
                            disabled={!fieldsOk || loading}
                            onClick={handleNextStep}
                            variant="outlined"
                        >
                            далее
                        </Button>
                    </Box>
                </Box>
            </Box>
        </AuthContainer>
    );
}

export default SignInPage;