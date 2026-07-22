const BASE_URL = import.meta.env.VITE_API_BASE_URL

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

    if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`)
    }

    if (response.status === 204) {
        return null
    }

    return response.json()
}