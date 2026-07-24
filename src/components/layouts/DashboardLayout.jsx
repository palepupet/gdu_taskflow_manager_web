import { Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Sidebar, {DRAWER_WIDTH} from './Sidebar.jsx'

function DashboardLayout() {
    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar />
            <Sidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: `calc(100% - ${DRAWER_WIDTH}px)`,
                }}
            >
                {/* Décale le contenu sous la Navbar fixe */}
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    )
}

export default DashboardLayout;