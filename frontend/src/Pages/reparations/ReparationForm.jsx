import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function ReparationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicules, setVehicules] = useState([]);
  const [techniciens, setTechniciens] = useState([]);

  const [formData, setFormData] = useState({
    vehicule_id: "",
    date: "",
    duree_main_oeuvre: "",
    objet_reparation: "",
    techniciens: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = (data) => {
    const nextErrors = {};

    if (!data.vehicule_id) {
      nextErrors.vehicule_id = "Le véhicule est obligatoire.";
    }

    if (!data.date) {
      nextErrors.date = "La date est obligatoire.";
    }

    if (!data.duree_main_oeuvre.toString().trim()) {
      nextErrors.duree_main_oeuvre = "La durée est obligatoire.";
    } else if (
      !Number.isFinite(Number(data.duree_main_oeuvre)) ||
      Number(data.duree_main_oeuvre) < 0
    ) {
      nextErrors.duree_main_oeuvre = "La durée doit être un nombre positif.";
    }

    if (!data.objet_reparation.trim()) {
      nextErrors.objet_reparation = "L'objet de la réparation est obligatoire.";
    } else if (data.objet_reparation.trim().length > 255) {
      nextErrors.objet_reparation =
        "L'objet de la réparation ne doit pas dépasser 255 caractères.";
    }

    if (!Array.isArray(data.techniciens)) {
      nextErrors.techniciens = "La liste des techniciens est invalide.";
    }

    return nextErrors;
  };

  // Chargement des véhicules et techniciens pour les select et checkbox
  useEffect(() => {
    // vehicules
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vehicules`)
      .then((res) => res.json())
      .then((data) => setVehicules(data));

    // techniciens
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/techniciens`)
      .then((res) => res.json())
      .then((data) => setTechniciens(data));
  }, []);

  // LOAD EDIT
  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reparations/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            vehicule_id: data.vehicule_id,
            date: data.date,
            duree_main_oeuvre: data.duree_main_oeuvre,
            objet_reparation: data.objet_reparation,
            techniciens: data.techniciens.map((t) => t.id),
          });
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors((prev) => {
      if (!prev[e.target.name]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[e.target.name];
      return nextErrors;
    });
  };

  // checkbox
  const handleCheck = (idTech) => {
    setFormData((prev) => {
      const exists = prev.techniciens.includes(idTech);

      return {
        ...prev,
        techniciens: exists
          ? prev.techniciens.filter((t) => t !== idTech)
          : [...prev.techniciens, idTech],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validateForm(formData);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const payload = {
      vehicule_id: Number(formData.vehicule_id),
      date: formData.date,
      duree_main_oeuvre: Number(formData.duree_main_oeuvre),
      objet_reparation: formData.objet_reparation.trim(),
      techniciens: formData.techniciens.map((technicienId) =>
        Number(technicienId),
      ),
    };

    const url = id
      ? `${import.meta.env.VITE_BACKEND_URL}/api/reparations/${id}`
      : `${import.meta.env.VITE_BACKEND_URL}/api/reparations`;

    const method = id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          setErrors(
            Object.fromEntries(
              Object.entries(data.errors).map(([field, messages]) => [
                field,
                messages[0],
              ]),
            ),
          );

          return;
        }

        throw new Error(data.message || "La validation a échoué.");
      }

      navigate("/reparations", {
        state: {
          message: id
            ? "Réparation modifiée avec succès."
            : "Réparation ajoutée avec succès.",
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="page-title mb-4">
        {id ? "Modifier" : "Ajouter"} réparation
      </h1>

      <form onSubmit={handleSubmit} className="content-card p-4">
        {/* VEHICULE */}
        <label htmlFor="vehicule_id" className="form-label fw-bold">
          Véhicule
        </label>
        <select
          name="vehicule_id"
          className={`form-control mb-3 ${errors.vehicule_id ? "is-invalid" : ""}`}
          onChange={handleChange}
          value={formData.vehicule_id}
          required
        >
          <option value="">Choisir véhicule</option>
          {vehicules.map((v) => (
            <option key={v.id} value={v.id}>
              {v.immatriculation}
            </option>
          ))}
        </select>
        {errors.vehicule_id && (
          <div className="text-danger mb-3">{errors.vehicule_id}</div>
        )}

        {/* DATE */}
        <label htmlFor="date" className="form-label fw-bold">
          Date
        </label>
        <input
          type="date"
          name="date"
          className={`form-control mb-3 ${errors.date ? "is-invalid" : ""}`}
          value={formData.date}
          onChange={handleChange}
          required
        />
        {errors.date && <div className="text-danger">{errors.date}</div>}

        {/* DUREE */}
        <label htmlFor="duree_main_oeuvre" className="form-label fw-bold">
          Durée de la main-d'œuvre
        </label>
        <input
          type="number"
          name="duree_main_oeuvre"
          className={`form-control mb-3 ${errors.duree_main_oeuvre ? "is-invalid" : ""}`}
          value={formData.duree_main_oeuvre}
          placeholder="Ex: 2 heures"
          onChange={handleChange}
          required
        />
        {errors.duree_main_oeuvre && (
          <div className="text-danger">{errors.duree_main_oeuvre}</div>
        )}

        {/* OBJET */}
        <label htmlFor="objet_reparation" className="form-label fw-bold">
          Objet de la réparation
        </label>
        <textarea
          name="objet_reparation"
          className={`form-control mb-3 ${errors.objet_reparation ? "is-invalid" : ""}`}
          value={formData.objet_reparation}
          onChange={handleChange}
          placeholder="Décrire l'objet de la réparation"
          rows="3"
          required
        />
        {errors.objet_reparation && (
          <div className="text-danger">{errors.objet_reparation}</div>
        )}

        {/* TECHNICIENS */}
        <div className="mb-3">
          <label className="form-label fw-bold">Techniciens</label>
          {techniciens.map((t) => (
            <div
              key={t.id}
              className="form-check d-flex align-items-center mb-1 gap-2"
            >
              <input
                type="checkbox"
                id={`technicien-${t.id}`}
                className="form-check-input"
                checked={formData.techniciens.includes(t.id)}
                onChange={() => handleCheck(t.id)}
              />

              <label
                className="form-check-label"
                htmlFor={`technicien-${t.id}`}
              >
                {t.prenom} {t.nom}
              </label>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" disabled={loading}>
          <i className="bi bi-check-circle me-2"></i>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>

        <Link to="/reparations" className="btn btn-secondary ms-2">
          Annuler
        </Link>
      </form>
    </div>
  );
}
