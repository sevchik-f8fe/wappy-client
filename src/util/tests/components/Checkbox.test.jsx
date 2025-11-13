import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '../../../components/Checkbox';

describe('Checkbox', () => {
    test('renders with correct props', () => {
        render(
            <Checkbox
                label="Согласен с"
                link="условиями"
                href="/terms"
                value={false}
                onchange={() => { }}
                error={false}
            />
        );

        expect(screen.getByText('Согласен с')).toBeInTheDocument();
        expect(screen.getByText('условиями')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    test('applies error class when error is true', () => {
        const { container } = render(
            <Checkbox
                label="Test"
                link="Link"
                href="/test"
                value={false}
                onchange={() => { }}
                error={true}
            />
        );

        const label = container.querySelector('label');
        expect(label).toHaveClass('error');
    });

    test('calls onChange when checkbox is clicked', () => {
        const mockOnChange = jest.fn();

        render(
            <Checkbox
                label="Test"
                link="Link"
                href="/test"
                value={false}
                onchange={mockOnChange}
                error={false}
            />
        );

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    test('renders checked state correctly', () => {
        render(
            <Checkbox
                label="Test"
                link="Link"
                href="/test"
                value={true}
                onchange={() => { }}
                error={false}
            />
        );

        expect(screen.getByRole('checkbox')).toBeChecked();
    });
});