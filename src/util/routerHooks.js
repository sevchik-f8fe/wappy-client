/**
 * Хуки для управления маршрутизацией и навигацией
 * 
 * Компонент ScrollToTop выполняет:
 * 
 * 1. Защита маршрутов:
 *    - Проверяет доступ к /change_email, /favorites, /history
 *    - Перенаправляет на '/' если пользователь не авторизован
 * 
 * 2. Сброс состояния на страницах аутентификации:
 *    - При переходе на /signin или /signup:
 *      • Сбрасывает таймер (120 сек)
 *      • Очищает код подтверждения
 *      • Сбрасывает шаг (step: 0)
 *      • Сбрасывает флаги подтверждения (confOk, persOk)
 * 
 * 3. Прокрутка вверх:
 *    - Для всех страниц кроме '/', '/item', '/favorites', '/history'
 *    - Плавная прокрутка к началу страницы
 * 
 * Зависимости: React Router DOM (useLocation, useNavigate), Redux
 */

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setSimpleField } from "../pages/SignUpPage/AuthSlice";

export const ScrollToTop = () => {
    const { user, token } = useSelector((state) => state.global);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const dispatch = useDispatch();

    useEffect(() => {
        if (pathname == '/change_email' || pathname == '/favorites' || pathname == '/history') {
            if (user == null || token == null) navigate('/')
        }
    }, [pathname, user, token, navigate])

    useEffect(() => {
        if (pathname == '/signin' || pathname == '/signup') {
            dispatch(setSimpleField({ field: 'timer', value: 120 }));
            dispatch(setSimpleField({ field: 'code', value: '' }));
            dispatch(setSimpleField({ field: 'step', value: 0 }));
            dispatch(setSimpleField({ field: 'confOk', value: false }));
            dispatch(setSimpleField({ field: 'persOk', value: false }));
        }

        if (pathname != '/' && pathname != '/item' && pathname != '/favorites' && pathname != '/history') {
            window.scrollTo(0, 0);
        }
    }, [pathname, dispatch]);
    return null;
}