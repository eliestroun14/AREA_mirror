FROM node:18.18.0-slim AS builder

RUN apt-get update && apt-get install -y \
    git \
    openjdk-17-jdk \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=${ANDROID_HOME}
ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/build-tools/34.0.0

RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdtools.zip && \
    unzip -q cmdtools.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm cmdtools.zip

RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

ENV GRADLE_USER_HOME=/app/.gradle
RUN mkdir -p ${GRADLE_USER_HOME}

COPY package*.json ./
RUN echo "legacy-peer-deps=true" > .npmrc
RUN npm install

COPY . .

RUN npx expo prebuild -p android

RUN cd android && ./gradlew clean || true

RUN chmod +x build_apk_docker.sh
RUN ./build_apk_docker.sh