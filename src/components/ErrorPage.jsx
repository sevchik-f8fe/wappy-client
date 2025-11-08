import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{
            backgroundColor: '#2a262eb0',
            backdropFilter: 'blur(10px)',
            border: '1px solid #cf3737ff',
            borderRadius: '1em',
            p: '1em',
            maxWidth: '80%',
            minWidth: '80%',
            m: '6em auto 2em auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1em',
            alignItems: 'center'
        }}>
            <Typography sx={{ color: '#cf3737ff', fontSize: '2.5em', fontWieght: '900' }}>ОЙ!</Typography>
            <Typography sx={{ color: '#cf3737ff', fontSize: '1em', fontWieght: '600', mb: '2em' }}>Похоже, что вы свернули с намеченного пути, но ещё рано переживать, ведь вы всегдда можете вернуться домой :)</Typography>
            <Button color="error" variant="outlined" onClick={() => navigate('/')}>вернуться домой</Button>
        </Box>
    );
}

export default ErrorPage;