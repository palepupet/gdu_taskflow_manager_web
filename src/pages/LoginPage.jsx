import { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
} from '@mui/material'
import { useAuth } from '../hooks/useAuth.js'

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
        return <Typography sx={{ p: 3 }}>Chargement...</Typography>;
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
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper sx={{ p: 4, width: '100%' }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{ color: 'text.primary' }}
                    >
                        Connexion
                    </Typography>

                    {infoMessage && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            {infoMessage}
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            id="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            autoComplete="email"
                        />

                        <TextField
                            id="password"
                            label="Mot de passe"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            autoComplete="current-password"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={submitting}
                            sx={{ mt: 2 }}
                        >
                            {submitting ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default LoginPage;