import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
    name: 'item',
    initialState: {
        variants: null,
        original_url: null,
        title: null,
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