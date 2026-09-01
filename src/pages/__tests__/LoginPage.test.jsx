import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import LoginPage from "../LoginPage.jsx"
import { beforeEach, describe, expect, it, vi } from "vitest"

const loginMock = vi.fn();
const navigateMock = vi.fn();

vi.mock('../../hooks/useAuth.js', () => ({
    useAuth: () => ({
        login: loginMock,
        isAuthenticated: false,
        loading: false,
    }),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => navigateMock,
    }
});

function renderLoginPage() {
    return render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>
    );
}

describe('LoginPage', () => {
    beforeEach(() => {
        loginMock.mockReset();
        navigateMock.mockReset();
    });

    it('should display login form', () => {
        renderLoginPage();

        expect(screen.getByRole('heading', { name: /connexion/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });

    it('should submit the form with email and password', async () => {
        renderLoginPage();

        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/email/i), 'manager@taskflow.fr');
        await user.type(screen.getByLabelText(/mot de passe/i), 'TaskFlowManager123');
        await user.click(screen.getByRole('button', { name: /se connecter/i }));

        expect(loginMock).toHaveBeenCalledWith(
            'manager@taskflow.fr',
            'TaskFlowManager123'
        );
        expect(navigateMock).toHaveBeenCalledWith('/projects');
    })

    it('should display an error when the API denies login', async () => {
        loginMock.mockRejectedValue(new Error('Erreur HTTP 401'));
        const user = userEvent.setup();

        renderLoginPage();

        await user.type(screen.getByLabelText(/email/i), 'wrong@taskflow.fr');
        await user.type(screen.getByLabelText(/mot de passe/i), 'bad-password');
        await user.click(screen.getByRole('button', { name: /se connecter/i }));

        expect(await screen.findByText('Email ou mot de passe incorrect')).toBeInTheDocument();
    });
});