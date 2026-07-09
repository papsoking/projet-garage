import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Reparations() {
  //   Récupération des données de réparations depuis l'API
  const [reparations, setReparations] = useState([]);
  const location = useLocation();
  const message = location.state?.message;

  useEffect(() => {
    // Appel API
    const fetchReparations = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/reparations`,
      );
      const data = await response.json();

      setReparations(data);
    };

    fetchReparations();
  }, []);

  const handleDelete = (id) => {
    if (confirm("Supprimer cette réparation ?")) {
      console.log("delete:", id);
    }
  };

  // Gérer l'affichage de la date dans le format souhaité (jj/mm/aaaa)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="container py-4 bg-light rounded-3">
      {message && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <span className="badge text-bg-primary rounded-pill mb-2">
            <i className="bi bi-clipboard-check me-1"></i>
            Suivi atelier
          </span>

          <h1 className="page-title">Liste des réparations</h1>

          <p className="page-lead">Visualisez les interventions du garage.</p>
        </div>

        <Link to="/reparations/create" className="btn btn-primary px-4">
          <i className="bi bi-plus-circle me-2"></i>
          Nouvelle réparation
        </Link>
      </div>

      {/* TABLE */}
      <div className="table-responsive content-card p-3">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Date</th>
              <th>Objet</th>
              <th>Véhicule</th>
              <th>Techniciens</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {reparations.map((r) => (
              <tr key={r.id}>
                <td>{formatDate(r.date)}</td>

                <td>{r.objet_reparation}</td>

                <td>{r.vehicule.immatriculation}</td>

                <td>
                  {r.techniciens.map((t) => (
                    <span key={t.id} className="badge text-bg-info me-1">
                      {t.prenom}
                    </span>
                  ))}
                </td>

                <td>
                  <Link
                    to={`/reparations/${r.id}`}
                    className="btn btn-outline-info btn-sm me-2"
                  >
                    <i className="bi bi-eye"></i>
                  </Link>

                  <Link
                    to={`/reparations/edit/${r.id}`}
                    className="btn btn-outline-warning btn-sm me-2"
                  >
                    <i className="bi bi-pencil"></i>
                  </Link>

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
