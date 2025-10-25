import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        email: { value: '', error: false },
        password: { value: '', error: false },
        passwordRep: { value: '', error: false },

        code: '',
        timer: 120,

        step: 0,

        confOk: false,
        persOk: false,

        loading: false,
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
        }
    }
});

export const { setAuthField, setAuthError, setSimpleField } = authSlice.actions;

export const authReducer = authSlice.reducer;