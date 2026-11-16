'use client';

import { Menu, Trash2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  title: string;
  demoMode: boolean;
  onMenu: () => void;
  onClear: () => void;
  canClear: boolean;
}

export function ChatHeader({
  title,
  demoMode,
  onMenu,
  onClear,
  canClear,
}: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/70 px-3 backdrop-blur-xl sm:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent md:hidden">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <p className="truncate font-display text-sm font-medium text-foreground sm:text-base">
            {title || 'New conversation'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            'hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium sm:flex',
            demoMode
              ? 'bg-amber-500/15 text-amber-400'
              : 'bg-emerald-500/15 text-emerald-400',
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              demoMode ? 'bg-amber-400' : 'bg-emerald-400',
            )}
          />
          {demoMode ? 'Demo Mode' : 'Live'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={!canClear}
          className="gap-2 text-muted-foreground hover:text-destructive disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Clear chat</span>
        </Button>
      </div>
    </header>
  );
}
