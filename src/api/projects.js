import { apiClient } from "./client.js"

export async function getProjects() {
    return apiClient('/projects');
}

export async function getProject(id) {
    return apiClient(`/project/${id}`);
}

export async function createProject(payload) {
    return apiClient('/project', {
        method: 'POST',
        body: payload,
    });
}