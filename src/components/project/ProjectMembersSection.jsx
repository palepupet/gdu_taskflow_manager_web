import PropTypes from "prop-types"
import { Box, Button, IconButton, Typography } from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import CloseIcon from "@mui/icons-material/Close"
import { canManageMembers } from "../../utils/permissions.js"

function ProjectMembersSection({
    project,
    user,
    actionLoading,
    onAddClick,
    onRemoveMember,
}) {
    const canManage = canManageMembers(user, project)

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 1,
                }}
            >
                <Typography variant="h6">Membres</Typography>
                {canManage && (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={onAddClick}
                    >
                        Ajouter
                    </Button>
                )}
            </Box>

            {project.members && project.members.length > 0 ? (
                project.members.map((member) => (
                    <Box
                        key={member.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 0.5,
                            pl: 2,
                        }}
                    >
                        <PersonIcon fontSize="small" color="action" />
                        <Typography>{member.firstName} {member.lastName} ({member.email})</Typography>
                        {canManage && (
                            <IconButton
                                size="small"
                                color="error"
                                disabled={actionLoading}
                                onClick={() => onRemoveMember(member.id)}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                ))
            ) : (
                <Typography color="text.secondary" sx={{ pl: 2 }}>
                    Aucun membre
                </Typography>
            )}
        </Box>
    );
}

ProjectMembersSection.propTypes = {
    project: PropTypes.object.isRequired,
    user: PropTypes.object,
    actionLoading: PropTypes.bool.isRequired,
    onAddClick: PropTypes.func.isRequired,
    onRemoveMember: PropTypes.func.isRequired,
}

export default ProjectMembersSection;