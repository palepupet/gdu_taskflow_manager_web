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