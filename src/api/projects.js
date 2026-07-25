import { apiClient } from "./client.js"

export async function getProjects() {
    return apiClient('/projects');
}