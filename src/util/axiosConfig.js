/**
 * Настройка Axios-клиента для HTTP-запросов к API
 * 
 * Особенности:
 * - Base URL: http://127.0.0.1:3000
 * - Таймаут запросов: 5 секунд
 */

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://161.104.16.134:3000',
    withCredentials: true,
    timeout: 5000,
});

export default api;