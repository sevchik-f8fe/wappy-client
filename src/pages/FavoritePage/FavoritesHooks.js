import { useDispatch, useSelector } from "react-redux"
import { setGlobalData } from "../../util/globalSlice";
import api from "../../util/axiosConfig";

export const useFavorites = () => {
    const { user, token } = useSelector(state => state.global);
    const dispatch = useDispatch()

    const addToFavorites = async (source, data) => {
        if (!user?.favorites?.find(elem => (elem.data == data && elem.source == source))) {
            await api.post('/profile/favorites/add', { refreshToken: user?.refreshToken, email: user?.email, user_email: user?.email, item: data, source }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } })
                .then(res => {
                    if (res?.data?.token) {
                        dispatch(setGlobalData({ field: 'user', value: { ...res?.data?.user, favorites: [{ source, data }, ...user.favorites] } }))
                        dispatch(setGlobalData({ field: 'token', value: res?.data?.token }))
                    } else {
                        dispatch(setGlobalData({ field: 'user', value: { ...res?.data?.user, favorites: [{ source, data }, ...user.favorites] } }));
                    }
                })
        } return;
    }

    const removeFromFavorites = async (source, data) => {
        await api.post('/profile/favorites/remove', { refreshToken: user?.refreshToken, email: user?.email, user_email: user?.email, item: data, source }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } })
            .then(res => {
                const newFavorites = user?.favorites?.filter(elem => (elem.data != data && elem.source != source));

                if (res?.data?.token) {
                    dispatch(setGlobalData({ field: 'user', value: { ...res?.data?.user, favorites: newFavorites } }))
                    dispatch(setGlobalData({ field: 'token', value: res?.data?.token }))
                } else {
                    dispatch(setGlobalData({ field: 'user', value: { ...res?.data?.user, favorites: newFavorites } }));
                }
            })
    }

    return { addToFavorites, removeFromFavorites }
}