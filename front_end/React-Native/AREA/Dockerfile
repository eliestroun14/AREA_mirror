FROM node:18.18.0-slim AS builder

RUN apt-get update && apt-get install -y \
    git \
    openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN echo "legacy-peer-deps=true" > .npmrc
RUN npm install
COPY . .

RUN npx --version

RUN npx expo prebuild -p android
RUN chmod +x build_apk_docker.sh
RUN bash -x ./build_apk_docker.sh