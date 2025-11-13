import React from 'react';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { ScrollToTop, UseCSRF } from '../../routerHooks';
import { initializeCSRF } from '../../axiosConfig';

jest.mock('../../axiosConfig', () => ({
    initializeCSRF: jest.fn(() => Promise.resolve())
}));

Object.defineProperty(window, 'scrollTo', {
    value: jest.fn(),
    writable: true
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: jest.fn()
}));

jest.mock('../../../pages/SignUpPage/AuthSlice', () => ({
    setSimpleField: jest.fn((payload) => ({
        type: 'auth/setSimpleField',
        payload
    }))
}));

const globalReducer = (state = {
    user: null,
    token: null,
    dialog: false
}) => state;

const authReducer = (state = {
    email: { value: '', error: false },
    password: { value: '', error: false },
    passwordRep: { value: '', error: false },
    code: '',
    timer: 120,
    step: 0,
    confOk: false,
    persOk: false,
    loading: false,
}) => state;

const createMockStore = (initialState = {}) => {
    return configureStore({
        reducer: {
            global: globalReducer,
            auth: authReducer
        },
        preloadedState: initialState
    });
};

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

describe('ScrollToTop', () => {
    let mockNavigate;
    let mockUseLocation;

    beforeEach(() => {
        jest.clearAllMocks();
        window.scrollTo.mockClear();

        mockNavigate = jest.fn();
        mockUseLocation = jest.fn();

        require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
        require('react-router-dom').useLocation.mockReturnValue({ pathname: '/' });
    });

    const renderScrollToTop = (initialState = {}, location = '/') => {
        require('react-router-dom').useLocation.mockReturnValue({ pathname: location });

        return renderHook(() => ScrollToTop(), {
            wrapper: (props) => wrapper({ ...props, initialState })
        });
    };

    test('redirects to home when accessing protected routes without authentication', () => {
        const initialState = {
            global: {
                user: null,
                token: null,
                dialog: false
            }
        };

        renderScrollToTop(initialState, '/change_email');

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('does not redirect when user is authenticated on protected routes', () => {
        const initialState = {
            global: {
                user: { email: 'test@example.com' },
                token: 'test-token',
                dialog: false
            }
        };

        renderScrollToTop(initialState, '/change_email');

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('scrolls to top on route change for specific paths', () => {
        const initialState = {
            global: {
                user: { email: 'test@example.com' },
                token: 'test-token',
                dialog: false
            }
        };

        renderScrollToTop(initialState, '/change_email');

        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    test('does not scroll to top on excluded paths', () => {
        const initialState = {
            global: {
                user: null,
                token: null,
                dialog: false
            }
        };

        window.scrollTo.mockClear();

        renderScrollToTop(initialState, '/');

        expect(window.scrollTo).not.toHaveBeenCalled();
    });

    test('handles multiple protected routes', () => {
        const protectedRoutes = ['/change_email', '/favorites', '/history'];
        const initialState = {
            global: {
                user: null,
                token: null,
                dialog: false
            }
        };

        protectedRoutes.forEach(route => {
            mockNavigate.mockClear();
            renderScrollToTop(initialState, route);
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});

describe('ScrollToTop Edge Cases', () => {
    let mockNavigate;
    let mockUseLocation;

    beforeEach(() => {
        jest.clearAllMocks();
        window.scrollTo.mockClear();

        mockNavigate = jest.fn();
        mockUseLocation = jest.fn();

        require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
        require('react-router-dom').useLocation.mockReturnValue({ pathname: '/' });
    });

    const renderScrollToTop = (initialState = {}, location = '/') => {
        require('react-router-dom').useLocation.mockReturnValue({ pathname: location });

        return renderHook(() => ScrollToTop(), {
            wrapper: (props) => wrapper({ ...props, initialState })
        });
    };

    test('handles undefined user state gracefully', () => {
        const initialState = {
            global: {
                user: undefined,
                token: null,
                dialog: false
            }
        };

        renderScrollToTop(initialState, '/change_email');

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('handles undefined token state gracefully', () => {
        const initialState = {
            global: {
                user: { email: 'test@example.com' },
                token: undefined,
                dialog: false
            }
        };

        renderScrollToTop(initialState, '/change_email');

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('handles both user and token as undefined', () => {
        const initialState = {
            global: {
                user: undefined,
                token: undefined,
                dialog: false
            }
        };

        renderScrollToTop(initialState, '/favorites');

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('does not redirect when both user and token are defined', () => {
        const initialState = {
            global: {
                user: { email: 'test@example.com' },
                token: 'valid-token',
                dialog: false
            }
        };

        renderScrollToTop(initialState, '/history');

        expect(mockNavigate).not.toHaveBeenCalled();
    });
});