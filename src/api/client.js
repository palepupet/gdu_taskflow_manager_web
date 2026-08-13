const BASE_URL = import.meta.env.VITE_API_BASE_URL

let onUnauthorized = null;

export function setOnUnauthorized(callback) {
    onUnauthorized = callback;
}

export async function apiClient(endpoint, options = {}) {
    const method = options.method || 'GET'
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    }

    const token = sessionStorage.getItem('token')
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const config = { method, headers }

    if (options.body) {
        config.body = JSON.stringify(options.body)
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config)

    if (response.status === 401 && endpoint !== '/auth/login') {
        sessionStorage.removeItem('token');
        if (onUnauthorized) {
            onUnauthorized();
        }

        throw new Error('Erreur HTTP 401');
    }

    if (!response.ok) {
        let message = `Erreur HTTP ${response.status}`;

        const data = await response.json();
        if (data?.message) {
            message = data.message;
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return null
    }

    return response.json()
}