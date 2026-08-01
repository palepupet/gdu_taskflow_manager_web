import { apiClient } from "./client.js"

export async function getUsers() {
    return apiClient('/users');
}