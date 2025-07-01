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
app/                # React Native frontend
├── (app)/           # App screens
│   ├── _layout.tsx   # App layout
│   ├── calendar.tsx  # Calendar
│   ├── index.tsx     # Home
│   └── settings.tsx  # Settings
├── (auth)/          # Authentication screens
│   ├── _layout.tsx  # Auth layout
│   ├── index.tsx    # Login
│   └── register.tsx # Register
├── store/           # App state management
│   ├── index.ts     # Redux store configuration
│   ├── taskSlice.ts # Task state
│   ├── llmSlice.ts  # LLM state
│   └── middleware/  # Redux middleware
└── components/      # UI components
    ├── AddTaskModal.tsx  # Add task modal
    ├── ChatInterface.tsx # Chat interface
    ├── DayDetailView.tsx # Day details
    ├── Settings.tsx      # Settings
    ├── TaskDetailsModal.tsx # Task details
    ├── TaskItem.tsx     # Task item
    └── TaskList.tsx     # Task list

backend/            # FastAPI backend
├── app/             # Application package
│   ├── __init__.py  # Init
│   ├── api/         # API
│   ├── config.py    # Configuration
│   ├── auth.py      # Authentication
│   ├── core/        # Core modules
│   └── migrations/  # Migrations
├── tests/           # Backend tests
└── requirements.txt # Backend dependencies

docs/              # Documentation
├── CONTEXT.md     # Context
└── DEVELOPMENT_PLAN.md # Dev plan

README.md          # Main documentation
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
