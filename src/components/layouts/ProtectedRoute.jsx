import { useAuth } from "../../hooks/useAuth.js"
import { Navigate, Outlet } from "react-router-dom"
import Loading from "../Loading.jsx"

function ProtectedRoute() {
    const {isAuthenticated, loading} = useAuth();

    if (loading) {
        return <Loading />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;