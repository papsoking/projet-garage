# 🔧 Mini Garage

Application web de gestion pour un garage automobile - suivi des véhicules, des réparations et des techniciens.

Projet réalisé dans le cadre du cours **Développement Web - Niveau Approfondi** (D-CLIC).

![Statut](https://img.shields.io/badge/statut-fonctionnel-brightgreen)
![React](https://img.shields.io/badge/Front--end-React-61DAFB?logo=react&logoColor=white)
![Laravel](https://img.shields.io/badge/Back--end-Laravel-FF2D20?logo=laravel&logoColor=white)
![Tests](https://img.shields.io/badge/tests-27%20passed-success)

## 📖 Sommaire

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Structure du dépôt](#-structure-du-dépôt)
- [Prérequis](#-prérequis)
- [Installation - Back-end (Laravel)](#-installation--back-end-laravel)
- [Installation - Front-end (React)](#-installation--front-end-react)
- [Lancer les tests](#-lancer-les-tests)
- [Endpoints de l'API](#-endpoints-de-lapi)
- [Documentation du projet](#-documentation-du-projet)
- [Pistes d'amélioration](#-pistes-damélioration)

## 📸 Aperçu

<!-- Captures -->

## ✨ Fonctionnalités

- **Véhicules** : liste avec recherche (marque / immatriculation), vue tableau ou cartes, fiche détaillée avec historique des réparations, création / modification / suppression.
- **Techniciens** : liste, fiche avec réparations associées, création / modification / suppression.
- **Réparations** : liste avec véhicule et techniciens associés, création / modification (avec resynchronisation des techniciens assignés), suppression.

## 🛠 Stack technique

| Côté | Technologies |
|---|---|
| Front-end | React 19, React Router DOM, Bootstrap 5, Bootstrap Icons, Vite |
| Back-end | Laravel (PHP 8.4), API REST (`Route::apiResource`) |
| Base de données | SQLite en développement (voir `.env`) |
| Tests | PHPUnit (back-end, 27 tests) + Selenium IDE (parcours front-end) |

## 📁 Structure du dépôt

```
.
├── backend/     # API Laravel (modèles, migrations, contrôleurs API, tests)
└── frontend/    # Application React (Vite)
```

## ✅ Prérequis

- PHP 8.4+ et Composer
- Node.js 18+ et npm
- Extension PHP `sqlite3` activée

## 🚀 Installation - Back-end (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite   # si vous utilisez SQLite
php artisan migrate --seed
php artisan serve
```

L'API est alors accessible sur `http://localhost:8000`.

## 🚀 Installation - Front-end (React)

```bash
cd frontend
npm install
```

Créez un fichier `.env` à la racine de `frontend/` avec l'URL de l'API :

```
VITE_BACKEND_URL=http://localhost:8000
```

Puis lancez le serveur de développement :

```bash
npm run dev
```

L'application est alors accessible sur `http://localhost:5173`.

> Le front-end (React) et le back-end (Laravel) doivent tourner **en même temps**, chacun dans son propre terminal.

## 🧪 Lancer les tests

```bash
cd backend
php artisan test
```

27 tests couvrant les 3 modules (véhicules, techniciens, réparations) : listing, recherche, validations, relations, suppression en cascade.

Les tests fonctionnels de l'interface (ajout / modification / suppression) ont été réalisés avec **Selenium IDE** - voir le fichier `Documentation.docx` fourni avec le projet.

## 🔌 Endpoints de l'API

| Méthode | URL | Description |
|---|---|---|
| GET | `/api/vehicules` | Liste des véhicules (`?search=` pour filtrer) |
| GET | `/api/vehicules/{id}` | Détail d'un véhicule + ses réparations |
| POST | `/api/vehicules` | Créer un véhicule |
| PUT | `/api/vehicules/{id}` | Modifier un véhicule |
| DELETE | `/api/vehicules/{id}` | Supprimer un véhicule |
| GET | `/api/techniciens` | Liste des techniciens |
| GET | `/api/techniciens/{id}` | Détail d'un technicien + ses réparations |
| POST | `/api/techniciens` | Créer un technicien |
| PUT | `/api/techniciens/{id}` | Modifier un technicien |
| DELETE | `/api/techniciens/{id}` | Supprimer un technicien |
| GET | `/api/reparations` | Liste des réparations (véhicule + techniciens inclus) |
| GET | `/api/reparations/{id}` | Détail d'une réparation |
| POST | `/api/reparations` | Créer une réparation |
| PUT | `/api/reparations/{id}` | Modifier une réparation |
| DELETE | `/api/reparations/{id}` | Supprimer une réparation |

## 📚 Documentation du projet

- `Cahier des charges (DSF)` - objectifs, périmètre, exigences
- `Dossier de conception visuelle` - wireframes, flux utilisateurs
- `Dossier de conception technique` - architecture, modèle de données, API
- `Documentation` - rapport de tests (Selenium + PHPUnit), sécurité, performance

## 🔭 Pistes d'amélioration

- Ajout d'une authentification (Laravel Sanctum) pour restreindre l'accès à l'API.
- Pagination des listes en cas de forte volumétrie.
- Passage en production sur une base MySQL/PostgreSQL.

---

**Auteur :** Ibrahima FADIABA