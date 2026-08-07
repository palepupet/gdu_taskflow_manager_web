import { Drawer, List, ListItemButton, ListItemText, Toolbar } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from "../../hooks/useAuth.js"
import { isManager } from "../../utils/permissions.js"

export const DRAWER_WIDTH = 240;

function Sidebar() {
    const location = useLocation();
    const {user} = useAuth();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Toolbar>
                <strong>TaskFlow</strong>
            </Toolbar>

            <List>
                <ListItemButton
                    component={Link}
                    to="/projects"
                    selected={location.pathname.startsWith('/projects')}
                >
                    <ListItemText primary="Projets" />
                </ListItemButton>

                <ListItemButton
                    component={Link}
                    to="/profile"
                    selected={location.pathname === '/profile'}
                >
                    <ListItemText primary="Profil" />
                </ListItemButton>

                {isManager(user) && (
                    <ListItemButton
                        component={Link}
                        to="/users"
                        selected={location.pathname.startsWith('/users')}
                    >
                        <ListItemText primary="Utilisateurs" />
                    </ListItemButton>
                )}
            </List>
        </Drawer>
    );
}

export default Sidebar;