import { type NextRequest, NextResponse } from "next/server"

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
  category: string
  createdAt: string
  updatedAt: string
}

// In-memory storage (in production, use a database)
const tasks: Task[] = [
  {
    id: "1",
    title: "Complete project documentation",
    description: "Write comprehensive docs for the new feature",
    completed: false,
    priority: "high",
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    category: "Work",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Review code changes",
    completed: true,
    priority: "medium",
    category: "Development",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Tasks GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, priority = "medium", category = "General", dueDate } = body

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description?.trim(),
      completed: false,
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    tasks.push(newTask)

    return NextResponse.json({ task: newTask }, { status: 201 })
  } catch (error) {
    console.error("Tasks POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    const taskIndex = tasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ task: tasks[taskIndex] })
  } catch (error) {
    console.error("Tasks PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    const taskIndex = tasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    tasks.splice(taskIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Tasks DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
