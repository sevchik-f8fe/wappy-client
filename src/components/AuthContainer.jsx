import React from 'react'; //for test

import { Box, Divider, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AuthContainer = ({ text, link, href, children }) => {
    const navigate = useNavigate();
    return (
        <Box sx={{ backgroundColor: '#2a262eb0', backdropFilter: 'blur(10px)', border: '1px solid #D4BBFC', borderRadius: '1em', p: '1em', maxWidth: '80%', minWidth: '80%', m: '4em auto 2em auto' }}>
            <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                <Typography onClick={() => navigate('/')} sx={{ cursor: 'pointer' }} gutterBottom variant="h2">ваппи</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1">{text} </Typography> <Link sx={{ cursor: 'pointer', ml: '.5em' }} onClick={() => navigate(href)}>{link}</Link>
                </Box>
            </Box>

            <Divider />
            {children}
        </Box>
    );
}

export default AuthContainer;