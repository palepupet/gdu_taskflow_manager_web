import { apiClient } from "./client.js"

export async function getProjectTasks(projectId) {
    return apiClient(`/project/${projectId}/tasks`);
}

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