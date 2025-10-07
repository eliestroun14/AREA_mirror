build apk

adb devices (pour vérifier que je suis bien co)
adb install android/app/build/outputs/apk/release/app-release.apk (pour installer)
adb install -r android/app/build/outputs/apk/release/app-release.apk (pour reload)

adb uninstall com.micouillette.AREA (pour désinstaller)

adb logcat | grep AREA