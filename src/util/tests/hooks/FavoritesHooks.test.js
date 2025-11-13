import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useFavorites } from '../../../pages/FavoritePage/FavoritesHooks';
import api from '../../axiosConfig';

// Mock axios
jest.mock('../../axiosConfig', () => ({
    post: jest.fn()
}));

const createMockStore = (initialState = {}) =>
    configureStore({
        reducer: {
            global: (state = initialState.global) => state
        }
    });

const wrapper = ({ children, initialState = {} }) => {
    const store = createMockStore(initialState);
    return <Provider store={store}>{children}</Provider>;
};

describe('useFavorites', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockUser = {
        email: 'test@example.com',
        refreshToken: 'refresh-token',
        favorites: []
    };

    const mockInitialState = {
        global: {
            user: mockUser,
            token: 'test-token'
        }
    };

    test('addToFavorites calls API and updates state on success', async () => {
        const mockResponse = {
            data: {
                user: { ...mockUser, favorites: [] },
                token: 'new-token'
            }
        };
        api.post.mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useFavorites(), {
            wrapper: (props) => wrapper({ ...props, initialState: mockInitialState })
        });

        const mockItem = { id: '1', title: 'Test Item' };
        const mockSource = 'tenor';

        await act(async () => {
            await result.current.addToFavorites(mockSource, mockItem);
        });

        expect(api.post).toHaveBeenCalledWith(
            '/profile/favorites/add',
            {
                refreshToken: 'refresh-token',
                email: 'test@example.com',
                user_email: 'test@example.com',
                item: mockItem,
                source: mockSource
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer test-token'
                }
            }
        );
    });

    test('does not add duplicate item to favorites', async () => {
        const existingItem = { id: '1', title: 'Existing Item' };
        const initialStateWithFavorites = {
            global: {
                user: {
                    ...mockUser,
                    favorites: [{ source: 'tenor', data: existingItem }]
                },
                token: 'test-token'
            }
        };

        const { result } = renderHook(() => useFavorites(), {
            wrapper: (props) => wrapper({ ...props, initialState: initialStateWithFavorites })
        });

        await act(async () => {
            await result.current.addToFavorites('tenor', existingItem);
        });

        expect(api.post).not.toHaveBeenCalled();
    });

    test('removeFromFavorites calls API and updates state', async () => {
        const existingItem = { id: '1', title: 'Existing Item' };
        const initialStateWithFavorites = {
            global: {
                user: {
                    ...mockUser,
                    favorites: [{ source: 'tenor', data: existingItem }]
                },
                token: 'test-token'
            }
        };

        const mockResponse = {
            data: {
                user: { ...mockUser, favorites: [] },
                token: 'new-token'
            }
        };
        api.post.mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useFavorites(), {
            wrapper: (props) => wrapper({ ...props, initialState: initialStateWithFavorites })
        });

        await act(async () => {
            await result.current.removeFromFavorites('tenor', existingItem);
        });

        expect(api.post).toHaveBeenCalledWith(
            '/profile/favorites/remove',
            {
                refreshToken: 'refresh-token',
                email: 'test@example.com',
                user_email: 'test@example.com',
                item: existingItem,
                source: 'tenor'
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer test-token'
                }
            }
        );
    });

    test('handles API errors gracefully', async () => {
        api.post.mockRejectedValue(new Error('API Error'));

        const { result } = renderHook(() => useFavorites(), {
            wrapper: (props) => wrapper({ ...props, initialState: mockInitialState })
        });

        const mockItem = { id: '1', title: 'Test Item' };

        await expect(
            act(async () => {
                await result.current.addToFavorites('tenor', mockItem);
            })
        ).rejects.toThrow('API Error');
    });

    test('handles missing user data gracefully', () => {
        const initialStateWithoutUser = {
            global: {
                user: null,
                token: null
            }
        };

        const { result } = renderHook(() => useFavorites(), {
            wrapper: (props) => wrapper({ ...props, initialState: initialStateWithoutUser })
        });

        expect(result.current.addToFavorites).toBeDefined();
        expect(result.current.removeFromFavorites).toBeDefined();
    });
});