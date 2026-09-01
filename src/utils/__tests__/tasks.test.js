import { TASK_STATUS, TASK_PRIORITY } from "../tasks.js"
import { describe, expect, it } from "vitest"

describe('tasks utils', () => {
    describe('TASK_STATUS', () => {
        it('should expose expected task state labels', () => {
            expect(TASK_STATUS.OPEN).toBe('ouvert');
            expect(TASK_STATUS.IN_PROGRESS).toBe('en cours');
            expect(TASK_STATUS.CLOSED).toBe('terminé');
        });
    });

    describe('TASK_PRIORITY', () => {
        it('should expose expected priority labels', () => {
            expect(TASK_PRIORITY.LOW).toBe('basse');
            expect(TASK_PRIORITY.MEDIUM).toBe('moyenne');
            expect(TASK_PRIORITY.HIGH).toBe('élevée');
        });
    });
});