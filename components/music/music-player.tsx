"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat } from "lucide-react"

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
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Mood Playlists</CardTitle>
            <CardDescription>Choose music based on your current mood</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                    currentPlaylist.id === playlist.id ? "bg-muted border-primary" : ""
                  }`}
                  onClick={() => selectPlaylist(playlist)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${playlist.color} flex items-center justify-center`}>
                      <Play className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-balance">{playlist.name}</h4>
                      <p className="text-xs text-muted-foreground text-pretty">{playlist.description}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {playlist.mood}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded ${currentPlaylist.color} flex items-center justify-center`}>
                <Play className="h-4 w-4 text-white" />
              </div>
              {currentPlaylist.name}
            </CardTitle>
            <CardDescription>
              {currentPlaylist.description} • {currentPlaylist.songs.length} songs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {currentPlaylist.songs.map((song) => (
                  <div
                    key={song.id}
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                      currentSong?.id === song.id ? "bg-muted" : ""
                    }`}
                    onClick={() => selectSong(song)}
                  >
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      {currentSong?.id === song.id && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-balance">{song.title}</h4>
                      <p className="text-xs text-muted-foreground">{song.artist}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{song.duration}</div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {currentSong && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-lg text-balance">{currentSong.title}</h3>
                  <p className="text-muted-foreground">{currentSong.artist}</p>
                </div>

                <div className="space-y-2">
                  <Progress value={currentTime} className="h-1" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1:23</span>
                    <span>{currentSong.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Button size="sm" variant="ghost">
                    <Shuffle className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button size="lg" onClick={playPause}>
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button size="sm" variant="ghost">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Repeat className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <Progress value={volume} className="flex-1 h-1" />
                  <span className="text-xs text-muted-foreground w-8">{volume}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
