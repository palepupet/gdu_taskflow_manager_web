import PropTypes from 'prop-types'
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select, TextField,
} from '@mui/material'
import { TASK_PRIORITY, TASK_STATUS } from '../../utils/tasks.js'

function TaskFiltersBar({
    filterStates,
    filterPriorities,
    filterAssignee,
    filterDueBefore,
    sortField,
    sortOrder,
    assigneeOptions,
    onStatesChange,
    onPrioritiesChange,
    onAssigneeChange,
    onDueBeforeChange,
    onSortFieldChange,
    onSortOrderChange,
    onReset,
}) {
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, flex: 1, mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="filter-state">État</InputLabel>
                <Select
                    labelId="filter-state"
                    label="État"
                    multiple
                    variant="outlined"
                    value={filterStates}
                    onChange={(e) => onStatesChange(e.target.value)}
                >
                    <MenuItem value={TASK_STATUS.OPEN}>{TASK_STATUS.OPEN}</MenuItem>
                    <MenuItem value={TASK_STATUS.IN_PROGRESS}>{TASK_STATUS.IN_PROGRESS}</MenuItem>
                    <MenuItem value={TASK_STATUS.CLOSED}>{TASK_STATUS.CLOSED}</MenuItem>
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="filter-priority">Priorité</InputLabel>
                <Select
                    labelId="filter-priority"
                    label="Priorité"
                    multiple
                    variant="outlined"
                    value={filterPriorities}
                    onChange={(e) => onPrioritiesChange(e.target.value)}
                >
                    <MenuItem value={TASK_PRIORITY.LOW}>{TASK_PRIORITY.LOW}</MenuItem>
                    <MenuItem value={TASK_PRIORITY.MEDIUM}>{TASK_PRIORITY.MEDIUM}</MenuItem>
                    <MenuItem value={TASK_PRIORITY.HIGH}>{TASK_PRIORITY.HIGH}</MenuItem>
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="filter-assignee">Assigné</InputLabel>
                <Select
                    labelId="filter-assignee"
                    label="Assigné"
                    variant="outlined"
                    value={filterAssignee}
                    onChange={(e) => onAssigneeChange(e.target.value)}
                >
                    <MenuItem value="">Tous</MenuItem>
                    {assigneeOptions.map((person) => (
                        <MenuItem key={person.id} value={String(person.id)}>
                            {person.firstName} {person.lastName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label="Échéance avant"
                type="date"
                size="small"
                value={filterDueBefore}
                onChange={(e) => onDueBeforeChange(e.target.value)}
                sx={{ minWidth: 180 }}
                slotProps={{ inputLabel: { shrink: true } }}
            />

            <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="sort-field">Trier par</InputLabel>
                <Select
                    labelId="sort-field"
                    label="Trier par"
                    variant="outlined"
                    value={sortField}
                    onChange={(e) => onSortFieldChange(e.target.value)}
                >
                    <MenuItem value="dueAt">Échéance</MenuItem>
                    <MenuItem value="title">Titre</MenuItem>
                    <MenuItem value="priority">Priorité</MenuItem>
                    <MenuItem value="state">État</MenuItem>
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="sort-order">Ordre</InputLabel>
                <Select
                    labelId="sort-order"
                    label="Ordre"
                    variant="outlined"
                    value={sortOrder}
                    onChange={(e) => onSortOrderChange(e.target.value)}
                >
                    <MenuItem value="asc">Croissant</MenuItem>
                    <MenuItem value="desc">Décroissant</MenuItem>
                </Select>
            </FormControl>

            <Button variant="outlined" onClick={onReset}>
                Réinitialiser
            </Button>
        </Box>
    )
}

TaskFiltersBar.propTypes = {
    filterStates: PropTypes.array.isRequired,
    filterPriorities: PropTypes.array.isRequired,
    filterAssignee: PropTypes.string.isRequired,
    filterDueBefore: PropTypes.string.isRequired,
    sortField: PropTypes.string.isRequired,
    sortOrder: PropTypes.string.isRequired,
    assigneeOptions: PropTypes.array.isRequired,
    onStatesChange: PropTypes.func.isRequired,
    onPrioritiesChange: PropTypes.func.isRequired,
    onAssigneeChange: PropTypes.func.isRequired,
    onDueBeforeChange: PropTypes.func.isRequired,
    onSortFieldChange: PropTypes.func.isRequired,
    onSortOrderChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
}

export default TaskFiltersBar;