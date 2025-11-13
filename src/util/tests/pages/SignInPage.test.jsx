import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SignInPage from '../../../pages/SignInPage/SignInPage';

const theme = createTheme({});

jest.mock('mui-one-time-password-input', () => ({
    MuiOtpInput: function MockMuiOtpInput({ value, onChange, length }) {
        const handleChange = (event) => {
            if (onChange) {
                onChange(event.target.value.slice(0, length));
            }
        };

        return (
            <input
                data-testid="otp-input"
                value={value}
                onChange={handleChange}
                maxLength={length}
                placeholder="Enter code"
            />
        );
    }
}));

// Mock для authHooks
const mockSetOldUser = jest.fn();
const mockSendMail = jest.fn();
const mockConfirmMail = jest.fn();

jest.mock('../../../util/authHooks', () => ({
    useServer: () => ({
        setOldUser: mockSetOldUser,
        sendMail: mockSendMail,
        confirmMail: mockConfirmMail,
    }),
    useEmailHandle: () => jest.fn(),
    usePasswordHandle: () => jest.fn(),
    useCodeHandle: () => jest.fn(),
    useTimer: () => ({
        resendDisabled: false,
        handleButtonClick: jest.fn(),
        formatTime: jest.fn(),
    }),
}));

// Создание mock store
const createMockStore = (initialState) =>
    configureStore({
        reducer: {
            auth: (state = initialState.auth) => state,
            global: (state = initialState.global) => state,
        },
        preloadedState: initialState,
    });

const renderWithProviders = (component, initialState) => {
    const store = createMockStore(initialState);
    return render(
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <BrowserRouter>
                    {component}
                </BrowserRouter>
            </Provider>
        </ThemeProvider>
    );
};

describe('SignInPage', () => {
    const mockInitialState = {
        auth: {
            email: { value: '', error: false },
            password: { value: '', error: false },
            timer: 0,
            code: '',
            step: 0,
            loading: false,
        },
        global: {
            user: null,
            token: null,
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('рендерит страницу входа', () => {
        renderWithProviders(<SignInPage />, mockInitialState);

        expect(screen.getByText('введите данные аккаунта')).toBeInTheDocument();
        expect(screen.getByLabelText(/эл. почта/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument();
    });

    test('показывает шаг верификации когда step = 1', () => {
        const stateWithStep1 = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                step: 1,
            },
        };

        renderWithProviders(<SignInPage />, stateWithStep1);

        expect(screen.getByText('подтвердите вход')).toBeInTheDocument();
        expect(screen.getByTestId('otp-input')).toBeInTheDocument();
    });

    test('кнопка "назад" заблокирована на первом шаге', () => {
        renderWithProviders(<SignInPage />, mockInitialState);

        const backButton = screen.getByText('назад');
        expect(backButton).toBeDisabled();
    });

    test('кнопка "назад" разблокирована на втором шаге', () => {
        const stateWithStep1 = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                step: 1,
            },
        };

        renderWithProviders(<SignInPage />, stateWithStep1);

        const backButton = screen.getByText('назад');
        expect(backButton).not.toBeDisabled();
    });

    test('кнопка "далее" заблокирована при невалидном email', () => {
        const stateWithInvalidEmail = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                email: { value: 'invalid', error: true },
                password: { value: 'password123', error: false },
            },
        };

        renderWithProviders(<SignInPage />, stateWithInvalidEmail);

        const nextButton = screen.getByText('далее');
        expect(nextButton).toBeDisabled();
    });

    test('кнопка "далее" разблокирована при валидных полях', () => {
        const stateWithValidFields = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                email: { value: 'test@example.com', error: false },
                password: { value: 'validpassword123', error: false },
            },
        };

        renderWithProviders(<SignInPage />, stateWithValidFields);

        const nextButton = screen.getByText('далее');
        expect(nextButton).not.toBeDisabled();
    });

    test('обрабатывает клик по кнопке "далее" на шаге 0', async () => {
        mockSetOldUser.mockResolvedValueOnce({});

        const stateWithValidFields = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                email: { value: 'test@example.com', error: false },
                password: { value: 'validpassword123', error: false },
            },
        };

        renderWithProviders(<SignInPage />, stateWithValidFields);

        const nextButton = screen.getByText('далее');
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(mockSetOldUser).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'validpassword123',
            });
        });
    });

    test('обрабатывает клик по кнопке "далее" на шаге 1', async () => {
        const stateWithStep1 = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                step: 1,
                code: '123456',
            },
        };

        renderWithProviders(<SignInPage />, stateWithStep1);

        const nextButton = screen.getByText('далее');
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(mockConfirmMail).toHaveBeenCalledWith('123456', 'signInVerification');
        });
    });
});