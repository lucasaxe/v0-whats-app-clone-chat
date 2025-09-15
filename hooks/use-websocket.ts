"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface WebSocketMessage {
  type: "message" | "typing" | "online" | "offline" | "error"
  data: any
  conversationId?: string
  timestamp: string
}

interface UseWebSocketProps {
  url?: string
  conversationId?: string
  onMessage?: (message: WebSocketMessage) => void
  onTyping?: (isTyping: boolean, conversationId: string) => void
  onStatusChange?: (status: "connecting" | "connected" | "disconnected" | "error") => void
}

export function useWebSocket({
  url = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8001",
  conversationId,
  onMessage,
  onTyping,
  onStatusChange,
}: UseWebSocketProps) {
  const ws = useRef<WebSocket | null>(null)
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected" | "error">("disconnected")
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 3 // Reduced attempts for development
  const hasLoggedConnectionAttempt = useRef(false)

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return

    try {
      setStatus("connecting")
      onStatusChange?.("connecting")

      if (!hasLoggedConnectionAttempt.current) {
        console.log("🔌 Attempting WebSocket connection to:", url)
        hasLoggedConnectionAttempt.current = true
      }

      ws.current = new WebSocket(url)

      ws.current.onopen = () => {
        console.log("✅ WebSocket connected successfully")
        setStatus("connected")
        onStatusChange?.("connected")
        reconnectAttempts.current = 0

        // Join conversation if specified
        if (conversationId) {
          ws.current?.send(
            JSON.stringify({
              type: "join",
              conversationId,
              timestamp: new Date().toISOString(),
            }),
          )
        }
      }

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          setLastMessage(message)
          onMessage?.(message)

          // Handle specific message types
          if (message.type === "typing" && message.conversationId) {
            onTyping?.(message.data.isTyping, message.conversationId)
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      ws.current.onclose = (event) => {
        if (event.code === 1000) {
          console.log("🔌 WebSocket disconnected normally")
        } else {
          console.log("⚠️ WebSocket disconnected unexpectedly:", event.code, event.reason)
        }

        setStatus("disconnected")
        onStatusChange?.("disconnected")

        // Only attempt to reconnect if it wasn't a manual close and we haven't exceeded max attempts
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000)
          console.log(
            `🔄 Retrying WebSocket connection in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`,
          )

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++
            connect()
          }, delay)
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          console.log("❌ WebSocket max reconnection attempts reached. Running in offline mode.")
        }
      }

      ws.current.onerror = (error) => {
        console.log("⚠️ WebSocket connection failed - this is normal if your backend isn't running yet")
        setStatus("error")
        onStatusChange?.("error")
      }
    } catch (error) {
      console.log("⚠️ WebSocket not available - running in offline mode")
      setStatus("error")
      onStatusChange?.("error")
    }
  }, [url, conversationId, onMessage, onTyping, onStatusChange])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (ws.current) {
      ws.current.close(1000, "Manual disconnect")
      ws.current = null
    }
    setStatus("disconnected")
  }, [])

  const sendMessage = useCallback((message: Omit<WebSocketMessage, "timestamp">) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          ...message,
          timestamp: new Date().toISOString(),
        }),
      )
      return true
    }
    return false
  }, [])

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (conversationId && ws.current?.readyState === WebSocket.OPEN) {
        sendMessage({
          type: "typing",
          data: { isTyping },
          conversationId,
        })
      }
    },
    [conversationId, sendMessage],
  )

  useEffect(() => {
    // Only attempt connection if we have a WebSocket URL configured
    if ((url && url !== "ws://localhost:8001") || process.env.NODE_ENV === "development") {
      connect()
    } else {
      console.log("⚠️ WebSocket URL not configured, running in offline mode")
      setStatus("disconnected")
    }

    return () => {
      disconnect()
    }
  }, [connect, disconnect, url])

  return {
    status,
    lastMessage,
    sendMessage,
    sendTyping,
    connect,
    disconnect,
  }
}
