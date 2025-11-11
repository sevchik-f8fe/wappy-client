import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setSimpleField } from "../pages/SignUpPage/AuthSlice";
import { getCsrfToken } from "./axiosConfig";

export const ScrollToTop = () => {
    const { user, token } = useSelector((state) => state.global);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const dispatch = useDispatch();

    useEffect(() => {
        if (pathname == '/change_email' || pathname == '/favorites' || pathname == '/history') {
            if (user == null || token == null) navigate('/')
        }
    }, [pathname, user, token, navigate])

    useEffect(() => {
        if (pathname == '/signin' || pathname == '/signup') {
            dispatch(setSimpleField({ field: 'timer', value: 120 }));
            dispatch(setSimpleField({ field: 'code', value: '' }));
            dispatch(setSimpleField({ field: 'step', value: 0 }));
            dispatch(setSimpleField({ field: 'confOk', value: false }));
            dispatch(setSimpleField({ field: 'persOk', value: false }));
        }

        if (pathname != '/' && pathname != '/item' && pathname != '/favorites' && pathname != '/history') {
            window.scrollTo(0, 0);
        }
    }, [pathname, dispatch]);

    return null;
}