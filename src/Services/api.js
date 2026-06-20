
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

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

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
            throw new Error(data.message || data.detail || 'Erro na requisição');
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
        body: JSON.stringify(body)
    }),
    put: (endpoint, body) => apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body)
    }),
    delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
    patch: (endpoint, body) => apiRequest(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(body)
    }),
};