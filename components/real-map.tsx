"use client";

import { useEffect, useRef, useState } from 'react'

interface CommutePoint {
  lat: number
  lng: number
  timestamp: number
  networkType: string
  downlink: number
}

interface RealMapProps {
  points: CommutePoint[]
  currentPos: { lat: number; lng: number } | null
  tracking: boolean
}

export default function RealMap({ points, currentPos, tracking }: RealMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  // Get color based on network type
  const getNetworkColor = (networkType: string) => {
    switch (networkType) {
      case '4g': return '#10b981' // Green
      case '3g': return '#f59e0b' // Orange
      case '2g': return '#ef4444' // Red
      default: return '#64748b'  // Gray
    }
  }

  // Create a simple canvas-based map with visual representation
  const createCanvasMap = () => {
    if (!currentPos) return null
    
    return (
      <div className="relative w-full h-96 bg-slate-100 rounded-lg overflow-hidden">
        {/* Map container with tile-based approach */}
        <div className="absolute inset-0">
          {/* Background with map-like appearance */}
          <div className="w-full h-full bg-gradient-to-br from-green-100 via-blue-50 to-slate-100 relative">
            {/* Grid pattern to simulate map tiles */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-slate-300"></div>
                ))}
              </div>
            </div>
            
            {/* Current position indicator */}
            <div 
              className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                left: '50%',
                top: '50%'
              }}
            >
              {tracking && (
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
              )}
            </div>
            
            {/* Route visualization */}
            {points.length > 1 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {points.slice(1).map((point, index) => {
                  const prevPoint = points[index]
                  // Simple coordinate mapping relative to center
                  const centerX = 50 // 50% of width
                  const centerY = 50 // 50% of height
                  
                  // Calculate relative positions (simplified projection)
                  const scale = 1000000 // Scale factor for lat/lng differences
                  const x1 = centerX + ((prevPoint.lng - currentPos.lng) * scale * 0.1)
                  const y1 = centerY - ((prevPoint.lat - currentPos.lat) * scale * 0.1)
                  const x2 = centerX + ((point.lng - currentPos.lng) * scale * 0.1)
                  const y2 = centerY - ((point.lat - currentPos.lat) * scale * 0.1)
                  
                  return (
                    <line
                      key={index}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke={getNetworkColor(point.networkType)}
                      strokeWidth="3"
                      opacity="0.8"
                    />
                  )
                })}
              </svg>
            )}
            
            {/* Map info overlay - Current Location */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-52">
              <div className="text-sm font-medium text-slate-800">📍 Current Location</div>
              <div className="text-xs text-slate-600 font-mono">
                {currentPos.lat.toFixed(6)}, {currentPos.lng.toFixed(6)}
              </div>
              {tracking && (
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-green-600 font-medium">Live Tracking</span>
                </div>
              )}
            </div>
            
            {/* Route Stats - positioned at top right */}
            {points.length > 0 && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-48">
                <div className="text-sm font-medium text-slate-800">📊 Route Stats</div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>GPS Points: {points.length}</div>
                  {points.length > 1 && (
                    <>
                      <div>Duration: {Math.round((points[points.length - 1].timestamp - points[0].timestamp) / 1000 / 60)}m</div>
                      <div>Distance: {(() => {
                        // Simple distance calculation using Haversine formula
                        const toRad = (val: number) => (val * Math.PI) / 180
                        let totalDistance = 0
                        for (let i = 1; i < points.length; i++) {
                          const prev = points[i - 1]
                          const curr = points[i]
                          const dLat = toRad(curr.lat - prev.lat)
                          const dLon = toRad(curr.lng - prev.lng)
                          const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(prev.lat)) * Math.cos(toRad(curr.lat)) * Math.sin(dLon / 2) ** 2
                          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
                          totalDistance += 6371 * c // Earth's radius in km
                        }
                        return totalDistance < 1 ? `${Math.round(totalDistance * 1000)}m` : `${totalDistance.toFixed(2)}km`
                      })()}</div>
                      <div>Start: {new Date(points[0].timestamp).toLocaleTimeString('en-US', { hour12: false })}</div>
                      {!tracking && <div>End: {new Date(points[points.length - 1].timestamp).toLocaleTimeString('en-US', { hour12: false })}</div>}
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Network quality legend - positioned at bottom left */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-48">
              <div className="text-xs font-medium text-slate-800 mb-2">📶 Network Quality</div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="w-3 h-1 bg-green-500 rounded mr-2"></div>
                  <span className="text-xs text-slate-600">4G LTE</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-1 bg-orange-500 rounded mr-2"></div>
                  <span className="text-xs text-slate-600">3G</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-1 bg-red-500 rounded mr-2"></div>
                  <span className="text-xs text-slate-600">2G/Edge</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-1 bg-slate-500 rounded mr-2"></div>
                  <span className="text-xs text-slate-600">No Signal</span>
                </div>
              </div>
            </div>
            
            {/* Simulated map features */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Simulated roads/streets */}
              <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-slate-300 opacity-40"></div>
              <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-slate-300 opacity-40"></div>
              <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-slate-300 opacity-40"></div>
              <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-slate-300 opacity-40"></div>
              
              {/* Simulated landmarks */}
              <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-green-400 rounded opacity-60" title="Park"></div>
              <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-blue-400 rounded opacity-60" title="Water"></div>
              <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-orange-400 rounded opacity-60" title="Building"></div>
            </div>
            
            {/* Distance measurement for route - now integrated into Route Stats above */}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-slate-200 shadow-lg">
      {currentPos ? (
        createCanvasMap()
      ) : (
        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium mb-2">Ready to track your commute</p>
            <p className="text-sm text-slate-500">Click "Start Commute" to begin GPS tracking</p>
          </div>
        </div>
      )}
    </div>
  )
}
