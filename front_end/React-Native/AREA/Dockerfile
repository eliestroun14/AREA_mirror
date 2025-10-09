FROM node:18.18.0-slim AS builder

# Installer les dépendances système nécessaires pour Expo
RUN apt-get update && apt-get install -y \
    git \
    openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /

COPY package*.json ./
RUN echo "legacy-peer-deps=true" > .npmrc
RUN npm install

COPY . .

# Vérifier que npx est disponible (optionnel, pour debug)
RUN npx --version

RUN npx expo prebuild -p android
RUN chmod +x build_apk_docker.sh
RUN ./build_apk_docker.sh