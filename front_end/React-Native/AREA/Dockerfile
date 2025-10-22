FROM node:20.19.0-slim

RUN apt-get update && apt-get install -y \
    git \
    openjdk-17-jdk \
    wget \
    unzip \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

WORKDIR /app

ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=${ANDROID_HOME}
ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/build-tools/34.0.0

# Installation Android SDK - nettoyage immédiat
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdtools.zip && \
    unzip -q cmdtools.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm -f cmdtools.zip && \
    yes | ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager --licenses && \
    ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager \
        "platform-tools" \
        "platforms;android-34" \
        "build-tools;34.0.0" \
        "ndk;27.1.12297006" && \
    rm -rf ${ANDROID_HOME}/cmdline-tools/latest/.temp \
           ${ANDROID_HOME}/temp \
           /tmp/* \
           /var/tmp/*

# NPM global - nettoyage immédiat
RUN npm install -g npm@11.6.2 eas-cli@latest && \
    npm cache clean --force && \
    rm -rf /root/.npm/_cacache \
           /tmp/npm-*

# Dependencies - nettoyage immédiat
COPY package*.json ./
RUN echo "legacy-peer-deps=true" > .npmrc && \
    npm install && \
    npm cache clean --force && \
    rm -rf /root/.npm/_cacache \
           /tmp/npm-* \
           /tmp/v8-*

# Code source
COPY . .

# Git init
RUN git init && \
    git config user.email "docker@local" && \
    git config user.name "Docker Build" && \
    git add . && \
    git commit -m "Initial commit"

# Variables d'environnement pour limiter l'usage mémoire/disque
ENV GRADLE_OPTS="-Xmx2048m -XX:MaxMetaspaceSize=512m -XX:+UseParallelGC -Dorg.gradle.daemon=false -Dorg.gradle.jvmargs=-Xmx2048m"
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV EAS_NO_VCS=1

COPY build.sh /build.sh
RUN chmod +x /build.sh

# Crée le dossier xml s'il n'existe pas
RUN mkdir -p android/app/src/main/res/xml

# Crée le fichier network_security_config.xml
RUN echo '<?xml version="1.0" encoding="utf-8"?>' > android/app/src/main/res/xml/network_security_config.xml && \
    echo '<network-security-config>' >> android/app/src/main/res/xml/network_security_config.xml && \
    echo '    <base-config cleartextTrafficPermitted="true">' >> android/app/src/main/res/xml/network_security_config.xml && \
    echo '        <trust-anchors>' >> android/app/src/main/res/xml/network_security_config.xml && \
    echo '            <certificates src="system" />' >> android/app/src/main/res/xml/network_security_config.xml && \
    echo '        </trust-anchors>' >> android/app/src/main/res/xml/network_security_config.xml && \
    echo '    </base-config>' >> android/app/src/main/res/xml/network_security_config.xml && \
    echo '</network-security-config>' >> android/app/src/main/res/xml/network_security_config.xml

RUN ls android/app/src/main

RUN sed -i 's/<application/<application android:networkSecurityConfig="@xml\/network_security_config" android:usesCleartextTraffic="true"/' android/app/src/main/AndroidManifest.xml

CMD ["/build.sh"]
