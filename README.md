# Velo 🌀  
**AI-Powered Smart Scheduling Assistant**

---

## ✨ Project Overview
Velo is a minimalist task management application that seamlessly blends an intuitive user experience with AI-powered scheduling capabilities. Built with a philosophy of intentional simplicity, Velo features a streamlined mobile-first frontend and a backend designed to handle essential logic with minimal complexity.

The app revolves around three core views:
- **Home View**: Today’s tasks and quick calendar overview
- **Calendar View**: Full calendar visualization of scheduled tasks
- **Settings View**: User preferences and basic account management

---

## 🔧 Core Features
- ✅ Clean, touch-friendly task management interface
- 📆 Apple-style sleek calendar view
- 🧠 AI-assisted task scheduling powered by OpenAI
- 🗣️ Voice-to-text task input using native device tools
- 🗃️ Local task persistence with Redux + AsyncStorage

---

## 🚀 MVP Scope
- Local-first data storage: All tasks and preferences are saved on-device
- Backend foundations built for future API, database, and auth expansion
- Three primary screens: Home, Calendar, Settings
- Frontend handles only UI — no business logic processed on-device

---

## 🏗️ Architecture Philosophy
- **Frontend: Ultra-Simple**  
  - Pure display components, using device-native inputs
  - Minimal Redux state management for local persistence
  - No embedded business logic

- **Backend: Simple but Smart**  
  - Basic CRUD operations structured in FastAPI
  - AI scheduling tasks delegated to OpenAI’s API
  - Minimal business logic, clean API endpoints
  - Supabase integration planned for authentication and storage (not active yet)

---

## 🛠️ Tech Stack
**Frontend:**  
- React Native (Expo)  
- Redux + AsyncStorage  
- Device-native text and voice input

**Backend:**  
- FastAPI (Python)  
- Supabase (Auth & DB, future integration)  
- OpenAI API (LLM scheduling assistance)

---

## 📁 Project Structure
```
velo/
├── frontend/
│   ├── components/
│   │   ├── TaskItem.tsx
│   │   ├── TaskList.tsx
│   │   └── Calendar/
│   │       └── CalendarView.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   └── CalendarScreen.tsx
│   └── store/
│       ├── index.ts
│       └── taskSlice.ts
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py (not active yet)
│   │   ├── api/v1/endpoints/
│   │   │   ├── auth.py (not active yet)
│   │   │   ├── tasks.py (not active yet)
│   │   │   └── ai.py
│   │   ├── models/
│   │   │   ├── auth.py (not active yet)
│   │   │   └── task.py
│   │   └── schemas/
│   │       └── task.py
├── docs/
│   ├── CONTEXT.md
│   └── DEVELOPMENT_PLAN.md
└── README.md
```

---

## 🧪 Testing Strategy
- **Frontend**: Component rendering tests
- **Backend**: Basic API and integration tests
- Focused testing on critical user flows for reliability

---

## 📈 Success Metrics
- Smooth and intuitive task management experience
- Fast response times and lightweight app behavior
- Clean, maintainable, and modular codebase
- Backend prepared for future scaling and integration

---

## 🔒 Security Considerations
- Basic user authentication (planned via Supabase)
- Protected API endpoints
- Secure handling of API keys and sensitive environment variables
- Input validation at both frontend and backend levels

---

## 📝 Documentation
- Developer setup guides
- API endpoint documentation (for future backend activation)
- Database schema documentation (for future Supabase integration)

---

# 🚀 Future Plans
- Activate backend endpoints and database migrations
- Full deployment of Supabase authentication
- Background AI task optimization services
- Production-level hosting (AWS/GCP)
- Enhanced voice-to-task natural language input

---

# 🎯 Philosophy
**Minimalistic but powerful.**  
**Frontend simplicity + Backend smartness = User delight.**
