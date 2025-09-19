import { type NextRequest, NextResponse } from "next/server"

interface PromptRequest {
  category: string
  customRequirements?: string
  language?: "en" | "bn"
}

interface PromptTemplate {
  category: string
  templates: string[]
}

const promptTemplates: PromptTemplate[] = [
  {
    category: "coding",
    templates: [
      "Create a {language} function that {functionality} with proper error handling and documentation",
      "Debug and optimize this {language} code for better performance: {code}",
      "Write unit tests for a {language} {component_type} that handles {use_case}",
      "Implement a {design_pattern} pattern in {language} for {specific_use_case}",
    ],
  },
  {
    category: "writing",
    templates: [
      "Write a {tone} {content_type} about {topic} targeting {audience}",
      "Create engaging social media content for {platform} promoting {product_service}",
      "Draft a professional {document_type} for {purpose} with clear call-to-action",
      "Develop a content strategy for {industry} focusing on {key_themes}",
    ],
  },
  {
    category: "business",
    templates: [
      "Develop a comprehensive marketing strategy for {product} targeting {market_segment}",
      "Create a business plan for a {industry} startup focusing on {unique_value_proposition}",
      "Analyze market trends in {sector} and provide actionable insights for {business_goal}",
      "Design a customer acquisition strategy for {business_type} with budget of {budget_range}",
    ],
  },
  {
    category: "creative",
    templates: [
      "Generate creative concepts for a {project_type} with {style} aesthetic",
      "Brainstorm innovative solutions for {challenge} in {industry}",
      "Create a storytelling framework for {medium} targeting {demographic}",
      "Design a creative campaign for {cause} that resonates with {target_audience}",
    ],
  },
  {
    category: "learning",
    templates: [
      "Create a learning plan for mastering {skill} in {timeframe} for {proficiency_level}",
      "Explain {complex_concept} in simple terms with practical examples",
      "Design a curriculum for teaching {subject} to {student_level}",
      "Develop study strategies for {exam_type} focusing on {weak_areas}",
    ],
  },
  {
    category: "productivity",
    templates: [
      "Create a daily routine for {profession} optimizing for {goals}",
      "Design a workflow for {task_type} that minimizes {pain_points}",
      "Develop time management strategies for {situation} with {constraints}",
      "Create a system for organizing {content_type} for maximum efficiency",
    ],
  },
]

const generatePrompt = (category: string, customRequirements?: string): string => {
  const categoryTemplates = promptTemplates.find((t) => t.category === category)

  if (!categoryTemplates) {
    return "Create a detailed and specific prompt for your use case, including context, requirements, and desired outcomes."
  }

  const randomTemplate = categoryTemplates.templates[Math.floor(Math.random() * categoryTemplates.templates.length)]

  // If custom requirements provided, incorporate them
  if (customRequirements) {
    return `${randomTemplate}\n\nAdditional requirements: ${customRequirements}\n\nPlease provide a comprehensive response with examples and actionable steps.`
  }

  return `${randomTemplate}\n\nPlease provide a detailed response with practical examples and step-by-step guidance.`
}

export async function POST(request: NextRequest) {
  try {
    const body: PromptRequest = await request.json()
    const { category, customRequirements, language = "en" } = body

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
    }

    // Generate the prompt
    const generatedPrompt = generatePrompt(category, customRequirements)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 800))

    return NextResponse.json({
      prompt: generatedPrompt,
      category,
      language,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Prompts API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const categories = promptTemplates.map((t) => ({
      value: t.category,
      label: t.category.charAt(0).toUpperCase() + t.category.slice(1),
      templateCount: t.templates.length,
    }))

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Prompts GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
