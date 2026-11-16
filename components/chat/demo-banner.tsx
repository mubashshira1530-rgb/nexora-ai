'use client';

import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DemoBanner({ visible }: { visible: boolean }) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-3xl overflow-hidden px-4 transition-all duration-300',
        visible ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0',
      )}
    >
      <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-amber-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p className="text-xs leading-relaxed">
          <span className="font-semibold">Demo mode is active.</span> Replies are
          simulated placeholders, not real AI responses. Add an{' '}
          <code className="rounded bg-amber-500/20 px-1 py-0.5 text-[11px]">
            OPENAI_API_KEY
          </code>{' '}
          environment variable on the server to enable live answers.
        </p>
      </div>
    </div>
  );
}
