import Loading from "../Loading.jsx"
import { Box, Chip, Typography } from "@mui/material"
import NotifyAlert from "../NotifyAlert.jsx"
import PropTypes from "prop-types"

function ProjectTagsSection({ tags, loading, error }) {
    if (loading) {
        return <Loading message="Chargement des tags..." />
    }

    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Tags</Typography>

            <NotifyAlert message={error} />

            {tags.length === 0 ? (
                <Typography color="text.secondary" sx={{ pl: 2 }}>Aucun tag</Typography>
            ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pl: 1 }}>
                    {tags.map(tag => (
                        <Chip
                            key={tag.id}
                            label={tag.label}
                            size="small"
                            variant="outlined"
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}

ProjectTagsSection.propTypes = {
    tags: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
}

export default ProjectTagsSection;