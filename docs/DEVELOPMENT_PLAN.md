# Velo MVP Development Plan

This document outlines the development strategy for the Velo MVP, focusing on local data storage and minimal complexity.

## Core Principles
- Frontend remains simple and focused on display/basic interactions
- Data persistence handled locally for MVP
- Each phase must be fully tested before moving on
- Features are added incrementally
- Focus on core functionality first

## Phase 1: Basic Task Management (Completed)
- [x] Simple task list with add/complete/delete functionality
- [x] Basic Redux store
- [x] Minimal UI components

## Phase 2: Local Data Persistence
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

## Phase 3: Calendar Integration
### 3.1 Calendar View
- [x] Basic calendar component
- [x] Task list integration
  - [x] Show only today's tasks in the task list

### 3.2 Task Scheduling
- [x] Add scheduling UI
- [x] Implement local task scheduling
- [x] Calendar view updates

## Phase 4: LLM Integration
### 4.1 Backend Setup (Minimal FastAPI)
- [x] Set up single FastAPI endpoint for LLM interactions
- [x] Implement simple in-memory token tracking
- [x] Add basic rate limiting for API calls
- [x] Set up environment variables for API keys

### 4.2 Frontend Integration
- [x] Add UI text input box for user to talk to LLM
- [ ] Use existing red text bubble icon (top-right, calendar screen) to open assistant
- [ ] Show Bottom Sheet Assistant on icon tap (half-height, expands fullscreen)
- [ ] Display chat messages and text input in assistant
- [ ] Add minimal mic/voice input (basic voice-to-text)
- [ ] Display LLM suggestions with confirm/reject (in progress)
- [ ] Apply schedule updates locally (in progress)

## Testing Strategy
- Component rendering tests
- Local storage operations tests
- Calendar integration tests
- LLM interaction tests

## Documentation
- Setup guide
- Local storage schema
- Component documentation

---

This plan focuses on the MVP phase with local data storage. Future versions may include backend integration and additional features. 