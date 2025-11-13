import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DashboardPage from '../../../pages/DashboardPage/DashboardPage';

jest.mock('../../../components/ListItem', () => () => <div data-testid="list-item">Mock ListItem</div>);
jest.mock('react-masonry-css', () => ({ children }) => <div data-testid="masonry">{children}</div>);

jest.mock('../../axiosConfig', () => ({
    post: jest.fn(),
}));

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
        info: jest.fn(),
    },
    Bounce: jest.fn(),
    ToastContainer: () => null,
}));

jest.mock('react-infinite-scroll-hook', () => ({
    __esModule: true,
    default: () => [jest.fn()],
}));

jest.mock('lodash', () => ({
    debounce: (fn) => fn,
    throttle: (fn) => fn,
}));

jest.mock('nanoid', () => ({
    nanoid: () => 'test-id',
}));

// Простой store с заглушками
const createTestStore = (initialState = {}) => {
    return configureStore({
        reducer: {
            dashboard: (state = {
                page: 1,
                query: '',
                hasMore: true,
                tenorNext: null,
                data: [],
                ...initialState.dashboard
            }) => state,
            auth: (state = {
                loading: false,
                ...initialState.auth
            }) => state,
        }
    });
};

describe('DashboardPage - Basic Tests', () => {
    let store;

    beforeEach(() => {
        store = createTestStore();
    });

    test('displays search input and button', () => {
        render(
            <Provider store={store}>
                <DashboardPage />
            </Provider>
        );

        expect(screen.getByPlaceholderText('используйте английский язык')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'поиск' })).toBeInTheDocument();
    });

    test('displays filter checkboxes', () => {
        render(
            <Provider store={store}>
                <DashboardPage />
            </Provider>
        );

        expect(screen.getByLabelText('картинки')).toBeInTheDocument();
        expect(screen.getByLabelText('SVG')).toBeInTheDocument();
        expect(screen.getByLabelText('гифки')).toBeInTheDocument();
    });

    test('checkboxes are checked by default', () => {
        render(
            <Provider store={store}>
                <DashboardPage />
            </Provider>
        );

        expect(screen.getByLabelText('картинки')).toBeChecked();
        expect(screen.getByLabelText('SVG')).toBeChecked();
        expect(screen.getByLabelText('гифки')).toBeChecked();
    });

    test('can type in search input', () => {
        render(
            <Provider store={store}>
                <DashboardPage />
            </Provider>
        );

        const searchInput = screen.getByPlaceholderText('используйте английский язык');
        fireEvent.change(searchInput, { target: { value: 'test' } });

        expect(searchInput.value).toBe('test');
    });

    test('can click search button without errors', () => {
        render(
            <Provider store={store}>
                <DashboardPage />
            </Provider>
        );

        const searchButton = screen.getByRole('button', { name: 'поиск' });

        // Just check that clicking doesn't throw errors
        expect(() => fireEvent.click(searchButton)).not.toThrow();
    });

    test('can toggle checkboxes', () => {
        render(
            <Provider store={store}>
                <DashboardPage />
            </Provider>
        );

        const imageCheckbox = screen.getByLabelText('картинки');
        fireEvent.click(imageCheckbox);

        expect(imageCheckbox.checked).toBe(false);
    });

    test('shows loading skeletons when loading', () => {
        const loadingStore = createTestStore({
            auth: { loading: true }
        });

        render(
            <Provider store={loadingStore}>
                <DashboardPage />
            </Provider>
        );

        const skeletons = document.querySelectorAll('.MuiSkeleton-root');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    test('displays list items when data exists', () => {
        const storeWithData = createTestStore({
            dashboard: {
                data: [
                    { source: 'photo', data: { id: 1 } },
                    { source: 'tenor', data: { id: 2 } },
                ]
            }
        });

        render(
            <Provider store={storeWithData}>
                <DashboardPage />
            </Provider>
        );

        expect(screen.getAllByTestId('list-item').length).toBe(2);
    });

    test('handles Enter key in search input', () => {
        render(
            <Provider store={store}>
                <DashboardPage />
            </Provider>
        );

        const searchInput = screen.getByPlaceholderText('используйте английский язык');

        // Just check that pressing Enter doesn't throw errors
        expect(() => {
            fireEvent.keyDown(searchInput, { key: 'Enter' });
        }).not.toThrow();
    });

    test('renders masonry grid', () => {
        render(
            <Provider store={store}>
                <DashboardPage />
            </Provider>
        );

        expect(screen.getByTestId('masonry')).toBeInTheDocument();
    });
});