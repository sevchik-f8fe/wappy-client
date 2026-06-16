/**
 * Главная страница с поиском медиа-контента
 * 
 * Функциональность:
 * - Поиск по трем источникам: Tenor (гифки), WHVN (фото), SVG
 * - Бесконечная прокрутка (infinite scroll)
 * - Фильтры по типам контента (картинки, SVG, гифки)
 * - Masonry сетка для отображения результатов
 * - Дебаунс поиска (500ms) и троттлинг загрузки
 * 
 * Оптимизация:
 * - useMemo для скелетонов и списка элементов
 * - useCallback для обработчиков
 * - debounce/throttle из lodash
 * - React.memo (неявно через useMemo)
 * 
 * Адаптивность:
 * - DesktopMenu и TabletMenu компоненты
 * - breakpoint 'md' переключает версии
 * - Masonry адаптивные колонки (4,3,2,1)
 * 
 * API эндпоинты:
 * - /api/tenor/list - получение гифок
 * - /api/photos/list - получение фото
 * - /api/tenor/search - поиск гифок
 * - /api/photos/search - поиск фото
 * - /api/svg/search - поиск SVG
 * 
 * Пагинация:
 * - Для Tenor используется next токен
 * - Для WHVN и SVG используется номер страницы
 */

import { Box, Skeleton } from "@mui/material";
import { nanoid } from "nanoid";
import ListItem from "../../components/ListItem";
import { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setData, setNextPage, setPage, setScrollField } from "./DashboardSlice";
import { debounce, throttle } from "lodash";
import { Bounce, toast } from "react-toastify";
import { combineAndShuffleArrays } from "../../util/dashboard";
import { setSimpleField } from "../SignUpPage/AuthSlice";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import Masonry from 'react-masonry-css'
import api from "../../util/axiosConfig";
import React from 'react'; //for test
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DesctopMenu from "./Menu/DesctopMenu";
import TabletMenu from "./Menu/TabletMenu";

