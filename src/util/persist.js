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
            secretKey: import.meta.env.VITE_CRYPTO_KEY,
            onError: function (error) {
                console.error("Encryption error:", error);
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