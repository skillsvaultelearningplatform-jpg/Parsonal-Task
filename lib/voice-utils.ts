export interface VoiceRecognitionOptions {
  language: "en" | "bn"
  continuous?: boolean
  interimResults?: boolean
}

export interface TTSOptions {
  language: "en" | "bn"
  rate?: number
  pitch?: number
  volume?: number
}

export class VoiceManager {
  private recognition: any = null
  private synthesis: SpeechSynthesis | null = null

  constructor() {
    if (typeof window !== "undefined") {
      // Initialize Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
      }

      // Initialize Speech Synthesis
      if ("speechSynthesis" in window) {
        this.synthesis = window.speechSynthesis
      }
    }
  }

  // Check if voice recognition is supported
  isRecognitionSupported(): boolean {
    return this.recognition !== null
  }

  // Check if text-to-speech is supported
  isTTSSupported(): boolean {
    return this.synthesis !== null
  }

  // Start voice recognition
  startRecognition(
    options: VoiceRecognitionOptions,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
  ): void {
    if (!this.recognition) {
      onError("Speech recognition not supported")
      return
    }

    this.recognition.lang = options.language === "bn" ? "bn-BD" : "en-US"
    this.recognition.continuous = options.continuous || false
    this.recognition.interimResults = options.interimResults || true

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1]
      const transcript = result.transcript
      const isFinal = result.isFinal
      onResult(transcript, isFinal)
    }

    this.recognition.onerror = (event: any) => {
      onError(event.error)
    }

    this.recognition.start()
  }

  // Stop voice recognition
  stopRecognition(): void {
    if (this.recognition) {
      this.recognition.stop()
    }
  }

  // Speak text using TTS
  speak(text: string, options: TTSOptions = { language: "en" }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error("Text-to-speech not supported"))
        return
      }

      // Cancel any ongoing speech
      this.synthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = options.language === "bn" ? "bn-BD" : "en-US"
      utterance.rate = options.rate || 0.9
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 1

      utterance.onend = () => resolve()
      utterance.onerror = (event) => reject(new Error(event.error))

      this.synthesis.speak(utterance)
    })
  }

  // Stop any ongoing speech
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  // Get available voices
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return []
    return this.synthesis.getVoices()
  }

  // Get voices for specific language
  getVoicesForLanguage(language: "en" | "bn"): SpeechSynthesisVoice[] {
    const voices = this.getVoices()
    const langCode = language === "bn" ? "bn" : "en"
    return voices.filter((voice) => voice.lang.startsWith(langCode))
  }
}

// Export singleton instance
export const voiceManager = new VoiceManager()

// Utility functions for audio processing
export const audioUtils = {
  // Convert audio blob to base64
  blobToBase64: (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(",")[1]) // Remove data:audio/wav;base64, prefix
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  },

  // Create audio blob from base64
  base64ToBlob: (base64: string, mimeType = "audio/wav"): Blob => {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
  },

  // Play audio from URL
  playAudio: (audioUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl)
      audio.onended = () => resolve()
      audio.onerror = () => reject(new Error("Failed to play audio"))
      audio.play().catch(reject)
    })
  },

  // Record audio from microphone
  recordAudio: (duration?: number): Promise<Blob> => {
    return new Promise(async (resolve, reject) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        const audioChunks: Blob[] = []

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
          stream.getTracks().forEach((track) => track.stop())
          resolve(audioBlob)
        }

        mediaRecorder.onerror = (event) => {
          reject(new Error("Recording failed"))
        }

        mediaRecorder.start()

        // Auto-stop after duration if specified
        if (duration) {
          setTimeout(() => {
            if (mediaRecorder.state === "recording") {
              mediaRecorder.stop()
            }
          }, duration)
        }
        // Return stop function for manual control
        ;(resolve as any).stop = () => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop()
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  },
}
