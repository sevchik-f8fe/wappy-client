/**
 * Redux Slice для глобального состояния приложения
 * 
 * Состояние:
 * - user: объект текущего пользователя (null по умолчанию)
 * - token: JWT токен аутентификации (null по умолчанию)
 * - dialog: состояние диалогового окна (boolean)
 * 
 * Reducers:
 * - setGlobalData: Универсальный reducer для обновления любого поля в состоянии
 *   Принимает { field, value } и обновляет state[field] = value
 * 
 * Экспорт: actions (setGlobalData) и reducer (globalReducer)
 */

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