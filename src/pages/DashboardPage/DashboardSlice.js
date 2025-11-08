import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        data: [],
        isImg: true,
        isSVG: true,
        isGif: true,
        tenorNext: null,
        query: '',
        page: 1,
        loading: false,
        hasMore: true,
    },
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload.query;
            state.isImg = action.payload.isImg;
            state.isSVG = action.payload.isSVG;
            state.isGif = action.payload.isGif;
        },
        setPage: (state, action) => {
            const { page } = action.payload;

            state.page = page
        },
        setNextPage: (state, action) => {
            const { field, next } = action.payload;

            state[field] = next
        },
        setData: (state, action) => {
            const { data } = action.payload;
            const uniqueData = Array.from(
                new Map(data.map(elem => [`${elem?.data?.id}:${elem?.source}`, elem])).values()
            );

            state.data = uniqueData;
        },
        setScrollField: (state, action) => {
            const { field, value } = action.payload;

            state[field] = value
        },
    }
});

export const { setQuery, setPage, setData, setNextPage, setScrollField } = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;