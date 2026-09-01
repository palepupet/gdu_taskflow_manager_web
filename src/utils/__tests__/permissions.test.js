import {
    isManager,
    isOwner,
    canEditProject,
    canArchiveProject,
    canRestoreProject,
    canManageMembers,
    canChangeTaskState,
    getAllowedTaskStates,
} from "../permissions.js"
import { TASK_STATUS } from "../tasks.js"
import { describe, expect, it } from "vitest"

const manager = {
    id: 1,
    roles: ['ROLE_MANAGER'],
}

const user = {
    id: 2,
    roles: ['ROLE_USER'],
}

const owner = {
    id: 10,
    roles: ['ROLE_USER'],
}

const assignee = {
    id: 20,
    roles: ['ROLE_USER'],
}

const activeProject = {
    id: 1,
    isArchived: false,
    owner: { id: 10 },
}

const archivedProject = {
    id: 2,
    isArchived: true,
    owner: { id: 10 },
}

const task = {
    id: 100,
    assignee: { id: 20 },
}

describe('permissions', () => {
    describe('isManager', () => {
        it('should return true when user has ROLE_MANAGER', () => {
            expect(isManager(manager)).toBe(true);
        });

        it('should return false when user is not a manager', () => {
            expect(isManager(user)).toBe(false);
        });
    });

    describe('isOwner', () => {
        it('should return true when user is the project owner', () => {
            expect(isOwner(owner, activeProject)).toBe(true);
        });

        it('should return false when user is not the owner', () => {
            expect(isOwner(user, activeProject)).toBe(false);
        });
    });

    describe('canEditProject', () => {
        it('should allow manager to edit an active project', () => {
            expect(canEditProject(manager, activeProject)).toBe(true);
        });

        it('should allow owner to edit an active project', () => {
            expect(canEditProject(owner, activeProject)).toBe(true);
        });

        it('should deny edit on archived project', () => {
            expect(canEditProject(owner, archivedProject)).toBe(false);
        });

        it('should deny edit for a regular user who is not owner', () => {
            expect(canEditProject(user, activeProject)).toBe(false);
        });
    });

    describe('canArchiveProject', () => {
        it('should allow archive when user can manage and project is active', () => {
            expect(canArchiveProject(owner, activeProject)).toBe(true);
        });

        it('should deny archive when project is already archived', () => {
            expect(canArchiveProject(owner, archivedProject)).toBe(false);
        });
    });

    describe('canRestoreProject', () => {
        it('should allow restore when project is archived and user can manage', () => {
            expect(canRestoreProject(owner, archivedProject)).toBe(true);
        });

        it('should deny restore when project is not archived', () => {
            expect(canRestoreProject(owner, activeProject)).toBe(false);
        });
    });

    describe('canManageMembers', () => {
        it('should allow only managers on active project', () => {
            expect(canManageMembers(manager, activeProject)).toBe(true);
        });

        it('should deny owner who is not manager', () => {
            expect(canManageMembers(owner, activeProject)).toBe(false);
        });

        it('should deny on archived project', () => {
            expect(canManageMembers(manager, archivedProject)).toBe(false);
        });
    });

    describe('canChangeTaskState', () => {
        it('should allow manager on active project', () => {
            expect(canChangeTaskState(manager, activeProject, task)).toBe(true);
        });

        it('should allow task assignee on active project', () => {
            expect(canChangeTaskState(assignee, activeProject, task)).toBe(true);
        });

        it('should deny regular user who is not assignee', () => {
            expect(canChangeTaskState(user, activeProject, task)).toBe(false);
        });

        it('should deny on archived project', () => {
            expect(canChangeTaskState(assignee, archivedProject, task)).toBe(false);
        });
    });

    describe('getAllowedTaskStates', () => {
        it('should return all states for manager', () => {
            expect(getAllowedTaskStates(manager, activeProject, task)).toEqual([
                TASK_STATUS.OPEN,
                TASK_STATUS.IN_PROGRESS,
                TASK_STATUS.CLOSED,
            ]);
        });

        it('should exclude in progress for assignee who is not manager or owner', () => {
            expect(getAllowedTaskStates(assignee, activeProject, task)).toEqual([
                TASK_STATUS.OPEN,
                TASK_STATUS.CLOSED,
            ]);
        });

        it('should return empty array for regular user', () => {
            expect(getAllowedTaskStates(user, activeProject, task)).toEqual([]);
        });
    });
});