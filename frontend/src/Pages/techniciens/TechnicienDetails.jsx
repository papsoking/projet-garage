import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function TechnicienDetails() {
  const { id } = useParams();
  const [vehiculeMap, setVehiculeMap] = useState({}); // État pour stocker les immatriculations des véhicules

//   Récupération des données du technicien
    const [technicien, setTechnicien] = useState({
    nom: "",
    prenom: "",
    specialite: "",
    reparations: [],
  });

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
                setTechnicien((prevTechnicien) =>
                    prevTechnicien.filter((t) => t.id !== id),
                );
            }

        })
        .catch((error) =>
            console.error("Erreur lors de la suppression du technicien :", error),
        );
    }
    };

    useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/techniciens/${id}`)
      .then((response) => response.json())
      .then((data) => setTechnicien(data))
        .catch((error) =>
            console.error(
                "Erreur lors de la récupération du technicien :",
                error,
            ),
        );
  }, [id]);

  // Fonction pour récupérer l'immatriculation du véhicule associé à une réparation grâce à l'ID du véhicule
  useEffect(() => {
    const fetchVehiculesById = async () => {
      const vehiculeIds = technicien.reparations.map((rep) => rep.vehicule_id);
      const vehiculePromises = vehiculeIds.map((id) =>
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vehicules/${id}`).then((res) => res.json()),
      );
      const vehicules = await Promise.all(vehiculePromises);
      const vehiculeMap = {};
      vehicules.forEach((vehicule) => {
        vehiculeMap[vehicule.id] = vehicule.immatriculation;
      });
      setVehiculeMap(vehiculeMap);
    };

    if (technicien.reparations.length > 0) {
      fetchVehiculesById();
    }
  }, [technicien.reparations]);

  // console.log("technicien:", technicien);

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
      {/* HEADER */}

      <div className="mb-4">
        <span className="badge text-bg-primary rounded-pill mb-2">
          <i className="bi bi-eye-fill me-1"></i>
          Détail technicien
        </span>

        <h1 className="page-title mb-0">
          {technicien.prenom} {technicien.nom}
        </h1>
      </div>

      {/* INFOS TECHNICIEN */}

      <div className="content-card p-4 mb-4">
        <div className="row g-3">
          <Info label="Nom" value={technicien.nom} />

          <Info label="Prénom" value={technicien.prenom} />

          <Info label="Spécialité" value={technicien.specialite} />
        </div>
      </div>

      {/* ACTIONS */}

      <div className="d-flex gap-2 mb-4">
        <Link
          to={`/techniciens/edit/${technicien.id}`}
          className="btn btn-warning"
        >
          <i className="bi bi-pencil me-1"></i>
          Modifier
        </Link>

        <button
          className="btn btn-danger"
          onClick={() => handleDelete(technicien.id)}
        >
          <i className="bi bi-trash me-1"></i>
          Supprimer
        </button>

        <Link to="/techniciens" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-1"></i>
          Retour
        </Link>
      </div>

      {/* RÉPARATIONS */}

      <h3 className="mb-3">Réparations associées</h3>

      <div className="table-responsive content-card p-3">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Date</th>

              <th>Objet</th>

              <th>Véhicule</th>
            </tr>
          </thead>

          <tbody>
            {technicien.reparations.length > 0 ? (
              technicien.reparations.map((rep) => (
                <tr key={rep.id}>
                  <td>{formatDate(rep.date)}</td>

                  <td>{rep.objet_reparation}</td>

                  <td>{vehiculeMap[rep.vehicule_id] || "Véhicule non trouvé"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  Aucune réparation associée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* COMPONENT INFO */

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
