import { Routes, Route } from "react-router-dom";
import Home from "../Pages/home";
import Login from "../Pages/login";
import ProtectedRoute from "../components/ProtectedRoute";
import Vehicules from "../Pages/vehicules/vehicules";
import VehiculeDetails from "../Pages/vehicules/VehiculeDetails";
import VehiculeForm from "../Pages/vehicules/VehiculeForm";
import Techniciens from "../Pages/techniciens/Techniciens";
import TechnicienDetails from "../Pages/techniciens/TechnicienDetails";
import TechnicienForm from "../Pages/techniciens/TechnicienForm";
import Reparations from "../Pages/reparations/Reparations";
import ReparationDetails from "../Pages/reparations/ReparationDetails";
import ReparationForm from "../Pages/reparations/ReparationForm";

export default function AppRoute() {
  return (
    <Routes>
      {/* Connexion (publique) */}
      <Route path="/login" element={<Login />} />

      {/* Accueil */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

      {/* Véhicules */}
      <Route path="/vehicules" element={<ProtectedRoute><Vehicules /></ProtectedRoute>} />
      <Route path="/vehicules/:id" element={<ProtectedRoute><VehiculeDetails /></ProtectedRoute>} />
      <Route path="/vehicules/edit/:id" element={<ProtectedRoute><VehiculeForm /></ProtectedRoute>} />
      <Route path="/vehicules/create" element={<ProtectedRoute><VehiculeForm /></ProtectedRoute>} />

      {/* Techniciens */}
      <Route path="/techniciens" element={<ProtectedRoute><Techniciens /></ProtectedRoute>} />
      <Route path="/techniciens/:id" element={<ProtectedRoute><TechnicienDetails /></ProtectedRoute>} />
      <Route path="/techniciens/edit/:id" element={<ProtectedRoute><TechnicienForm /></ProtectedRoute>} />
      <Route path="/techniciens/create" element={<ProtectedRoute><TechnicienForm /></ProtectedRoute>} />

      {/* Réparations */}
      <Route path="/reparations" element={<ProtectedRoute><Reparations /></ProtectedRoute>} />
      <Route path="/reparations/:id" element={<ProtectedRoute><ReparationDetails /></ProtectedRoute>} />
      <Route path="/reparations/edit/:id" element={<ProtectedRoute><ReparationForm /></ProtectedRoute>} />
      <Route path="/reparations/create" element={<ProtectedRoute><ReparationForm /></ProtectedRoute>} />
    </Routes>
  );
}