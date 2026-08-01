import PropTypes from "prop-types"
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material"

function AddMembersDialog({
    open,
    onClose,
    availableUsers,
    selectedUsers,
    onSelectedUsersChange,
    membersLoading,
    actionLoading,
    onSubmit,
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Ajouter des membres</DialogTitle>
            <DialogContent>
                <Autocomplete
                    multiple
                    sx={{ mt: 1 }}
                    options={availableUsers}
                    loading={membersLoading}
                    value={selectedUsers}
                    onChange={(event, newValue) => onSelectedUsersChange(newValue)}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Rechercher un utilisateur"
                            placeholder="Nom, prénom..."
                        />
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fermer</Button>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    disabled={actionLoading || membersLoading}
                >
                    {actionLoading ? 'Ajout...' : 'Ajouter'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

AddMembersDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    availableUsers: PropTypes.array.isRequired,
    selectedUsers: PropTypes.array.isRequired,
    onSelectedUsersChange: PropTypes.func.isRequired,
    membersLoading: PropTypes.bool.isRequired,
    actionLoading: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export default AddMembersDialog;