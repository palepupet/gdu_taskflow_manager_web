import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { Box, Button } from "@mui/material"
import {
    canArchiveProject,
    canEditProject,
    canRestoreProject,
} from "../../utils/permissions.js"
import { PROJECT_STATUS } from "../../utils/projects.js"

function ProjectDetailActions({
    project,
    user,
    actionLoading,
    onChangeStatus,
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
                mb: 2,
            }}
        >
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
            }}>
                {project && canArchiveProject(user, project) && (
                    <>
                        <Button
                            variant="outlined"
                            color="info"
                            disabled={actionLoading}
                            onClick={() => onChangeStatus(PROJECT_STATUS.DONE)}
                        >
                            Terminer
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            disabled={actionLoading}
                            onClick={() => onChangeStatus(PROJECT_STATUS.CANCELLED)}
                        >
                            Annuler
                        </Button>
                    </>
                )}
            </Box>

            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
            }}>
                {project && canEditProject(user, project) && (
                    <Button
                        component={Link}
                        to={`/projects/${project.id}/edit`}
                        variant="contained"
                    >
                        Modifier
                    </Button>
                )}

                {project && canRestoreProject(user, project) && (
                    <Button
                        variant="contained"
                        disabled={actionLoading}
                        onClick={() => onChangeStatus(PROJECT_STATUS.IN_PROGRESS)}
                    >
                        Restaurer
                    </Button>
                )}

                <Button component={Link} to="/projects" variant="outlined">
                    Retour aux projets
                </Button>
            </Box>
        </Box>
    );
}

ProjectDetailActions.propTypes = {
    project: PropTypes.object,
    user: PropTypes.object,
    actionLoading: PropTypes.bool.isRequired,
    onChangeStatus: PropTypes.func.isRequired,
}

export default ProjectDetailActions;