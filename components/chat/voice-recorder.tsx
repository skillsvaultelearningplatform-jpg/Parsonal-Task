"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Mic, Square, Play, Pause } from "lucide-react"
import { audioUtils } from "@/lib/voice-utils"

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, transcript?: string) => void
  onError: (error: string) => void
  language?: "en" | "bn"
  maxDuration?: number
}

export function VoiceRecorder({
  onRecordingComplete,
  onError,
  language = "en",
  maxDuration = 60000, // 60 seconds
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      // Set up audio analysis for visual feedback
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setRecordedAudio(audioBlob)
        onRecordingComplete(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer and audio level monitoring
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 100
          if (newTime >= maxDuration) {
            stopRecording()
            return maxDuration
          }
          return newTime
        })

        // Update audio level for visual feedback
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          setAudioLevel(average)
        }
      }, 100)
    } catch (error) {
      onError("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  const playRecording = async () => {
    if (recordedAudio) {
      try {
        setIsPlaying(true)
        const audioUrl = URL.createObjectURL(recordedAudio)
        await audioUtils.playAudio(audioUrl)
        URL.revokeObjectURL(audioUrl)
      } catch (error) {
        onError("Failed to play recording")
      } finally {
        setIsPlaying(false)
      }
    }
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  const progressPercentage = (recordingTime / maxDuration) * 100

  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={isRecording ? "destructive" : "secondary"}>
              {isRecording ? (isPaused ? "Paused" : "Recording") : "Ready"}
            </Badge>
            <Badge variant="outline">{language === "bn" ? "বাংলা" : "English"}</Badge>
          </div>
          <div className="text-sm font-mono">
            {formatTime(recordingTime)} / {formatTime(maxDuration)}
          </div>
        </div>

        {/* Recording progress */}
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />

          {/* Audio level indicator */}
          {isRecording && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Level:</span>
              <div className="flex-1 bg-muted rounded-full h-1">
                <div
                  className="bg-primary h-1 rounded-full transition-all duration-100"
                  style={{ width: `${(audioLevel / 255) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-center gap-2">
          {!isRecording ? (
            <Button onClick={startRecording} size="lg" className="gap-2">
              <Mic className="h-4 w-4" />
              Start Recording
            </Button>
          ) : (
            <>
              <Button onClick={pauseRecording} variant="outline" size="sm">
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button onClick={stopRecording} variant="destructive" size="sm">
                <Square className="h-4 w-4" />
              </Button>
            </>
          )}

          {recordedAudio && !isRecording && (
            <Button onClick={playRecording} variant="outline" size="sm" disabled={isPlaying}>
              <Play className="h-4 w-4" />
              {isPlaying ? "Playing..." : "Play"}
            </Button>
          )}
        </div>

        {recordedAudio && (
          <div className="text-center text-sm text-muted-foreground">
            Recording ready! Audio will be processed when you send your message.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
