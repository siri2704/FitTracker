

"use client"
import { useEffect, useRef, useState } from "react"
import { type User } from "firebase/auth"
import { getFirestore, collection, addDoc } from "firebase/firestore"
import { app } from "@/lib/firebase"
import { MapPin, Dumbbell, Trees, Waves, Navigation, Target } from "lucide-react"
import WeatherWidget from "@/components/weather-widget"
import RealMap from "@/components/real-map"

interface CommutePoint {
  lat: number
  lng: number
  timestamp: number
  networkType: string
  downlink: number
}

interface CommuteVisualizerProps {
  user: User
}

export default function CommuteVisualizer({ user }: CommuteVisualizerProps) {
  const [tracking, setTracking] = useState(false)
  const [points, setPoints] = useState<CommutePoint[]>([])
  const [network, setNetwork] = useState<any>(null)
  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [playback, setPlayback] = useState(false)
  const [playIdx, setPlayIdx] = useState(0)
  // Intersection Observer ref
  const visualizerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  // Firebase
  const db = getFirestore(app)

  // Intersection Observer: pause tracking/playback if not visible
  useEffect(() => {
    const observer = new window.IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, { threshold: 0.1 })
    if (visualizerRef.current) observer.observe(visualizerRef.current)
    return () => observer.disconnect()
  }, [])

  // Pause tracking/playback if not visible
  useEffect(() => {
    if (!isVisible) {
      setTracking(false)
      setPlayback(false)
    }
  }, [isVisible])

  // Background Tasks API: register background sync (if supported)
  useEffect(() => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(reg => {
        ((reg as any).sync?.register('sync-commute-data'))?.catch(() => {/* ignore if already registered or not supported */})
      })
    }
  }, [])

  // --- Nearby Fitness Locations ---
  const [nearbyLocations, setNearbyLocations] = useState<any[]>([])
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Fetch nearby gyms, parks, pools using OpenStreetMap Nominatim API
  const findNearbyLocations = () => {
    if (!currentPos) {
      setLocationError("Waiting for your location...")
      return
    }
    setLoadingLocations(true)
    setLocationError(null)
    const { lat, lng } = currentPos
    // Search for gyms, parks, pools within 2km radius
    const queries = [
      `https://nominatim.openstreetmap.org/search?format=json&q=gym&limit=10&bounded=1&viewbox=${lng-0.02},${lat+0.02},${lng+0.02},${lat-0.02}`,
      `https://nominatim.openstreetmap.org/search?format=json&q=park&limit=10&bounded=1&viewbox=${lng-0.02},${lat+0.02},${lng+0.02},${lat-0.02}`,
      `https://nominatim.openstreetmap.org/search?format=json&q=pool&limit=10&bounded=1&viewbox=${lng-0.02},${lat+0.02},${lng+0.02},${lat-0.02}`
    ]
    Promise.all(queries.map(url => fetch(url).then(r => r.json())))
      .then(results => {
        // Flatten and deduplicate by display_name
        const all = ([] as any[]).concat(...results)
        const unique = Array.from(new Map(all.map(l => [l.display_name, l])).values())
        setNearbyLocations(unique)
      })
      .catch(() => setLocationError("Failed to fetch locations."))
      .finally(() => setLoadingLocations(false))
  }

  // --- Workout Logging ---
  const [workoutType, setWorkoutType] = useState("")
  const [workoutDuration, setWorkoutDuration] = useState("")
  const [workoutNotes, setWorkoutNotes] = useState("")
  const [workoutMsg, setWorkoutMsg] = useState<string|null>(null)
  const logWorkout = async (type?: string, duration?: string, notes?: string) => {
    if (!user) {
      setWorkoutMsg("You must be logged in to log a workout.")
      return
    }
    // Calculate estimated calories based on duration and activity type
    const durationNum = parseFloat(duration || workoutDuration) || 0
    let caloriesPerMinute = 8 // Default calories per minute
    const activityType = (type || workoutType).toLowerCase()
    
    if (activityType.includes('run') || activityType.includes('jog')) caloriesPerMinute = 12
    else if (activityType.includes('bike') || activityType.includes('cycle')) caloriesPerMinute = 10
    else if (activityType.includes('swim')) caloriesPerMinute = 14
    else if (activityType.includes('walk') || activityType.includes('commute')) caloriesPerMinute = 5
    else if (activityType.includes('gym') || activityType.includes('weight')) caloriesPerMinute = 8
    
    const estimatedCalories = Math.round(durationNum * caloriesPerMinute)
    
    const data = {
      type: type || workoutType,
      duration: durationNum,
      calories: estimatedCalories,
      notes: notes || workoutNotes,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      location: currentPos || null,
      commutePoints: points.length > 0 ? points : undefined
    }
    try {
      await addDoc(collection(db, "users", user.uid, "workouts"), data)
      setWorkoutMsg("Workout logged successfully! Check your dashboard to see the updated data.")
      setWorkoutType("")
      setWorkoutDuration("")
      setWorkoutNotes("")
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = "/"
      }, 2000)
    } catch {
      setWorkoutMsg("Failed to log workout.")
    }
  }

  // Network Information API
  useEffect(() => {
    if ("connection" in navigator) {
      const update = () => setNetwork({
        type: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink
      })
      update()
      ;(navigator as any).connection.addEventListener("change", update)
      return () => (navigator as any).connection.removeEventListener("change", update)
    }
  }, [])

  // Geolocation tracking
  useEffect(() => {
    let watchId: number
    if (tracking) {
      if (!navigator.geolocation) {
        setGeoError("Geolocation is not supported by this browser.")
        setTracking(false)
        return
      }
      
      watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          setCurrentPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          setGeoError(null)
          const conn = (navigator as any).connection || {}
          const point: CommutePoint = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            timestamp: Date.now(),
            networkType: conn.effectiveType || "unknown",
            downlink: conn.downlink || 0
          }
          setPoints((prev) => [...prev, point])
          if (user) {
            try {
              await addDoc(collection(db, "users", user.uid, "commutes"), point)
            } catch (error) {
              console.error("Failed to save commute point:", error)
            }
          }
        },
        (err) => {
          setGeoError(`Location unavailable: ${err.message}`)
          console.error("Geolocation error:", err)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      )
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
    }
  }, [tracking, user])

  // Animated playback
  useEffect(() => {
    if (!playback || points.length < 2) return
    setPlayIdx(1)
    const interval = setInterval(() => {
      setPlayIdx((idx) => {
        if (idx >= points.length - 1) {
          clearInterval(interval)
          setPlayback(false)
          return idx
        }
        return idx + 1
      })
    }, 300)
    return () => clearInterval(interval)
  }, [playback, points])

  // Stats
  const totalDistance = points.reduce((sum, p, i, arr) => {
    if (i === 0) return 0
    const prev = arr[i - 1]
    // Haversine formula
    const toRad = (v: number) => (v * Math.PI) / 180
    const R = 6371 // km
    const dLat = toRad(p.lat - prev.lat)
    const dLon = toRad(p.lng - prev.lng)
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(prev.lat)) * Math.cos(toRad(p.lat)) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return sum + R * c
  }, 0)
  const totalTime = points.length > 1 ? (points[points.length - 1].timestamp - points[0].timestamp) / 1000 : 0

  return (
    <div ref={visualizerRef} className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Real-Time Commute Tracking</h2>
          <p className="text-emerald-100">Track your routes with GPS precision and network quality monitoring</p>
        </div>
        
        {/* Control Panel */}
        <div className="p-6 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-3 ${
                tracking 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg transform hover:scale-105' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transform hover:scale-105'
              }`}
              onClick={() => setTracking((t) => !t)}
            >
              <div className={`w-3 h-3 rounded-full ${tracking ? 'bg-white animate-pulse' : 'bg-emerald-200'}`}></div>
              {tracking ? "Stop Tracking" : "Start Commute"}
            </button>
            
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
              onClick={() => setPlayback(true)}
              disabled={points.length < 2 || playback}
            >
              <span className="text-lg">▶️</span>
              Play Route
            </button>
            
            <button
              className="px-6 py-3 bg-slate-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
              onClick={findNearbyLocations}
              disabled={!currentPos || loadingLocations}
              title={!currentPos ? "Waiting for your location..." : undefined}
            >
              <MapPin className="h-5 w-5 mr-2" />
              Find Nearby Fitness Locations
            </button>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location Status */}
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${currentPos ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="font-medium text-slate-700">Location</span>
              </div>
              {currentPos ? (
                <div className="text-sm text-slate-600">
                  <div>Lat: {currentPos.lat.toFixed(5)}</div>
                  <div>Lng: {currentPos.lng.toFixed(5)}</div>
                </div>
              ) : (
                <div className="text-sm text-red-600">
                  {geoError || "Getting location..."}
                </div>
              )}
            </div>

            {/* Network Status */}
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${network ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="font-medium text-slate-700">Network</span>
              </div>
              {network ? (
                <div className="text-sm text-slate-600">
                  <div>Type: {network.type}</div>
                  <div>Speed: {network.downlink} Mbps</div>
                </div>
              ) : (
                <div className="text-sm text-slate-500">Detecting...</div>
              )}
            </div>

            {/* Weather Widget */}
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              {currentPos && <WeatherWidget lat={currentPos.lat} lon={currentPos.lng} />}
            </div>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 text-white p-4">
          <h3 className="text-lg font-semibold mb-2">Live Interactive Map</h3>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span>4G Network</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>3G Network</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>2G Network</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Current Position</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <RealMap 
            points={points}
            currentPos={currentPos}
            tracking={tracking}
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-semibold text-slate-700">GPS Points</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{points.length}</div>
          <div className="text-sm text-slate-500">Tracked positions</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 text-lg">📏</span>
            </div>
            <span className="font-semibold text-slate-700">Distance</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalDistance.toFixed(2)} km</div>
          <div className="text-sm text-slate-500">Total traveled</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-lg">⏱️</span>
            </div>
            <span className="font-semibold text-slate-700">Duration</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{Math.floor(totalTime / 60)}:{(totalTime % 60).toFixed(0).padStart(2, '0')}</div>
          <div className="text-sm text-slate-500">Minutes elapsed</div>
        </div>
      </div>
      {/* Nearby Fitness Locations UI */}
      {loadingLocations && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mr-3"></div>
            <span className="text-emerald-600 font-medium">Loading nearby fitness locations...</span>
          </div>
        </div>
      )}
      
      {locationError && (
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-lg">⚠️</span>
            </div>
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Location Error</h4>
              <p className="text-red-700">{locationError}</p>
            </div>
          </div>
        </div>
      )}
      
      {nearbyLocations.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
            <h3 className="text-xl font-bold flex items-center">
              <MapPin className="h-6 w-6 mr-3" />
              Nearby Fitness Locations
            </h3>
            <p className="text-blue-100 text-sm mt-1">Discover fitness facilities near your current location</p>
          </div>
          
          <div className="p-6 space-y-4">
            {(() => {
              const groupedLocations: Record<string, any[]> = nearbyLocations.reduce((acc: Record<string, any[]>, loc: any) => {
                const type = loc.type || 'Other'
                if (!acc[type]) acc[type] = []
                acc[type].push(loc)
                return acc
              }, {})

              const getTypeIcon = (type: string) => {
                switch (type.toLowerCase()) {
                  case 'gym': return <Dumbbell className="h-5 w-5" />
                  case 'park': return <Trees className="h-5 w-5" />
                  case 'pool': return <Waves className="h-5 w-5" />
                  case 'trail': return <Navigation className="h-5 w-5" />
                  default: return <MapPin className="h-5 w-5" />
                }
              }

              const getTypeColor = (type: string) => {
                switch (type.toLowerCase()) {
                  case 'gym': return 'from-blue-500 to-blue-600'
                  case 'park': return 'from-green-500 to-green-600'
                  case 'pool': return 'from-cyan-500 to-cyan-600'
                  case 'trail': return 'from-orange-500 to-orange-600'
                  default: return 'from-slate-500 to-slate-600'
                }
              }

              return Object.entries(groupedLocations).map(([type, locations]: [string, any[]]) => (
                <div key={type} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className={`bg-gradient-to-r ${getTypeColor(type)} text-white px-4 py-3`}>
                    <h4 className="font-semibold flex items-center">
                      <span className="mr-2">{getTypeIcon(type)}</span>
                      {type.charAt(0).toUpperCase() + type.slice(1)}s
                      <span className="ml-2 text-sm opacity-90">({locations.length})</span>
                    </h4>
                  </div>
                  <div className="p-4 bg-slate-50">
                    <div className="space-y-3">
                      {locations.map((loc: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all">
                          <div className="flex-1">
                            <h5 className="font-medium text-slate-900">
                              {loc.display_name.split(",")[0]}
                            </h5>
                            <p className="text-sm text-slate-500 mt-1">
                              {loc.display_name.split(",").slice(1, 3).join(", ")}
                            </p>
                          </div>
                          <a
                            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                            href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lon}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            Get Directions
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            })()}
          </div>
        </div>
      )}

      {/* Workout Logging UI - Only for Commute */}
      <div className="mt-8 bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4">
          <h3 className="text-xl font-bold flex items-center">
            <span className="text-xl mr-2">�</span>
            Log Current Commute
          </h3>
          <p className="text-emerald-100 text-sm mt-1">Track this commute as a workout activity</p>
        </div>
        
        <div className="p-6">
          {/* Quick Commute Logging */}
          {points.length > 1 ? (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-blue-900">Current Commute Data</h4>
                  <p className="text-sm text-blue-700">
                    Distance: {totalDistance.toFixed(2)} km • Duration: {(totalTime/60).toFixed(1)} min
                  </p>
                </div>
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center gap-2 transform hover:scale-105"
                  onClick={() => logWorkout('Commute', (totalTime/60).toFixed(0), `Tracked route: ${totalDistance.toFixed(2)} km distance with ${points.length} GPS points`)}
                >
                  <Target className="h-5 w-5 mr-2" />
                  Log This Commute
                </button>
              </div>
              {workoutMsg && (
                <div className={`text-sm px-3 py-2 rounded mt-3 ${
                  workoutMsg.includes('Failed') 
                    ? 'text-red-700 bg-red-50 border border-red-200' 
                    : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                }`}>
                  {workoutMsg}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p className="mb-2">Start tracking your commute to log it as a workout</p>
              <p className="text-sm">Click "Start Commute" above to begin tracking your route</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
