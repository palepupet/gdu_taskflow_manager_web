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

| Domaine          | Choix                                      |
|------------------|--------------------------------------------|
| Langage          | JavaScript                                 |
| Runtime UI       | React 19                                   |
| Build            | Vite 8                                     |
| UI               | Material UI (MUI) 9 + Emotion + icônes MUI |
| Auth             | JWT stocké dans `sessionStorage`           |
| Formulaires      | React natif, validation manuelle           |
| Lint             | ESLint 10                                  |
| Conteneurisation | Docker + Docker Compose                    |

---

## Prérequis

### Avec Docker (recommandé)

- **Docker** Engine
- **Docker Compose** (plugin `docker compose`)
- L'API TaskFlow démarrée (via Docker sur [http://localhost:8000](http://localhost:8000))

### Sans Docker (installation locale)

- Node.js et npm
- L'API TaskFlow démarrée en parallèle

### Backend (obligatoire)

Sans API accessible + CORS correct, la page de login s’affiche mais les appels échouent.

- Dépôt `gdu_taskflow_manager_api` démarré
- Base de données + fixtures (comptes de démo)
- CORS autorisant l'origine du frontend (`http://localhost:3000` en Docker, `http://localhost:5173` en Vite) et le header `Authorization`

### Documentation API

Une fois l’API lancée :

- Swagger UI : [http://localhost:8000/api/doc](http://localhost:8000/api/doc)
- OpenAPI JSON : [http://localhost:8000/api/doc.json](http://localhost:8000/api/doc.json)

---

## Variables d'environnement

Vite n'expose que les variables préfixées par `VITE_`.  
`VITE_API_BASE_URL` n'est **pas un secret** : pas besoin de `.env.docker`.

| Fichier      | Rôle                                                                |
|--------------|---------------------------------------------------------------------|
| `.env`       | URL de l'API pour le mode local (`npm run dev`)                     |
| `.env.local` | Surcharge locale (gitignoré via `*.local`)                          |
| Compose arg  | `VITE_API_BASE_URL` passé au **build** Docker (voir `compose.yaml`) |

Exemple `.env` :

```env
VITE_API_BASE_URL=http://localhost:8000
```

| Variable            | Rôle                                                         |
|---------------------|--------------------------------------------------------------|
| `VITE_API_BASE_URL` | Préfixe de toutes les requêtes `fetch` (`src/api/client.js`) |

> Avec Vite, cette variable est injectée au build. Après un changement d'URL en Docker, il faut rebuild (`docker compose up --build`).

---

## Installation avec Docker

Le frontend est servi par nginx (image multi-stage : build Node => fichiers statiques).

### 1) Cloner le dépôt

```bash
git clone https://github.com/palepupet/gdu_taskflow_manager_web.git
cd gdu_taskflow_manager_web
```

### 2) Démarrer l'API (autre dépôt)

L'API doit être accessible sur `http://localhost:8000` avant d'utiliser le front.

Exemple (dépôt API) :

```bash
cd /chemin/vers/gdu_taskflow_manager_api
docker compose --env-file .env.docker up --build -d
# migrations + JWT + fixtures si besoin (voir README de l'API)
```

### 3) Build et démarrage du frontend

```bash
cd /chemin/vers/gdu_taskflow_manager_web
docker compose up --build
```

En arrière-plan :

```bash
docker compose up --build -d
```

Service démarré :

| Service | Rôle                         | Accès                                          |
|---------|------------------------------|------------------------------------------------|
| `web`   | React (build) + nginx        | [http://localhost:3000](http://localhost:3000) |

L'URL de l'API est passée au build via Compose :

```yaml
args:
  VITE_API_BASE_URL: http://localhost:8000
```

Le navigateur appelle ensuite l'API sur `localhost:8000` (pas le réseau interne Docker).

### 4) Vérifier

- Frontend : [http://localhost:3000](http://localhost:3000) (ex. `/login`)
- Doc API : [http://localhost:8000/api/doc](http://localhost:8000/api/doc)

### Commandes utiles (Docker)

```bash
# Conteneurs
docker compose ps

# Arrêt
docker compose down
```

### Fichiers Docker

| Fichier         | Rôle                                              |
|-----------------|---------------------------------------------------|
| `Dockerfile`    | Multi-stage : `node` (build) puis `nginx` (serve) |
| `nginx.conf`    | SPA : toutes les routes => `index.html`           |
| `compose.yaml`  | Service `web`, port `3000:80`                     |
| `.dockerignore` | Exclut `node_modules`, `dist`, etc.               |

---

## Installation locale (sans Docker)

Il faut deux terminaux : un pour l’API, un pour le frontend.

### API Symfony

```bash
cd /chemin/vers/gdu_taskflow_manager_api
# Docker ou symfony serve / php -S — voir README de l'API
```

### Frontend

```bash
cd /chemin/vers/gdu_taskflow_manager_web

npm install

# .env avec VITE_API_BASE_URL=http://localhost:8000 si besoin
npm run dev
```

Vite affiche l'URL locale : [http://localhost:5173](http://localhost:5173)

---

## Résumé des URLs

| Service              | URL typique                     |
|----------------------|---------------------------------|
| Frontend (Docker)    | `http://localhost:3000`         |
| Frontend (Vite dev)  | `http://localhost:5173`         |
| API                  | `http://localhost:8000`         |
| Doc API              | `http://localhost:8000/api/doc` |

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
