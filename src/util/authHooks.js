import { useDispatch, useSelector } from "react-redux";
import { setAuthField, setAuthError, setSimpleField } from "../pages/SignUpPage/AuthSlice";
import { setGlobalData } from "./globalSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import api, { initializeCSRF } from "./axiosConfig";

export const useEmailHandle = () => {
    const dispatch = useDispatch();

    const emailHandle = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9_@.]/g, "");
        dispatch(setAuthField({ field: 'email', value }));

        if (!/^[^@]+@[^@]+\.[^@]+$/.test(value) || value.length > 320) {
            dispatch(setAuthError({ field: 'email', error: true }));
        } else {
            dispatch(setAuthError({ field: 'email', error: false }));
        }
    };

    return emailHandle;
}

export const usePasswordHandle = () => {
    const dispatch = useDispatch();

    const passwordHandle = (e) => {
        dispatch(setAuthField({ field: 'password', value: e.target.value.replace(/[^a-zA-Z0-9!@#$?%&{}_]/g, "").trim() }))

        if (e.target.value.length < 8 || e.target.value.length > 64) {
            dispatch(setAuthError({ field: 'password', error: true }))
        } else {
            dispatch(setAuthError({ field: 'password', error: false }))
        }
    }

    return passwordHandle;
}

export const usePasswordRepHandle = () => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.auth)

    const passwordRepHandle = (e) => {
        dispatch(setAuthField({ field: 'passwordRep', value: e.target.value.replace(/[^a-zA-Z0-9!@#$?%&{}_]/g, "").trim() }))

        if (state.password.value !== e.target.value) {
            dispatch(setAuthError({ field: 'passwordRep', error: true }))
        } else {
            dispatch(setAuthError({ field: 'passwordRep', error: false }))
        }
    }

    return passwordRepHandle;
}

export const useCodeHandle = () => {
    const dispatch = useDispatch();

    const codeHandle = (newValue) => {
        dispatch(setSimpleField({ field: 'code', value: newValue.replace(/[^0-9]/g, "") }))
    }

    return codeHandle;
}

export const useTimer = () => {
    const [resendDisabled, setResendDisabled] = useState(false);
    const dispatch = useDispatch();
    const { timer, step } = useSelector((state) => state.auth)

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

    const handleButtonClick = () => {
        dispatch(setSimpleField({ field: 'timer', value: 120 }));
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return {
        resendDisabled,
        handleButtonClick,
        formatTime,
    };
}

export const useServer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token } = useSelector((state) => state.global);

    const notify = () => toast.error("Что-то пошло не так :(", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    });

    const setNewUser = async (data) => {
        dispatch(setSimpleField({ field: 'loading', value: true }))
        const fetchData = await api.post('/auth/signup', data, { headers: { 'Content-Type': 'application/json' } })
            .then((res) => res.data)
            .catch(() => {
                notify();
            })
            .finally(() => {
                dispatch(setSimpleField({ field: 'loading', value: false }))
            });
        dispatch(setGlobalData({ field: 'user', value: fetchData.user }))
    }

    const setOldUser = async (data) => {
        dispatch(setSimpleField({ field: 'loading', value: true }))
        const fetchData = await api.post('/auth/signin', data, { headers: { 'Content-Type': 'application/json' } })
            .then((res) => res.data)
            .catch(() => {
                notify();
            })
            .finally(() => {
                dispatch(setSimpleField({ field: 'loading', value: false }))
            });
        dispatch(setGlobalData({ field: 'user', value: fetchData.user }))
    }

    const sendMail = async (email, path) => {
        dispatch(setSimpleField({ field: 'loading', value: true }))
        await api.post('/auth/sendMail', { email, path }, { headers: { 'Content-Type': 'application/json' } })
            .then((res) => res.data)
            .catch(() => {
                notify();
            })
            .finally(() => {
                dispatch(setSimpleField({ field: 'loading', value: false }))
            });
    }

    const sendMailForChange = async (email) => {
        dispatch(setSimpleField({ field: 'loading', value: true }))
        const fetchData = await api.post('/auth/sendMail', { newEmail: email, email: user.email, path: 'emailChange' }, { headers: { 'Content-Type': 'application/json' } })
            .then((res) => res.data)
            .catch(() => {
                notify();
            })
            .finally(() => {
                dispatch(setSimpleField({ field: 'loading', value: false }))
            });
        dispatch(setGlobalData({ field: 'user', value: fetchData.user }))
    }

    const confirmMail = async (code, path) => {
        dispatch(setSimpleField({ field: 'loading', value: true }))
        await api.post('/auth/confirmMail', { enterCode: code, email: user.email, path: path }, { headers: { 'Content-Type': 'application/json' } })
            .then((res) => res.data)
            .then((data) => {
                dispatch(setGlobalData({ field: 'user', value: data.user }))
                dispatch(setGlobalData({ field: 'token', value: data.token }))
                return data;
            })
            .then((data) => {
                if (data.user.active) navigate('/');
                return data
            })
            .catch(() => {
                notify();
            })
            .finally(() => {
                dispatch(setSimpleField({ field: 'loading', value: false }))
            });
    }

    const changeEmail = async (enterCode, newEmail) => {
        dispatch(setSimpleField({ field: 'loading', value: true }))
        await api.post('/profile/changeEmail', { refreshToken: user.refreshToken, enterCode, newEmail, email: user.email }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } })
            .then((res) => res.data)
            .then((data) => {
                if (data?.token) {
                    dispatch(setGlobalData({ field: 'user', value: data?.user }))
                    dispatch(setGlobalData({ field: 'token', value: data?.token }))
                } else {
                    dispatch(setGlobalData({ field: 'user', value: data?.user }));
                }

                return data;
            })
            .then((data) => {
                if (data.user.active) navigate('/');
                return data
            })
            .catch((err) => {
                notify();
                console.log(err)
            })
            .finally(() => {
                dispatch(setSimpleField({ field: 'loading', value: false }))
            });
    }

    return {
        setNewUser,
        sendMail,
        confirmMail,
        setOldUser,
        changeEmail,
        sendMailForChange
    };
}