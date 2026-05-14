/**
 * Контейнер для форм аутентификации (вход/регистрация)
 * 
 * Компонент-обертка с:
 * - Стеклянным эффектом (backdropFilter: blur)
 * - Фиолетовой границей и скругленными углами
 * - Адаптивной шириной (80% на десктопе, 100% на мобильных)
 * - Заголовком "ваппи" с навигацией на главную
 * - Ссылкой для переключения между страницами (вход/регистрация)
 * - Разделителем (Divider) только на десктопе
 * 
 * Props:
 * @param {string} text - Текст перед ссылкой (например, "Нет аккаунта?")
 * @param {string} link - Текст ссылки (например, "Регистрация")
 * @param {string} href - Путь для навигации при клике на ссылку
 * @param {ReactNode} children - Дочерние элементы (поля формы, кнопки)
 * 
 * Адаптивность:
 * - breakpoint 'md' (900px) переключает между десктопной и мобильной версией
 */

import React from 'react'; //for test
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Divider, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AuthContainer = ({ text, link, href, children }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Box sx={{
            backgroundColor: '#2a262eb0',
            backdropFilter: 'blur(10px)',
            border: '1px solid #D4BBFC',
            borderRadius: '1em', p: '1em',
            maxWidth: !isMobile ? '80%' : '100%',
            minWidth: !isMobile ? '80%' : '100%',
            m: '4em auto 2em auto'
        }}>
            <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                <Typography onClick={() => navigate('/')} sx={{ cursor: 'pointer' }} gutterBottom variant="h2">ваппи</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {!isMobile && <Typography variant="body1">{text} </Typography>}<Link sx={{ cursor: 'pointer', ml: '.5em' }} onClick={() => navigate(href)}>{link}</Link>
                </Box>
            </Box>

            {!isMobile && <Divider />}
            {children}
        </Box>
    );
}

export default AuthContainer;