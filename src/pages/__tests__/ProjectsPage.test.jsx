import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import ProjectsPage from "../ProjectsPage.jsx"
import { getProjects } from "../../api/projects.js"

vi.mock('../../api/projects.js', () => ({
    getProjects: vi.fn(),
}));

function renderProjectsPage() {
    return render(
        <MemoryRouter>
            <ProjectsPage />
        </MemoryRouter>
    );
}

describe('ProjectsPage', () => {
    beforeEach(() => {
        getProjects.mockReset();
    });

    it('should display loading while projects are being fetched', () => {
        getProjects.mockResolvedValue(new Promise(() => {}));

        renderProjectsPage();

        expect(screen.getByText('Chargement...')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should display the projects returned by the API', async () => {
        getProjects.mockResolvedValue([
            {
                id: 1,
                title: 'Projet un',
                description: 'Description un',
                status: 'en cours',
                isArchived: false,
            },
            {
                id: 2,
                title: 'Projet deux',
                description: '',
                status: 'terminé',
                isArchived: false,
            },
        ]);

        renderProjectsPage();

        expect(await screen.findByText('Projet un')).toBeInTheDocument();
        expect(screen.getByText('Description un')).toBeInTheDocument();
        expect(screen.getByText('Projet deux')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /nouveau projet/i })).toBeInTheDocument();
    });

    it('should display an error when the API fails', async () => {
        getProjects.mockRejectedValue(new Error('Erreur réseau'));

        renderProjectsPage();

        expect(await screen.findByText('Erreur réseau')).toBeInTheDocument();
    })
});