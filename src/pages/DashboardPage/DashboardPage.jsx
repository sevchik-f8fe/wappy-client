// import { Box, TextField, InputAdornment, Button, FormGroup, Checkbox, FormControlLabel, Typography } from "@mui/material";
// import SearchIcon from '@mui/icons-material/Search';
// import { nanoid } from "nanoid";
// import ListItem from "../../components/ListItem";
// import { useRef } from "react";
// import { useDispatch, useSelector, useStore } from "react-redux";
// import { setData, setNextPage, setPage, setQuery, setScrollField } from "./DashboardSlice";
// import { debounce } from "lodash";
// import axios from "axios";
// import { Bounce, toast } from "react-toastify";
// import { combineAndShuffleArrays } from "../../util/dashboard";
// import { setSimpleField } from "../SignUpPage/AuthSlice";
// import useInfiniteScroll from 'react-infinite-scroll-hook';

// const DashboardPage = () => {
//     const dispatch = useDispatch();
//     const { page, query, isGif, hasMore, isVideo, tenorNext, isImg, data } = useSelector((state) => state.dashboard);
//     const { loading } = useSelector(state => state.auth);
//     const store = useStore();

//     const notify = () => toast.error("Что-то пошло не так :(", {
//         position: "bottom-left",
//         autoClose: 3000,
//         hideProgressBar: true,
//         closeOnClick: false,
//         draggable: true,
//         progress: undefined,
//         theme: "dark",
//         transition: Bounce,
//     });

//     const queryRef = useRef(null);
//     const isImgRef = useRef(null);
//     const isVideoRef = useRef(null);
//     const isGifRef = useRef(null);

//     const clickHandle = debounce((data) => {
//         dispatch(setQuery({ query: data.query, isImg: data.isImg, isVideo: data.isVideo, isGif: data.isGif }));
//     }, 500);

//     const getContentWithoutQuery = async () => {
//         const tenor = isGif && await axios.post('http://127.0.0.1:3000/api/tenor/list', { next: tenorNext }, { headers: { 'Content-Type': 'application/json' } })
//             .then((res) => res?.data?.tenor)
//             .then(res => {
//                 dispatch(setNextPage({ field: 'tenorNext', next: res.next }))
//                 return res.results;
//             })
//             .catch((err) => {
//                 console.log(err)
//                 notify();
//             });

//         const photos = isImg && await axios.post('http://127.0.0.1:3000/api/photos/list', { page }, { headers: { 'Content-Type': 'application/json' } })
//             .then((res) => res?.data?.photos?.photos)
//             .catch((err) => {
//                 console.log(err)
//                 notify();
//             });

//         if (combineAndShuffleArrays(photos || [], tenor || []).length == 0) dispatch(setScrollField({ field: 'hasMore', value: false }))
//         return combineAndShuffleArrays(photos || [], tenor || []);
//     }

//     const getContentByQuery = async () => {
//         const tenor = isGif && await axios.post('http://127.0.0.1:3000/api/tenor/search', { page: page, query }, { headers: { 'Content-Type': 'application/json' } })
//             .then((res) => res?.data?.tenor)
//             .then(res => {
//                 console.log('tenor ', res)
//                 return res;
//             })
//             .catch((err) => {
//                 console.log(err)
//                 notify();
//             });

//         const photos = isImg && await axios.post('http://127.0.0.1:3000/api/photos/photosByQuery', { page, query }, { headers: { 'Content-Type': 'application/json' } })
//             .then((res) => {
//                 console.log('photos ', res?.data?.photos?.photos)
//                 return res?.data?.photos?.photos
//             })
//             .catch((err) => {
//                 console.log(err)
//                 notify();
//             });

//         const storyblock_v = isVideo && await axios.post('http://127.0.0.1:3000/api/storyblock/videosByQuery', { page, query }, { headers: { 'Content-Type': 'application/json' } })
//             .then((res) => {
//                 console.log('storyblock_v ', res?.data?.storyblock.results)
//                 return res?.data?.storyblock.results
//             })
//             .catch((err) => {
//                 console.log(err)
//                 notify();
//             });

//         console.log('acc: ', combineAndShuffleArrays(photos || [], tenor || [], storyblock_v || []))
//         if (combineAndShuffleArrays(photos || [], tenor || [], storyblock_v || []).length == 0) dispatch(setScrollField({ field: 'hasMore', value: false }))
//         return combineAndShuffleArrays(photos || [], tenor || [], storyblock_v || []);
//     }

