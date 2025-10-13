# Documentation complète de la base de données pour l'Area

## Sommaire

1. [Introduction générale](#introduction-générale)
2. [Table users - Gestion des utilisateurs](#table-users---gestion-des-utilisateurs)
3. [Table services - Services externes](#table-services---services-externes)
4. [Table connections - Connexions authentifiées](#table-connections---connexions-authentifiées)
5. [Table http_request - Requêtes HTTP](#table-http_request---requêtes-http)
6. [Table webhooks - Réception temps réel](#table-webhooks---réception-temps-réel)
7. [Table triggers - Événements déclencheurs](#table-triggers---événements-déclencheurs)
8. [Table actions - Actions exécutables](#table-actions---actions-exécutables)
9. [Table zaps - Workflows d'automatisation](#table-zaps---workflows-dautomatisation)
10. [Table zap_steps - Étapes d'un workflow](#table-zap_steps---étapes-dun-workflow)
11. [Table zap_executions - Historique des exécutions](#table-zap_executions---historique-des-exécutions)
12. [Table zap_step_executions - Détail par étape](#table-zap_step_executions---détail-par-étape)
13. [Relations et flux de données](#relations-et-flux-de-données)
14. [Exemples de données JSON](#exemples-de-données-json)
15. [Lexique des termes techniques](#lexique-des-termes-techniques)

---

## Introduction générale

Cette base de données gère un système d'automatisation type Zapier qui permet de :
- Connecter différents services web (Gmail, Slack, Trello, ChatGPT, etc.)
- Créer des workflows automatisés (zaps) déclenchés par des événements
- Transformer et router des données entre services
- Monitorer et déboguer les exécutions

Le système fonctionne selon le principe : **Trigger → Actions**
- Un **trigger** détecte un événement (nouveau mail, nouvelle tâche, etc.)
- Des **actions** sont exécutées en réponse (envoyer un message, créer un fichier, etc.)

---

## Table users - Gestion des utilisateurs

### Description
Stocke les informations des utilisateurs de la plateforme Area.

### Structure

| Colonne      | Type      | Contraintes        | Description                           |
|--------------|-----------|--------------------|---------------------------------------|
| `id`         | INT       | PK, AUTO_INCREMENT | Identifiant unique de l'utilisateur   |
| `email`      | VARCHAR   | UNIQUE, NOT NULL   | Email de connexion (doit être unique) |
| `name`       | VARCHAR   | NOT NULL           | Nom complet de l'utilisateur          |
| `password`   | VARCHAR   | NOT NULL           | Mot de passe hashé (bcrypt/argon2)    |
| `created_at` | TIMESTAMP | DEFAULT NOW()      | Date de création du compte            |
| `updated_at` | TIMESTAMP | DEFAULT NOW()      | Date de dernière modification         |
| `deleted_at` | TIMESTAMP | NULL               | Date de suppression (soft delete)     |

### Relations
- **1 user → N connections** : Un utilisateur peut avoir plusieurs connexions à différents services
- **1 user → N zaps** : Un utilisateur peut créer plusieurs workflows

### Cas d'usage
- Authentification et gestion des comptes
- Soft delete : un utilisateur supprimé garde son `id` mais a un `deleted_at` renseigné
- Suivi des activités via `created_at` et `updated_at`

### Exemple
```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "name": "John Doe",
  "password": "$2b$10$...",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-20T14:22:00Z",
  "deleted_at": null
}
```

---

## Table services - Services externes

### Description
Répertorie tous les services externes (APIs) disponibles pour créer des automatisations.

### Structure

| Colonne             | Type      | Contraintes        | Description                                            |
|---------------------|-----------|--------------------|--------------------------------------------------------|
| `id`                | INT       | PK, AUTO_INCREMENT | Identifiant unique du service                          |
| `name`              | VARCHAR   | UNIQUE, NOT NULL   | Nom du service (Gmail, Slack, Trello, etc.)            |
| `services_color`    | VARCHAR   | NULL               | Couleur de l'entreprise                                |
| `icon_url`          | VARCHAR   | NULL               | URL de l'icône du service pour l'interface             |
| `api_base_url`      | VARCHAR   | NULL               | URL de base de l'API du service                        |
| `auth_type`         | VARCHAR   | NOT NULL           | Type d'authentification (OAuth2, API_KEY, BASIC, etc.) |
| `documentation_url` | VARCHAR   | NULL               | Lien vers la documentation officielle de l'API         |
| `active`            | BOOLEAN   | DEFAULT TRUE       | Indique si le service est actif et disponible          |
| `created_at`        | TIMESTAMP | DEFAULT NOW()      | Date d'ajout du service                                |

### Relations
- **1 service → N connections** : Un service peut être connecté par plusieurs utilisateurs
- **1 service → N triggers** : Un service peut avoir plusieurs types de triggers
- **1 service → N actions** : Un service peut proposer plusieurs actions

### Cas d'usage
- Catalogue des services disponibles dans l'interface utilisateur
- Configuration centralisée de l'authentification par service
- Désactivation temporaire d'un service via `active = false`

### Exemple
```json
{
  "id": 1,
  "name": "Gmail",
  "icon_url": "https://cdn.zapier.com/icons/gmail.png",
  "api_base_url": "https://gmail.googleapis.com",
  "services_color": "#0000FF",
  "auth_type": "OAuth2",
  "documentation_url": "https://developers.google.com/gmail/api",
  "active": true,
  "created_at": "2025-01-10T08:00:00Z"
}
```

---

## Table connections - Connexions authentifiées

### Description
Stocke les tokens d'authentification permettant aux utilisateurs d'accéder aux services externes. Chaque connexion représente un compte spécifique d'un service pour un utilisateur.

### Structure

| Colonne                | Type      | Contraintes                | Description                                                  |
|------------------------|-----------|----------------------------|--------------------------------------------------------------|
| `id`                   | INT       | PK, AUTO_INCREMENT         | Identifiant unique de la connexion                           |
| `user_id`              | INT       | FK → users.id, NOT NULL    | Référence vers l'utilisateur propriétaire                    |
| `service_id`           | INT       | FK → services.id, NOT NULL | Référence vers le service connecté                           |
| `access_token`         | VARCHAR   | NOT NULL                   | Token d'accès à l'API (crypté en production)                 |
| `refresh_token`        | VARCHAR   | NULL                       | Token de rafraîchissement pour OAuth2                        |
| `expires_at`           | TIMESTAMP | NULL                       | Date d'expiration du token                                   |
| `rate_limit_remaining` | INT       | DEFAULT 1000               | Nombre de requêtes restantes avant limite                    |
| `rate_limit_reset`     | TIMESTAMP | NULL                       | Date de réinitialisation de la limite de requêtes            |
| `connection_name`      | VARCHAR   | NULL                       | Nom personnalisé de la connexion                             |
| `account_identifier`   | VARCHAR   | NULL                       | Identifiant du compte (email, username, etc.)                |
| `scopes`               | TEXT      | NULL                       | Permissions accordées (séparées par des espaces ou virgules) |
| `is_active`            | BOOLEAN   | DEFAULT TRUE               | Indique si la connexion est active                           |
| `created_at`           | TIMESTAMP | DEFAULT NOW()              | Date de création de la connexion                             |
| `last_used_at`         | TIMESTAMP | NULL                       | Date de dernière utilisation                                 |

### Composite unique constraints

Those fields are a unique composite : `[user_id, service_id, account_identifier]`

### Relations
- **N connections → 1 user** : Plusieurs connexions appartiennent à un utilisateur
- **N connections → 1 service** : Plusieurs utilisateurs peuvent connecter le même service

### Cas d'usage
- Gestion des tokens OAuth2 avec rafraîchissement automatique
- Monitoring des rate limits pour éviter les blocages API
- Support de plusieurs comptes du même service (ex: 2 comptes Gmail)
- Révocation de connexion via `is_active = false`

### Exemple
```json
{
  "id": 42,
  "user_id": 1,
  "service_id": 1,
  "access_token": "ya29.a0AfH6...",
  "refresh_token": "1//0gXYZ...",
  "expires_at": "2025-09-30T15:30:00Z",
  "rate_limit_remaining": 850,
  "rate_limit_reset": "2025-09-30T16:00:00Z",
  "connection_name": "Mon Gmail Pro",
  "account_identifier": "john.pro@company.com",
  "scopes": "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly",
  "is_active": true,
  "created_at": "2025-01-15T11:00:00Z",
  "last_used_at": "2025-09-30T14:30:00Z"
}
```

---

## Table http_request - Requêtes HTTP

### Description
Définit les modèles de requêtes HTTP utilisés par les triggers (polling) et les actions. Cette table permet de configurer comment communiquer avec les APIs externes.

### Structure

| Colonne         | Type    | Contraintes        | Description                                                |
|-----------------|---------|--------------------|------------------------------------------------------------|
| `id`            | INT     | PK, AUTO_INCREMENT | Identifiant unique de la requête                           |
| `description`   | VARCHAR | NOT NULL           | Description pour identifier la requête (usage développeur) |
| `method`        | VARCHAR | DEFAULT 'GET'      | Méthode HTTP (GET, POST, PUT, DELETE, PATCH)               |
| `endpoint`      | VARCHAR | NOT NULL           | Chemin de l'endpoint API (ex: `/v1/messages`)              |
| `body_schema`   | JSON    | NOT NULL           | Structure du body à envoyer (peut être vide `{}`)          |
| `header_schema` | JSON    | NOT NULL           | Structure des headers requis (ex: Authorization)           |

### Relations
- **1 http_request → N triggers** : Une requête peut être utilisée par plusieurs triggers
- **1 http_request → N actions** : Une requête peut être utilisée par plusieurs actions

### Cas d'usage
- Définir comment polling un service pour détecter de nouveaux événements
- Configurer les appels API pour exécuter des actions
- Template réutilisable pour plusieurs triggers/actions similaires

### Exemples

#### Trigger de polling Gmail
```json
{
  "id": 1,
  "description": "Récupérer les nouveaux emails Gmail",
  "method": "GET",
  "endpoint": "/gmail/v1/users/me/messages",
  "body_schema": {},
  "header_schema": {
    "Authorization": "Bearer {{access_token}}",
    "Content-Type": "application/json"
  }
}
```

#### Action d'envoi d'email
```json
{
  "id": 2,
  "description": "Envoyer un email via Gmail",
  "method": "POST",
  "endpoint": "/gmail/v1/users/me/messages/send",
  "body_schema": {
    "to": "{{recipient}}",
    "subject": "{{subject}}",
    "body": "{{body}}"
  },
  "header_schema": {
    "Authorization": "Bearer {{access_token}}",
    "Content-Type": "application/json"
  }
}
```

### Notes techniques
- Les variables entre `{{}}` sont remplacées dynamiquement lors de l'exécution
- Le `body_schema` et `header_schema` servent de template pour les requêtes

---

## Table webhooks - Réception temps réel

### Description
Configure les webhooks entrants pour recevoir des notifications en temps réel depuis des services externes. Alternative au polling, les webhooks permettent une réactivité instantanée.

### Structure

| Colonne            | Type      | Contraintes        | Description                                   |
|--------------------|-----------|--------------------|-----------------------------------------------|
| `id`               | INT       | PK, AUTO_INCREMENT | Identifiant unique du webhook                 |
| `from_url`         | VARCHAR   | NOT NULL           | URL ou domaine du service émetteur            |
| `action`           | VARCHAR   | NOT NULL           | Action du webhook (created, deleted, ...)     |
| `event`            | VARCHAR   | NOT NULL           | Event du webhook (repository, ...)            |
| `secret`           | VARCHAR   | NULL               | Secret pour valider l'authenticité du webhook |
| `total_received`   | INT       | NULL               | Compteur de webhooks reçus (statistiques)     |
| `last_received_at` | TIMESTAMP | NULL               | Date du dernier webhook reçu (debugging)      |

### Composite unique constraints

Those fields are a unique composite : `[action, event, from_url]`

### Relations
- **1 webhook → N triggers** : Un webhook peut déclencher plusieurs triggers différents

### Cas d'usage
- Recevoir des notifications instantanées (nouveau commit GitHub, paiement Stripe, etc.)
- Valider l'authenticité des requêtes via le `secret`
- Monitoring et statistiques via `total_received` et `last_received_at`

### Exemple

#### Webhook GitHub (nouveau push)
```json
{
  "id": 1,
  "header_schema": {
    "X-GitHub-Event": "push",
    "X-Hub-Signature-256": "{{signature}}"
  },
  "body_schema": {
    "repository": {
      "name": "string",
      "full_name": "string"
    },
    "pusher": {
      "name": "string",
      "email": "string"
    },
    "commits": [
      {
        "id": "string",
        "message": "string"
      }
    ]
  },
  "from_url": "https://api.github.com",
  "secret": "whsec_abcdef123456",
  "total_received": 1523,
  "last_received_at": "2025-09-30T14:25:00Z"
}
```

### Notes techniques
- Le `secret` est utilisé pour calculer une signature HMAC et vérifier l'origine
- Le `body_schema` documente la structure attendue mais ne fait pas de validation stricte
- Les webhooks nécessitent une URL publique pour recevoir les notifications

---

## Table triggers - Événements déclencheurs

### Description
Définit les événements qui peuvent déclencher l'exécution d'un zap. Un trigger surveille un service et lance le workflow quand une condition est remplie.

### Structure

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INT | PK, AUTO_INCREMENT | Identifiant unique du trigger |
| `service_id` | INT | FK → services.id, NOT NULL | Service associé (Gmail, Slack, etc.) |
| `http_request_id` | INT | FK → http_request.id, NULL | Requête pour polling/scheduling (NULL si webhook) |
| `webhook_id` | INT | FK → webhooks.id, NULL | Webhook associé (NULL si polling) |
| `trigger_type` | VARCHAR | NOT NULL | Type : `Webhook`, `Polling`, `Schedule` |
| `name` | VARCHAR | NOT NULL | Nom affiché dans l'interface (ex: "Nouveau email reçu") |
| `description` | VARCHAR | NOT NULL | Description détaillée du trigger |
| `polling_interval` | INT | NULL | Intervalle en secondes pour le polling (NULL si webhook) |
| `fields` | JSON | NOT NULL | Champs de configuration affichés dans le front |
| `variables` | JSON | NOT NULL | Variables disponibles pour les actions suivantes |
| `is_active` | BOOLEAN | DEFAULT TRUE | Indique si le trigger est disponible |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Date de dernière modification |

### Relations
- **N triggers → 1 service** : Plusieurs triggers peuvent appartenir à un service
- **N triggers → 1 http_request** : Plusieurs triggers peuvent utiliser la même requête
- **N triggers → 1 webhook** : Plusieurs triggers peuvent écouter le même webhook
- **1 trigger → N zap_steps** : Un trigger peut être utilisé dans plusieurs zaps

### Cas d'usage
- Définir "Nouveau mail Gmail reçu" comme trigger de type Webhook
- Définir "Vérifier nouvelles tâches Trello" comme trigger de type Polling
- Configurer les champs que l'utilisateur doit remplir (destinataire, dossier, etc.)
- Exposer les variables utilisables dans les actions suivantes

### Exemple complet

```json
{
  "id": 5,
  "service_id": 1,
  "http_request_id": null,
  "webhook_id": 1,
  "trigger_type": "Webhook",
  "name": "Nouveau email reçu",
  "description": "Se déclenche quand un nouvel email arrive dans la boîte de réception",
  "polling_interval": null,
  "fields": {
    "from": {
      "required": false,
      "type": "string",
      "field_name": "Expéditeur (filtre optionnel)",
      "placeholder": "exemple@gmail.com",
      "field_order": 1,
      "validation_rules": {
        "contains": "@"
      },
      "active": true
    },
    "subject_contains": {
      "required": false,
      "type": "string",
      "field_name": "Sujet contient",
      "placeholder": "Mot-clé",
      "field_order": 2,
      "active": true
    }
  },
  "variables": [
    {
      "type": "string",
      "name": "Expéditeur",
      "key": "data.from"
    },
    {
      "type": "string",
      "name": "Sujet",
      "key": "data.subject"
    },
    {
      "type": "string",
      "name": "Corps du message",
      "key": "data.body"
    },
    {
      "type": "datetime",
      "name": "Date de réception",
      "key": "data.received_at"
    }
  ],
  "is_active": true,
  "created_at": "2025-01-10T09:00:00Z",
  "updated_at": "2025-02-15T10:30:00Z"
}
```

### Structure du champ `fields`
Chaque clé représente un champ de formulaire :
- `required` : Obligatoire ou non
- `type` : Type de données (string, number, boolean, select, etc.)
- `field_name` : Label affiché dans l'interface
- `default_value` : Valeur par défaut (optionnel)
- `placeholder` : Texte d'aide dans le champ
- `field_order` : Ordre d'affichage
- `validation_rules` : Règles de validation
- `active` : Afficher ou non ce champ

### Structure du champ `variables`
Chaque objet définit une variable exploitable :
- `type` : Type de donnée (string, number, datetime, etc.)
- `name` : Nom affiché dans l'interface
- `key` : Chemin d'accès dans l'objet de données (notation pointée)

---

## Table actions - Actions exécutables

### Description
Définit les actions qui peuvent être exécutées suite à un trigger. Une action effectue une opération sur un service externe (envoyer un email, créer une tâche, poster un message, etc.).

### Structure

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INT | PK, AUTO_INCREMENT | Identifiant unique de l'action |
| `service_id` | INT | FK → services.id, NOT NULL | Service sur lequel l'action est effectuée |
| `http_request_id` | INT | FK → http_request.id, NOT NULL | Requête HTTP à exécuter |
| `name` | VARCHAR | NOT NULL | Nom de l'action (ex: "Envoyer un email") |
| `description` | VARCHAR | NOT NULL | Description détaillée de l'action |
| `fields` | JSON | NOT NULL | Champs de configuration pour l'utilisateur |
| `variables` | JSON | NOT NULL | Variables produites par cette action (output) |
| `is_active` | BOOLEAN | DEFAULT TRUE | Indique si l'action est disponible |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Date de dernière modification |

### Relations
- **N actions → 1 service** : Plusieurs actions appartiennent à un service
- **N actions → 1 http_request** : Plusieurs actions peuvent utiliser la même requête
- **1 action → N zap_steps** : Une action peut être utilisée dans plusieurs zaps

### Cas d'usage
- Définir "Envoyer un email Gmail" comme action
- Configurer les champs requis (destinataire, sujet, corps)
- Exposer les variables de sortie pour les actions suivantes (ex: ID du message envoyé)
- Chaînage d'actions : l'output d'une action devient l'input de la suivante

### Exemple complet

```json
{
  "id": 12,
  "service_id": 3,
  "http_request_id": 8,
  "name": "Générer une réponse ChatGPT",
  "description": "Envoie un prompt à ChatGPT et récupère la réponse",
  "fields": {
    "model": {
      "required": true,
      "type": "select",
      "field_name": "Modèle",
      "default_value": "gpt-4",
      "options": [
        {"label": "GPT-4", "value": "gpt-4"},
        {"label": "GPT-3.5 Turbo", "value": "gpt-3.5-turbo"}
      ],
      "field_order": 1,
      "active": true
    },
    "prompt": {
      "required": true,
      "type": "textarea",
      "field_name": "Prompt",
      "placeholder": "Résume cet email : {{EmailBody}}",
      "field_order": 2,
      "validation_rules": {
        "min_length": 10
      },
      "active": true
    },
    "max_tokens": {
      "required": false,
      "type": "number",
      "field_name": "Longueur maximale",
      "default_value": 500,
      "field_order": 3,
      "active": true
    }
  },
  "variables": [
    {
      "type": "string",
      "name": "Prompt envoyé",
      "key": "data.prompt"
    },
    {
      "type": "string",
      "name": "Réponse générée",
      "key": "data.response"
    },
    {
      "type": "number",
      "name": "Tokens utilisés",
      "key": "data.tokens_used"
    }
  ],
  "is_active": true,
  "created_at": "2025-01-12T10:00:00Z",
  "updated_at": "2025-03-01T14:20:00Z"
}
```

### Structure du champ `fields`
Identique aux triggers, définit les champs de configuration :
- Support de types avancés : `select`, `textarea`, `number`, `date`, etc.
- `options` pour les champs de type select
- `validation_rules` pour contraintes personnalisées

### Structure du champ `variables`
Définit les données produites par l'action :
- Ces variables peuvent être utilisées dans les actions suivantes du workflow
- Exemple : après "Générer réponse ChatGPT", utiliser `{{Response}}` dans "Envoyer email"

---

## Table zaps - Workflows d'automatisation

### Description
Représente un workflow complet créé par un utilisateur. Un zap est composé d'un trigger et d'une ou plusieurs actions qui s'exécutent en séquence.

### Structure

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INT | PK, AUTO_INCREMENT | Identifiant unique du zap |
| `user_id` | INT | FK → users.id, NOT NULL | Propriétaire du zap |
| `name` | VARCHAR | NOT NULL | Nom du zap (ex: "Email → Résumé GPT → Slack") |
| `description` | VARCHAR | NOT NULL | Description du workflow |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active ou désactive l'exécution du zap |
| `total_runs` | INT | NOT NULL | Nombre total d'exécutions |
| `successful_runs` | INT | NOT NULL | Nombre d'exécutions réussies |
| `failed_runs` | INT | NOT NULL | Nombre d'exécutions échouées |
| `last_run_at` | TIMESTAMP | NULL | Date de la dernière exécution |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Date de dernière modification |
| `deleted_at` | TIMESTAMP | NULL | Date de suppression (soft delete) |

### Relations
- **N zaps → 1 user** : Un utilisateur possède plusieurs zaps
- **1 zap → N zap_steps** : Un zap contient plusieurs étapes (trigger + actions)
- **1 zap → N zap_executions** : Un zap a un historique d'exécutions

### Cas d'usage
- Créer un workflow "Quand je reçois un email → Résumer avec GPT → Envoyer sur Slack"
- Activer/désactiver un zap sans le supprimer via `is_active`
- Suivre les performances avec les compteurs de succès/échec
- Soft delete pour conserver l'historique même après suppression

### Exemple

```json
{
  "id": 42,
  "user_id": 1,
  "name": "Email urgent → Notification Slack",
  "description": "Quand je reçois un email avec [URGENT], envoyer une notification Slack",
  "is_active": true,
  "total_runs": 347,
  "successful_runs": 342,
  "failed_runs": 5,
  "last_run_at": "2025-09-30T14:30:00Z",
  "created_at": "2025-02-01T09:00:00Z",
  "updated_at": "2025-09-30T14:30:00Z",
  "deleted_at": null
}
```

### Cycle de vie d'un zap
1. **Création** : L'utilisateur configure le trigger et les actions
2. **Activation** : `is_active = true` → le zap surveille les événements
3. **Exécution** : À chaque trigger, le workflow s'exécute
4. **Monitoring** : Les compteurs sont mis à jour automatiquement
5. **Désactivation** : `is_active = false` → arrêt temporaire
6. **Suppression** : `deleted_at` renseigné → soft delete

---

## Table zap_steps - Étapes d'un workflow

### Description
Définit la séquence d'étapes composant un zap. Chaque step est soit un trigger (première étape) soit une action. Cette table stocke aussi la configuration spécifique choisie par l'utilisateur.

### Structure

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INT | PK, AUTO_INCREMENT | Identifiant unique de l'étape |
| `zap_id` | INT | FK → zaps.id, NOT NULL | Zap auquel appartient cette étape |
| `source_step_id` | INT | FK → zap_steps.id, NULL | Étape source (pour chaînage des actions) |
| `step_type` | VARCHAR | NOT NULL | Type : `TRIGGER` ou `ACTION` |
| `trigger_id` | INT | FK → triggers.id, NULL | Référence au trigger (NULL si ACTION) |
| `action_id` | INT | FK → actions.id, NULL | Référence à l'action (NULL si TRIGGER) |
| `step_order` | INT | NOT NULL | Ordre d'exécution (1 = trigger, 2+= actions) |
| `payload` | JSON | NOT NULL | Configuration utilisateur avec mapping des variables |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Date de dernière modification |

### Relations
- **N zap_steps → 1 zap** : Un zap contient plusieurs étapes
- **N zap_steps → 1 trigger** : Plusieurs zaps peuvent utiliser le même trigger
- **N zap_steps → 1 action** : Plusieurs zaps peuvent utiliser la même action
- **1 zap_step → 1 zap_step** (source) : Chaînage entre étapes
- **1 zap_step → N zap_step_executions** : Une étape a un historique d'exécutions

### Cas d'usage
- Définir la séquence : Trigger Gmail → Action ChatGPT → Action Slack
- Mapper les variables entre étapes via le `payload`
- Permettre le chaînage : l'output de l'étape 2 devient l'input de l'étape 3
- Stocker la configuration personnalisée de chaque utilisateur

### Exemple de workflow

#### Étape 1 : Trigger (nouveau email)
```json
{
  "id": 100,
  "zap_id": 42,
  "source_step_id": null,
  "step_type": "TRIGGER",
  "trigger_id": 5,
  "action_id": null,
  "step_order": 1,
  "payload": {
    "from": "",
    "subject_contains": "[URGENT]"
  },
  "created_at": "2025-02-01T09:15:00Z",
  "updated_at": "2025-02-01T09:15:00Z"
}
```

#### Étape 2 : Action (résumer avec ChatGPT)
```json
{
  "id": 101,
  "zap_id": 42,
  "source_step_id": 100,
  "step_type": "ACTION",
  "trigger_id": null,
  "action_id": 12,
  "step_order": 2,
  "payload": {
    "model": "gpt-4",
    "prompt": "Résume cet email en 2 phrases : {{EmailBody}}",
    "max_tokens": 150
  },
  "created_at": "2025-02-01T09:20:00Z",
  "updated_at": "2025-02-01T09:20:00Z"
}
```

#### Étape 3 : Action (envoyer sur Slack)
```json
{
  "id": 102,
  "zap_id": 42,
  "source_step_id": 101,
  "step_type": "ACTION",
  "trigger_id": null,
  "action_id": 18,
  "step_order": 3,
  "payload": {
    "channel": "#urgent",
    "message": "📧 Email urgent de {{EmailFrom}}\n\nSujet: {{EmailSubject}}\n\nRésumé: {{Response}}"
  },
  "created_at": "2025-02-01T09:25:00Z",
  "updated_at": "2025-02-01T09:25:00Z"
}
```

### Structure du champ `payload`
Le payload contient la configuration spécifique de l'utilisateur :
- Les valeurs des champs définis dans `triggers.fields` ou `actions.fields`
- Le mapping des variables avec la syntaxe `{{VariableName}}`
- Les variables proviennent soit du trigger, soit des actions précédentes

### Mapping de variables
- `{{EmailBody}}` → vient du trigger (étape 1)
- `{{Response}}` → vient de l'action ChatGPT (étape 2)
- Le système résout ces variables lors de l'exécution en utilisant `zap_step_executions.data`

---

## Table zap_executions - Historique des exécutions

### Description
Enregistre chaque exécution complète d'un zap. Permet de suivre les performances, déboguer les erreurs et générer des statistiques.

### Structure

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INT | PK, AUTO_INCREMENT | Identifiant unique de l'exécution |
| `zap_id` | INT | FK → zaps.id, NOT NULL | Zap qui a été exécuté |
| `status` | VARCHAR | NOT NULL | Statut : `IN_PROGRESS`, `SUCCESS`, `FAILED` |
| `duration_ms` | INT | NOT NULL | Durée totale de l'exécution en millisecondes |
| `started_at` | TIMESTAMP | NOT NULL | Date et heure de début |
| `ended_at` | TIMESTAMP | NOT NULL | Date et heure de fin |

### Relations
- **N zap_executions → 1 zap** : Un zap a plusieurs exécutions
- **1 zap_execution → N zap_step_executions** : Une exécution contient plusieurs étapes

### Cas d'usage
- Logger chaque déclenchement du zap
- Calculer des métriques de performance (temps d'exécution moyen)
- Identifier les zaps lents ou qui échouent fréquemment
- Générer des rapports d'utilisation

### Exemple

```json
{
  "id": 5489,
  "zap_id": 42,
  "status": "SUCCESS",
  "duration_ms": 3420,
  "started_at": "2025-09-30T14:30:15Z",
  "ended_at": "2025-09-30T14:30:18.420Z"
}
```

### États possibles
- **IN_PROGRESS** : L'exécution est en cours
- **SUCCESS** : Toutes les étapes ont réussi
- **FAILED** : Au moins une étape a échoué

### Workflow de mise à jour
1. Création avec `status = IN_PROGRESS` au démarrage
2. Mise à jour progressive pendant l'exécution
3. Finalisation avec `status = SUCCESS` ou `FAILED` et calcul de `duration_ms`

---

## Table zap_step_executions - Détail par étape

### Description
Enregistre l'exécution de chaque étape individuelle d'un zap. C'est la table la plus importante pour le debugging et le chaînage des données entre étapes.

### Structure

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INT | PK, AUTO_INCREMENT | Identifiant unique de l'exécution d'étape |
| `zap_step_id` | INT | FK → zap_steps.id, NOT NULL | Étape qui a été exécutée |
| `zap_execution_id` | INT | FK → zap_executions.id, NOT NULL | Exécution parente |
| `data` | JSON | NOT NULL | Données produites par cette étape (output) |
| `status` | VARCHAR | NOT NULL | Statut : `IN_PROGRESS`, `SUCCESS`, `FAILED` |
| `duration_ms` | INT | NOT NULL | Durée d'exécution de cette étape en millisecondes |
| `error` | JSON | NULL | Détails de l'erreur si échec |
| `started_at` | TIMESTAMP | NOT NULL | Date et heure de début |
| `ended_at` | TIMESTAMP | NOT NULL | Date et heure de fin |

### Relations
- **N zap_step_executions → 1 zap_step** : Une étape peut être exécutée plusieurs fois
- **N zap_step_executions → 1 zap_execution** : Une exécution contient plusieurs étapes

### Cas d'usage
- **Chaînage de données** : Le `data` d'une étape est utilisé pour résoudre les variables de l'étape suivante
- **Debugging** : Visualiser exactement quelle étape a échoué et pourquoi
- **Monitoring** : Identifier les étapes lentes
- **Historique** : Consulter les données passées dans chaque étape

### Exemples complets

#### Étape 1 : Trigger (nouveau email reçu)
```json
{
  "id": 10001,
  "zap_step_id": 100,
  "zap_execution_id": 5489,
  "data": [
    {
      "key": "EmailFrom",
      "value": "boss@company.com"
    },
    {
      "key": "EmailSubject",
      "value": "[URGENT] Réunion client demain"
    },
    {
      "key": "EmailBody",
      "value": "Bonjour, nous avons une réunion importante avec le client XYZ demain à 10h. Merci de préparer le dossier complet..."
    },
    {
      "key": "EmailReceivedAt",
      "value": "2025-09-30T14:30:15Z"
    }
  ],
  "status": "SUCCESS",
  "duration_ms": 250,
  "error": null,
  "started_at": "2025-09-30T14:30:15Z",
  "ended_at": "2025-09-30T14:30:15.250Z"
}
```

#### Étape 2 : Action ChatGPT (résumer)
```json
{
  "id": 10002,
  "zap_step_id": 101,
  "zap_execution_id": 5489,
  "data": [
    {
      "key": "Prompt",
      "value": "Résume cet email en 2 phrases : Bonjour, nous avons une réunion importante..."
    },
    {
      "key": "Response",
      "value": "Réunion client XYZ prévue demain à 10h. Préparation du dossier complet requise."
    },
    {
      "key": "TokensUsed",
      "value": 85
    }
  ],
  "status": "SUCCESS",
  "duration_ms": 2100,
  "error": null,
  "started_at": "2025-09-30T14:30:15.250Z",
  "ended_at": "2025-09-30T14:30:17.350Z"
}
```

#### Étape 3 : Action Slack (envoyer message)
```json
{
  "id": 10003,
  "zap_step_id": 102,
  "zap_execution_id": 5489,
  "data": [
    {
      "key": "Channel",
      "value": "#urgent"
    },
    {
      "key": "MessageId",
      "value": "1234567890.123456"
    },
    {
      "key": "Timestamp",
      "value": "2025-09-30T14:30:18.350Z"
    }
  ],
  "status": "SUCCESS",
  "duration_ms": 1070,
  "error": null,
  "started_at": "2025-09-30T14:30:17.350Z",
  "ended_at": "2025-09-30T14:30:18.420Z"
}
```

### Structure du champ `data`
Tableau d'objets clé-valeur :
- **key** : Nom de la variable (correspond aux `variables` du trigger/action)
- **value** : Valeur produite lors de l'exécution

Ce format permet au système de résoudre facilement les variables `{{VariableName}}` dans les étapes suivantes.

### Structure du champ `error`
En cas d'échec :
```json
{
  "message": "API rate limit exceeded",
  "code": "RATE_LIMIT_ERROR",
  "details": {
    "retry_after": 60,
    "limit": 1000,
    "used": 1000
  }
}
```

### Résolution des variables
Quand l'étape 3 a besoin de `{{Response}}` :
1. Le système cherche dans les `zap_step_executions` précédentes
2. Trouve `"key": "Response"` dans l'étape 2
3. Remplace `{{Response}}` par la valeur correspondante

---

## Relations et flux de données

### Schéma des relations principales

```
users
  ├─→ connections ──→ services
  └─→ zaps
        ├─→ zap_steps
        │     ├─→ triggers ──→ services
        │     │       ├─→ http_request
        │     │       └─→ webhooks
        │     └─→ actions ──→ services
        │           └─→ http_request
        └─→ zap_executions
              └─→ zap_step_executions ──→ zap_steps
```

### Flux d'exécution d'un zap

#### 1. Détection de l'événement
- **Webhook** : Le service externe appelle notre URL → `webhooks` reçoit les données
- **Polling** : Notre système interroge l'API via `http_request` à intervalles réguliers

#### 2. Identification du zap à exécuter
```typescript
const zapsToExecute = await prisma.zaps.findMany({
  where: {
    is_active: true,
    zap_steps: {
      some: {
        trigger_id: triggerId // ID du trigger détecté
      }
    }
  },
  include: {
    zap_steps: {
      include: {
        trigger: true,
        action: true
      },
      orderBy: {
        step_order: 'asc'
      }
    }
  }
});
```

#### 3. Création de l'exécution
```typescript
const execution = await prisma.zap_executions.create({
  data: {
    zap_id: 42,
    status: 'IN_PROGRESS',
    started_at: new Date(),
    ended_at: new Date() // Sera mis à jour à la fin
  }
});
```

#### 4. Exécution séquentielle des étapes

Pour chaque `zap_step` dans l'ordre :

**a) Résolution du payload**
```javascript
// Étape actuelle
const step = {
  payload: {
    prompt: "Résume : {{EmailBody}}",
    model: "gpt-4"
  }
};

// Recherche des données des étapes précédentes
const previousData = getPreviousStepsData(execution_id);
// previousData = [{ key: "EmailBody", value: "Texte de l'email..." }]

// Remplacement des variables
const resolvedPayload = {
  prompt: "Résume : Texte de l'email...",
  model: "gpt-4"
};
```

**b) Exécution de la requête HTTP**
```javascript
const httpRequest = getHttpRequest(step.action_id);
const connection = getUserConnection(user_id, service_id);

const response = await fetch(httpRequest.endpoint, {
  method: httpRequest.method,
  headers: resolveHeaders(httpRequest.header_schema, connection),
  body: JSON.stringify(resolvedPayload)
});
```

**c) Enregistrement du résultat**
```typescript
await prisma.zap_step_executions.create({
  data: {
    zap_step_id: 101,
    zap_execution_id: 5489,
    data: [
      { key: "Response", value: "Résumé..." }
    ],
    status: 'SUCCESS',
    duration_ms: 2100,
    started_at: stepStartTime,
    ended_at: new Date()
  }
});
```

#### 5. Finalisation
```typescript
// Mise à jour de l'exécution
await prisma.zap_executions.update({
  where: { id: 5489 },
  data: {
    status: 'SUCCESS',
    ended_at: new Date()
  }
});

// Mise à jour des statistiques du zap
await prisma.zaps.update({
  where: { id: 42 },
  data: {
    total_runs: { increment: 1 },
    successful_runs: { increment: 1 },
    last_run_at: new Date()
  }
});
```

### Gestion des erreurs

Si une étape échoue :
```typescript
// Marquer l'étape comme échouée
await prisma.zap_step_executions.update({
  where: { id: 10002 },
  data: {
    status: 'FAILED',
    error: {
      message: "API timeout",
      code: "TIMEOUT"
    }
  }
});

// Marquer l'exécution comme échouée
await prisma.zap_executions.update({
  where: { id: 5489 },
  data: {
    status: 'FAILED',
    ended_at: new Date()
  }
});

// Incrémenter le compteur d'échecs
await prisma.zaps.update({
  where: { id: 42 },
  data: {
    failed_runs: { increment: 1 },
    last_run_at: new Date()
  }
});
```

### Chaînage conditionnel (future évolution)

Pour supporter des branches conditionnelles :
```json
{
  "zap_step_id": 103,
  "payload": {
    "condition": "{{EmailPriority}} == 'high'",
    "if_true": {
      "action_id": 18,
      "payload": {"channel": "#urgent"}
    },
    "if_false": {
      "action_id": 19,
      "payload": {"channel": "#general"}
    }
  }
}
```

---

## Exemples de données JSON

### Exemple 1 : triggers.fields (Gmail - Nouveau email)

```json
{
  "from": {
    "required": false,
    "type": "string",
    "field_name": "Expéditeur (optionnel)",
    "placeholder": "exemple@gmail.com",
    "field_order": 1,
    "validation_rules": {
      "contains": "@"
    },
    "active": true
  },
  "subject_contains": {
    "required": false,
    "type": "string",
    "field_name": "Sujet contient",
    "placeholder": "Mot-clé",
    "field_order": 2,
    "active": true
  },
  "folder": {
    "required": false,
    "type": "select",
    "field_name": "Dossier",
    "default_value": "INBOX",
    "options": [
      {"label": "Boîte de réception", "value": "INBOX"},
      {"label": "Important", "value": "IMPORTANT"},
      {"label": "Tous les messages", "value": "ALL"}
    ],
    "field_order": 3,
    "active": true
  }
}
```

### Exemple 2 : triggers.variables (Gmail - Output)

```json
[
  {
    "type": "string",
    "name": "Expéditeur",
    "key": "data.from"
  },
  {
    "type": "string",
    "name": "Destinataire",
    "key": "data.to"
  },
  {
    "type": "string",
    "name": "Sujet",
    "key": "data.subject"
  },
  {
    "type": "string",
    "name": "Corps du message",
    "key": "data.body"
  },
  {
    "type": "string",
    "name": "Corps HTML",
    "key": "data.body_html"
  },
  {
    "type": "datetime",
    "name": "Date de réception",
    "key": "data.received_at"
  },
  {
    "type": "array",
    "name": "Pièces jointes",
    "key": "data.attachments"
  }
]
```

### Exemple 3 : actions.fields (Slack - Envoyer message)

```json
{
  "channel": {
    "required": true,
    "type": "select_dynamic",
    "field_name": "Canal",
    "placeholder": "#general",
    "field_order": 1,
    "api_endpoint": "/api/slack/channels",
    "active": true
  },
  "message": {
    "required": true,
    "type": "textarea",
    "field_name": "Message",
    "placeholder": "Nouveau message : {{Title}}",
    "field_order": 2,
    "validation_rules": {
      "min_length": 1,
      "max_length": 4000
    },
    "active": true
  },
  "thread_ts": {
    "required": false,
    "type": "string",
    "field_name": "Répondre dans le fil (timestamp)",
    "placeholder": "1234567890.123456",
    "field_order": 3,
    "active": true
  },
  "as_user": {
    "required": false,
    "type": "boolean",
    "field_name": "Envoyer en tant qu'utilisateur",
    "default_value": true,
    "field_order": 4,
    "active": true
  }
}
```

### Exemple 4 : zap_step.payload (Configuration utilisateur)

```json
{
  "gmail_account": "john.pro@company.com",
  "subject": "Nouveau like : {{TrackName}}",
  "body": "Titre liké: {{TrackName}} - {{TrackAuthor}}\n\nDescription: {{TrackDescription}}\n\nÉcouter: {{TrackUrl}}",
  "to": "notifications@mycompany.com",
  "cc": "",
  "attachments": []
}
```

### Exemple 5 : zap_step_execution.data (Résultat produit)

```json
[
  {
    "key": "TrackName",
    "value": "Bohemian Rhapsody"
  },
  {
    "key": "TrackAuthor",
    "value": "Queen"
  },
  {
    "key": "TrackDescription",
    "value": "Une des chansons les plus iconiques du rock progressif"
  },
  {
    "key": "TrackUrl",
    "value": "https://soundcloud.com/queen/bohemian-rhapsody"
  },
  {
    "key": "LikedAt",
    "value": "2025-09-30T14:30:00Z"
  },
  {
    "key": "UserId",
    "value": "123456789"
  }
]
```

### Exemple 6 : http_request.body_schema (ChatGPT API)

```json
{
  "model": "{{model}}",
  "messages": [
    {
      "role": "system",
      "content": "Tu es un assistant qui résume des emails."
    },
    {
      "role": "user",
      "content": "{{prompt}}"
    }
  ],
  "max_tokens": "{{max_tokens}}",
  "temperature": 0.7
}
```

### Exemple 7 : webhooks.body_schema (GitHub Push)

```json
{
  "ref": "string",
  "repository": {
    "id": "number",
    "name": "string",
    "full_name": "string",
    "private": "boolean",
    "owner": {
      "login": "string",
      "id": "number"
    }
  },
  "pusher": {
    "name": "string",
    "email": "string"
  },
  "commits": [
    {
      "id": "string",
      "message": "string",
      "timestamp": "string",
      "author": {
        "name": "string",
        "email": "string"
      },
      "added": ["string"],
      "removed": ["string"],
      "modified": ["string"]
    }
  ]
}
```

### Exemple 8 : zap_step_execution.error (Erreur détaillée)

```json
{
  "message": "La requête à l'API ChatGPT a échoué",
  "code": "API_ERROR",
  "status_code": 429,
  "details": {
    "error_type": "rate_limit_exceeded",
    "retry_after": 60,
    "limit": 3500,
    "remaining": 0,
    "reset_at": "2025-09-30T15:00:00Z"
  },
  "request": {
    "method": "POST",
    "endpoint": "https://api.openai.com/v1/chat/completions",
    "attempted_at": "2025-09-30T14:30:17Z"
  }
}
```

---

## Lexique des termes techniques

| Terme | Signification | Explication |
|-------|--------------|-------------|
| **pk** | Primary Key | Clé primaire : identifiant unique de chaque ligne dans une table. |
| **fk** | Foreign Key | Clé étrangère : référence à une clé primaire d'une autre table, permet de lier les données. |
| **unique** | Unique | Contrainte qui garantit qu'aucune valeur dupliquée n'existe dans la colonne. |
| **timestamp** | Timestamp | Date et heure précises, souvent utilisée pour le suivi des créations/modifications. |
| **boolean** | Booléen | Type de donnée vrai/faux (true/false). |
| **varchar** | Variable Character | Chaîne de caractères de longueur variable. |
| **text** | Texte | Champ texte long, sans limite stricte de taille. |
| **json** | JavaScript Object Notation | Format de données structuré, utilisé pour stocker des objets ou des configurations. |
| **int** | Integer | Nombre entier. |
| **soft delete** | Suppression logique | On marque la ligne comme supprimée (ex: champ deleted_at rempli) sans l'effacer physiquement. |
| **rate limit** | Limite de requêtes | Nombre maximal de requêtes autorisées sur une période donnée par une API. |
| **webhook** | Crochet web | URL appelée par un service externe pour signaler un événement en temps réel. |
| **endpoint** | Point de terminaison | Chemin d'accès à une ressource ou une action dans une API (ex: `/v1/messages`). |
| **schema** | Schéma | Structure ou modèle de données attendu ou produit (ex: input_schema, output_schema). |
| **polling** | Interrogation régulière | Technique consistant à vérifier périodiquement la présence de nouveaux événements. |
| **trigger** | Déclencheur | Événement qui lance l'exécution d'un workflow (zap). |
| **action** | Action | Opération exécutée suite à un trigger (ex: envoyer un email, créer une tâche). |
| **mapping** | Correspondance | Association entre champs de données de différents services via des variables. |
| **transformation** | Transformation | Modification ou adaptation des données entre services (formatage, calcul, etc.). |
| **log** | Journal | Enregistrement d'événements ou d'erreurs pour le suivi et le debugging. |
| **payload** | Charge utile | Données envoyées ou reçues lors d'une requête HTTP ou d'un événement. |
| **variable** | Variable | Placeholder dynamique (ex: `{{EmailSubject}}`) remplacé par une valeur réelle. |
| **OAuth2** | Open Authorization 2 | Protocole d'autorisation standard pour accéder aux APIs de manière sécurisée. |
| **access token** | Jeton d'accès | Clé temporaire permettant d'authentifier les requêtes API. |
| **refresh token** | Jeton de rafraîchissement | Clé permettant d'obtenir un nouveau access_token sans réauthentification. |
| **API** | Application Programming Interface | Interface permettant à deux applications de communiquer entre elles. |
| **HMAC** | Hash-based Message Authentication Code | Méthode de validation de l'authenticité d'un webhook via signature cryptographique. |
