import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_SERVER_URL,
    withCredentials: true,
    timeout: 5000,
});

let csrfToken = '';

export const fetchCSRFToken = async () => {
    try {
        const response = await api.get('/api/csrf-token');
        csrfToken = response.data.csrfToken;
        return csrfToken;
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
        throw error;
    }
};

api.interceptors.request.use(
    (config) => {
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase()) && csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 &&
            error.response.data?.message === 'Invalid CSRF token' &&
            !originalRequest._retry) {

            originalRequest._retry = true;

            try {
                await fetchCSRFToken();
                return api(originalRequest);
            } catch (csrfError) {
                return Promise.reject(csrfError);
            }
        }

        return Promise.reject(error);
    }
);

export const initializeCSRF = async () => {
    try {
        await fetchCSRFToken();
        console.log('CSRF token initialized');
    } catch (error) {
        console.warn('CSRF token initialization failed:', error);
    }
};

export default api;