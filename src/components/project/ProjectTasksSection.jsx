import Loading from "../Loading.jsx"
import NotifyAlert from "../NotifyAlert.jsx"
import TaskFiltersBar from "./TaskFiltersBar.jsx"
import PropTypes from "prop-types"
import { TASK_PRIORITY, TASK_STATUS } from "../../utils/tasks.js"
import {
    canChangeTaskState,
    canManageTasks,
    getAllowedTaskStates,
} from "../../utils/permissions.js"
import { useState } from "react"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import {
    Box,
    Button,
    Chip,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import MoreVertIcon from "@mui/icons-material/MoreVert"

function getStateChipColor(state) {
    if (state === TASK_STATUS.IN_PROGRESS) {
        return 'info';
    }

    if (state === TASK_STATUS.CLOSED) {
        return 'success';
    }

    return 'default';
}

function getPriorityChipColor(priority) {
    if (priority === TASK_PRIORITY.HIGH) {
        return 'error';
    }

    if (priority === TASK_PRIORITY.MEDIUM) {
        return 'warning';
    }

    return 'default';
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
    assignableUsers,
    onStatesChange,
    onPrioritiesChange,
    onAssigneeChange,
    onDueBeforeChange,
    onSortFieldChange,
    onSortOrderChange,
    onReset,
    onEditTask,
    onChangeTaskState,
    onChangeTaskAssignee,
}) {
    const canManage = canManageTasks(user, project);

    const [stateMenuAnchor, setStateMenuAnchor] = useState(null);
    const [stateMenuTask, setStateMenuTask] = useState(null);

    const [assigneeMenuAnchor, setAssigneeMenuAnchor] = useState(null);
    const [assigneeMenuTask, setAssigneeMenuTask] = useState(null);

    const [actionsMenuAnchor, setActionsMenuAnchor] = useState(null);
    const [actionsMenuTask, setActionsMenuTask] = useState(null);

    function openStateMenu(event, task) {
        if (!canChangeTaskState(user, project, task) || actionLoading) {
            return;
        }

        setStateMenuAnchor(event.currentTarget);
        setStateMenuTask(task);
    }

    function closeStateMenu() {
        setStateMenuAnchor(null);
        setStateMenuTask(null);
    }

    function handleSelectState(state) {
        if (!stateMenuTask) {
            return;
        }

        onChangeTaskState(stateMenuTask.id, state);
        closeStateMenu();
    }

    function openAssigneeMenu(event, task) {
        if (!canManage || actionLoading) {
            return;
        }

        setAssigneeMenuAnchor(event.currentTarget);
        setAssigneeMenuTask(task);
    }

    function closeAssigneeMenu() {
        setAssigneeMenuAnchor(null);
        setAssigneeMenuTask(null);
    }

    function handleSelectAssignee(assigneeValue) {
        if (!assigneeMenuTask) {
            return;
        }

        onChangeTaskAssignee(assigneeMenuTask.id, assigneeValue);
        closeAssigneeMenu();
    }

    function openActionsMenu(event, task) {
        setActionsMenuAnchor(event.currentTarget);
        setActionsMenuTask(task);
    }

    function closeActionsMenu() {
        setActionsMenuAnchor(null);
        setActionsMenuTask(null);
    }

    function handleEditFromMenu() {
        if (!actionsMenuTask) {
            return;
        }

        onEditTask(actionsMenuTask);
        closeActionsMenu();
    }

    function handleDeleteFromMenu() {
        if (!actionsMenuTask) {
            return;
        }

        onRemoveTask(actionsMenuTask.id);
        closeActionsMenu();
    }

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
                <Box sx={{ width: 650 }}>
                    {tasks.map((task) => {
                        const canChangeState = canChangeTaskState(user, project, task)
                        const assigneeLabel = task.assignee
                            ? `${task.assignee.firstName} ${task.assignee.lastName}`
                            : 'Non assigné'

                        return (
                            <Box
                                key={task.id}
                                sx={{
                                    px: 1,
                                    py: 1,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <Chip
                                        size="small"
                                        label={task.priority || TASK_PRIORITY.MEDIUM}
                                        color={getPriorityChipColor(task.priority)}
                                        variant="outlined"
                                        sx={{
                                            width: 90,
                                            justifyContent: 'center',
                                            cursor: 'default',
                                        }}
                                    />

                                    <Chip
                                        size="small"
                                        label={task.state}
                                        color={getStateChipColor(task.state)}
                                        onClick={
                                            canChangeState
                                                ? (e) => openStateMenu(e, task)
                                                : undefined
                                        }
                                        sx={{
                                            cursor: canChangeState ? 'pointer' : 'default',
                                            width: 90,
                                            justifyContent: 'center',
                                        }}
                                    />

                                    <Typography
                                        title={task.title}
                                        sx={{
                                            fontWeight: 500,
                                            width: 220,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {task.title}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        title={assigneeLabel}
                                        onClick={canManage ? (e) => openAssigneeMenu(e, task) : undefined}
                                        sx={{
                                            width: 140,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            cursor: canManage ? 'pointer' : 'default',
                                            '&:hover': canManage ? { color: 'text.primary' } : undefined,
                                        }}
                                    >
                                        {assigneeLabel}
                                    </Typography>

                                    {canManage && (
                                        <IconButton
                                            size="small"
                                            disabled={actionLoading}
                                            onClick={(e) => openActionsMenu(e, task)}
                                            sx={{ ml: 'auto' }}
                                        >
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>

                                {(task.tags || []).length > 0 && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 0.5,
                                            mt: 0.75,
                                            pl: 1,
                                        }}
                                    >
                                        {(task.tags || []).map((tag) => (
                                            <Chip
                                                key={tag.id}
                                                label={tag.label}
                                                size="small"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        )
                    })}
        </Box>
            )}

            <Menu
                anchorEl={stateMenuAnchor}
                open={Boolean(stateMenuAnchor)}
                onClose={closeStateMenu}
            >
                {stateMenuTask &&
                    getAllowedTaskStates(user, project, stateMenuTask).map((state) => (
                        <MenuItem
                            key={state}
                            selected={state === stateMenuTask.state}
                            onClick={() => handleSelectState(state)}
                        >
                            {state}
                        </MenuItem>
                    ))}
            </Menu>

            <Menu
                anchorEl={assigneeMenuAnchor}
                open={Boolean(assigneeMenuAnchor)}
                onClose={closeAssigneeMenu}
            >
                <MenuItem onClick={() => handleSelectAssignee('')}>
                    Non assigné
                </MenuItem>
                {assignableUsers.map((person) => (
                    <MenuItem
                        key={person.id}
                        selected={assigneeMenuTask?.assignee?.id === person.id}
                        onClick={() => handleSelectAssignee(String(person.id))}
                    >
                        {person.firstName} {person.lastName}
                    </MenuItem>
                ))}
            </Menu>

            <Menu
                anchorEl={actionsMenuAnchor}
                open={Boolean(actionsMenuAnchor)}
                onClose={closeActionsMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleEditFromMenu} disabled={actionLoading}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Modifier</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={handleDeleteFromMenu}
                    disabled={actionLoading}
                    sx={{ color: 'error.main' }}
                >
                    <ListItemIcon>
                        <DeleteOutlinedIcon fontSize="small" color="error" />                    </ListItemIcon>
                    <ListItemText>Supprimer</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    )
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
    assignableUsers: PropTypes.array.isRequired,
    onStatesChange: PropTypes.func.isRequired,
    onPrioritiesChange: PropTypes.func.isRequired,
    onAssigneeChange: PropTypes.func.isRequired,
    onDueBeforeChange: PropTypes.func.isRequired,
    onSortFieldChange: PropTypes.func.isRequired,
    onSortOrderChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onEditTask: PropTypes.func.isRequired,
    onChangeTaskState: PropTypes.func.isRequired,
    onChangeTaskAssignee: PropTypes.func.isRequired,
}

export default ProjectTasksSection;