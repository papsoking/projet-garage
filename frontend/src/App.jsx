// src/App.jsx

import { useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import AppRoute from "./Routes/routes";
import "./App.css";

export default function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <div className={hideNavbar ? "" : "container py-4 py-lg-5"}>
        {/* Contenu des routes */}
        <AppRoute />
      </div>
    </div>
  );
}