import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel, MenuItem, Select,
    TextField
} from "@mui/material"
import {TASK_PRIORITY} from "../../utils/tasks.js"
import PropTypes from "prop-types"

function TaskFormDialog({
    open,
    onClose,
    dialogTitle,
    submitLabel,
    submitLoadingLabel,
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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{dialogTitle}</DialogTitle>
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
                    {submitting ? submitLoadingLabel : submitLabel}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

TaskFormDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    dialogTitle: PropTypes.string.isRequired,
    submitLabel: PropTypes.string.isRequired,
    submitLoadingLabel: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    dueAt: PropTypes.string,
    priority: PropTypes.string,
    onTitleChange: PropTypes.func,
    onDescriptionChange: PropTypes.func,
    onDueAtChange: PropTypes.func,
    onPriorityChange: PropTypes.func,
    onSubmit: PropTypes.func,
    submitting: PropTypes.bool
};

export default TaskFormDialog;