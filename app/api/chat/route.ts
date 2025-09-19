import { type NextRequest, NextResponse } from "next/server"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  isVoice?: boolean
}

interface ChatRequest {
  message: string
  isVoice?: boolean
  language?: "en" | "bn"
}

// Simulate AI response generation
const generateAIResponse = async (message: string, language = "en"): Promise<string> => {
  // In a real implementation, this would call your AI service (OpenAI, local LLM, etc.)
  const responses = {
    en: [
      "I understand your request. Let me help you with that.",
      "That's an interesting question. Here's what I think...",
      "I can definitely assist you with this task.",
      "Let me process that information and provide you with a helpful response.",
    ],
    bn: [
      "আমি আপনার অনুরোধ বুঝতে পেরেছি। আমি আপনাকে সাহায্য করব।",
      "এটি একটি আকর্ষণীয় প্রশ্ন। আমার মতামত হলো...",
      "আমি অবশ্যই এই কাজে আপনাকে সহায়তা করতে পারি।",
      "আমি এই তথ্য প্রক্রিয়া করে আপনাকে একটি সহায়ক উত্তর দেব।",
    ],
  }

  const responseList = responses[language as keyof typeof responses] || responses.en
  const randomResponse = responseList[Math.floor(Math.random() * responseList.length)]

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return randomResponse
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, isVoice = false, language = "en" } = body

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(message, language)

    const response: ChatMessage = {
      id: Date.now().toString(),
      content: aiResponse,
      sender: "ai",
      timestamp: new Date(),
      isVoice,
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
