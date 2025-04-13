# Velo: AI-Powered Smart Scheduling Assistant

## Project Overview

Velo is an intelligent, mobile-first scheduling application that leverages AI to optimize users' daily task management. The app combines three core components:
1. Natural language input (voice & text)
2. Smart task scheduling
3. Intuitive calendar management

Key differentiators:
- AI-powered scheduling optimization
- Hands-free voice interaction
- Clean, minimal interface
- Real-time conflict resolution

## Architecture Philosophy

### Frontend Principles
- **Simplicity First**:
  - Displaying data
  - Capturing user input
  - Basic interactions
  - Minimal client-side logic

- **Component Guidelines**:
  - Use basic React Native components over complex UI libraries
  - Minimal styling and animations
  - Simple, predictable state management
  - Clear separation of concerns

- **State Management**:
  - Minimal client-side state
  - Simple Redux store for UI state only
  - No business logic in reducers
  - Clear action creators

### Backend Principles
- **Business Logic Centralization**:
  - All scheduling logic
  - AI processing
  - Data validation
  - Conflict resolution
  - Task optimization

- **Data Flow**:
  - Single source of truth
  - Consistent data validation
  - Clear error handling
  - Predictable state updates

## Technical Stack

### Frontend Stack
- **Framework:** React Native with TypeScript
- **Navigation:** Expo Router
- **State Management:** Redux Toolkit (minimal configuration)
- **UI Components:** Basic React Native components
- **Voice Integration:** 
  - react-native-voice for voice input
  - react-native-tts for text-to-speech

### Backend Stack
- **API Framework:** Python FastAPI
- **Database:** PostgreSQL (via Supabase)
- **AI Integration:** OpenAI API
- **Deployment:** Heroku

## Core Features

### 1. Task Management
- **Basic Operations:**
  - Add tasks
  - Mark completion
  - Delete tasks
  - View task list

- **Task Properties:**
  - Title
  - Duration
  - Completion status

### 2. Scheduling (Backend-Driven)
- **Server-Side Logic:**
  - Time slot allocation
  - Conflict detection
  - Schedule optimization
  - Priority handling

- **Frontend Display:**
  - Simple calendar view
  - Task time blocks
  - Basic conflict indicators

### 3. AI Integration (Backend-Only)
- **Task Analysis:**
  - Duration estimation
  - Priority inference
  - Scheduling suggestions

- **Frontend Display:**
  - Show suggestions
  - Accept/reject options
  - Simple feedback UI

### 4. Voice Interface
- **Basic Functionality:**
  - Voice command recording
  - Text display
  - Simple feedback

- **Backend Processing:**
  - Speech-to-text
  - Command parsing
  - Response generation

## Data Models

### Tasks
```sql
tasks (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    duration INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

### Schedules
```sql
schedules (
    id UUID PRIMARY KEY,
    task_id UUID REFERENCES tasks(id),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

## Development Approach

### Phase-Based Development
- Clear separation of concerns
- Backend-driven features
- Minimal frontend complexity
- Incremental feature addition

### Testing Strategy
- Comprehensive backend testing
- Basic frontend integration tests
- End-to-end testing for critical flows

### Documentation
- API specifications
- Data flow diagrams
- Setup guides
- Architecture decisions

## Success Metrics
- Task completion rates
- Scheduling accuracy
- User interaction success
- System performance
- Error rates

## Project Structure (subject to change)
```
velo/
├── app/                    # React Native app root
│   ├── components/        # Reusable components
│   │   ├── TaskItem.tsx  # Individual task display
│   │   ├── TaskList.tsx  # List of tasks
│   │   ├── Calendar/     # Simple calendar components
│   │   │   ├── DayView.tsx
│   │   │   └── TimeBlock.tsx
│   │   └── Voice/        # Voice interaction components
│   │       ├── VoiceInput.tsx
│   │       └── VoiceFeedback.tsx
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.tsx    # Main task view
│   │   ├── CalendarScreen.tsx # Calendar view
│   │   └── SettingsScreen.tsx # Basic settings
│   ├── store/            # State management
│   │   ├── taskSlice.ts  # Task-related state
│   │   └── store.ts      # Redux store config
│   ├── services/         # API services
│   │   ├── api.ts       # API client setup
│   │   ├── tasks.ts     # Task-related API calls
│   │   └── voice.ts     # Voice processing
│   └── utils/           # Helper functions
│       └── dateTime.ts  # Date/time utilities
├── backend/             # FastAPI backend
│   ├── app/            # Application package
│   │   ├── api/       # API routes
│   │   │   ├── tasks.py
│   │   │   └── schedule.py
│   │   ├── core/      # Core functionality
│   │   │   ├── scheduler.py  # Scheduling logic
│   │   │   └── ai_processor.py # AI integration
│   │   ├── models/    # Database models
│   │   └── schemas/   # Pydantic schemas
│   ├── tests/         # Test files
│   └── requirements.txt # Python dependencies
├── docs/              # Documentation
│   ├── CONTEXT.md    # Project context
│   └── DEVELOPMENT_PLAN.md # Development phases
└── README.md         # Project documentation
```

---

This specification serves as the foundation for Velo's development, emphasizing simplicity in the frontend while maintaining powerful backend capabilities.
