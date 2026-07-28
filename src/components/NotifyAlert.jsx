import { Alert } from "@mui/material"
import PropTypes from "prop-types"

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

NotifyAlert.propTypes = {
    message: PropTypes.string,
    severity: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
}

export default NotifyAlert;