import { Box, Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { AuthField } from "../../components/AuthField";
import AuthContainer from "../../components/AuthContainer";
import { useDispatch, useSelector } from "react-redux";
import { useServer } from "../../util/authHooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { setAuthError, setAuthField, setSimpleField } from "./ChenageEmailSlice";
import { useNavigate } from "react-router-dom";

const ChangeEmailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [resendDisabled, setResendDisabled] = useState(false);

    const { email, timer, code, step } = useSelector((state) => state.changeEmail)
    const { loading } = useSelector((state) => state.auth);
    const { user, token } = useSelector((state) => state.global)

    const { changeEmail, sendMailForChange } = useServer();

    const fieldsOk = useMemo(() => {
        if (step === 0) {
            return !email.error && email.value.length > 0;
        }
        return code.length === 6;
    }, [step, email.error, email.value, code]);

    const setCurrentStep = useCallback((to) => {
        if (to < 0 || to >= 2 || typeof to !== 'number') return;
        dispatch(setSimpleField({ field: 'step', value: to }));
    }, [dispatch]);

    const emailHandle = useCallback((e) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9_@.]/g, "");
        dispatch(setAuthField({ field: 'email', value }));

        if (!/^[^@]+@[^@]+\.[^@]+$/.test(value) || value.length > 320) {
            dispatch(setAuthError({ field: 'email', error: true }));
        } else {
            dispatch(setAuthError({ field: 'email', error: false }));
        }
    }, [dispatch]);

    const codeHandle = useCallback((newValue) => {
        dispatch(setSimpleField({ field: 'code', value: newValue.replace(/[^0-9]/g, "") }))
    }, [dispatch]);

    const handleButtonClick = useCallback(() => {
        dispatch(setSimpleField({ field: 'timer', value: 120 }));
    }, [dispatch]);

    const handleNextStep = useCallback(async () => {
        if (step === 0) {
            try {
                await sendMailForChange(email.value);
                handleButtonClick();
                setCurrentStep(step + 1);
            } catch (error) {
                console.error('Failed to send email:', error);
            }
        } else if (step === 1) {
            changeEmail(code, email.value);
        }
    }, [step, email.value, code, sendMailForChange, changeEmail, handleButtonClick, setCurrentStep]);

    const handleResendCode = useCallback(async () => {
        await sendMailForChange(email.value);
        handleButtonClick();
    }, [sendMailForChange, email.value, handleButtonClick]);

    const formatTime = useCallback((time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, []);

    const steps = useMemo(() => ['введите новый адрес эл. почты', 'подтвердите почту'], []);

    const stepContent = useMemo(() => {
        if (step === 0) {
            return (
                <AuthField
                    help="введите новый адрес электронной почты"
                    onchange={emailHandle}
                    value={email.value}
                    error={email.error}
                    label="эл. почта"
                    type="email"
                    placeholder="wappy@yandex.ru"
                />
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
                    color="linkColor"
                    variant="text"
                    loading={loading}
                    onClick={handleResendCode}
                    size="small"
                >
                    {resendDisabled ? formatTime(timer) : 'отправить снова'}
                </Button>
            </>
        );
    }, [step, email, code, resendDisabled, loading, timer, emailHandle, codeHandle, handleResendCode, formatTime]);

    useEffect(() => {
        if (!user?.historyLoad && token?.length === 0) {
            navigate('/');
        }
    }, [user, token, navigate]);

    useEffect(() => {
        dispatch(setSimpleField({ field: 'code', value: '' }));
        dispatch(setSimpleField({ field: 'step', value: 0 }));
        dispatch(setAuthError({ field: 'email', error: false }));
        dispatch(setAuthField({ field: 'email', value: '' }));
    }, [dispatch]);

    useEffect(() => {
        let interval = null;

        if (timer > 0 && step === 1) {
            interval = setInterval(() => {
                dispatch(setSimpleField({ field: 'timer', value: timer - 1 }));
            }, 1000);
            setResendDisabled(true);
        } else if (timer === 0) {
            clearInterval(interval);
            setResendDisabled(false);
        }

        return () => clearInterval(interval);
    }, [timer, step, dispatch]);

    return (
        <AuthContainer text='' href='' link=''>
            <Box sx={{ mt: '1em', display: 'flex', alignItems: 'start', gap: '1em' }}>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                            onClick={() => setCurrentStep(step - 1)}
                            disabled={loading || step === 0}
                            color="secondary"
                            variant="outlined"
                        >
                            назад
                        </Button>
                        <Button
                            disabled={!fieldsOk || loading}
                            loading={loading}
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

export default ChangeEmailPage;