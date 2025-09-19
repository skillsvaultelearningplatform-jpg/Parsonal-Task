import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, CheckSquare, FolderOpen, Music, Zap } from "lucide-react"
import Link from "next/link"

const quickActions = [
  {
    title: "Generate Prompt",
    description: "Create AI prompts for your projects",
    icon: Zap,
    href: "/prompt",
    color: "bg-primary text-primary-foreground",
  },
  {
    title: "Start Chat",
    description: "Chat with AI assistant",
    icon: MessageSquare,
    href: "/chat",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    title: "Add Task",
    description: "Create a new daily task",
    icon: CheckSquare,
    href: "/tasks",
    color: "bg-accent text-accent-foreground",
  },
  {
    title: "New Project",
    description: "Start a new project idea",
    icon: FolderOpen,
    href: "/projects",
    color: "bg-chart-1 text-white",
  },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-balance">Welcome to Your Productivity Hub</h2>
        <p className="text-muted-foreground text-pretty">
          Manage your tasks, projects, and ideas with AI-powered assistance and Bengali language support.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{action.title}</CardTitle>
              <div className={`p-2 rounded-md ${action.color}`}>
                <action.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3 text-pretty">{action.description}</p>
              <Button asChild size="sm" className="w-full">
                <Link href={action.href}>Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Today's Tasks
            </CardTitle>
            <CardDescription>Your daily productivity overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed</span>
                <span className="text-sm font-medium">3/8</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "37.5%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Active Projects
            </CardTitle>
            <CardDescription>Projects in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">2 due this week</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Current Mood
            </CardTitle>
            <CardDescription>Music for productivity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm font-medium">Focus Mode</div>
              <p className="text-xs text-muted-foreground">Lo-fi beats playing</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
