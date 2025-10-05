# Documentation des routes API

## Sommaire

1. [Route /about.json](#route-aboutjson)
2. [Module Authentification](#module-authentification)

   * [POST /auth/sign-up](#post-authsign-up)
   * [POST /auth/sign-in](#post-authsign-in)
3. [Module Users](#module-users)

   * [GET /users/me](#get-usersme)
   * [PUT /users/me](#put-usersme)
   * [DELETE /users/me](#delete-usersme)
   * [GET /users/me/connections](#get-usersmeconnections)
   * [GET /users/me/connections/service/:serviceId](#get-usersmeconnectionsserviceserviceid)
4. [Module Services](#module-services)

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

## Module Users

### GET /users/me

* **Description** : Récupère les informations de l'utilisateur authentifié.
* **Authentification** : Requiert un JWT Bearer token.
* **Paramètres** : Aucun
* **Réponse** : Objet JSON contenant les informations de l'utilisateur :
  - `id` : identifiant de l'utilisateur
  - `email` : email de l'utilisateur
  - `name` : nom de l'utilisateur
  - `created_at` : date de création du compte (format UTC)
  - `updated_at` : date de dernière mise à jour (format UTC)

#### Exemple de réponse

```json
{
  "id": 1,
  "email": "test@test.test",
  "name": "John Doe",
  "created_at": "Mon, 30 Sep 2025 14:39:42 GMT",
  "updated_at": "Mon, 30 Sep 2025 14:39:42 GMT"
}
```

### PUT /users/me

* **Description** : Met à jour les informations de l'utilisateur authentifié.
* **Authentification** : Requiert un JWT Bearer token.
* **Paramètres (body)** : `email`, `name` (optionnels).
* **Réponse** : Objet JSON contenant les informations mises à jour de l'utilisateur.

#### Exemple de requête

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

#### Exemple de réponse

```json
{
  "id": 1,
  "email": "jane@example.com",
  "name": "Jane Doe",
  "created_at": "Mon, 30 Sep 2025 14:39:42 GMT",
  "updated_at": "Mon, 05 Oct 2025 10:20:15 GMT"
}
```

### DELETE /users/me

* **Description** : Supprime le compte de l'utilisateur authentifié (soft delete).
* **Authentification** : Requiert un JWT Bearer token.
* **Paramètres** : Aucun
* **Réponse** : Message de confirmation.

#### Exemple de réponse

```json
{
  "message": "Your account has been deleted.",
  "statusCode": 204
}
```

### GET /users/me/connections

* **Description** : Récupère toutes les connexions actives de l'utilisateur authentifié.
* **Authentification** : Requiert un JWT Bearer token.
* **Paramètres** : Aucun
* **Réponse** : Objet JSON contenant un tableau de connexions :
  - `connections` : tableau des connexions de l'utilisateur
    - `id` : identifiant de la connexion
    - `service_id` : identifiant du service
    - `service_name` : nom du service (Gmail, Discord, etc.)
    - `service_color` : couleur associée au service
    - `icon_url` : URL de l'icône du service
    - `connection_name` : nom personnalisé de la connexion
    - `account_identifier` : identifiant du compte (email, username, etc.)
    - `is_active` : statut de la connexion (actif/inactif)
    - `created_at` : date de création de la connexion (format UTC)
    - `last_used_at` : date de dernière utilisation (format UTC, nullable)

#### Exemple de réponse

```json
{
  "connections": [
    {
      "id": 42,
      "service_id": 1,
      "service_name": "Gmail",
      "service_color": "#EA4335",
      "icon_url": "https://cdn.example.com/gmail.png",
      "connection_name": "Mon Gmail Pro",
      "account_identifier": "john.pro@company.com",
      "is_active": true,
      "created_at": "Mon, 15 Jan 2025 11:00:00 GMT",
      "last_used_at": "Mon, 05 Oct 2025 14:30:00 GMT"
    },
    {
      "id": 43,
      "service_id": 2,
      "service_name": "Discord",
      "service_color": "#5865F2",
      "icon_url": "https://cdn.example.com/discord.png",
      "connection_name": "Mon Discord",
      "account_identifier": "john_doe#1234",
      "is_active": true,
      "created_at": "Mon, 20 Jan 2025 09:30:00 GMT",
      "last_used_at": "Mon, 04 Oct 2025 18:45:00 GMT"
    }
  ]
}
```

### GET /users/me/connections/service/:serviceId

* **Description** : Récupère toutes les connexions actives de l'utilisateur authentifié pour un service spécifique.
* **Authentification** : Requiert un JWT Bearer token.
* **Paramètres** :
  - `serviceId` (path parameter) : identifiant du service
* **Réponse** : Objet JSON contenant un tableau de connexions pour le service spécifié :
  - `connections` : tableau des connexions de l'utilisateur pour ce service
    - Structure identique à GET /users/me/connections

#### Exemple de requête

```
GET /users/me/connections/service/1
```

#### Exemple de réponse

```json
{
  "connections": [
    {
      "id": 42,
      "service_id": 1,
      "service_name": "Gmail",
      "service_color": "#EA4335",
      "icon_url": "https://cdn.example.com/gmail.png",
      "connection_name": "Mon Gmail Pro",
      "account_identifier": "john.pro@company.com",
      "is_active": true,
      "created_at": "Mon, 15 Jan 2025 11:00:00 GMT",
      "last_used_at": "Mon, 05 Oct 2025 14:30:00 GMT"
    },
    {
      "id": 55,
      "service_id": 1,
      "service_name": "Gmail",
      "service_color": "#EA4335",
      "icon_url": "https://cdn.example.com/gmail.png",
      "connection_name": "Mon Gmail Perso",
      "account_identifier": "john@gmail.com",
      "is_active": true,
      "created_at": "Mon, 25 Feb 2025 14:20:00 GMT",
      "last_used_at": "Mon, 03 Oct 2025 09:15:00 GMT"
    }
  ]
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
