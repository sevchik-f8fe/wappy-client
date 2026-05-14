/**
 * Redux Slice для управления дашбордом
 * 
 * Состояние:
 * @property {Array} data - Массив элементов для отображения
 * @property {boolean} isImg/isSVG/isGif - Фильтры типов контента
 * @property {string|null} tenorNext - Токен для пагинации Tenor
 * @property {string} query - Поисковый запрос
 * @property {number} page - Номер страницы (WHVN/SVG)
 * @property {boolean} hasMore - Флаг наличия следующих страниц
 * 
 * Reducers:
 * @function setQuery - Установка запроса и сброс страницы на 1
 * @function setPage - Обновление номера страницы
 * @function setNextPage - Обновление токена пагинации Tenor
 * @function setData - Установка данных с дедупликацией по id+source
 * @function setScrollField - Универсальное обновление полей (hasMore)
 * 
 * Дедупликация:
 * - Использует Map с ключом `${data?.id}:${source}`
 * - Предотвращает дублирование элементов из разных источников
 */

import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        data: [],
        isImg: true,
        isSVG: true,
        isGif: true,
        tenorNext: null,
        query: '',
        page: 1,
        loading: false,
        hasMore: true,
    },
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload.query;
            state.isImg = action.payload.isImg;
            state.isSVG = action.payload.isSVG;
            state.isGif = action.payload.isGif;
            state.page = 1;
        },
        setPage: (state, action) => {
            const { page } = action.payload;

            state.page = page
        },
        setNextPage: (state, action) => {
            const { field, next } = action.payload;

            state[field] = next
        },
        setData: (state, action) => {
            const { data } = action.payload;
            const uniqueData = Array.from(
                new Map(data.map(elem => [`${elem?.data?.id}:${elem?.source}`, elem])).values()
            );

            state.data = uniqueData;
        },
        setScrollField: (state, action) => {
            const { field, value } = action.payload;

            state[field] = value
        },
    }
});

export const { setQuery, setPage, setData, setNextPage, setScrollField } = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;