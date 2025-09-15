import { Lock } from "lucide-react"

export function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#222e35] text-center px-8 border-b-8 border-[#00a884]">
      <div className="mb-8">
        <div className="w-80 h-80 mx-auto mb-8 relative">
          <img
            src="/whatsapp-web-welcome-illustration.jpg"
            alt="WhatsApp Web"
            className="w-full h-full object-contain opacity-95"
          />
        </div>
      </div>

      <h1 className="text-[32px] font-light text-[#e9edef] mb-7 tracking-wide">WhatsApp Web</h1>

      <p className="text-[#8696a0] text-[14px] max-w-md leading-[1.4] mb-8">
        Envie e receba mensagens sem precisar manter o seu telefone conectado à internet. Use o WhatsApp em até 4
        dispositivos conectados e 1 telefone ao mesmo tempo.
      </p>

      <div className="flex items-center gap-1 text-[#8696a0] text-[14px] mb-8">
        <Lock className="h-4 w-4" />
        <span>Suas mensagens pessoais são protegidas pela criptografia de ponta a ponta</span>
      </div>
    </div>
  )
}
