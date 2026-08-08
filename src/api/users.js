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