import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ItemPage from '../../../pages/ItemPage/ItemPage';
import { itemReducer } from '../../../pages/ItemPage/ItemSlice';
import React from 'react'; //for test

// Минимальные моки
jest.mock('react-toastify', () => ({
    toast: { error: jest.fn() }
}));

jest.mock('@mui/material', () => ({
    Box: ({ children }) => <div>{children}</div>,
    Button: ({ children }) => <button>{children}</button>,
}));

jest.mock('@mui/icons-material/Download', () => () => 'DownloadIcon');
jest.mock('@mui/icons-material/FavoriteBorder', () => () => 'FavoriteBorderIcon');
jest.mock('@mui/icons-material/Favorite', () => () => 'FavoriteIcon');

jest.mock('../../../pages/ItemPage/itemHooks', () => ({
    useTenor: () => ({ getTenorVariants: jest.fn() }),
    usePhoto: () => ({ getPhotoVariants: jest.fn() }),
    useSVG: () => ({ getSVGVariants: jest.fn() }),
}));

jest.mock('../../../pages/FavoritePage/FavoritesHooks', () => ({
    useFavorites: () => ({
        addToFavorites: jest.fn(),
        removeFromFavorites: jest.fn(),
    }),
}));

jest.mock('../../../util/dashboard', () => ({
    handleDownload: jest.fn(),
}));

jest.mock('../../../util/axiosConfig', () => ({
    default: {
        post: jest.fn(() => Promise.resolve({ data: {} }))
    },
}));

jest.mock('../../../util/globalSlice', () => ({
    setGlobalData: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        state: { source: 'whvn', item: { short_url: 'http://test.com' } }
    }),
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => jest.fn(),
    useSelector: jest.fn(),
}));

const { useSelector } = require('react-redux');

describe('ItemPage', () => {
    const defaultState = {
        item: {
            variants: [
                { url: 'http://test.com/image1.jpg', format: 'JPEG', width: 800, height: 600, size: 102400 },
            ],
            original_url: 'http://test.com/original',
            title: 'Test Item',
            data: { id: 'test-id' },
        },
        global: {
            user: {
                favorites: [],
                historyLoad: null,
            },
            token: 'test-token',
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useSelector.mockImplementation(callback => callback(defaultState));
    });

    it('рендерит компонент без ошибок', () => {
        const store = configureStore({
            reducer: {
                item: itemReducer,
                global: () => defaultState.global
            }
        });

        expect(() => {
            render(
                <Provider store={store}>
                    <BrowserRouter>
                        <ItemPage />
                    </BrowserRouter>
                </Provider>
            );
        }).not.toThrow();
    });

    it('отображает изображение', () => {
        const store = configureStore({
            reducer: {
                item: itemReducer,
                global: () => defaultState.global
            }
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <ItemPage />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByAltText('Test Item')).toBeInTheDocument();
    });

    it('отображает кнопку "оригинал"', () => {
        const store = configureStore({
            reducer: {
                item: itemReducer,
                global: () => defaultState.global
            }
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <ItemPage />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText('оригинал')).toBeInTheDocument();
    });

    it('отображает кнопку загрузки', () => {
        const store = configureStore({
            reducer: {
                item: itemReducer,
                global: () => defaultState.global
            }
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <ItemPage />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText(/JPEG/)).toBeInTheDocument();
    });
});