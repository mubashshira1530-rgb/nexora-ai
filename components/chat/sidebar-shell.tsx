'use client';

import { Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function SidebarHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-5">
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent glow">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="font-display text-base font-semibold tracking-tight text-foreground">
            Nexora AI
          </p>
          <p className="text-[11px] text-muted-foreground">Intelligent Chat</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
        aria-label="Close sidebar"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export function SidebarShell({
  open,
  onClose,
  children,
}: SidebarProps & { children: React.ReactNode }) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-full w-[280px] flex-col border-r border-border bg-card/80 backdrop-blur-xl transition-transform duration-300 md:static md:z-auto md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {children}
      </aside>
    </>
  );
}
