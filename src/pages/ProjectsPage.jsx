import { Box, Button, Typography } from '@mui/material'
import { Link } from "react-router-dom"

function ProjectsPage() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>Projets</Typography>
            <Typography>Liste des projets</Typography>

            <Button component={Link} to="/projects/1" variant="contained">
                Voir le projet n°1 (test)
            </Button>
        </Box>
    );
}

export default ProjectsPage;