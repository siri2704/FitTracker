"use client"

import { useEffect, useRef } from "react"

interface WorkoutData {
  date?: string
  duration: number
  calories?: number
  type: string
  timestamp?: number
  notes?: string
  location?: any
}

interface ProgressChartProps {
  workouts: WorkoutData[]
}

export default function ProgressChart({ workouts }: ProgressChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || workouts.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = rect.width
    const height = rect.height
    const padding = 40

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Prepare data - filter out workouts without required data
    const validWorkouts = workouts.filter(w => w.date && w.calories !== undefined && w.duration !== undefined)
    if (validWorkouts.length === 0) {
      // Show empty state
      ctx.fillStyle = "#64748b"
      ctx.font = "14px system-ui"
      ctx.textAlign = "center"
      ctx.fillText("No workout data available", width / 2, height / 2)
      return
    }
    
    const sortedWorkouts = [...validWorkouts].sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
    const maxCalories = Math.max(...sortedWorkouts.map((w) => w.calories!))
    const maxDuration = Math.max(...sortedWorkouts.map((w) => w.duration))

    // Draw grid lines
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + ((height - 2 * padding) * i) / 5
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw calories line
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 3
    ctx.beginPath()
    sortedWorkouts.forEach((workout, index) => {
      const x = padding + ((width - 2 * padding) * index) / (sortedWorkouts.length - 1)
      const y = height - padding - ((height - 2 * padding) * workout.calories!) / maxCalories
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw duration bars
    ctx.fillStyle = "#0d9488"
    sortedWorkouts.forEach((workout, index) => {
      const x = padding + ((width - 2 * padding) * index) / (sortedWorkouts.length - 1)
      const barHeight = (((height - 2 * padding) * workout.duration) / maxDuration) * 0.5
      const y = height - padding - barHeight
      const barWidth = 8

      ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight)
    })

    // Draw data points
    ctx.fillStyle = "#059669"
    sortedWorkouts.forEach((workout, index) => {
      const x = padding + ((width - 2 * padding) * index) / (sortedWorkouts.length - 1)
      const y = height - padding - ((height - 2 * padding) * workout.calories!) / maxCalories

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw labels
    ctx.fillStyle = "#64748b"
    ctx.font = "12px system-ui"
    ctx.textAlign = "center"

    sortedWorkouts.forEach((workout, index) => {
      const x = padding + ((width - 2 * padding) * index) / (sortedWorkouts.length - 1)
      const date = new Date(workout.date!).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      ctx.fillText(date, x, height - 10)
    })
  }, [workouts])

  return (
    <div className="w-full h-64 relative">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
      <div className="absolute top-4 right-4 flex space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-slate-600">Calories</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
          <span className="text-slate-600">Duration</span>
        </div>
      </div>
    </div>
  )
}
