import { Box, Card, CardActionArea, CardContent, Chip, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getProjects } from "../api/projects.js"
import Loading from "../components/Loading.jsx"
import NotifyAlert from "../components/NotifyAlert.jsx"

function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    function getStatusColor(status) {
        if (status === 'en cours') {
            return 'success';
        }
        if (status === 'annulé') {
            return 'error';
        }
        if (status === 'terminé') {
            return 'info';
        }

        return 'default'
    }

    async function loadProjects() {
        setLoading(true);
        setError('');

        try {
            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            setError(err.message || 'Erreur lors du chargement des projets.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line
        loadProjects();
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <NotifyAlert message={error} />

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2,
                }}
            >
                {projects.map(project => (
                    <Card key={project.id} variant="outlined">
                        <CardActionArea component={Link} to={`/projects/${project.id}`}>
                            <CardContent>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    {project.title}
                                </Typography>
                                {project.description && (
                                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                                        {project.description}
                                    </Typography>
                                )}
                                <Chip
                                    label={project.status + (project.isArchived ? ' (archivé)' : '')}
                                    color={getStatusColor(project.status)}
                                    size="small"
                                    sx={{ mt: 1 }}
                                />
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>
        </>
    );
}

export default ProjectsPage;