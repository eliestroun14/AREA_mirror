# Documentation détaillée de la base de données Zapier

## Sommaire

1. [Introduction generale](#introduction-generale)
2. [Table users - Gestion des utilisateurs](#table-users---gestion-des-utilisateurs)
3. [Table services - Services externes](#table-services---services-externes)
4. [Table service_response_fields - Champs retournés par les APIs](#table-service_response_fields---champs-retournés-par-les-apis)
5. [Table connections - Connexions authentifiees](#table-connections---connexions-authentifiees)
6. [Table zaps - Workflows d'automatisation](#table-zaps---workflows-dautomatisation)
7. [Table zap_steps - Etapes dun workflow](#table-zap_steps---etapes-dun-workflow)
8. [Table triggers - Evenements declencheurs](#table-triggers---evenements-declencheurs)
9. [Table actions - Actions executables](#table-actions---actions-executables)
10. [Table zap_executions - Historique des executions](#table-zap_executions---historique-des-executions)
11. [Table step_executions - Detail par etape](#table-step_executions---detail-par-etape)
12. [Table webhooks - Reception temps reel](#table-webhooks---reception-temps-reel)
13. [Table service_form_fields - Configuration dynamique](#table-service_form_fields---configuration-dynamique)
14. [Table data_transformations - Le coeur de zapier](#table-data_transformations---le-coeur-de-zapier)
15. [Table execution_logs - Debugging avance](#table-execution_logs---debugging-avance)
16. [Relations et flux de donnees](#relations-et-flux-de-donnees)
17. [Lexique des termes techniques](#lexique-des-termes-techniques)

## Introduction generale

Cette base de données gère un système d'automatisation type Zapier qui permet de :
- Connecter différents services web (Gmail, Slack, Trello, etc.)
- Créer des workflows automatisés (zaps) déclenchés par des événements
- Transformer et router des données entre services
- Monitorer et déboguer les exécutions

---

## Table users - Gestion des utilisateurs

### Rôle
Stocke les informations des comptes utilisateurs de la plateforme.

### Champs détaillés

| Champ | Type | Description détaillée |
|-------|------|---------------------|
| `id` | int [pk] | **Identifiant unique** généré automatiquement pour chaque utilisateur |
| `email` | varchar [unique] | **Adresse email** utilisée comme login. Doit être unique dans le système |
| `name` | varchar | **Nom complet** de l'utilisateur affiché dans l'interface |
| `password` | varchar | **Mot de passe hashé** (jamais stocké en clair, utilise bcrypt ou argon2) |
| `created_at` | timestamp | **Date d'inscription** - permet de suivre la croissance des utilisateurs |
| `updated_at` | timestamp | **Dernière modification du profil** - mis à jour à chaque changement |
| `deleted_at` | timestamp | **Soft delete** - si non null, le compte est "supprimé" mais on garde l'historique pour l'audit et la facturation |

### Exemples d'usage
- Authentification lors du login
- Affichage du nom dans le dashboard
- Soft delete pour garder l'historique des zaps même après suppression du compte

---

## Table services - Services externes

### Rôle
Catalogue des services tiers intégrés à la plateforme (comme Gmail, Slack, Dropbox, etc.).

### Champs détaillés

| Champ | Type | Description détaillée |
|-------|------|---------------------|
| `id` | int [pk] | **Identifiant unique** du service |
| `name` | varchar [unique] | **Nom commercial** du service (ex: "Gmail", "Slack", "Trello") |
| `icon_url` | varchar | **URL de l'icône** du service pour l'affichage dans l'interface utilisateur |
| `api_base_url` | varchar | **URL racine de l'API** (ex: "https://api.gmail.com/v1/", "https://slack.com/api/") |
| `auth_type` | varchar | **Type d'authentification** supporté :<br>- `"oauth2"` : OAuth 2.0 (le plus courant)<br>- `"api_key"` : Clé API simple<br>- `"basic"` : Authentification basique |
| `documentation_url` | varchar | **Lien vers la doc API** pour les développeurs |
| `active` | boolean | **Service disponible** - permet de désactiver temporairement un service |
| `created_at` | timestamp | **Date d'ajout** du service à la plateforme |

### Exemples d'usage
- Afficher la liste des services disponibles à l'utilisateur
- Configurer automatiquement les appels API selon le type d'auth
- Désactiver un service en cas de problème avec leur API

---

## Table service_response_fields - Champs retournés par les APIs

### Rôle
Stocke les champs de données que les services externes retournent via leurs APIs. Ces champs sont disponibles pour le mapping et les transformations entre services.

### Champs détaillés

| Champ | Type | Description détaillée |
|-------|------|---------------------|
| `id` | int [pk] | **Identifiant unique** du champ de réponse |
| `service_id` | int [fk] | **Service qui fournit** ce champ de données |
| `field_key` | varchar | **Clé technique** du champ tel que retourné par l'API (ex: "ShowName", "video_title", "channel_id") |
| `field_name` | varchar | **Nom descriptif** affiché à l'utilisateur (ex: "Nom de la chaîne", "Titre de la vidéo", "ID de la chaîne") |

### Exemples concrets

**YouTube :**
```
field_key: "ShowName" → field_name: "Nom de la chaîne"
field_key: "ShowDescription" → field_name: "Description de la chaîne" 
field_key: "ShowUrl" → field_name: "URL de la chaîne"
field_key: "video_title" → field_name: "Titre de la vidéo"
field_key: "subscriber_count" → field_name: "Nombre d'abonnés"
```

**Gmail :**
```
field_key: "subject" → field_name: "Sujet de l'email"
field_key: "from" → field_name: "Expéditeur"
field_key: "body" → field_name: "Contenu de l'email"
field_key: "received_date" → field_name: "Date de réception"
```

### Utilité
- 📋 **Interface de mapping** : afficher les champs disponibles pour les transformations
- 🔧 **Génération automatique** : créer dynamiquement les options de mapping
- 📚 **Documentation** : expliquer aux utilisateurs quelles données sont disponibles
- 🎯 **Variables dynamiques** : permettre l'utilisation de `{{ShowName}}`, `{{ShowDescription}}`, etc.

---

## Table connections - Connexions authentifiees

### Rôle
Stocke les connexions authentifiées entre un utilisateur et un service externe. C'est ici qu'on garde les tokens OAuth pour pouvoir agir au nom de l'utilisateur.

### Champs détaillés

| Champ | Type | Description détaillée |
|-------|------|---------------------|
| `id` | int [pk] | **Identifiant unique** de la connexion |
| `user_id` | int [fk] | **Propriétaire** de cette connexion |
| `service_id` | int [fk] | **Service connecté** (Gmail, Slack, etc.) |
| `access_token` | varchar | **Token d'accès OAuth** - permet d'effectuer des requêtes API au nom de l'utilisateur |
| `refresh_token` | varchar | **Token de renouvellement** - permet de générer un nouveau access_token quand il expire |
| `expires_at` | timestamp | **Date d'expiration** du access_token - le système doit le renouveler avant cette date |
| `rate_limit_remaining` | int | **Requêtes restantes** avant d'être bloqué par l'API du service. La plupart des APIs ont des limites (ex: 1000 req/heure) |
| `rate_limit_reset` | timestamp | **Date de reset** du compteur de rate limit |
| `connection_name` | varchar | **Nom personnalisé** donné par l'utilisateur (ex: "Mon Gmail pro", "Slack équipe dev") |
| `account_identifier` | varchar | **Identifiant du compte connecté** (email, nom d'utilisateur) pour que l'utilisateur sache quel compte est connecté |
| `scopes` | text | **Permissions accordées** - liste des autorisations données (ex: "read,write,delete") |
| `is_active` | boolean | **Connexion utilisable** - permet de désactiver temporairement sans supprimer |
| `created_at` | timestamp | **Date de connexion** initiale |
| `last_used_at` | timestamp | **Dernière utilisation** - aide à identifier les connexions inutilisées |

### Pourquoi le rate limiting ?
Les APIs externes limitent le nombre de requêtes par heure/jour. En trackant ces limites, on évite :
- D'être bloqué par l'API
- De faire échouer les zaps des utilisateurs
- De devoir attendre avant de pouvoir refaire des requêtes

### Exemples d'usage
- Vérifier si on peut faire une requête avant d'exécuter un zap
- Renouveler automatiquement les tokens expirés
- Afficher à l'utilisateur ses comptes connectés

---

## Table zaps - Workflows d'automatisation

### Rôle
Un "zap" est un workflow automatisé créé par l'utilisateur. Il se compose d'un trigger (événement déclencheur) suivi d'une ou plusieurs actions.

### Champs détaillés

| Champ | Type | Description détaillée |
|-------|------|---------------------|
| `id` | int [pk] | **Identifiant unique** du zap |
| `name` | varchar | **Nom donné par l'utilisateur** (ex: "Sauvegarder les emails importants") |
| `description` | text | **Description optionnelle** pour expliquer ce que fait le zap |
| `user_id` | int [fk] | **Créateur** du zap |
| `enabled` | boolean | **Zap actif ou en pause** - l'utilisateur peut désactiver temporairement |
| `total_runs` | int | **Nombre total d'exécutions** depuis la création |
| `successful_runs` | int | **Nombre d'exécutions réussies** |
| `failed_runs` | int | **Nombre d'échecs** - aide à identifier les zaps problématiques |
| `last_run_at` | timestamp | **Dernière exécution** - montre si le zap fonctionne encore |
| `created_at` | timestamp | **Date de création** |
| `updated_at` | timestamp | **Dernière modification** de la configuration |
| `deleted_at` | timestamp | **Soft delete** - garde l'historique même après suppression |

### Exemples de zaps
- "Quand je reçois un email important → l'enregistrer dans Google Drive"
- "Quand quelqu'un mentionne ma startup sur Twitter → créer une tâche Trello"
- "Tous les vendredis à 17h → envoyer le rapport de la semaine sur Slack"

---

## Table zap_steps - Etapes dun workflow

### Rôle
Chaque zap est composé d'étapes ordonnées : 1 trigger (étape 1) suivi de 1+ actions (étapes 2, 3, etc.).

### Champs détaillés

| Champ | Type | Description détaillée |
|-------|------|---------------------|
| `id` | int [pk] | **Identifiant unique** de l'étape |
| `zap_id` | int [fk] | **Zap parent** auquel appartient cette étape |
| `step_order` | int | **Ordre d'exécution** (1 = trigger, 2 = première action, 3 = deuxième action, etc.) |
| `step_type` | varchar | **Type d'étape** :<br>- `"trigger"` : événement déclencheur<br>- `"action"` : action à exécuter |
| `trigger_id` | int [fk] | **Référence au trigger** (rempli seulement si step_type = "trigger") |
| `action_id` | int [fk] | **Référence à l'action** (rempli seulement si step_type = "action") |
| `configuration` | json | **Configuration spécifique** à cette étape (paramètres, filtres, mappings) |
| `created_at` | timestamp | **Date d'ajout** de l'étape |

### Exemple de configuration JSON
```json
{
  "filters": {
    "email_contains": "important"
  },
  "parameters": {
    "folder_name": "Emails importants",
    "notification": true
  }
}
```

---

## Table triggers - Evenements declencheurs

### Rôle
Définit tous les types d'événements disponibles pour déclencher un zap (nouveau email, mention Twitter, fichier uploadé, etc.).

### Champs détaillés

| Champ | Type | Description détaillée |
|-------|------|---------------------|
| `id` | int [pk] | **Identifiant unique** du trigger |
| `service_id` | int [fk] | **Service qui fournit** ce trigger (Gmail, Twitter, etc.) |
| `name` | varchar | **Nom descriptif** (ex: "Nouveau email reçu", "Mention sur Twitter") |
| `description` | text | **Description détaillée** de quand ce trigger se déclenche |
| `trigger_type` | varchar | **Mode de fonctionnement** :<br>- `"webhook"` : le service nous prévient en temps réel<br>- `"polling"` : on vérifie régulièrement<br>- `"schedule"` : déclenché à heure fixe |
| `polling_interval` | int | **Intervalle de vérification** en secondes (si trigger_type = "polling") |
| `webhook_method` | varchar | **Méthode HTTP** attendue pour les webhooks (GET, POST, PUT) |
| `input_schema` | json | **Schéma de configuration** - définit quels paramètres l'utilisateur peut configurer |
| `output_schema` | json | **Schéma des données fournies** - définit quelles données ce trigger produit |
| `active` | boolean | **Trigger disponible** - permet de désactiver temporairement |
| `created_at` | timestamp | **Date d'ajout** |

### Différences entre les types de triggers

**Webhook (temps réel)**
- Le service externe nous envoie une requête HTTP quand l'événement arrive
- Instantané mais nécessite une URL publique
- Exemple : GitHub nous prévient quand il y a un nouveau commit

**Polling (vérification régulière)**
- Notre système vérifie régulièrement s'il y a du nouveau
- Délai mais fonctionne avec toutes les APIs
- Exemple : vérifier toutes les 5 minutes s'il y a de nouveaux emails

**Schedule (planifié)**
- Déclenché à des heures/dates fixes
- Exemple : tous les lundis à 9h, envoyer un rapport

---

## Table actions - Actions executables

### Rôle
Définit toutes les actions qu'on peut exécuter sur les services (envoyer email, créer fichier, poster message, etc.).

### Champs détaillés

| Champ | Type | Description détaillée |
|-------|------|---------------------|
| `id` | int [pk] | **Identifiant unique** de l'action |
| `service_id` | int [fk] | **Service qui exécute** cette action |
| `name` | varchar | **Nom descriptif** (ex: "Envoyer un email", "Créer une tâche") |
| `description` | text | **Description détaillée** de ce que fait l'action |
| `http_method` | varchar | **Méthode HTTP** à utiliser (POST pour créer, PUT pour modifier, etc.) |
| `endpoint_path` | varchar | **Chemin de l'API** (ex: "/messages", "/tasks") |
| `input_schema` | json | **Schéma des paramètres** requis (titre, contenu, destinataire, etc.) |
| `output_schema` | json | **Schéma des données retournées** (ID créé, statut, etc.) |
| `active` | boolean | **Action disponible** |
| `created_at` | timestamp | **Date d'ajout** |

### Exemple d'input_schema
```json
{
  "required": ["to", "subject", "body"],
  "properties": {
    "to": {"type": "string", "description": "Destinataire"},
    "subject": {"type": "string", "description": "Sujet"},
    "body": {"type": "string", "description": "Contenu"}
  }
}
```

---

## Table zap_executions - Historique des executions

### Rôle
Chaque fois qu'un zap se déclenche, on enregistre son exécution complète. Essentiel pour le monitoring et le debugging.

### Champs détaillés

| Champ | Type | Description détaillée |
|-------|------|---------------------|
| `id` | int [pk] | **Identifiant unique** de cette exécution |
| `zap_id` | int [fk] | **Zap qui a été exécuté** |
| `status` | varchar | **Statut de l'exécution** :<br>- `"pending"` : en attente de traitement<br>- `"running"` : en cours d'exécution<br>- `"success"` : terminé avec succès<br>- `"failed"` : échec<br>- `"cancelled"` : annulé |
| `trigger_data` | json | **Données qui ont déclenché** l'exécution (nouveau email reçu, mention Twitter, etc.) |
| `started_at` | timestamp | **Heure de début** d'exécution |
| `ended_at` | timestamp | **Heure de fin** (null si encore en cours) |
| `duration_ms` | int | **Durée totale** en millisecondes - aide à détecter les lenteurs |
| `error_message` | text | **Message d'erreur** détaillé si échec |
| `error_code` | varchar | **Code d'erreur standardisé** (AUTH_FAILED, RATE_LIMITED, etc.) |
| `retry_count` | int | **Nombre de tentatives** effectuées |
| `max_retries` | int | **Maximum de tentatives** autorisé |
| `next_retry_at` | timestamp | **Prochaine tentative programmée** si échec |

### Pourquoi c'est important ?
- **Debugging** : comprendre pourquoi un zap échoue
- **Performance** : identifier les zaps trop lents
- **Facturation** : compter les exécutions pour facturer l'utilisateur
- **Analytics** : statistiques d'usage

---

## Table step_executions - Detail par etape

### Rôle
Pour chaque exécution de zap, on détaille l'exécution de chaque étape (trigger + chaque action).

### Champs détaillés

| Champ | Type | Description détaillée |
|-------|------|---------------------|
| `id` | int [pk] | **Identifiant unique** |
| `execution_id` | int [fk] | **Exécution parente** à laquelle appartient cette étape |
| `step_id` | int [fk] | **Étape du zap** qui a été exécutée |
| `status` | varchar | **Statut de cette étape** (même valeurs que zap_executions) |
| `input_data` | json | **Données reçues** par cette étape (soit du trigger, soit de l'étape précédente) |
| `output_data` | json | **Données produites** par cette étape |
| `transformed_data` | json | **Données après transformation** et mapping |
| `started_at` | timestamp | **Début de cette étape** |
| `ended_at` | timestamp | **Fin de cette étape** |
| `duration_ms` | int | **Durée de cette étape** |
| `error_message` | text | **Erreur spécifique** à cette étape |
| `error_code` | varchar | **Code d'erreur** |
| `retry_count` | int | **Tentatives pour cette étape** |

### Exemple de données
```json
// input_data - ce que reçoit l'étape
{
  "email": {
    "from": "john@example.com",
    "subject": "Projet important",
    "body": "Voici les détails..."
  }
}

// output_data - ce que produit l'étape
{
  "task_id": "123456",
  "task_url": "https://trello.com/c/123456",
  "status": "created"
}
```

---

## Table webhooks - Reception temps reel

### Rôle et concept des webhooks
Un **webhook** est comme une "sonnette" : quand quelque chose se passe chez le service externe (nouveau email, nouveau commit GitHub), au lieu d'attendre qu'on vienne vérifier, le service nous "sonne" en envoyant une requête HTTP à notre serveur.

### Champs détaillés

| Champ | Type | Description détaillée |
|-------|------|---------------------|
| `id` | int [pk] | **Identifiant unique** |
| `trigger_id` | int [fk] | **Trigger associé** (optionnel) - quand ce webhook est appelé, il peut déclencher ce trigger |
| `action_id` | int [fk] | **Action associée** (optionnel) - webhook sortant pour exécuter cette action |
| `webhook_type` | varchar | **Type de webhook** :<br>- `"trigger"` : déclenche un zap<br>- `"action"` : webhook sortant pour notifier d'autres services<br>- `"bidirectional"` : webhook qui peut recevoir et envoyer |
| `webhook_url` | varchar [unique] | **URL publique** que le service externe doit appeler ou qu'on doit appeler (ex: https://monapp.com/webhook/abc123) |
| `webhook_secret` | varchar | **Secret partagé** pour vérifier que la requête vient bien du bon service (sécurité) |
| `expected_headers` | json | **Headers attendus** dans la requête webhook |
| `signature_header` | varchar | **Nom du header** contenant la signature de sécurité |
| `active` | boolean | **Webhook opérationnel** |
| `total_received` | int | **Nombre de webhooks reçus/envoyés** - statistiques |
| `last_received_at` | timestamp | **Dernier webhook reçu/envoyé** - aide à détecter si ça fonctionne |
| `created_at` | timestamp | **Date de création** |

### Types de webhooks

**Webhook entrant (trigger)**
- Reçoit des données d'un service externe
- Déclenche l'exécution d'un zap
- Exemple : GitHub nous notifie d'un nouveau commit

**Webhook sortant (action)**
- Envoie des données vers un service externe
- Fait partie des actions d'un zap
- Exemple : Notifier un service externe quand un zap se termine

**Webhook bidirectionnel**
- Peut recevoir ET envoyer des données
- Permet des interactions complexes
- Exemple : Slack interactif (boutons, réponses)

### Exemples d'usage

```sql
-- Webhook entrant classique (trigger)
INSERT INTO webhooks (trigger_id, webhook_type, webhook_url) 
VALUES (1, 'trigger', 'https://app.com/webhook/github-push');

-- Webhook sortant (action) 
INSERT INTO webhooks (action_id, webhook_type, webhook_url)
VALUES (5, 'action', 'https://external-service.com/notify');

-- Webhook bidirectionnel
INSERT INTO webhooks (trigger_id, action_id, webhook_type, webhook_url)
VALUES (1, 5, 'bidirectional', 'https://app.com/webhook/slack-interactive');
```

### Pourquoi les webhooks ?
**Avantages** :
- ⚡ **Instantané** : pas de délai d'attente
- 📉 **Économique** : pas besoin de vérifier constamment
- 🔋 **Efficace** : moins de ressources serveur

**Inconvénients** :
- 🌐 **URL publique nécessaire** : le serveur doit être accessible depuis Internet
- 🔒 **Sécurité à gérer** : vérifier que les requêtes viennent bien du bon service

---

## Table service_form_fields - Configuration dynamique

### Rôle
Chaque service, trigger et action peut avoir des paramètres différents. Au lieu de coder en dur tous les champs possibles, on les stocke dynamiquement en base pour générer les formulaires d'interface.

### Champs détaillés

| Champ | Type | Description détaillée |
|-------|------|---------------------|
| `id` | int [pk] | **Identifiant unique** |
| `service_id` | int [fk] | **Service concerné** |
| `trigger_id` | int [fk] | **Trigger spécifique** (optionnel) - champs spécifiques à ce trigger |
| `action_id` | int [fk] | **Action spécifique** (optionnel) - champs spécifiques à cette action |
| `field_key` | varchar | **Clé technique** utilisée dans le code (ex: "recipient_email") |
| `field_name` | varchar | **Nom affiché** à l'utilisateur (ex: "Adresse email du destinataire") |
| `field_type` | varchar | **Type de champ interface** :<br>- `"string"` : texte simple<br>- `"textarea"` : texte long<br>- `"number"` : nombre<br>- `"boolean"` : case à cocher<br>- `"select"` : liste déroulante<br>- `"date"` : sélecteur de date |
| `required` | boolean | **Champ obligatoire** ou optionnel |
| `default_value` | text | **Valeur par défaut** |
| `validation_rules` | json | **Règles de validation** (regex, min/max longueur, etc.) |
| `field_options` | json | **Options du champ** (liste des choix pour un select, min/max pour un number) |
| `help_text` | text | **Texte d'aide** affiché sous le champ |
| `placeholder` | varchar | **Placeholder** dans le champ de saisie |
| `field_order` | int | **Ordre d'affichage** des champs |
| `active` | boolean | **Champ disponible** |

### Niveaux de configuration

**Niveau service (configuration générale)**
```sql
service_id: 1 (Gmail)
trigger_id: NULL
action_id: NULL
field_key: "account_type"
field_name: "Type de compte Gmail"
```

**Niveau trigger spécifique**
```sql
service_id: 1 (Gmail)
trigger_id: 1 (nouveau email)
action_id: NULL
field_key: "label_filter"
field_name: "Filtrer par libellé"
```

**Niveau action spécifique**
```sql
service_id: 1 (Gmail)
trigger_id: NULL
action_id: 1 (envoyer email)
field_key: "send_mode"
field_name: "Mode d'envoi"
```

### Exemple concret - Action "Envoyer email"
```
field_key: "to"
field_name: "Destinataire"
field_type: "string"
required: true
placeholder: "email@example.com"
help_text: "L'adresse email du destinataire"

field_key: "priority"
field_name: "Priorité"
field_type: "select"
field_options: {"choices": ["low", "normal", "high"]}
default_value: "normal"
```

### Pourquoi cette approche ?
- 🔧 **Flexibilité** : ajouter un nouveau service sans changer le code
- 🎨 **Interface dynamique** : générer automatiquement les formulaires
- 🔄 **Évolutivité** : modifier les champs d'un service facilement
- 🎯 **Configuration granulaire** : paramètres différents selon le contexte

---

## Table data_transformations - Le coeur de zapier

### Rôle et importance critique
C'est **la table la plus importante** conceptuellement ! Elle résout le problème central de Zapier : comment connecter des services qui parlent des "langues" différentes ?

### Le problème à résoudre
- Gmail appelle un email un `"message"` avec un champ `"subject"`
- Trello appelle une tâche un `"card"` avec un champ `"name"`
- Comment transformer automatiquement le `subject` de Gmail en `name` de Trello ?

### Champs détaillés

| Champ | Type | Description détaillée |
|-------|------|---------------------|
| `id` | int [pk] | **Identifiant unique** |
| `zap_step_id` | int [fk] | **Étape du zap** concernée par cette transformation |
| `source_field` | varchar | **Champ source** (d'où viennent les données) |
| `target_field` | varchar | **Champ cible** (où vont les données) |
| `transformation_type` | varchar | **Type de transformation** :<br>- `"direct"` : copie directe<br>- `"format"` : formatage (majuscules, date, etc.)<br>- `"calculate"` : calcul (addition, concaténation)<br>- `"lookup"` : recherche dans une table |
| `transformation_config` | json | **Configuration de la transformation** |
| `created_at` | timestamp | **Date de création** |

### Exemples concrets de transformations

**1. Transformation directe (direct)**
```json
{
  "source_field": "email.subject",
  "target_field": "card.name",
  "transformation_type": "direct"
}
// Le sujet de l'email devient le titre de la carte Trello
```

**2. Formatage (format)**
```json
{
  "source_field": "user.name",
  "target_field": "message.text",
  "transformation_type": "format",
  "transformation_config": {
    "template": "Bonjour {{user.name|uppercase}}, vous avez un nouveau message"
  }
}
// "john doe" → "Bonjour JOHN DOE, vous avez un nouveau message"
```

**3. Calcul (calculate)**
```json
{
  "source_field": "order.items",
  "target_field": "invoice.total",
  "transformation_type": "calculate",
  "transformation_config": {
    "operation": "sum",
    "field": "price"
  }
}
// Additionner tous les prix des articles
```

### Pourquoi c'est crucial ?
Sans cette table, il faudrait :
- Coder manuellement chaque combinaison service A → service B
- Modifier le code à chaque nouveau service
- Les utilisateurs ne pourraient pas personnaliser les mappings

Avec cette table :
- ✅ **Flexibilité totale** : l'utilisateur mappe comme il veut
- ✅ **Pas de code spécifique** : tout est générique
- ✅ **Transformations complexes** : formatage, calculs, conditions

---

## Table execution_logs - Debugging avance

### Rôle
Quand un zap échoue, les utilisateurs et le support ont besoin de logs détaillés pour comprendre exactement ce qui s'est passé.

### Champs détaillés

| Champ | Type | Description détaillée |
|-------|------|---------------------|
| `id` | int [pk] | **Identifiant unique** |
| `zap_execution_id` | int [fk] | **Exécution concernée** |
| `step_execution_id` | int [fk] | **Étape spécifique** (optionnel pour les logs généraux) |
| `log_level` | varchar | **Niveau de log** :<br>- `"debug"` : informations techniques détaillées<br>- `"info"` : étapes normales du processus<br>- `"warning"` : problèmes non bloquants<br>- `"error"` : erreurs qui font échouer |
| `message` | text | **Message descriptif** de ce qui s'est passé |
| `context` | json | **Contexte supplémentaire** (variables, stack trace, réponse API) |
| `created_at` | timestamp | **Horodatage précis** du log |

### Exemple de logs pour un zap qui échoue
```
[INFO] Démarrage de l'exécution du zap "Email → Trello"
[DEBUG] Récupération des données du trigger: {"email": {"subject": "Urgent", "from": "boss@company.com"}}
[INFO] Exécution de l'action "Créer une carte Trello"
[DEBUG] Données transformées: {"card_name": "Urgent", "card_description": "Email de boss@company.com"}
[ERROR] Échec de l'API Trello: {"error": "Invalid board ID", "code": 400}
[DEBUG] Contexte: {"board_id": "invalid123", "api_response": {...}}
```

### Utilité
- 🔍 **Support client** : diagnostiquer rapidement les problèmes
- 🐛 **Debugging** : comprendre les échecs complexes
- 📊 **Monitoring** : détecter les problèmes récurrents
- 🔧 **Optimisation** : identifier les goulots d'étranglement

---

## Relations et flux de donnees

### Flux typique d'exécution d'un zap

1. **Trigger détecté** → Nouveau webhook reçu ou polling détecte un changement
2. **Zap_execution créée** → On commence l'enregistrement de l'exécution
3. **Step_executions** → On exécute chaque étape du zap dans l'ordre
4. **Data_transformations** → À chaque étape, on transforme les données selon `service_response_fields`
5. **Execution_logs** → On enregistre tous les détails pour le debugging
6. **Mise à jour des stats** → On met à jour les compteurs du zap

### Relations critiques
- **User** → a plusieurs **Connections** → vers des **Services**
- **User** → crée des **Zaps** → composés de **Zap_steps**
- **Services** → définissent des **Service_response_fields** → utilisés dans **Data_transformations**
- **Services** → offrent des **Triggers** et **Actions** → configurés via **Service_form_fields**
- **Zap** → s'exécute → créant des **Zap_executions** → détaillées en **Step_executions**
- **Webhooks** → peuvent être **entrants** (déclenchent des triggers) ou **sortants** (exécutent des actions)

### Nouveaux flux avec les améliorations

**Mapping intelligent** :
1. `Service_response_fields` définit les champs disponibles
2. L'interface propose automatiquement les mappings compatibles
3. `Data_transformations` stocke les règles de transformation
4. L'exécution applique les transformations en temps réel

**Webhooks bidirectionnels** :
1. Webhook entrant → déclenche un zap
2. Zap traite les données
3. Webhook sortant → notifie le service externe du résultat

Cette architecture permet une flexibilité maximale tout en gardant une traçabilité complète de tout ce qui se passe dans le système.

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
| **webhook** | Crochet web | URL appelée par un service externe pour signaler un événement en temps réel, ou URL qu'on appelle pour notifier. |
| **endpoint** | Point de terminaison | Chemin d'accès à une ressource ou une action dans une API. |
| **schema** | Schéma | Structure ou modèle de données attendu ou produit (ex: input_schema, output_schema). |
| **polling** | Interrogation régulière | Technique consistant à vérifier périodiquement la présence de nouveaux événements. |
| **trigger** | Déclencheur | Événement qui lance l'exécution d'un workflow (zap). |
| **action** | Action | Opération exécutée suite à un trigger (ex: envoyer un email, créer une tâche). |
| **mapping** | Correspondance | Association entre champs de données de différents services, définie dans `data_transformations`. |
| **transformation** | Transformation | Modification ou adaptation des données entre services (formatage, calcul, etc.). |
| **log** | Journal | Enregistrement d'événements ou d'erreurs pour le suivi et le debugging. |
| **bidirectionnel** | Bidirectionnel | Qui fonctionne dans les deux sens, comme un webhook qui peut recevoir ET envoyer des données. |
| **field mapping** | Correspondance de champs | Processus de liaison entre les champs d'un service source et d'un service cible. |

Ce lexique permet de mieux comprendre les termes utilisés dans la documentation et la structure de la base de données.
