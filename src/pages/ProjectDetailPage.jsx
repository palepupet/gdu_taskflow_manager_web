import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Alert, Box, Chip, Typography } from "@mui/material"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"
import {
    addProjectMembers,
    getProject,
    removeProjectMembers,
    updateProject,
} from "../api/projects.js"
import { getUsers } from "../api/users.js"
import { getStatusColor } from "../utils/projects.js"
import { useAuth } from "../hooks/useAuth.js"
import Loading from "../components/Loading.jsx"
import NotifyAlert from "../components/NotifyAlert.jsx"
import ProjectDetailActions from "../components/project/ProjectDetailActions.jsx"
import ProjectMembersSection from "../components/project/ProjectMembersSection.jsx"
import AddMembersDialog from "../components/project/AddMembersDialog.jsx"

function ProjectDetailPage() {
    const { id } = useParams()
    const { user } = useAuth()

    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [actionError, setActionError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    const [openAddMemberModal, setOpenAddMemberModal] = useState(false)
    const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [membersLoading, setMembersLoading] = useState(false)

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

    async function openAddMemberDialog() {
        setActionError('')
        setSelectedUsers([])
        setOpenAddMemberModal(true)
        setMembersLoading(true)

        try {
            const data = await getUsers()
            setUsers(data)
        } catch (err) {
            setActionError(err.message || 'Impossible de charger les utilisateurs.')
            setOpenAddMemberModal(false)
        } finally {
            setMembersLoading(false)
        }
    }

    async function refreshProject() {
        try {
            const data = await getProject(id)
            setProject(data)
        } catch (err) {
            setError(err.message || 'Erreur lors du rechargement du projet.')
        }
    }

    async function handleAddMembers() {
        if (selectedUsers.length === 0) {
            setActionError('Sélectionnez au moins un membre.')
            return
        }

        setActionLoading(true)
        setActionError('')

        try {
            const memberIds = selectedUsers.map((selected) => selected.id)
            await addProjectMembers(id, memberIds)
            setOpenAddMemberModal(false)
            setSelectedUsers([])
            await refreshProject()
        } catch (err) {
            setActionError(err.message || "Impossible d'ajouter le(s) membre(s) au projet.")
        } finally {
            setActionLoading(false)
        }
    }

    async function handleRemoveMember(memberId) {
        setActionError('')
        setActionLoading(true)

        try {
            await removeProjectMembers(id, [memberId])
            await refreshProject()
        } catch (err) {
            setActionError(err.message || 'Impossible de supprimer le membre du projet.')
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

    const memberIds = (project?.members || []).map((member) => member.id)
    const ownerId = project?.owner?.id
    const availableUsers = users.filter(
        (userAvailable) => !memberIds.includes(userAvailable.id) && userAvailable.id !== ownerId
    )

    return (
        <Box>
            <ProjectDetailActions
                project={project}
                user={user}
                actionLoading={actionLoading}
                onChangeStatus={changeStatus}
            />

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

                    <ProjectMembersSection
                        project={project}
                        user={user}
                        actionLoading={actionLoading}
                        onAddClick={openAddMemberDialog}
                        onRemoveMember={handleRemoveMember}
                    />
                </Box>
            )}

            <AddMembersDialog
                open={openAddMemberModal}
                onClose={() => setOpenAddMemberModal(false)}
                availableUsers={availableUsers}
                selectedUsers={selectedUsers}
                onSelectedUsersChange={setSelectedUsers}
                membersLoading={membersLoading}
                actionLoading={actionLoading}
                onSubmit={handleAddMembers}
            />
        </Box>
    );
}

export default ProjectDetailPage;