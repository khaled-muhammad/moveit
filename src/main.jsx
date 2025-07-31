import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout.jsx";
import SpacePage from "./routes/SpacePage.jsx";
import { SessionProvider } from "./components/SessionProvider";

createRoot(document.getElementById("root")).render(
  //<StrictMode>
  <SessionProvider>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="space" element={<SpacePage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  </SessionProvider>

  //</StrictMode>,
);
