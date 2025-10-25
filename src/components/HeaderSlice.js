import { createSlice } from "@reduxjs/toolkit";

const headerSlice = createSlice({
    name: 'header',
    initialState: {
        delDialog: false,
        outDialog: false
    },
    reducers: {
        setHeaderData: (state, action) => {
            const { data, field } = action.payload;

            state[field] = data;
        },
    }
});

export const { setHeaderData } = headerSlice.actions;

export const headerReducer = headerSlice.reducer;