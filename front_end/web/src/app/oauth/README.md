# OAuth Redirect Configuration

Ce dossier contient les pages de redirection OAuth pour l'application AREA.

## Pages disponibles

### `/oauth/success`
Page affichée après une authentification OAuth réussie. Cette page :
- Affiche un message de succès avec une icône animée
- Ferme automatiquement la fenêtre après 3 secondes
- Permet à l'utilisateur de fermer manuellement la fenêtre
- Redirige vers `/explore` si la fermeture automatique ne fonctionne pas

### `/oauth/error`
Page affichée en cas d'erreur lors de l'authentification OAuth.

## Configuration Backend

Pour que la redirection fonctionne correctement, vous devez configurer l'URL de redirection dans le backend.

### Fichier `.env` du backend

Ajoutez cette variable d'environnement dans `/back_end/.env` :

```bash
WEB_SUCCESS_OAUTH2_REDIRECT_URL='http://localhost:3000/oauth/success'
```

### En production

Modifiez l'URL pour pointer vers votre domaine de production :

```bash
WEB_SUCCESS_OAUTH2_REDIRECT_URL='https://votre-domaine.com/oauth/success'
```

## Comment ça marche

1. L'utilisateur clique sur "Connect to [Service]" dans l'application
2. Une nouvelle fenêtre s'ouvre avec l'URL OAuth (`window.open()`)
3. L'utilisateur se connecte au service (Gmail, Discord, GitHub, etc.)
4. Le service redirige vers le callback du backend (`/oauth2/[service]/callback`)
5. Le backend enregistre la connexion et redirige vers `/oauth/success`
6. La page de succès s'affiche et la fenêtre se ferme automatiquement
7. L'utilisateur retourne à l'application principale avec la connexion établie

## Structure des fichiers

```
/oauth
  /success
    page.tsx    # Page de succès OAuth
  /error
    page.tsx    # Page d'erreur OAuth
  README.md     # Ce fichier
```

## Styles

Les pages utilisent Material-UI avec :
- Gradients animés pour un design moderne
- Animations CSS pour les icônes
- Responsive design
- Auto-fermeture avec compte à rebours
