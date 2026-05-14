/**
 * Точка входа в React-приложение
 * 
 * Выполняет:
 * - Монтирование React-приложения в DOM элемент с id="root"
 * - Подключение глобальной темы Material-UI (ThemeProvider)
 * - Импорт стилей (index.css)
 * 
 * Порядок оберток (от внешней к внутренней):
 * 1. StrictMode - дополнительная проверка кода в development режиме
 * 2. ThemeProvider - MUI тема (цвета, типографика, компоненты)
 * 3. App - корневой компонент приложения
 * 
 * Особенности:
 * - Используется React 18+ (createRoot API)
 * - StrictMode помогает обнаружить потенциальные проблемы
 * - Тема импортируется из ./util/theme.js
 * 
 * Потенциальные улучшения:
 * - Можно добавить ErrorBoundary для отлова ошибок
 * - Можно добавить аналитику или логирование при монтировании
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '@emotion/react'
import { theme } from './util/theme.js'

createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
)
