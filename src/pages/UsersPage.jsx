import { useEffect, useState } from "react"
import { createUser, getUsers } from "../api/users.js"
import Loading from "../components/Loading.jsx"
import { Box, Button, Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import NotifyAlert from "../components/NotifyAlert.jsx"
import UserFormDialog from "../components/project/UserFormDialog.jsx"

function UsersPage() {
    // User list
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // User create
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
        setAsManager(false);
        setOpenCreate(true);
    }

    async function handleCreateUser() {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
            setActionError('Tous les champs sont obligatoires.');
            return;
        }

        setActionLoading(true);
        setActionError('');

        try {
            await createUser({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password,
                roles: asManager ? ['ROLE_MANAGER'] : ['ROLE_USER'],
            });

            setOpenCreate(false);
            await loadUsers(false);
        } catch (err) {
            setActionError(err.message || 'Impossible de créer l\'utilisateur.');
        } finally {
            setActionLoading(false);
        }
    }

    useEffect(() => {
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
            <NotifyAlert message={actionError} />

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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <UserFormDialog
                open={openCreate}
                onClose={() => setOpenCreate(false)}
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
            />

        </Box>
    );
}

export default UsersPage;