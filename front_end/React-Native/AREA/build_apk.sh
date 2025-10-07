#!/bin/bash
# Realease APK builder

set -e
BOLD='\e[1m'
RED='\e[31m'
BLUE='\e[96m'
NC='\e[0m'
DIFF_ADD="\e[K\e[38;5;10m\e[48;5;22m"
DIFF_DEL="\e[K\e[38;5;88m\e[48;5;224m"

cleanup() { tput cnorm
}; trap cleanup EXIT


echo -e "${BLUE}[>>] Building a release APK...${NC}"

if [ ! -f *.keystore ]; then
    echo -e "${BLUE}[>>] Creating the keystore file...${NC}"
    echo -e "  ${BLUE}[>] Enter your upload key name (without '.keystore'}:${NC}"
    read -p "    > " uploadKeyName
    echo -e "  ${BLUE}[>] Enter your upload key alias:${NC}"
    read -p "    > " uploadKeyAlias
    sudo keytool -genkey -v \
        -keystore ${uploadKeyName}.keystore \
        -alias ${uploadKeyAlias} \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000
    cp ${uploadKeyName}.keystore android/app/
    echo -e ""
else
    echo -e "${BLUE}[>>] Keystore file already present.${NC}"
    echo -e "  ${BLUE}[>] Using $(ls | grep .keystore)...${NC}"
    echo -e "  ${BLUE}[>] If you don't want to reuse it, move it elsewhere before executing this script.${NC}"
    cp $(ls | grep .keystore) android/app/
fi

echo -e "${BLUE}[>>] Update these gradle variables in android/gradle.properties:${NC}"
echo -e ""
echo -e "BH_UPLOAD_STORE_FILE=$(ls | grep .keystore)"
echo -e "BH_UPLOAD_KEY_ALIAS=${uploadKeyAlias:-********}\t\t# Replace with key alias"
echo -e "BH_UPLOAD_STORE_PASSWORD=********\t# Replace with upload store password"
echo -e "BH_UPLOAD_KEY_PASSWORD=********\t\t# Replace with upload key password"
echo -e ""

tput civis
read -p "Press Enter to continue..." </dev/tty
tput cnorm

echo -e "${BLUE}[>>] Add signing configuration to android/app/build.gradle:${NC}"
echo -e "         ..."
echo -e "         keyAlias 'androiddebugkey'"
echo -e "         keyPassword 'android'"
echo -e "     }${DIFF_ADD}"
echo -e "     release {"
echo -e "         if (project.hasProperty('BH_UPLOAD_STORE_FILE')) {"
echo -e "             storeFile file(BH_UPLOAD_STORE_FILE)"
echo -e "             storePassword BH_UPLOAD_STORE_PASSWORD"
echo -e "             keyAlias BH_UPLOAD_KEY_ALIAS"
echo -e "             keyPassword BH_UPLOAD_KEY_PASSWORD"
echo -e "         }"
echo -e "     }${NC}"
echo -e " }"
echo -e " buildTypes {"
echo -e "     debug {"
echo -e "         signingConfig signingConfigs.debug"
echo -e "     }"
echo -e "     release {"
echo -e "         // Caution! In production, you need to generate your own keystore file."
echo -e "         // see https://reactnative.dev/docs/signed-apk-android.${DIFF_ADD}"
echo -e "         signingConfig signingConfigs.release${NC}"
echo -e "         shrinkResources (findProperty('android.enableShrinkResourcesInReleaseBuilds')?.toBoolean() ?: false)"
echo -e "         minifyEnabled enableProguardInReleaseBuilds"
echo -e "         proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro""
echo -e "         ..."
echo -e ""

tput civis
read -p "Press Enter to continue..." </dev/tty
tput cnorm

echo -e "${BLUE}[>>] Installing needed Java version:${NC}"

AGP_VERSION=$(grep -oP "(?<=com.android.tools.build:gradle:)[0-9]+\.[0-9]+" android/build.gradle | head -1)
if [[ -z "$AGP_VERSION" ]]; then
  echo -e "  ${BLUE}[>] Could not detect Android Gradle Plugin version from android/build.gradle${NC}"
  exit 1
fi

if [[ "$AGP_VERSION" =~ ^7\. ]]; then
  REQUIRED_JAVA=11
elif [[ "$AGP_VERSION" =~ ^8\. ]]; then
  REQUIRED_JAVA=17
else
  echo -e "  ${BLUE}[>] Unknown AGP version $AGP_VERSION, defaulting to Java 17${NC}"
  REQUIRED_JAVA=17
fi

echo -e "  ${BLUE}[>] Detected AGP $AGP_VERSION -> requires Java $REQUIRED_JAVA${NC}"
if command -v java >/dev/null; then
  CURRENT_JAVA=$(java -version 2>&1 | awk -F[\".] '/version/ {print $2}')
  echo -e "  ${BLUE}[>] Current Java version: $CURRENT_JAVA${NC}"
  if [[ "$CURRENT_JAVA" != "$REQUIRED_JAVA" ]]; then
    echo -e "  ${BLUE}[>] Wrong Java version. Please install Java $REQUIRED_JAVA${NC}"
    exit 1
  fi
else
  echo -e "  ${BLUE}[>] Java not installed. Please install Java $REQUIRED_JAVA${NC}"
  exit 1
fi

java -version

echo -e "${BLUE}[>>] Generating release Android AAB:${NC}"
echo -e "  ${BLUE}[>] This may take a while.${NC}"
cd android
./gradlew app:bundleRelease
./gradlew assembleRelease

echo -e "${BLUE}[>>] Build outputs:${NC}"
echo -e "  ${BLUE}[>] AAB: app/build/outputs/bundle/release/app-release.aab${NC}"
echo -e "  ${BLUE}[>] APK: app/build/outputs/apk/release/app-release.apk${NC}"
