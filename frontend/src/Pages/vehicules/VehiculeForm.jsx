import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function VehiculeForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Données temporaires
  // Plus tard, elles seront remplies par fetch() en mode édition
  const [formData, setFormData] = useState({
    immatriculation: "",
    marque: "",
    modele: "",
    couleur: "",
    annee: "",
    kilometrage: "",
    carrosserie: "",
    energie: "",
    boite: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = (data) => {
    const nextErrors = {};

    if (!data.immatriculation.trim()) {
      nextErrors.immatriculation = "L'immatriculation est obligatoire.";
    } else if (data.immatriculation.trim().length > 20) {
      nextErrors.immatriculation =
        "L'immatriculation ne doit pas dépasser 20 caractères.";
    }

    if (!data.marque.trim()) {
      nextErrors.marque = "La marque est obligatoire.";
    } else if (data.marque.trim().length > 50) {
      nextErrors.marque = "La marque ne doit pas dépasser 50 caractères.";
    }

    if (!data.modele.trim()) {
      nextErrors.modele = "Le modèle est obligatoire.";
    } else if (data.modele.trim().length > 50) {
      nextErrors.modele = "Le modèle ne doit pas dépasser 50 caractères.";
    }

    if (!data.couleur.trim()) {
      nextErrors.couleur = "La couleur est obligatoire.";
    } else if (data.couleur.trim().length > 30) {
      nextErrors.couleur = "La couleur ne doit pas dépasser 30 caractères.";
    }

    const annee = Number(data.annee);
    if (!data.annee.toString().trim()) {
      nextErrors.annee = "L'année est obligatoire.";
    } else if (!Number.isInteger(annee) || annee < 1900) {
      nextErrors.annee = "L'année doit être un nombre entier valide.";
    }

    const kilometrage = Number(data.kilometrage);
    if (!data.kilometrage.toString().trim()) {
      nextErrors.kilometrage = "Le kilométrage est obligatoire.";
    } else if (!Number.isInteger(kilometrage) || kilometrage < 0) {
      nextErrors.kilometrage =
        "Le kilométrage doit être un nombre entier positif.";
    }

    if (!data.carrosserie.trim()) {
      nextErrors.carrosserie = "La carrosserie est obligatoire.";
    } else if (data.carrosserie.trim().length > 50) {
      nextErrors.carrosserie =
        "La carrosserie ne doit pas dépasser 50 caractères.";
    }

    if (!data.energie.trim()) {
      nextErrors.energie = "L'énergie est obligatoire.";
    } else if (data.energie.trim().length > 20) {
      nextErrors.energie = "L'énergie ne doit pas dépasser 20 caractères.";
    }

    if (!data.boite.trim()) {
      nextErrors.boite = "La boîte est obligatoire.";
    } else if (data.boite.trim().length > 20) {
      nextErrors.boite = "La boîte ne doit pas dépasser 20 caractères.";
    }

    return nextErrors;
  };

  // Récupération des données du véhicule en mode édition
  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vehicules/${id}`)
        .then((response) => response.json())
        .then((data) => setFormData(data))
        .catch((error) =>
          console.error("Erreur lors de la récupération du véhicule :", error),
        );
    }
  }, [id]);

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
      immatriculation: formData.immatriculation.trim(),
      marque: formData.marque.trim(),
      modele: formData.modele.trim(),
      couleur: formData.couleur.trim(),
      annee: Number(formData.annee),
      kilometrage: Number(formData.kilometrage),
      carrosserie: formData.carrosserie.trim(),
      energie: formData.energie.trim(),
      boite: formData.boite.trim(),
    };

    const url = id
      ? `${import.meta.env.VITE_BACKEND_URL}/api/vehicules/${id}`
      : `${import.meta.env.VITE_BACKEND_URL}/api/vehicules`;

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

      console.log(data);
      navigate("/vehicules", {
        state: {
          message: id
            ? "Véhicule modifié avec succès."
            : "Véhicule ajouté avec succès.",
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
      <div className="mb-4">
        <span className="badge text-bg-primary rounded-pill mb-2">
          <i className="bi bi-car-front-fill me-1"></i>
          Fiche véhicule
        </span>

        <h1 className="page-title">
          {id ? "Modifier un véhicule" : "Ajouter un véhicule"}
        </h1>

        <p className="page-lead">
          Renseignez les informations techniques et administratives.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="content-card p-4">
        <div className="row">
          <Input
            label="Immatriculation"
            name="immatriculation"
            value={formData.immatriculation}
            onChange={handleChange}
            invalid={!!errors.immatriculation}
            errorMessage={errors.immatriculation}
          />

          <Input
            label="Marque"
            name="marque"
            value={formData.marque}
            onChange={handleChange}
            invalid={!!errors.marque}
            errorMessage={errors.marque}
          />

          <Input
            label="Modèle"
            name="modele"
            value={formData.modele}
            onChange={handleChange}
            invalid={!!errors.modele}
            errorMessage={errors.modele}
          />

          <Input
            label="Couleur"
            name="couleur"
            value={formData.couleur}
            onChange={handleChange}
            invalid={!!errors.couleur}
            errorMessage={errors.couleur}
          />

          <Input
            label="Année"
            type="number"
            name="annee"
            value={formData.annee}
            onChange={handleChange}
            invalid={!!errors.annee}
            errorMessage={errors.annee}
          />

          <Input
            label="Kilométrage"
            type="number"
            name="kilometrage"
            value={formData.kilometrage}
            onChange={handleChange}
            invalid={!!errors.kilometrage}
            errorMessage={errors.kilometrage}
          />

          <Input
            label="Carrosserie"
            name="carrosserie"
            value={formData.carrosserie}
            onChange={handleChange}
            invalid={!!errors.carrosserie}
            errorMessage={errors.carrosserie}
          />

          <Input
            label="Énergie"
            name="energie"
            value={formData.energie}
            onChange={handleChange}
            invalid={!!errors.energie}
            errorMessage={errors.energie}
          />

          <Input
            label="Boîte"
            name="boite"
            value={formData.boite}
            onChange={handleChange}
            invalid={!!errors.boite}
            errorMessage={errors.boite}
          />
        </div>

        <div className="mt-4 d-flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            <i className="bi bi-check-circle me-2"></i>

            {loading ? "Enregistrement..." : id ? "Modifier" : "Enregistrer"}
          </button>

          <Link to="/vehicules" className="btn btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  invalid,
  errorMessage,
}) {
  return (
    <div className="col-md-6 mb-3">
      <label className="form-label">{label}</label>

      <input
        type={type}
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
