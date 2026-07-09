import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Techniciens() {
  // Données temporaires
  const [techniciens, setTechniciens] = useState([]);
  const location = useLocation();
  const message = location.state?.message;

  //   Récupération des techniciens depuis l'API
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/techniciens`)
      .then((response) => response.json())
      .then((data) => setTechniciens(data))
      .catch((error) =>
        console.error(
          "Erreur lors de la récupération des techniciens :",
          error,
        ),
      );
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Supprimer ce technicien ?")) {
      console.log("Suppression :", id);

      // Appel API pour supprimer le technicien
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/techniciens/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Mettre à jour la liste des techniciens après suppression
            setTechniciens((prevTechniciens) =>
              prevTechniciens.filter((t) => t.id !== id),
            );
          }
        })
        .catch((error) =>
          console.error("Erreur lors de la suppression du technicien :", error),
        );
    }
  };

  return (
    <div className="container py-4">
      {message && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}

      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <span className="badge text-bg-primary rounded-pill mb-2">
            <i className="bi bi-people-fill me-1"></i>
            Équipe atelier
          </span>

          <h1 className="page-title mb-0">Liste des techniciens</h1>

          <p className="page-lead mb-0">
            Gérez les profils et les spécialités des techniciens.
          </p>
        </div>

        <Link to="/techniciens/create" className="btn btn-primary px-4">
          <i className="bi bi-plus-circle me-2"></i>
          Ajouter un technicien
        </Link>
      </div>

      {/* Tableau */}

      <div className="table-responsive content-card p-3">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Nom</th>

              <th>Prénom</th>

              <th>Spécialité</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {techniciens.length > 0 ? (
              techniciens.map((t) => (
                <tr key={t.id}>
                  <td>{t.nom}</td>

                  <td>{t.prenom}</td>

                  <td>{t.specialite}</td>

                  <td>
                    <Link
                      to={`/techniciens/${t.id}`}
                      className="btn btn-outline-info btn-sm me-2"
                    >
                      <i className="bi bi-eye"></i>
                    </Link>

                    <Link
                      to={`/techniciens/edit/${t.id}`}
                      className="btn btn-outline-warning btn-sm me-2"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(t.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  Aucun technicien trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
