# ✅ Velo MVP Checklist WIP

## 🚀 Phase 1: Product Planning
- [x] Define core problem we're solving  
- [x] Name the product: **Velo**  
- [ ] Define 1–2 user personas  
- [ ] Outline core MVP features (no extras)  
- [ ] Map full user flow (Sign up → Create sprint → Add tasks → Track progress → View stats)  

## ✍️ Phase 2: Wireframes & Design
- [ ] Create wireframes for core screens:
  - [ ] Sign Up / Log In
  - [ ] Sprint creation
  - [ ] Task list / Daily dashboard
  - [ ] Progress view (stats/points)
  - [ ] Retrospective screen (optional)
- [ ] Plan navigation & page flow
- [ ] Define visual theme (basic colors, font, layout ideas)

## 🧱 Phase 3: Backend Setup
- [x] Set up GitHub repo  
- [ ] Create file/project structure  
- [ ] Initialize FastAPI project (`main.py`)  
- [ ] Add `.env` and config loader  
- [ ] Set up SQLAlchemy models:
  - [ ] User
  - [ ] Sprint
  - [ ] Task / Objective
  - [ ] DailyLog / Tracker
- [ ] Set up database (Supabase / Railway Postgres)  
- [ ] Create JWT auth system (signup/login/protected routes)  
- [ ] Build core API routes:
  - [ ] `POST /sprints`
  - [ ] `GET /sprints`
  - [ ] `POST /tasks`
  - [ ] `PATCH /tasks/{id}` (mark complete)
  - [ ] `GET /stats`

## 🎨 Phase 4: Frontend (HTMX + TailwindCSS)
- [ ] Setup base HTML with Tailwind  
- [ ] Create HTMX views:
  - [ ] Login / Register
  - [ ] Sprint dashboard (active tasks)
  - [ ] Task creation modal
  - [ ] Completion progress bar
- [ ] Add Jinja2 template support  
- [ ] Connect frontend to backend endpoints  

## 💳 Phase 5: Payments & Plans (Post-MVP)
- [ ] Integrate Stripe
  - [ ] Create Pro plan
  - [ ] Add Stripe Checkout
  - [ ] Handle webhooks (subscription events)
- [ ] Add middleware to lock premium-only features  

## ☁️ Phase 6: Hosting & Deployment
- [ ] Deploy backend to Railway  
- [ ] Deploy frontend to Netlify  
- [ ] Configure domain, env vars, and secrets  
- [ ] Test full flow live (end-to-end)

## 🧪 Phase 7: Testing & Feedback
- [ ] Create test user accounts  
- [ ] Run through all flows manually  
- [ ] Ask 2–3 friends to test  
- [ ] Collect feedback (Notion form, Discord, email)  
- [ ] Fix major UX bugs / blockers  

## 🌀 Phase 8: Post-Launch
- [ ] Create public landing page  
- [ ] Add “Join Beta” CTA  
- [ ] Share with:
  - [ ] IndieHackers
  - [ ] Reddit (r/productivity, r/SideProject)
  - [ ] Twitter/X
  - [ ] Friends & newsletter
