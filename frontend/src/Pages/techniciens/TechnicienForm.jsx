import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function TechnicienForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    specialite: "",
  });

  const [loading, setLoading] = useState(false);
  // Validation du formulaire
  const [errors, setErrors] = useState({});

  const validateForm = (data) => {
    const nextErrors = {};

    if (!data.nom.trim()) {
      nextErrors.nom = "Le nom est obligatoire.";
    } else if (data.nom.trim().length > 50) {
      nextErrors.nom = "Le nom ne doit pas dépasser 50 caractères.";
    }

    if (!data.prenom.trim()) {
      nextErrors.prenom = "Le prénom est obligatoire.";
    } else if (data.prenom.trim().length > 50) {
      nextErrors.prenom = "Le prénom ne doit pas dépasser 50 caractères.";
    }

    if (!data.specialite.trim()) {
      nextErrors.specialite = "La spécialité est obligatoire.";
    } else if (data.specialite.trim().length > 100) {
      nextErrors.specialite =
        "La spécialité ne doit pas dépasser 100 caractères.";
    }

    return nextErrors;
  };

  // Récupération des données du technicien en mode édition
  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/techniciens/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            nom: data.nom ?? "",
            prenom: data.prenom ?? "",
            specialite: data.specialite ?? "",
          });
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  // Change handler pour les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  // Submit handler pour le formulaire
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
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim(),
      specialite: formData.specialite.trim(),
    };

    const url = id
      ? `${import.meta.env.VITE_BACKEND_URL}/api/techniciens/${id}`
      : `${import.meta.env.VITE_BACKEND_URL}/api/techniciens`;

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

      // console.log("SUCCESS :", data);

      // redirection après succès
      navigate("/techniciens", {
        state: {
          message: id
            ? "Technicien modifié avec succès."
            : "Technicien ajouté avec succès.",
        },
      });
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      {/* HEADER */}

      <div className="mb-4">
        <span className="badge text-bg-primary rounded-pill mb-2">
          <i className="bi bi-person-badge me-1"></i>
          Fiche technicien
        </span>

        <h1 className="page-title mb-0">
          {id ? "Modifier un technicien" : "Ajouter un technicien"}
        </h1>

        <p className="page-lead mb-0">
          Complétez les informations de l'intervenant atelier.
        </p>
      </div>

      {/* FORM */}

      <form onSubmit={handleSubmit} className="content-card p-4">
        <div className="row">
          <Input
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            invalid={!!errors.nom}
            errorMessage={errors.nom}
          />

          <Input
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            invalid={!!errors.prenom}
            errorMessage={errors.prenom}
          />

          <Input
            label="Spécialité"
            name="specialite"
            value={formData.specialite}
            onChange={handleChange}
            invalid={!!errors.specialite}
            errorMessage={errors.specialite}
          />
        </div>

        <div className="mt-4 d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <i className="bi bi-check2-circle me-1"></i>

            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>

          <Link to="/techniciens" className="btn btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}

/* INPUT COMPONENT */

function Input({ label, name, value, onChange, invalid, errorMessage }) {
  return (
    <div className="col-md-6 mb-3">
      <label className="form-label">{label}</label>

      <input
        type="text"
        name={name}
        className={`form-control ${invalid ? "is-invalid" : ""}`}
        value={value}
        onChange={onChange}
        required
      />

      {invalid && <div className="invalid-feedback">{errorMessage}</div>}
    </div>
  );
}
