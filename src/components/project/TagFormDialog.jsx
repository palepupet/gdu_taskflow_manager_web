import PropTypes from "prop-types"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material"
import NotifyAlert from "../NotifyAlert.jsx"

function TagFormDialog({
    open,
    onClose,
    dialogTitle,
    submitLabel,
    submitLoadingLabel,
    label,
    onLabelChange,
    onSubmit,
    submitting,
    error,
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                <NotifyAlert message={error} />

                <TextField
                    label="Libellé"
                    value={label}
                    onChange={onLabelChange}
                    required
                    fullWidth
                    autoFocus
                    sx={{ mt: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fermer</Button>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    disabled={submitting}
                >
                    {submitting ? submitLoadingLabel : submitLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

TagFormDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    dialogTitle: PropTypes.string.isRequired,
    submitLabel: PropTypes.string.isRequired,
    submitLoadingLabel: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onLabelChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    error: PropTypes.string,
}

export default TagFormDialog;