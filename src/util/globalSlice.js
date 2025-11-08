import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
    name: 'global',
    initialState: {
        user: null,
        token: null,
        dialog: false,
    },
    reducers: {
        setGlobalData: (state, action) => {
            const { field, value } = action.payload;
            state[field] = value;
        },
    }
});

export const { setGlobalData } = globalSlice.actions;

export const globalReducer = globalSlice.reducer;