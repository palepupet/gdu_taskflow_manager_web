import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import { useAuth } from '../../hooks/useAuth.js'
import { DRAWER_WIDTH } from './Sidebar.jsx'

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <AppBar
            position="fixed"
            sx={{
                width: `calc(100% - ${DRAWER_WIDTH}px)`,
                ml: `${DRAWER_WIDTH}px`,
            }}
        >
            <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
                <Typography variant="body1">{user.firstName} {user.lastName}</Typography>

                <Button
                    color="inherit"
                    onClick={logout}
                >
                    Se déconnecter
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;