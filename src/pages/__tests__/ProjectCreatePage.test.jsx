import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import ProjectCreatePage from "../ProjectCreatePage.jsx"
import { createProject } from "../../api/projects.js"

const navigateMock = vi.fn();

vi.mock('../../api/projects.js', () => ({
    createProject: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => navigateMock,
    }
});

function renderProjectCreatePage() {
    return render(
        <MemoryRouter>
            <ProjectCreatePage />
        </MemoryRouter>
    );
}

describe('ProjectCreatePage', () => {
    beforeEach(() => {
        createProject.mockReset();
        navigateMock.mockReset();
    });

    it('should create project and navigate on successful submit', async () => {
        const user = userEvent.setup();
        createProject.mockResolvedValue({ id: 42, title: 'Mon nouveau projet' });

        renderProjectCreatePage();

        await user.type(screen.getByLabelText(/titre/i), 'Mon nouveau projet');
        await user.type(screen.getByLabelText(/description/i), 'Ma description');
        await user.click(screen.getByRole('button', { name: /créer/i }));

        expect(createProject).toHaveBeenCalledWith({
            title: 'Mon nouveau projet',
            description: 'Ma description',
            startAt: null,
            endAt: null,
        });
        expect(navigateMock).toHaveBeenCalledWith('/projects/42');
    });

    it('should display the create project page', () => {
        renderProjectCreatePage();

        expect(screen.getByRole('heading', { name: /nouveau projet/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/titre/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /créer/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /annuler/i })).toHaveAttribute('href', '/projects');
    })

    it('should show validation error when title is only whitespace', async () => {
        const user = userEvent.setup();
        renderProjectCreatePage();

        await user.type(screen.getByLabelText(/titre/i), '   ');
        await user.click(screen.getByRole('button', { name: /créer/i }));

        expect(await screen.findByText('Le titre est obligatoire')).toBeInTheDocument();
        expect(createProject).not.toHaveBeenCalled();
    });

    it('should show validation error when end date is before start date', async () => {
        const user = userEvent.setup();
        renderProjectCreatePage();

        await user.type(screen.getByLabelText(/titre/i), 'Mon projet');

        fireEvent.change(screen.getByLabelText(/date de début/i), {
            target: { value: '2026-08-27' },
        });

        fireEvent.change(screen.getByLabelText(/date de fin/i), {
            target: { value: '2026-08-01' },
        });

        await user.click(screen.getByRole('button', { name: /créer/i }));

        expect(await screen.findByText('La date de fin doit être après la date de début.')).toBeInTheDocument();
        expect(createProject).not.toHaveBeenCalled();
    });

    it('should display an error when the API fails', async () => {
        const user = userEvent.setup();
        createProject.mockRejectedValue(new Error('Erreur serveur'));

        renderProjectCreatePage();

        await user.type(screen.getByLabelText(/titre/i), 'Mon projet');
        await user.click(screen.getByRole('button', { name: /créer/i }));

        expect(await screen.findByText('Erreur serveur')).toBeInTheDocument();
        expect(navigateMock).not.toHaveBeenCalled();
    });
});