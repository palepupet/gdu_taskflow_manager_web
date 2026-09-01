import { render, screen } from "@testing-library/react"
import TagFormDialog from "../TagFormDialog.jsx"
import { describe, expect, it, vi } from "vitest"

const defaultTagFormValues = {
    open: true,
    onClose: vi.fn(),
    dialogTitle: 'Ajouter un tag',
    submitLabel: 'Créer',
    submitLoadingLabel: 'Création...',
    label: '',
    onLabelChange: vi.fn(),
    onSubmit: vi.fn(),
    submitting: false,
    error: '',
}

function renderTagFormDialog(props = {}) {
    return render(<TagFormDialog {...defaultTagFormValues} {...props} />);
}

describe('TagFormDialog', () => {
    it('should not render dialog when closed', () => {
        renderTagFormDialog({ open: false });

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should display dialog fields in create mode', () => {
        renderTagFormDialog();

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Ajouter un tag')).toBeInTheDocument();
        expect(screen.getByLabelText(/libellé/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /fermer/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /créer/i })).toBeInTheDocument();
    });

    it('should display dialog fields in edit mode', () => {
        renderTagFormDialog({
            dialogTitle: 'Modifier le tag',
            submitLabel: 'Enregistrer',
            submitLoadingLabel: 'Enregistrement...',
            label: 'Bug',
        });

        expect(screen.getByText('Modifier le tag')).toBeInTheDocument();
        expect(screen.getByLabelText(/libellé/i)).toHaveValue('Bug');
        expect(screen.getByRole('button', { name: /enregistrer/i })).toBeInTheDocument();
    });

    it('should display error message', () => {
        renderTagFormDialog({ error: 'Le libellé est obligatoire' });

        expect(screen.getByText('Le libellé est obligatoire')).toBeInTheDocument();
    });
});