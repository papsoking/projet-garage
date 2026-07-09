import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function ReparationDetails() {
  const { id } = useParams();

//   Récupération des données de la réparation
  const [reparation, setReparation] = useState({
    date: "",
    objet_reparation: "",
    duree_main_oeuvre: "",
    vehicule: { immatriculation: "" },
    techniciens: [],
  });

  useEffect(() => {
    // Appel API
    const fetchReparation = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/reparations/${id}`
      );
      const data = await response.json();

      setReparation(data);
    };

    fetchReparation();
  }, [id]);

  // Gérer l'affichage de la date dans le format souhaité (jj/mm/aaaa)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="container py-4">
      <span className="badge text-bg-primary rounded-pill mb-2">
        <i className="bi bi-eye-fill me-1"></i>
        Détail réparation
      </span>

      <h1 className="page-title mb-4">Détail réparation</h1>

      <div className="content-card p-4 mb-4">
        <p>
          <strong>Date :</strong> {formatDate(reparation.date)}
        </p>
        <p>
          <strong>Objet :</strong> {reparation.objet_reparation}
        </p>
        <p>
          <strong>Durée :</strong> {reparation.duree_main_oeuvre} heures
        </p>
        <p>
          <strong>Véhicule :</strong> {reparation.vehicule.immatriculation}
        </p>
      </div>

      <h3>Techniciens</h3>

      <div className="content-card p-3 d-flex gap-2 flex-wrap">
        {reparation.techniciens.map((t) => (
          <span key={t.id} className="badge text-bg-info">
            {t.prenom} {t.nom}
          </span>
        ))}
      </div>

      <Link to="/reparations" className="btn btn-secondary mt-4">
        <i className="bi bi-arrow-left me-1"></i>
        Retour
      </Link>
    </div>
  );
}
