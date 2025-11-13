import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import ListItem from '../../../components/ListItem';

jest.mock('../../../util/dashboard', () => ({
    getUrl: jest.fn(() => 'https://example.com/test.jpg'),
    handleDownload: jest.fn()
}));

const mockAddToFavorites = jest.fn();
const mockRemoveFromFavorites = jest.fn();

jest.mock('../../../pages/FavoritePage/FavoritesHooks', () => ({
    useFavorites: () => ({
        addToFavorites: mockAddToFavorites,
        removeFromFavorites: mockRemoveFromFavorites
    })
}));

jest.mock('../../../util/axiosConfig', () => ({
    post: jest.fn(() => Promise.resolve({ data: {} }))
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const createMockStore = (initialState) =>
    configureStore({
        reducer: {
            global: (state = initialState.global) => state
        },
        preloadedState: initialState
    });

const renderWithProviders = (component, initialState) => {
    const store = createMockStore(initialState);
    return render(
        <Provider store={store}>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </Provider>
    );
};

describe('ListItem', () => {
    const mockItemData = {
        source: 'tenor',
        data: {
            id: '123',
            title: 'Test GIF',
            url: 'https://example.com/test.gif'
        },
        loadDate: Date.now()
    };

    const mockInitialState = {
        global: {
            user: {
                email: 'test@example.com',
                favorites: [],
                historyLoad: [],
                refreshToken: 'refresh-token'
            },
            token: 'test-token'
        }
    };

    beforeEach(() => {
        mockNavigate.mockClear();
        jest.clearAllMocks();
        mockAddToFavorites.mockClear();
        mockRemoveFromFavorites.mockClear();
    });

    test('renders list item with image', () => {
        renderWithProviders(<ListItem {...mockItemData} />, mockInitialState);

        const image = screen.getByAltText('Test GIF');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/test.jpg');
    });

    test('shows hover overlay on mouse enter', () => {
        renderWithProviders(<ListItem {...mockItemData} />, mockInitialState);

        const container = screen.getByAltText('Test GIF').closest('div');
        fireEvent.mouseEnter(container);

        expect(screen.getByText('TENOR')).toBeInTheDocument();
    });

    test('navigates to item page on click', () => {
        renderWithProviders(<ListItem {...mockItemData} />, mockInitialState);

        const container = screen.getByAltText('Test GIF').closest('div');
        fireEvent.mouseEnter(container);

        const overlay = screen.getByRole('button', { name: /download/i }).closest('.MuiBox-root');
        fireEvent.click(overlay);

        expect(mockNavigate).toHaveBeenCalledWith('/item', {
            state: {
                id: '123',
                source: 'tenor',
                item: mockItemData.data
            }
        });
    });

    test('handles download click', () => {
        const { handleDownload } = require('../../../util/dashboard');

        renderWithProviders(<ListItem {...mockItemData} />, mockInitialState);

        const container = screen.getByAltText('Test GIF').closest('div');
        fireEvent.mouseEnter(container);

        const downloadButton = screen.getByRole('button', { name: /download/i });
        fireEvent.click(downloadButton);

        expect(handleDownload).toHaveBeenCalled();
    });

    test('handles favorite click', () => {
        renderWithProviders(<ListItem {...mockItemData} />, mockInitialState);

        const container = screen.getByAltText('Test GIF').closest('div');
        fireEvent.mouseEnter(container);

        const favoriteButton = screen.getByRole('button', { name: /favorite/i });
        fireEvent.click(favoriteButton);

        expect(mockAddToFavorites).toHaveBeenCalledWith('tenor', mockItemData.data);
    });

    test('handles unfavorite click when item is already favorited', () => {
        const favoritedState = {
            global: {
                ...mockInitialState.global,
                user: {
                    ...mockInitialState.global.user,
                    favorites: [mockItemData]
                }
            }
        };

        renderWithProviders(<ListItem {...mockItemData} />, favoritedState);

        const container = screen.getByAltText('Test GIF').closest('div');
        fireEvent.mouseEnter(container);

        const favoriteButton = screen.getByRole('button', { name: /favorite/i });
        fireEvent.click(favoriteButton);

        expect(mockRemoveFromFavorites).toHaveBeenCalledWith('tenor', mockItemData.data);
    });

    test('shows load date when provided', () => {
        const testDate = new Date('2023-01-01');
        const itemWithDate = {
            ...mockItemData,
            loadDate: testDate.getTime()
        };

        renderWithProviders(<ListItem {...itemWithDate} />, mockInitialState);

        const container = screen.getByAltText('Test GIF').closest('div');
        fireEvent.mouseEnter(container);

        expect(screen.getByText('01.01.2023')).toBeInTheDocument();
    });

    test('favorite button is disabled when user is not logged in', () => {
        const loggedOutState = {
            global: {
                user: null,
                token: null
            }
        };

        renderWithProviders(<ListItem {...mockItemData} />, loggedOutState);

        const container = screen.getByAltText('Test GIF').closest('div');
        fireEvent.mouseEnter(container);

        const favoriteButton = screen.getByRole('button', { name: /favorite/i });
        expect(favoriteButton).toBeDisabled();
    });
});