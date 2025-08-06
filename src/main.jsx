import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout.jsx";
import SpacePage from "./routes/SpacePage.jsx";
import { SessionProvider } from "./components/SessionProvider";
import SpaceMenuPage from "./routes/SpaceMenuPage.jsx";
import LoginPage from "./routes/LoginPage.jsx";
import RegisterPage from "./routes/RegisterPage.jsx";
import ProfilePage from "./routes/ProfilePage.jsx";
import { AuthProvider } from './contexts/AuthContext.js';

createRoot(document.getElementById("root")).render(
  //<StrictMode>
  <AuthProvider>
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="space" element={<SpacePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
        <Toaster position="bottom-center" />
      </BrowserRouter>
    </SessionProvider>
  </AuthProvider>

  //</StrictMode>,
);
