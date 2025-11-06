import { Box, Chip, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCallback, useMemo, useState } from "react";
import { getUrl, handleDownload } from "../util/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useFavorites } from "../pages/FavoritePage/FavoritesHooks";
import { setGlobalData } from "../util/globalSlice";
import api from "../util/axiosConfig";

const ListItem = ({ source, data, loadDate }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMouseOver, setIsMouseOver] = useState(false);
    const { user, token } = useSelector(state => state.global)
    const { addToFavorites, removeFromFavorites } = useFavorites();

    const imageUrl = useMemo(() => getUrl(source, data), [source, data]);

    const isFavorite = useMemo(() =>
        user?.favorites?.find(elem => elem.data === data && elem.source === source),
        [user, data, source]
    );

    const handleMouseEnter = useCallback(() => setIsMouseOver(true), []);
    const handleMouseLeave = useCallback(() => setIsMouseOver(false), []);

    const handleItemClick = useCallback(() => {
        navigate('/item', { state: { id: data?.id, source, item: data } });
    }, [navigate, data, source]);

    const handleDownloadClick = useCallback((e) => {
        e.stopPropagation();
        handleDownload(imageUrl, source);

        if (user?.historyLoad && token) {
            dispatch(setGlobalData({
                field: 'user',
                value: {
                    ...user,
                    historyLoad: [{
                        source,
                        data,
                        loadDate: Date.now()
                    }, ...user.historyLoad]
                }
            }));

            api.post('/profile/history/add', { refreshToken: user?.refreshToken, email: user?.email, user_email: user?.email, item: data, source }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } })
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
    }, [imageUrl, source, data, user, token, dispatch]);

    const handleFavoritesClick = useCallback((e) => {
        e.stopPropagation();
        if (isFavorite) {
            removeFromFavorites(source, data);
        } else {
            addToFavorites(source, data);
        }
    }, [isFavorite, source, data, addToFavorites, removeFromFavorites]);

    const formattedDate = useMemo(() =>
        loadDate ? new Date(loadDate).toLocaleDateString() : null,
        [loadDate]
    );

    const hoverOverlay = useMemo(() =>
        isMouseOver && (
            <Box
                onClick={handleItemClick}
                sx={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    backgroundColor: '#00000060',
                    top: 0,
                    left: 0,
                    borderRadius: '1em',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    justifyContent: 'space-between',
                    gap: '1em',
                    padding: '1em',
                    cursor: 'pointer'
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                    gap: '1em',
                    minHeight: '100%',
                    minWidth: '100%',
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        minWidth: '100%',
                        gap: '1em',
                    }}
                    >
                        <Button
                            onClick={handleDownloadClick}
                            variant="contained"
                        >
                            <DownloadIcon sx={{ fontSize: '1.2em' }} />
                        </Button>
                        <Chip
                            label={source?.toUpperCase()}
                            variant={source}
                        />
                        <Button
                            disabled={!user?.favorites && !token}
                            onClick={handleFavoritesClick}
                            variant="contained"
                        >
                            {isFavorite ? (
                                <FavoriteIcon sx={{ fontSize: '1.2em' }} />
                            ) : (
                                <FavoriteBorderIcon sx={{ fontSize: '1.2em' }} />
                            )}
                        </Button>
                    </Box>
                    <Box sx={{
                        alignSelf: 'end',
                        display: 'flex',
                        justifyContent: 'end',
                        alignItems: 'end',
                        gap: '1em',
                    }}
                    >
                        {formattedDate && (
                            <Typography sx={{
                                backgroundColor: '#333',
                                p: '2px 5px',
                                borderRadius: '5px'
                            }}>
                                {formattedDate}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        ),
        [isMouseOver, handleItemClick, handleDownloadClick, source, handleFavoritesClick, user, token, isFavorite, formattedDate]
    );

    return (
        <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
                backgroundColor: '#10002B',
                borderRadius: '1em',
                position: 'relative',
                breakInside: 'avoid-column',
                display: 'inline-block',
                width: '100%',
                mb: '1em',
                overflow: 'hidden'
            }}
        >
            {hoverOverlay}

            <Box
                component="img"
                src={imageUrl}
                sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '1em',
                    objectFit: 'contain'
                }}
                alt={data?.title}
                loading="lazy"
            />
        </Box>
    );
}

export default ListItem;