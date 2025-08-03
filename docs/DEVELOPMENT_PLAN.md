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

- [x] **Voice End-of-Speech Detection**
    - [x] Use react-native-voice to start listening when mic button is tapped
    - [x] Listen for onSpeechEnd or onSpeechResults (final) event to detect when user is done speaking
    - [x] On end of speech, stop listening and capture the final transcript
    - [x] Dispatch the transcript to the LLM handler (sendMessage)
    - [x] Handle edge case: silence (no speech detected)

- [ ] **Voice-Driven Conversation Flow (Chronological Steps)**
- [ ] **A: STT & TTS**
    - [x] Integrate speech-to-text (STT) for capturing user voice input (react-native-voice)
    - [x] Integrate text-to-speech (TTS) for app voice output (expo-speech)
    - [x] On mic tap, use STT to capture user request (e.g., "schedule dinner today at 7pm")
    - [x] Hardcode app logic to use TTS to ask for confirmation (e.g., "scheduling dinner today at 7pm, confirm?")
    - [x] After TTS, automatically start listening for user's voice reply
    - [x] If user says "confirm" or "yes", finalize the action (hardcoded)
    - [x] If user says "no" or provides a correction (e.g., "actually, make it 8pm"), app uses TTS to repeat new proposal (e.g., "scheduling dinner at 8pm, confirm?")
    - [x] Repeat TTS/STT loop until user confirms or cancels
    - [x] Ensure LLM can handle user cancellation intent (e.g., user says "cancel" or "never mind")
    - [x] Handle edge cases: silence, user cancels, or errors (TTS feedback)
    - [ ] Test: Full hands-free flow with hardcoded logic (no backend)
- [ ] **B: LLM Integration**
    - [ ] Connect to LLM backend for dynamic responses
    - [ ] Send full chat history to backend for context
    - [ ] Parse LLM response for requires_confirmation and confirmed intent
    - [ ] Use TTS to prompt for confirmation or corrections as needed
    - [ ] On user correction, send new message to LLM and repeat TTS/STT loop
    - [ ] Only execute action after LLM signals confirmed intent
    - [ ] Handle scheduling conflicts: if conflict detected, inform user via TTS and prompt for alternative
    - [ ] Test: Multi-turn, hands-free conversation with LLM


- [ ] **Backend & LLM Updates**
  - [ ] Update backend to handle conversational context and multi-turn flow

### 4.3 Smart Task Creation
- [ ] **Automated Scheduling**
  - [ ] LLM suggests optimal times based on calendar availability
  - [ ] Handle time conflicts and suggest alternatives
  - [ ] **LLM/app should warn about conflicts and offer to reschedule or pick a new time**

- [ ] **Task Management via Voice**
  - [ ] Voice commands for editing tasks: "change time to 3pm", "move to tomorrow"
  - [ ] Voice commands for task actions: "complete task", "delete meeting"
  - [ ] Natural language task creation: "add dentist appointment for Friday"

### 4.4 User Experience
- [ ] **Minimal UI Interaction**
  - [x] Replace text input with voice button
  - [ ] Show conversation status and current task being created
  - [ ] Use TTS for all confirmations and prompts
  - [ ] No UI confirmation prompts; all confirmations are voice-driven
  - [ ] Implement undo functionality for recent tasks

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