'use client';

import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/lib/chat-types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarHeader, SidebarShell } from './sidebar-shell';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  open: boolean;
  onClose: () => void;
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClearAll,
  open,
  onClose,
}: ChatSidebarProps) {
  return (
    <SidebarShell open={open} onClose={onClose}>
      <SidebarHeader onClose={onClose} />

      <div className="px-3 pb-3">
        <Button
          onClick={onNew}
          className="w-full justify-start gap-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] hover:shadow-primary/30"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="px-4 pb-1 pt-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Recent
        </p>
      </div>

      <ScrollArea className="flex-1 px-2 scrollbar-thin">
        <div className="space-y-1 pb-2">
          {conversations.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No conversations yet.
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Start a new chat to begin.
              </p>
            </div>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                className={cn(
                  'group relative flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors',
                  activeId === c.id
                    ? 'bg-secondary'
                    : 'hover:bg-secondary/60',
                )}
                onClick={() => onSelect(c.id)}
              >
                <MessageSquare
                  className={cn(
                    'h-4 w-4 shrink-0',
                    activeId === c.id ? 'text-primary' : 'text-muted-foreground',
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {c.title || 'New conversation'}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {formatRelative(c.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(c.id);
                  }}
                  className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/15 hover:text-destructive group-hover:opacity-100"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {conversations.length > 0 && (
        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Clear all chats
          </Button>
        </div>
      )}
    </SidebarShell>
  );
}
