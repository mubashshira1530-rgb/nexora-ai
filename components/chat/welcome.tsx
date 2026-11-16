'use client';

import { Sparkles, Lightbulb, Code, PenLine, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WelcomeProps {
  onPick: (text: string) => void;
}

const SUGGESTIONS = [
  {
    icon: Lightbulb,
    title: 'Explain a concept',
    prompt: 'Explain quantum entanglement in simple terms.',
  },
  {
    icon: Code,
    title: 'Help me code',
    prompt: 'Write a TypeScript function to debounce another function.',
  },
  {
    icon: PenLine,
    title: 'Draft something',
    prompt: 'Draft a friendly email asking my team for project updates.',
  },
  {
    icon: Compass,
    title: 'Plan a trip',
    prompt: 'Suggest a 3-day itinerary for a first visit to Tokyo.',
  },
];

export function Welcome({ onPick }: WelcomeProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="relative mb-6">
        <div className="aurora-blob absolute -inset-6 rounded-full bg-gradient-to-br from-primary/40 to-accent/30 blur-2xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-xl glow">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Welcome to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Nexora AI</span>
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        Your intelligent conversation companion. Ask anything, brainstorm ideas,
        or get help with your work.
      </p>

      <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.title}
            onClick={() => onPick(s.prompt)}
            className={cn(
              'group flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-4 text-left transition-all hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5',
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary/15">
              <s.icon className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{s.title}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {s.prompt}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
