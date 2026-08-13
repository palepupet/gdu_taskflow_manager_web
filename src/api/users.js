import { apiClient } from "./client.js"

export async function getUsers() {
    return apiClient('/users');
}

export function createUser(payload) {
    return apiClient('/user', {
        method: 'POST',
        body: payload,
    });
}

export function updateUser(userId, payload) {
    return apiClient(`/user/${userId}`, {
        method: 'PATCH',
        body: payload,
    });
}

export function deleteUser(userId) {
    return apiClient(`/user/${userId}`, {
        method: 'DELETE',
    });
}