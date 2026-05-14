/**
 * Redux Slice для аутентификации (регистрация/вход)
 * 
 * Состояние:
 * @property {Object} email - { value: string, error: boolean }
 * @property {Object} password - { value: string, error: boolean }
 * @property {Object} passwordRep - { value: string, error: boolean }
 * @property {string} code - 6-значный код подтверждения
 * @property {number} timer - Таймер обратного отсчета (сек)
 * @property {number} step - Текущий шаг (0 или 1)
 * @property {boolean} confOk - Согласие с политикой конфиденциальности
 * @property {boolean} persOk - Согласие на обработку персональных данных
 * @property {boolean} loading - Флаг загрузки
 * 
 * Reducers:
 * @function setAuthField - Обновление полей с value (email, password, passwordRep)
 * @function setAuthError - Обновление ошибок полей
 * @function setSimpleField - Обновление простых полей (code, timer, step, loading)
 * 
 * Проверка hasOwnProperty перед обновлением для безопасности
 * Используется в SignUpPage и SignInPage
 */

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
            if (state.hasOwnProperty(field)) state[field].value = value;
        },
        setAuthError: (state, action) => {
            const { field, error } = action.payload;
            if (state.hasOwnProperty(field)) state[field].error = error;
        },
        setSimpleField: (state, action) => {
            const { field, value } = action.payload;
            if (state.hasOwnProperty(field)) state[field] = value;
        }
    }
});

export const { setAuthField, setAuthError, setSimpleField } = authSlice.actions;

export const authReducer = authSlice.reducer;