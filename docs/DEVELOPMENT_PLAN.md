# Velo Development Plan

## Current Status: MVP Nearly Complete ✅

**Status**: ✅ **MVP 95% COMPLETE** - Only voice task editing/deletion missing

**Voice-Driven MVP Workflow**:
**Timeless Tasks (Home Page)**:
1. **Voice Input**: "add buy groceries"
2. **TTS Response**: "Adding buy groceries to your todo list"
3. **Task Creation**: Task appears in home page immediately

**Scheduled Tasks (Calendar)**:
1. **Voice Input**: "schedule dinner tonight at 7"
2. **TTS Response**: "Scheduling dinner at 7 PM"
3. **Task Creation**: Task appears in calendar immediately

---

## ✅ **COMPLETED FEATURES**

### A. MVP Structure ✅ **COMPLETE**
- [x] **Home View**: Timeless todo list dashboard (no scheduled times)
- [x] **Calendar View**: Apple-inspired calendar with scheduled task visualization
- [x] **Settings View**: User preferences and account management
- [x] **Navigation**: Bottom tab navigation between all three views

### B. Task Management ✅ **COMPLETE**
- [x] **Task CRUD Operations**: Create, read, update, delete tasks
- [x] **Task Properties**: Title, description, completion status, scheduled time
- [x] **Task Display**: Clean interface (TaskItem, TaskList, DayDetailView)
- [x] **Redux Integration**: Complete task state management

### C. Voice Integration ✅ **COMPLETE**
- [x] **STT Integration**: Speech-to-text for voice input (react-native-voice)
- [x] **TTS Integration**: Text-to-speech for app responses (expo-speech)
- [x] **Error Handling**: Robust STT/TTS failure handling
- [x] **Audio Session Management**: Prevents TTS interruption
- [x] **Voice Task Creation**: Create tasks via voice commands

### D. LLM Integration ✅ **COMPLETE**
- [x] **Backend Integration**: FastAPI with OpenAI GPT-3.5-turbo
- [x] **Conversation Flow**: Multi-turn voice conversations
- [x] **Context Management**: Full chat history sent to LLM
- [x] **Task Creation**: Voice commands create tasks in Redux

### E. Data & Authentication ✅ **COMPLETE**
- [x] **Local Data Storage**: AsyncStorage integration for tasks and preferences
- [x] **Authentication**: Complete login/register system with Supabase
- [x] **Data Persistence**: Automatic saving of state changes

### F. UI Components ✅ **COMPLETE**
- [x] **Voice State Indicators**: Hold-to-talk mic button in bottom nav
- [x] **Task Components**: TaskItem, TaskList, DayDetailView
- [x] **Modal Components**: AddTaskModal, TaskDetailsModal
- [x] **Apple Calendar-Style Day View**: Precise minute-level task positioning with 80px hour spacing

---

## 🎯 **FINAL MVP FEATURE**

### **Missing Feature**:
- [ ] **Voice Task Management**: Edit/delete tasks via voice commands

### **Current Voice Capabilities**:
- ✅ **Create Timeless Tasks**: "add buy groceries"
- ✅ **Create Scheduled Tasks**: "schedule dinner tonight at 7"
- ✅ **Immediate Execution**: No confirmation required
- ✅ **Cancel Actions**: "cancel", "never mind"
- ✅ **Corrections**: "No, make it 8 PM instead"

### **Missing Voice Capabilities**:
- ❌ **Edit Tasks**: "change dinner to 8 PM"
- ❌ **Delete Tasks**: "delete dinner"
- ❌ **List Tasks**: "show my tasks"
- ❌ **Complete Tasks**: "mark dinner as done"

---

## 🔧 **REMAINING TASKS**

### **Home Page UX Redesign** ✅ **COMPLETE**:
- [x] **Separate Timeless Tasks**: Home page shows only timeless tasks (no scheduled times)
- [x] **Remove Today's Scheduled Tasks**: Home page no longer shows tasks scheduled for today
- [x] **Update Task Filtering Logic**: Filter tasks to only show those without scheduled times
- [x] **Implement Voice Command Differentiation**: Natural language patterns for timeless vs scheduled tasks
- [x] **Update Backend Voice Parsing**: Parse voice commands to determine task destination
- [x] **Update Task Creation Flow**: Tasks without times go to home, tasks with times go to calendar

### **Task Creation Modal UX Enhancement** ✅ **COMPLETE**:
- [x] **Add Timeless/Scheduled Toggle**: Add clean UI toggle for task type selection
- [x] **Update Modal State Management**: Handle timeless vs scheduled task modes
- [x] **Conditional Date/Time Pickers**: Show/hide date/time inputs based on task type
- [x] **Update Task Creation Logic**: Handle timeless tasks in AddTaskModal
- [x] **Test Modal Task Creation**: Verify timeless tasks appear on home page, scheduled on calendar

