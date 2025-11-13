import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ChangeEmailPage from '../../../pages/ChangeEmailPage/ChangeEmailPage';

const theme = createTheme({
});

const mockChangeEmail = jest.fn();
const mockSendMailForChange = jest.fn();

jest.mock('../../../util/authHooks', () => ({
    useServer: () => ({
        changeEmail: mockChangeEmail,
        sendMailForChange: mockSendMailForChange
    })
}));

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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const createMockStore = (initialState) =>
    configureStore({
        reducer: {
            changeEmail: (state = initialState.changeEmail, action) => {
                switch (action.type) {
                    case 'changeEmail/setSimpleField':
                        return {
                            ...state,
                            [action.payload.field]: action.payload.value
                        };
                    case 'changeEmail/setAuthField':
                        return {
                            ...state,
                            email: {
                                ...state.email,
                                value: action.payload.value
                            }
                        };
                    case 'changeEmail/setAuthError':
                        return {
                            ...state,
                            email: {
                                ...state.email,
                                error: action.payload.error
                            }
                        };
                    default:
                        return state;
                }
            },
            auth: (state = initialState.auth) => state,
            global: (state = initialState.global) => state
        },
        preloadedState: initialState
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

describe('ChangeEmailPage', () => {
    const mockInitialState = {
        changeEmail: {
            email: { value: '', error: false },
            timer: 0,
            code: '',
            step: 0
        },
        auth: {
            loading: false
        },
        global: {
            user: { email: 'test@example.com', historyLoad: ['item1'] },
            token: 'test-token'
        }
    };

    beforeEach(() => {
        mockNavigate.mockClear();
        mockChangeEmail.mockClear();
        mockSendMailForChange.mockClear();
        jest.clearAllMocks();
    });

    test('renders change email page with initial step', () => {
        renderWithProviders(<ChangeEmailPage />, mockInitialState);

        expect(screen.getByText('введите новый адрес эл. почты')).toBeInTheDocument();
        expect(screen.getByLabelText(/эл. почта/i)).toBeInTheDocument();
    });

    test('navigates away if user is not authenticated', () => {
        const unauthenticatedState = {
            ...mockInitialState,
            global: {
                user: null,
                token: ''
            }
        };

        renderWithProviders(<ChangeEmailPage />, unauthenticatedState);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('shows verification step when step is 1', () => {
        const stateWithStep1 = {
            ...mockInitialState,
            changeEmail: {
                ...mockInitialState.changeEmail,
                step: 1
            }
        };

        renderWithProviders(<ChangeEmailPage />, stateWithStep1);

        expect(screen.getByText('подтвердите почту')).toBeInTheDocument();
        expect(screen.getByText(/на указанную почту придет письмо/i)).toBeInTheDocument();
    });

    test('back button is disabled on first step', () => {
        renderWithProviders(<ChangeEmailPage />, mockInitialState);

        const backButton = screen.getByText('назад');
        expect(backButton).toBeDisabled();
    });

    test('back button is enabled on second step', () => {
        const stateWithStep1 = {
            ...mockInitialState,
            changeEmail: {
                ...mockInitialState.changeEmail,
                step: 1
            }
        };

        renderWithProviders(<ChangeEmailPage />, stateWithStep1);

        const backButton = screen.getByText('назад');
        expect(backButton).not.toBeDisabled();
    });

    test('next button is disabled when email is invalid', () => {
        const stateWithInvalidEmail = {
            ...mockInitialState,
            changeEmail: {
                ...mockInitialState.changeEmail,
                email: { value: 'invalid', error: true }
            }
        };

        renderWithProviders(<ChangeEmailPage />, stateWithInvalidEmail);

        const nextButton = screen.getByText('далее');
        expect(nextButton).toBeDisabled();
    });

    test('handles resend code button click', async () => {
        mockSendMailForChange.mockResolvedValueOnce({});

        const stateWithStep1 = {
            ...mockInitialState,
            changeEmail: {
                ...mockInitialState.changeEmail,
                step: 1,
                email: { value: 'test@example.com', error: false }
            }
        };

        renderWithProviders(<ChangeEmailPage />, stateWithStep1);

        const resendButton = screen.getByText('отправить снова');

        fireEvent.click(resendButton);

        await waitFor(() => {
            expect(mockSendMailForChange).toHaveBeenCalledWith('test@example.com');
        });
    });
});
