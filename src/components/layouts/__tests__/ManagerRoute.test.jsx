import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import ManagerRoute from "../ManagerRoute.jsx"

const useAuthMock = vi.fn()

vi.mock('../../../hooks/useAuth.js', () => ({
    useAuth: () => useAuthMock()
}));

const managerUser = {
    id: 1,
    email: 'manager@taskflow.fr',
    roles: ['ROLE_MANAGER'],
}

const regularUser = {
    id: 2,
    email: 'user@taskflow.fr',
    roles: ['ROLE_USER'],
}

function renderManagerRoute({ initialPath = '/users' } = {}) {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
                <Route path="/projects" element={<div>Projects page</div>} />
                <Route element={<ManagerRoute />}>
                    <Route path="/users" element={<div>Users page</div>} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
}

describe('ManagerRoute', () => {
    beforeEach(() => {
        useAuthMock.mockReset();
    });

    it('should display loading while auth is loading', () => {
        useAuthMock.mockReturnValue({
            user: null,
            loading: true,
        });

        renderManagerRoute();

        expect(screen.getByText('Chargement...')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    })

    it('should redirect to projects when user is not a manager', () => {
        useAuthMock.mockReturnValue({
            user: regularUser,
            loading: false,
        });

        renderManagerRoute();

        expect(screen.getByText('Projects page')).toBeInTheDocument();
        expect(screen.queryByText('Users page')).not.toBeInTheDocument();
    })

    it('should render manager content when user is a manager', () => {
        useAuthMock.mockReturnValue({
            user: managerUser,
            loading: false,
        });

        renderManagerRoute();

        expect(screen.getByText('Users page')).toBeInTheDocument();
        expect(screen.queryByText('Projects page')).not.toBeInTheDocument();
    });
});