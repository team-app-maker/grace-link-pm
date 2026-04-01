> Source: `grace-link-RN/docs/google-sso-handoff.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# Google SSO Handoff

Last updated: 2026-03-07

## Goal

This document captures the current login-screen and Google SSO state so future work can continue without replaying the entire chat.

## Current Decision

- We tried `expo-auth-session` for Google, but it was rejected by Google with `400 invalid_request` / OAuth approval errors in this project setup.
- We reverted to `@react-native-google-signin/google-signin` because the immediate goal is fast development and obtaining a Google `idToken` to send to the backend later.
- The current app does **not** finish Google app-login yet. It only signs in with Google and logs the `idToken` for inspection.

## Current Google Login Behavior

Current behavior in `app/(auth)/login.tsx`:

- Apple login:
  - still uses the existing app flow
  - calls `signInWithSso('apple')`
  - routes to `/(auth)/ob-01`
- Google login:
  - uses `@react-native-google-signin/google-signin`
  - checks Play Services on Android
  - calls `GoogleSignin.signIn()`
  - if success, logs:
    - `idToken` preview
    - full `idToken`
    - basic Google user payload
  - does **not** call backend yet
  - does **not** call `signInWithSso('google')` yet

This is intentional until the backend SSO contract is finalized.

## Backend Status

Backend contract is still not ready for Google token verification.

Current frontend API/store contract still assumes:

- `signInWithSso({ provider })`

But the future Google flow should be:

- `signInWithSso({ provider: 'google', idToken })`

When backend spec is ready, update:

- `src/core/api/types.ts`
- `src/core/api/real-adapter.ts`
- `src/features/onboarding/store.ts`
- `app/(auth)/login.tsx`

Expected future backend flow:

1. App gets Google `idToken`
2. App POSTs it to backend
3. Backend verifies Google token server-side
4. Backend returns app session / user status
5. App updates store and routes normally

## Required Build Mode

Google native sign-in requires a native build.

- `Expo Go` is not enough
- use:
  - `npx expo run:ios`
  - `npx expo run:android`

If native config changes again, rebuild the app.

## Important iOS Note

The iOS Google error:

- `Your app is missing support for the following URL schemes: com.googleusercontent.apps...`

was caused by the reversed client ID URL scheme being missing in generated iOS config.

Current fix:

- manually added the scheme to `ios/gracelink/Info.plist`

Current required Google URL scheme:

- `com.googleusercontent.apps.871327231395-5ro2quno5q0tmircki06p61vjv2avuk1`

Also kept in Expo config:

- `app.json`

If `ios/` is regenerated with `prebuild --clean`, confirm that the reversed client ID still exists in `Info.plist`.

## Environment Variables

Google config currently depends on:

- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`

Current initialization in `app/_layout.tsx`:

- `GoogleSignin.configure({ webClientId, iosClientId, offlineAccess: false, forceCodeForRefreshToken: false })`

`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` is especially important for receiving an `idToken`.

## Login Screen UI Status

The login page was heavily adjusted during this session.

Current UI decisions:

- keep the editorial hero
- keep left-aligned typography
- center the entire login composition vertically rather than separating hero and CTA too aggressively
- keep Apple and Google buttons visually aligned with the hero column
- center-align the legal/terms copy below the buttons
- use official Apple native button on iOS
- use custom styled buttons where native official rendering is not reliable or unavailable

Relevant files:

- `app/(auth)/login.tsx`
- `src/design-system/components/SsoButton.tsx`

## Files Changed In This Phase

- `app/(auth)/login.tsx`
- `app/_layout.tsx`
- `app.json`
- `ios/gracelink/Info.plist`
- `package.json`
- `package-lock.json`
- `src/core/google-signin.ts`
- `src/design-system/components/SsoButton.tsx`

## What Was Tried And Abandoned

- `expo-auth-session`
  - added temporarily
  - removed later
  - reason: Google OAuth request path was blocked in this setup and did not help the immediate `idToken` goal

## Next Step When Backend Is Ready

When backend Swagger / OpenAPI spec is available:

1. inspect Google SSO endpoint contract
2. update frontend request type to include `idToken`
3. replace temporary token logging with backend request
4. persist authenticated state through store
5. route to onboarding or home based on backend response
6. remove any temporary console logging of full `idToken`

## Temporary Security Note

Right now the app logs the full Google `idToken` for debugging. This is temporary and should be removed as soon as backend wiring is complete.
