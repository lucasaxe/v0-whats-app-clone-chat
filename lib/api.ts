// API configuration and utilities for backend integration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  endpoints: {
    chat: "/api/chat",
    messages: "/api/messages",
    conversations: "/api/conversations",
    bot: "/api/bot",
  },
}

export interface ApiMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: string
  conversationId: string
  metadata?: Record<string, any>
}

export interface ApiConversation {
  id: string
  title: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  botType: string
  isActive: boolean
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_CONFIG.baseUrl) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Get all conversations
  async getConversations(): Promise<ApiConversation[]> {
    return this.request<ApiConversation[]>(API_CONFIG.endpoints.conversations)
  }

  // Get messages for a conversation
  async getMessages(conversationId: string): Promise<ApiMessage[]> {
    return this.request<ApiMessage[]>(`${API_CONFIG.endpoints.messages}/${conversationId}`)
  }

  // Send message to bot
  async sendMessage(conversationId: string, content: string): Promise<ApiMessage> {
    return this.request<ApiMessage>(API_CONFIG.endpoints.bot, {
      method: "POST",
      body: JSON.stringify({
        conversationId,
        content,
        timestamp: new Date().toISOString(),
      }),
    })
  }

  // Create new conversation
  async createConversation(botType: string): Promise<ApiConversation> {
    return this.request<ApiConversation>(API_CONFIG.endpoints.conversations, {
      method: "POST",
      body: JSON.stringify({
        botType,
        timestamp: new Date().toISOString(),
      }),
    })
  }
}

export const apiClient = new ApiClient()
