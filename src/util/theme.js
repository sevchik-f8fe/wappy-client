/**
 * Material-UI тема приложения
 * 
 * Цветовая схема (палитра):
 * - primary: #a27ae2ff (фиолетовый)
 * - secondary: #df80d5ff (розовый)
 * - linkColor: #2196f3 (синий для ссылок)
 * - success: #61c254ff (зеленый)
 * - error: #f44336 (красный)
 * - hide: #9e9e9e (серый)
 * 
 * Типография:
 * - Основной шрифт: 'Hasking'
 * - Заголовки (h1-h4): шрифт 'Palui', фиолетовый цвет
 * - body1: #F2EBFB, 1em
 * - body2: #9e9e9e, 0.8em
 * 
 * Кастомные стили компонентов:
 * - MuiChip: 4 варианта (tenor, whvn, svg, noun) с уникальными стилями
 *   • Tenor: градиентная обводка
 *   • WHVN: синий边框 на темном фоне
 *   • SVG: желтый фон, черный текст
 *   • Noun: черный фон, белый текст
 * 
 * - MuiButton, MuiTextField, MuiInputLabel, MuiLink и др.
 *   с переопределенными цветами для темной темы
 */

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: '#a27ae2ff',
        },
        secondary: {
            main: '#df80d5ff',
        },
        linkColor: {
            main: '#2196f3',
            contrastText: '#fff',
        },
        success: {
            main: '#61c254ff',
        },
        error: {
            main: '#f44336',
        },
        hide: {
            main: '#9e9e9e',
        },
    },
    typography: {
        fontFamily: 'Hasking',
        h1: {
            color: '#a27ae2ff',
            fontFamily: 'Palui',
            fontSize: '4em',
        },
        h2: {
            color: '#a27ae2ff',
            fontFamily: 'Palui',
            fontSize: '1.5em',
        },
        h3: {
            color: '#a27ae2ff',
            fontFamily: 'Palui',
            fontSize: '1.2em',
        },
        h4: {
            color: '#a27ae2ff',
            fontFamily: 'Palui',
            fontSize: '3em',
        },
        body1: {
            color: '#F2EBFB',
            fontSize: '1em',
            fontWeight: '400',
        },
        body2: {
            fontSize: '.8em',
            color: '#9e9e9e',
        },
        subtitle1: {
            fontSize: '1em',
            fontWeight: '400',
            color: '#F2EBFB',
        }, subtitle2: {
            fontSize: '1em',
            fontWeight: '400',
            color: '#9e9e9e',
        },
        button: {
            color: '#a27ae2ff',
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    "&.Mui-disabled": {
                        color: '#9e9e9e',
                        backgroundColor: '#9e9e9e30',
                    },
                },
                contained: {
                    color: '#F2EBFB',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: '#9e9e9e',
                            color: '#F2EBFB',
                        },
                        borderColor: '#9e9e9e',
                        color: '#F2EBFB',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#9e9e9e',
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    color: '#9e9e9e',
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    fontFamily: 'Hasking',
                    fontSize: '1em',
                    color: '#2196f3',
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    backgroundColor: '#9e9e9e',
                },
            },
        },
        MuiChip: {
            variants: [
                {
                    props: { variant: 'tenor' },
                    style: {
                        backgroundColor: '#0006',
                        cursor: 'pointer',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        height: '28px',
                        borderRadius: '16px',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            padding: '2px',
                            borderRadius: '16px',
                            background: 'linear-gradient(45deg, #00CCFF 0%, #00FF99 33%, #FF00CC 66%, #FF9900 100%)',
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude',
                        },
                        '& .MuiChip-label': {
                            position: 'relative',
                            zIndex: 2,
                            padding: '0 16px',
                            background: 'transparent',
                        },
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            backgroundColor: 'rgba(87, 87, 87, 0.4)',
                            '&:before': {
                                background: 'linear-gradient(45deg, #00CCFF 0%, #00FF99 33%, #FF00CC 66%, #FF9900 100%)',
                            },
                        },
                    },
                },
                {
                    props: { variant: 'whvn' },
                    style: {
                        backgroundColor: 'rgb(31,41,55)',
                        color: 'rgb(96,165,250)',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        height: '28px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: '1px solid rgb(96,165,250)',
                        '&:hover': {
                            backgroundColor: 'rgb(55,65,81)',
                            boxShadow: '0 0 8px rgba(252,211,77,0.3)',
                        },
                        '& .MuiChip-label': {
                            padding: '0 16px',
                        },
                        '&.MuiChip-clickable:hover': {
                            backgroundColor: 'rgb(55,65,81)',
                        },
                    },
                },
                {
                    props: { variant: 'svg' },
                    style: {
                        backgroundColor: 'rgb(255,225,33)',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        cursor: 'pointer',
                        height: '28px',
                        borderRadius: '4px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        '&:hover': {
                            backgroundColor: 'rgba(204, 181, 30, 1)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        },
                        '&:focus': {
                            backgroundColor: 'rgb(255,225,33)',
                            boxShadow: '0 0 0 2px rgba(0,0,0,0.2)',
                        },
                        '& .MuiChip-icon': {
                            color: '#000',
                            fontSize: '16px',
                        },
                    },
                },
                {
                    props: { variant: 'noun' },
                    style: {
                        backgroundColor: '#000',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        cursor: 'pointer',
                        height: '28px',
                        borderRadius: '14px',
                        border: '1px solid #000',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        '&:hover': {
                            backgroundColor: '#333',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        },
                        '& .MuiChip-label': {
                            padding: '0 12px',
                        },
                    },
                },
            ],
        },
    },
});