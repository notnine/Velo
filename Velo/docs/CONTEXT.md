# Velo: AI-Powered Smart Scheduling Assistant

## Project Overview
Velo is a minimalist task management application that seamlessly combines intuitive user interfaces with AI-powered scheduling capabilities. At its core, Velo follows a philosophy of intentional simplicity: a streamlined frontend for effortless user interaction, complemented by a backend that handles essential business logic with minimal complexity.

The application is structured around three main views:
1. **Home View**: A unified dashboard featuring today's tasks and an at-a-glance calendar widget
2. **Calendar View**: A comprehensive calendar interface inspired by Apple's calendar design, offering clear task visualization
3. **Settings View**: A centralized space for user preferences and account management

## MVP Features
The initial release of Velo focuses on delivering core functionality through these three primary views. In this phase:
- Task management is handled through a clean, intuitive interface
- User data (tasks and preferences) is managed locally for rapid development
- The foundation is laid for future backend integration while maintaining frontend simplicity

## MVP
Velo's MVP consists of the 3 pages. User data (tasks & preferences) are stored locally. Database houses no data yet.

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
│   └── store/             # Local state management with persistence
│       ├── index.ts       # Redux store configuration with AsyncStorage
│       └── taskSlice.ts   # Task state with local storage integration
├── backend/               # FastAPI backend
│   ├── app/              # Application package
│   │   ├── __init__.py   # Package initialization
│   │   ├── main.py       # NOT IN USE - FastAPI application
│   │   ├── config.py     # NOT IN USE - Configuration
│   │   ├── database.py   # NOT IN USE - Database configuration
│   │   ├── auth.py       # NOT IN USE - Authentication utilities
│   │   ├── api/          # API endpoints
│   │   │   ├── v1/       # Version 1 endpoints
│   │   │   │   └── endpoints/  # Route handlers
│   │   │   │       ├── auth.py   # NOT IN USE - Authentication endpoints
│   │   │   │       ├── tasks.py  # NOT IN USE - Task management endpoints
│   │   │   │       └── ai.py     # LLM integration for task optimization
│   │   ├── models/      # Data models
│   │   │   ├── auth.py  # NOT IN USE - Authentication models
│   │   │   └── task.py  # NOT IN USE - Task models
│   │   └── schemas/     # Pydantic schemas
│   │       └── task.py  # NOT IN USE - Task schemas
│   ├── migrations/      # NOT IN USE - Database migrations
│   ├── tests/          # NOT IN USE - Test files
│   ├── alembic.ini     # NOT IN USE - Alembic configuration
│   ├── requirements.txt # Python dependencies for LLM integration
│   ├── .env.example    # Environment variables template
│   ├── .flake8         # Flake8 configuration
│   ├── pyproject.toml  # Project configuration
│   └── .pre-commit-config.yaml # Pre-commit hooks configuration
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
