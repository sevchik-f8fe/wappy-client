import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { setGlobalData } from "./globalSlice";
import { setHeaderData } from "../components/HeaderSlice";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

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

    const deleteAction = async () => {
        await axios.post('http://127.0.0.1:3000/profile/delete', { email: user.email }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } })
            .then(() => {
                dispatch(setHeaderData({ field: 'delDialog', vale: false }));
                dispatch(setGlobalData({ field: 'user', value: null }));
                dispatch(setGlobalData({ field: 'token', value: null }));
            })
            .catch((err) => {
                console.log(err)
                notify();
            });
    }

    const logOutAction = () => {
        dispatch(setGlobalData({ field: 'user', value: null }));
        dispatch(setGlobalData({ field: 'token', value: null }));

        dispatch(setHeaderData({ field: 'outDialog', vale: false }));
    }

    const logInAction = () => {
        navigate('signin');
    }

    const changeEmailAction = () => {
        navigate('/change_email')
    }

    return {
        deleteAction, logInAction, logOutAction, changeEmailAction
    }
}