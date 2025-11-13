import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ErrorPage from '../../../components/ErrorPage';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('ErrorPage', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test('renders error message and button', () => {
        render(
            <BrowserRouter>
                <ErrorPage />
            </BrowserRouter>
        );

        expect(screen.getByText('ОЙ!')).toBeInTheDocument();
        expect(screen.getByText(/Похоже, что вы свернули с намеченного пути/)).toBeInTheDocument();
        expect(screen.getByText('вернуться домой')).toBeInTheDocument();
    });

    test('navigates to home when button is clicked', () => {
        render(
            <BrowserRouter>
                <ErrorPage />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('вернуться домой'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});