import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    Alert,
    Box,
    Button,
    Chip,
    Typography,
} from '@mui/material'
import {getProject, updateProject} from '../api/projects.js'
import {getStatusColor, PROJECT_STATUS} from "../utils/projects.js";
import Loading from '../components/Loading.jsx'
import NotifyAlert from '../components/NotifyAlert.jsx'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import PersonIcon from '@mui/icons-material/Person'
import { useAuth } from "../hooks/useAuth.js"
import { canArchiveProject, canEditProject, canRestoreProject } from "../utils/permissions.js"

function ProjectDetailPage() {
    const { id } = useParams()
    const { user } = useAuth()

    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [actionError, setActionError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    async function changeStatus(status) {
        setActionError('')
        setActionLoading(true)

        try {
            const updated = await updateProject(id, { status })
            setProject(updated)
        } catch (err) {
            setActionError(err.message || 'Impossible de changer le statut du projet.')
        } finally {
            setActionLoading(false)
        }
    }

    async function loadDetailProject() {
        setLoading(true)
        setError('')

        try {
            const data = await getProject(id)
            setProject(data)
        } catch (err) {
            setError(err.message || 'Erreur lors du chargement du projet.')
            setProject(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadDetailProject()
        // eslint-disable-next-line
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <Box>
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {project && canArchiveProject(user, project) && (
                        <>
                            <Button
                                variant="outlined"
                                color="info"
                                disabled={actionLoading}
                                onClick={() => changeStatus(PROJECT_STATUS.DONE)}
                            >
                                Terminer
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                disabled={actionLoading}
                                onClick={() => changeStatus(PROJECT_STATUS.CANCELLED)}
                            >
                                Annuler
                            </Button>
                        </>
                    )}
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                            onClick={() => changeStatus(PROJECT_STATUS.IN_PROGRESS)}
                        >
                            Restaurer
                        </Button>
                    )}

                    <Button component={Link} to="/projects" variant="outlined">
                        Retour aux projets
                    </Button>
                </Box>
            </Box>

            {project?.isArchived && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Ce projet est archivé. Vous pouvez le restaurer si vous en avez le droit.
                </Alert>
            )}

            <NotifyAlert message={error} />
            <NotifyAlert message={actionError} />

            {!project && (
                <Typography>Projet introuvable.</Typography>
            )}

            {project && (
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                            mb: 2,
                        }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {project.title}
                        </Typography>

                        <Chip
                            label={project.status + (project.isArchived ? ' (archivé)' : '')}
                            color={getStatusColor(project.status)}
                            size="small"
                        />
                    </Box>

                    {project.description && (
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            {project.description}
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'self-start', gap: 1 }}>
                        <CalendarMonthIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Début : {project.startAt || '-'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'self-start', gap: 1 }}>
                        <CalendarMonthIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Fin : {project.endAt || '-'}
                        </Typography>
                    </Box>

                    <Typography variant="h6" gutterBottom>
                        Propriétaire
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pl: 2 }}>
                        <ManageAccountsIcon fontSize="small" color="action" />
                        <Typography>
                            {project.owner
                                ? `${project.owner.firstName} ${project.owner.lastName} (${project.owner.email})`
                                : '-'}
                        </Typography>
                    </Box>

                    <Typography variant="h6" gutterBottom>
                        Membres
                    </Typography>

                    {project.members && project.members.length > 0 ? (
                        project.members.map((member) => (
                            <Box
                                key={member.id}
                                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, pl: 2 }}
                            >
                                <PersonIcon fontSize="small" color="action" />
                                <Typography>
                                    {member.firstName} {member.lastName} ({member.email})
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography color="text.secondary" sx={{ pl: 2 }}>Aucun membre</Typography>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default ProjectDetailPage;