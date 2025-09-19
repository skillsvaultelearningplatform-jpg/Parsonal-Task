"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, FolderOpen, CalendarIcon, Users, Target, Edit, Search, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Project {
  id: string
  title: string
  description: string
  status: "planning" | "in-progress" | "completed" | "on-hold"
  progress: number
  dueDate?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

const statusColors = {
  planning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "on-hold": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  // Form state
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tags: "",
    dueDate: undefined as Date | undefined,
  })

  const { toast } = useToast()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await apiClient.getProjects()
      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
      } else if (response.data?.projects) {
        setProjects(response.data.projects)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addProject = async () => {
    if (!newProject.title.trim()) return

    try {
      const projectData = {
        ...newProject,
        tags: newProject.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        dueDate: newProject.dueDate?.toISOString(),
      }

      const response = await apiClient.createProject(projectData)

      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
      } else if (response.data?.project) {
        setProjects((prev) => [...prev, response.data.project])
        setNewProject({ title: "", description: "", tags: "", dueDate: undefined })
        setShowAddForm(false)
        toast({
          title: "Success",
          description: "Project created successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      })
    }
  }

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const response = await apiClient.updateProject(projectId, updates)

      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
      } else if (response.data?.project) {
        setProjects((prev) => prev.map((project) => (project.id === projectId ? response.data.project : project)))
        toast({
          title: "Success",
          description: "Project updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      })
    }
  }

  const startEditing = (project: Project) => {
    setEditingProject(project)
    setNewProject({
      title: project.title,
      description: project.description,
      tags: project.tags.join(", "),
      dueDate: project.dueDate ? new Date(project.dueDate) : undefined,
    })
    setShowAddForm(true)
  }

  const saveEdit = async () => {
    if (!editingProject) return

    const updates = {
      title: newProject.title,
      description: newProject.description,
      tags: newProject.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      dueDate: newProject.dueDate?.toISOString(),
    }

    await updateProject(editingProject.id, updates)
    setEditingProject(null)
    setShowAddForm(false)
    setNewProject({ title: "", description: "", tags: "", dueDate: undefined })
  }

  const updateProgress = async (projectId: string, progress: number) => {
    await updateProject(projectId, { progress })
  }

  const updateStatus = async (projectId: string, status: Project["status"]) => {
    const progress = status === "completed" ? 100 : status === "planning" ? 0 : undefined
    const updates: Partial<Project> = { status }
    if (progress !== undefined) updates.progress = progress

    await updateProject(projectId, updates)
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = filterStatus === "all" || project.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: Project["status"]) => {
    switch (status) {
      case "planning":
        return <Target className="h-4 w-4" />
      case "in-progress":
        return <Users className="h-4 w-4" />
      case "completed":
        return <FolderOpen className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getProjectStats = () => {
    const total = projects.length
    const completed = projects.filter((p) => p.status === "completed").length
    const inProgress = projects.filter((p) => p.status === "in-progress").length
    const avgProgress = total > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / total) : 0

    return { total, completed, inProgress, avgProgress }
  }

  const stats = getProjectStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-balance">Project Dashboard</h2>
          <p className="text-muted-foreground">Manage your ideas and track project progress</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {editingProject ? "Edit Project" : "New Project"}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Project Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProject ? "Edit Project" : "Create New Project"}</CardTitle>
            <CardDescription>
              {editingProject ? "Update your project details" : "Add a new project idea or initiative"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Title *</label>
              <Input
                placeholder="Enter project title..."
                value={newProject.title}
                onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe your project..."
                value={newProject.description}
                onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <Input
                  placeholder="Enter tags (comma separated)..."
                  value={newProject.tags}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, tags: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newProject.dueDate ? format(newProject.dueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newProject.dueDate}
                      onSelect={(date) => setNewProject((prev) => ({ ...prev, dueDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={editingProject ? saveEdit : addProject} disabled={!newProject.title.trim()}>
                {editingProject ? "Update Project" : "Create Project"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingProject(null)
                  setNewProject({ title: "", description: "", tags: "", dueDate: undefined })
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-balance">{project.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={statusColors[project.status]}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1 capitalize">{project.status.replace("-", " ")}</span>
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => startEditing(project)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-pretty">{project.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {project.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3" />
                  Due: {format(new Date(project.dueDate), "MMM d, yyyy")}
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Select
                  value={project.status}
                  onValueChange={(value: Project["status"]) => updateStatus(project.id, value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={project.progress.toString()}
                  onValueChange={(value) => updateProgress(project.id, Number.parseInt(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 10, 25, 50, 75, 90, 100].map((progress) => (
                      <SelectItem key={progress} value={progress.toString()}>
                        {progress}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your filters or search query."
                : "Start by creating your first project to track your ideas and progress."}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Project
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
