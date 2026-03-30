# AetherStudy

Premium AI study platform with mobile-first UX, advanced content filtering, and 3D blue interface.

## Core Routes
- `/` animated landing
- `/onboarding` personalization
- `/dashboard`
- `/upload`
- `/study/setup`
- `/study-session`
- `/quiz-mode`
- `/flashcards`
- `/progress`
- `/library`
- `/settings`

## AI Pipeline
- `lib/content-processor.ts` strips filler + ranks concepts
- `lib/ai-engine.ts` applies tutor logic and generates exam-style study pack
- `lib/image-parser.ts` image text cleanup and noise filtering hooks

## Run
```bash
npm install
npm run dev
```

## Vercel
This project is configured for Vercel and auto-deploy from `main`.
