import {useState} from "react";
import {login} from "../api/auth.js";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            await login(email, password);
            setSuccess(true);
        } catch (err) {
            if (err.message.includes('401')) {
                setError('Email ou mot de passe incorrect');
            } else {
                setError('Impossible de se connecter. Réessayez plus tard.');
            }
        } finally {
            setLoading(false);
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
                    disabled={loading}
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>

            {error && <p style={{color: 'red'}}>{error}</p>}
            {success && <p style={{ color: 'green' }}>Connexion réussie.</p>}
        </div>
    )
}

export default LoginPage;