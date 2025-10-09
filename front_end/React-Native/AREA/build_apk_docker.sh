#!/bin/bash
# Release APK builder
set -e

# ===== CONFIGURATION - MODIFIEZ CES VALEURS =====
UPLOAD_KEY_NAME="area"        # Nom du keystore (sans .keystore)
UPLOAD_KEY_ALIAS="keyAlias"   # Alias de la clé
KEYSTORE_PASSWORD="password"  # Mot de passe du keystore
KEY_PASSWORD="password"       # Mot de passe de la clé
DNAME="CN=[Unknown], OU=AREA, O=EPITECH, L=[Unknown], ST=FRANCE, C=FR"  # Informations du certificat
# ================================================

BOLD='\e[1m'
RED='\e[31m'
BLUE='\e[96m'
NC='\e[0m'
DIFF_ADD="\e[K\e[38;5;10m\e[48;5;22m"
DIFF_DEL="\e[K\e[38;5;88m\e[48;5;224m"

cleanup() {
    if [ -t 1 ]; then
        tput cnorm 2>/dev/null || true
    fi
}
trap cleanup EXIT

echo -e "${BLUE}[>>] Building a release APK...${NC}"

if [ ! -f *.keystore ]; then
    echo -e "${BLUE}[>>] Creating the keystore file...${NC}"
    echo -e " ${BLUE}[>] Using key name: ${UPLOAD_KEY_NAME}${NC}"
    echo -e " ${BLUE}[>] Using key alias: ${UPLOAD_KEY_ALIAS}${NC}"

    keytool -genkey -v \
        -keystore ${UPLOAD_KEY_NAME}.keystore \
        -alias ${UPLOAD_KEY_ALIAS} \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -storepass ${KEYSTORE_PASSWORD} \
        -keypass ${KEY_PASSWORD} \
        -dname "${DNAME}"

    cp ${UPLOAD_KEY_NAME}.keystore android/app/
    echo -e ""
else
    echo -e "${BLUE}[>>] Keystore file already present.${NC}"
    echo -e " ${BLUE}[>] Using $(ls | grep .keystore)...${NC}"
    echo -e " ${BLUE}[>] If you don't want to reuse it, move it elsewhere before executing this script.${NC}"
    cp $(ls | grep .keystore) android/app/
fi

echo -e "${BLUE}[>>] Installing needed Java version:${NC}"

cd android

find . -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/build/*" \
  -not -path "*/.gradle/*" \
  -exec sed -i "s/com.android.tools.build:gradle/com.android.tools.build:gradle:8.3.0/g" {} +

cd app

find . -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/build/*" \
  -not -path "*/.gradle/*" \
  -exec sed -i "s/versionName \"1.0.0\"/versionName \"1.0.0\"\n\t\tmanifestPlaceholders = [appAuthRedirectScheme: \'com.micouillette.AREA\']/g" {} +

cd ..
cd ..

AGP_VERSION=$(grep -oP "(?<=com.android.tools.build:gradle:)[0-9]+\.[0-9]+" android/build.gradle | head -1)
if [[ -z "$AGP_VERSION" ]]; then
    echo -e " ${BLUE}[>] Could not detect Android Gradle Plugin version from android/build.gradle${NC}"
    exit 1
fi

if [[ "$AGP_VERSION" =~ ^7\. ]]; then
    REQUIRED_JAVA=11
elif [[ "$AGP_VERSION" =~ ^8\. ]]; then
    REQUIRED_JAVA=17
else
    echo -e " ${BLUE}[>] Unknown AGP version $AGP_VERSION, defaulting to Java 17${NC}"
    REQUIRED_JAVA=17
fi

echo -e " ${BLUE}[>] Detected AGP $AGP_VERSION -> requires Java $REQUIRED_JAVA${NC}"

if command -v java >/dev/null; then
    CURRENT_JAVA=$(java -version 2>&1 | awk -F[\".] '/version/ {print $2}')
    echo -e " ${BLUE}[>] Current Java version: $CURRENT_JAVA${NC}"
    if [[ "$CURRENT_JAVA" != "$REQUIRED_JAVA" ]]; then
        echo -e " ${BLUE}[>] Wrong Java version. Please install Java $REQUIRED_JAVA${NC}"
        exit 1
    fi
else
    echo -e " ${BLUE}[>] Java not installed. Please install Java $REQUIRED_JAVA${NC}"
    exit 1
fi

java -version

echo -e "${BLUE}[>>] Generating release Android AAB:${NC}"
echo -e " ${BLUE}[>] This may take a while.${NC}"

cd android
./gradlew app:bundleRelease
./gradlew assembleRelease

echo -e "${BLUE}[>>] Build outputs:${NC}"
echo -e " ${BLUE}[>] AAB: app/build/outputs/bundle/release/app-release.aab${NC}"
echo -e " ${BLUE}[>] APK: app/build/outputs/apk/release/app-release.apk${NC}"