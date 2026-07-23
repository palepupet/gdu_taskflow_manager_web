import {useState} from "react";
import {useAuth} from "../hooks/useAuth.js";
import {Navigate, useLocation, useNavigate} from "react-router-dom";

function LoginPage() {
    const {login, isAuthenticated, loading} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const infoMessage = location.state?.message;

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (isAuthenticated) {
        return <Navigate to="/projects" />;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError('');
        setSubmitting(true);

        try {
            await login(email, password);
            navigate('/projects');
        } catch (err) {
            if (err.message.includes('401')) {
                setError('Email ou mot de passe incorrect');
            } else {
                setError('Impossible de se connecter. Réessayez plus tard.');
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div>
            <h1>Connexion</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                >
                    {submitting ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>

            {infoMessage && <p style={{color: 'orange'}}>{infoMessage}</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    )
}

export default LoginPage;