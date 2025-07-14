import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyClHWfH7C1ZGN67sQZN9bDIoasKxgy5k3s",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "route-app-bcfc2.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "route-app-bcfc2",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "route-app-bcfc2.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "296525995945",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:296525995945:web:cc0b5d2a6fd68295586eb8",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-0H1Z447WF6"
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Initialize analytics only on client side
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null
