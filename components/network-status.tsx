"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { WifiOff, Signal } from "lucide-react"

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [connection, setConnection] = useState<any>(null)

  useEffect(() => {
    // Network Information API
    const updateConnectionInfo = () => {
      if ("connection" in navigator) {
        setConnection((navigator as any).connection)
      }
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Initial setup
    setIsOnline(navigator.onLine)
    updateConnectionInfo()

    // Event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    if ("connection" in navigator) {
      ;(navigator as any).connection.addEventListener("change", updateConnectionInfo)
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      if ("connection" in navigator) {
        ;(navigator as any).connection.removeEventListener("change", updateConnectionInfo)
      }
    }
  }, [])

  const getConnectionSpeed = () => {
    if (!connection) return "Unknown"

    const effectiveType = connection.effectiveType
    switch (effectiveType) {
      case "slow-2g":
        return "Slow"
      case "2g":
        return "2G"
      case "3g":
        return "3G"
      case "4g":
        return "4G"
      default:
        return "Fast"
    }
  }

  const getConnectionColor = () => {
    if (!isOnline) return "bg-red-100 text-red-800"

    const speed = getConnectionSpeed()
    switch (speed) {
      case "Slow":
      case "2G":
        return "bg-red-100 text-red-800"
      case "3G":
        return "bg-yellow-100 text-yellow-800"
      case "4G":
      case "Fast":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Badge variant="secondary" className={getConnectionColor()}>
      {isOnline ? (
        <>
          <Signal className="h-3 w-3 mr-1" />
          {getConnectionSpeed()}
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 mr-1" />
          Offline
        </>
      )}
    </Badge>
  )
}