//     const loadMore = async () => {
//         dispatch(setSimpleField({ field: 'loading', value: true }))
//         dispatch(setScrollField({ field: 'hasMore', value: true }))
//         dispatch(setPage({ page: page + 1 }))

//         if (query.length == 0) {
//             await getContentWithoutQuery()
//                 .then((res) => dispatch(setData({ data: [...store.getState().dashboard.data, ...res] })))
//                 .catch(e => console.log(e))
//                 .finally(() => dispatch(setSimpleField({ field: 'loading', value: false })))
//         } else {
//             console.log(query, 'wq page', page, tenorNext);
//             console.log('wq data: ', data)
//             await getContentByQuery()
//                 .then((res) => dispatch(setData({ data: [...store.getState().dashboard.data, ...res] })))
//                 .catch(e => console.log(e))
//                 .finally(() => dispatch(setSimpleField({ field: 'loading', value: false })))
//         }

//     };

//     const newFetch = async () => {
//         dispatch(setSimpleField({ field: 'loading', value: true }))
//         dispatch(setScrollField({ field: 'hasMore', value: true }))
//         dispatch(setPage({ page: 1 }))
//         dispatch(setNextPage({ field: 'tenorNext', value: null }));

//         if (query.length == 0) {
//             await getContentWithoutQuery()
//                 .then((res) => dispatch(setData({ data: res })))
//                 .catch(e => console.log(e))
//                 .finally(() => dispatch(setSimpleField({ field: 'loading', value: false })))
//         } else {
//             console.log(query, 'wq page', page, tenorNext);
//             console.log('wq data: ', data)
//             await getContentByQuery()
//                 .then((res) => dispatch(setData({ data: res })))
//                 .catch(e => console.log(e))
//                 .finally(() => dispatch(setSimpleField({ field: 'loading', value: false })))
//         }
//     }

//     const [sentryRef] = useInfiniteScroll({
//         loading,
//         hasNextPage: hasMore,
//         onLoadMore: loadMore,
//     });

//     return (
//         <Box sx={{ backgroundColor: '#F2EBFB30', backdropFilter: 'blur(10px)', border: '1px solid #D4BBFC', borderRadius: '1em', p: '1em', maxWidth: '80%', minWidth: '80%', m: '4em auto 2em auto' }}>
//             <Typography variant="h1" gutterBottom>поиск</Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2em' }}>

//                 <TextField
//                     InputProps={{
//                         style: {
//                             color: '#F2EBFB',
//                         },
//                     }}
//                     size="small"
//                     inputRef={queryRef}
//                     type={'text'}
//                     variant="outlined"
//                     placeholder={'используйте английский язык'}
//                     color='primary'
//                     sx={{ minWidth: '50%' }}
//                     slotProps={{
//                         input: {
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <SearchIcon sx={{ color: '#F2EBFB' }} />
//                                 </InputAdornment>
//                             ),
//                         },
//                     }}
//                 />
//                 <Button
//                     loading={loading}
//                     onClick={() => {
//                         clickHandle({
//                             query: queryRef.current.value.replace(/[^a-zA-Z ]/g, ""),
//                             isImg: isImgRef.current.checked,
//                             isVideo: isVideoRef.current.checked,
//                             isGif: isGifRef.current.checked,
//                         })

//                         newFetch()
//                     }

//                     }
//                     variant="contained"
//                 >
//                     поиск
//                 </Button>

//                 <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
//                     <FormControlLabel
//                         control={<Checkbox
//                             slotProps={{
//                                 input: {
//                                     ref: isImgRef,
//                                 },
//                             }}
//                             defaultChecked
//                         />}
//                         label="картинки"
//                     />
//                     <FormControlLabel
//                         control={<Checkbox
//                             slotProps={{
//                                 input: {
//                                     ref: isVideoRef,
//                                 },
//                             }}
//                             defaultChecked
//                         />}
//                         label="видео"
//                     />
//                     <FormControlLabel
//                         control={<Checkbox
//                             slotProps={{
//                                 input: {
//                                     ref: isGifRef,
//                                 },
//                             }}
//                             defaultChecked
//                         />}
//                         label="гифки"
//                     />
//                 </FormGroup>
//             </Box>


//             <Box sx={{
//                 columnCount: { xs: 1, sm: 2, md: 3, lg: 4 },
//                 columnGap: '1em',
//                 mt: '2em'
//             }}>
//                 {data.map((elem) => <ListItem source={elem.source} data={elem.data} key={nanoid()} />)}

