FROM node:20.19.0-slim

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
    rm cmdtools.zip && \
    yes | ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager --licenses && \
    ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

RUN npm install -g npm@11.6.2
RUN npm install -g eas-cli

COPY package*.json ./
RUN echo "legacy-peer-deps=true" > .npmrc
RUN npm install

COPY . .

# Initialiser un dépôt git pour EAS CLI  --non-interactive
RUN git init \
    && git config user.email "docker@local" \
    && git config user.name "Docker Build" \
    && git add . \
    && git commit -m "Initial commit"



COPY build.sh /build.sh
RUN chmod +x /build.sh

CMD ["/build.sh"]