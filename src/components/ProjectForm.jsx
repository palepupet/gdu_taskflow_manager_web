import {Box, Button, Container, TextField} from "@mui/material"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

function ProjectForm({
    title,
    description,
    startAt,
    endAt,
    onTitleChange,
    onDescriptionChange,
    onStartAtChange,
    onEndAtChange,
    onSubmit,
    submitting,
    submitLabel,
    submittingLabel,
    backTo,
}) {
    return (
        <Container maxWidth="sm" disableGutters>
            <Box component="form" onSubmit={onSubmit} sx={{ maxWidth: 560 }}>
                <TextField
                    label="Titre"
                    value={title}
                    onChange={onTitleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={onDescriptionChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                />
                <TextField
                    label="Date de début"
                    type="date"
                    value={startAt}
                    onChange={onStartAtChange}
                    fullWidth
                    margin="normal"
                    slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                    label="Date de fin"
                    type="date"
                    value={endAt}
                    onChange={onEndAtChange}
                    fullWidth
                    margin="normal"
                    slotProps={{ inputLabel: { shrink: true } }}
                />

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? submittingLabel : submitLabel}
                    </Button>
                    <Button component={Link} to={backTo} variant="outlined">
                        Annuler
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

ProjectForm.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    startAt: PropTypes.string.isRequired,
    endAt: PropTypes.string.isRequired,
    onTitleChange: PropTypes.func.isRequired,
    onDescriptionChange: PropTypes.func.isRequired,
    onStartAtChange: PropTypes.func.isRequired,
    onEndAtChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    submitLabel: PropTypes.string.isRequired,
    submittingLabel: PropTypes.string.isRequired,
    backTo: PropTypes.string.isRequired,
}

export default ProjectForm