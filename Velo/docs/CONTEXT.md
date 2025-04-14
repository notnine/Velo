# Velo: AI-Powered Smart Scheduling Assistant

## Project Overview
Velo is a minimalist task management application that combines simple user interfaces with AI-powered scheduling assistance. The core philosophy is to keep both frontend and backend as simple as possible, with frontend being the simplest and backend housing minimal but necessary logic.

## Architecture Philosophy
- **Frontend: Ultra Simple**: Just UI components for display and native device inputs
- **Backend: Simple but Smart**: Houses minimal business logic, delegates complexity to LLM
- **Clear Separation**: Frontend has zero business logic, backend has minimal logic

## Technical Stack
### Frontend
- React Native with Expo
- Basic React Native components only
- Device's built-in text input (includes voice-to-text)
- Minimal Redux for task state

### Backend
- FastAPI for API endpoints
- Supabase for authentication and database
- OpenAI API for task understanding and scheduling
- Minimal business logic

## Core Features
### Task Management
- Create, read, update, delete tasks
- Basic task properties only:
  - Title
  - Description (optional)
  - Completion status
  - Scheduled time (optional)

### Calendar
- Simple calendar view
- Display of scheduled tasks
- Basic scheduling interface

### Task Input
- Regular text input using device keyboard
- Voice input using device's built-in speech-to-text
- No custom voice recording

## Project Structure
```
velo/
├── frontend/                # React Native frontend
│   ├── components/         # Reusable components
│   │   ├── TaskItem.tsx   # Individual task display
│   │   ├── TaskList.tsx   # List of tasks
│   │   └── Calendar/      # Calendar display
│   │       └── CalendarView.tsx
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.tsx    # Main task list
│   │   └── CalendarScreen.tsx # Calendar view
│   └── store/             # Minimal state management
│       └── slices/        
│           └── tasksSlice.ts # Basic task state
├── backend/               # FastAPI backend
│   ├── app/              # Application package
│   │   ├── main.py       # FastAPI application
│   │   ├── config.py     # Configuration
│   │   ├── api/          # API routes
│   │   │   ├── auth.py   # Authentication
│   │   │   ├── tasks.py  # Task management
│   │   │   └── ai.py     # LLM integration
│   │   ├── models.py     # Database models
│   │   └── schemas.py    # Pydantic schemas
│   ├── tests/            # Test files
│   └── requirements.txt   # Python dependencies
├── docs/                 # Documentation
│   ├── CONTEXT.md       # Project context
│   └── DEVELOPMENT_PLAN.md # Development phases
└── README.md            # Project documentation
```

## Development Approach
1. **Frontend: Zero Logic**
   - Pure display components
   - Use device's built-in inputs
   - Just show data and collect input
   - No data processing
   - No special libraries

2. **Backend: Minimal Logic**
   - Basic CRUD operations
   - Simple LLM integration
   - Minimal data processing
   - Let LLM handle complexity

## Testing Strategy
- Frontend: Component rendering tests only
- Backend: Basic API and integration tests
- Focus on critical user flows

## Success Metrics
1. User Experience
   - Task management is intuitive
   - Native inputs work smoothly
   - Fast response times

2. Technical
   - Clean, minimal codebase
   - Reliable backend processing
   - Good test coverage

3. Development
   - Easy to understand
   - Quick to modify
   - Simple to maintain

## Security Considerations
- Basic authentication
- Protected API endpoints
- Secure API key handling
- Input validation

## Documentation
- Setup guides
- API documentation
- Database schema
