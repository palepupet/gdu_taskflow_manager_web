# TaskFlow Manager - Frontend Web

Application web de gestion de projets et de tâches (TaskFlow).  
Ce dépôt contient uniquement le frontend (React). Il consomme l’API REST Symfony du dépôt séparé **`gdu_taskflow_manager_api`** (à lancer en local en parallèle).

---

## Présentation

TaskFlow Manager Web permet de :

- se connecter / se déconnecter,
- consulter et gérer des projets (création, édition, changement de statut / archivage...),
- gérer les membres d’un projet,
- suivre les tâches d’un projet (liste, création, suppression, filtres...),
- consulter son profil

Le frontend ne possède pas de base de données : toutes les données passent par l’API Symfony (`http://localhost:8000` en développement).

---

## Stack technique

| Domaine     | Choix                                      |
|-------------|--------------------------------------------|
| Langage     | JavaScript                                 |
| Runtime UI  | React 19                                   |
| UI          | Material UI (MUI) 9 + Emotion + icônes MUI |
| Auth        | JWT stocké dans `sessionStorage`           |
| Formulaires | React natif, validation manuelle           |
| Lint        | ESLint 10                                  |

---

## Prérequis

### Frontend

- Node.js et npm,

### Backend (obligatoire pour utiliser l’application web)

- Le dépôt API TaskFlow (Symfony) démarré en local (`symfony serve`),
- Base de données de l’API configurée + fixtures chargées (comptes de démo),
- CORS autorisant l’origine du frontend Vite (`http://localhost:5173`) et le header `Authorization`

Sans API + CORS, la page de login s’affiche mais les appels échouent (erreurs réseau / CORS).

### Documentation API

Une fois l’API lancée (`symfony serve`) :

- Swagger UI : [http://localhost:8000/api/doc](http://localhost:8000/api/doc)
- OpenAPI JSON : [http://localhost:8000/api/doc.json](http://localhost:8000/api/doc.json)

---

## Lancer le projet en local

Il faut deux onglets de terminal : un pour l’API, un pour le frontend.

### API Symfony

Dans le dépôt de l’API:

```bash
cd /chemin/vers/gdu_taskflow_manager_api

composer install

symfony serve
```

### Frontend

```bash
cd /chemin/vers/gdu_taskflow_manager_web

npm install

cp .env.example .env

npm run dev
```

Vite affiche l’URL locale :

- Frontend : [http://localhost:5173](http://localhost:5173)

### Résumé des URLs

| Service         | URL typique                     |
|-----------------|---------------------------------|
| Frontend (Vite) | `http://localhost:5173`         |
| API (Symfony)   | `http://localhost:8000`         |
| Doc API         | `http://localhost:8000/api/doc` |

---

## Variables d’environnement

Vite n’expose que les variables préfixées par `VITE_`.

Créer un fichier `.env` à la racine du frontend:

```env
VITE_API_BASE_URL=http://localhost:8000
```

| Variable            | Rôle                                                         |
|---------------------|--------------------------------------------------------------|
| `VITE_API_BASE_URL` | Préfixe de toutes les requêtes `fetch` (`src/api/client.js`) |

---

## Scripts npm

| Commande        | Description                      |
|-----------------|----------------------------------|
| `npm run dev`   | Serveur de développement Vite    |
| `npm run build` | Build de production dans `dist/` |
| `npm run lint`  | Lancer ESLint sur le projet      |

---

## Fonctionnalités


### Authentification

- Page de connexion (email / mot de passe)
- Stockage du JWT dans `sessionStorage`
- Chargement du profil via `GET /me`
- Déconnexion
- Redirection automatique vers `/login` si 401 (session expirée)
- Routes protégées (`ProtectedRoute`)

### Layout

- Shell dashboard : Navbar + Sidebar + zone de contenu
- Navigation vers projets et profil
- Thème MUI clair

### Projets

- Liste des projets accessibles
- Détail d’un projet (infos, statut, dates, propriétaire, membres)
- Création de projet
- Édition de projet
- Changement de statut / archivage / restauration (selon droits)
- Bandeau "projet archivé" et actions désactivées en lecture seule

### Membres

- Ajout de membres (sélection d’utilisateurs)
- Retrait de membres
- Permissions : owner ou manager, projet non archivé

### Tâches

- Liste des tâches dans le détail projet
- Icônes selon l’état (`ouvert` / `en cours` / `terminé`)
- Création de tâche (titre, description, échéance, priorité)
- Suppression de tâche
- Recherche via `POST /project/{id}/tasks/search` :
  - filtres : état(s), priorité(s), assigné, échéance avant (`dueBefore`)
  - tri : champ + ordre (asc / desc)
  - bouton réinitialiser
- La barre de filtres reste visible pendant le rechargement de la liste

### Profil

- Affichage en lecture seule (prénom, nom, email)

---

## Routes de l’application

Définies dans `src/App.jsx` :

| Chemin               | Accès       | Page                             |
|----------------------|-------------|----------------------------------|
| `/login`             | Public      | Connexion                        |
| `/projects`          | Authentifié | Liste des projets                |
| `/projects/create`   | Authentifié | Création de projet               |
| `/projects/:id`      | Authentifié | Détail projet (membres + tâches) |
| `/projects/:id/edit` | Authentifié | Édition de projet                |
| `/profile`           | Authentifié | Profil                           |

Les routes authentifiées sont entourées par `ProtectedRoute` puis `DashboardLayout`.

---

## Comptes de démo

Disponibles après chargement des fixtures côté API (`php bin/console doctrine:fixtures:load`) :

| Email                        | Mot de passe         | Rôle                               |
|------------------------------|----------------------|------------------------------------|
| `manager@taskflow.fr`        | `TaskFlowManager123` | Manager                            |
| `sophie.martin@taskflow.fr`  | `TaskFlowManager123` | Manager                            |
| `user@taskflow.fr`           | `TaskFlowUser123`    | User                               |
| `alice.dupont@taskflow.fr`   | `TaskFlowUser123`    | User                               |
| `bob.leroy@taskflow.fr`      | `TaskFlowUser123`    | User                               |
| `claire.bernard@taskflow.fr` | `TaskFlowUser123`    | User                               |
| `david.petit@taskflow.fr`    | `TaskFlowUser123`    | User                               |
| `inactive.user@taskflow.fr`  | `TaskFlowUser123`    | User (inactif - connexion refusée) |
