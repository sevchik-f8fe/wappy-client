import React from 'react'; // for tests
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../../../App';

jest.mock('redux-persist-transform-encrypt', () => ({
    encryptTransform: () => ({})
}));

jest.mock('mui-one-time-password-input', () => ({
    MuiOtpInput: () => <div>OTP Input</div>
}));

jest.mock('axios', () => ({
    create: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ data: { csrfToken: 'test-token' } })),
        post: jest.fn(() => Promise.resolve({ data: {} })),
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() }
        }
    })),
    get: jest.fn(() => Promise.resolve({ data: { csrfToken: 'test-token' } })),
}));

jest.mock('../../../components/Header', () => () => <header>Header</header>);
jest.mock('../../../components/Footer', () => () => <footer>Footer</footer>);
jest.mock('../../../pages/DashboardPage/DashboardPage', () => () => <div>Dashboard</div>);
jest.mock('../../../pages/SignUpPage/SignUpPage', () => () => <div>SignUp</div>);
jest.mock('../../../pages/SignInPage/SignInPage', () => () => <div>SignIn</div>);

const createMockStore = () =>
    configureStore({
        reducer: {
            auth: () => ({}),
            global: () => ({ user: null, token: null }),
            dashboard: () => ({})
        }
    });

describe('App', () => {
    test('renders main app structure', () => {
        const store = createMockStore();

        render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        expect(screen.getByText('Header')).toBeInTheDocument();
        expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    test('renders correct initial route', () => {
        const store = createMockStore();

        render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        // Проверить, что отображается правильный компонент для начального маршрута
        expect(screen.getByText(/dashboard|signin/i)).toBeInTheDocument();
    });
});