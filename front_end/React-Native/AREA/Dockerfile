FROM node:18.18.0-alpine AS builder
WORKDIR /
COPY package*.json ./
RUN echo "legacy-peer-deps=true" > .npmrc
RUN npm install
COPY . .
RUN npx expo prebuild -p android
RUN chmod +x build_apk_docker.sh
RUN ./build_apk_docker.sh