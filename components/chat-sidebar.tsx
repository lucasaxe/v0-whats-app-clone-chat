"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MoreVertical, Users, Archive } from "lucide-react"

interface ChatSidebarProps {
  selectedChat: string | null
  onSelectChat: (chatId: string) => void
}

export function ChatSidebar({ selectedChat, onSelectChat }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const conversations = [
    {
      id: "stellar-bot",
      title: "Stellar Conversational Assistant",
      lastMessage: "Olá! Como posso ajudá-lo hoje?",
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      isBot: true,
      functional: true,
    },
    // Visual-only users (Brazilian names)
    {
      id: "user-1",
      title: "Ana Silva",
      lastMessage: "Oi, tudo bem?",
      lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
      unreadCount: 2,
      isBot: false,
      functional: false,
    },
    {
      id: "user-2",
      title: "Bruno Santos",
      lastMessage: "Vamos nos encontrar hoje?",
      lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
      unreadCount: 1,
      isBot: false,
      functional: false,
    },
    {
      id: "user-3",
      title: "Carla Oliveira",
      lastMessage: "Obrigada pela ajuda!",
      lastMessageTime: new Date(Date.now() - 10800000).toISOString(),
      unreadCount: 0,
      isBot: false,
      functional: false,
    },
    {
      id: "user-4",
      title: "Diego Ferreira",
      lastMessage: "Até mais tarde",
      lastMessageTime: new Date(Date.now() - 14400000).toISOString(),
      unreadCount: 0,
      isBot: false,
      functional: false,
    },
    {
      id: "user-5",
      title: "Eduarda Costa",
      lastMessage: "Perfeito!",
      lastMessageTime: new Date(Date.now() - 18000000).toISOString(),
      unreadCount: 3,
      isBot: false,
      functional: false,
    },
    {
      id: "user-6",
      title: "Felipe Lima",
      lastMessage: "Combinado então",
      lastMessageTime: new Date(Date.now() - 21600000).toISOString(),
      unreadCount: 0,
      isBot: false,
      functional: false,
    },
    {
      id: "user-7",
      title: "Gabriela Rocha",
      lastMessage: "Que legal!",
      lastMessageTime: new Date(Date.now() - 25200000).toISOString(),
      unreadCount: 1,
      isBot: false,
      functional: false,
    },
    {
      id: "user-8",
      title: "Henrique Alves",
      lastMessage: "Vou verificar",
      lastMessageTime: new Date(Date.now() - 28800000).toISOString(),
      unreadCount: 0,
      isBot: false,
      functional: false,
    },
    {
      id: "user-9",
      title: "Isabela Martins",
      lastMessage: "Muito obrigada!",
      lastMessageTime: new Date(Date.now() - 32400000).toISOString(),
      unreadCount: 2,
      isBot: false,
      functional: false,
    },
    {
      id: "user-10",
      title: "João Pedro",
      lastMessage: "Falamos amanhã",
      lastMessageTime: new Date(Date.now() - 36000000).toISOString(),
      unreadCount: 0,
      isBot: false,
      functional: false,
    },
  ]

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const getChatAvatar = (conversation: any) => {
    if (conversation.isBot) {
      return "/stellar-logo.jpg"
    }
    return null // No avatar for regular users, will show initials
  }

  const filteredConversations = conversations.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleChatClick = (chat: any) => {
    if (chat.functional) {
      onSelectChat(chat.id)
    }
    // Non-functional chats do nothing when clicked
  }

  return (
    <div className="flex flex-col h-full bg-[#111b21]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#202c33]">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/user-profile-illustration.png" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-6 text-[#aebac1]">
          <Users className="h-5 w-5 cursor-pointer hover:text-white" />
          <Archive className="h-5 w-5 cursor-pointer hover:text-white" />
          <MoreVertical className="h-5 w-5 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Search */}
      <div className="p-3 bg-[#111b21]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aebac1]" />
          <Input
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#202c33] border-none text-white placeholder:text-[#aebac1] focus:bg-[#2a3942]"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="space-y-0">
          {filteredConversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              className={`flex items-center gap-3 p-3 ${
                chat.functional ? "cursor-pointer hover:bg-[#202c33]" : "cursor-default opacity-75"
              } ${selectedChat === chat.id ? "bg-[#2a3942]" : ""}`}
            >
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src={getChatAvatar(chat) || undefined} />
                <AvatarFallback className={`${chat.isBot ? "bg-[#00a884]" : "bg-[#6b7280]"} text-white`}>
                  {chat.title
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white truncate">{chat.title}</h3>
                  <span className="text-xs text-[#aebac1] flex-shrink-0">
                    {chat.lastMessageTime ? formatTime(chat.lastMessageTime) : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-[#aebac1] truncate">{chat.lastMessage || "No messages yet"}</p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-[#00a884] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 ml-2">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
