Project initialization.

## Area Mirror

this project is a mirror of the AREA project, which is a collaborative project developed by a group of students at Epitech. When pushing on this repository, the changes are automatically mirrored to the main AREA repository after the CI tests have passed successfully.

## Installation et Setup

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- **Node.js** (v18+) et **pnpm** (ou npm)
- **Docker** et **Docker Compose**
- **PostgreSQL** (si vous ne l'exécutez pas dans Docker)
- **Git**

### Configuration de l'environnement

L'application utilise des fichiers `.env` pour gérer les variables de configuration. Suivez les étapes ci-dessous pour les configurer correctement.

#### 1. Fichier `.env` à la racine

Copiez le fichier d'exemple et remplissez les variables :

```bash
cp .env.example .env
```

**Variables disponibles** :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `POSTGRES_USER` | Utilisateur PostgreSQL | `user` |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL | `password` |
| `POSTGRES_DB` | Nom de la base de données | `area` |
| `POSTGRES_HOST` | Hôte PostgreSQL | `postgres` (Docker) ou `localhost` |
| `POSTGRES_PORT` | Port PostgreSQL | `5432` |
| `EXPO_TOKEN` | Token Expo pour les notifications push (mobile) | `votre_token_expo` |

#### 2. Fichier `.env` dans le dossier `back_end/`

Ce fichier contient toutes les configurations du serveur backend :

```bash
cp back_end/.env.example back_end/.env
```

**Variables disponibles** :

##### Configuration PostgreSQL

| Variable | Description | Exemple |
|----------|-------------|---------|
| `POSTGRES_USER` | Utilisateur PostgreSQL | `user` |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL | `password` |
| `POSTGRES_DB` | Nom de la base de données | `area` |
| `POSTGRES_HOST` | Hôte PostgreSQL | `127.0.0.1` ou `postgres` (Docker) |
| `POSTGRES_PORT` | Port PostgreSQL | `5432` |
| `DATABASE_URL` | URL de connexion à la base de données | `postgres://user:password@localhost:5432/area` |

##### Configuration Authentification

| Variable | Description | Exemple |
|----------|-------------|---------|
| `JWT_SECRET` | Clé secrète pour signer les tokens JWT | `FSJKHdsnsl,slfejofijff` |
| `BCRYPT_SALT_ROUNDS` | Nombre de tours pour le hashage bcrypt | `12` |
| `TOKEN_ENCRYPTION_KEY` | Clé pour chiffrer les tokens sensibles | `votre_cle_chiffrement` |

##### Configuration URLs Frontend

| Variable | Description | Exemple |
|----------|-------------|---------|
| `WEB_HOME_URL` | URL de l'application web | `http://localhost:3001` |
| `MOBILE_HOME_URL` | URL du schéma de l'application mobile | `area://` |
| `API_BASE_URL` | URL de base de l'API backend | `http://127.0.0.1:8080` |

##### Configuration OAuth2 Redirect URLs

| Variable | Description | Exemple |
|----------|-------------|---------|
| `WEB_SUCCESS_OAUTH2_REDIRECT_URL` | URL de redirection après succès OAuth2 (web) | `http://localhost:3001/oauth/success` |
| `MOBILE_SUCCESS_OAUTH2_REDIRECT_URL` | URL de redirection après succès OAuth2 (mobile) | `area://oauth2/success` |

##### Configuration Services OAuth2

Pour intégrer les services externes, vous devez créer des applications OAuth2 et ajouter vos credentials :

**Discord**
| Variable | Description |
|----------|-------------|
| `DISCORD_CLIENT_ID` | ID client Discord OAuth2 |
| `DISCORD_CLIENT_SECRET` | Secret client Discord OAuth2 |

**GitHub**
| Variable | Description |
|----------|-------------|
| `GITHUB_CLIENT_ID` | ID client GitHub OAuth2 |
| `GITHUB_CLIENT_SECRET` | Secret client GitHub OAuth2 |

**Google**
| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | ID client Google OAuth2 |
| `GOOGLE_CLIENT_SECRET` | Secret client Google OAuth2 |

**Twitch**
| Variable | Description |
|----------|-------------|
| `TWITCH_CLIENT_ID` | ID client Twitch OAuth2 |
| `TWITCH_CLIENT_SECRET` | Secret client Twitch OAuth2 |

**Google Calendar**
| Variable | Description |
|----------|-------------|
| `GOOGLE_CALENDAR_CLIENT_ID` | ID client Google Calendar |
| `GOOGLE_CALENDAR_CLIENT_SECRET` | Secret client Google Calendar |

**YouTube**
| Variable | Description |
|----------|-------------|
| `YOUTUBE_CLIENT_ID` | ID client YouTube |
| `YOUTUBE_CLIENT_SECRET` | Secret client YouTube |

**Google Drive**
| Variable | Description |
|----------|-------------|
| `DRIVE_CLIENT_ID` | ID client Google Drive |
| `DRIVE_CLIENT_SECRET` | Secret client Google Drive |

**Teams**
| Variable | Description |
|----------|-------------|
| `TEAMS_CLIENT_ID` | ID client Teams |
| `TEAMS_CLIENT_SECRET` | Secret client Teams |

**Microsoft onedrive**
| Variable | Description |
|----------|-------------|
| `MICROSOFT_ONEDRIVE_CLIENT_ID` | ID client Microsoft onerive |
| `MICROSOFT_ONEDRIVE_CLIENT_SECRET` | Secret client Microsoft onerive |

##### Configuration supplémentaire

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DOWNLOAD_FILE_PATH` | Chemin pour télécharger les fichiers (ex: APK mobile) | `/path/to/your/app.apk` |

### Lancement du projet

#### Avec Docker (recommandé)

```bash
# Lancer l'application complète avec Docker Compose
docker-compose up -d --build

# L'application sera accessible à :
# - Backend API: http://localhost:8080
# - Frontend Web: http://localhost:8081
# - Base de données: localhost:5432
```

##  👥Contributeurs

Ce projet a été développé par :


| | | |
|:---:|:---:|:---:|
| <a href="https://github.com/eliestroun14"><img src="https://github.com/eliestroun14.png" width="70" height="70" alt="Elie"/><br/>Elie Stroun</a> | <a href="https://github.com/nitrached"><img src="https://github.com/nitrached.png" width="70" height="70" alt="Manech"/><br/>Manech Dubreil</a> | <a href="https://github.com/AymericJM"><img src="https://github.com/AymericJM.png" width="70" height="70" alt="Aymeric"/><br/>Aymeric Jouannet-Mimy</a> |
| <a href="https://github.com/nl1x"><img src="https://github.com/nl1x.png" width="70" height="70" alt="Nathan"/><br/>Nathan Jeannot</a> | <a href="https://github.com/smoulmouc"><img src="https://github.com/smoulmouc.png" width="70" height="70" alt="Pablo Jesus"/><br/>Pablo Jesus</a> | | |
