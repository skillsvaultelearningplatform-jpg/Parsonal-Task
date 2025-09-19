"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  MessageSquare,
  CheckSquare,
  FolderOpen,
  Music,
  Lightbulb,
  BookOpen,
  Activity,
  Clock,
  TrendingUp,
  Mic,
  Volume2,
  Zap,
} from "lucide-react"

export function SystemOverview() {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 p-8 border">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-balance mb-2">Personal Productivity AI System</h1>
              <p className="text-xl text-muted-foreground">Your intelligent workspace for enhanced productivity</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-700 dark:text-green-300"
              >
                <Activity className="w-3 h-3 mr-1" />
                System Active
              </Badge>
              <Badge variant="outline" className="bg-gradient-to-r from-cyan-500/10 to-indigo-500/10">
                v2.0 Enhanced
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">7</div>
              <div className="text-sm text-muted-foreground">Active Modules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">24/7</div>
              <div className="text-sm text-muted-foreground">AI Assistant</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">বাংলা</div>
              <div className="text-sm text-muted-foreground">Language Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">∞</div>
              <div className="text-sm text-muted-foreground">Possibilities</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-cyan-500/5 hover:to-cyan-500/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500 text-white group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Chat Assistant</CardTitle>
                <CardDescription>Voice & text interaction in Bengali/English</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Voice Recognition</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-300">
                <Mic className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Text-to-Speech</span>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 dark:text-blue-300">
                <Volume2 className="w-3 h-3 mr-1" />
                Enhanced
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Audio Chunking</span>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-700 dark:text-purple-300">
                <Zap className="w-3 h-3 mr-1" />
                5MB Chunks
              </Badge>
            </div>
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600">
              Open Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-emerald-500/5 hover:to-emerald-500/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white group-hover:scale-110 transition-transform">
                <CheckSquare className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Task Management</CardTitle>
                <CardDescription>Smart task tracking & prioritization</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Today's Progress</span>
                <span className="font-medium">7/12 tasks</span>
              </div>
              <Progress value={58} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600">12</div>
                <div className="text-xs text-muted-foreground">Active Tasks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
              Manage Tasks
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-purple-500/5 hover:to-purple-500/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white group-hover:scale-110 transition-transform">
                <Music className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Smart Music Player</CardTitle>
                <CardDescription>Mood-based auto-selection & modern UI</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Auto Mode</span>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-700 dark:text-purple-300">
                <Clock className="w-3 h-3 mr-1" />
                Time-based
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Mood</span>
              <Badge variant="outline">Focus Flow</Badge>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">♪ Midnight Study</div>
              <div className="text-sm text-muted-foreground">Lo-Fi Collective</div>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Open Player
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-amber-500/5 hover:to-amber-500/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white group-hover:scale-110 transition-transform">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Prompt Generator</CardTitle>
                <CardDescription>AI-powered prompt creation & optimization</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-600">25</div>
                <div className="text-xs text-muted-foreground">Generated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">8</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </div>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="mr-2">
                Development
              </Badge>
              <Badge variant="outline" className="mr-2">
                Creative
              </Badge>
              <Badge variant="outline">Business</Badge>
            </div>
            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              Generate Prompts
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-blue-500/5 hover:to-blue-500/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Documentation</CardTitle>
                <CardDescription>Safe document editing with symbol protection</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Symbol Protection</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-300">
                Enabled
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">15</div>
                <div className="text-xs text-muted-foreground">Documents</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">2.3k</div>
                <div className="text-xs text-muted-foreground">Words</div>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
              Open Docs
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-teal-500/5 hover:to-teal-500/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white group-hover:scale-110 transition-transform">
                <FolderOpen className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Project Management</CardTitle>
                <CardDescription>Comprehensive project tracking & analytics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">3/5 projects</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-teal-600">5</div>
                <div className="text-xs text-muted-foreground">Active Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-600">12</div>
                <div className="text-xs text-muted-foreground">Milestones</div>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
              View Projects
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Productivity Analytics
            </CardTitle>
            <CardDescription>Your productivity insights for this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-emerald-500/10">
                <div className="text-2xl font-bold text-emerald-600">85%</div>
                <div className="text-sm text-muted-foreground">Task Completion</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-500/10">
                <div className="text-2xl font-bold text-blue-600">4.2h</div>
                <div className="text-sm text-muted-foreground">Daily Focus Time</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-500/10">
                <div className="text-2xl font-bold text-purple-600">127</div>
                <div className="text-sm text-muted-foreground">AI Interactions</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-amber-500/10">
                <div className="text-2xl font-bold text-amber-600">23</div>
                <div className="text-sm text-muted-foreground">Documents Created</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-500" />
              System Status
            </CardTitle>
            <CardDescription>Real-time system health and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Assistant</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Voice Recognition</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Audio Processing</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-700">
                  Enhanced
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Symbol Protection</span>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-700">
                  Enabled
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