### **Multi-Day Task Display Bug Fix** ✅ **COMPLETE**:
- [x] **Analyze Task Time Adjustment Logic**: Create function to adjust start/end times for multi-day tasks
- [x] **Update DayDetailView Task Filtering**: Modify task display logic to show correct time segments per day
- [x] **Handle Day Boundary Crossings**: Ensure tasks spanning midnight display correctly on both days
- [x] **Test Multi-Day Task Scenarios**: Verify 11 PM-4 AM tasks show 11 PM-midnight on day 1, midnight-4 AM on day 2
- [x] **Fix Midnight End Edge Case**: Tasks ending at midnight (12:00AM) no longer appear on next day
- [x] **Fix Midnight Start Edge Case**: Tasks starting at midnight (12:00AM) no longer appear on previous day
- [x] **Fix Single-Day Midnight Task Creation**: Single-day tasks starting at midnight now display correctly
- [x] **Fix Day Boundary Visual Display**: Multi-day tasks now show full time until 11:59 PM on first day

### **Overlapping Tasks UI/UX Enhancement** ✅ **COMPLETE**:
- [x] **Implement Task Width Calculation**: Calculate optimal width for overlapping tasks based on overlap count
- [x] **Add Horizontal Stacking Logic**: Stack overlapping tasks side-by-side with calculated widths
- [x] **Create Task Collision Detection**: Detect when tasks overlap in time and group them
- [x] **Implement Visual Hierarchy**: Use different colors/opacity for overlapping task groups
- [x] **Add Task Truncation**: Truncate long task titles with ellipsis for narrow overlapping tasks
- [x] **Create Expandable Task Groups**: Allow tapping to expand/collapse overlapping task groups
- [x] **Add Task Count Indicators**: Show "+2 more" indicators for collapsed overlapping groups
- [x] **Implement Smooth Animations**: Add subtle animations for expand/collapse interactions
- [x] **Test Overlapping Scenarios**: Verify 3+ overlapping tasks display correctly with good UX

### **Overlapping Tasks Column Optimization** ✅ **COMPLETE**:
- [x] **Fix False Grouping Logic**: Tasks should only group if they directly overlap, not transitively
- [x] **Implement Column-Based Layout**: Use column assignment algorithm instead of simple grouping
- [x] **Optimize Space Utilization**: Allow non-overlapping tasks to share columns even if they overlap with other tasks
- [x] **Update Collision Detection**: Detect direct overlaps only, not transitive overlaps
- [x] **Test Complex Overlap Scenarios**: Verify long task + multiple short tasks layout correctly

### **Multi-Day Task Time Display Consistency** ✅ **COMPLETE**:
- [x] **Fix Day View Time Display**: Multi-day tasks now show original times instead of adjusted times
- [x] **Fix Calendar View Time Display**: Calendar view was already correct (no time modification)
- [x] **Investigate Task Object Modification**: Found issue in DayDetailView where task objects were being modified
- [x] **Preserve Original Task Data**: Modified DayDetailView to pass original task objects to task details modal
- [x] **Test Multi-Day Task Consistency**: Verify time display matches across all views and shows original times everywhere

### **Todo List Drag and Reorder** ✅ **ENABLED (Long-Press)**:
- [x] **Install Drag and Drop Library**: Added react-native-draggable-flatlist for drag functionality
- [x] **Update Home Page Task List**: Replaced FlatList with DraggableFlatList component
- [x] **Add Task Order State**: Added order/priority field to Task model in Redux store
- [x] **Implement Drag Handles**: Added visual drag handles to each todo item
- [x] **Update Task Reorder Logic**: Implemented onDragEnd handler to update task order in Redux
- [x] **Persist Task Order**: Task order automatically saved to AsyncStorage via existing middleware
- [x] **Add Visual Feedback**: Enhanced drag preview with scaling, shadows, and active state indicators
- [x] **Enable Long-Press Drag Always**: Remove Reorder toggle; long-press initiates drag
- [x] **Remove Arrow Reorder UI**: Clean item UI; only long-press drag
- [x] **Persist Order on Drop**: Dispatch `reorderTasks` with new indices
- [x] **Basic Stability Tests**: Verify add/edit/delete still work after reordering

