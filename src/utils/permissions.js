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