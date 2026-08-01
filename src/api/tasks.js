import { apiClient } from "./client.js"

export async function getProjectTasks(projectId) {
    return apiClient(`/project/${projectId}/tasks`);
}