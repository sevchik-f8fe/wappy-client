import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SignUpPage from '../../../pages/SignUpPage/SignUpPage';

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

const mockSetNewUser = jest.fn();
const mockSendMail = jest.fn();
const mockConfirmMail = jest.fn();
const mockEmailHandle = jest.fn();
const mockPasswordHandle = jest.fn();
const mockPasswordRepHandle = jest.fn();
const mockCodeHandle = jest.fn();
const mockResendDisabled = false;
const mockHandleButtonClick = jest.fn();
const mockFormatTime = jest.fn();

jest.mock('../../../util/authHooks', () => ({
    useServer: () => ({
        setNewUser: mockSetNewUser,
        sendMail: mockSendMail,
        confirmMail: mockConfirmMail
    }),
    useEmailHandle: () => mockEmailHandle,
    usePasswordHandle: () => mockPasswordHandle,
    usePasswordRepHandle: () => mockPasswordRepHandle,
    useCodeHandle: () => mockCodeHandle,
    useTimer: () => ({
        resendDisabled: mockResendDisabled,
        handleButtonClick: mockHandleButtonClick,
        formatTime: mockFormatTime
    })
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const createMockStore = (initialState) =>
    configureStore({
        reducer: {
            auth: (state = initialState.auth, action) => {
                switch (action.type) {
                    case 'auth/setSimpleField':
                        return {
                            ...state,
                            [action.payload.field]: action.payload.value
                        };
                    case 'auth/setAuthField':
                        return {
                            ...state,
                            [action.payload.field]: {
                                ...state[action.payload.field],
                                value: action.payload.value
                            }
                        };
                    case 'auth/setAuthError':
                        return {
                            ...state,
                            [action.payload.field]: {
                                ...state[action.payload.field],
                                error: action.payload.error
                            }
                        };
                    default:
                        return state;
                }
            },
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

describe('SignUpPage', () => {
    const mockInitialState = {
        auth: {
            email: { value: '', error: false },
            password: { value: '', error: false },
            passwordRep: { value: '', error: false },
            timer: 0,
            code: '',
            step: 0,
            loading: false,
            confOk: false,
            persOk: false
        },
        global: {
            user: null,
            token: null
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockNavigate.mockClear();
        mockSetNewUser.mockClear();
        mockSendMail.mockClear();
        mockConfirmMail.mockClear();
        mockEmailHandle.mockClear();
        mockPasswordHandle.mockClear();
        mockPasswordRepHandle.mockClear();
        mockCodeHandle.mockClear();
        mockHandleButtonClick.mockClear();
        mockFormatTime.mockClear();
    });

    test('renders sign up page with initial step', () => {
        renderWithProviders(<SignUpPage />, mockInitialState);

        expect(screen.getByText('зарегистрируйте аккаунт')).toBeInTheDocument();
        expect(screen.getByLabelText(/эл. почта/i)).toBeInTheDocument();
        expect(screen.getByLabelText('пароль')).toBeInTheDocument();
        expect(screen.getByLabelText(/повторите пароль/i)).toBeInTheDocument();
    });

    test('shows verification step when step is 1', () => {
        const stateWithStep1 = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                step: 1
            }
        };

        renderWithProviders(<SignUpPage />, stateWithStep1);

        expect(screen.getByText('подтвердите почту')).toBeInTheDocument();
        expect(screen.getByText(/на указанную почту придет письмо с кодом подтверждения/i)).toBeInTheDocument();
        expect(screen.getByTestId('otp-input')).toBeInTheDocument();
    });

    test('back button is disabled on first step', () => {
        renderWithProviders(<SignUpPage />, mockInitialState);

        const backButton = screen.getByText('назад');
        expect(backButton).toBeDisabled();
    });

    test('back button is enabled on second step', () => {
        const stateWithStep1 = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                step: 1
            }
        };

        renderWithProviders(<SignUpPage />, stateWithStep1);

        const backButton = screen.getByText('назад');
        expect(backButton).not.toBeDisabled();
    });

    test('next button is disabled when email is invalid', () => {
        const stateWithInvalidEmail = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                email: { value: 'invalid', error: true },
                password: { value: 'password123', error: false },
                passwordRep: { value: 'password123', error: false }
            }
        };

        renderWithProviders(<SignUpPage />, stateWithInvalidEmail);

        const nextButton = screen.getByText('далее');
        expect(nextButton).toBeDisabled();
    });

    test('next button is disabled when checkboxes are not checked', () => {
        const stateWithUncheckedBoxes = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                email: { value: 'test@example.com', error: false },
                password: { value: 'validpassword123', error: false },
                passwordRep: { value: 'validpassword123', error: false },
                confOk: false,
                persOk: false
            }
        };

        renderWithProviders(<SignUpPage />, stateWithUncheckedBoxes);

        const nextButton = screen.getByText('далее');
        expect(nextButton).toBeDisabled();
    });

    test('next button is enabled when all fields are valid and checkboxes are checked', () => {
        const stateWithValidFields = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                email: { value: 'test@example.com', error: false },
                password: { value: 'validpassword123', error: false },
                passwordRep: { value: 'validpassword123', error: false },
                confOk: true,
                persOk: true
            }
        };

        renderWithProviders(<SignUpPage />, stateWithValidFields);

        const nextButton = screen.getByText('далее');
        expect(nextButton).not.toBeDisabled();
    });

    test('handles next button click on step 0', async () => {
        mockSetNewUser.mockResolvedValueOnce({});

        const stateWithValidFields = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                email: { value: 'test@example.com', error: false },
                password: { value: 'validpassword123', error: false },
                passwordRep: { value: 'validpassword123', error: false },
                confOk: true,
                persOk: true
            }
        };

        renderWithProviders(<SignUpPage />, stateWithValidFields);

        const nextButton = screen.getByText('далее');
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(mockSetNewUser).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'validpassword123'
            });
        });
    });

    test('handles next button click on step 1', async () => {
        const stateWithStep1 = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                step: 1,
                code: '123456'
            }
        };

        renderWithProviders(<SignUpPage />, stateWithStep1);

        const nextButton = screen.getByText('далее');
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(mockConfirmMail).toHaveBeenCalledWith('123456', 'activation');
        });
    });

    test('handles back button click', () => {
        const stateWithStep1 = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                step: 1
            }
        };

        renderWithProviders(<SignUpPage />, stateWithStep1);

        const backButton = screen.getByText('назад');
        fireEvent.click(backButton);

        expect(backButton).toBeInTheDocument();
    });

    test('handles resend code button click', async () => {
        const stateWithUser = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                step: 1
            },
            global: {
                user: { email: 'test@example.com' },
                token: 'test-token'
            }
        };

        mockSendMail.mockResolvedValueOnce({});

        renderWithProviders(<SignUpPage />, stateWithUser);

        const resendButton = screen.getByText('отправить снова');
        fireEvent.click(resendButton);

        await waitFor(() => {
            expect(mockSendMail).toHaveBeenCalledWith('test@example.com', 'activation');
            expect(mockHandleButtonClick).toHaveBeenCalled();
        });
    });

    test('shows loading state when loading is true', () => {
        const stateWithLoading = {
            ...mockInitialState,
            auth: {
                ...mockInitialState.auth,
                loading: true
            }
        };

        renderWithProviders(<SignUpPage />, stateWithLoading);

        const nextButton = screen.getByText('далее');
        expect(nextButton).toBeDisabled();
    });

    test('displays help text for form fields', () => {
        renderWithProviders(<SignUpPage />, mockInitialState);

        expect(screen.getByText('введите адрес электронной почты')).toBeInTheDocument();
        expect(screen.getByText(/мин. длинна пароля - 8 символов/i)).toBeInTheDocument();
        expect(screen.getByText('рекомендуется ручной ввод')).toBeInTheDocument();
    });
});