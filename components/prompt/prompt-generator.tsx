"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Zap, Copy, RefreshCw, Sparkles } from "lucide-react"

const promptCategories = [
  { value: "coding", label: "Coding & Development" },
  { value: "writing", label: "Content Writing" },
  { value: "business", label: "Business Strategy" },
  { value: "creative", label: "Creative Projects" },
  { value: "learning", label: "Learning & Education" },
  { value: "productivity", label: "Productivity Tips" },
]

const promptTemplates = {
  coding: [
    "Create a {language} function that {functionality}",
    "Debug this {language} code: {code}",
    "Optimize this algorithm for {performance_metric}",
  ],
  writing: [
    "Write a {tone} article about {topic}",
    "Create engaging social media content for {platform}",
    "Draft a professional email for {purpose}",
  ],
  business: [
    "Develop a marketing strategy for {product}",
    "Create a business plan for {industry}",
    "Analyze market trends in {sector}",
  ],
}

export function PromptGenerator() {
  const [category, setCategory] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePrompt = async () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      const templates = promptTemplates[category as keyof typeof promptTemplates] || []
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
      setGeneratedPrompt(randomTemplate || "Create a detailed prompt for your specific use case")
      setIsGenerating(false)
    }, 1000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Prompt Generator
            </CardTitle>
            <CardDescription>Generate AI prompts for your projects and tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {promptCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Requirements</label>
              <Textarea
                placeholder="Describe what you need help with..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={generatePrompt} disabled={!category || isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Prompt
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Prompt</CardTitle>
            <CardDescription>Your AI-optimized prompt is ready</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedPrompt ? (
              <>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-pretty">{generatedPrompt}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button onClick={generatePrompt} variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Select a category and generate your first prompt</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Prompts</CardTitle>
          <CardDescription>Your previously generated prompts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { category: "coding", prompt: "Create a React component for user authentication", time: "2 hours ago" },
              { category: "writing", prompt: "Write a technical blog post about Next.js", time: "1 day ago" },
              { category: "business", prompt: "Develop a go-to-market strategy for SaaS", time: "2 days ago" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                  <p className="text-sm text-pretty">{item.prompt}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
