'use client';

import { User, Sparkles, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/chat-types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div
      className={cn(
        'msg-in flex w-full gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-md',
          isUser
            ? 'bg-secondary text-foreground'
            : isError
              ? 'bg-destructive/20 text-destructive'
              : 'bg-gradient-to-br from-primary to-accent text-white',
        )}
      >
        {isUser ? (
          <User className="h-4.5 w-4.5" />
        ) : isError ? (
          <AlertTriangle className="h-4.5 w-4.5" />
        ) : (
          <Sparkles className="h-4.5 w-4.5" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'flex max-w-[78%] flex-col gap-1',
          isUser ? 'items-end' : 'items-start',
        )}
      >
        <div
          className={cn(
            'whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
          isUser
            ? 'rounded-tr-md bg-gradient-to-br from-primary/90 to-accent/90 text-white'
            : isError
              ? 'rounded-tl-md border border-destructive/30 bg-destructive/10 text-destructive'
              : 'rounded-tl-md border border-border bg-card text-card-foreground',
          )}
        >
          {message.content}
        </div>
        <span className="px-1 text-[10px] text-muted-foreground">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="msg-in flex w-full gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md">
        <Sparkles className="h-4.5 w-4.5" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-border bg-card px-4 py-4">
        <span className="typing-dot h-2 w-2 rounded-full bg-primary" />
        <span className="typing-dot h-2 w-2 rounded-full bg-primary" />
        <span className="typing-dot h-2 w-2 rounded-full bg-primary" />
      </div>
    </div>
  );
}