//                 <div ref={sentryRef} />
//             </Box>
//         </Box >
//     );
// }

// export default DashboardPage;

import { Box, TextField, InputAdornment, Button, FormGroup, Checkbox, FormControlLabel, Typography } from "@mui/material";
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

const DashboardPage = () => {
    const dispatch = useDispatch();
    const { page, query, hasMore, tenorNext, data } = useSelector((state) => state.dashboard);
    const { loading } = useSelector(state => state.auth);

    // Мемоизированные refs
    const queryRef = useRef(null);
    const isImgRef = useRef(null);
    const isVideoRef = useRef(null);
    const isGifRef = useRef(null);
    const lastSearchTimeRef = useRef(0);

    // Получение актуальных значений фильтров из refs
    const getCurrentFilters = useCallback(() => ({
        isImg: isImgRef.current?.checked ?? true,
        isVideo: isVideoRef.current?.checked ?? true,
        isGif: isGifRef.current?.checked ?? true
    }), []);

    // Мемоизированное уведомление
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

    // Мемоизированные функции для получения контента с актуальными фильтрами
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

    // Оптимизированная функция загрузки с троттлингом
    const loadMore = useCallback(throttle(async () => {
        const now = Date.now();
        if (now - lastSearchTimeRef.current < 500) return;
        lastSearchTimeRef.current = now;

        dispatch(setSimpleField({ field: 'loading', value: true }));
        dispatch(setScrollField({ field: 'hasMore', value: true }));
        dispatch(setPage({ page: page + 1 }));

        const currentFilters = getCurrentFilters();

        try {
            const newData = query.length === 0
                ? await getContentWithoutQuery(currentFilters)
                : await getContentByQuery(currentFilters, query);

            dispatch(setData({ data: [...data, ...newData] }));
        } catch (error) {
            console.error('Load more error:', error);
        } finally {
            dispatch(setSimpleField({ field: 'loading', value: false }));
        }
    }, 500, { leading: true, trailing: false }), [page, query, data, getContentWithoutQuery, getContentByQuery, dispatch, getCurrentFilters]);

    // Оптимизированная функция нового поиска с дебаунсингом
    const newFetch = useCallback(debounce(async () => {
        const now = Date.now();
        if (now - lastSearchTimeRef.current < 500) return;
        lastSearchTimeRef.current = now;

        dispatch(setSimpleField({ field: 'loading', value: true }));
        dispatch(setScrollField({ field: 'hasMore', value: true }));
        dispatch(setPage({ page: 1 }));
        dispatch(setNextPage({ field: 'tenorNext', value: null }));

        const searchQuery = queryRef.current?.value?.replace(/[^a-zA-Z ]/g, "") || "";
        const currentFilters = getCurrentFilters();

        dispatch(setQuery({
            query: searchQuery,
            isImg: currentFilters.isImg,
            isVideo: currentFilters.isVideo,
            isGif: currentFilters.isGif
        }));

        try {
            const newData = searchQuery.length === 0
                ? await getContentWithoutQuery(currentFilters)
                : await getContentByQuery(currentFilters, searchQuery);

            dispatch(setData({ data: newData }));
        } catch (error) {
            console.error('New fetch error:', error);
        } finally {
            dispatch(setSimpleField({ field: 'loading', value: false }));
        }
    }, 500), [getContentWithoutQuery, getContentByQuery, dispatch, getCurrentFilters]);

    // Обработчик клика с немедленным вызовом
    const handleSearchClick = useCallback(() => {
        newFetch();
    }, [newFetch]);

    // Мемоизированный список элементов
    const memoizedListItems = useMemo(() =>
        data.map((elem) =>
            <ListItem source={elem.source} data={elem.data} key={nanoid()} />
        ), [data]
    );

    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage: hasMore,
        onLoadMore: loadMore,
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
                    InputProps={{
                        style: { color: '#F2EBFB' },
                    }}
                    size="small"
                    inputRef={queryRef}
                    type="text"
                    variant="outlined"
                    placeholder="используйте английский язык"
                    color="primary"
                    sx={{ minWidth: '50%' }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#F2EBFB' }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                    onKeyPress={(e) => {
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

            <Box sx={{
                columnCount: { xs: 1, sm: 2, md: 3, lg: 4 },
                columnGap: '1em',
                mt: '2em'
            }}>
                {memoizedListItems}
                <div ref={sentryRef} />
            </Box>
        </Box>
    );
}

export default DashboardPage;