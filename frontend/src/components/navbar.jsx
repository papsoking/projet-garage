import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark garage-navbar py-3">
        <div className="container">
            <Link
                className="navbar-brand garage-brand d-flex align-items-center gap-2"
                to="/"
            >
                <span
                    className="bg-white text-dark rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: "2rem", height: "2rem" }}
                >
                    <i className="bi bi-tools"></i>
                </span>
                Mini Garage
            </Link>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#garageNav"
                aria-controls="garageNav"
                aria-expanded="false"
                aria-label="Basculer la navigation"
                onClick={toggleNavbar}
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${isExpanded ? "show" : ""}`} id="garageNav">
                <ul className="navbar-nav ms-auto nav-pills gap-2">
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${location.pathname === "/vehicules" ? "active" : ""}`}
                            to="/vehicules"
                        >
                            <i className="bi bi-car-front me-1"></i>Véhicules
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${location.pathname === "/reparations" ? "active" : ""}`}
                            to="/reparations"
                        >
                            <i className="bi bi-wrench-adjustable-circle me-1"></i>Réparations
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${location.pathname === "/techniciens" ? "active" : ""}`}
                            to="/techniciens"
                        >
                            <i className="bi bi-people me-1"></i>Techniciens
                        </Link>
                    </li>
                    <li className="nav-item d-flex align-items-center ms-lg-3 mt-2 mt-lg-0">
                        <span className="text-white-50 small me-2 d-none d-lg-inline">
                            <i className="bi bi-person-circle me-1"></i>
                            {user?.name || "Admin"}
                        </span>
                        <button
                            type="button"
                            className="btn btn-outline-light btn-sm"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-box-arrow-right me-1"></i>Déconnexion
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  );
}