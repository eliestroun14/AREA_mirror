#!/bin/bash
set -e

if [ -z "$EXPO_TOKEN" ]; then
    echo "Erreur: EXPO_TOKEN n'est pas défini dans le .env"
    exit 1
fi

echo "Token détecté"
echo "Démarrage du build Android..."

eas build --platform android --local --non-interactive

echo "Build terminé !"