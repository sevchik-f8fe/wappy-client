import { Box, Typography, Button, Step, Stepper, StepLabel } from "@mui/material";
import { MuiOtpInput } from 'mui-one-time-password-input';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

    const [fieldsOk, setFieldsOk] = useState(false);

    useEffect(() => {
        if (step === 0) {
            if (!password.error && !email.error && email.value.length > 0 && password.value.length > 0) setFieldsOk(true);
            else setFieldsOk(false);
        } else {
            if (code.length === 6) setFieldsOk(true);
            else setFieldsOk(false);
        }
    }, [password, email, code, step]);

    const setCurrentStep = (to) => {
        if (to < 0 || to >= 2 || typeof to !== 'number') return;

        dispatch(setSimpleField({ field: 'step', value: to }));
    }

    return (
        <AuthContainer text='еще нет аккаунта?' href='/signup' link='регистрация'>
            <Box sx={{ mt: '1em', display: 'flex', alignItems: 'start', gap: '1em' }}>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'end' }}>
                    <Stepper alternativeLabel activeStep={step}>
                        {['введите данные аккаунта', 'подтвердите вход'].map((label, i) => (
                            <Step key={label}>
                                <StepLabel><Typography variant={step >= i ? 'subtitle1' : 'subtitle2'}>{label}</Typography></StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Box component="form" sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1em' }}>
                    {step === 0 ? (
                        <>
                            <AuthField help="введите адрес электронной почты" onchange={(e) => emailHandle(e)} value={email.value} error={email.error} label="эл. почта" type="email" placeholder="wappy@yandex.ru" />
                            <AuthField help="минимальная длинна пароля 8 символов, разрешены спец-символы: ! @ # $ ? % & { } _ ( )" onchange={(e) => passwordHandle(e)} value={password.value} error={password.error} label="пароль" type="password" />
                        </>
                    ) : (
                        <>
                            <Typography sx={{ minWidth: '100%' }} variant="body2">на указанную почту придет письмо с кодом подтверждения <br /> если письмо не приходит проверьте папку спама</Typography>
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
                                onClick={() => {
                                    sendMail(user.email, 'signInVerification')
                                        .then(() => handleButtonClick())
                                }}
                                size="small">
                                {resendDisabled ? (formatTime(timer)) : ('отправить снова')}

                            </Button>
                        </>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', minWidth: '100%' }}>
                        <Button onClick={() => setCurrentStep(step - 1)} disabled={loading || step === 0} color="secondary" variant="outlined">назад</Button>
                        <Button
                            loading={loading}
                            disabled={!fieldsOk}
                            onClick={() => {
                                if (step == 0) {
                                    setOldUser({ email: email.value, password: password.value })
                                        .then(() => { setCurrentStep(step + 1); handleButtonClick() })
                                        .catch(er => console.log(er))
                                } else if (step == 1) {
                                    confirmMail(code, 'signInVerification')
                                }
                            }}
                            variant="outlined"
                        >
                            далее
                        </Button>
                    </Box>
                </Box>
            </Box>
        </AuthContainer >
    );
}

export default SignInPage;