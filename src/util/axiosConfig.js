import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_SERVER_URL,
    withCredentials: true,
    timeout: 5000,
});

let currentCsrfToken = '';
let currentTokenId = '';

export const getCsrfToken = async () => {
    try {
        const response = await api.get('/csrf-token');

        const tokenFromHeaders = response.headers['x-csrf-token'];
        const tokenIdFromHeaders = response.headers['x-csrf-token-id'];

        if (tokenFromHeaders && tokenIdFromHeaders) {
            currentCsrfToken = tokenFromHeaders;
            currentTokenId = tokenIdFromHeaders;
        } else if (response.data.token && response.data.tokenId) {
            currentCsrfToken = response.data.token;
            currentTokenId = response.data.tokenId;
        }

        return { token: currentCsrfToken, tokenId: currentTokenId };
    } catch (error) {
        console.error('Failed to get CSRF token:', error);
        throw error;
    }
};

api.interceptors.request.use((config) => {
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
        if (currentCsrfToken && currentTokenId) {
            config.headers['x-csrf-token'] = currentCsrfToken;
            config.headers['x-csrf-token-id'] = currentTokenId;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        const newToken = response.headers['x-csrf-token'];
        const newTokenId = response.headers['x-csrf-token-id'];

        if (newToken && newTokenId) {
            currentCsrfToken = newToken;
            currentTokenId = newTokenId;
        }

        return response;
    },
    async (error) => {
        if (error.response?.status === 403) {
            const errorCode = error.response?.data?.code;

            if (errorCode === 'CSRF_TOKEN_EXPIRED' || errorCode === 'CSRF_TOKEN_INVALID') {
                try {
                    await getCsrfToken();
                    if (error.config) {
                        error.config.headers['x-csrf-token'] = currentCsrfToken;
                        error.config.headers['x-csrf-token-id'] = currentTokenId;
                        return api.request(error.config);
                    }
                } catch (tokenError) {
                    console.error('Failed to refresh CSRF token:', tokenError);
                }
            }
        }
        return Promise.reject(error);
    }
);

getCsrfToken().catch(console.error);

export const setCsrfToken = (token, tokenId) => {
    currentCsrfToken = token;
    currentTokenId = tokenId;
};

export const getCurrentCsrfToken = () => ({
    token: currentCsrfToken,
    tokenId: currentTokenId
});

export default api;