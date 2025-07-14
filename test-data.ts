// Test data creator for the fitness tracker app
import { getFirestore, collection, addDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { app } from "./lib/firebase"

export const createTestData = async () => {
  const auth = getAuth(app)
  const db = getFirestore(app)
  const user = auth.currentUser
  
  if (!user) {
    console.log('No user logged in. Please log in first.')
    return
  }

  console.log('Creating test workout data for user:', user.uid)

  const testWorkouts = [
    {
      type: "Running",
      duration: 30,
      calories: 300,
      notes: "Morning jog in the park",
      timestamp: Date.now() - 86400000, // 1 day ago
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
    },
    {
      type: "Gym",
      duration: 45,
      calories: 350,
      notes: "Upper body workout",
      timestamp: Date.now() - 172800000, // 2 days ago
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0]
    },
    {
      type: "Swimming",
      duration: 60,
      calories: 500,
      notes: "Pool workout",
      timestamp: Date.now() - 259200000, // 3 days ago
      date: new Date(Date.now() - 259200000).toISOString().split('T')[0]
    },
    {
      type: "Cycling",
      duration: 40,
      calories: 320,
      notes: "Evening bike ride",
      timestamp: Date.now() - 345600000, // 4 days ago
      date: new Date(Date.now() - 345600000).toISOString().split('T')[0]
    },
    {
      type: "Yoga",
      duration: 25,
      calories: 120,
      notes: "Relaxing session",
      timestamp: Date.now() - 432000000, // 5 days ago
      date: new Date(Date.now() - 432000000).toISOString().split('T')[0]
    }
  ]

  try {
    for (const workout of testWorkouts) {
      await addDoc(collection(db, "users", user.uid, "workouts"), workout)
      console.log('Added workout:', workout.type)
    }
    console.log('Test data created successfully!')
  } catch (error) {
    console.error('Error creating test data:', error)
  }
}

// Add to window for browser console access
if (typeof window !== 'undefined') {
  (window as any).createTestData = createTestData
}
