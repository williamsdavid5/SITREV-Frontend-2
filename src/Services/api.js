
import { sessionUtils } from '../utils/sessionUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiRequest = async (endpoint, options = {}) => {

    if (sessionUtils.isSessionExpired()) {
        sessionUtils.clearSession();
        window.dispatchEvent(new Event('logout'));
        window.location.href = '/';
        throw new Error('Sessão expirada. Faça login novamente.');
    }

    const token = localStorage.getItem('access_token');

    const defaultHeaders = {
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    if (!(options.body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    const mergedOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    if (!(mergedOptions.body instanceof FormData) && mergedOptions.body) {
        mergedOptions.body = JSON.stringify(mergedOptions.body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);

        if (response.status === 401) {
            sessionUtils.clearSession();
            window.dispatchEvent(new Event('logout'));
            window.location.href = '/';
            throw new Error('Sessão inválida. Faça login novamente.');
        }

        if (response.status === 204) {
            sessionUtils.updateActivity();
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            console.error('Erro do backend:', data);
            throw new Error(data.message || data.detail || data.error || 'Erro na requisição');
        }

        sessionUtils.updateActivity();
        return data;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
};

export const api = {
    get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
    post: (endpoint, body) => apiRequest(endpoint, {
        method: 'POST',
        body: body
    }),
    put: (endpoint, body) => apiRequest(endpoint, {
        method: 'PUT',
        body: body
    }),
    delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
    patch: (endpoint, body) => apiRequest(endpoint, {
        method: 'PATCH',
        body: body
    }),
};