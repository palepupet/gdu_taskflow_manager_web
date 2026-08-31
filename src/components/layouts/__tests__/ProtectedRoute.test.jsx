import { MemoryRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "../ProtectedRoute.jsx"
import { render, screen } from "@testing-library/react"

const useAuthMock = vi.fn();

vi.mock('../../../hooks/useAuth.js', () => ({
    useAuth: () => useAuthMock(),
}));

function renderWithAuth(authValue, { initialPath = '/projects' } = {}) {
    useAuthMock.mockReturnValue(authValue);

    return render(
      <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
              <Route path="/login" element={<div>Login page</div>} />
              <Route element={<ProtectedRoute /> }>
                  <Route path="/projects" element={<div>Projects page</div>} />
              </Route>
          </Routes>
      </MemoryRouter>
    );
}

describe('ProtectedRoute', () => {
    beforeEach(() => {
        useAuthMock.mockReset();
    });

    it('should display loading while auth is loading', () => {
        renderWithAuth({
            isAuthenticated: false,
            loading: true,
        });

        expect(screen.getByText('Chargement...')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should redirect to login when user is not authenticated', () => {
        renderWithAuth({
            isAuthenticated: false,
            loading: false,
        });

        expect(screen.getByText('Login page')).toBeInTheDocument();
        expect(screen.queryByText('Projects page')).not.toBeInTheDocument();
    });

    it('should render protected content when user is authenticated', () => {
        renderWithAuth({
            isAuthenticated: true,
            loading: false,
        });

        expect(screen.queryByText('Login page')).not.toBeInTheDocument();
        expect(screen.getByText('Projects page')).toBeInTheDocument();
    });
});