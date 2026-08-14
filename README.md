# TaskFlow Manager - Frontend Web

Application web de gestion de projets et de tâches (TaskFlow).  
Ce dépôt contient uniquement le frontend (React). Il consomme l’API REST Symfony du dépôt séparé **`gdu_taskflow_manager_api`** (à lancer en local en parallèle).

---

## Présentation

TaskFlow Manager Web permet de :

- se connecter / se déconnecter,
- consulter et gérer des projets (création, édition, changement de statut / archivage...),
- gérer les membres d’un projet,
- suivre les tâches d’un projet (liste, création, édition, suppression, filtres, tri, état, assignation, tags...),
- gérer les tags d’un projet (création, renommage, suppression) et les associer aux tâches,
- modifier son profil (prénom, nom),
- administrer les utilisateurs (réservé aux managers : liste, création, édition, activation / désactivation, suppression)

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

npm run dev
```

Créer un fichier `.env` à la racine si besoin (voir [Variables d’environnement](#variables-denvironnement)).

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

| Commande          | Description                      |
|-------------------|----------------------------------|
| `npm run dev`     | Serveur de développement Vite    |
| `npm run build`   | Build de production dans `dist/` |
| `npm run lint`    | Lancer ESLint sur le projet      |

---

## Fonctionnalités

### Authentification

- Page de connexion (email / mot de passe)
- Stockage du JWT dans `sessionStorage`
- Chargement du profil via `GET /me`
- Déconnexion
- Redirection automatique vers `/login` si 401 (session expirée, message « Session expirée »)
- Routes protégées (`ProtectedRoute`)

### Layout

- Shell dashboard : Navbar + Sidebar + zone de contenu
- Navigation vers projets, profil et utilisateurs (ce dernier visible uniquement pour les managers)
- Navbar : nom de l’utilisateur connecté + bouton de déconnexion
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
- Affichage de la priorité et des tags
- Affichage / changement rapide de l’état
- Assignation d’une personne (un seul assigné par tâche)
- Création / édition / suppression de tâche
- Association de tags à la création et à l’édition
- Recherche via `POST /project/{id}/tasks/search` :
  - filtres : état(s), priorité(s), assigné, échéance avant (`dueBefore`)
  - tri : champ + ordre (asc / desc)
  - bouton réinitialiser
- La barre de filtres reste visible pendant le rechargement de la liste
- Messages d’erreur affichés dans les dialogs lors des actions (création, édition, tags, membres…)

#### Permissions tâches

| Action                                | Qui                                                                    |
|---------------------------------------|------------------------------------------------------------------------|
| Créer / éditer / supprimer / assigner | Owner ou manager, projet non archivé                                   |
| Changer l’état                        | Owner, manager, ou l’assigné de la tâche                               |
| Restriction assigné                   | L’assigné (non owner/manager) ne peut pas passer l’état à `"en cours"` |

#### Comportement API lié à l’assignation

Assigner un utilisateur qui n’est pas encore membre du projet l’ajoute automatiquement comme membre.

### Tags

- Liste des tags du projet sur la page détail
- Création et renommage
- Suppression
- Permissions : owner ou manager, projet non archivé
- Tags affichés sur chaque tâche, sélection multi-tags dans le formulaire de tâche

### Profil

- Affichage et modification du prénom et du nom
- Email affiché en lecture seule
- Mise à jour du contexte auth après enregistrement

### Administration utilisateurs (manager)

- Page `/users` accessible uniquement aux comptes avec le rôle `ROLE_MANAGER` (via `ManagerRoute`)
- Liste des utilisateurs (nom, email, rôles, statut actif / inactif)
- Création d’un utilisateur : prénom, nom, email, mot de passe, rôle manager ou user
- Édition : prénom, nom, email, rôle
- Activation / désactivation
- Suppression

---

## Routes de l’application

Définies dans `src/App.jsx` :

| Chemin               | Accès              | Page                                  |
|----------------------|--------------------|---------------------------------------|
| `/login`             | Public             | Connexion                             |
| `/projects`          | Authentifié        | Liste des projets                     |
| `/projects/create`   | Authentifié        | Création de projet                    |
| `/projects/:id`      | Authentifié        | Détail projet (tâches, tags, membres) |
| `/projects/:id/edit` | Authentifié        | Édition de projet                     |
| `/profile`           | Authentifié        | Profil                                |
| `/users`             | Manager            | Administration des utilisateurs       |

Les routes authentifiées sont entourées par `ProtectedRoute` puis `DashboardLayout`.
La route `/users` est en plus protégée par `ManagerRoute` (redirection vers `/projects` si l’utilisateur n’est pas manager).

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
