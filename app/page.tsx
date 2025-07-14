"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import AuthPage from "@/components/auth-page"
import LandingPage from "@/components/landing-page"
import Dashboard from "@/components/dashboard"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed:', user ? 'User logged in' : 'No user')
        setUser(user)
        setLoading(false)
        setError(null)
      }, (error) => {
        console.error('Auth error:', error)
        setError(error.message)
        setLoading(false)
      })

      return () => unsubscribe()
    } catch (error: any) {
      console.error('Firebase initialization error:', error)
      setError(error.message)
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading app...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">App Error</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Reload App
          </button>
        </div>
      </div>
    )
  }

  return user ? <Dashboard user={user} /> : <LandingPage />
}
