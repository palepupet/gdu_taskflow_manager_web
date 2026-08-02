import {
    Box, Button,
    Dialog,
    DialogActions,
    DialogContent, DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material"
import { TASK_PRIORITY } from "../../utils/tasks.js"
import PropTypes from "prop-types"

function CreateTaskDialog({
    open,
    onClose,
    title,
    description,
    dueAt,
    priority,
    onTitleChange,
    onDescriptionChange,
    onDueAtChange,
    onPriorityChange,
    onSubmit,
    submitting,
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth maxWidth="sm"
        >
            <DialogTitle>Ajouter une tâche</DialogTitle>
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
                        label="Titre"
                        value={title}
                        onChange={onTitleChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={onDescriptionChange}
                        fullWidth
                        multiline
                        rows={3}
                    />
                    <TextField
                        label="Échéance"
                        type="date"
                        value={dueAt}
                        onChange={onDueAtChange}
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="priority-label">Priorité</InputLabel>
                        <Select
                            labelId="priority-label"
                            label="Priorité"
                            variant="outlined"
                            value={priority}
                            onChange={onPriorityChange}
                        >
                            <MenuItem value={TASK_PRIORITY.LOW}>{TASK_PRIORITY.LOW}</MenuItem>
                            <MenuItem value={TASK_PRIORITY.MEDIUM}>{TASK_PRIORITY.MEDIUM}</MenuItem>
                            <MenuItem value={TASK_PRIORITY.HIGH}>{TASK_PRIORITY.HIGH}</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fermer</Button>
                <Button variant="contained" onClick={onSubmit} disabled={submitting}>
                    {submitting ? 'Création...' : 'Créer'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

CreateTaskDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dueAt: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    onTitleChange: PropTypes.func.isRequired,
    onDescriptionChange: PropTypes.func.isRequired,
    onDueAtChange: PropTypes.func.isRequired,
    onPriorityChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
}

export default CreateTaskDialog;