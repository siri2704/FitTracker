"use client"

import { useState } from "react"
import { type User } from "firebase/auth"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Clock, Zap } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface WorkoutFormProps {
  user: User
  onWorkoutAdded?: () => void
}

export default function WorkoutForm({ user, onWorkoutAdded }: WorkoutFormProps) {
  const [workoutType, setWorkoutType] = useState("")
  const [customType, setCustomType] = useState("")
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")
  const [isLogging, setIsLogging] = useState(false)

  const predefinedTypes = [
    "Running", "Walking", "Cycling", "Swimming", "Gym", "Weight Training",
    "Yoga", "Pilates", "Tennis", "Basketball", "Football", "Badminton", 
    "Volleyball", "Boxing", "Martial Arts", "Climbing", "Dancing", "Hiking",
    "CrossFit", "Cardio", "Strength Training", "Stretching", "Other"
  ]

  const calculateCalories = (type: string, durationMinutes: number): number => {
    // Calories per minute based on activity type (average for 70kg person)
    const caloriesPerMinute: { [key: string]: number } = {
      "running": 12,
      "cycling": 10,
      "swimming": 14,
      "walking": 5,
      "gym": 8,
      "weight training": 8,
      "yoga": 3,
      "pilates": 4,
      "tennis": 7,
      "basketball": 8,
      "football": 9,
      "badminton": 6,
      "volleyball": 4,
      "boxing": 12,
      "martial arts": 10,
      "climbing": 9,
      "dancing": 5,
      "hiking": 6,
      "crossfit": 15,
      "cardio": 10,
      "strength training": 6,
      "stretching": 2
    }

    const typeKey = type.toLowerCase()
    const rate = caloriesPerMinute[typeKey] || 6 // Default rate
    return Math.round(durationMinutes * rate)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!duration || parseFloat(duration) <= 0) {
      toast({ title: "Error", description: "Please enter a valid duration", variant: "destructive" })
      return
    }

    const finalWorkoutType = workoutType === "Other" ? customType : workoutType
    if (!finalWorkoutType) {
      toast({ title: "Error", description: "Please select or enter a workout type", variant: "destructive" })
      return
    }

    setIsLogging(true)

    try {
      const durationNum = parseFloat(duration)
      const estimatedCalories = calculateCalories(finalWorkoutType, durationNum)
      
      const workoutData = {
        type: finalWorkoutType,
        duration: durationNum,
        calories: estimatedCalories,
        notes: notes || "",
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        location: null
      }

      await addDoc(collection(db, "users", user.uid, "workouts"), workoutData)
      
      toast({ 
        title: "Workout logged!", 
        description: `${finalWorkoutType} for ${duration} minutes (${estimatedCalories} calories)`
      })

      // Reset form
      setWorkoutType("")
      setCustomType("")
      setDuration("")
      setNotes("")
      
      // Notify parent component
      onWorkoutAdded?.()
      
    } catch (error) {
      console.error("Error logging workout:", error)
      toast({ 
        title: "Error", 
        description: "Failed to log workout. Please try again.", 
        variant: "destructive" 
      })
    } finally {
      setIsLogging(false)
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-emerald-600" />
          Log New Workout
        </CardTitle>
        <CardDescription className="text-slate-600">
          Add a new workout to track your fitness progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workout-type" className="text-sm font-medium text-slate-700">
                Workout Type
              </Label>
              <Select value={workoutType} onValueChange={setWorkoutType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select workout..." />
                </SelectTrigger>
                <SelectContent>
                  {predefinedTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {workoutType === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="custom-type" className="text-sm font-medium text-slate-700">
                  Custom Workout Type
                </Label>
                <Input
                  id="custom-type"
                  placeholder="Enter workout type"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium text-slate-700 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="600"
                placeholder="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
                Notes (optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about your workout..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full resize-none"
              />
            </div>
          </div>

          {duration && workoutType && workoutType !== "Other" && (
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center text-emerald-800">
                <Zap className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">
                  Estimated calories: {calculateCalories(workoutType, parseFloat(duration) || 0)}
                </span>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isLogging}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
          >
            {isLogging ? "Logging Workout..." : "Log Workout"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
