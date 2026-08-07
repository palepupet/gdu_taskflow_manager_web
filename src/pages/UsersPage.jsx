import { useEffect, useState } from "react"
import { getUsers } from "../api/users.js"
import Loading from "../components/Loading.jsx"
import { Box, Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import NotifyAlert from "../components/NotifyAlert.jsx"

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function loadUsers() {
        setLoading(true);
        setError('');

        try {
            setUsers(await getUsers());
        } catch (err) {
            setError(err.message || 'Impossible de charger les utilisateurs');
        } finally {
            setLoading(false);
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
            <Typography variant="h4" gutterBottom>Utilisateurs</Typography>

            <NotifyAlert message={error} />

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
        </Box>
    );
}

export default UsersPage;