import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import ProjectForm from "../ProjectForm.jsx"

const defaultProjectFormValues = {
    title: '',
    description: '',
    startAt: '',
    endAt: '',
    onTitleChange: vi.fn(),
    onDescriptionChange: vi.fn(),
    onStartAtChange: vi.fn(),
    onEndAtChange: vi.fn(),
    onSubmit: vi.fn((e) => e.preventDefault()),
    submitting: false,
    submitLabel: 'Créer',
    submittingLabel: 'Création...',
    backTo: '/projects',
}

function renderProjectForm(props = {}) {
    return render(
        <MemoryRouter>
            <ProjectForm {...defaultProjectFormValues} {...props} />
        </MemoryRouter>
    );
}

describe('ProjectForm', () => {
    it('should display all form fields', () => {
        renderProjectForm();

        expect(screen.getByLabelText(/titre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/date de début/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/date de fin/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /créer/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /annuler/i })).toHaveAttribute('href', '/projects');
    });

    it('should display provided values', () => {
        renderProjectForm({
            title: 'Mon projet',
            description: 'Ma description',
        });

        expect(screen.getByLabelText(/titre/i)).toHaveValue('Mon projet');
        expect(screen.getByLabelText(/description/i)).toHaveValue('Ma description');
    });
});