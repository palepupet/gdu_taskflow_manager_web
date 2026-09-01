import { render, screen } from "@testing-library/react"
import Loading from "../Loading.jsx"
import { describe, expect, it } from "vitest"

describe('Loading', () => {
    it('should display default loading text', () => {
       render(<Loading />);

       expect(screen.getByText('Chargement...')).toBeInTheDocument();
    });

    it('should display personalized loading text', () => {
        render(<Loading message="Chargements des projets..." />);

        expect(screen.getByText('Chargements des projets...')).toBeInTheDocument();
    });

    it('should display a loading indicator', () => {
        render(<Loading />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
});