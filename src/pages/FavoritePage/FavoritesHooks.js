import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setGlobalData } from "../../util/globalSlice";

export const useFavorites = () => {
    const { user, token } = useSelector(state => state.global);
    const dispatch = useDispatch()

    const addToFavorites = async (source, data) => {
        if (!user?.favorites?.find(elem => (elem.data == data && elem.source == source))) {
            await axios.post('http://127.0.0.1:3000/profile/favorites/add', { user_email: user?.email, item: data, source }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } })
                .then(res => {
                    console.log(res.data);
                    if (user?.favorites?.length > 0) {
                        dispatch(setGlobalData({ field: 'user', value: { ...user, favorites: [{ source, data }, ...user.favorites] } }));
                    } else {
                        dispatch(setGlobalData({ field: 'user', value: { ...user, favorites: [{ source, data }] } }));
                    }
                })
        } return;
    }

    const removeFromFavorites = async (source, data) => {
        await axios.post('http://127.0.0.1:3000/profile/favorites/remove', { user_email: user?.email, item: data, source }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } })
            .then(res => {
                console.log(res.data);
                const newFavorites = user?.favorites?.filter(elem => (elem.data != data && elem.source != source));
                console.log('all: ', user.favorites);
                console.log('new: ', newFavorites);
                dispatch(setGlobalData({ field: 'user', value: { ...user, favorites: newFavorites } }));
            })
    }

    return { addToFavorites, removeFromFavorites }
}