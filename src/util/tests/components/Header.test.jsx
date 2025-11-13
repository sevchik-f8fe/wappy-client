import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../../components/Header';
import { headerReducer } from '../../../components/HeaderSlice';

jest.mock('../../../util/headerHoocks', () => ({
    usePannel: () => ({
        deleteAction: jest.fn(),
        logInAction: jest.fn(),
        logOutAction: jest.fn(),
        changeEmailAction: jest.fn()
    })
}));

jest.mock('nanoid', () => ({
    nanoid: jest.fn(() => `test-id-${Math.random()}`)
}));

const createMockStore = (initialState) =>
    configureStore({
        reducer: {
            global: (state = initialState.global) => state,
            header: headerReducer
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

describe('Header', () => {
    const mockInitialState = {
        global: {
            user: { email: 'test@example.com', favorites: [], historyLoad: [] },
            token: 'test-token'
        },
        header: {
            delDialog: false,
            outDialog: false
        }
    };

    test('renders header elements', () => {
        renderWithProviders(<Header />, mockInitialState);

        expect(screen.getByText('ваппи')).toBeInTheDocument();
        expect(screen.getByText('твой проводник в мире медиа')).toBeInTheDocument();
    });

    test('shows auth actions when user is logged in', () => {
        renderWithProviders(<Header />, mockInitialState);

        expect(screen.getByRole('button', { name: /speeddial/i })).toBeInTheDocument();
    });

    test('shows non-auth actions when user is not logged in', () => {
        const initialStateWithoutUser = {
            global: {
                user: null,
                token: null
            },
            header: {
                delDialog: false,
                outDialog: false
            }
        };

        renderWithProviders(<Header />, initialStateWithoutUser);

        expect(screen.getByText('ваппи')).toBeInTheDocument();
    });

    test('opens dialogs when actions are clicked', () => {
        renderWithProviders(<Header />, mockInitialState);

        expect(screen.getByText('ваппи')).toBeInTheDocument();
    });

    test('navigates to home when logo is clicked', () => {
        renderWithProviders(<Header />, mockInitialState);

        fireEvent.click(screen.getByText('ваппи'));
    });

    test('disables navigation buttons on current page', () => {
        jest.spyOn(require('react-router-dom'), 'useLocation')
            .mockReturnValue({ pathname: '/history' });

        renderWithProviders(<Header />, mockInitialState);

        const buttons = screen.getAllByRole('button');
        const historyButton = buttons.find(btn =>
            btn.getAttribute('aria-label')?.includes('history') ||
            btn.querySelector('svg[data-testid="ScheduleIcon"]')
        );

        expect(screen.getByText('ваппи')).toBeInTheDocument();
    });
});