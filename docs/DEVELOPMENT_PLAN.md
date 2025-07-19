# Velo MVP Development Plan

This document outlines the development strategy for the Velo MVP, focusing on automated task scheduling, local data storage, minimal code complexity, and minimal user interaction.

## Core Principles
- Frontend remains simple and focused on display/basic interactions
- Data persistence handled locally for MVP
- Each phase must be fully tested before moving on
- Features are added incrementally
- Focus on core functionality first
- **Voice-Driven**: Use voice conversation for natural task creation
- **Zero-Friction**: Tasks should be created with minimal user input
- **Conversational Control**: Users can edit/reject via voice commands

## Phase 1: Basic Task Management (Completed)
- [x] Simple task list with add/complete/delete functionality
- [x] Basic Redux store
- [x] Minimal UI components

## Phase 2: Local Data Persistence (Completed)
### 2.1 Redux Setup
- [x] Configure Redux store
- [x] Implement task slice
- [x] Basic task operations (CRUD)

### 2.2 AsyncStorage Integration
- [x] Set up AsyncStorage with Redux
- [x] Implement data persistence layer
- [x] Handle loading states
- [x] Error handling for storage operations

### 2.3 User Preferences
- [x] Define local preferences schema
- [x] Implement preferences storage
- [x] Add basic settings UI

## Phase 3: Calendar Integration (Completed)
### 3.1 Calendar View
- [x] Basic calendar component
- [x] Task list integration
  - [x] Show only today's tasks in the task list

### 3.2 Task Scheduling
- [x] Add scheduling UI
- [x] Implement local task scheduling
- [x] Calendar view updates

## Phase 4: Voice-Driven LLM Integration
### 4.1 Backend Setup (Minimal FastAPI)
- [x] Set up single FastAPI endpoint for LLM interactions
- [x] Implement simple in-memory token tracking
- [x] Add basic rate limiting for API calls
- [x] Set up environment variables for API keys

### 4.2 Voice Conversation System
- [x] **UI & Entry Point**
  - [x] Remove text input from assistant/chat UI
  - [x] Add a single "Start Conversation" button to initiate voice mode
  - [x] Add visual indicators for listening, thinking, and speaking states

- [x] **Voice Input Integration**
  - [x] Integrate speech-to-text (STT) library
  - [x] Start listening for user speech on button tap
  - [x] 2nd mic tap ends convo with LLM

- [ ] **Conversation Turn Management**
  - [ ] Send transcribed user input to LLM backend
  - [ ] Store conversation history in Redux for context
  - [ ] Receive and display LLM response
  - [ ] Use text-to-speech (TTS) to play LLM response aloud
  - [ ] Automatically resume listening for user's next response
  - [ ] Alternate between listening and speaking until conversation ends

- [ ] **Conversation End Detection**
  - [ ] Detect end of conversation (LLM signals, user says stop phrase, or timeout)
  - [ ] End voice mode and reset UI state

- [ ] **Backend & LLM Updates**
  - [ ] Update backend to handle conversational context and multi-turn flow
  - [ ] Ensure LLM can signal end of conversation in its responses

### 4.3 Smart Task Creation
- [ ] **Automated Scheduling**
  - [ ] LLM suggests optimal times based on calendar availability
  - [ ] Implement smart defaults for common task types
  - [ ] Handle time conflicts and suggest alternatives

- [ ] **Task Management via Voice**
  - [ ] Voice commands for editing tasks: "change time to 3pm", "move to tomorrow"
  - [ ] Voice commands for task actions: "complete task", "delete meeting"
  - [ ] Natural language task creation: "add dentist appointment for Friday"

### 4.4 User Experience
- [ ] **Minimal UI Interaction**
  - [x] Replace text input with voice button
  - [ ] Show conversation status and current task being created
  - [ ] Implement undo functionality for recent tasks
  - [ ] Add quick edit options for created tasks

- [ ] **Smart Notifications**
  - [ ] Show task creation confirmations
  - [ ] Notify about scheduling conflicts
  - [ ] Suggest task modifications based on calendar changes

## Phase 5: Advanced Automation (Future)
### 5.1 Passive Task Creation
- [ ] Monitor calendar events and suggest related tasks
- [ ] Auto-create tasks from email content
- [ ] Location-based task suggestions

### 5.2 Learning and Optimization
- [ ] LLM learns user preferences over time
- [ ] Optimize scheduling based on user patterns
- [ ] Reduce conversation frequency as system learns

## Testing Strategy
- Voice input/output testing
- Conversation flow testing
- LLM integration testing
- Task creation accuracy testing
- User experience testing

## Documentation
- Setup guide
- Local storage schema
- Component documentation

---

This plan focuses on the MVP phase with local data storage. Future versions may include backend integration and additional features. 