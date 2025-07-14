"use client"

import { useEffect, useRef, useState } from "react"

export default function WeatherWidget({ lat, lon }: { lat: number; lon: number }) {
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!lat || !lon) return
    setLoading(true)
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
      .then((res) => {
        if (!res.ok) throw new Error('Weather fetch failed')
        return res.json()
      })
      .then((data) => {
        if (data.current_weather) {
          setWeather(data.current_weather)
        } else {
          console.error('No weather data received:', data)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Weather fetch error:', error)
        setLoading(false)
      })
  }, [lat, lon])

  if (loading) return <div className="text-sm text-slate-500">Loading weather...</div>
  if (!weather) return null

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-slate-800">Weather</h3>
      <div className="flex items-center space-x-2 text-sm text-slate-700 bg-white/70 px-3 py-1 rounded shadow">
        <span>🌡️ {weather.temperature}°C</span>
        <span>💨 {weather.windspeed} km/h</span>
        <span>☁️ {weather.weathercode}</span>
      </div>
    </div>
  )
}
