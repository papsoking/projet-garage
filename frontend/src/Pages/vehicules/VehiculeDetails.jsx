import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function VehiculeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicule, setVehicule] = useState(null);

  // Gérer l'affichage de la date dans le format souhaité (jj/mm/aaaa)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

    // Appel API pour récupérer les détails du véhicule (exemple avec fetch)
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vehicules/${id}`)
            .then((response) => response.json())
            .then((data) => setVehicule(data))
            .catch((error) => console.error("Erreur lors de la récupération du véhicule :", error));
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vehicules/${id}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    navigate("/vehicules", { state: { message: "Véhicule supprimé avec succès !" } });
                }
            } catch (error) {
                console.error("Erreur lors de la suppression du véhicule :", error);
            }
        }
    }

  if (!vehicule) {
    return <div className="container py-4">Chargement...</div>;
  }



  return (
    <div className="container py-4">
      <div className="mb-4">
        <span className="badge text-bg-primary rounded-pill mb-2">
          <i className="bi bi-eye-fill me-1"></i>
          Détail
        </span>

        <h1 className="page-title">Détail du véhicule</h1>
      </div>

      <div className="content-card p-4 mb-4">
        <div className="row g-3">
          <Info label="Immatriculation" value={vehicule.immatriculation} />

          <Info label="Marque" value={vehicule.marque} />

          <Info label="Modèle" value={vehicule.modele} />

          <Info label="Couleur" value={vehicule.couleur} />

          <Info label="Année" value={vehicule.annee} />

          <Info label="Kilométrage" value={vehicule.kilometrage} />

          <Info label="Carrosserie" value={vehicule.carrosserie} />

          <Info label="Énergie" value={vehicule.energie} />

          <Info label="Boîte" value={vehicule.boite} />
        </div>
      </div>

      <div className="d-flex gap-2 mb-4">
        <Link to={`/vehicules/edit/${vehicule.id}`} className="btn btn-warning">
          <i className="bi bi-pencil me-1"></i>
          Modifier
        </Link>

        {/* Supprimer */}
        <button className="btn btn-danger" onClick={handleDelete}>
          <i className="bi bi-trash me-1"></i>
          Supprimer
        </button>

        <Link to="/vehicules" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-1"></i>
          Retour
        </Link>
      </div>

      <h3 className="mb-3">Réparations associées</h3>

      <div className="table-responsive content-card p-3">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Date</th>

              <th>Objet</th>

              <th>Durée</th>

              <th>Techniciens</th>
            </tr>
          </thead>

          <tbody>
            {vehicule.reparations.length > 0 ? (
              vehicule.reparations.map((rep) => (
                <tr key={rep.id}>
                  <td>{formatDate(rep.date)}</td>

                  <td>{rep.objet_reparation}</td>

                  <td>{rep.duree_main_oeuvre} heures</td>

                  <td>
                    {rep.techniciens.map((tech) => (
                      <span key={tech.id} className="badge text-bg-info me-2">
                        {tech.prenom} {tech.nom}
                      </span>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  Aucune réparation.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="col-md-4">
      <div className="p-3 rounded-3 bg-light">
        <small className="text-muted d-block">{label}</small>

        <strong>{value}</strong>
      </div>
    </div>
  );
}
