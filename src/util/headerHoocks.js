import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { setGlobalData } from "./globalSlice";
import { setHeaderData } from "../components/HeaderSlice";
import { Bounce, toast } from "react-toastify";
import { setQuery } from "../pages/DashboardPage/DashboardSlice";
import api from "./axiosConfig";

export const usePannel = () => {
    const navigate = useNavigate();
    const { user, token } = useSelector((state) => state.global)
    const dispatch = useDispatch();

    const notify = () => toast.error("Что-то пошло не так :(", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    });

    const deleteAction = () => {
        api.post('/profile/delete', { email: user.email }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } })
            .then(() => {
                dispatch(setHeaderData({ field: 'delDialog', vale: false }));
                dispatch(setGlobalData({ field: 'user', value: null }));
                dispatch(setGlobalData({ field: 'token', value: null }));
                dispatch(setQuery({ query: '', isImg: true, isSVG: true, isGif: true }));
            })
            .catch(() => {
                notify();
            });
    }

    const logOutAction = () => {
        dispatch(setGlobalData({ field: 'user', value: null }));
        dispatch(setGlobalData({ field: 'token', value: null }));

        dispatch(setHeaderData({ field: 'outDialog', vale: false }));
        dispatch(setQuery({ query: '', isImg: true, isSVG: true, isGif: true }));
    }

    const logInAction = () => {
        navigate('/signin');
    }

    const changeEmailAction = () => {
        navigate('/change_email')
    }

    return {
        deleteAction, logInAction, logOutAction, changeEmailAction
    }
}