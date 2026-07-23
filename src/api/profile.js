import {apiClient} from "./client.js";

export async function getMe() {
    return apiClient('/me');
}