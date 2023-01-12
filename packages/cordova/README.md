# @padloc/cordova

This package contains the sources to build the mobile apps for Padloc.

## Requirements (Android)

-   Java (1.8+) or OpenJDK (11+)
-   Android Studio, with:
    -   Android API 30
    -   Android SDK Build tools 30
    -   Android SDK CLI Tools
-   Gradle (7.2, specifically)

## Steps to build iOS Cordova app with Autofill Provider Extension

Run the following steps. PL_SERVER_URL may be set.

```
npm ci
PL_PWA_DISABLE_CSP=true npm run pwa-ios-autofill:build
npm run cordova:build:ios
```

-   Open iOS workspace
    `padloc/packages/cordova/platforms/ios/Padloc.xcworkspace`.
-   Add target Autofill Provider Extension.
    -   Add **Autofill Credential Provider** capabilities to Padloc target.
    -   Add **App Groups** capability to both targets.
        -   Use `group.local.app.padloc` for App Groups.
    -   Add **Keychain Sharing** capability to both targets.
        -   Use `group.local.app.padloc` for Keychain Groups.
-   Delete CredentialProviderViewController.swift from the new target.
-   Copy all Swift files in
    `padloc/packages/cordova/supplementary source/iOS Autofill Extension` to the
    new target.
-   Copy dist folder in `padloc/packages/pwa-ios-autofill/dist` to the target,
    selecting _Create folder references_.
-   Patch `Plugins/Fingerprint.swift` using the patch file
    `padloc/packages/cordova/supplementary source/Patch/Plugins/Fingerprint.swift.patch`.

Build the app again in Xcode or by running `npm run cordova:build:ios`.
