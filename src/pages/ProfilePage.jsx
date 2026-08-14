import { Box, Button, TextField, Typography } from "@mui/material"
import { useAuth } from "../hooks/useAuth.js"
import { useEffect, useState } from "react"
import { updateMe } from "../api/profile.js"
import NotifyAlert from "../components/NotifyAlert.jsx"

function ProfilePage() {
    const { user, updateUserProfile } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
        }
    }, [user]);

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!firstName.trim() || !lastName.trim()) {
            setError('Le prénom et le nom sont obligatoires.');
            return;
        }

        setSubmitting(true);

        try {
            const updated = await updateMe({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
            });

            updateUserProfile(updated);
            setSuccess('Profil mis à jour.');
        } catch (err) {
            setError(err.message || 'Impossible de mettre à jour le profil.');
        } finally {
            setSubmitting(false);
        }
    }

    if (!user) {
        return null;
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 480 }}
        >
            <Typography variant="h4" sx={{ mb: 2 }}>Mon profil</Typography>

            <NotifyAlert message={error} />
            <NotifyAlert message={success} severity="success" />

            <TextField
                label="Email"
                value={user.email}
                disabled
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
            />

            <Button
                type="submit"
                variant="contained"
                disabled={submitting}
            >
                {submitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
        </Box>
    );
}

export default ProfilePage;