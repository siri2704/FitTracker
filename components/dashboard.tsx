"use client"

import { useState, useEffect, useRef } from "react"
import { type User, signOut } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, MapPin, LogOut, TrendingUp, Clock, Zap } from "lucide-react"
import ProgressChart from "@/components/progress-chart"
import LocationFinder from "@/components/location-finder"
import NetworkStatus from "@/components/network-status"
import WorkoutForm from "@/components/workout-form"
import { toast } from "@/hooks/use-toast"

interface DashboardProps {
  user: User
}

interface WorkoutData {
  date?: string
  duration: number
  calories?: number
  type: string
  timestamp?: number
  notes?: string
  location?: any
}

export default function Dashboard({ user }: DashboardProps) {
  const [workouts, setWorkouts] = useState<WorkoutData[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const dashboardRef = useRef<HTMLDivElement>(null)

  const refreshWorkouts = () => {
    // This function can be used to trigger a refresh if needed
    // The real-time listener should automatically update the data
  }

  useEffect(() => {
    // Fetch real workout data from Firestore
    let unsub: (() => void) | undefined
    if (user) {
      console.log('Setting up workout listener for user:', user.uid)
      try {
        const q = query(collection(db, "users", user.uid, "workouts"), orderBy("timestamp", "desc"))
        unsub = onSnapshot(q, 
          (snapshot) => {
            console.log('Workouts loaded:', snapshot.docs.length)
            const data = snapshot.docs.map((doc) => {
              const docData = doc.data() as WorkoutData
              console.log('Workout data:', docData)
              return docData
            })
            setWorkouts(data)
          },
          (error) => {
            console.error('Error loading workouts:', error)
            // Fallback: try without ordering if the index doesn't exist
            if (error.code === 'failed-precondition' || error.code === 'unimplemented') {
              console.log('Retrying without ordering...')
              const fallbackQ = collection(db, "users", user.uid, "workouts")
              const fallbackUnsub = onSnapshot(fallbackQ, (snapshot) => {
                console.log('Workouts loaded (fallback):', snapshot.docs.length)
                const data = snapshot.docs.map((doc) => doc.data() as WorkoutData)
                  .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)) // Sort in memory
                setWorkouts(data)
              })
              unsub = fallbackUnsub
            }
          }
        )
      } catch (error) {
        console.error('Error setting up workout listener:', error)
      }
    }
    // Intersection Observer API - Animate dashboard when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )
    if (dashboardRef.current) {
      observer.observe(dashboardRef.current)
    }
    return () => {
      observer.disconnect()
      if (unsub) unsub()
    }
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast({ title: "Signed out successfully!" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const totalWorkouts = workouts.length
  const totalDuration = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0)
  const totalCalories = workouts.reduce((sum, workout) => sum + (workout.calories || 0), 0)
  const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                FitTracker
              </h1>
              <p className="text-sm text-slate-600">Welcome back, {user.displayName || user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <NetworkStatus />
            <a href="/commute">
              <Button
                variant="secondary"
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Commute Visualizer
              </Button>
            </a>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8" ref={dashboardRef}>
        {/* Stats Overview */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Workouts</CardTitle>
              <Activity className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalWorkouts}</div>
              <p className="text-xs text-slate-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Duration</CardTitle>
              <Clock className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalDuration}m</div>
              <p className="text-xs text-slate-500 mt-1">Average: {avgDuration}m</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Calories Burned</CardTitle>
              <Zap className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalCalories}</div>
              <p className="text-xs text-slate-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Weekly Goal</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">75%</div>
              <Progress value={75} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        <Card
          className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <CardHeader>
            <CardTitle className="text-slate-900">Workout Progress</CardTitle>
            <CardDescription className="text-slate-600">Your fitness journey over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressChart workouts={workouts} />
          </CardContent>
        </Card>

        {/* Recent Workouts, Workout Form & Location Finder */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Recent Workouts */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-slate-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-emerald-600" />
                Recent Workouts
              </CardTitle>
              <CardDescription className="text-slate-600">
                Your latest fitness activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {workouts.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">No workouts logged yet</p>
                  <p className="text-sm text-slate-500 mb-4">
                    Start logging your workouts using the form on the right or the Commute Tracker.
                  </p>
                </div>
              ) : (
                workouts.slice(0, 5).map((workout, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{workout.type}</p>
                        <p className="text-sm text-slate-500">
                          {workout.date || (workout.timestamp ? new Date(workout.timestamp).toLocaleDateString() : 'Recent')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">{workout.duration}m</p>
                      <p className="text-sm text-slate-500">{workout.calories || 0} cal</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Workout Form */}
          <WorkoutForm user={user} onWorkoutAdded={refreshWorkouts} />

          {/* Location Finder */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-slate-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                Nearby Fitness Locations
              </CardTitle>
              <CardDescription className="text-slate-600">
                Find gyms and fitness facilities near you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LocationFinder />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
