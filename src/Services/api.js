import { sessionUtils } from '../utils/sessionUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL;

let redirecionando = false;

export const apiRequest = async (endpoint, options = {}) => {

    if (sessionUtils.isSessionExpired()) {
        sessionUtils.clearSession();
        window.dispatchEvent(new Event('logout'));
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

            window.dispatchEvent(new CustomEvent('apiError', {
                detail: {
                    status: 401,
                    message: 'Sessão inválida. Faça login novamente.',
                    endpoint: endpoint
                }
            }));

            throw new Error('Sessão inválida. Faça login novamente.');
        }

        if (response.status === 204) {
            sessionUtils.updateActivity();
            return null;
        }

        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error('Resposta não é JSON. Status:', response.status);
            console.error('Primeiros 200 caracteres da resposta:', text.substring(0, 200));

            if (response.status === 500) {
                throw new Error('Erro interno do servidor (500). O endpoint pode não estar implementado ou há um erro no backend.');
            }

            throw new Error(`Erro ${response.status}: O servidor retornou uma resposta não-JSON. Verifique se o endpoint existe.`);
        }

        if (!response.ok) {
            console.error('Erro do backend:', data);
            if (response.status === 500) {
                throw new Error('Erro interno do servidor (500). Verifique os logs do backend.');
            }

            throw new Error(data.message || data.detail || data.error || `Erro ${response.status} na requisição`);
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