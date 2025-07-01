# Velo

A task management app that helps you organize and schedule your tasks efficiently.

## Setup

1. Clone the repository
2. Setup environment variables:
   - Create a `.env` file in the `backend` directory
   - Add your Supabase and OpenAI credentials:
   ```bash
   # Frontend (Supabase)
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Backend (LLM Integration)
   OPENAI_API_KEY=your_openai_api_key
   
   # Optional: Redis for rate limiting
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```
3. Install frontend dependencies:
   ```bash
   npm install
   ```
4. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
5. Start the development server:
   ```bash
   npx expo start
   ```

## Environment Variables

The following environment variables are required:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

Get these credentials from your Supabase project dashboard.

## Project Structure

This is a React Native app using Expo Router for navigation:

- `app/` - Contains all screen components organized by routes
- `components/` - Reusable UI components
- `backend/` - FastAPI backend for LLM integration
- `docs/` - Project documentation

## Features

- Task management with local storage
- Calendar view for scheduled tasks
- AI-powered chat interface (in development)
- User preferences and settings

## Development Notes

- Uses Expo Router for file-based navigation
- Redux for state management with AsyncStorage persistence
- Component-based architecture for reusability
