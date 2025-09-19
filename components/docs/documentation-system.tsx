"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Search, BookOpen, Edit, Trash2 } from "lucide-react"

interface Document {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  lastModified: Date
  wordCount: number
}

export function DocumentationSystem() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      title: "Project Setup Guide",
      content: "This document outlines the setup process for new projects...",
      category: "Development",
      tags: ["setup", "guide", "development"],
      lastModified: new Date(Date.now() - 86400000),
      wordCount: 245,
    },
    {
      id: "2",
      title: "Bengali Language Resources",
      content: "Collection of Bengali language learning resources and references...",
      category: "Language",
      tags: ["bengali", "language", "resources"],
      lastModified: new Date(Date.now() - 2 * 86400000),
      wordCount: 189,
    },
    {
      id: "3",
      title: "AI Integration Notes",
      content: "Notes on integrating AI features into the productivity system...",
      category: "AI",
      tags: ["ai", "integration", "notes"],
      lastModified: new Date(Date.now() - 3 * 86400000),
      wordCount: 312,
    },
  ])

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editContent, setEditContent] = useState("")

  const filteredDocs = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const sanitizeContent = (content: string): string => {
    // Remove or escape potentially executable symbols and syntax
    return content
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove markdown bold
      .replace(/\*(.*?)\*/g, "$1") // Remove markdown italic
      .replace(/`(.*?)`/g, "$1") // Remove code blocks
      .replace(/#{1,6}\s/g, "") // Remove markdown headers
      .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1") // Remove markdown links, keep text
      .replace(/!\[([^\]]*)\]$$[^)]+$$/g, "$1") // Remove markdown images, keep alt text
  }

  const createNewDoc = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: "New Document",
      content: "Start writing your document here...",
      category: "General",
      tags: [],
      lastModified: new Date(),
      wordCount: 0,
    }
    setDocuments((prev) => [...prev, newDoc])
    setSelectedDoc(newDoc)
    setIsEditing(true)
    setEditContent(newDoc.content)
  }

  const saveDocument = () => {
    if (!selectedDoc) return

    const sanitizedContent = sanitizeContent(editContent)
    const wordCount = sanitizedContent.trim().split(/\s+/).length

    const updatedDoc = {
      ...selectedDoc,
      content: sanitizedContent,
      lastModified: new Date(),
      wordCount,
    }

    setDocuments((prev) => prev.map((doc) => (doc.id === selectedDoc.id ? updatedDoc : doc)))
    setSelectedDoc(updatedDoc)
    setIsEditing(false)
  }

  const deleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId))
    if (selectedDoc?.id === docId) {
      setSelectedDoc(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-purple-500/10 p-6 border">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500 text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-balance">Documentation System</h1>
              <p className="text-muted-foreground">Safe document editing with symbol protection</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border-cyan-500/30">
            Symbol Safe Mode
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card className="h-[600px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Documents</CardTitle>
                <Button size="sm" onClick={createNewDoc}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[450px]">
                <div className="space-y-2 p-4">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedDoc?.id === doc.id ? "bg-muted border-primary" : ""
                      }`}
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-balance">{doc.title}</h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteDocument(doc.id)
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-xs">
                          {doc.category}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {doc.wordCount} words • {doc.lastModified.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {selectedDoc ? (
            <Card className="h-[600px] border-0 shadow-lg bg-gradient-to-br from-background to-muted/30">
              <CardHeader className="border-b bg-gradient-to-r from-cyan-500/5 to-indigo-500/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-balance">{selectedDoc.title}</CardTitle>
                    <CardDescription>
                      Last modified: {selectedDoc.lastModified.toLocaleString()} •{selectedDoc.wordCount} words • Safe
                      mode enabled
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button onClick={saveDocument}>Save</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsEditing(true)
                          setEditContent(selectedDoc.content)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedDoc.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="h-[450px] p-6">
                {isEditing ? (
                  <div className="space-y-4 h-full">
                    <div className="text-sm text-muted-foreground bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      ⚠️ Symbol protection active: Markdown symbols (*,#,`,etc.) will be sanitized on save
                    </div>
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 resize-none text-base leading-relaxed"
                      placeholder="Write your document content here... Symbols will be automatically sanitized."
                    />
                  </div>
                ) : (
                  <ScrollArea className="h-full">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="whitespace-pre-wrap text-pretty leading-relaxed text-base">{selectedDoc.content}</p>
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[600px]">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No document selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Select a document from the sidebar or create a new one to get started.
                  </p>
                  <Button onClick={createNewDoc}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
