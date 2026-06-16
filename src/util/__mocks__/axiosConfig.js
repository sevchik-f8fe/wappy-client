export default {
    create: jest.fn(() => ({
        post: jest.fn(),
        get: jest.fn(),
        interceptors: {
            request: { use: jest.fn(), eject: jest.fn() },
            response: { use: jest.fn(), eject: jest.fn() }
        },
        defaults: {
            baseURL: 'http://localhost:3000',
            withCredentials: true,
            timeout: 5000
        }
    })),
    get: jest.fn(),
    post: jest.fn()
};

export const fetchCSRFToken = jest.fn();
export const initializeCSRF = jest.fn();