"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat, Music } from "lucide-react"

interface Song {
  id: string
  title: string
  artist: string
  duration: string
  mood: string
  genre: string
  isPlaying?: boolean
}

interface Playlist {
  id: string
  name: string
  mood: string
  description: string
  songs: Song[]
  color: string
}

const playlists: Playlist[] = [
  {
    id: "1",
    name: "Focus Flow",
    mood: "focus",
    description: "Lo-fi beats for deep concentration",
    color: "bg-blue-500",
    songs: [
      { id: "1", title: "Midnight Study", artist: "Lo-Fi Collective", duration: "3:24", mood: "focus", genre: "Lo-Fi" },
      { id: "2", title: "Rainy Window", artist: "Chill Beats", duration: "4:12", mood: "focus", genre: "Ambient" },
      { id: "3", title: "Coffee Shop Vibes", artist: "Study Music", duration: "3:45", mood: "focus", genre: "Lo-Fi" },
    ],
  },
  {
    id: "2",
    name: "Energy Boost",
    mood: "energetic",
    description: "Upbeat tracks to get you moving",
    color: "bg-orange-500",
    songs: [
      {
        id: "4",
        title: "Morning Motivation",
        artist: "Upbeat Collective",
        duration: "3:30",
        mood: "energetic",
        genre: "Pop",
      },
      {
        id: "5",
        title: "Power Hour",
        artist: "Energy Beats",
        duration: "4:05",
        mood: "energetic",
        genre: "Electronic",
      },
    ],
  },
  {
    id: "3",
    name: "Chill Vibes",
    mood: "relaxed",
    description: "Relaxing tunes for unwinding",
    color: "bg-green-500",
    songs: [
      { id: "6", title: "Sunset Dreams", artist: "Chill Wave", duration: "5:20", mood: "relaxed", genre: "Ambient" },
      { id: "7", title: "Ocean Breeze", artist: "Nature Sounds", duration: "4:45", mood: "relaxed", genre: "Nature" },
    ],
  },
]

export function MusicPlayer() {
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>(playlists[0])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(75)
  const [autoMode, setAutoMode] = useState(true)

  useEffect(() => {
    if (autoMode && !currentSong) {
      const hour = new Date().getHours()
      let selectedPlaylist

      if (hour >= 6 && hour < 12) {
        selectedPlaylist = playlists.find((p) => p.mood === "energetic") || playlists[0]
      } else if (hour >= 12 && hour < 18) {
        selectedPlaylist = playlists.find((p) => p.mood === "focus") || playlists[0]
      } else {
        selectedPlaylist = playlists.find((p) => p.mood === "relaxed") || playlists[0]
      }

      setCurrentPlaylist(selectedPlaylist)
    }
  }, [autoMode, currentSong])

  const playPause = () => {
    setIsPlaying(!isPlaying)
  }

  const selectSong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }

  const selectPlaylist = (playlist: Playlist) => {
    setCurrentPlaylist(playlist)
    setCurrentSong(null)
    setIsPlaying(false)
    setAutoMode(false)
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-purple-500/10 p-6 border">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500 text-white">
              <Music className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-balance">Music Player</h1>
              <p className="text-muted-foreground">Mood-based intelligent playlists</p>
            </div>
          </div>
          {autoMode && (
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border-cyan-500/30"
            >
              Auto Mode:{" "}
              {new Date().getHours() >= 6 && new Date().getHours() < 12
                ? "Morning Energy"
                : new Date().getHours() >= 12 && new Date().getHours() < 18
                  ? "Focus Time"
                  : "Evening Chill"}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500" />
                Mood Playlists
              </CardTitle>
              <CardDescription>AI-curated playlists for every moment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className={`group p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${
                      currentPlaylist.id === playlist.id
                        ? "bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border-cyan-500/30 shadow-lg"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => selectPlaylist(playlist)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-14 h-14 rounded-xl ${playlist.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        <Play className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-balance">{playlist.name}</h4>
                        <p className="text-sm text-muted-foreground text-pretty">{playlist.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {playlist.mood}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{playlist.songs.length} songs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${currentPlaylist.color} flex items-center justify-center shadow-lg`}
                >
                  <Play className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-balance">{currentPlaylist.name}</div>
                  <div className="text-sm text-muted-foreground">{currentPlaylist.description}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {currentPlaylist.songs.map((song, index) => (
                    <div
                      key={song.id}
                      className={`group flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                        currentSong?.id === song.id
                          ? "bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 shadow-md"
                          : ""
                      }`}
                      onClick={() => selectSong(song)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {currentSong?.id === song.id && isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-balance truncate">{song.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {song.genre}
                        </Badge>
                        <span className="text-sm text-muted-foreground font-mono">{song.duration}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {currentSong && (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-background via-muted/20 to-background">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-balance">{currentSong.title}</h3>
                    <p className="text-lg text-muted-foreground">{currentSong.artist}</p>
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="secondary">{currentSong.genre}</Badge>
                      <Badge variant="outline">{currentSong.mood}</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Progress value={currentTime} className="h-2 bg-muted" />
                    <div className="flex justify-between text-sm text-muted-foreground font-mono">
                      <span>1:23</span>
                      <span>{currentSong.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6">
                    <Button size="lg" variant="ghost" className="h-12 w-12 rounded-full">
                      <Shuffle className="h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="ghost" className="h-12 w-12 rounded-full">
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button
                      size="lg"
                      onClick={playPause}
                      className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                    </Button>
                    <Button size="lg" variant="ghost" className="h-12 w-12 rounded-full">
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="ghost" className="h-12 w-12 rounded-full">
                      <Repeat className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 px-4">
                    <Volume2 className="h-5 w-5 text-muted-foreground" />
                    <Progress value={volume} className="flex-1 h-2" />
                    <span className="text-sm text-muted-foreground font-mono w-12">{volume}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
