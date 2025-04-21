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

## Core Features & Implementation

### 1. Main Page Components

#### 1.1 Daily To-Do List
- **Purpose:**  
  Provide a clear, linear view of tasks for the current day.
- **Features & Interactions:**
  - **Task Display:**  
    - Shows task title, inferred duration, and priority
    - Indicates whether a task is fixed or flexible (flexibility initially inferred from input)
  - **User Actions:**  
    - **Checkboxes:** Mark tasks as complete
    - **Editing:** Tap a task to edit its details
    - **Manual Reordering:**  
      - Allow users to drag and drop tasks to change the order  
      - Manual override indicates user's intent and prevents automatic re-calculation
  - **Backlog Section:**  
    - Displays "ongoing" tasks or tasks with future due dates
    - Helps track deadlines and plan multi-day tasks

#### 1.2 Calendar Snippet
- **Purpose:**  
  Visual representation of the day with time-blocked tasks
- **Features & Interactions:**
  - **Time Blocks:**  
    - Display tasks with suggested start times and durations
    - Fixed tasks (e.g., appointments) are non-movable
    - Flexible tasks scheduled by priority and available time
  - **User Interaction:**  
    - Tap time block for detailed editing
    - Modify time slots for flexible tasks

#### 1.3 AI Interaction Area
- **Components:**
  - **Text Input Box:**  
    - For task commands (e.g., "Add report meeting at 2 PM")
  - **Mic Button:**  
    - Voice input via react-native-voice
    - Recording indicator and waveform feedback
  - **Audio Feedback System:**
    - Text-to-speech for AI responses and confirmations
    - Voice recognition for user confirmations
    - Ambient audio indicators for processing states
- **Flow:**  
  - Input processing through backend
  - FastAPI routes invoke OpenAI API to parse:
    - Task titles
    - Duration estimates
    - Priority levels
    - Flexibility status
    - Deadlines
  - AI generates structured suggestions
  - **Confirmation Handling:**
    - System vocalizes suggestions or conflicts using TTS
    - Provides audio cues for different types of confirmations needed
    - Accepts voice responses for confirmation (e.g., "yes," "no," "modify")
    - Falls back to visual UI only when voice interaction fails or is disabled
    - Maintains context for multi-turn voice conversations
  - Updates UI after confirmation

### 2. Scheduling Logic & Task Management

#### 2.1 Task Attributes
- **Essential Task Data:**
  - Title/Description
  - Estimated Duration (LLM-inferred, user-adjustable)
  - Priority Level (initially inferred, adjustable)
  - Flexibility Status (fixed vs. flexible)
  - Due Dates (for backlog tasks)

#### 2.2 Scheduling Algorithm
- **Task Categories:**
  - Fixed Tasks (non-movable, time-specific)
  - Flexible Tasks (reschedulable)
  - Backlog Tasks (future deadlines)
- **Optimization Process:**
  1. Separate fixed and flexible tasks
  2. Reserve fixed task time slots
  3. Schedule flexible tasks using LLM suggestions
  4. Maintain backlog for future tasks
  5. Request user confirmation for significant changes
- **Manual Override Handling:**
  - User reordering treated as direct override
  - No automatic recalculation after manual changes
  - Preserves user control over task sequence

#### 2.3 Deadline Task Management
- **Processing:**
  - LLM extracts due dates and effort estimates
  - Tasks stored in backlog rather than immediate schedule
- **Planning:**
  - Suggests distributed work plans
  - Maintains focus on immediate tasks
- **Interface:**
  - Separate view for deadline-based tasks
  - User adjustment capabilities

### 3. User Preferences & Customization

#### 3.1 Preference Collection
- **Onboarding Settings:**
  - Sleep and wake times
  - Work hours
  - Productivity periods (morning/evening)
  - Work style (early bird/night owl)
- **Application:**
  - Avoids non-productive periods
  - Aligns priority tasks with peak hours

#### 3.2 Preference Integration
- **Rule Implementation:**
  - Hard constraints (sleep hours)
  - Soft preferences (productivity alignment)
- **Adaptive Learning:**
  - System learns from user adjustments
  - Refines scheduling over time

### 4. Calendar System

#### Views
- Month view (default)
- Week view
- Day view
- List view

#### Features
- Event creation and editing
- Drag and drop functionality
- Duration adjustment
- Basic event details
- Month navigation
- Today quick access

#### Manual Scheduling Mode
- **Purpose:**  
  Provide direct control over task arrangement through drag-and-drop interface while maintaining access to AI optimization.

- **Context-Aware Behavior:**
  - **Main Page:** Editing limited to today's schedule only
  - **Calendar Page:** Full access to edit tasks on any day

- **Key Components:**
  1. **Manual Mode Toggle:**
     - Activation suspends automatic conflict resolution
     - Optional optimization prompt on deactivation
     - Clear visual indicator of active mode

  2. **Editing Interface:**
     - **Drag-and-Drop:**
       - Free-form task repositioning
       - Smooth movement without automatic snapping
     - **Resizing:**
       - Edge-drag for duration adjustment
       - Direct time modification
     - **Visual Conflict Indicators:**
       - Non-blocking overlap warnings
       - Subtle visual cues (e.g., red borders)

  3. **Optimize Button:**
     - Triggers AI scheduling algorithm
     - Resolves conflicts while preserving manual layout intent
     - Context-aware optimization:
       - Main page: Today's tasks only
       - Calendar page: Selected day's tasks
     - Visual confirmation of applied changes

  4. **Undo Button:**
     - Reverts to previous confirmed schedule
     - Provides safety net for experimental changes
     - Instant restoration of last known good state

- **Workflow:**
  1. Manual mode activation
  2. Free-form task adjustments
  3. Optional AI optimization
  4. Change confirmation or reversion
  5. Mode deactivation

#### Calendar Integration
- Seamless switching between automated and manual modes
- Consistent visual language across views
- Preservation of user intent during mode transitions

### 5. Authentication System

#### Components
- Welcome screen
- Signup/login flow
- Firebase Auth integration
- Session management

#### User Flow
1. Welcome screen
2. Email authentication
3. Dashboard redirect
4. Session persistence

## Data Flow & Integration

### Task Processing
1. User input capture
2. AI processing & analysis
3. Schedule optimization
4. Database storage
5. UI update
6. Real-time sync

---

This specification serves as the foundation for Velo's development, ensuring consistent implementation of the project's scope, architecture, and core mechanics. Regular updates will be made as the project evolves.
