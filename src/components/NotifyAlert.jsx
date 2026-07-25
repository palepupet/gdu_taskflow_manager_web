import { Alert } from "@mui/material"

function NotifyAlert({ message, severity = 'error' }) {
    if (!message) {
        return null;
    }

    return (
        <Alert
            severity={severity}
            sx={{ mb: 2}}
        >
            {message}
        </Alert>
    );
}

export default NotifyAlert;