import { Box, TextField, InputAdornment, Button, FormGroup, Checkbox, FormControlLabel, Typography, Skeleton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { nanoid } from "nanoid";
import ListItem from "../../components/ListItem";
import { useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setData, setNextPage, setPage, setQuery, setScrollField } from "./DashboardSlice";
import { debounce, throttle } from "lodash";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { combineAndShuffleArrays } from "../../util/dashboard";
import { setSimpleField } from "../SignUpPage/AuthSlice";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import Masonry from 'react-masonry-css'

const DashboardPage = () => {
    const dispatch = useDispatch();
    const { page, query, hasMore, tenorNext, data } = useSelector((state) => state.dashboard);
    const { loading } = useSelector(state => state.auth);

    const queryRef = useRef(null);
    const isImgRef = useRef(null);
    const isVideoRef = useRef(null);
    const isGifRef = useRef(null);
    const lastSearchTimeRef = useRef(0);

    const getCurrentFilters = useCallback(() => ({
        isImg: isImgRef.current?.checked ?? true,
        isVideo: isVideoRef.current?.checked ?? true,
        isGif: isGifRef.current?.checked ?? true
    }), []);

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

    const getContentWithoutQuery = useCallback(async (filters) => {
        const { isImg, isGif } = filters;

        const [tenor, photos] = await Promise.allSettled([
            isGif ? axios.post('http://127.0.0.1:3000/api/tenor/list',
                { next: tenorNext },
                { headers: { 'Content-Type': 'application/json' } }
            ).then(res => res?.data?.tenor).then(res => {
                dispatch(setNextPage({ field: 'tenorNext', next: res.next }));
                return res.results;
            }).catch((err) => {
                console.log(err);
                notify();
                return [];
            }) : Promise.resolve([]),

            isImg ? axios.post('http://127.0.0.1:3000/api/photos/list',
                { page },
                { headers: { 'Content-Type': 'application/json' } }
            ).then(res => res?.data?.photos?.photos).catch((err) => {
                console.log(err);
                notify();
                return [];
            }) : Promise.resolve([])
        ]);

        const tenorResults = tenor.status === 'fulfilled' ? tenor.value : [];
        const photosResults = photos.status === 'fulfilled' ? photos.value : [];
        const combinedData = combineAndShuffleArrays(photosResults, tenorResults);

        if (combinedData.length === 0) {
            dispatch(setScrollField({ field: 'hasMore', value: false }));
        }

        return combinedData;
    }, [tenorNext, page, dispatch, notify]);

    const getContentByQuery = useCallback(async (filters, searchQuery) => {
        const { isImg, isGif, isVideo } = filters;

        const [tenor, photos, storyblock_v] = await Promise.allSettled([
            isGif ? axios.post('http://127.0.0.1:3000/api/tenor/search',
                { page, query: searchQuery },
                { headers: { 'Content-Type': 'application/json' } }
            ).then(res => res?.data?.tenor).catch((err) => {
                console.log(err);
                notify();
                return [];
            }) : Promise.resolve([]),

            isImg ? axios.post('http://127.0.0.1:3000/api/photos/photosByQuery',
                { page, query: searchQuery },
                { headers: { 'Content-Type': 'application/json' } }
            ).then(res => res?.data?.photos?.photos).catch((err) => {
                console.log(err);
                notify();
                return [];
            }) : Promise.resolve([]),

            isVideo ? axios.post('http://127.0.0.1:3000/api/storyblock/videosByQuery',
                { page, query: searchQuery },
                { headers: { 'Content-Type': 'application/json' } }
            ).then(res => res?.data?.storyblock?.results).catch((err) => {
                console.log(err);
                notify();
                return [];
            }) : Promise.resolve([])
        ]);

        const tenorResults = tenor.status === 'fulfilled' ? tenor.value : [];
        const photosResults = photos.status === 'fulfilled' ? photos.value : [];
        const storyblockResults = storyblock_v.status === 'fulfilled' ? storyblock_v.value : [];
        const combinedData = combineAndShuffleArrays(photosResults, tenorResults, storyblockResults);

        if (combinedData.length === 0) {
            dispatch(setScrollField({ field: 'hasMore', value: false }));
        }

        return combinedData;
    }, [page, dispatch, notify]);

    const unThrottledLoadMore = useCallback(async () => {
        const now = Date.now();
        if (now - lastSearchTimeRef.current < 500) return;
        lastSearchTimeRef.current = now;

        dispatch(setSimpleField({ field: 'loading', value: true }));
        dispatch(setScrollField({ field: 'hasMore', value: true }));
        dispatch(setPage({ page: page + 1 }));

        const currentFilters = getCurrentFilters();

        try {
            const newData =
                query.length === 0
                    ? await getContentWithoutQuery(currentFilters)
                    : await getContentByQuery(currentFilters, query);

            dispatch(setData({ data: [...data, ...newData] }));
        } catch (error) {
            console.error('Load more error:', error);
        } finally {
            dispatch(setSimpleField({ field: 'loading', value: false }));
        }
    }, [page, query, data, getContentWithoutQuery, getContentByQuery, dispatch, getCurrentFilters]);

    const loadMore = throttle(unThrottledLoadMore, 500, { leading: true, trailing: false });

    const unDebouncedNewFetch = useCallback(async () => {
        const now = Date.now();
        if (now - lastSearchTimeRef.current < 500) return;
        lastSearchTimeRef.current = now;

        dispatch(setSimpleField({ field: 'loading', value: true }));
        dispatch(setScrollField({ field: 'hasMore', value: true }));
        dispatch(setPage({ page: 1 }));
        dispatch(setNextPage({ field: 'tenorNext', value: null }));

        const searchQuery = queryRef.current?.value?.replace(/[^a-zA-Z ]/g, "") || "";
        const currentFilters = getCurrentFilters();

        dispatch(
            setQuery({
                query: searchQuery,
                isImg: currentFilters.isImg,
                isVideo: currentFilters.isVideo,
                isGif: currentFilters.isGif,
            })
        );

        try {
            const newData =
                searchQuery.length === 0
                    ? await getContentWithoutQuery(currentFilters)
                    : await getContentByQuery(currentFilters, searchQuery);

            dispatch(setData({ data: newData }));
        } catch (error) {
            console.error('New fetch error:', error);
        } finally {
            dispatch(setSimpleField({ field: 'loading', value: false }));
        }
    }, [getContentWithoutQuery, getContentByQuery, dispatch, getCurrentFilters]);

    const newFetch = debounce(unDebouncedNewFetch, 500);

    const handleSearchClick = useCallback(() => {
        newFetch();
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
            <ListItem source={elem.source} data={elem.data} key={nanoid()} />
        ), [data]
    );

    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage: hasMore,
        onLoadMore: loadMore,
        rootMargin: '0px 0px 2000px 0px',
    });

    return (
        <Box sx={{
            backgroundColor: '#F2EBFB30',
            backdropFilter: 'blur(10px)',
            border: '1px solid #D4BBFC',
            borderRadius: '1em',
            p: '1em',
            maxWidth: '80%',
            minWidth: '80%',
            m: '4em auto 2em auto'
        }}>
            <Typography variant="h1" gutterBottom>поиск</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2em' }}>
                <TextField
                    size="small"
                    inputRef={queryRef}
                    type="text"
                    variant="outlined"
                    placeholder="используйте английский язык"
                    color="primary"
                    sx={{ minWidth: '50%' }}
                    slotProps={{
                        input: {
                            style: { color: '#F2EBFB' },
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#F2EBFB' }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearchClick();
                        }
                    }}
                />

                <Button
                    loading={loading}
                    onClick={handleSearchClick}
                    variant="contained"
                >
                    поиск
                </Button>

                <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                slotProps={{ input: { ref: isImgRef } }}
                                defaultChecked
                            />
                        }
                        label="картинки"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                slotProps={{ input: { ref: isVideoRef } }}
                                defaultChecked
                            />
                        }
                        label="видео"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                slotProps={{ input: { ref: isGifRef } }}
                                defaultChecked
                            />
                        }
                        label="гифки"
                    />
                </FormGroup>
            </Box>

            <Masonry
                breakpointCols={{
                    default: 4,
                    1100: 3,
                    700: 2,
                    500: 1
                }}
                className="masonry-grid"
                columnClassName="masonry-grid_column"
            >
                {memoizedListItems}
                {(loading || hasMore) && memoizedSkeletons}
                <div ref={sentryRef} />
            </Masonry>
        </Box>
    );
}

export default DashboardPage;