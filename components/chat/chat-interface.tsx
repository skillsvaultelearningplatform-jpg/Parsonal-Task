"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Mic, MicOff, Send, Volume2, VolumeX, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  isVoice?: boolean
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "আসসালামু আলাইকুম! আমি আপনার AI সহায়ক। আজ আমি কীভাবে আপনাকে সাহায্য করতে পারি?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<"en" | "bn">("bn")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await apiClient.sendMessage(inputMessage, false, language)

      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
        return
      }

      if (response.data?.response) {
        const aiMessage: Message = {
          id: response.data.response.id,
          content: response.data.response.content,
          sender: "ai",
          timestamp: new Date(response.data.response.timestamp),
        }
        setMessages((prev) => [...prev, aiMessage])

        if (isSpeaking) {
          await speakText(aiMessage.content)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        await processVoiceInput(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)

      toast({
        title: "Recording started",
        description: "Speak your message now...",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      toast({
        title: "Recording stopped",
        description: "Processing your voice message...",
      })
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const chunkAudio = async (audioBlob: Blob): Promise<Blob[]> => {
    const chunkSize = 5 * 1024 * 1024 // 5MB chunks
    const chunks: Blob[] = []

    if (audioBlob.size <= chunkSize) {
      return [audioBlob]
    }

    for (let start = 0; start < audioBlob.size; start += chunkSize) {
      const end = Math.min(start + chunkSize, audioBlob.size)
      chunks.push(audioBlob.slice(start, end))
    }

    return chunks
  }

  const processVoiceInput = async (audioBlob: Blob) => {
    setIsLoading(true)

    try {
      const audioChunks = await chunkAudio(audioBlob)

      if (audioChunks.length > 1) {
        toast({
          title: "Processing large audio",
          description: `Audio split into ${audioChunks.length} chunks for processing...`,
        })
      }

      // Process each chunk (in a real implementation, you'd send each chunk to STT service)
      for (let i = 0; i < audioChunks.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate processing delay

        if (audioChunks.length > 1) {
          toast({
            title: `Processing chunk ${i + 1}/${audioChunks.length}`,
            description: "Converting speech to text...",
          })
        }
      }

      const simulatedTranscription = language === "bn" ? "আমার আজকের কাজগুলো দেখাও" : "Show me my tasks for today"
      setInputMessage(simulatedTranscription)

      toast({
        title: "Voice processed successfully",
        description: "Your message has been transcribed. Click send to continue.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process voice input.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const speakText = async (text: string) => {
    try {
      const response = await apiClient.generateSpeech(text, language)

      if (response.error) {
        console.error("TTS Error:", response.error)
        return
      }

      // In a real implementation, this would play the audio from the API
      // For now, use browser's built-in speech synthesis as fallback
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = language === "bn" ? "bn-BD" : "en-US"
        utterance.rate = 0.9
        utterance.pitch = 1

        speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error("Speech synthesis error:", error)
    }
  }

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking)

    if (!isSpeaking) {
      toast({
        title: "TTS Enabled",
        description: "AI responses will be spoken aloud",
      })
    } else {
      // Stop any ongoing speech
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel()
      }
      toast({
        title: "TTS Disabled",
        description: "AI responses will be text only",
      })
    }
  }

  const handleQuickCommand = async (command: string) => {
    setInputMessage(command)
    // Auto-send the command
    setTimeout(() => {
      sendMessage()
    }, 100)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <Card className="h-[700px] flex flex-col border-0 shadow-xl bg-gradient-to-br from-background to-muted/30">
          <CardHeader className="border-b bg-gradient-to-r from-cyan-500/5 to-indigo-500/5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 text-white">
                  <MessageSquare className="h-5 w-5" />
                </div>
                AI Chat & Voice Assistant
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant={language === "bn" ? "default" : "outline"}
                  className="bg-gradient-to-r from-cyan-500/20 to-indigo-500/20"
                >
                  বাংলা
                </Badge>
                <Badge variant={language === "en" ? "default" : "outline"}>English</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "ai" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm text-pretty">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                        {message.isVoice && (
                          <Badge variant="outline" className="text-xs">
                            Voice
                          </Badge>
                        )}
                      </div>
                    </div>
                    {message.sender === "user" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                    </Avatar>
                    <div className="ml-3 bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-6 border-t bg-gradient-to-r from-muted/30 to-background">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Textarea
                    placeholder={
                      language === "bn"
                        ? "আপনার বার্তা লিখুন... (Enter চাপুন পাঠাতে)"
                        : "Type your message... (Press Enter to send)"
                    }
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        if (!isLoading) sendMessage()
                      }
                    }}
                    className="flex-1 min-h-[80px] resize-none text-base"
                    disabled={isLoading}
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={toggleRecording}
                      variant={isRecording ? "destructive" : "outline"}
                      size="icon"
                      disabled={isLoading}
                      className="h-12 w-12"
                    >
                      {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    <Button
                      onClick={sendMessage}
                      size="icon"
                      disabled={isLoading || !inputMessage.trim()}
                      className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600"
                    >
                      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                {isRecording && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Recording... Click the microphone again to stop
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Voice Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={toggleSpeaking} variant={isSpeaking ? "default" : "outline"} className="w-full">
              {isSpeaking ? (
                <>
                  <VolumeX className="mr-2 h-4 w-4" />
                  Disable TTS
                </>
              ) : (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  Enable TTS
                </>
              )}
            </Button>

            <Button onClick={() => setLanguage(language === "en" ? "bn" : "en")} variant="outline" className="w-full">
              Switch to {language === "en" ? "বাংলা" : "English"}
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Voice input supported</p>
              <p>• Bengali TTS enabled</p>
              <p>• Real-time responses</p>
              <p>• {isRecording ? "🔴 Recording..." : "🎤 Ready to record"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Commands</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { bn: "আজকের কাজ দেখাও", en: "Show today's tasks" },
              { bn: "নতুন প্রজেক্ট তৈরি করো", en: "Create new project" },
              { bn: "মিউজিক চালাও", en: "Play music" },
              { bn: "ডকুমেন্ট খুলো", en: "Open documents" },
            ].map((command, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handleQuickCommand(language === "bn" ? command.bn : command.en)}
                disabled={isLoading}
              >
                {language === "bn" ? command.bn : command.en}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Chat Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Messages:</span>
              <span className="font-medium">{messages.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Language:</span>
              <span className="font-medium">{language === "bn" ? "বাংলা" : "English"}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>TTS:</span>
              <span className="font-medium">{isSpeaking ? "On" : "Off"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
