import { Box, Typography } from '@mui/material'
import { useAuth } from '../hooks/useAuth.js'

function ProfilePage() {
    const { user } = useAuth();

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Mon profil</Typography>
            <Typography>{user.firstName} {user.lastName} ({user.email})</Typography>
        </Box>
    );
}

export default ProfilePage;