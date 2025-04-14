# Velo MVP Development Plan

This document outlines the development strategy for the Velo MVP, with both frontend and backend kept as simple as possible.

## Core Principles
- Frontend remains simple and focused on display/basic interactions
- Backend stays minimal, delegating complex logic to LLM
- Each phase must be fully tested before moving on
- Features are added incrementally
- Focus on core functionality first

## Phase 1: Basic Task Management (Completed)
- [x] Simple task list with add/complete/delete functionality
- [x] Basic Redux store
- [x] Minimal UI components

## Phase 2: Backend Foundation
### 2.1 Project Setup
- [x] FastAPI project structure
- [x] Development environment setup
- [x] Basic project configuration
- [x] Setup development tools (linting, formatting)

### 2.2 Authentication & Authorization
- [ ] Set up Supabase Authentication
- [ ] Create users table and schema
- [ ] Implement signup endpoint
- [ ] Implement signin endpoint
- [ ] JWT token handling
- [ ] Authentication tests
- [ ] Implement account signin/signup with supabase

### 2.3 Database Layer
- [x] Set up Supabase project
- [x] Create `tasks` table with minimal fields:
  - id
  - user_id
  - title
  - description (optional)
  - is_completed
  - scheduled_time (optional)
  - created_at
- [x] Define database models
- [x] Basic CRUD operations
- [x] Write database tests

### 2.4 Basic API Layer
- [x] Health check endpoint
- [ ] CRUD endpoints for tasks
- [ ] Request/Response models
- [x] Basic error handling
- [ ] API tests

### 2.5 Testing & Documentation
- [ ] Unit tests for endpoints
- [ ] API documentation
- [x] Environment setup guide
- [ ] Deployment documentation

## Phase 3: Frontend-Backend Integration
### 3.1 API Client Setup
- [ ] API client configuration
- [ ] Environment variables
- [ ] Error handling utilities

### 3.2 Data Flow
- [ ] Replace Redux operations with API calls
- [ ] Handle API errors
- [ ] Add loading states

### 3.3 Calendar View
- [ ] Simple calendar component
- [ ] Display scheduled tasks
- [ ] Allow manual drag-drop scheduling

## Phase 4: LLM Integration
### 4.1 OpenAI Setup
- [ ] API configuration
- [ ] Basic prompt template
- [ ] Error handling

### 4.2 Scheduling Assistant
- [ ] Single endpoint for rescheduling requests
- [ ] Simple prompt:
  - Current tasks and their schedules
  - User's request
  - Return suggested changes
- [ ] Apply suggested changes

### 4.3 Frontend Integration
- [ ] Add "Ask AI to reschedule" button
- [ ] Display suggestions
- [ ] Allow accept/reject of suggestions

## Testing Strategy
- Each feature requires unit tests
- Integration tests for API endpoints
- End-to-end tests for critical flows
- LLM response validation

## Documentation Requirements
- API documentation
- Setup guides
- Database schema
- Deployment procedures

---

This plan is a living document and will be updated as development progresses and requirements evolve. 