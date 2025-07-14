"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import AuthPage from "@/components/auth-page"
import CommuteVisualizer from "@/components/commute-visualizer"
import { Button } from "@/components/ui/button"
import { Home, Loader2 } from "lucide-react"

export default function CommutePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Commute Tracker
            </h1>
          </div>
          <a href="/">
            <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <CommuteVisualizer user={user} />
      </main>
    </div>
  )
}
