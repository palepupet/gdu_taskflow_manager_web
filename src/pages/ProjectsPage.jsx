import {useAuth} from "../hooks/useAuth.js";

function ProjectsPage() {
    const {user, logout} = useAuth();

    return (
        <div>
            <h1>Projets</h1>
            <p>Connecté en tant que {user.firstName} {user.lastName} ({user.email})</p>
            <button
                type="button"
                onClick={logout}
            >
                Se déconnecter
            </button>
        </div>
    )
}

export default ProjectsPage;