import { BrowserRouter, Routes, Route } from "react-router-dom";
import ToastProvider from "./components/notifications/ToastProvider";
import "./App.css";
import RegistrationPage from "./pages/auth/Register";
import LoginPage from "./pages/auth/Login";
import ActivationPage from "./pages/auth/ActivationPage";
import ForgotPasswordPage from "./pages/auth/ForgotPassword";
import ResetPasswordPage from "./pages/auth/ResetPassword";
import AppLayout from "./pages/main/AppLayout";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Profile from "./pages/user/Profile";

function App() {
  return (
    <>
      <Provider store={store}>
        <ToastProvider />
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/activate/:token" element={<ActivationPage />} />
            <Route path="/reset-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="/home" element={<AppLayout />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
