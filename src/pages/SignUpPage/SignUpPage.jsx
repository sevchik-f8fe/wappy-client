import { Box, Typography, Button, Step, Stepper, StepLabel } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { MuiOtpInput } from 'mui-one-time-password-input';
import { useState, useEffect } from "react";

import { setSimpleField } from "./AuthSlice.js";
import { usePasswordHandle, usePasswordRepHandle, useEmailHandle, useCodeHandle, useTimer, useServer } from "../../util/authHooks.js";

import { Checkbox } from "../../components/Checkbox.jsx";
import { AuthField } from "../../components/AuthField.jsx";
import AuthContainer from "../../components/AuthContainer.jsx";

const SignUpPage = () => {
    const dispatch = useDispatch();
    const { confOk, persOk, passwordRep, code, timer, email, password, step, loading } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.global)
    const emailHandle = useEmailHandle();
    const passwordHandle = usePasswordHandle();
    const passwordRepHandle = usePasswordRepHandle();
    const codeHandle = useCodeHandle();
    const { resendDisabled, handleButtonClick, formatTime } = useTimer();
    const { setNewUser, sendMail, confirmMail } = useServer();

    const [fieldsOk, setFieldsOk] = useState(false);

    useEffect(() => {
        if (step === 0) {
            if (confOk && persOk && !password.error && !passwordRep.error && !email.error && email.value.length > 0 && password.value.length > 0 && passwordRep.value.length > 0) setFieldsOk(true);
            else setFieldsOk(false);
        } else {
            if (code.length === 6) setFieldsOk(true);
            else setFieldsOk(false);
        }
    }, [confOk, persOk, password, passwordRep, email, code, step]);

    const setCurrentStep = (to) => {
        if (to < 0 || to >= 2 || typeof to !== 'number') return;

        dispatch(setSimpleField({ field: 'step', value: to }));
    }

    const checkHandle = (field, e) => {
        dispatch(setSimpleField({ field, value: e.target.checked }))
    }

    return (
        <AuthContainer text='уже есть аккаунт?' href='/signin' link='войти'>
            <Box sx={{ mt: '1em', display: 'flex', alignItems: 'start', gap: '1em' }}>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Stepper alternativeLabel activeStep={step}>
                        {['зарегистрируйте аккаунт', 'подтвердите почту'].map((label, i) => (
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
                            <AuthField help="рекомендуется ручной ввод" onchange={(e) => passwordRepHandle(e)} value={passwordRep.value} error={passwordRep.error} label="повторите пароль" type="password" />
                            <Checkbox onchange={(e) => checkHandle('persOk', e)} value={persOk} label='я согласен на обработку ' link='персональных данных' href='#' error={null} />
                            <Checkbox onchange={(e) => checkHandle('confOk', e)} value={confOk} label='я ознакомлен и согласен с ' link='политикой конфиденциальности' href='#' error={null} />
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
                                color="linkColor"
                                variant="text"
                                loading={loading}
                                onClick={() => {
                                    sendMail(user.email)
                                        .then(() => handleButtonClick())
                                }}
                                size="small">
                                {resendDisabled ? (formatTime(timer)) : ('отправить снова')}

                            </Button>
                        </>

                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', minWidth: '100%' }}>
                        <Button disabled={loading || step === 0} onClick={() => setCurrentStep(step - 1)} color="secondary" variant="outlined">назад</Button>
                        <Button
                            disabled={!fieldsOk}
                            loading={loading}
                            onClick={() => {
                                if (step == 0) {
                                    setNewUser({ email: email.value, password: password.value })
                                        .then(() => { handleButtonClick(); setCurrentStep(step + 1); })
                                        .catch(er => console.log(er))

                                } else if (step == 1) {
                                    confirmMail(code, 'activation')
                                }
                            }}
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

export default SignUpPage;