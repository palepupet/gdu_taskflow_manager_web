import { apiClient } from "./client.js"

export function getProjectTags(projectId) {
    return apiClient(`/project/${projectId}/tags`);
}