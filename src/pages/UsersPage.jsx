import { useEffect, useState } from "react"
import { createUser, deleteUser, getUsers, updateUser } from "../api/users.js"
import Loading from "../components/Loading.jsx"
import {
    Box,
    Button,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material"
import NotifyAlert from "../components/NotifyAlert.jsx"
import UserFormDialog from "../components/project/UserFormDialog.jsx"
import DeleteIcon from "@mui/icons-material/Delete"

function UsersPage() {
    // User list
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // User create
    const [editingUserId, setEditingUserId] = useState(null);
    const [openCreate, setOpenCreate] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [asManager, setAsManager] = useState(false);

    async function loadUsers(showLoading = true) {
        if (showLoading) {
            setLoading(true);
        }

        setError('');

        try {
            setUsers(await getUsers());
        } catch (err) {
            setError(err.message || 'Impossible de charger les utilisateurs');
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    }

    function openCreateDialog() {
        setActionError('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setEditingUserId(null);
        setAsManager(false);
        setOpenCreate(true);
    }

    async function handleCreateUser() {
        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            setActionError('Le prénom, le nom et l\'email sont obligatoires.');
            return;
        }

        if (!editingUserId && !password) {
            setActionError('Le mot de passe est obligatoire.');
            return;
        }

        setActionLoading(true);
        setActionError('');

        try {
            if (editingUserId) {
                await updateUser(editingUserId, {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    roles: asManager ? ['ROLE_MANAGER'] : ['ROLE_USER'],
                });
            } else {
                await createUser({
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    password,
                    roles: asManager ? ['ROLE_MANAGER'] : ['ROLE_USER'],
                });
            }

            setOpenCreate(false);
            setEditingUserId(null);
            await loadUsers(false);
        } catch (err) {
            setActionError(
                err.message ||
                (editingUserId
                    ? 'Impossible de modifier l\'utilisateur.'
                    : 'Impossible de créer l\'utilisateur.')
                );
        } finally {
            setActionLoading(false);
        }
    }

    function openEditDialog(user) {
        setActionError('');
        setEditingUserId(user.id);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setPassword('');
        setAsManager((user.roles || []).includes('ROLE_MANAGER'));
        setOpenCreate(true);
    }

    async function handleToggleActive(user) {
        setActionError('');
        setActionLoading(true);

        try {
            await updateUser(user.id, { isActive: !user.isActive });
            await loadUsers(false);
        } catch (err) {
            setActionError(err.message || 'Impossible de changer le statut.');
        } finally {
            setActionLoading(false);
        }
    }

    async function handleDeleteUser(userId) {
        setActionError('');
        setActionLoading(true);

        try {
            await deleteUser(userId);
            await loadUsers(false);
        } catch (err) {
            setActionError(err.message || 'Impossible de supprimer l\'utilisateur.');
        } finally {
            setActionLoading(false);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadUsers();
    }, []);

    if (loading) {
        return <Loading message="Chargement des utilisateurs..." />
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h4">Utilisateurs</Typography>
                <Button variant="contained" size="small" onClick={openCreateDialog}>Créer</Button>
            </Box>

            <NotifyAlert message={error} />
            {!openCreate && <NotifyAlert message={actionError} />}

            {users.length === 0 ? (
                <Typography color="text.secondary">Aucun utilisateur</Typography>
            ) : (
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rôles</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.firstName} {user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {(user.roles || []).map((role) => (
                                            <Chip
                                                key={role}
                                                label={role}
                                                size="small"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.isActive ? 'Actif' : 'Inactif'}
                                        color={user.isActive ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        disabled={actionLoading}
                                        onClick={() => openEditDialog(user)}
                                    >
                                        Modifier
                                    </Button>
                                    <Button
                                        size="small"
                                        disabled={actionLoading}
                                        onClick={() => handleToggleActive(user)}
                                    >
                                        {user.isActive ? 'Désactiver' : 'Activer'}
                                    </Button>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        disabled={actionLoading}
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <UserFormDialog
                open={openCreate}
                onClose={() => {
                    setOpenCreate(false);
                    setEditingUserId(null);
                    setActionError('');
                    }
                }
                dialogTitle={editingUserId ? 'Modifier un utilisateur' : 'Créer un utilisateur'}
                submitLabel={editingUserId ? 'Enregistrer' : 'Créer'}
                submitLoadingLabel={editingUserId ? 'Enregistrement...' : 'Création...'}
                showPassword={!editingUserId}
                firstName={firstName}
                lastName={lastName}
                email={email}
                password={password}
                asManager={asManager}
                onFirstNameChange={(e) => setFirstName(e.target.value)}
                onLastNameChange={(e) => setLastName(e.target.value)}
                onEmailChange={(e) => setEmail(e.target.value)}
                onPasswordChange={(e) => setPassword(e.target.value)}
                onAsManagerChange={(e) => setAsManager(e.target.checked)}
                onSubmit={handleCreateUser}
                submitting={actionLoading}
                error={actionError}
            />

        </Box>
    );
}

export default UsersPage;