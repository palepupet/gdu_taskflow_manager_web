import { Box, CircularProgress, Typography } from "@mui/material"
import PropTypes from "prop-types"

function Loading({ message = 'Chargement...' }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                p: 3,
            }}
        >
            <CircularProgress />
            <Typography>{message}</Typography>
        </Box>
    );
}

Loading.propTypes = {
    message: PropTypes.string,
}

export default Loading;