import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
    name: 'item',
    initialState: {
        variants: null,
        currentVariant: null,
        source_url: null,
        original_url: null,
        title: null,
        loading: false,
    },
    reducers: {
        setData: (state, action) => {
            console.log(action.payload)
            const { field, value } = action.payload;

            state[field] = value
        },
    }
});

export const { setData } = itemSlice.actions;

export const itemReducer = itemSlice.reducer;