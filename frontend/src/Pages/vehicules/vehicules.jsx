import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function VehiculeList() {
  const [search, setSearch] = useState("");
  const [vehicules, setVehicules] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;

  const [view, setView] = useState("table");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Un seul effet : recherche côté serveur, avec un debounce de 300ms
  // pour éviter un appel API à chaque frappe (perf + éco-responsabilité).
  useEffect(() => {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      const url = search
        ? `${import.meta.env.VITE_BACKEND_URL}/api/vehicules?search=${encodeURIComponent(search)}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/vehicules`;

      fetch(url, { signal: controller.signal })
        .then((response) => response.json())
        .then((data) => setVehicules(data))
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error(
              "Erreur lors de la récupération des véhicules :",
              error,
            );
          }
        });
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [search]);

  // Le filtrage est déjà fait côté serveur (paramètre ?search=),
  // on affiche donc directement la liste reçue de l'API.
  const filteredVehicules = vehicules;

  const handleDelete = (id) => {
    if (window.confirm("Supprimer ce véhicule ?")) {
      console.log("Suppression :", id);

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vehicules/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setVehicules(vehicules.filter((v) => v.id !== id));
            navigate("/vehicules", {
              state: { message: "Véhicule supprimé avec succès." },
            });
          } else {
            console.error(
              "Erreur lors de la suppression du véhicule :",
              response.statusText,
            );
          }
        })
        .catch((error) =>
          console.error("Erreur lors de la suppression du véhicule :", error),
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

      {/* HEADER */}

      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <span className="badge text-bg-primary rounded-pill mb-2">
            <i className="bi bi-car-front-fill me-1"></i>
            Catalogue
          </span>

          <h1 className="page-title mb-0">Liste des véhicules</h1>

          <p className="page-lead">
            Consultez, recherchez et gérez le parc automobile du garage.
          </p>
        </div>

        <Link to="/vehicules/create" className="btn btn-primary px-4">
          <i className="bi bi-plus-circle me-2"></i>
          Ajouter un véhicule
        </Link>
      </div>

      {/* RECHERCHE */}

      <div className="row g-2 mb-4">
        <div className="col-lg-8">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Rechercher..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="col-lg-4">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => setSearch("")}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* CHANGEMENT DE VUE */}

      <div className="mb-3 d-flex gap-2">
        <button
          className={
            view === "table" ? "btn btn-primary" : "btn btn-outline-primary"
          }
          onClick={() => setView("table")}
        >
          <i className="bi bi-table me-1"></i>
          Tableau
        </button>

        <button
          className={
            view === "card" ? "btn btn-primary" : "btn btn-outline-primary"
          }
          onClick={() => setView("card")}
        >
          <i className="bi bi-grid-3x3-gap me-1"></i>
          Cartes
        </button>
      </div>

      {/* TABLEAU */}

      {view === "table" ? (
        <div className="table-responsive content-card p-3">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Immatriculation</th>

                <th>Marque</th>

                <th>Modèle</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredVehicules.map((v) => (
                <tr key={v.id}>
                  <td>{v.immatriculation}</td>

                  <td>{v.marque}</td>

                  <td>{v.modele}</td>

                  <td>
                    <Link
                      to={`/vehicules/${v.id}`}
                      className="btn btn-outline-info btn-sm me-2"
                    >
                      <i className="bi bi-eye"></i>
                    </Link>

                    <Link
                      to={`/vehicules/edit/${v.id}`}
                      className="btn btn-outline-warning btn-sm me-2"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(v.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="row">
          {filteredVehicules.map((v) => (
            <div className="col-lg-4 mb-4" key={v.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5>{v.marque}</h5>
                  <div className="text-muted mb-2">
                    <p>
                      <span className="fw-bold">Modèle :</span> {v.modele}
                    </p>

                    <p>
                      <span className="fw-bold">Immatriculation :</span>{" "}
                      {v.immatriculation}
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <Link
                      to={`/vehicules/${v.id}`}
                      className="btn btn-info btn-sm"
                    >
                      Voir
                    </Link>

                    <Link
                      to={`/vehicules/edit/${v.id}`}
                      className="btn btn-warning btn-sm"
                    >
                      Modifier
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(v.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}