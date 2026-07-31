export const PROJECT_STATUS = {
    IN_PROGRESS: 'en cours',
    DONE: 'terminé',
    CANCELLED: 'annulé',
}

export function getStatusColor(status) {
    if (status === PROJECT_STATUS.IN_PROGRESS) {
        return 'success';
    }
    if (status === PROJECT_STATUS.CANCELLED) {
        return 'error';
    }
    if (status === PROJECT_STATUS.DONE) {
        return 'info';
    }

    return 'default'
}