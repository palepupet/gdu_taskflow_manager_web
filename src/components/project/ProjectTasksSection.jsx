import Loading from "../Loading.jsx"
import NotifyAlert from "../NotifyAlert.jsx"
import TaskFiltersBar from "./TaskFiltersBar.jsx"
import PropTypes from "prop-types"
import { TASK_STATUS } from '../../utils/tasks.js'
import { canManageTasks } from "../../utils/permissions.js"
import EventIcon from '@mui/icons-material/Event'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, IconButton, Typography } from "@mui/material"


function getTaskStatusIcon(status) {
    if (status === TASK_STATUS.OPEN) {
        return <EventIcon fontSize="small" color="action" />
    }

    if (status === TASK_STATUS.IN_PROGRESS) {
        return <PlayCircleOutlinedIcon fontSize="small" color="action" />
    }

    if (status === TASK_STATUS.CLOSED) {
        return <CheckCircleIcon fontSize="small" color="action" />
    }

    return null;
}

function ProjectTasksSection({
    tasks,
    loading,
    error,
    project,
    user,
    actionLoading,
    onAddClick,
    onRemoveTask,
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
    const canManage = canManageTasks(user, project);

    return (
        <Box sx={{ mt: 1, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h6">Tâches</Typography>
                {canManage && (
                    <Button variant="outlined" size="small" onClick={onAddClick}>
                        Ajouter
                    </Button>
                )}
            </Box>

            <TaskFiltersBar
                filterStates={filterStates}
                filterPriorities={filterPriorities}
                filterAssignee={filterAssignee}
                filterDueBefore={filterDueBefore}
                sortField={sortField}
                sortOrder={sortOrder}
                assigneeOptions={assigneeOptions}
                onStatesChange={onStatesChange}
                onPrioritiesChange={onPrioritiesChange}
                onAssigneeChange={onAssigneeChange}
                onDueBeforeChange={onDueBeforeChange}
                onSortFieldChange={onSortFieldChange}
                onSortOrderChange={onSortOrderChange}
                onReset={onReset}
            />

            <NotifyAlert message={error} />

            {loading ? (
                <Loading message="Chargement des tâches..." />
            ): tasks.length === 0 ? (
                <Typography color="text.secondary" sx={{ pl: 2 }}>Aucune tâche</Typography>
            ) : (
                tasks.map(task => (
                    <Box
                        key={task.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                            mb: 1,
                            pl: 2,
                        }}
                    >
                        {getTaskStatusIcon(task.state)}
                        <Typography>{task.title}</Typography>

                        {task.assignedTo && (
                            <Typography variant="body2" color="text.secondary">
                                {task.assignedTo.firstName} {task.assignedTo.lastName}
                            </Typography>
                        )}
                        {canManage && (
                            <IconButton
                                size="small"
                                color="error"
                                disabled={actionLoading}
                                onClick={() => onRemoveTask(task.id)}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                ))
            )}
        </Box>
    );
}

ProjectTasksSection.propTypes = {
    tasks: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    project: PropTypes.object.isRequired,
    user: PropTypes.object,
    actionLoading: PropTypes.bool.isRequired,
    onAddClick: PropTypes.func.isRequired,
    onRemoveTask: PropTypes.func.isRequired,
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

export default ProjectTasksSection;