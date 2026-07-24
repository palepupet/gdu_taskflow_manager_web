import { Link, useParams } from "react-router-dom"
import { Box, Button, Typography } from "@mui/material"

function ProjectDetailPage() {
    const { id } = useParams();

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Détail du projet</Typography>
            <Typography sx={{ mb: 2 }}>Projet n°{id}</Typography>
            <Button component={Link} to="/projects" variant="outlined">Retour aux projets</Button>
        </Box>
    );
}

export default ProjectDetailPage;