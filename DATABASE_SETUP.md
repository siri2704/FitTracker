# Database Setup Guide

## The Issue
If your workout logs are disappearing when you reopen the app, it's likely due to missing Firebase configuration.

## Current Setup
Your app already has Firebase Firestore database integration implemented. The issue is probably missing environment variables.

## How to Fix

### 1. Set up Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication (Email/Password and Google sign-in)
4. Enable Firestore Database in production mode

### 2. Configure Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Firebase configuration values from the Firebase Console
3. The file should look like this:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
```

### 3. Firebase Security Rules
Make sure your Firestore rules allow authenticated users to read/write their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Restart Development Server
After setting up the environment variables, restart your development server:
```bash
pnpm dev
```

## How Data Persistence Works
- Workouts are saved to: `users/{userId}/workouts/{workoutId}`
- Real-time updates using Firestore listeners
- Data persists across browser sessions and devices
- Automatic synchronization when online

## Troubleshooting
- Check browser console for Firebase errors
- Verify all environment variables are set
- Ensure Firebase project has Authentication and Firestore enabled
- Check network connectivity
