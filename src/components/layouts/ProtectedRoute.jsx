import { useAuth } from "../../hooks/useAuth.js"
import { Navigate, Outlet } from "react-router-dom"
import { Typography } from "@mui/material"

function ProtectedRoute() {
    const {isAuthenticated, loading} = useAuth();

    if (loading) {
        return <Typography sx={{ p: 3 }}>Chargement...</Typography>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;