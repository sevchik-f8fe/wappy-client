import { Box, Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { AuthField } from "../../components/AuthField";
import AuthContainer from "../../components/AuthContainer";
import { useDispatch, useSelector } from "react-redux";
import { useServer, useTimer } from "../../util/authHooks";
import { useEffect, useState } from "react";
import { setAuthError, setAuthField, setSimpleField } from "./ChenageEmailSlice";

const ChangeEmailPage = () => {
    const dispatch = useDispatch();
    const [resendDisabled, setResendDisabled] = useState(false);

    const { email, timer, code, step } = useSelector((state) => state.changeEmail)
    const { loading } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.global)

    const { formatTime } = useTimer();
    const { changeEmail, sendMailForChange } = useServer();

    const [fieldsOk, setFieldsOk] = useState(false);

    useEffect(() => {
        dispatch(setSimpleField({ field: 'code', value: '' }));
        dispatch(setSimpleField({ field: 'step', value: 0 }));

        dispatch(setAuthError({ field: 'email', error: false }));
        dispatch(setAuthField({ field: 'email', value: '' }));
    }, [dispatch])

    useEffect(() => {
        if (step === 0) {
            if (!email.error && email.value.length > 0) setFieldsOk(true);
            else setFieldsOk(false);
        } else {
            if (code.length === 6) setFieldsOk(true);
            else setFieldsOk(false);
        }
    }, [email, code, step]);

    useEffect(() => {
        let interval = null;

        if (timer > 0 && step === 1) {
            interval = setInterval(() => {
                dispatch(setSimpleField({ field: 'timer', value: (timer - 1) }));
                dispatch(setSimpleField({ field: 'timer', value: (timer - 1) }));
            }, 1000);
            setResendDisabled(true);
        } else if (timer === 0) {
            clearInterval(interval);
            setResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [timer, dispatch, step]);

    const setCurrentStep = (to) => {
        if (to < 0 || to >= 2 || typeof to !== 'number') return;

        dispatch(setSimpleField({ field: 'step', value: to }));
    }

    const emailHandle = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9_@.]/g, "");
        dispatch(setAuthField({ field: 'email', value }));

        if (!/^[^@]+@[^@]+\.[^@]+$/.test(value) || value.length > 320) {
            dispatch(setAuthError({ field: 'email', error: true }));
        } else {
            dispatch(setAuthError({ field: 'email', error: false }));
        }
    };

    const codeHandle = (newValue) => {
        dispatch(setSimpleField({ field: 'code', value: newValue.replace(/[^0-9]/g, "") }))
    }

    const handleButtonClick = () => {
        dispatch(setSimpleField({ field: 'timer', value: 120 }));
    };

    return (
        <AuthContainer text='' href='' link=''>
            <Box sx={{ mt: '1em', display: 'flex', alignItems: 'start', gap: '1em' }}>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Stepper alternativeLabel activeStep={step}>
                        {['введите новый адрес эл. почты', 'подтвердите почту'].map((label, i) => (
                            <Step key={label}>
                                <StepLabel><Typography variant={step >= i ? 'subtitle1' : 'subtitle2'}>{label}</Typography></StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Box component="form" sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1em' }}>
                    {step === 0 ? (
                        <>
                            <AuthField help="введите новый адрес электронной почты" onchange={(e) => emailHandle(e)} value={email.value} error={email.error} label="эл. почта" type="email" placeholder="wappy@yandex.ru" />
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
                                // disabled={resendDisabled}
                                sx={{ alignSelf: 'end' }}
                                color="linkColor"
                                variant="text"
                                loading={loading}
                                onClick={() => {
                                    sendMailForChange(email.value)
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
                            disabled={!fieldsOk}
                            loading={loading}
                            onClick={() => {
                                if (step == 0) {
                                    console.log(user);
                                    sendMailForChange(email.value)
                                        .then(() => { handleButtonClick(); setCurrentStep(step + 1); })
                                        .catch(er => console.log(er))

                                } else if (step == 1) {
                                    changeEmail(code, email.value)
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

export default ChangeEmailPage;