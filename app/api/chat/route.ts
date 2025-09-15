import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages,
      system: `You are a helpful AI assistant in a WhatsApp-like chat interface. 

Key guidelines:
- Keep responses conversational and friendly, like chatting with a friend
- Use natural language and avoid overly formal responses
- Break longer responses into multiple shorter messages when appropriate
- You can help with various tasks: answering questions, providing information, having conversations, helping with problems
- If asked about connecting to external systems or APIs, explain that you're ready to integrate with backend services
- Be helpful, informative, and engaging
- Use emojis occasionally to make conversations more natural (but don't overuse them)

Remember: You're in a chat interface, so keep the tone casual and conversational.`,
      temperature: 0.7,
      maxTokens: 500,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
