import { Box, CircularProgress, Typography } from "@mui/material"

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

export default Loading;