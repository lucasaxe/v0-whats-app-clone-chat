"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  Mic,
  Send,
  AlertCircle,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react"
import { useBackendChat } from "@/hooks/use-backend-chat"
import { useWebSocket } from "@/hooks/use-websocket"
import { useTypingIndicator } from "@/hooks/use-typing-indicator"

interface ChatWindowProps {
  chatId: string
}

export function ChatWindow({ chatId }: ChatWindowProps) {
  const [inputMessage, setInputMessage] = useState("")
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const isStellarBot = chatId === "stellar-bot"

  const { messages, isLoading, error, sendMessage, retry, clearError } = useBackendChat({
    conversationId: chatId,
    fallbackToAI: true,
    enabled: isStellarBot, // Only enable for Stellar bot
  })

  // WebSocket for real-time features (only for Stellar bot)
  const { status: wsStatus, sendTyping } = useWebSocket({
    conversationId: chatId,
    enabled: isStellarBot,
    onMessage: (message) => {
      if (message.type === "message") {
        console.log("Received real-time message:", message)
      }
    },
    onTyping: (isTyping, conversationId) => {
      if (conversationId === chatId) {
        setOtherUserTyping(isTyping)
      }
    },
  })

  // Typing indicator
  const { startTyping, stopTyping } = useTypingIndicator({
    onTypingChange: (isTyping) => {
      if (isStellarBot) {
        sendTyping(isTyping)
      }
    },
    debounceMs: 1500,
  })

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, otherUserTyping])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isStellarBot) return // Disable input for non-functional chats

    setInputMessage(e.target.value)
    if (e.target.value.trim()) {
      startTyping()
    } else {
      stopTyping()
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || !isStellarBot) return

    const messageToSend = inputMessage.trim()
    setInputMessage("") // Clear input immediately without waiting for response

    stopTyping()

    sendMessage(messageToSend)
    clearError()
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const getChatInfo = (chatId: string) => {
    if (chatId === "stellar-bot") {
      return { name: "Stellar Conversational Assistant", avatar: "/stellar-logo.jpg" }
    }

    // For non-functional chats, show user info but no functionality
    const userMap: Record<string, { name: string }> = {
      "user-1": { name: "Ana Silva" },
      "user-2": { name: "Bruno Santos" },
      "user-3": { name: "Carla Oliveira" },
      "user-4": { name: "Diego Ferreira" },
      "user-5": { name: "Eduarda Costa" },
      "user-6": { name: "Felipe Lima" },
      "user-7": { name: "Gabriela Rocha" },
      "user-8": { name: "Henrique Alves" },
      "user-9": { name: "Isabela Martins" },
      "user-10": { name: "João Pedro" },
    }

    return userMap[chatId] || { name: "User", avatar: null }
  }

  const chatInfo = getChatInfo(chatId)

  const getConnectionStatus = () => {
    if (!isStellarBot) return "Offline"
    if (wsStatus === "connected") return "Online"
    if (wsStatus === "connecting") return "Connecting..."
    if (wsStatus === "error") return "Connection error"
    return "Offline"
  }

  const getStatusColor = () => {
    if (!isStellarBot) return "text-gray-400"
    if (wsStatus === "connected") return "text-green-400"
    if (wsStatus === "connecting") return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="flex flex-col h-full bg-[#0b141a]">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-[#202c33] border-b border-[#313d45]">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chatInfo.avatar || "/placeholder.svg"} />
            <AvatarFallback className={`${isStellarBot ? "bg-[#00a884]" : "bg-[#6b7280]"} text-white`}>
              {chatInfo.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium text-white">{chatInfo.name}</h2>
            <div className="flex items-center gap-2">
              <p className={`text-xs ${getStatusColor()}`}>
                {isStellarBot
                  ? isLoading
                    ? "Typing..."
                    : otherUserTyping
                      ? "Bot is typing..."
                      : getConnectionStatus()
                  : "Offline"}
              </p>
              {isStellarBot ? (
                wsStatus === "connected" ? (
                  <Wifi className="h-3 w-3 text-green-400" />
                ) : (
                  <WifiOff className="h-3 w-3 text-red-400" />
                )
              ) : (
                <WifiOff className="h-3 w-3 text-gray-400" />
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-[#aebac1]">
          <Video className="h-5 w-5 cursor-pointer hover:text-white" />
          <Phone className="h-5 w-5 cursor-pointer hover:text-white" />
          <Search className="h-5 w-5 cursor-pointer hover:text-white" />
          <MoreVertical className="h-5 w-5 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 bg-[#0b141a]">
        <div className="p-4 min-h-full bg-[#0b141a]">
          <div className="space-y-4">
            {isStellarBot ? (
              <>
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 ${
                        message.role === "user"
                          ? "bg-[#005c4b] text-white"
                          : message.metadata?.isError
                            ? "bg-red-900/20 border border-red-500/30 text-red-400"
                            : "bg-[#202c33] text-white"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-[#aebac1]">{formatTime(message.timestamp)}</span>
                        {message.role === "user" && !message.metadata?.isError && (
                          <div className="flex">
                            <div className="w-4 h-3 text-[#aebac1]">
                              <svg viewBox="0 0 16 11" className="w-full h-full fill-current">
                                <path d="M11.071 1.429L4.5 8 1.429 4.929 0 6.357 4.5 10.857 12.5 2.857z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {error && (
                  <div className="flex justify-center">
                    <div className="bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                      <Button
                        onClick={retry}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 h-auto p-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Empty state for non-functional chats
              <div className="flex items-center justify-center h-full text-[#aebac1] min-h-[400px]">
                <div className="text-center">
                  <p className="text-lg mb-2">Chat não disponível</p>
                  <p className="text-sm">Este usuário está offline</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Message Input - only functional for Stellar bot */}
      <div className="p-4 bg-[#202c33]">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-[#aebac1] hover:text-white hover:bg-[#2a3942]"
            disabled={!isStellarBot}
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-[#aebac1] hover:text-white hover:bg-[#2a3942]"
            disabled={!isStellarBot}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={handleInputChange}
              placeholder={isStellarBot ? "Type a message" : "Chat não disponível"}
              className="bg-[#2a3942] border-none text-white placeholder:text-[#aebac1] pr-12"
              disabled={isLoading || !isStellarBot}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && isStellarBot) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
          </div>
          {inputMessage.trim() && isStellarBot ? (
            <Button
              type="submit"
              size="icon"
              className="bg-[#00a884] hover:bg-[#00a884]/90 text-white"
              disabled={isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-[#aebac1] hover:text-white hover:bg-[#2a3942]"
              disabled={!isStellarBot}
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}