### **Todo List Reordering – Code Cleanup (Concise Tasks)**
- [x] Remove leftover Reorder UI code: delete toggle state/handlers in `/(app)/index.tsx`
- [x] Prune unused props/styles in `components/TaskItem.tsx` (old arrows/`reorderControls`)
- [x] Remove unused imports (e.g., `Button`, `FlatList`) in affected files
- [x] Keep long-press drag always on: `activationDistance=0`; no conditional logic
- [x] Simplify reorder dispatch: single `reorderTasks` with index-based `newOrder`
- [x] Ensure persistence: confirm `loadStoredTasks` sets default `order` for legacy items
- [x] Remove any Reanimated/Worklets remnants from dependencies (no `react-native-worklets-core`)
- [x] Pin `react-native-reanimated` to SDK-compatible version; remove any local shims; clear caches
- [x] Verify `babel.config.js` has `'react-native-reanimated/plugin'` last
- [x] Sanity pass: re-run build, drag, add/edit/delete; commit only minimal changes

### **Monetization (RevenueCat) — Phase 1: Without Store Accounts**
- [ ] Create RevenueCat project; copy iOS/Android Public SDK keys
- [ ] Add keys to `.env` (`EXPO_PUBLIC_REVENUECAT_IOS_KEY`, `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`)
- [x] Expo app: add `expo-build-properties` plugin in `app.config.ts`
- [x] Initialize Purchases and `logIn(supabaseUserId)` on app start
- [x] Create `useEntitlement('pro')` hook and wire entitlement listener
- [x] Add Paywall screen that handles empty/absent offerings gracefully
- [ ] Prebuild iOS and run dev build; verify SDK loads (no purchases yet)
- [ ] Verify connectivity: user appears in RC Customers after login
- [ ] Backend: stub `POST /api/webhooks/revenuecat`; accept and log test webhook
- [ ] Backend: stub `POST /api/subscriptions/verify`; call RC REST and return entitlements
- [ ] Optional: dev flag to simulate `isPro=true` to test UI gates
- [ ] Gate premium UI with `useEntitlement('pro')` (falls back to dev flag in dev)

### **Monetization — Phase 2: Store Setup & Purchases (Later)**
- [ ] App Store Connect: subscription group + `velo_pro_monthly`, `velo_pro_yearly`
- [ ] Google Play Console: matching products
- [ ] RevenueCat: entitlement `pro`, offering `default`; link store products
- [ ] Paywall: show real price strings from offerings
- [ ] QA: sandbox purchase, restore, upgrade/downgrade; verify webhook mirrors to Supabase
- [ ] Enforce LLM quotas based on mirrored entitlements in `backend/app/api/llm.py`

Rationale:
- Native in‑app digital features must use Apple/Google IAP; RevenueCat unifies platforms
- Keeps codebase simple; no custom receipt validation, one entitlement source of truth

Proposed defaults (tweak anytime):
- Entitlement: `pro`
- Products: `pro_monthly`, `pro_yearly`
- Pricing: $4.99/mo, $29.99/yr, 7‑day trial
- Quotas: Free 50 LLM req/day; Pro 1,000/day (server‑enforced)

### **Voice Task Management**:
- [ ] **Add Edit Task Action**: Add "update_task" action to backend system prompt
- [ ] **Add Delete Task Action**: Add "delete_task" action to backend system prompt
- [ ] **Update Frontend Action Handling**: Add updateTask and deleteTask dispatch calls in VoiceConversationContext
- [ ] **Test Edit Commands**: Verify "change dinner to 8 PM" works correctly
- [ ] **Test Delete Commands**: Verify "delete dinner" works correctly
- [ ] **Test List Commands**: Verify "show my tasks" displays current tasks

---

## 🎯 **CURRENT FOCUS**

**Status**: ✅ **MVP 95% COMPLETE** - Only voice task editing/deletion missing  
**Priority**: Implement voice commands for editing and deleting tasks  
**Next Goal**: Complete the final MVP feature

The app now provides a fully functional MVP with:
- ✅ **Voice-driven task creation** with instant execution
- ✅ **Reliable UI interactions** with instant responses (no animations)
- ✅ **Complete task management** with CRUD operations
- ✅ **Authentication system** with Supabase integration
- ✅ **Data persistence** with AsyncStorage + Redux
- ✅ **Apple Calendar-style day view** with precise minute-level task positioning
- ✅ **Simplified architecture** with clean, maintainable code

**Only remaining feature**: Voice commands for editing and deleting tasks.

---

## 📊 **TECHNICAL SUMMARY**

### **Architecture**:
- **Frontend**: React Native + Redux + Expo
- **Voice**: react-native-voice + expo-speech with error handling
- **Backend**: FastAPI + OpenAI GPT-3.5-turbo
- **Database**: Supabase authentication
- **Storage**: AsyncStorage for local persistence
- **UI**: Instant, reliable interactions without animations

---
