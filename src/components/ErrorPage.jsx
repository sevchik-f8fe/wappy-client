/**
 * Страница ошибки 404 (Not Found)
 * 
 * Отображается при переходе на несуществующий маршрут
 * 
 * Особенности:
 * - Красная цветовая схема (#cf3737ff)
 * - Дружелюбное сообщение об ошибке
 * - Адаптивный дизайн:
 *   • Десктоп: полупрозрачный фон с блюром, граница
 *   • Мобильные: прозрачный фон, отступы
 * - Кнопка возврата на главную
 * 
 * Используемые хуки:
 * - useNavigate: для программной навигации
 * - useMediaQuery: для адаптивности (breakpoint 'md')
 * 
 * Стилизация:
 * - Заголовок "ОЙ!" (2.5em, жирный)
 * - Поясняющий текст с эмодзи :)
 */

import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import React from 'react'; //for tests
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const ErrorPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{
            backgroundColor: !isMobile ? '#2a262eb0' : 'tranparent',
            backdropFilter: 'blur(10px)',
            border: !isMobile ? '1px solid #cf3737ff' : '0',
            borderRadius: '1em',
            p: !isMobile ? '1em' : '1em 2em',
            maxWidth: !isMobile ? '80%' : '100%',
            minWidth: !isMobile ? '80%' : '100%',
            m: isMobile ? '2em auto 1em auto' : '6em auto 2em auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1em',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            <Typography sx={{ color: '#cf3737ff', fontSize: '2.5em', fontWieght: '900' }}>ОЙ!</Typography>
            <Typography sx={{ color: '#cf3737ff', fontSize: '1em', fontWieght: '600', mb: '1em' }}>Похоже, что вы свернули с намеченного пути, но ещё рано переживать, ведь вы всегдда можете вернуться домой :)</Typography>
            <Button color="error" variant="outlined" onClick={() => navigate('/')}>вернуться домой</Button>
        </Box>
    );
}

export default ErrorPage;