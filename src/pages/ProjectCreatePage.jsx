import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { createProject } from "../api/projects.js"
import { Box, Typography } from "@mui/material"
import NotifyAlert from "../components/NotifyAlert.jsx"
import ProjectForm from "../components/ProjectForm.jsx"

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

            <ProjectForm
                title={title}
                description={description}
                startAt={startAt}
                endAt={endAt}
                onTitleChange={(e) => setTitle(e.target.value)}
                onDescriptionChange={(e) => setDescription(e.target.value)}
                onStartAtChange={(e) => setStartAt(e.target.value)}
                onEndAtChange={(e) => setEndAt(e.target.value)}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel="Créer"
                submittingLabel="Création..."
                backTo="/projects"
                />
        </Box>
    );
}

export default ProjectCreatePage;