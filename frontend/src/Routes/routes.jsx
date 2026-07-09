import { Routes, Route } from "react-router-dom";
import Home from "../Pages/home";
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
      {/* Accueil */}
      <Route path="/" element={<Home />} />

      {/* Véhicules */}
      <Route path="/vehicules" element={<Vehicules />} />
      <Route path="/vehicules/:id" element={<VehiculeDetails />} />
      <Route path="/vehicules/edit/:id" element={<VehiculeForm />} />
      <Route path="/vehicules/create" element={<VehiculeForm />} />

      {/* Techniciens */}
      <Route path="/techniciens" element={<Techniciens />} />
      <Route path="/techniciens/:id" element={<TechnicienDetails />} />
      <Route path="/techniciens/edit/:id" element={<TechnicienForm />} />
      <Route path="/techniciens/create" element={<TechnicienForm />} />

      {/* Réparations */}
      <Route path="/reparations" element={<Reparations />} />
      <Route path="/reparations/:id" element={<ReparationDetails />} />
      <Route path="/reparations/edit/:id" element={<ReparationForm />} />
      <Route path="/reparations/create" element={<ReparationForm />} />
    </Routes>
  );
}
