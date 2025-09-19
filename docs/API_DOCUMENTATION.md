# API Documentation

This document outlines the API endpoints available in the Personal Productivity + AI System.

## Base URL
All API endpoints are prefixed with `/api`

## Authentication
Currently, no authentication is required. In production, implement proper authentication and authorization.

## Endpoints

### Chat API

#### POST /api/chat
Send a message to the AI assistant.

**Request Body:**
\`\`\`json
{
  "message": "string (required)",
  "isVoice": "boolean (optional, default: false)",
  "language": "string (optional, default: 'en', values: 'en' | 'bn')"
}
\`\`\`

**Response:**
\`\`\`json
{
  "response": {
    "id": "string",
    "content": "string",
    "sender": "ai",
    "timestamp": "ISO date string",
    "isVoice": "boolean"
  }
}
\`\`\`

### Text-to-Speech API

#### POST /api/tts
Generate speech from text.

**Request Body:**
\`\`\`json
{
  "text": "string (required)",
  "language": "string (optional, default: 'en')",
  "voice": "string (optional, default: 'default')"
}
\`\`\`

**Response:**
\`\`\`json
{
  "audioUrl": "string",
  "duration": "number",
  "language": "string",
  "voice": "string",
  "success": "boolean"
}
\`\`\`

### Tasks API

#### GET /api/tasks
Retrieve all tasks.

**Response:**
\`\`\`json
{
  "tasks": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "completed": "boolean",
      "priority": "low | medium | high",
      "dueDate": "ISO date string",
      "category": "string",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }
  ]
}
\`\`\`

#### POST /api/tasks
Create a new task.

**Request Body:**
\`\`\`json
{
  "title": "string (required)",
  "description": "string (optional)",
  "priority": "low | medium | high (optional, default: 'medium')",
  "category": "string (optional, default: 'General')",
  "dueDate": "ISO date string (optional)"
}
\`\`\`

#### PUT /api/tasks
Update an existing task.

**Request Body:**
\`\`\`json
{
  "id": "string (required)",
  "title": "string (optional)",
  "description": "string (optional)",
  "completed": "boolean (optional)",
  "priority": "low | medium | high (optional)",
  "category": "string (optional)",
  "dueDate": "ISO date string (optional)"
}
\`\`\`

#### DELETE /api/tasks?id={taskId}
Delete a task.

### Projects API

#### GET /api/projects
Retrieve all projects.

#### POST /api/projects
Create a new project.

**Request Body:**
\`\`\`json
{
  "title": "string (required)",
  "description": "string (optional)",
  "tags": "string[] (optional)",
  "dueDate": "ISO date string (optional)"
}
\`\`\`

#### PUT /api/projects
Update an existing project.

### Documents API

#### GET /api/docs
Retrieve all documents.

#### POST /api/docs
Create a new document.

#### PUT /api/docs
Update an existing document.

#### DELETE /api/docs?id={docId}
Delete a document.

### Prompts API

#### GET /api/prompts
Get available prompt categories.

#### POST /api/prompts
Generate a new prompt.

**Request Body:**
\`\`\`json
{
  "category": "string (required)",
  "customRequirements": "string (optional)",
  "language": "en | bn (optional, default: 'en')"
}
\`\`\`

## Error Handling

All endpoints return errors in the following format:
\`\`\`json
{
  "error": "Error message description"
}
\`\`\`

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Development Commands

### Next.js Commands
\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
\`\`\`

### Database Commands
\`\`\`bash
# Setup database (if using SQLite)
sqlite3 database.db < scripts/setup-database.sql

# For PostgreSQL
psql -d your_database < scripts/setup-database.sql
\`\`\`

### Laravel Commands (for future backend integration)
\`\`\`bash
# Install dependencies
composer install

# Run migrations
php artisan migrate

# Start development server
php artisan serve

# Clear cache
php artisan cache:clear
\`\`\`

### Node.js/Express Commands (alternative backend)
\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
\`\`\`

### WordPress Commands (for content management)
\`\`\`bash
# Install WordPress CLI
wp core download

# Configure WordPress
wp config create --dbname=your_db --dbuser=your_user --dbpass=your_pass

# Install WordPress
wp core install --url=your-site.com --title="Your Site" --admin_user=admin --admin_email=admin@example.com
\`\`\`

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# Database
DATABASE_URL="your_database_connection_string"

# AI Services
OPENAI_API_KEY="your_openai_api_key"
GROQ_API_KEY="your_groq_api_key"

# TTS Services
GOOGLE_TTS_API_KEY="your_google_tts_key"
AZURE_SPEECH_KEY="your_azure_speech_key"

# Bengali TTS (Coqui TTS or similar)
COQUI_TTS_ENDPOINT="your_coqui_tts_endpoint"

# FastAPI Backend (if using separate backend)
FASTAPI_BACKEND_URL="http://localhost:8000"

# Authentication (for future implementation)
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

## Integration with FastAPI Backend

If you want to use a separate FastAPI backend for AI processing:

1. Set up FastAPI server
2. Configure WebSocket connections for real-time chat
3. Implement AI model integration (local LLMs or cloud APIs)
4. Set up task scheduling for reminders and notifications
5. Configure Bengali TTS/STT services

The Next.js API routes can proxy requests to the FastAPI backend for AI-heavy operations while handling CRUD operations locally.
