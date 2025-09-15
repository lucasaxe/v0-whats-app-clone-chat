"use client"

import { useState } from "react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatWindow } from "@/components/chat-window"
import { WelcomeScreen } from "@/components/welcome-screen"
import { ConnectionStatus } from "@/components/connection-status"
import { useWebSocket } from "@/hooks/use-websocket"
import { useConversations } from "@/hooks/use-conversations"

export default function WhatsAppClone() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  // Global WebSocket connection for app-wide real-time features
  const { status: wsStatus } = useWebSocket({
    onMessage: (message) => {
      // Handle global messages (notifications, etc.)
      console.log("Global message:", message)
    },
  })

  // Check backend availability
  const { isBackendAvailable } = useConversations()

  return (
    <div className="flex h-screen bg-[#111b21] text-white relative">
      {/* Connection Status Indicator */}
      <ConnectionStatus wsStatus={wsStatus} isBackendAvailable={isBackendAvailable} />

      {/* Sidebar */}
      <div className="w-[400px] border-r border-[#313d45] flex-shrink-0">
        <ChatSidebar selectedChat={selectedChat} onSelectChat={setSelectedChat} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? <ChatWindow chatId={selectedChat} /> : <WelcomeScreen />}
      </div>
    </div>
  )
}
