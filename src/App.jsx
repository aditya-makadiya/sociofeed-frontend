import "./App.css";
import RegistrationPage from "./pages/auth/Register";
import LoginPage from "./pages/auth/Login";
import ActivationPage from "./pages/auth/ActivationPage";
import ForgotPasswordPage from "./pages/auth/ForgotPassword";
import ResetPasswordPage from "./pages/auth/ResetPassword";
import Home from "./pages/main/Home";
import ProfilePage from "./pages/user/ProfilePage";
import AppShell from "./components/layout/Appshell";
import ExplorePage from "./pages/main/ExplorePage";
import SavedPostsPage from "./pages/user/SavedPostsPage";
import CreatePostPage from "./pages/main/CreatePostPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/activate/:token" element={<ActivationPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/saved" element={<SavedPostsPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
