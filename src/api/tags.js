import { apiClient } from "./client.js"

export function getProjectTags(projectId) {
    return apiClient(`/project/${projectId}/tags`);
}

export function createProjectTag(projectId, payload) {
    return apiClient(`/project/${projectId}/tags`, {
        method: 'POST',
        body: payload,
    });
}

export function updateProjectTag(tagId, payload) {
    return apiClient(`/tag/${tagId}`, {
        method: 'PATCH',
        body: payload,
    });
}

export function deleteProjectTag(tagId) {
    return apiClient(`/tag/${tagId}`, {
        method: 'DELETE',
    });
}