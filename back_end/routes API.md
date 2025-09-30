# Documentation des routes API

## Sommaire

1. [Route /about.json](#route-aboutjson)
2. [Module Authentification](#module-authentification)

   * [POST /auth/sign-up](#post-authsign-up)
   * [POST /auth/sign-in](#post-authsign-in)
3. [Module Services](#module-services)

   * [GET /services](#get-services)
   * [GET /services/:serviceId/triggers](#get-servicesserviceidtriggers)
   * [GET /services/:serviceId/actions](#get-servicesserviceidactions)
   * [GET /services/:serviceId/actions/:actionId](#get-servicesserviceidactionsactionid)
   * [GET /services/:serviceId/triggers/:triggerId](#get-servicesserviceidtriggerstriggerid)

---

## Route /about.json

### GET /about.json

* **Description** : Retourne un objet avec les informations du client (adresse IP), du serveur (timestamp actuel), et la liste des services disponibles avec leurs actions et réactions.
* **Paramètres** : Aucun
* **Réponse** : Objet JSON contenant :
  - `client` : objet contenant les informations sur le client
    - `host` : adresse IP du client effectuant la requête
  - `server` : objet contenant les informations sur le serveur
    - `current_time` : timestamp UNIX du moment où la requête est traitée (secondes depuis 1970)
    - `services` : tableau des services disponibles
      - `name` : nom du service (ex : "Google", "Spotify")
      - `actions` : tableau des actions que le service peut déclencher
        - `name` : nom de l'action (ex : "On User Signup")
        - `description` : description de l'action
      - `reactions` : tableau des réactions que le service peut effectuer
        - `name` : nom de la réaction (ex : "Send Email")
        - `description` : description de la réaction

#### Exemple de réponse

```json
{
  "client": {
    "host": "172.19.0.1"
  },
  "server": {
    "current_time": 1759242939,
    "services": [
      {
        "name": "Google",
        "actions": [
          {
            "name": "On User Signup",
            "description": "Triggered when a user signs up"
          }
        ],
        "reactions": [
          {
            "name": "Send Email",
            "description": "Send an email to a user"
          }
        ]
      },
      {
        "name": "Spotify",
        "actions": [
          {
            "name": "On Payment",
            "description": "Triggered when a payment is made"
          }
        ],
        "reactions": [
          {
            "name": "Create Playlist",
            "description": "Create a new playlist"
          }
        ]
      }
    ]
  }
}
```

---

## Module Authentification

### POST /auth/sign-up

* **Description** : Inscription d'un nouvel utilisateur.
* **Paramètres (body)** : Informations nécessaires à la création d'un compte (nom, email, mot de passe).
* **Réponse** :
  - Succès : Confirmation de l'inscription et données utilisateur créées.
  - Erreur : Message d'erreur si l'email existe déjà.

#### Exemple de requête

```json
{
  "email": "test@test.test",
  "name": "test",
  "password": "test"
}
```

#### Exemple de réponse (succès)

```json
{
    "id": 1,
    "email": "test@test.test",
    "name": "test",
    "created_at": "2025-09-30T14:39:42.915Z",
    "updated_at": "2025-09-30T14:39:42.915Z",
    "deleted_at": null
}
```

#### Exemple de réponse (erreur)

```json
{
    "message": "This email already exists.",
    "error": "Conflict",
    "statusCode": 409
}
```

### POST /auth/sign-in

* **Description** : Connexion d'un utilisateur existant.
* **Paramètres (body)** : `email`, `password`.
* **Réponse** :
  - Succès : Retourne un objet contenant le `session_token`.
  - Erreur : Message d'erreur si les identifiants sont invalides.

#### Exemple de requête

```json
{
  "email": "test@test.test",
  "password": "test"
}
```

#### Exemple de réponse (succès)

```json
{
    "session_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1OTI0MzMzNiwiZXhwIjoxNzU5ODQ4MTM2fQ.pZ8sKIDQOE17SWHHwUO7Q9rVaKhqUwS6DbrKMFqZFD8"
}
```

#### Exemple de réponse (erreur)

```json
{
    "message": "Invalid credentials.",
    "error": "Unauthorized",
    "statusCode": 401
}
```

---

## Module Services

### GET /services

* **Description** : Récupère la liste de tous les services disponibles.
* **Paramètres** : Aucun
* **Réponse** : Tableau JSON des services, chaque service contient :
  - `id` : identifiant du service
  - `name` : nom du service
  - `icon_url` : URL de l'icône
  - `api_base_url` : URL de base de l'API
  - `services_color`: Color of the original service (exemple: Youtube is red)
  - `auth_type` : type d'authentification
  - `documentation_url` : URL de la documentation
  - `active` : service actif ou non
  - `created_at` : date de création

#### Exemple de réponse

```json
[
  {
    "id": 1,
    "name": "Google",
    "icon_url": "https://example.com/google.png",
    "api_base_url": "https://api.google.com",
    "services_color": "#0000FF",
    "auth_type": "oauth2",
    "documentation_url": "https://docs.google.com",
    "active": true,
    "created_at": "2025-09-30T14:35:12.877Z"
  },
  {
    "id": 2,
    "name": "Spotify",
    "icon_url": "https://example.com/spotify.png",
    "api_base_url": "https://api.spotify.com",
    "services_color": "#1DB954",
    "auth_type": "oauth2",
    "documentation_url": "https://docs.spotify.com",
    "active": true,
    "created_at": "2025-09-30T14:35:12.877Z"
  }
]
```

### GET /services/:serviceId/triggers

* **Description** : Liste les triggers d'un service spécifique.
* **Paramètres** : `serviceId` (identifiant du service)
* **Réponse** : Tableau JSON des triggers associés, chaque trigger contient :
  - `id` : identifiant du trigger
  - `service_id` : identifiant du service
  - `http_request_id` : identifiant de la requête HTTP (nullable)
  - `webhook_id` : identifiant du webhook (nullable)
  - `trigger_type` : type du trigger (ex : "http")
  - `name` : nom du trigger
  - `description` : description du trigger
  - `polling_interval` : intervalle de polling (nullable)
  - `fields` : champs spécifiques au trigger (objet)
  - `variables` : variables du trigger (objet)
  - `is_active` : trigger actif ou non
  - `created_at` : date de création
  - `updated_at` : date de mise à jour

#### Exemple de réponse

```json
[
  {
    "id": 1,
    "service_id": 1,
    "http_request_id": null,
    "webhook_id": null,
    "trigger_type": "http",
    "name": "On User Signup",
    "description": "Triggered when a user signs up",
    "polling_interval": null,
    "fields": {},
    "variables": {},
    "is_active": true,
    "created_at": "2025-09-30T14:35:29.110Z",
    "updated_at": "2025-09-30T14:35:29.110Z"
  }
]
```

### GET /services/:serviceId/actions

* **Description** : Liste toutes les actions possibles pour un service donné.
* **Paramètres** : `serviceId`
* **Réponse** : Tableau JSON des actions disponibles, chaque action contient :
  - `id` : identifiant de l'action
  - `service_id` : identifiant du service
  - `http_request_id` : identifiant de la requête HTTP
  - `name` : nom de l'action
  - `description` : description de l'action
  - `fields` : champs spécifiques à l'action (objet)
  - `variables` : variables de l'action (objet)
  - `is_active` : action active ou non
  - `created_at` : date de création
  - `updated_at` : date de mise à jour

#### Exemple de réponse

```json
[
  {
    "id": 1,
    "service_id": 1,
    "http_request_id": 1,
    "name": "Send Email",
    "description": "Send an email to a user",
    "fields": {},
    "variables": {},
    "is_active": true,
    "created_at": "2025-09-30T14:35:24.231Z",
    "updated_at": "2025-09-30T14:35:24.231Z"
  }
]
```

### GET /services/:serviceId/actions/:actionId

* **Description** : Détail d'une action spécifique d'un service.
* **Paramètres** : `serviceId`, `actionId`
* **Réponse** : Objet JSON décrivant l'action, contenant :
  - `id` : identifiant de l'action
  - `service_id` : identifiant du service
  - `http_request_id` : identifiant de la requête HTTP
  - `name` : nom de l'action
  - `description` : description de l'action
  - `fields` : champs spécifiques à l'action (objet)
  - `variables` : variables de l'action (objet)
  - `is_active` : action active ou non
  - `created_at` : date de création
  - `updated_at` : date de mise à jour

#### Exemple de réponse

```json
{
  "id": 1,
  "service_id": 1,
  "http_request_id": 1,
  "name": "Send Email",
  "description": "Send an email to a user",
  "fields": {},
  "variables": {},
  "is_active": true,
  "created_at": "2025-09-30T14:35:24.231Z",
  "updated_at": "2025-09-30T14:35:24.231Z"
}
```

### GET /services/:serviceId/triggers/:triggerId

* **Description** : Détail d'un trigger spécifique d'un service.
* **Paramètres** : `serviceId`, `triggerId`
* **Réponse** : Objet JSON décrivant le trigger, contenant :
  - `id` : identifiant du trigger
  - `service_id` : identifiant du service
  - `http_request_id` : identifiant de la requête HTTP (nullable)
  - `webhook_id` : identifiant du webhook (nullable)
  - `trigger_type` : type du trigger (ex : "http")
  - `name` : nom du trigger
  - `description` : description du trigger
  - `polling_interval` : intervalle de polling (nullable)
  - `fields` : champs spécifiques au trigger (objet)
  - `variables` : variables du trigger (objet)
  - `is_active` : trigger actif ou non
  - `created_at` : date de création
  - `updated_at` : date de mise à jour

#### Exemple de réponse

```json
{
  "id": 1,
  "service_id": 1,
  "http_request_id": null,
  "webhook_id": null,
  "trigger_type": "http",
  "name": "On User Signup",
  "description": "Triggered when a user signs up",
  "polling_interval": null,
  "fields": {},
  "variables": {},
  "is_active": true,
  "created_at": "2025-09-30T14:35:29.110Z",
  "updated_at": "2025-09-30T14:35:29.110Z"
}
```
