import { createSlice } from "@reduxjs/toolkit";

const chnageEmailSlice = createSlice({
    name: 'chnageEmail',
    initialState: {
        email: { value: '', error: false },

        code: '',
        timer: 120,

        step: 0,
    },
    reducers: {
        setAuthField: (state, action) => {
            const { field, value } = action.payload;
            state[field].value = value;
        },
        setAuthError: (state, action) => {
            const { field, error } = action.payload;
            state[field].error = error;
        },
        setSimpleField: (state, action) => {
            const { field, value } = action.payload;
            state[field] = value;
        },
    }
});

export const { setAuthField, setAuthError, setSimpleField } = chnageEmailSlice.actions;

export const chnageEmailReducer = chnageEmailSlice.reducer;