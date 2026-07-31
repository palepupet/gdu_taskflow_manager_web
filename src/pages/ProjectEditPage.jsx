import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Box, Button, Typography } from "@mui/material"
import { useAuth } from "../hooks/useAuth.js"
import { getProject, updateProject } from "../api/projects.js"
import { canEditProject } from "../utils/permissions.js"
import Loading from "../components/Loading.jsx"
import NotifyAlert from "../components/NotifyAlert.jsx"
import ProjectForm from "../components/ProjectForm.jsx"

function ApiDateToInputDateValue(value) {
    if (!value) {
        return '';
    }

    // from api => 2026-08-15T00:00:00+00:00
    // input date => 2026-08-15

    return String(value).slice(0, 10);
}

function ProjectEditPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');
    const [error, setError] = useState('');
    const [loadError, setLoadError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [forbidden, setForbidden] = useState(false);

    useEffect(() => {
        async function loadProject() {
            setLoading(true);
            setError('');
            setLoadError('');
            setForbidden(false);

            try {
                const project = await getProject(id);

                if (!canEditProject(user, project)) {
                    setForbidden(true);
                    return;
                }

                setTitle(project.title || '');
                setDescription(project.description || '');
                setStartAt(ApiDateToInputDateValue(project.startAt));
                setEndAt(ApiDateToInputDateValue(project.endAt));
            } catch (err) {
                setLoadError(err.message || 'Impossible de charger le projet');
            } finally {
                setLoading(false);
            }
        }

        loadProject();

    }, [id, user]);

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
            await updateProject(id, {
                title: title.trim(),
                description: description.trim() || null,
                startAt: startAt || null,
                endAt: endAt || null,
            });
            navigate(`/projects/${id}`);
        } catch (err) {
            setError(err.message || 'Impossible de modifier le projet');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return <Loading />
    }

    if (forbidden) {
        return (
            <Box>
                <NotifyAlert message="Vous n'avez pas le droit de modifier ce projet." />

                <Button component={Link} to={`/projects/${id}`} variant="outlined">
                    Retour au projet
                </Button>
            </Box>
        );
    }

    if (loadError) {
        return (
            <Box>
                <NotifyAlert message={loadError} />

                <Button component={Link} to={`/projects/${id}`} variant="outlined">
                    Retour au projet
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Modifier le projet
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
                submitLabel="Modifier"
                submittingLabel="Modification..."
                backTo={`/projects/${id}`}
            />

        </Box>
    );
}

export default ProjectEditPage;