import {apiClient} from "./client.js";

export async function getMe() {
    return apiClient('/me');
}

export function updateMe(payload) {
    return apiClient('/me', {
        method: 'PATCH',
        body: payload,
    });
}