"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient, type ApiMessage } from "@/lib/api"

interface UseBackendChatProps {
  conversationId: string
  fallbackToAI?: boolean
  enabled?: boolean
}

interface UseBackendChatReturn {
  messages: ApiMessage[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  retry: () => void
  clearError: () => void
  isBackendAvailable: boolean
}

interface PendingMessage {
  id: string
  content: string
  timestamp: string
  timeoutId: NodeJS.Timeout
}

export function useBackendChat({
  conversationId,
  fallbackToAI = true,
  enabled = true,
}: UseBackendChatProps): UseBackendChatReturn {
  const [messages, setMessages] = useState<ApiMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isBackendAvailable, setIsBackendAvailable] = useState(false)
  const [pendingMessages, setPendingMessages] = useState<Map<string, PendingMessage>>(new Map())

  // Load initial messages
  const loadMessages = useCallback(async () => {
    if (!enabled) return

    try {
      setError(null)
      const loadedMessages = await apiClient.getMessages(conversationId)
      setMessages(loadedMessages)
      setIsBackendAvailable(true)
    } catch (err) {
      console.log("⚠️ Backend API not available for messages, starting fresh")
      setIsBackendAvailable(false)
      setMessages([])
    }
  }, [conversationId, enabled])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  const handleMessageTimeout = useCallback(
    (messageId: string) => {
      setPendingMessages((prev) => {
        const newMap = new Map(prev)
        newMap.delete(messageId)
        return newMap
      })

      // Add error message to chat
      const errorMessage: ApiMessage = {
        id: `error-${Date.now()}`,
        content: "Mensagem não registrada",
        role: "assistant",
        timestamp: new Date().toISOString(),
        conversationId,
        metadata: { source: "timeout-error", isError: true },
      }

      setMessages((prev) => [...prev, errorMessage])
    },
    [conversationId],
  )

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !enabled) return

      setError(null)

      const messageId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const userMessage: ApiMessage = {
        id: messageId,
        content,
        role: "user",
        timestamp: new Date().toISOString(),
        conversationId,
      }

      setMessages((prev) => [...prev, userMessage])

      const timeoutId = setTimeout(() => {
        handleMessageTimeout(messageId)
      }, 5000)

      const pendingMessage: PendingMessage = {
        id: messageId,
        content,
        timestamp: userMessage.timestamp,
        timeoutId,
      }

      setPendingMessages((prev) => new Map(prev).set(messageId, pendingMessage))

      try {
        const response = await apiClient.sendMessage(conversationId, content)

        const pending = pendingMessages.get(messageId)
        if (pending) {
          clearTimeout(pending.timeoutId)
          setPendingMessages((prev) => {
            const newMap = new Map(prev)
            newMap.delete(messageId)
            return newMap
          })
        }

        // Add backend response
        setMessages((prev) => [...prev, response])
        setIsBackendAvailable(true)
      } catch (err) {
        console.log("Backend message failed:", err)
        setIsBackendAvailable(false)
      }
    },
    [conversationId, enabled, pendingMessages, handleMessageTimeout],
  )

  const retry = useCallback(() => {
    loadMessages()
  }, [loadMessages])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  useEffect(() => {
    return () => {
      pendingMessages.forEach((pending) => {
        clearTimeout(pending.timeoutId)
      })
    }
  }, [pendingMessages])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    retry,
    clearError,
    isBackendAvailable,
  }
}