const DashboardPage = () => {
    const dispatch = useDispatch();
    const { page, query, hasMore, tenorNext, data } = useSelector((state) => state.dashboard);
    const { loading } = useSelector(state => state.auth);
    const [localState, setLocalState] = useState({ isGif: true, isSVG: true, isImg: true, query: '' });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

    const getContentWithoutQuery = useCallback(async (searchState) => {
        const [tenor, photos] = await Promise.allSettled([
            searchState.isGif ? api.post('/api/tenor/list',
                { next: tenorNext },
                { headers: { 'Content-Type': 'application/json' } }
            ).then(res => res?.data?.tenor).then(res => {
                dispatch(setNextPage({ field: 'tenorNext', next: res.next }));
                return res.results;
            }).catch((e) => {
                console.log(e)
                notify();
                return [];
            }) : Promise.resolve([]),

            searchState.isImg ? api.post('/api/photos/list',
                { page },
                { headers: { 'Content-Type': 'application/json' } }
            ).then(res => res?.data?.photo).catch((err) => {
                console.log(err)
                notify();
                return [];
            }).catch((e) => {
                console.log(e)
                notify();
                return [];
            }) : Promise.resolve([]),
        ]);

        const tenorResults = tenor.status === 'fulfilled' ? tenor.value : [];
        const photosResults = photos.status === 'fulfilled' ? photos.value : [];
        const combinedData = combineAndShuffleArrays(photosResults, tenorResults);

        if (combinedData.length === 0) {
            dispatch(setScrollField({ field: 'hasMore', value: false }));
        }

        return combinedData;
    }, [tenorNext, page, dispatch, notify]);

    const getContentByQuery = useCallback(async (searchState, existingData = []) => {
        const hasSVGInData = existingData.some(item => item.source === 'svg');

        const shouldFetchSVG = searchState.isSVG && !hasSVGInData;

        const [tenor, photos, svg] = await Promise.allSettled([
            searchState.isGif ? api.post('/api/tenor/search',
                { page, query: searchState.query },
                { headers: { 'Content-Type': 'application/json' } }
            ).then(res => res?.data?.tenor).catch((err) => {
                console.log(err)
                notify();
                return [];
            }) : Promise.resolve([]),

            searchState.isImg ? api.post('/api/photos/search',
                { page, query: searchState.query },
                { headers: { 'Content-Type': 'application/json' } }
            ).then(res => {
                return res?.data?.photo
            }).catch((err) => {
                console.log(err)
                notify();
                return [];
            }) : Promise.resolve([]),

            shouldFetchSVG ? api.post('/api/svg/search',
                { page, query: searchState.query },
                { headers: { 'Content-Type': 'application/json' } }
            ).then(res => res?.data?.svg).catch((err) => {
                console.log(err)
                notify();
                return [];
            }) : Promise.resolve([])
        ]);

        const tenorResults = tenor.status === 'fulfilled' ? tenor.value : [];
        const photosResults = photos.status === 'fulfilled' ? photos.value : [];
        const SVGResults = svg.status === 'fulfilled' ? svg.value : [];
        const combinedData = combineAndShuffleArrays(photosResults, tenorResults, SVGResults);

        if (combinedData.length === 0) {
            dispatch(setScrollField({ field: 'hasMore', value: false }));
        }

        return combinedData;
    }, [page, dispatch, notify]);

    const unThrottledLoadMore = useCallback(async (searchState) => {
        dispatch(setSimpleField({ field: 'loading', value: true }));
        dispatch(setScrollField({ field: 'hasMore', value: true }));
        dispatch(setPage({ page: page + 1 }));

        try {

            const newData =
                searchState.query.length <= 0
                    ? await getContentWithoutQuery(searchState)
                    : await getContentByQuery(searchState, data);

            dispatch(setData({ data: [...data, ...newData] }));
        } catch (error) {
            console.log(error)
            notify();
        } finally {
            dispatch(setSimpleField({ field: 'loading', value: false }));
        }
    }, [page, query, data, getContentWithoutQuery, getContentByQuery, dispatch]);

    const loadMore = throttle(unThrottledLoadMore, 500, { leading: true, trailing: false });

    const unDebouncedNewFetch = useCallback(async (searchState) => {
        dispatch(setSimpleField({ field: 'loading', value: true }));
        dispatch(setScrollField({ field: 'hasMore', value: true }));
        dispatch(setPage({ page: 1 }));
        dispatch(setNextPage({ field: 'tenorNext', value: null }));

        try {
            const newData =
                searchState.query.length === 0
                    ? await getContentWithoutQuery(searchState)
                    : await getContentByQuery(searchState, data);

            dispatch(setData({ data: newData }));
        } catch (error) {
            console.log(error)
            notify();
        } finally {
            dispatch(setSimpleField({ field: 'loading', value: false }));
        }
    }, [getContentWithoutQuery, getContentByQuery, dispatch, data]);

    const newFetch = debounce(unDebouncedNewFetch, 500);

    const handleSearchClick = useCallback((state) => {
        setLocalState(state);
        setTimeout(() => {
            newFetch(state);
        }, 0);
    }, [newFetch]);

    const memoizedSkeletons = useMemo(() =>
        Array.from({ length: 4 }, () => {
            const height = Math.floor(Math.random() * (500 - 200 + 1)) + 200;

            return (
                <Skeleton
                    key={nanoid()}
                    variant="rounded"
                    animation="wave"
                    sx={{
                        width: '100%',
                        height: height - height % 10,
                        borderRadius: '1em',
                        breakInside: 'avoid-column',
                        mb: '1em',
                        overflow: 'hidden'
                    }}
                />
            );
        }), []
    );

    const memoizedListItems = useMemo(() =>
        data.map((elem) =>
            <ListItem source={elem.source} data={elem.data} key={`${elem.source}:${elem.data.id}`} />
        ), [data]
    );

    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage: hasMore,
        onLoadMore: () => loadMore(localState),
        rootMargin: '0px 0px 1000px 0px',
    });

    return (
        <Box sx={{
            backgroundColor: '#2a262eb0',
            backdropFilter: 'blur(10px)',
            border: '1px solid #D4BBFC',
            borderRadius: '1em',
            p: '1em',
            maxWidth: !isMobile ? '80%' : '100%',
            minWidth: !isMobile ? '80%' : '100%',
            m: '4em auto 2em auto'
        }}>
            {isMobile ? (<TabletMenu handleSearchClick={handleSearchClick} />) : (<DesctopMenu handleSearchClick={handleSearchClick} />)}

            <Masonry
                breakpointCols={{
                    default: 4,
                    1100: 3,
                    700: 2,
                    500: 1
                }}
                className="masonry-grid"
                columnClassName="masonry-grid_column"
                style={{ minHeight: '1500px' }}
            >
                {memoizedListItems}
                {(loading && hasMore) && memoizedSkeletons}
                <div ref={sentryRef} />
            </Masonry>
        </Box>
    );
}

export default DashboardPage;