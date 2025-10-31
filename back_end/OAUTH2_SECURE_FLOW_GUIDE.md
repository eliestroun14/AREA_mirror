# Intégration d'un flow OAuth2 sécurisé avec token chiffré (pattern Discord)

## 3. Guard OAuth2 spécifique au service
- Créer un guard (ex: `DiscordOAuthGuard`) qui :
  - Récupère le token chiffré depuis `query.token` (init) ou `query.state` (callback)
  - Déchiffre le token et place le JWT dans `request['oauth_jwt']`
  - Génère un nouveau token chiffré pour le paramètre `state` lors de la redirection vers le provider

## 4. Guard JWT custom (JwtOAuthGuard)
- Ce guard doit :
  - Chercher le JWT dans `request['oauth_jwt']` en priorité
  - Sinon, fallback sur `query.token` (jamais sur `query.state`)
  - Mettre le JWT dans l'en-tête Authorization pour la stratégie Passport

## 5. Callback OAuth2
- Sur la route callback (`/oauth2/<service>/callback`), utiliser les guards dans cet ordre :
  - `@UseGuards(ServiceOAuthGuard, JwtOAuthGuard)` (le guard service d'abord, puis le JWT)
- Dans le contrôleur, déchiffrer explicitement le paramètre `state` pour récupérer la plateforme et adapter la redirection (web/mobile).

## 6. Sécurité
- Ne jamais exposer le JWT brut dans l'URL.
- Toujours vérifier la validité et l'expiration du token chiffré côté backend.

