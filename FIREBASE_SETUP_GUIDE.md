# Firebase Setup Guide - Fix "Missing or insufficient permissions" Error

## Problem
You're getting `FirebaseError: Missing or insufficient permissions` because Firestore security rules are not configured to allow authenticated users to access their data.

## Solution: Configure Firestore Security Rules

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `route-app-bcfc2`

### Step 2: Configure Firestore Security Rules
1. In the Firebase Console, click on **"Firestore Database"** in the left sidebar
2. Click on the **"Rules"** tab at the top
3. Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow access to user's workout subcollection
      match /workouts/{workoutId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Allow access to user's commute subcollection  
      match /commutes/{commuteId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

4. Click **"Publish"** to save the rules

### Step 3: Verify the Setup
1. The rules above ensure that:
   - Only authenticated users can access data
   - Users can only access their own data (user ID must match auth UID)
   - Users can read/write to their workout and commute collections

### Alternative: Development Rules (TEMPORARY ONLY)
If you want to test quickly, you can use these more permissive rules (⚠️ **NOT for production**):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## What These Rules Do

### Production Rules (Recommended)
- ✅ **Secure**: Only authenticated users can access data
- ✅ **Private**: Users can only see their own workouts and data
- ✅ **Scalable**: Organized by user ID for efficient queries

### Rule Breakdown
- `request.auth != null` - Ensures user is logged in
- `request.auth.uid == userId` - Ensures user can only access their own data
- `/users/{userId}/workouts/{workoutId}` - Workout data structure
- `/users/{userId}/commutes/{commuteId}` - Commute data structure

## Expected Data Structure
Your app will store data like this:
```
/users
  /{userId}
    /workouts
      /{workoutId}
        - type: "Running"
        - duration: 30
        - calories: 300
        - timestamp: 1641234567890
        - date: "2025-07-14"
    /commutes
      /{commuteId}
        - route: [...]
        - startTime: 1641234567890
        - endTime: 1641234567890
```

## Testing
After setting up the rules:
1. Sign in to your app
2. Try logging a workout
3. The workout should save and appear in your dashboard
4. No more "insufficient permissions" errors!

## Troubleshooting
- Make sure you're signed in to the app
- Check that the user ID in the database path matches your auth UID
- Verify the rules are published in Firebase Console
- Check browser console for any additional error details
