import Loading from "../Loading.jsx"
import NotifyAlert from "../NotifyAlert.jsx"
import PropTypes from "prop-types"
import { TASK_STATUS } from '../../utils/tasks.js'
import { Box, Typography } from "@mui/material"
import EventIcon from '@mui/icons-material/Event'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

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
}) {
    if (loading) {
        return <Loading message="Chargement des tâches..." />
    }

    return (
        <Box sx={{ mt: 1, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Tâches</Typography>

            <NotifyAlert message={error} />

            {tasks.length === 0 ? (
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
}

export default ProjectTasksSection;