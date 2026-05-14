/**
 * Redux Slice для страницы детального просмотра
 * 
 * Состояние:
 * @property {Array|null} variants - Доступные форматы элемента
 * @property {string|null} original_url - URL оригинала на источнике
 * @property {string|null} title - Заголовок элемента
 * @property {Object|null} data - Исходные данные элемента
 * 
 * Reducers:
 * @function setData - Универсальное обновление любого поля
 *   Принимает { field, value }
 * 
 * Используется в ItemPage для хранения:
 * - Различных форматов для скачивания
 * - Ссылки на оригинал
 * - Исходных данных для избранного/истории
 */

import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
    name: 'item',
    initialState: {
        variants: null,
        original_url: null,
        title: null,
        data: null,
    },
    reducers: {
        setData: (state, action) => {
            const { field, value } = action.payload;

            state[field] = value
        },
    }
});

export const { setData } = itemSlice.actions;

export const itemReducer = itemSlice.reducer;