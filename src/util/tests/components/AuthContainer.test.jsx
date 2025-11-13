import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthContainer from '../../../components/AuthContainer';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('AuthContainer', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test('renders with correct props', () => {
        render(
            <BrowserRouter>
                <AuthContainer
                    text="Уже есть аккаунт?"
                    link="Войти"
                    href="/signin"
                >
                    <div>Test Children</div>
                </AuthContainer>
            </BrowserRouter>
        );

        expect(screen.getByText('ваппи')).toBeInTheDocument();
        expect(screen.getByText('Уже есть аккаунт?')).toBeInTheDocument();
        expect(screen.getByText('Войти')).toBeInTheDocument();
        expect(screen.getByText('Test Children')).toBeInTheDocument();
    });

    test('navigates to home when logo is clicked', () => {
        render(
            <BrowserRouter>
                <AuthContainer text="" link="" href="">
                    <div>Test</div>
                </AuthContainer>
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('ваппи'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('navigates to correct href when link is clicked', () => {
        render(
            <BrowserRouter>
                <AuthContainer
                    text="Нет аккаунта?"
                    link="Регистрация"
                    href="/signup"
                >
                    <div>Test</div>
                </AuthContainer>
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Регистрация'));
        expect(mockNavigate).toHaveBeenCalledWith('/signup');
    });
});