# Project memory

## Product intent & audience

- **Nexora AI**: production-ready AI chatbot web app.
- Audience: end users wanting a polished conversational AI experience.
- Deployable to Vercel; frontend/backend separated.

## Brand personality & voice

- Premium, elegant, modern — "not cookie cutter".
- Clearly distinguishes live AI vs. demo mode (never fakes real AI output).

## Visual design & UX direction

- Premium **dark theme** with purple→blue gradient accents and ambient aurora glow.
- Display typography: **Space Grotesk** (font variable wired into Tailwind config).
- Layout: sidebar (chat history) + main chat area + header.
- Sidebar: "New Chat", per-conversation delete, "clear all"; on mobile slides in as overlay with backdrop.
- Welcome screen with 4 suggested-prompt cards.
- Chat bubbles: user = right-aligned gradient; AI = left-aligned card; timestamps included.
- Loading: typing animation; Send button swaps to Stop button while response in flight.
- Header: Clear chat button + Live/Demo badge; inline demo banner.
- Chat scroll: use a plain `overflow` div (Radix ScrollArea Root ref doesn't expose `scrollTo`, so avoid it for auto-scroll).
- Mobile responsive throughout.

## Decisions, constraints & rationale

- Stack: Next.js 13.5 + shadcn/ui + Tailwind + lucide-react (no extra UI/icon packages).
- API: server-side route `/api/chat` calls OpenAI **Responses API**.
- `OPENAI_API_KEY` read only from server env; never exposed to client.
- Error handling for 400/401/403/404/429/500 with friendly messages; transient failures (429/5xx/network) fall back to demo mode.
- Demo mode: clearly-labeled simulated placeholders when key is absent/unavailable.
- Chat history persisted in browser (localStorage), restored on reload.
- Next 13.5 compatibility: use `metadata.themeColor`, not `Viewport` type.
- Production build verified passing; `/api/chat` is a server lambda, main page static.

## Open questions & assumptions

- Live OpenAI path untested (no key available); demo flow + UI confirmed working.
- Assumes Responses API payload shape per current OpenAI docs (may need adjustment if API changes).