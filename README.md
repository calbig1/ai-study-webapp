# StudyFlow AI

A production-ready, multi-page AI-powered study app for students (15–23), designed with a minimal soft-blue UI and mobile-first layout.

## Features

- **Home Dashboard** (`/dashboard`)
  - Greeting + quick actions
  - Daily streak and accuracy snapshot
  - Recent activity and AI-generated study plan
- **Scan Solver** (`/scan-solver`)
  - Image upload + typed input
  - Subject detection + step-by-step solutions
  - "Explain like I'm 10" and harder-version prompts
- **AI Chat Tutor** (`/ai-chat`)
  - Contextual tutoring chat
  - Modes: Homework Help / Test Prep / Concept Explanation
- **Smart Notes** (`/notes`)
  - Paste/upload notes
  - AI summary, key points, flashcards, and quiz prompts
- **Practice Mode** (`/practice`)
  - Adaptive easy/medium/hard prompts
  - Instant feedback + explain-mistake actions
- **Flashcards** (`/flashcards`)
  - Swipe-style review and spaced repetition signals
- **Progress Tracker** (`/progress`)
  - Accuracy, streaks, answered count, weak-area tracking
- **Settings/Profile** (`/settings`)
  - Personalization, subject/grade inputs, dark mode and notifications toggles

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend/API**: Next.js route handlers (`/app/api/*`)
- **AI Layer**: OpenAI-ready generation path with local fallback logic
- **Storage**: local browser persistence abstraction in `lib/storage.ts`
- **Deployment**: Vercel-ready (`vercel.json`)

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and add optional API keys for full AI responses.

