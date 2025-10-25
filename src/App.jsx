import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import SignUpPage from "./pages/SignUpPage/SignUpPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import { ToastContainer, Bounce } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";

import { ScrollToTop } from "./util/routerHooks";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Background from "./components/Background";
import ItemPage from "./pages/ItemPage/ItemPage";
import FavoritePage from "./pages/FavoritePage/FavoritePage";
import HistoryPage from "./pages/HistoryPage/HistoryPage";
import { store, persistor } from "./util/persist";
import ChangeEmailPage from "./pages/ChangeEmailPage/ChangeEmailPage";

const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <ScrollToTop />
          <Background />
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
          </Routes>
          <Footer />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  );
}

export default App;