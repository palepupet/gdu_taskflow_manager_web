import Loading from "../Loading.jsx"
import { Box, Button, Chip, Typography } from "@mui/material"
import NotifyAlert from "../NotifyAlert.jsx"
import PropTypes from "prop-types"
import { canManageTags } from "../../utils/permissions.js"

function ProjectTagsSection({
    tags,
    loading,
    error,
    project,
    user,
    onAddClick,
    onEditClick,
}) {
    const canManage = canManageTags(user, project);

    return (
        <Box sx={{ mt: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h6">Tags</Typography>
                {canManage && (
                    <Button variant="outlined" size="small" onClick={onAddClick}>
                        Ajouter
                    </Button>
                )}
            </Box>
            <NotifyAlert message={error} />
            {loading ? (
                <Loading message="Chargement des tags..." />
            ) : tags.length === 0 ? (
                <Typography color="text.secondary" sx={{ pl: 2 }}>
                    Aucun tag
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pl: 1 }}>
                    {tags.map((tag) => (
                        <Chip
                            key={tag.id}
                            label={tag.label}
                            size="small"
                            variant="outlined"
                            onClick={
                                canManage
                                    ? () => onEditClick(tag)
                                    : undefined
                            }
                            sx={{ cursor: canManage ? 'pointer' : 'default', px: 2 }}
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
    project: PropTypes.object.isRequired,
    user: PropTypes.object,
    onAddClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired,
}

export default ProjectTagsSection;