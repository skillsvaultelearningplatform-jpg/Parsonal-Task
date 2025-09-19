// API utility functions for frontend components

interface ApiResponse<T> {
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl = "/api"

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || "An error occurred" }
      }

      return { data }
    } catch (error) {
      console.error("API request failed:", error)
      return { error: "Network error occurred" }
    }
  }

  // Chat API
  async sendMessage(message: string, isVoice = false, language = "en") {
    return this.request("/chat", {
      method: "POST",
      body: JSON.stringify({ message, isVoice, language }),
    })
  }

  // TTS API
  async generateSpeech(text: string, language = "en", voice = "default") {
    return this.request("/tts", {
      method: "POST",
      body: JSON.stringify({ text, language, voice }),
    })
  }

  // Tasks API
  async getTasks() {
    return this.request("/tasks")
  }

  async createTask(task: {
    title: string
    description?: string
    priority?: "low" | "medium" | "high"
    category?: string
    dueDate?: string
  }) {
    return this.request("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    })
  }

  async updateTask(id: string, updates: any) {
    return this.request("/tasks", {
      method: "PUT",
      body: JSON.stringify({ id, ...updates }),
    })
  }

  async deleteTask(id: string) {
    return this.request(`/tasks?id=${id}`, {
      method: "DELETE",
    })
  }

  // Projects API
  async getProjects() {
    return this.request("/projects")
  }

  async createProject(project: {
    title: string
    description: string
    tags?: string[]
    dueDate?: string
  }) {
    return this.request("/projects", {
      method: "POST",
      body: JSON.stringify(project),
    })
  }

  async updateProject(id: string, updates: any) {
    return this.request("/projects", {
      method: "PUT",
      body: JSON.stringify({ id, ...updates }),
    })
  }

  // Documents API
  async getDocuments() {
    return this.request("/docs")
  }

  async createDocument(document: {
    title: string
    content?: string
    category?: string
    tags?: string[]
  }) {
    return this.request("/docs", {
      method: "POST",
      body: JSON.stringify(document),
    })
  }

  async updateDocument(id: string, updates: any) {
    return this.request("/docs", {
      method: "PUT",
      body: JSON.stringify({ id, ...updates }),
    })
  }

  async deleteDocument(id: string) {
    return this.request(`/docs?id=${id}`, {
      method: "DELETE",
    })
  }

  // Prompts API
  async generatePrompt(category: string, customRequirements?: string, language = "en") {
    return this.request("/prompts", {
      method: "POST",
      body: JSON.stringify({ category, customRequirements, language }),
    })
  }

  async getPromptCategories() {
    return this.request("/prompts")
  }
}

export const apiClient = new ApiClient()
