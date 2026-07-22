import {apiClient} from "./client.js";

export async function login(email, password) {
    const data = await apiClient('/auth/login', {
        method: 'POST',
        body: { email, password },
    });

    sessionStorage.setItem('token', data.token);

    return data;
}