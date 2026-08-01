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

export function updateProject(id, payload) {
    return apiClient(`/project/${id}`, {
        method: 'PATCH',
        body: payload,
    });
}
export async function addProjectMembers(id, memberIds) {
    return apiClient(`/project/${id}/members`, {
        method: 'POST',
        body: { members: memberIds },
    });
}

export async function removeProjectMembers(id, memberIds) {
    return apiClient(`/project/${id}/members`, {
        method: 'DELETE',
        body: { members: memberIds}
    });
}