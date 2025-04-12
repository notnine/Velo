# Velo: AI-Powered Scheduling App – User Flow & Feature Specification

## Overview

Velo is a mobile-first scheduling app that uses AI to help users optimally schedule their daily tasks. It combines a clean, minimal interface with voice and text input, allowing for hands-free interactions. The app integrates a daily to-do list, a calendar view, and an AI assistant to ensure that users’ tasks are scheduled without conflicts—maximizing productivity and reducing manual scheduling effort.

---

## 1. User Flow

### 1.1 Onboarding & Authentication
- **Welcome Screen:**
  - Clean, minimalist design welcoming the user.
  - Clear call-to-action to sign up or log in.
- **Sign Up / Log In:**
  - Email-based authentication via Firebase Auth.
  - Simple input forms ensuring ease of use.
- **Landing on the Main Page:**
  - After successful login, the user is taken to the main dashboard.

### 1.2 Main Dashboard
- **Daily To-Do List (Home Screen):**
  - Display a list of today’s tasks with checkboxes for marking tasks complete.
  - Each task entry shows a title, estimated duration (if provided by AI), and status (pending/completed).
- **Today’s Calendar Snippet:**
  - A compact, visual snippet showing the schedule for today.
  - Tasks are arranged in a timeline format to indicate time slots and detect potential conflicts.
  
### 1.3 Task Input
- **Task Addition Options:**
  - **Voice Input:**
    - Integration with `react-native-voice` for speech-to-text.
    - Users can speak commands such as “Today I have task A, task B, and task C. Please schedule them for today.”
  - **Text Input:**
    - A text field enabling users to type commands or add individual tasks manually.
- **AI Interaction:**
  - The user’s input (voice or text) is sent to the backend.
  - FastAPI processes the input and calls the OpenAI API for natural language parsing.
  - The AI returns a structured response with tasks, estimated durations, and suggested schedule time slots.
  - The app validates the suggested schedule against existing tasks, ensuring no conflicts.
  - New tasks are then added to the daily to-do list and merged into the calendar view.

### 1.4 Navigation
- **Bottom Navigation Bar:**
  - **Home:** Displays the main dashboard with the daily to-do list and calendar snippet.
  - **Calendar:** Opens a full calendar view similar to Apple’s Calendar app, allowing users to see a monthly view and detailed daily schedules.
  - **Account:** Displays user account details, such as email, basic profile info, and settings.

### 1.5 Calendar Page
- **Full Calendar View:**
  - Resembles the familiar Apple Calendar layout.
  - Each day shows a snapshot of scheduled tasks.
  - Tapping on a day brings up a detailed view where users can see the full schedule and task details.
  - Provides basic interactions like scrolling between months and selecting individual days.

### 1.6 Account Page
- **User Profile & Settings:**
  - Displays user account information (email, name, etc.).
  - Options for changing password, managing subscription (if applicable in the future), and accessing help/about sections.

---

## 2. Core Features

### 2.1 Daily To-Do List
- **Features:**
  - A list of tasks for the current day.
  - Checkboxes to mark tasks as complete.
  - Option to manually edit or delete tasks.
- **Backend Integration:**
  - Tasks are stored in a PostgreSQL database and managed via FastAPI endpoints.
  - Each task includes fields for title, scheduled time, duration, and completion status.

### 2.2 Calendar View
- **Features:**
  - A calendar interface displaying tasks for each day.
  - Today’s schedule is highlighted and detailed; other days show a minimized view.
- **Interaction:**
  - Tapping a day opens a detailed view of the scheduled tasks.
  - Integration with the backend to retrieve task details for the selected day.

### 2.3 AI-Driven Task Scheduling
- **Voice and Text Input:**
  - Users can add tasks through voice commands or text.
  - The AI processes input commands to extract tasks and intents.
- **Scheduling Logic:**
  - AI estimates task durations and suggests optimal time slots.
  - The app’s backend verifies and resolves conflicts with existing tasks.
- **Feedback:**
  - The AI-generated schedule is displayed on the daily to-do list and calendar.
  - Users have the option to confirm, modify, or reject the suggested scheduling.

### 2.4 Navigation & User Experience
- **Bottom Navigation Bar:**
  - **Home:** Central hub for day-to-day tasks.
  - **Calendar:** Full view for scheduling and planning.
  - **Account:** Access to profile and settings.
- **Seamless Integration:**
  - Real-time sync of tasks across views.
  - Clear, intuitive UI for both manual and AI-driven interactions.

---

## 3. Technical Stack (Recap)
- **Mobile Frontend:**  
  - React Native with Expo  
  - react-native-voice for voice input  
  - UI components (e.g., React Native Paper or Native Base)
- **Backend:**  
  - Python FastAPI  
  - OpenAI API for AI scheduling logic  
  - PostgreSQL (e.g., managed by Supabase)
- **Authentication:**  
  - Firebase Auth
- **Deployment:**  
  - Backend on Heroku/Railway  
  - Mobile app deployed via TestFlight/Google Play Beta

---

## 4. Summary

Velo is designed to help users schedule tasks optimally and even interact hands-free, simplifying their daily planning. With a user flow that guides the user from a welcoming authentication to a focused daily dashboard, a detailed calendar view, and robust task management, the app aims to make daily planning seamless and efficient. The integration of AI ensures that tasks are intelligently placed without conflicts, providing a clear productivity boost.

This document outlines the entire flow and key features, making it easier for developers to implement and iterate on the MVP.

---
