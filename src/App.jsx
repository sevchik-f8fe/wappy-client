/**
 * Корневой компонент приложения
 * 
 * Отвечает за:
 * - Настройку маршрутизации (React Router)
 * - Подключение Redux store и PersistGate для сохранения состояния
 * - Глобальные компоненты (Header, Footer, ToastContainer)
 * - Защиту маршрутов через ScrollToTop
 * 
 * Структура приложения:
 * 1. BrowserRouter с basename="wappy-client" - базовая маршрутизация
 * 2. Redux Provider - доступ к глобальному состоянию
 * 3. PersistGate - восстановление сохраненного состояния при загрузке
 * 4. ScrollToTop - управление прокруткой и защита маршрутов
 * 5. Header - шапка приложения (везде)
 * 6. ToastContainer - глобальные уведомления
 * 7. Routes - маршруты страниц:
 *    - /signin - вход
 *    - /signup - регистрация
 *    - / - главная (дашборд)
 *    - /item - страница элемента
 *    - /favorites - избранное
 *    - /history - история
 *    - /change_email - смена email
 *    - * - 404 ошибка
 * 8. Footer - подвал приложения (везде)
 * 
 * Зависимости: React Router, Redux, Redux Persist, React Toastify
 */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import React from 'react'; // for tests

import SignUpPage from "./pages/SignUpPage/SignUpPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import { ToastContainer, Bounce } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";

import { ScrollToTop } from "./util/routerHooks";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ItemPage from "./pages/ItemPage/ItemPage";
import FavoritePage from "./pages/FavoritePage/FavoritePage";
import HistoryPage from "./pages/HistoryPage/HistoryPage";
import { store, persistor } from "./util/persist";
import ChangeEmailPage from "./pages/ChangeEmailPage/ChangeEmailPage";
import ErrorPage from "./components/ErrorPage";

const App = () => {
    return (
        <BrowserRouter basename="wappy-client">
            <Provider store={store}>
                <PersistGate persistor={persistor} loading={null}>
                    <ScrollToTop />
                    <Header />
                    <ToastContainer
                        position="top-center"
                        autoClose={3000}
                        hideProgressBar={true}
                        newestOnTop={false}
                        closeOnClick={false}
                        rtl={false}
                        draggable
                        theme="dark"
                        transition={Bounce}
                    />
                    <Routes>
                        <Route path="/signin" element={<SignInPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/item" element={<ItemPage />} />
                        <Route path="/favorites" element={<FavoritePage />} />
                        <Route path="/history" element={<HistoryPage />} />
                        <Route path="/change_email" element={<ChangeEmailPage />} />
                        <Route path="*" element={<ErrorPage />} />
                    </Routes>
                    <Footer />
                </PersistGate>
            </Provider>
        </BrowserRouter>
    );
}

export default App;