import { Box, Typography, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    return (
        < Box
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
                <Button color="primary" variant="contained">поиск</Button>
            </Box>
            <Box sx={{
                display: 'flex',
                gap: '2em'
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5em' }}>
                    <Typography variant="body2">ПЛАТФОРМА</Typography>
                    <Divider />
                    <Button variant="text" color="hide" size="small">возможности</Button>
                    <Button variant="text" color="hide" size="small">цель</Button>
                    <Button variant="text" color="hide" size="small">планы</Button>
                    <Button variant="text" color="hide" size="small">политика конф.</Button>
                    <Button variant="text" color="hide" size="small">рук. пользователя</Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5em' }}>
                    <Typography variant="body2">ПОДДЕРЖКА</Typography>
                    <Divider />
                    <Button variant="text" color="hide" size="small">Телеграмм</Button>
                    <Button variant="text" color="hide" size="small">Вконтакте</Button>
                    <Button variant="text" color="hide" size="small">макс</Button>
                    <Button variant="text" color="hide" size="small">эл. почта</Button>

                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5em' }}>
                    <Typography variant="body2">ПРОЕКТ</Typography>
                    <Divider />
                    <Button variant="text" color="hide" size="small">React</Button>
                    <Button variant="text" color="hide" size="small">api</Button>
                    <Button variant="text" color="hide" size="small">MUI</Button>
                    <Button variant="text" color="hide" size="small">Exspress js</Button>
                    <Button variant="text" color="hide" size="small">Redux</Button>

                </Box>
            </Box>

        </ Box>
    );
}

export default Footer;