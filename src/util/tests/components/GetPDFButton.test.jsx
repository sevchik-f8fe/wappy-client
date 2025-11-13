import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GetPDFButton from '../../../components/GetPDFButton';

jest.mock('jspdf', () => {
    return jest.fn().mockImplementation(() => ({
        setFontSize: jest.fn(),
        text: jest.fn(),
        setFont: jest.fn(),
        addImage: jest.fn(),
        addPage: jest.fn(),
        save: jest.fn(),
        internal: {
            pageSize: {
                getWidth: () => 595,
                getHeight: () => 842
            }
        }
    }));
});

jest.mock('../../../util/dashboard', () => ({
    getUrl: jest.fn((source, data) => `https://example.com/${source}/${data.id}`),
    handleDownload: jest.fn()
}));

global.Image = jest.fn().mockImplementation(() => ({
    crossOrigin: '',
    src: '',
    onload: () => { },
    onerror: () => { },
    width: 100,
    height: 100
}));

describe('GetPDFButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockLoadHistoryData = [
        {
            source: 'tenor',
            data: { id: '1', title: 'Test GIF' },
            loadDate: Date.now()
        },
        {
            source: 'svg',
            data: { id: '2', title: 'Test SVG' },
            loadDate: Date.now() - 86400000
        }
    ];

    test('renders button with correct text', () => {
        render(<GetPDFButton loadHistoryData={mockLoadHistoryData} />);

        expect(screen.getByText('получить отчет')).toBeInTheDocument();
    });

    test('generates PDF when clicked', async () => {
        const { getUrl } = require('../../../util/dashboard');
        getUrl.mockReturnValue('https://example.com/test.jpg');

        render(<GetPDFButton loadHistoryData={mockLoadHistoryData} />);

        const button = screen.getByText('получить отчет');

        fireEvent.click(button);

        await waitFor(() => {
            expect(require('jspdf')).toHaveBeenCalled();
        });
    });

    test('handles image loading errors', async () => {
        const { getUrl } = require('../../../util/dashboard');
        getUrl.mockReturnValue('https://example.com/invalid.jpg');

        global.Image = jest.fn().mockImplementation(() => ({
            crossOrigin: '',
            src: '',
            onload: null,
            onerror: jest.fn(),
            width: 0,
            height: 0
        }));

        render(<GetPDFButton loadHistoryData={mockLoadHistoryData} />);

        const button = screen.getByText('получить отчет');

        fireEvent.click(button);

        await waitFor(() => {
            expect(button).toBeInTheDocument();
        });
    });

    test('shows loading state during PDF generation', async () => {
        render(<GetPDFButton loadHistoryData={mockLoadHistoryData} />);

        const button = screen.getByText('получить отчет');

        fireEvent.click(button);

        expect(button).toBeDisabled();
    });
});