/**
 * Конфигурация Redux Persist для сохранения состояния приложения
 * 
 * Особенности:
 * - Хранилище: sessionStorage (данные живут до закрытия вкладки)
 * - Шифрование: AES-шифрование с использованием encryptTransform
 * - Ключ шифрования: из переменной окружения VITE_CRYPTO_KEY
 * - Обработка ошибок: автоматическая очистка хранилища при ошибках дешифрования
 * 
 * Persist конфигурация:
 * - key: "user" - ключ для хранения
 * - version: 1 - версия схемы данных
 * - storage: sessionStorage - тип хранилища
 * 
 * Объединенные редюсеры:
 * - global (persisted), auth, dashboard, header, changeEmail, item
 * 
 * Отключена сериализуемость для поддержки несериализуемых значений
 */

import sessionStorage from "redux-persist/lib/storage/session";
import { persistStore, persistReducer } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import { encryptTransform } from 'redux-persist-transform-encrypt';

import { dashboardReducer } from "../pages/DashboardPage/DashboardSlice";
import { globalReducer } from "../util/globalSlice";
import { authReducer } from "../pages/SignUpPage/AuthSlice";
import { headerReducer } from "../components/HeaderSlice";
import { chnageEmailReducer } from "../pages/ChangeEmailPage/ChenageEmailSlice";
import { itemReducer } from "../pages/ItemPage/ItemSlice";

const persistConfig = {
    key: "user",
    version: 1,
    storage: sessionStorage,
    transforms: [
        encryptTransform({
            secretKey: '019a1d16-0ca4-7555-a814-bb733993cde7',
            onError: function (error) {
                if (error.message.includes("decrypt")) {
                    sessionStorage.removeItem("persist:user");
                }
            },
        }),
    ],
};

const persistedReducer = persistReducer(persistConfig, globalReducer);

export const store = configureStore({
    reducer: {
        global: persistedReducer,
        auth: authReducer,
        dashboard: dashboardReducer,
        header: headerReducer,
        changeEmail: chnageEmailReducer,
        item: itemReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);