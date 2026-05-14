/**
 * Компонент отображения медиа-элемента в ленте/галерее
 * 
 * Отвечает за:
 * - Отображение превью изображения
 * - Скачивание файла (с добавлением в историю)
 * - Добавление/удаление из избранного
 * - Навигацию на страницу детального просмотра
 * 
 * Оптимизация:
 * - useMemo для вычисления URL, статуса избранного, даты
 * - useCallback для обработчиков событий
 * - React.memo? (не указан, но подразумевается)
 * 
 * Интеграция с Redux:
 * - useSelector для получения user и token
 * - dispatch для обновления глобального состояния
 * 
 * Взаимодействие с API:
 * - Добавление в историю (POST /profile/history/add)
 * - Обновление токена при необходимости
 * 
 * Адаптивность:
 * - Masonry-подобное отображение (break-inside: avoid-column)
 * - Обрезка и масштабирование через object-fit: contain
 * 
 * Props:
 * @param {string} source - Источник (whvn/tenor/svg)
 * @param {Object} data - Данные медиа-элемента
 * @param {number} loadDate - Timestamp загрузки (для истории)
 * 
 * Ключевые функции:
 * - handleDownloadClick: скачивание + запись в историю
 * - handleFavoritesClick: добавление/удаление из избранного
 * - handleItemClick: переход на детальную страницу
 */

import { Box, Chip, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCallback, useMemo } from "react";
import { getUrl, handleDownload } from "../util/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useFavorites } from "../pages/FavoritePage/FavoritesHooks";
import { setGlobalData } from "../util/globalSlice";
import api from "../util/axiosConfig";
import React from 'react'; //for test

const ListItem = ({ source, data, loadDate }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token } = useSelector(state => state.global)
    const { addToFavorites, removeFromFavorites } = useFavorites();

    const imageUrl = useMemo(() => getUrl(source, data, 'thumb'), [source, data]);

    const isFavorite = useMemo(() =>
        user?.favorites?.find(elem => elem.data === data && elem.source === source),
        [user, data, source]
    );

    const handleItemClick = useCallback(() => {
        navigate('/item', { state: { id: data?.id, source, item: data } });
    }, [navigate, data, source]);

    const handleDownloadClick = useCallback((e) => {
        e.stopPropagation();
        handleDownload(getUrl(source, data), source);

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
        <Box
            onClick={handleItemClick}
            sx={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                backgroundColor: 'transparent',
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
                        aria-label="Download"
                        size="small"
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
                        size="small"
                        aria-label="Favorite"
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
    );

    return (
        <Box
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