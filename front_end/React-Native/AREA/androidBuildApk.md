## How to build the AREA apk

### First Step : Check if you have android folder in front_end/React-Native/Area/ folder

#### If you don't have one :

run this command `npx expo prebuild -p android`

Now you have a android folder.

#### Run build_apk.sh

Once you have android folder, run this command (in AREA/ folder) `./build_apk.sh`

#### If keystore file already exist.

Press enter two times to continue, it will build your apk and show you the path to get it : `app/build/outputs/apk/release/app-release.apk`

#### If keystore file does not exist.

Key name: area
Key Alias: keyAlias
password: password

Follow each step in the bash script.

### Second Step : Install the apk on your device

First, connect your device to your computer (you must be in developer mod) and accept file transfer.

To check if your device is connected run this command : `adb devices`
If it's empty, your phone is not connected.

After that, you can install the apk with this next command : `adb install android/app/build/outputs/apk/release/app-release.apk`

If you're already in the android folder, remove android/ in apk path.

### Third Step : Uninstall the apk on your device

To remove the apk on your device run the next command : `adb uninstall com.micouillette.AREA`.