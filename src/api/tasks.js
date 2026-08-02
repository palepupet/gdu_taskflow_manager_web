import { apiClient } from "./client.js"

export async function createProjectTask(projectId, payload) {
    return apiClient(`/project/${projectId}/tasks`, {
        method: 'POST',
        body: payload,
    });
}

export async function deleteProjectTask(taskId) {
    return apiClient(`/task/${taskId}`, {
        method: 'DELETE',
    });
}

export async function searchProjectTasks(projectId, payload) {
    return apiClient(`/project/${projectId}/tasks/search`, {
        method: 'POST',
        body: payload,
    });
}