# Nexora AI

A modern, responsive AI chatbot web application with a premium dark theme,
elegant purple and blue accents, and a clean, production-ready interface.

## Features

- **Premium dark UI** with purple/blue gradient accents and ambient aurora glow.
- **Sidebar chat history** — conversations are saved locally in your browser and
  persist across reloads.
- **Welcome screen** with suggested prompts to get started instantly.
- **Message bubbles** — separate styles for user and AI messages.
- **Typing animation** while waiting for a response.
- **Clear chat** and **delete conversation** controls.
- **Demo mode** — when no OpenAI key is configured, the app shows clearly-labeled
  simulated placeholder responses so the full interface is usable without a key.
  Demo responses are never presented as real AI output.
- **Secure server-side API** — the OpenAI key is read only from a server
  environment variable and is never exposed to the frontend.
- **Comprehensive error handling** for 400, 401, 403, 404, 429, and 500 errors.
- **Mobile responsive** — collapsible sidebar with backdrop, adaptive layout.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables (optional — demo mode works without them)

Copy the example file and add your OpenAI API key:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```bash
OPENAI_API_KEY=sk-your-key-here
# optional:
OPENAI_MODEL=gpt-4o-mini
```

### 3. Run the dev server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build && npm start
```

## Deploy to Vercel

1. Push to a Git repository.
2. Import at https://vercel.com/new.
3. Add `OPENAI_API_KEY` under Project → Settings → Environment Variables.
4. Deploy.

## How it works

- **Frontend** (`app/page.tsx`, `components/chat/*`): React UI with local state
  and `localStorage` persistence for chat history.
- **Backend** (`app/api/chat/route.ts`): a Next.js Route Handler that calls the
  OpenAI **Responses API** server-side, reads the key only from
  `process.env.OPENAI_API_KEY`, and returns structured JSON.
- **Demo fallback** (`lib/demo.ts`): generates clearly-labeled placeholder
  replies when the key is missing or the API is unreachable.
