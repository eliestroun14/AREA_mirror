#!/bin/bash
set -e

if [ -z "$EXPO_TOKEN" ]; then
    echo "Erreur: EXPO_TOKEN n'est pas défini dans le .env"
    exit 1
fi

echo "Token détecté"
echo "Démarrage du build Android..."

# Nettoyer avant le build
rm -rf /tmp/* /var/tmp/* 2>/dev/null || true
rm -rf android/build android/.gradle 2>/dev/null || true

# Créer le dossier de sortie
mkdir -p /app/builds

# Lancer le build
eas build --platform android --profile production --local --non-interactive --output /app/builds/app.apk

# Nettoyer après le build
echo "Nettoyage post-build..."
rm -rf /tmp/* /var/tmp/* /root/.gradle/caches/* 2>/dev/null || true

echo "Build terminé !"
echo "APK disponible dans /app/builds/"

# Garder le conteneur actif pour récupérer l'APK
tail -f /dev/null