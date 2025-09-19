import { type NextRequest, NextResponse } from "next/server"

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

// In-memory storage (in production, use a database)
const projects: Project[] = [
  {
    id: "1",
    title: "Personal Productivity App",
    description: "Building a comprehensive productivity system with AI integration",
    status: "in-progress",
    progress: 65,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    tags: ["Next.js", "AI", "Productivity"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Bengali Language Learning Platform",
    description: "Create an interactive platform for learning Bengali with voice support",
    status: "planning",
    progress: 15,
    tags: ["Education", "Bengali", "Voice"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Projects GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, tags = [], dueDate } = body

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const newProject: Project = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description?.trim() || "",
      status: "planning",
      progress: 0,
      tags: Array.isArray(tags) ? tags : [],
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    projects.push(newProject)

    return NextResponse.json({ project: newProject }, { status: 201 })
  } catch (error) {
    console.error("Projects POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const projectIndex = projects.findIndex((project) => project.id === id)
    if (projectIndex === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ project: projects[projectIndex] })
  } catch (error) {
    console.error("Projects PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
