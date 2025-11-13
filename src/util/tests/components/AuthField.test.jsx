import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthField } from '../../../components/AuthField';

describe('AuthField', () => {
    test('renders with correct props', () => {
        const mockOnChange = jest.fn();

        render(
            <AuthField
                label="Email"
                placeholder="Введите email"
                value="test@example.com"
                onchange={mockOnChange}
                type="email"
                error={false}
                help="Введите ваш email"
            />
        );

        const input = screen.getByLabelText('Email');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('test@example.com');
        expect(input).toHaveAttribute('type', 'email');
        expect(input).toHaveAttribute('placeholder', 'Введите email');
        expect(screen.getByText('Введите ваш email')).toBeInTheDocument();
    });

    test('shows error state when error is true', () => {
        render(
            <AuthField
                label="Password"
                value=""
                onchange={() => { }}
                error={true}
                help="Ошибка ввода"
            />
        );

        const input = screen.getByLabelText('Password');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByText('Ошибка ввода')).toBeInTheDocument();
    });

    test('calls onChange when input changes', () => {
        const mockOnChange = jest.fn();

        render(
            <AuthField
                label="Test Field"
                value=""
                onchange={mockOnChange}
                error={false}
            />
        );

        const input = screen.getByLabelText('Test Field');
        fireEvent.change(input, { target: { value: 'new value' } });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
});