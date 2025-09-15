"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient, type ApiConversation } from "@/lib/api"

interface UseConversationsReturn {
  conversations: ApiConversation[]
  isLoading: boolean
  error: string | null
  createConversation: (botType: string) => Promise<string>
  refreshConversations: () => void
  isBackendAvailable: boolean
}

const mockConversations: ApiConversation[] = [
  {
    id: "stellar-bot",
    title: "Stellar Conversational Assistant",
    lastMessage: "Olá! Como posso ajudá-lo com a rede Stellar hoje?",
    lastMessageTime: new Date().toISOString(),
    unreadCount: 1,
    botType: "stellar",
    isActive: true,
  },
  {
    id: "user-1",
    title: "Ana Silva",
    lastMessage: "Oi, tudo bem?",
    lastMessageTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    unreadCount: 0,
    botType: "user",
    isActive: true,
  },
  {
    id: "user-2",
    title: "Carlos Santos",
    lastMessage: "Vamos nos encontrar hoje?",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unreadCount: 2,
    botType: "user",
    isActive: true,
  },
  {
    id: "user-3",
    title: "Maria Oliveira",
    lastMessage: "Obrigada pela ajuda!",
    lastMessageTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    unreadCount: 0,
    botType: "user",
    isActive: true,
  },
  {
    id: "user-4",
    title: "João Pereira",
    lastMessage: "Até mais tarde",
    lastMessageTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    botType: "user",
    isActive: true,
  },
  {
    id: "user-5",
    title: "Fernanda Costa",
    lastMessage: "Perfeito! 👍",
    lastMessageTime: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    unreadCount: 1,
    botType: "user",
    isActive: true,
  },
  {
    id: "user-6",
    title: "Ricardo Lima",
    lastMessage: "Pode ser amanhã?",
    lastMessageTime: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    unreadCount: 0,
    botType: "user",
    isActive: true,
  },
  {
    id: "user-7",
    title: "Juliana Rocha",
    lastMessage: "Estou chegando",
    lastMessageTime: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    unreadCount: 3,
    botType: "user",
    isActive: true,
  },
  {
    id: "user-8",
    title: "Pedro Almeida",
    lastMessage: "Combinado!",
    lastMessageTime: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    unreadCount: 0,
    botType: "user",
    isActive: true,
  },
  {
    id: "user-9",
    title: "Camila Ferreira",
    lastMessage: "Vou verificar e te aviso",
    lastMessageTime: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
    unreadCount: 0,
    botType: "user",
    isActive: true,
  },
  {
    id: "user-10",
    title: "Bruno Martins",
    lastMessage: "Beleza, falamos depois",
    lastMessageTime: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    unreadCount: 1,
    botType: "user",
    isActive: true,
  },
]

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<ApiConversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBackendAvailable, setIsBackendAvailable] = useState(false)

  const loadConversations = useCallback(async () => {
    try {
      setError(null)
      setIsLoading(true)

      // Try to load from backend
      const data = await apiClient.getConversations()
      setConversations(data)
      setIsBackendAvailable(true)
      console.log("✅ Backend API connected successfully")
    } catch (err) {
      console.log("⚠️ Backend API not available, using mock data")
      setIsBackendAvailable(false)

      // Use mock data when backend is unavailable
      setConversations(mockConversations)

      // Only set error if it's not a network connectivity issue
      if (err instanceof Error && !err.message.includes("fetch")) {
        setError("Backend temporarily unavailable")
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const createConversation = useCallback(
    async (botType: string): Promise<string> => {
      if (isBackendAvailable) {
        try {
          const newConversation = await apiClient.createConversation(botType)
          setConversations((prev) => [newConversation, ...prev])
          return newConversation.id
        } catch (err) {
          console.error("Failed to create conversation via API:", err)
          setIsBackendAvailable(false)
        }
      }

      // Fallback: create mock conversation
      const newConversation: ApiConversation = {
        id: `mock-${Date.now()}`,
        title: `${botType.charAt(0).toUpperCase() + botType.slice(1)} Assistant`,
        lastMessage: "Hello! How can I help you today?",
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        botType,
        isActive: true,
      }

      setConversations((prev) => [newConversation, ...prev])
      return newConversation.id
    },
    [isBackendAvailable],
  )

  const refreshConversations = useCallback(() => {
    loadConversations()
  }, [loadConversations])

  return {
    conversations,
    isLoading,
    error,
    createConversation,
    refreshConversations,
    isBackendAvailable,
  }
}
