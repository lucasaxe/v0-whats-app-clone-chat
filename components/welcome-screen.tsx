import { Lock } from "lucide-react"

export function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0b141a] text-center px-8">
      <div className="mb-8">
        <div className="w-80 h-80 mx-auto mb-8 relative">
          <img
            src="/whatsapp-web-welcome-illustration.jpg"
            alt="WhatsApp Web"
            className="w-full h-full object-contain opacity-20"
          />
        </div>
      </div>

      <h1 className="text-3xl font-light text-[#e9edef] mb-4">WhatsApp Web</h1>

      <p className="text-[#8696a0] text-sm max-w-md leading-relaxed mb-8">
        Send and receive messages without keeping your phone online. Use WhatsApp on up to 4 linked devices and 1 phone
        at the same time.
      </p>

      <div className="flex items-center gap-2 text-[#8696a0] text-sm">
        <Lock className="h-4 w-4" />
        <span>Your personal messages are end-to-end encrypted</span>
      </div>
    </div>
  )
}
