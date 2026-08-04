import { TASK_STATUS } from "./tasks.js"

const ROLE_MANAGER = 'ROLE_MANAGER';

export function isManager(user) {
    return Boolean(user?.roles?.includes(ROLE_MANAGER));
}

export function isOwner(user, project) {
    return Boolean(user && project?.owner && user.id === project.owner.id);
}

export function canEditProject(user, project) {
    if (!user || !project) {
        return false;
    }

    if (project.isArchived) {
        return false;
    }

    return isManager(user) || isOwner(user, project);
}

export function canManageProject(user, project) {
    if (!user || !project) {
        return false;
    }

    return isManager(user) || isOwner(user, project);
}

export function canArchiveProject(user, project) {
    return canManageProject(user, project) && !project.isArchived;
}

export function canRestoreProject(user, project) {
    return canManageProject(user, project) && project.isArchived;
}

export function canManageMembers(user, project) {
    return canManageProject(user, project) && !project.isArchived;
}

export function canManageTasks(user, project) {
    return canManageProject(user, project) && !project.isArchived;
}

export function isTaskAssignee(user, task) {
    return Boolean(
        user
        && task?.assignee
        && user.id === task.assignee.id
    );
}

export function canChangeTaskState(user, project, task) {
    if (!user || !project || !task || project.isArchived) {
        return false;
    }

    if (isManager(user) || isOwner(user, project)) {
        return true;
    }

    return isTaskAssignee(user, task);
}

export function getAllowedTaskStates(user, project, task) {
    const allowedStates = [TASK_STATUS.OPEN, TASK_STATUS.IN_PROGRESS, TASK_STATUS.CLOSED];

    if (isManager(user) || isOwner(user, project)) {
        return allowedStates;
    }

    if (isTaskAssignee(user, task)) {
        return allowedStates.filter(state => state !== TASK_STATUS.IN_PROGRESS);
    }

    return [];
}