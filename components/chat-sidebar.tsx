"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MoreVertical, MessageCircle, Users, Archive, Settings, Filter } from "lucide-react"

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
    {
      id: "user-1",
      title: "CryptoAna",
      lastMessage: "Acabei de comprar um novo NFT!",
      lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
      unreadCount: 2,
      isBot: false,
      functional: false,
      avatar: "/crypto-punk-nft-avatar-digital-art.jpg",
    },
    {
      id: "user-2",
      title: "BitcoinBruno",
      lastMessage: "Bitcoin está subindo! 🚀",
      lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
      unreadCount: 1,
      isBot: false,
      functional: false,
      avatar: "/bitcoin-logo-cryptocurrency-golden.jpg",
    },
    {
      id: "user-3",
      title: "NFTCarla",
      lastMessage: "Minha coleção está crescendo!",
      lastMessageTime: new Date(Date.now() - 10800000).toISOString(),
      unreadCount: 0,
      isBot: false,
      functional: false,
      avatar: "/colorful-nft-art-digital-collectible.jpg",
    },
    {
      id: "user-4",
      title: "EthereumDiego",
      lastMessage: "Smart contracts são o futuro",
      lastMessageTime: new Date(Date.now() - 14400000).toISOString(),
      unreadCount: 0,
      isBot: false,
      functional: false,
      avatar: "/ethereum-logo-cryptocurrency-purple.jpg",
    },
    {
      id: "user-5",
      title: "DeFiEduarda",
      lastMessage: "Yield farming está rendendo bem!",
      lastMessageTime: new Date(Date.now() - 18000000).toISOString(),
      unreadCount: 3,
      isBot: false,
      functional: false,
      avatar: "/defi-cryptocurrency-finance-digital.jpg",
    },
    {
      id: "user-6",
      title: "MetaverseFelipe",
      lastMessage: "Comprei um terreno virtual",
      lastMessageTime: new Date(Date.now() - 21600000).toISOString(),
      unreadCount: 0,
      isBot: false,
      functional: false,
      avatar: "/metaverse-virtual-world-digital-land.jpg",
    },
    {
      id: "user-7",
      title: "CryptoGabi",
      lastMessage: "Altcoins estão em alta!",
      lastMessageTime: new Date(Date.now() - 25200000).toISOString(),
      unreadCount: 1,
      isBot: false,
      functional: false,
      avatar: "/cryptocurrency-altcoin-digital-money.jpg",
    },
    {
      id: "user-8",
      title: "BlockchainHenrique",
      lastMessage: "Tecnologia revolucionária",
      lastMessageTime: new Date(Date.now() - 28800000).toISOString(),
      unreadCount: 0,
      isBot: false,
      functional: false,
      avatar: "/blockchain-technology-digital-chain.jpg",
    },
    {
      id: "user-9",
      title: "TokenIsabela",
      lastMessage: "Meus tokens estão valorizando!",
      lastMessageTime: new Date(Date.now() - 32400000).toISOString(),
      unreadCount: 2,
      isBot: false,
      functional: false,
      avatar: "/crypto-token-digital-currency.jpg",
    },
    {
      id: "user-10",
      title: "Web3João",
      lastMessage: "O futuro é descentralizado",
      lastMessageTime: new Date(Date.now() - 36000000).toISOString(),
      unreadCount: 0,
      isBot: false,
      functional: false,
      avatar: "/web3-decentralized-internet-future.jpg",
    },
  ]

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })
    }
  }

  const getChatAvatar = (conversation: any) => {
    if (conversation.isBot) {
      return "/stellar-logo.jpg"
    }
    return conversation.avatar
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
  }

  return (
    <div className="fixed left-0 top-0 h-full w-[400px] flex flex-col bg-[#0b141a] border-r border-[#313d45] z-10">
      <div className="flex items-center justify-between px-4 py-4 bg-[#202c33] border-b border-[#313d45]">
        <div className="flex items-center gap-3">
          <h1 className="text-[#e9edef] text-[19px] font-bold">WhatsApp</h1>
        </div>
        <div className="flex items-center gap-5 text-[#aebac1]">
          <Users className="h-5 w-5 cursor-pointer hover:text-white transition-colors" />
          <MessageCircle className="h-5 w-5 cursor-pointer hover:text-white transition-colors" />
          <MoreVertical className="h-5 w-5 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      <div className="px-3 py-3 bg-[#0b141a]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8696a0]" />
          <Input
            placeholder="Pesquisar ou começar uma nova conversa"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-2 bg-[#202c33] border-none text-[#e9edef] placeholder:text-[#8696a0] focus:bg-[#2a3942] rounded-lg h-9 text-[15px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 px-3 py-2 bg-[#0b141a] border-b border-[#313d45]">
        <div className="flex items-center gap-2 text-[#00a884] text-[14px] font-medium cursor-pointer border-b-2 border-[#00a884] pb-2">
          <span>Todas</span>
        </div>
        <div className="flex items-center gap-2 text-[#8696a0] text-[14px] cursor-pointer hover:text-[#e9edef] pb-2">
          <span>Não lidas</span>
        </div>
        <div className="flex items-center gap-2 text-[#8696a0] text-[14px] cursor-pointer hover:text-[#e9edef] pb-2">
          <span>Grupos</span>
        </div>
        <div className="ml-auto">
          <Filter className="h-4 w-4 text-[#8696a0] cursor-pointer hover:text-[#e9edef]" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-0">
          {filteredConversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              className={`flex items-center gap-3 px-3 py-3 border-b border-[#313d45]/20 ${
                chat.functional ? "cursor-pointer hover:bg-[#202c33]" : "cursor-default opacity-75"
              } ${selectedChat === chat.id ? "bg-[#2a3942]" : ""} transition-colors`}
            >
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src={getChatAvatar(chat) || undefined} />
                <AvatarFallback
                  className={`${chat.isBot ? "bg-[#00a884]" : "bg-[#6b7280]"} text-white text-[14px] font-medium`}
                >
                  {chat.title
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-normal text-[#e9edef] truncate text-[17px]">{chat.title}</h3>
                  <span className="text-[12px] text-[#8696a0] flex-shrink-0">
                    {chat.lastMessageTime ? formatTime(chat.lastMessageTime) : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[14px] text-[#8696a0] truncate leading-tight max-w-[200px]">
                    {chat.lastMessage || "Nenhuma mensagem"}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-[#00a884] text-[#111b21] text-[12px] rounded-full h-5 min-w-[20px] flex items-center justify-center flex-shrink-0 ml-2 font-semibold px-1">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="px-3 py-2 bg-[#0b141a] border-t border-[#313d45]">
        <div className="flex items-center gap-4 text-[#8696a0]">
          <Archive className="h-5 w-5 cursor-pointer hover:text-[#e9edef] transition-colors" />
          <Settings className="h-5 w-5 cursor-pointer hover:text-[#e9edef] transition-colors" />
        </div>
      </div>
    </div>
  )
}
