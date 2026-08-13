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
import {
    createProjectTask,
    deleteProjectTask,
    searchProjectTasks,
    updateProjectTask,
} from "../api/tasks.js"
import ProjectTasksSection from "../components/project/ProjectTasksSection.jsx"
import TaskFormDialog from "../components/project/TaskFormDialog.jsx"
import { TASK_PRIORITY } from "../utils/tasks.js"
import {
    getProjectTags,
    createProjectTag,
    updateProjectTag,
    deleteProjectTag,
} from "../api/tags.js"
import ProjectTagsSection from "../components/project/ProjectTagsSection.jsx"
import TagFormDialog from "../components/project/TagFormDialog.jsx"

function ProjectDetailPage() {
    const { id } = useParams()
    const { user } = useAuth()

    // Project
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [actionError, setActionError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    // Members add dialog
    const [openAddMemberModal, setOpenAddMemberModal] = useState(false)
    const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [membersLoading, setMembersLoading] = useState(false)

    // Tasks listing
    const [tasks, setTasks] = useState([])
    const [tasksLoading, setTasksLoading] = useState(true)
    const [tasksError, setTasksError] = useState('')

    // Tasks creation
    const [openCreateTask, setOpenCreateTask] = useState(false)
    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskDueAt, setTaskDueAt] = useState('')
    const [taskPriority, setTaskPriority] = useState(TASK_PRIORITY.MEDIUM)

    // Tasks edit
    const [openEditTask, setOpenEditTask] = useState(false)
    const [editingTaskId, setEditingTaskId] = useState(null)

    // Tasks filters
    const [filterStates, setFilterStates] = useState([])
    const [filterPriorities, setFilterPriorities] = useState([])
    const [filterAssignee, setFilterAssignee] = useState('')
    const [filterDueBefore, setFilterDueBefore] = useState('')
    const [sortField, setSortField] = useState('dueAt')
    const [sortOrder, setSortOrder] = useState('asc')

    // Tasks assignees
    const [allUsers, setAllUsers] = useState([])

    // Tags list
    const [tags, setTags] = useState([])
    const [tagsLoading, setTagsLoading] = useState(true)
    const [tagsError, setTagsError] = useState('')

    // Tags edit
    const [openTagForm, setOpenTagForm] = useState(false)
    const [editingTagId, setEditingTagId] = useState(null)
    const [tagLabel, setTagLabel] = useState('')

    // Tags link
    const [taskTagIds, setTaskTagIds] = useState([])

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

    async function loadTasks() {
        setTasksLoading(true)
        setTasksError('')

        try {
            const filters = {}

            if (filterStates.length > 0) {
                filters.state = filterStates
            }
            if (filterPriorities.length > 0) {
                filters.priority = filterPriorities
            }
            if (filterAssignee) {
                filters.assignee = Number(filterAssignee)
            }
            if (filterDueBefore) {
                filters.dueBefore = filterDueBefore
            }

            const data = await searchProjectTasks(id, {
                filters,
                sort: {
                    field: sortField,
                    order: sortOrder,
                },
            })

            setTasks(data)
        } catch (err) {
            setTasksError(err.message || 'Erreur lors du chargement des tâches.')
            setTasks([])
        } finally {
            setTasksLoading(false)
        }
    }

    function openCreateTaskDialog() {
        setActionError('')
        setTaskTitle('')
        setTaskDescription('')
        setTaskDueAt('')
        setTaskPriority(TASK_PRIORITY.MEDIUM)
        setOpenCreateTask(true)
        setTaskTagIds([])
    }

    async function handleCreateTask() {
        if (!taskTitle.trim()) {
            setActionError('Le titre de la tâche est obligatoire.')
            return
        }

        setActionLoading(true)
        setActionError('')

        try {
            const created = await createProjectTask(id, {
                title: taskTitle.trim(),
                description: taskDescription.trim() || null,
                dueAt: taskDueAt || null,
                priority: taskPriority,
            })

            if (taskTagIds.length > 0) {
                await updateProjectTask(created.id, { tags: taskTagIds })
            }

            setOpenCreateTask(false)
            await loadTasks()
        } catch (err) {
            setActionError(err.message || 'Impossible de créer la tâche.')
        } finally {
            setActionLoading(false)
        }
    }

    function openEditTaskDialog(task) {
        setActionError('')
        setEditingTaskId(task.id)
        setTaskTitle(task.title || '')
        setTaskDescription(task.description || '')
        setTaskDueAt(task.dueAt ? String(task.dueAt).slice(0, 10) : '')
        setTaskPriority(task.priority || TASK_PRIORITY.MEDIUM)
        setOpenEditTask(true)
        setTaskTagIds((task.tags || []).map(tag => tag.id))
    }

    async function handleEditTask() {
        if (!taskTitle.trim()) {
            setActionError('Le titre de la tâche est obligatoire.')
            return
        }

        setActionLoading(true)
        setActionError('')

        try {
            await updateProjectTask(editingTaskId, {
                title: taskTitle.trim(),
                description: taskDescription.trim() || null,
                dueAt: taskDueAt || null,
                priority: taskPriority,
                tags: taskTagIds,
            })

            setOpenEditTask(false)
            setEditingTaskId(null)
            await loadTasks()
        } catch (err) {
            setActionError(err.message || 'Impossible de modifier la tâche')
        } finally {
            setActionLoading(false)
        }
    }

    async function handleRemoveTask(taskId) {
        setActionError('')
        setActionLoading(true)

        try {
            await deleteProjectTask(taskId)
            await loadTasks()
        } catch (err) {
            setActionError(err.message || 'Impossible de supprimer la tâche.')
        } finally {
            setActionLoading(false)
        }
    }

    function resetTaskFilters() {
        setFilterStates([])
        setFilterPriorities([])
        setFilterAssignee('')
        setFilterDueBefore('')
        setSortField('dueAt')
        setSortOrder('asc')
    }

    async function handleChangeTaskState(taskId, state) {
        setActionError('')
        setActionLoading(true)

        try {
            await updateProjectTask(taskId, { state })
            await loadTasks()
        } catch (err) {
            setActionError(err.message || "Impossible de changer l'état de la tâche.")
        } finally {
            setActionLoading(false)
        }
    }

    async function handleChangeTaskAssignee(taskId, assigneeValue) {
        setActionError('')
        setActionLoading(true)

        try {
            await updateProjectTask(taskId, {
                assignee: assigneeValue ? Number(assigneeValue) : null,
            })
            await loadTasks()
            await refreshProject()
        } catch (err) {
            setActionError(err.message || "Impossible d'assigner la tâche.")
        } finally {
            setActionLoading(false)
        }
    }

    async function loadUsers() {
        try {
            const data = await getUsers()
            setAllUsers(data)
        } catch {
            setAllUsers([])
        }
    }

    const assigneeOptions = project
        ? [
            project.owner,
            ...(project.members || []),
        ]
        : []

    async function loadTags() {
        setTagsLoading(true)
        setTagsError('')

        try {
            const data = await getProjectTags(id)
            setTags(data)
        } catch (err) {
            setTagsError(err.message || 'Erreur lors du chargement des tags.')
            setTags([])
        } finally {
            setTagsLoading(false)
        }
    }

    function openCreateTagDialog() {
        setActionError('')
        setEditingTagId(null)
        setTagLabel('')
        setOpenTagForm(true)
    }

    function openEditTagDialog(tag) {
        setActionError('')
        setEditingTagId(tag.id)
        setTagLabel(tag.label || '')
        setOpenTagForm(true)
    }

    async function handleSubmitTag() {
        if (!tagLabel.trim()) {
            setActionError('Le libellé du tag est obligatoire.')
            return
        }

        setActionLoading(true)
        setActionError('')

        try {
            if (editingTagId) {
                await updateProjectTag(editingTagId, { label: tagLabel.trim() })
            } else {
                await createProjectTag(id, { label: tagLabel.trim() })
            }

            setOpenTagForm(false)
            setEditingTagId(null)
            await loadTags()
            await loadTasks()
        } catch (err) {
            setActionError(
                err.message ||
                (editingTagId
                    ? 'Impossible de modifier le tag.'
                    : 'Impossible de créer le tag.')
            )
        } finally {
            setActionLoading(false)
        }
    }

    async function handleRemoveTag(tagId) {
        setActionError('')
        setActionLoading(true)

        try {
            await deleteProjectTag(tagId)
            await loadTags()
            await loadTasks()
        } catch (err) {
            setActionError(err.message || 'Impossible de supprimer le tag')
        } finally {
            setActionLoading(false)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadDetailProject()
        loadUsers()
        loadTags()
        // eslint-disable-next-line
    }, [])

    // useEffect filters
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadTasks()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStates, filterPriorities, filterAssignee, filterDueBefore, sortField, sortOrder])

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
            {
                !openCreateTask &&
                !openEditTask &&
                !openTagForm &&
                !openAddMemberModal && (
                    <NotifyAlert message={actionError} />
                )
            }

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

                    <ProjectTasksSection
                        project={project}
                        user={user}
                        tasks={tasks}
                        loading={tasksLoading}
                        error={tasksError}
                        actionLoading={actionLoading}
                        onAddClick={openCreateTaskDialog}
                        onRemoveTask={handleRemoveTask}
                        filterStates={filterStates}
                        filterPriorities={filterPriorities}
                        filterAssignee={filterAssignee}
                        filterDueBefore={filterDueBefore}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        assigneeOptions={assigneeOptions}
                        assignableUsers={allUsers}
                        onStatesChange={setFilterStates}
                        onPrioritiesChange={setFilterPriorities}
                        onAssigneeChange={setFilterAssignee}
                        onDueBeforeChange={setFilterDueBefore}
                        onSortFieldChange={setSortField}
                        onSortOrderChange={setSortOrder}
                        onReset={resetTaskFilters}
                        onEditTask={openEditTaskDialog}
                        onChangeTaskState={handleChangeTaskState}
                        onChangeTaskAssignee={handleChangeTaskAssignee}
                    />

                    <ProjectTagsSection
                        tags={tags}
                        loading={tagsLoading}
                        error={tagsError}
                        project={project}
                        user={user}
                        onAddClick={openCreateTagDialog}
                        onEditClick={openEditTagDialog}
                        onRemoveTag={handleRemoveTag}
                        actionLoading={actionLoading}
                    />

                    <TagFormDialog
                        open={openTagForm}
                        onClose={() => {
                            setOpenTagForm(false);
                            setActionError('');
                        }}
                        dialogTitle={editingTagId ? 'Modifier le tag' : 'Ajouter un tag'}
                        submitLabel={editingTagId ? 'Enregistrer' : 'Créer'}
                        submitLoadingLabel={
                            editingTagId ? 'Enregistrement...' : 'Création...'
                        }
                        label={tagLabel}
                        onLabelChange={(e) => setTagLabel(e.target.value)}
                        onSubmit={handleSubmitTag}
                        submitting={actionLoading}
                        error={actionError}
                    />

                    <TaskFormDialog
                        open={openCreateTask}
                        onClose={() => {
                            setOpenCreateTask(false);
                            setActionError('');
                        }}
                        dialogTitle="Ajouter une tâche"
                        submitLabel="Ajouter"
                        submitLoadingLabel="Ajout en cours..."
                        title={taskTitle}
                        description={taskDescription}
                        dueAt={taskDueAt}
                        priority={taskPriority}
                        onTitleChange={(e) => setTaskTitle(e.target.value)}
                        onDescriptionChange={(e) => setTaskDescription(e.target.value)}
                        onDueAtChange={(e) => setTaskDueAt(e.target.value)}
                        onPriorityChange={(e) => setTaskPriority(e.target.value)}
                        onSubmit={handleCreateTask}
                        submitting={actionLoading}
                        availableTags={tags}
                        selectedTagIds={taskTagIds}
                        onSelectedTagIdsChange={setTaskTagIds}
                        error={actionError}
                    />

                    <TaskFormDialog
                        open={openEditTask}
                        onClose={() => {
                            setOpenEditTask(false);
                            setActionError('');
                        }}
                        dialogTitle="Modifier une tâche"
                        submitLabel="Modifier"
                        submitLoadingLabel="Modification en cours..."
                        title={taskTitle}
                        description={taskDescription}
                        dueAt={taskDueAt}
                        priority={taskPriority}
                        onTitleChange={(e) => setTaskTitle(e.target.value)}
                        onDescriptionChange={(e) => setTaskDescription(e.target.value)}
                        onDueAtChange={(e) => setTaskDueAt(e.target.value)}
                        onPriorityChange={(e) => setTaskPriority(e.target.value)}
                        onSubmit={handleEditTask}
                        submitting={actionLoading}
                        availableTags={tags}
                        selectedTagIds={taskTagIds}
                        onSelectedTagIdsChange={setTaskTagIds}
                        error={actionError}
                    />

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
                onClose={() => {
                    setOpenAddMemberModal(false);
                    setActionError('');
                }}
                availableUsers={availableUsers}
                selectedUsers={selectedUsers}
                onSelectedUsersChange={setSelectedUsers}
                membersLoading={membersLoading}
                actionLoading={actionLoading}
                onSubmit={handleAddMembers}
                error={actionError}
            />
        </Box>
    );
}

export default ProjectDetailPage;