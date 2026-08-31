import { render, screen } from "@testing-library/react"
import TaskFormDialog from "../TaskFormDialog.jsx"
import { TASK_PRIORITY } from "../../../utils/tasks.js"

const defaultTaskFormValues = {
    open: true,
    onClose: vi.fn(),
    dialogTitle: 'Ajouter une tâche',
    submitLabel: 'Ajouter',
    submitLoadingLabel: 'Ajout en cours...',
    title: '',
    description: '',
    dueAt: '',
    priority: TASK_PRIORITY.MEDIUM,
    onTitleChange: vi.fn(),
    onDescriptionChange: vi.fn(),
    onDueAtChange: vi.fn(),
    onPriorityChange: vi.fn(),
    onSubmit: vi.fn(),
    submitting: false,
    availableTags: [
        { id: 1, label: 'Bug' },
        { id: 2, label: 'Feature' },
    ],

    selectedTagIds: [],
    onSelectedTagIdsChange: vi.fn(),
    error: '',
}

function renderTaskFormDialog(props = {}) {
    return render(<TaskFormDialog {...defaultTaskFormValues} {...props} />);
}

describe('TaskFormDialog', () => {
    it('should not render dialog when closed', () => {
        renderTaskFormDialog({ open: false });

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should display dialog fields when open', () => {
        renderTaskFormDialog();

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Ajouter une tâche')).toBeInTheDocument();
        expect(screen.getByLabelText(/titre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/échéance/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /priorité/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /fermer/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ajouter/i })).toBeInTheDocument();
    });

    it('should display provided values and selected tags', () => {
        renderTaskFormDialog({
            title: 'Corriger le login',
            description: 'Bug sur le formulaire',
            dueAt: '2026-08-31',
            priority: TASK_PRIORITY.HIGH,
            selectedTagIds: [1],
        });

        expect(screen.getByLabelText(/titre/i)).toHaveValue('Corriger le login');
        expect(screen.getByLabelText(/description/i)).toHaveValue('Bug sur le formulaire');
        expect(screen.getByLabelText(/échéance/i)).toHaveValue('2026-08-31');
        expect(screen.getByText('Bug')).toBeInTheDocument();
    });

    it('should display error message', () => {
        renderTaskFormDialog({ error: 'Le titre est obligatoire' });

        expect(screen.getByText('Le titre est obligatoire')).toBeInTheDocument();
    });

    it('should disable submit button and show loading label when submitting', () => {
        renderTaskFormDialog({ submitting: true });

        const submitButton = screen.getByRole('button', { name: /ajout en cours/i });

        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent('Ajout en cours...');
    });
});