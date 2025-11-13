import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useEmailHandle, usePasswordHandle, useCodeHandle } from '../../authHooks';
import { authReducer } from '../../../pages/SignUpPage/AuthSlice';

const createMockStore = (initialState) =>
    configureStore({
        reducer: { auth: authReducer },
        preloadedState: { auth: initialState }
    });

describe('authHooks', () => {
    let store;
    let wrapper;

    beforeEach(() => {
        store = createMockStore({
            email: { value: '', error: false },
            password: { value: '', error: false },
            passwordRep: { value: '', error: false },
            timer: 120,
            step: 0,
            code: ''
        });
        wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
    });

    test('useEmailHandle validates email correctly', () => {
        const { result } = renderHook(() => useEmailHandle(), { wrapper });

        act(() => {
            result.current({ target: { value: 'invalid-email' } });
        });

        const state = store.getState().auth;
        expect(state.email.error).toBe(true);
    });

    test('usePasswordHandle validates password length', () => {
        const { result } = renderHook(() => usePasswordHandle(), { wrapper });

        act(() => {
            result.current({ target: { value: 'short' } });
        });

        const state = store.getState().auth;
        expect(state.password.error).toBe(true);
    });

    describe('useEmailHandle', () => {
        test('validates correct email format', () => {
            const { result } = renderHook(() => useEmailHandle(), { wrapper });

            act(() => {
                result.current({ target: { value: 'valid@email.com' } });
            });

            const state = store.getState().auth;
            expect(state.email.error).toBe(false);
            expect(state.email.value).toBe('valid@email.com');
        });

        test('sets error for invalid email format', () => {
            const { result } = renderHook(() => useEmailHandle(), { wrapper });

            act(() => {
                result.current({ target: { value: 'invalid-email' } });
            });

            const state = store.getState().auth;
            expect(state.email.error).toBe(true);
        });

        test('handles empty email', () => {
            const { result } = renderHook(() => useEmailHandle(), { wrapper });

            act(() => {
                result.current({ target: { value: '' } });
            });

            const state = store.getState().auth;
            expect(state.email.error).toBe(true);
        });
    });

    describe('useCodeHandle', () => {
        test('validates code format correctly', () => {
            const { result } = renderHook(() => useCodeHandle(), { wrapper });

            act(() => {
                result.current('123456');
            });

            const state = store.getState().auth;
            expect(state.code).toBe('123456');
        });

        test('removes non-digit characters from code', () => {
            const { result } = renderHook(() => useCodeHandle(), { wrapper });

            act(() => {
                result.current('123abc456!@#$%^');
            });

            const state = store.getState().auth;
            expect(state.code).toBe('123456');
        });

        test('handles empty string', () => {
            const { result } = renderHook(() => useCodeHandle(), { wrapper });

            act(() => {
                result.current('');
            });

            const state = store.getState().auth;
            expect(state.code).toBe('');
        });
    });
});