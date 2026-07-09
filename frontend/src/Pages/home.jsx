import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Mini Garage</h1>
      <p>Bienvenue dans votre mini garage !</p>

      {/* 3 Card avec liens pour la redirection vers les pages véhicules, techniciens et interventions */}
      <div className="d-flex flex-wrap justify-content-around gap-3">
        <Link to="/vehicules" className="custom-hover-box border rounded p-3">
          <h2>Véhicules</h2>
          <p>Gestion des véhicules</p>
        </Link>
        <Link to="/techniciens" className="custom-hover-box border rounded p-3">
          <h2>Techniciens</h2>
          <p>Gestion des techniciens</p>
        </Link>
        <Link to="/interventions" className="custom-hover-box border rounded p-3">
          <h2>Interventions</h2>
          <p>Gestion des interventions</p>
        </Link>
      </div>
    </div>
  );
}
