/**
 * Redux Slice для управления состоянием смены email
 * 
 * Состояние:
 * @property {Object} email - { value: string, error: boolean }
 * @property {string} code - 6-значный код подтверждения
 * @property {number} timer - Таймер обратного отсчета (сек)
 * @property {number} step - Текущий шаг (0 или 1)
 * 
 * Reducers:
 * @function setAuthField - Обновление email поля (только value)
 * @function setAuthError - Обновление статуса ошибки email
 * @function setSimpleField - Универсальное обновление простых полей
 * 
 * Проверка полей:
 * - hasOwnProperty перед обновлением (безопасность)
 * 
 * Используется в ChangeEmailPage компоненте
 */

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
            if (state.hasOwnProperty(field)) state[field].value = value;
        },
        setAuthError: (state, action) => {
            const { field, error } = action.payload;
            if (state.hasOwnProperty(field)) state[field].error = error;
        },
        setSimpleField: (state, action) => {
            const { field, value } = action.payload;
            if (state.hasOwnProperty(field)) state[field] = value;
        },
    }
});

export const { setAuthField, setAuthError, setSimpleField } = chnageEmailSlice.actions;

export const chnageEmailReducer = chnageEmailSlice.reducer;