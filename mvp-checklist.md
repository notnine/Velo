# ✅ Scheduling App MVP Checklist

## 🚀 Phase 1: Product Planning
- [x] Define core problem: Simplify daily task scheduling via voice/text.
- [x] Identify core MVP features:
  - Daily to-do list with checkboxes
  - Calendar view showing minimized tasks per day
  - Voice integration for adding/scheduling tasks
  - Text input for manual task addition

## ✍️ Phase 2: Design
- [ ] Curate design inspirations from Mobbin for:
  - Daily Dashboard (to-do list)
  - Calendar View (miniaturized tasks)
  - Task Input (voice & text)
- [ ] Define visual theme: Colors, fonts, and layout elements

## 🧱 Phase 3: Backend (FastAPI)
- [ ] Initialize FastAPI project and GitHub repo
- [ ] Set up environment variables and config loader
- [ ] Configure PostgreSQL (managed host e.g., Supabase)
- [ ] Define SQLAlchemy models:
  - User
  - Task
  - Calendar Entry
- [ ] Build core API routes:
  - `POST /tasks` – add tasks
  - `GET /tasks` – retrieve today's tasks
  - `PATCH /tasks/{id}` – mark tasks complete
  - `GET /calendar` – retrieve tasks for calendar view

## 🎨 Phase 4: Mobile Frontend (React Native with Expo)
- [ ] Set up Expo project and integrate Firebase Auth (Sign Up/Log In)
- [ ] Develop screens:
  - Daily Dashboard (task checklist)
  - Calendar View (minimized tasks)
  - Task Input (voice via react-native-voice + text field)
- [ ] Connect screens to FastAPI endpoints

## 🧪 Phase 5: Testing & Feedback
- [ ] Create test user accounts; manually run through flows
- [ ] Get beta tester feedback (2–3 users)
- [ ] Fix critical UX/UI issues and bugs

## ☁️ Phase 6: Deployment & Post-Launch
- [ ] Deploy backend (e.g., Railway free tier)
- [ ] Publish mobile app to TestFlight/Play Store Beta
- [ ] Set up a basic landing page with "Join Beta" CTA
- [ ] Share on IndieHackers, Reddit, Twitter, etc.
