# StudySmarter AI (Next.js)

Production-ready, multi-page AI-powered study app for students (15-23).

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS

## Routes
- `/` Landing
- `/dashboard` Dashboard
- `/upload` Upload center
- `/study/setup` Study setup
- `/study` Study experience (one item at a time)
- `/progress` Progress insights

## Core Flow
Upload -> Choose Mode -> Answer 1 item -> Keep Going

## AI Generation Contract
The app uses `POST /api/generate` and expects:

```json
{
  "flashcards": [],
  "mcqs": [],
  "summaries": []
}
```

If `OPENAI_API_KEY` is present, the API route attempts live generation with structured JSON schema output. Otherwise, it uses a deterministic fallback generator.

## Local Setup
1. Install dependencies:
```bash
npm install
```
2. Create env:
```bash
cp .env.example .env.local
```
3. Run dev server:
```bash
npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables
- `OPENAI_API_KEY` Optional for live AI generation
- `OPENAI_MODEL` Optional (default: `gpt-5-mini`)

## Deploy (Vercel)
1. Push repository to GitHub.
2. Import into Vercel.
3. Set environment variables in Vercel project settings.
4. Deploy.

## Notes
- Mobile-first layout
- Minimal interface, single-purpose pages
- Study mode always shows progress bar and one action at a time
