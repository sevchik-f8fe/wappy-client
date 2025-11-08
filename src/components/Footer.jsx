import { Box, Typography, Button, Divider, Link } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <>
            {(pathname == '/signin' || pathname == '/signup' || pathname == '/' || pathname == '/item' || pathname == '/favorites' || pathname == '/history' || pathname == '/change_email') && (
                <Box
                    sx={{
                        backgroundColor: '#2a262eb0',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid #D4BBFC',
                        borderRadius: '1em', p: '1em',
                        minWidth: '80%',
                        maxWidth: '80%',
                        m: '2em auto',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2em 4em',
                        justifyContent: 'space-between',
                        gap: '1em'
                    }
                    }
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '1em', justifyContent: 'center' }}>
                        <Typography onClick={() => navigate('/')} sx={{ cursor: 'pointer' }} variant="h2">ваппи</Typography>
                        <Typography variant="body2">твой проводник в мире медиа</Typography>
                        <Button onClick={() => {
                            if (pathname != '/') navigate('/')
                            else window.scrollTo(0, 0);
                        }} color="primary" variant="contained">поиск</Button>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        gap: '2em'
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5em' }}>
                            <Button target="_blank" component='a' href='https://github.com/sevchik-f8fe/wappy-client' variant="text" color="hide" size="small">GitHub</Button>
                            <Button target="_blank" component='a' href='mailto:kononovseva06@yandex.ru' variant="text" color="hide" size="small">эл. почта</Button>
                        </Box>
                    </Box>

                </Box>
            )}
        </>
    );
}

export default Footer;