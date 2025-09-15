"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, AlertTriangle, Info } from "lucide-react"

interface ConnectionStatusProps {
  wsStatus: "connecting" | "connected" | "disconnected" | "error"
  isBackendAvailable?: boolean
  className?: string
}

export function ConnectionStatus({ wsStatus, isBackendAvailable = false, className = "" }: ConnectionStatusProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showOfflineInfo, setShowOfflineInfo] = useState(false)

  useEffect(() => {
    // Show status when not connected or backend unavailable
    const shouldShow = wsStatus !== "connected" || !isBackendAvailable
    setIsVisible(shouldShow)

    // Show offline info after 3 seconds if still offline
    if (shouldShow) {
      const timer = setTimeout(() => setShowOfflineInfo(true), 3000)
      return () => clearTimeout(timer)
    } else {
      setShowOfflineInfo(false)
    }
  }, [wsStatus, isBackendAvailable])

  if (!isVisible) return null

  const getStatusConfig = () => {
    if (!isBackendAvailable) {
      return {
        icon: <Info className="h-4 w-4" />,
        text: "Offline Mode",
        bgColor: "bg-blue-900/20 border-blue-500/30",
        textColor: "text-blue-400",
        description: "Backend not connected - using AI fallback",
      }
    }

    switch (wsStatus) {
      case "connecting":
        return {
          icon: <Wifi className="h-4 w-4 animate-pulse" />,
          text: "Connecting...",
          bgColor: "bg-yellow-900/20 border-yellow-500/30",
          textColor: "text-yellow-400",
          description: "Establishing real-time connection",
        }
      case "disconnected":
        return {
          icon: <WifiOff className="h-4 w-4" />,
          text: "Real-time Offline",
          bgColor: "bg-gray-900/20 border-gray-500/30",
          textColor: "text-gray-400",
          description: "Chat works, but no live updates",
        }
      case "error":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          text: "Connection Error",
          bgColor: "bg-red-900/20 border-red-500/30",
          textColor: "text-red-400",
          description: "WebSocket connection failed",
        }
      default:
        return null
    }
  }

  const config = getStatusConfig()
  if (!config) return null

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className={`${config.bgColor} border rounded-lg px-3 py-2 ${config.textColor} transition-all duration-300`}>
        <div className="flex items-center gap-2">
          {config.icon}
          <span className="text-sm font-medium">{config.text}</span>
        </div>
        {showOfflineInfo && <div className="text-xs mt-1 opacity-80">{config.description}</div>}
      </div>
    </div>
  )
}
