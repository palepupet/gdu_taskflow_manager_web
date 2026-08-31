import { render, screen } from "@testing-library/react"
import NotifyAlert from "../NotifyAlert.jsx"

describe('NotifyAlert', () => {
    it('should display an error message by default', () => {
        render(<NotifyAlert message="Une erreur est survenue" />);

        const alert = screen.getByRole('alert');

        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent('Une erreur est survenue');
    })

    it('should display a warning message when severity is warning', () => {
        render(
            <NotifyAlert
                message="Session expirée."
                severity="warning"
            />
        );

        expect(screen.getByRole('alert')).toHaveTextContent('Session expirée.');
    });
});