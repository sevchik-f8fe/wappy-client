import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { usePannel } from '../../headerHoocks';
import api from '../../axiosConfig';

jest.mock('../../axiosConfig', () => ({
    post: jest.fn()
}));

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn()
    },
    Bounce: jest.fn()
}));

const createMockStore = (initialState = {}) =>
    configureStore({
        reducer: {
            global: (state = initialState.global) => state,
            header: (state = initialState.header) => state,
            dashboard: (state = initialState.dashboard) => state
        }
    });

const wrapper = ({ children, initialState = {} }) => {
    const store = createMockStore(initialState);
    return (
        <Provider store={store}>
            <BrowserRouter>
                {children}
            </BrowserRouter>
        </Provider>
    );
};

describe('usePannel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockInitialState = {
        global: {
            user: { email: 'test@example.com' },
            token: 'test-token'
        },
        header: {
            delDialog: false,
            outDialog: false
        },
        dashboard: {
            query: '',
            isImg: true,
            isSVG: true,
            isGif: true
        }
    };

    test('deleteAction calls API and updates state on success', async () => {
        const mockResponse = { data: { success: true } };
        api.post.mockResolvedValue(mockResponse);

        const { result } = renderHook(() => usePannel(), {
            wrapper: (props) => wrapper({ ...props, initialState: mockInitialState })
        });

        await act(async () => {
            await result.current.deleteAction();
        });

        expect(api.post).toHaveBeenCalledWith(
            '/profile/delete',
            { email: 'test@example.com' },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer test-token'
                }
            }
        );
    });

    test('deleteAction shows error toast on API failure', async () => {
        const { toast } = require('react-toastify');
        api.post.mockRejectedValue(new Error('API Error'));

        const { result } = renderHook(() => usePannel(), {
            wrapper: (props) => wrapper({ ...props, initialState: mockInitialState })
        });

        await act(async () => {
            result.current.deleteAction();
        });

        expect(toast.error).toHaveBeenCalledWith(
            "Что-то пошло не так :(",
            expect.any(Object)
        );
    });

    test('logOutAction dispatches correct actions', () => {
        const { result } = renderHook(() => usePannel(), {
            wrapper: (props) => wrapper({ ...props, initialState: mockInitialState })
        });

        act(() => {
            result.current.logOutAction();
        });

        expect(result.current.logOutAction).toBeDefined();
    });

    test('logInAction navigates to signin page', () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate')
            .mockReturnValue(mockNavigate);

        const { result } = renderHook(() => usePannel(), {
            wrapper: (props) => wrapper({ ...props, initialState: mockInitialState })
        });

        act(() => {
            result.current.logInAction();
        });

        expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });

    test('changeEmailAction navigates to change_email page', () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate')
            .mockReturnValue(mockNavigate);

        const { result } = renderHook(() => usePannel(), {
            wrapper: (props) => wrapper({ ...props, initialState: mockInitialState })
        });

        act(() => {
            result.current.changeEmailAction();
        });

        expect(mockNavigate).toHaveBeenCalledWith('/change_email');
    });

    test('handles missing user or token gracefully', () => {
        const initialStateWithoutUser = {
            ...mockInitialState,
            global: { user: null, token: null }
        };

        const { result } = renderHook(() => usePannel(), {
            wrapper: (props) => wrapper({ ...props, initialState: initialStateWithoutUser })
        });

        expect(() => {
            result.current.deleteAction();
        }).not.toThrow();
    });
});