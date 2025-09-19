import { type NextRequest, NextResponse } from "next/server"

interface Document {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  wordCount: number
  createdAt: string
  updatedAt: string
}

// In-memory storage (in production, use a database)
const documents: Document[] = [
  {
    id: "1",
    title: "Project Setup Guide",
    content: "This document outlines the setup process for new projects...",
    category: "Development",
    tags: ["setup", "guide", "development"],
    wordCount: 245,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Bengali Language Resources",
    content: "Collection of Bengali language learning resources and references...",
    category: "Language",
    tags: ["bengali", "language", "resources"],
    wordCount: 189,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const calculateWordCount = (content: string): number => {
  return content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
}

export async function GET() {
  try {
    return NextResponse.json({ documents })
  } catch (error) {
    console.error("Documents GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content = "", category = "General", tags = [] } = body

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const newDocument: Document = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      category,
      tags: Array.isArray(tags) ? tags : [],
      wordCount: calculateWordCount(content),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    documents.push(newDocument)

    return NextResponse.json({ document: newDocument }, { status: 201 })
  } catch (error) {
    console.error("Documents POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, content, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    const docIndex = documents.findIndex((doc) => doc.id === id)
    if (docIndex === -1) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    const updatedContent = content !== undefined ? content : documents[docIndex].content

    documents[docIndex] = {
      ...documents[docIndex],
      ...updates,
      content: updatedContent,
      wordCount: calculateWordCount(updatedContent),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ document: documents[docIndex] })
  } catch (error) {
    console.error("Documents PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    const docIndex = documents.findIndex((doc) => doc.id === id)
    if (docIndex === -1) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    documents.splice(docIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Documents DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
