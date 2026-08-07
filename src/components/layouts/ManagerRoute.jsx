import { useAuth } from "../../hooks/useAuth.js"
import Loading from "../Loading.jsx"
import { isManager } from "../../utils/permissions.js"
import { Navigate, Outlet } from "react-router-dom"

function ManagerRoute() {
    const {user, loading} = useAuth();

    if (loading) {
        return <Loading />
    }

    if (!isManager(user)) {
        return <Navigate to="/projects" />
    }

    return <Outlet />
}

export default ManagerRoute;