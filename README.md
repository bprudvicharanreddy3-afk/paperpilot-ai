# PaperPilot AI

Turn uploaded PDFs into timed, graded, adaptive examinations. Next.js (App Router) · TypeScript · Tailwind v4 · Gemini · PDF.js · localStorage.

## Setup
```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY (https://aistudio.google.com/apikey)
npm run dev                  # http://localhost:3000
npm test                     # validation + scoring tests
npm run build && npm start   # production
```
Without an API key the app runs in **demo mode**: load the sample material and take the pre-generated exam. Demo results are badged "Demo"; real Gemini output is badged "AI".

## How it works
- `app/api/ai/route.ts` is the only place the Gemini key is used (server-side). `generate` builds a grounded prompt, parses JSON and runs every item through `lib/validate.ts`; `recommend` writes study advice.
- `lib/pdf.ts`: PDF.js text extraction in the browser (30 MB / 300 page / 100k char limits; scanned and password-protected PDFs are reported clearly).
- `lib/scoring.ts`: marks, negative marking, topic stats. `lib/adaptive.ts`: weak-topic and difficulty selection from recent attempts.
- Exams autosave to localStorage and resume after a reload; an expired timer auto-submits.

## Deploy (Vercel)
Import the repo, add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) under Environment Variables, deploy. Any Node 18+ host works with `npm run build && npm start`.

## Limitations
Data lives in the browser (localStorage, ~5 MB). Scanned PDFs need OCR first. AI questions are validated for structure, not factual correctness, so check the source excerpt shown with each solution.
