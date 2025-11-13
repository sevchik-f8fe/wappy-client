import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

Object.defineProperty(window, 'scrollTo', {
    value: jest.fn(),
    writable: true
});

global.import = {
    meta: {
        env: {
            VITE_BASE_SERVER_URL: 'http://test-server.com',
            VITE_CRYPTO_KEY: 'test-key'
        }
    }
};

global.fetch = jest.fn();

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
        info: jest.fn()
    },
    Bounce: jest.fn(),
    ToastContainer: () => 'ToastContainer'
}));

jest.mock('nanoid', () => ({
    nanoid: jest.fn(() => 'test-id')
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({
        pathname: '/',
        search: '',
        hash: '',
        state: null,
        key: 'default'
    })
}));