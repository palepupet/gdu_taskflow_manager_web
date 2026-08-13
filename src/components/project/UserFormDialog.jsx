import PropTypes from "prop-types"
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    TextField,
} from "@mui/material"
import NotifyAlert from "../NotifyAlert.jsx"

function UserFormDialog({
    open,
    onClose,
    dialogTitle,
    submitLabel,
    submitLoadingLabel,
    firstName,
    lastName,
    email,
    password,
    asManager,
    showPassword,
    onFirstNameChange,
    onLastNameChange,
    onEmailChange,
    onPasswordChange,
    onAsManagerChange,
    onSubmit,
    submitting,
    error,
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>

                <NotifyAlert message={error} />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mt: 1,
                    }}
                >
                    <TextField
                        label="Nom"
                        value={lastName}
                        onChange={onLastNameChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Prénom"
                        value={firstName}
                        onChange={onFirstNameChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={onEmailChange}
                        required
                        fullWidth
                    />
                    {showPassword && (
                        <TextField
                            label="Mot de passe"
                            type="password"
                            value={password}
                            onChange={onPasswordChange}
                            required
                            fullWidth
                        />
                    )}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={asManager}
                                onChange={onAsManagerChange}
                            />
                        }
                        label="Manager"
                    />
                </Box>
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
    )
}

UserFormDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    dialogTitle: PropTypes.string.isRequired,
    submitLabel: PropTypes.string.isRequired,
    submitLoadingLabel: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    asManager: PropTypes.bool.isRequired,
    showPassword: PropTypes.bool.isRequired,
    onFirstNameChange: PropTypes.func.isRequired,
    onLastNameChange: PropTypes.func.isRequired,
    onEmailChange: PropTypes.func.isRequired,
    onPasswordChange: PropTypes.func.isRequired,
    onAsManagerChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    error: PropTypes.string,
}

export default UserFormDialog;