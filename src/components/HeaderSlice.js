/**
 * Redux Slice для управления состоянием шапки
 * 
 * Состояние:
 * @property {boolean} delDialog - Видимость диалога удаления аккаунта
 * @property {boolean} outDialog - Видимость диалога выхода из аккаунта
 * 
 * Reducers:
 * @function setHeaderData - Универсальный обновлятор полей
 *   @param {string} field - Имя поля для обновления
 *   @param {any} data - Новое значение
 * 
 * Особенности:
 * - Проверка существования поля через hasOwnProperty
 * - Безопасное обновление (игнорирует несуществующие поля)
 * 
 * Используется в компоненте Header для управления диалогами подтверждения
 */

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

            if (state.hasOwnProperty(field)) state[field] = data;
        },
    }
});

export const { setHeaderData } = headerSlice.actions;

export const headerReducer = headerSlice.reducer;