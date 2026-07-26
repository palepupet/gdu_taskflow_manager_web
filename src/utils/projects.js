export function getStatusColor(status) {
    if (status === 'en cours') {
        return 'success';
    }
    if (status === 'annulé') {
        return 'error';
    }
    if (status === 'terminé') {
        return 'info';
    }

    return 'default'
}