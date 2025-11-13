export default {
    create: jest.fn(() => ({
        post: jest.fn(),
        get: jest.fn(),
        interceptors: {
            request: { use: jest.fn(), eject: jest.fn() },
            response: { use: jest.fn(), eject: jest.fn() }
        }
    })),
    get: jest.fn(),
    post: jest.fn()
};

export const fetchCSRFToken = jest.fn();
export const initializeCSRF = jest.fn();