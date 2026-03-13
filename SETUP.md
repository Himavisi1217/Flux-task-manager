# Flux - Firebase + Google Calendar Setup Guide

## 1. Firebase Setup

1. Go to https://console.firebase.google.com and create a new project
2. Enable **Authentication** → Email/Password provider
3. Enable **Firestore Database** → Start in production mode
4. Go to Project Settings → Your apps → Add a web app
5. Copy the config values to your `.env` file

## 2. .env File

Create a `.env` file in the project root (copy from `.env.example`):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# This code is required when signing up as admin
VITE_ADMIN_SECRET_CODE=your_secret_admin_code

# Google Calendar (see step 3)
VITE_GOOGLE_CLIENT_ID=...
VITE_GOOGLE_API_KEY=...
```

## 3. Google Calendar API

1. Go to https://console.cloud.google.com
2. Create a new project (or reuse your Firebase project)
3. Enable **Google Calendar API**
4. Create **OAuth 2.0 Client ID** (Web application)
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173`
5. Create an **API Key** (restrict to Calendar API)
6. Add `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_API_KEY` to `.env`

## 4. Firestore Security Rules

Deploy `firestore.rules` using Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

Or paste the contents of `firestore.rules` directly in the Firebase Console →
Firestore → Rules.

## 5. Running the App

```bash
npm install
npm run dev
```

The app will start at http://localhost:5173

## 6. First Admin Account

When signing up, select "Admin" and enter your `VITE_ADMIN_SECRET_CODE`.
This prevents unauthorized admin account creation.

## Notes

- Google Calendar sync requires a connected Google account per user
- Tasks set to "Add to Calendar" will appear in the user's Google Calendar
- The two-way sync fetches events from Google Calendar on each Calendar page load
