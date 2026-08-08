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

function UserFormDialog({
    open,
    onClose,
    firstName,
    lastName,
    email,
    password,
    asManager,
    onFirstNameChange,
    onLastNameChange,
    onEmailChange,
    onPasswordChange,
    onAsManagerChange,
    onSubmit,
    submitting,
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Créer un utilisateur</DialogTitle>
            <DialogContent>
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
                    <TextField
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={onPasswordChange}
                        required
                        fullWidth
                    />
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
                    {submitting ? 'Création...' : 'Créer'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

UserFormDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    asManager: PropTypes.bool.isRequired,
    onFirstNameChange: PropTypes.func.isRequired,
    onLastNameChange: PropTypes.func.isRequired,
    onEmailChange: PropTypes.func.isRequired,
    onPasswordChange: PropTypes.func.isRequired,
    onAsManagerChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
}

export default UserFormDialog;