import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { createProject } from "../api/projects.js"
import { Box, Button, TextField, Typography } from "@mui/material"
import NotifyAlert from "../components/NotifyAlert.jsx"

function ProjectCreatePage() {
    const navigate = useNavigate();

    const [title , setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Le titre est obligatoire');
            return;
        }
        if (startAt && endAt && endAt < startAt) {
            setError('La date de fin doit être après la date de début.');
            return;
        }

        setSubmitting(true);

        try {
            const project = await createProject({
                title: title.trim(),
                description: description.trim() || null,
                startAt: startAt || null,
                endAt: endAt || null,
            });
            navigate(`/projects/${project.id}`);
        } catch (err) {
            setError(err.message || 'Impossible de créer le projet.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Nouveau projet
            </Typography>

            <NotifyAlert message={error} />

            <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 560 }}>
                <TextField
                    label="Titre"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                />
                <TextField
                    label="Date de début"
                    type="date"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    fullWidth
                    margin="normal"
                    slotProps={{inputLabel: {shrink: true}}}
                />
                <TextField
                    label="Date de fin"
                    type="date"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                    fullWidth
                    margin="normal"
                    slotProps={{inputLabel: {shrink: true}}}
                />

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Création...' : 'Créer'}
                    </Button>
                    <Button component={Link} to="/projects" variant="outlined">
                        Annuler
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ProjectCreatePage;