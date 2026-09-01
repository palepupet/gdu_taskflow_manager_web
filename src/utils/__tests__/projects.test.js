import { PROJECT_STATUS, getStatusColor } from "../projects.js"
import { describe, expect, it } from "vitest"

describe('projects utils', () => {
    describe('PROJECT_STATUS', () => {
        it('should expose expected status labels', () => {
            expect(PROJECT_STATUS.IN_PROGRESS).toBe('en cours');
            expect(PROJECT_STATUS.DONE).toBe('terminé');
            expect(PROJECT_STATUS.CANCELLED).toBe('annulé');
        });
    });

    describe('getStatusColor', () => {
        it('should return success for in progress status', () => {
            expect(getStatusColor(PROJECT_STATUS.IN_PROGRESS)).toBe('success');
        });

        it('should return info for done status', () => {
            expect(getStatusColor(PROJECT_STATUS.DONE)).toBe('info');
        });

        it('should return error for cancelled status', () => {
            expect(getStatusColor(PROJECT_STATUS.CANCELLED)).toBe('error');
        });

        it('should return default for unknown status', () => {
            expect(getStatusColor('inconnu')).toBe('default');
        });
    });
});