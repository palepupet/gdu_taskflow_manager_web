import {useAuth} from "../../hooks/useAuth.js";
import {Navigate, Outlet} from "react-router-dom";

function ProtectedRoute() {
    const {isAuthenticated, loading} = useAuth();

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;