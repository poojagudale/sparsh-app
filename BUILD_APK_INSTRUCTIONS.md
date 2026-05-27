# Building APK for Sparsh App

## Prerequisites

Before building the APK, ensure you have:

1. **Java Development Kit (JDK)** - Version 11 or higher
   - Download from: https://www.oracle.com/java/technologies/downloads/
   - Set JAVA_HOME environment variable

2. **Android SDK** - Version 31 or higher
   - Download Android Studio from: https://developer.android.com/studio
   - Or install Android SDK tools separately
   - Set ANDROID_HOME environment variable to your Android SDK path

3. **Gradle** - Usually included with Android Studio

## Build Steps

### Step 1: Verify Setup
```bash
# Check if Java is installed
java -version

# Check if Android SDK is set
echo %ANDROID_HOME%
```

### Step 2: Update the APK (after any code changes)
```bash
# From project root directory
npm run build
npx cap sync android
```

### Step 3: Build APK using Gradle
```bash
# Navigate to Android folder
cd android

# Build debug APK
./gradlew assembleDebug

# Or build release APK (requires signing)
./gradlew assembleRelease
```

### Step 4: Locate the APK
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

### Step 5: Install on Phone
```bash
# Connect your Android phone via USB with USB debugging enabled
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Using Android Studio (Alternative Method)

1. Open Android Studio
2. Select "Open an Existing Project"
3. Navigate to `android` folder in your project
4. Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
5. APK will be generated in `app/build/outputs/apk/debug/`

## Troubleshooting

### Environment Variables Setup (Windows)
1. Right-click "This PC" → "Properties"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Add new variables:
   - `JAVA_HOME`: Path to your Java installation (e.g., `C:\Program Files\Java\jdk-11`)
   - `ANDROID_HOME`: Path to Android SDK (e.g., `C:\Users\YourName\AppData\Local\Android\sdk`)

### Gradle Build Issues
```bash
# Clean build
cd android
./gradlew clean
./gradlew assembleDebug
```

### APK Installation Issues
```bash
# Uninstall existing app first
adb uninstall com.example.app

# Then install new APK
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Quick Build Commands

Run these from project root to quickly rebuild:

```bash
# Full rebuild
npm run build && npx cap sync android && cd android && ./gradlew assembleDebug && cd ..

# Or individual steps for development
npm run build  # When you make code changes
npx cap sync android  # Sync changes to Android
cd android && ./gradlew assembleDebug  # Build APK
```

## Next Steps

After building the APK:
1. Transfer the APK to your phone via USB or download link
2. Enable "Unknown Sources" in phone settings
3. Tap the APK file to install
4. Launch the Sparsh app from your home screen

For more details: https://capacitorjs.com/docs/android
