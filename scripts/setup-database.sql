-- Database setup script for productivity system
-- This script creates the necessary tables for the application

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    due_date DATETIME,
    category TEXT DEFAULT 'General',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('planning', 'in-progress', 'completed', 'on-hold')) DEFAULT 'planning',
    progress INTEGER DEFAULT 0,
    due_date DATETIME,
    tags TEXT, -- JSON array as text
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT DEFAULT 'General',
    tags TEXT, -- JSON array as text
    word_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    sender TEXT CHECK (sender IN ('user', 'ai')) NOT NULL,
    is_voice BOOLEAN DEFAULT FALSE,
    language TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create prompts table for storing generated prompts
CREATE TABLE IF NOT EXISTS prompts (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    custom_requirements TEXT,
    language TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT OR IGNORE INTO tasks (id, title, description, priority, category) VALUES
('1', 'Complete project documentation', 'Write comprehensive docs for the new feature', 'high', 'Work'),
('2', 'Review code changes', 'Review and approve pending pull requests', 'medium', 'Development'),
('3', 'Plan weekend activities', 'Organize fun activities for the weekend', 'low', 'Personal');

INSERT OR IGNORE INTO projects (id, title, description, status, progress, tags) VALUES
('1', 'Personal Productivity App', 'Building a comprehensive productivity system with AI integration', 'in-progress', 65, '["Next.js", "AI", "Productivity"]'),
('2', 'Bengali Language Learning Platform', 'Create an interactive platform for learning Bengali with voice support', 'planning', 15, '["Education", "Bengali", "Voice"]');

INSERT OR IGNORE INTO documents (id, title, content, category, tags, word_count) VALUES
('1', 'Project Setup Guide', 'This document outlines the setup process for new projects...', 'Development', '["setup", "guide", "development"]', 245),
('2', 'Bengali Language Resources', 'Collection of Bengali language learning resources and references...', 'Language', '["bengali", "language", "resources"]', 189);
