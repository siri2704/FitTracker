"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Loader2, Filter } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

interface Location {
  name: string
  type: string
  distance: string
  rating: number
}

export default function LocationFinder() {
  const [location, setLocation] = useState<GeolocationPosition | null>(null)
  const [loading, setLoading] = useState(false)
  const [nearbyPlaces, setNearbyPlaces] = useState<Location[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["gym", "swimming_pool", "sports_centre"])
  const [showFilters, setShowFilters] = useState(false)

  const availableTypes = [
    { id: "gym", label: "Gyms", color: "bg-blue-100 text-blue-800" },
    { id: "park", label: "Parks", color: "bg-green-100 text-green-800" },
    { id: "swimming_pool", label: "Swimming Pools", color: "bg-cyan-100 text-cyan-800" },
    { id: "sports_centre", label: "Sports Centers", color: "bg-purple-100 text-purple-800" },
    { id: "tennis", label: "Tennis Courts", color: "bg-yellow-100 text-yellow-800" },
    { id: "football", label: "Football Fields", color: "bg-orange-100 text-orange-800" },
    { id: "basketball", label: "Basketball Courts", color: "bg-red-100 text-red-800" },
    { id: "fitness_centre", label: "Fitness Centers", color: "bg-indigo-100 text-indigo-800" },
    { id: "badminton", label: "Badminton Courts", color: "bg-pink-100 text-pink-800" },
    { id: "volleyball", label: "Volleyball Courts", color: "bg-emerald-100 text-emerald-800" },
    { id: "boxing", label: "Boxing Gyms", color: "bg-gray-100 text-gray-800" },
    { id: "yoga", label: "Yoga Studios", color: "bg-violet-100 text-violet-800" },
    { id: "pilates", label: "Pilates Studios", color: "bg-rose-100 text-rose-800" },
    { id: "martial_arts", label: "Martial Arts", color: "bg-amber-100 text-amber-800" },
    { id: "climbing", label: "Climbing Walls", color: "bg-stone-100 text-stone-800" },
    { id: "squash", label: "Squash Courts", color: "bg-lime-100 text-lime-800" },
    { id: "ice_rink", label: "Ice Rinks", color: "bg-sky-100 text-sky-800" },
    { id: "track", label: "Running Tracks", color: "bg-teal-100 text-teal-800" }
  ]

  const toggleType = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    )
  }

  const findLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation is not supported", variant: "destructive" })
      return
    }

    if (selectedTypes.length === 0) {
      toast({ title: "Error", description: "Please select at least one location type", variant: "destructive" })
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocation(position)
        try {
          const results: Location[] = []
          const { latitude, longitude } = position.coords
          
          console.log('Current location:', latitude, longitude) // Debug log
          
          const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
            const R = 6371
            const dLat = (lat2 - lat1) * Math.PI / 180
            const dLon = (lon2 - lon1) * Math.PI / 180
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
            return R * c
          }
          
          for (const type of selectedTypes) {
            const bbox = `${longitude-0.02},${latitude-0.02},${longitude+0.02},${latitude+0.02}` // Increased search radius
            let url = ""
            
            if (type === "park") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&leisure=park&bounded=1&viewbox=${bbox}`
            } else if (type === "gym" || type === "fitness_centre") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&amenity=gym&bounded=1&viewbox=${bbox}`
            } else if (type === "swimming_pool") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&amenity=swimming_pool&bounded=1&viewbox=${bbox}`
            } else if (type === "sports_centre") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&leisure=sports_centre&bounded=1&viewbox=${bbox}`
            } else if (type === "tennis") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&sport=tennis&bounded=1&viewbox=${bbox}`
            } else if (type === "football") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&sport=football&bounded=1&viewbox=${bbox}`
            } else if (type === "basketball") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&sport=basketball&bounded=1&viewbox=${bbox}`
            } else if (type === "badminton") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&sport=badminton&bounded=1&viewbox=${bbox}`
            } else if (type === "volleyball") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&sport=volleyball&bounded=1&viewbox=${bbox}`
            } else if (type === "boxing") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&sport=boxing&bounded=1&viewbox=${bbox}`
            } else if (type === "yoga") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&sport=yoga&bounded=1&viewbox=${bbox}`
            } else if (type === "pilates") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&sport=pilates&bounded=1&viewbox=${bbox}`
            } else if (type === "martial_arts") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&sport=martial_arts&bounded=1&viewbox=${bbox}`
            } else if (type === "climbing") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&sport=climbing&bounded=1&viewbox=${bbox}`
            } else if (type === "squash") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&sport=squash&bounded=1&viewbox=${bbox}`
            } else if (type === "ice_rink") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&sport=ice_hockey&bounded=1&viewbox=${bbox}`
            } else if (type === "track") {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&sport=running&bounded=1&viewbox=${bbox}`
            } else {
              url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&sport=${type}&bounded=1&viewbox=${bbox}`
            }
            
            try {
              console.log(`Searching for ${type} with URL:`, url) // Debug log
              const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
              const data = await res.json()
              console.log(`Found ${data.length} ${type} locations`) // Debug log
              
              data.forEach((place: any) => {
                if (place.lat && place.lon) {
                  const distance = calculateDistance(latitude, longitude, parseFloat(place.lat), parseFloat(place.lon))
                  if (distance <= 10) { // Increased distance to 10km
                    const typeLabel = availableTypes.find(t => t.id === type)?.label || type
                    results.push({
                      name: place.display_name.split(",")[0] || place.name || `${typeLabel} Location`,
                      type: typeLabel,
                      distance: `${distance.toFixed(1)} km`,
                      rating: 4.0 + Math.random() * 1
                    })
                  }
                }
              })
            } catch (error) {
              console.error(`Error fetching ${type}:`, error)
            }
          }
          
          const uniqueResults = Array.from(
            new Map(results.map(item => [item.name, item])).values()
          ).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
          
          console.log(`Total unique results found: ${uniqueResults.length}`) // Debug log
          setNearbyPlaces(uniqueResults)
          setLoading(false)
          toast({ 
            title: "Location found!", 
            description: `Found ${uniqueResults.length} nearby fitness locations within 10km` 
          })
        } catch (e) {
          setLoading(false)
          toast({ title: "Error", description: "Could not fetch locations", variant: "destructive" })
        }
      },
      (error) => {
        setLoading(false)
        console.error("Geolocation error:", error)
        let errorMessage = "Could not get your location. Please enable location access and try again."
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions for this site and try again."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please check your device's location settings."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again."
            break
        }
        
        toast({ 
          title: "Location Error", 
          description: errorMessage, 
          variant: "destructive" 
        })
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 60000 }
    )
  }

  const getTypeColor = (type: string) => {
    const typeConfig = availableTypes.find(t => t.label === type)
    return typeConfig?.color || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          size="sm"
          className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? 'Hide' : 'Show'} Filters ({selectedTypes.length} selected)
        </Button>
        
        {showFilters && (
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-lg max-h-60 overflow-y-auto">
            {availableTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={() => toggleType(type.id)}
                />
                <label
                  htmlFor={type.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-slate-700"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {!location ? (
        <Button
          onClick={findLocation}
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
        >
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Navigation className="h-4 w-4 mr-2" />}
          Find Nearby Locations
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-600 p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
              <span className="font-medium">Location: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}</span>
            </div>
            <Button
              onClick={findLocation}
              disabled={loading}
              size="sm"
              variant="outline"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : "Refresh"}
            </Button>
          </div>

          {nearbyPlaces.length === 0 && !loading && (
            <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
              <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium mb-2">No locations found nearby</p>
              <p className="text-sm text-slate-500">
                Try selecting different filters or check your location permissions.
              </p>
            </div>
          )}

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {nearbyPlaces.map((place, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-all duration-200 hover:border-emerald-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-900 truncate">{place.name}</h4>
                      <Badge variant="secondary" className={`${getTypeColor(place.type)} text-xs px-2 py-1 rounded-full`}>
                        {place.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-emerald-600" />
                        <span>{place.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{place.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="ml-3 bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200"
                    onClick={() => {
                      const query = encodeURIComponent(place.name)
                      window.open(`https://www.google.com/maps/search/${query}`, '_blank')
                    }}
                  >
                    Get Directions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
