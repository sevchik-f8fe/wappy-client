import { Box, Button } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { useLocation } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { toast, Bounce } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useTenor, useSVG, usePhoto } from "./itemHooks";
import { nanoid } from "nanoid";
import { setData } from "./ItemSlice";
import { handleDownload } from "../../util/dashboard";
import { useFavorites } from "../FavoritePage/FavoritesHooks";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { setGlobalData } from "../../util/globalSlice";
import api from "../../util/axiosConfig";

const ItemPage = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const stateLocation = location.state;
    const { variants, original_url, title, data } = useSelector((state) => state.item);
    const { user, token } = useSelector(state => state.global)
    const { addToFavorites, removeFromFavorites } = useFavorites();

    const { getTenorVariants } = useTenor();
    const { getPhotoVariants } = usePhoto();
    const { getSVGVariants } = useSVG();

    const notify = useCallback(() => toast.error("Что-то пошло не так :(", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    }), []);

    useEffect(() => {
        const getTenor = async () => {
            await api.post('/api/tenor/getByID', { id: stateLocation.id }, { headers: { 'Content-Type': 'application/json' } })
                .then(res => res.data.tenor)
                .then(res => {
                    dispatch(setData({ field: 'variants', value: getTenorVariants(res) }));
                    dispatch(setData({ field: 'original_url', value: res.url }));
                    dispatch(setData({ field: 'data', value: res }));
                    return res;
                })
                .catch((err) => {
                    console.log(err)
                    notify();
                })
                .finally(() => dispatch(setData({ field: 'loading', value: false })))
        }
        dispatch(setData({ field: 'loading', value: true }))
        switch (stateLocation.source) {
            case 'whvn': {
                dispatch(setData({ field: 'variants', value: getPhotoVariants(stateLocation.item) }));
                dispatch(setData({ field: 'original_url', value: stateLocation.item.short_url }));
                dispatch(setData({ field: 'loading', value: false }))
                dispatch(setData({ field: 'data', value: stateLocation.item }));
                break;
            }
            case 'svg': {
                dispatch(setData({ field: 'variants', value: getSVGVariants(stateLocation.item) }));
                dispatch(setData({ field: 'original_url', value: stateLocation.item.url }));
                dispatch(setData({ field: 'loading', value: false }))
                dispatch(setData({ field: 'data', value: stateLocation.item }));
                break;
            }
            case 'tenor': {
                getTenor();
                break;
            }
            default: {
                console.log('err d')
                notify();
                dispatch(setData({ field: 'loading', value: false }))

            }
        }
    }, []);

    const getSize = (size) => {
        return (size / (1024)).toFixed(2) > 1000 ? `${(size / (1024 * 1024)).toFixed(1)} МБ` : `${(size / (1024)).toFixed(1)} КБ`;
    }

    const handleFavoritesClick = useCallback(() => {
        if (user?.favorites?.find(elem => elem.data === data && elem.source === stateLocation.source)) {
            removeFromFavorites(stateLocation.source, data);
        } else {
            addToFavorites(stateLocation.source, data);
        }
    }, [user, data, stateLocation.source, addToFavorites, removeFromFavorites]);


    const handleDownloadClick = useCallback((variantUrl) => {
        handleDownload(variantUrl, stateLocation.source);

        if (user?.historyLoad && token) {
            dispatch(setGlobalData({
                field: 'user',
                value: {
                    ...user,
                    historyLoad: [{ source: stateLocation.source, data, loadDate: Date.now() }, ...user.historyLoad]
                }
            }));

            api.post('/profile/history/add', { refreshToken: user?.refreshToken, email: user?.email, user_email: user?.email, item: data, source: stateLocation.source }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } })
                .then((res) => {
                    if (res?.data?.token) {
                        dispatch(setGlobalData({ field: 'user', value: res?.data?.user }))
                        dispatch(setGlobalData({ field: 'token', value: res?.data?.token }))
                    } else {
                        dispatch(setGlobalData({ field: 'user', value: res?.data?.user }));
                    }
                })
                .catch(e => console.log(e))
        }
    }, [stateLocation.source, data, user, token, dispatch]);

    return (
        <Box sx={{ backgroundColor: '#F2EBFB30', backdropFilter: 'blur(10px)', border: '1px solid #D4BBFC', borderRadius: '1em', p: '1em', maxWidth: '80%', minWidth: '80%', m: '4em auto 2em auto' }}>

            <Box sx={{ display: 'flex', alignItems: 'start', gap: '1em' }}>

                <img style={{ felx: 1, width: '50%', borderRadius: '1em' }} src={variants && variants[0]?.url} alt={title} />

                <Box sx={{ flex: 1, display: 'flex', gap: '1em', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1em' }}>
                        <Button
                            component="a"
                            href={original_url}
                            target="_blank"
                            color="hide"
                            size="small"
                        >
                            оригинал
                        </Button>
                        <Button
                            onClick={handleFavoritesClick}
                            variant="outlined"
                            color="secondary"
                            size="small"
                        >
                            {user?.favorites?.find(elem => (elem.data == data && elem.source == stateLocation.source)) ? (
                                <FavoriteIcon sx={{ fontSize: '1.2em', }} />
                            ) : (
                                <FavoriteBorderIcon sx={{ fontSize: '1.2em', }} />
                            )}
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                        {variants?.map(variant => (
                            <Button
                                key={nanoid()}
                                color="success"
                                variant="outlined"
                                onClick={() => handleDownloadClick(variant.url)}
                            >
                                <DownloadIcon sx={{ mr: '.5em' }} />
                                {variant.format} {(variant?.height && variant?.width) && `${variant?.width}x${variant?.height}`} {variant?.duration && `- ${variant?.duration} сек. `}{variant?.size && `(${getSize(variant.size)})`}
                            </Button>
                        ))}
                    </Box>
                </Box>

            </Box>
        </Box>
    );
}

export default ItemPage;
