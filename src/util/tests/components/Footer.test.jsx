import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../../../components/Footer';

// Mock useNavigate and useLocation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
}));

describe('Footer', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        window.scrollTo = jest.fn();
    });

    test('renders on allowed paths', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );

        expect(screen.getByText('ваппи')).toBeInTheDocument();
        expect(screen.getByText('твой проводник в мире медиа')).toBeInTheDocument();
        expect(screen.getByText('поиск')).toBeInTheDocument();
        expect(screen.getByText('GitHub')).toBeInTheDocument();
        expect(screen.getByText('эл. почта')).toBeInTheDocument();
    });

    test('navigates to home when logo is clicked', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('ваппи'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('scrolls to top when search button is clicked on home page', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('поиск'));
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    test('has correct links', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );

        const githubLink = screen.getByText('GitHub').closest('a');
        const emailLink = screen.getByText('эл. почта').closest('a');

        expect(githubLink).toHaveAttribute('href', 'https://github.com/sevchik-f8fe/wappy-client');
        expect(githubLink).toHaveAttribute('target', '_blank');
        expect(emailLink).toHaveAttribute('href', 'mailto:kononovseva06@yandex.ru');
        expect(emailLink).toHaveAttribute('target', '_blank');
    });
});