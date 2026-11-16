'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Conversation, ChatMessage } from '@/lib/chat-types';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessageBubble, TypingIndicator } from '@/components/chat/chat-message';
import { ChatInput } from '@/components/chat/chat-input';
import { Welcome } from '@/components/chat/welcome';
import { DemoBanner } from '@/components/chat/demo-banner';

const STORAGE_KEY = 'nexora:conversations:v1';

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function deriveTitle(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (!trimmed) return 'New conversation';
  return trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed;
}

function loadConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    const loaded = loadConversations();
    setConversations(loaded);
    if (loaded.length > 0) {
      setActiveId(loaded[0].id);
    }
    setHydrated(true);
  }, []);

  // Persist whenever conversations change.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      /* storage may be full or unavailable */
    }
  }, [conversations, hydrated]);

  const activeConversation =
    conversations.find((c) => c.id === activeId) ?? null;

  // Auto-scroll to bottom on new messages / typing.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [activeConversation?.messages, isStreaming]);

  const updateConversation = useCallback(
    (id: string, updater: (c: Conversation) => Conversation) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? updater(c) : c)),
      );
    },
    [],
  );

  const handleNewChat = useCallback(() => {
    // If there's already an empty conversation, just switch to it.
    const empty = conversations.find((c) => c.messages.length === 0);
    if (empty) {
      setActiveId(empty.id);
      setSidebarOpen(false);
      return;
    }
    const newConv: Conversation = {
      id: uid(),
      title: 'New conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
    setSidebarOpen(false);
  }, [conversations]);

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    setSidebarOpen(false);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (activeId === id) {
          setActiveId(next.length > 0 ? next[0].id : null);
        }
        return next;
      });
    },
    [activeId],
  );

  const handleClearAll = useCallback(() => {
    setConversations([]);
    setActiveId(null);
    toast({ title: 'All chats cleared' });
  }, [toast]);

  const handleClearCurrent = useCallback(() => {
    if (!activeConversation) return;
    updateConversation(activeConversation.id, (c) => ({
      ...c,
      messages: [],
      title: 'New conversation',
      updatedAt: Date.now(),
    }));
    toast({ title: 'Chat cleared' });
  }, [activeConversation, updateConversation, toast]);

  const sendMessage = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || isStreaming) return;

      // Ensure we have an active conversation.
      let convId = activeId;
      if (!convId) {
        convId = uid();
        const newConv: Conversation = {
          id: convId,
          title: deriveTitle(content),
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveId(convId);
      }

      const userMsg: ChatMessage = {
        id: uid(),
        role: 'user',
        content,
        createdAt: Date.now(),
      };

      const historyForApi: { role: 'user' | 'assistant'; content: string }[] = [];

      updateConversation(convId, (c) => {
        const updatedMessages = [...c.messages, userMsg];
        historyForApi.push(
          ...updatedMessages
            .filter((m) => !m.isError)
            .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        );
        return {
          ...c,
          title: c.messages.length === 0 ? deriveTitle(content) : c.title,
          messages: updatedMessages,
          updatedAt: Date.now(),
        };
      });

      setInput('');
      setIsStreaming(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: historyForApi }),
        });

        const data = await res.json();

        if (!res.ok) {
          const errorMsg: ChatMessage = {
            id: uid(),
            role: 'assistant',
            content:
              data?.error ??
              'Something went wrong. Please try again in a moment.',
            createdAt: Date.now(),
            isError: true,
          };
          updateConversation(convId, (c) => ({
            ...c,
            messages: [...c.messages, errorMsg],
            updatedAt: Date.now(),
          }));
          setDemoMode(Boolean(data?.demo));
          return;
        }

        const reply: ChatMessage = {
          id: uid(),
          role: 'assistant',
          content: data.reply,
          createdAt: Date.now(),
        };
        setDemoMode(Boolean(data?.demo));
        updateConversation(convId, (c) => ({
          ...c,
          messages: [...c.messages, reply],
          updatedAt: Date.now(),
        }));
      } catch {
        const errorMsg: ChatMessage = {
          id: uid(),
          role: 'assistant',
          content:
            'Could not reach the server. Please check your connection and try again.',
          createdAt: Date.now(),
          isError: true,
        };
        updateConversation(convId, (c) => ({
          ...c,
          messages: [...c.messages, errorMsg],
          updatedAt: Date.now(),
        }));
      } finally {
        setIsStreaming(false);
      }
    },
    [activeId, isStreaming, updateConversation],
  );

  const handleStop = useCallback(() => {
    setIsStreaming(false);
    toast({ title: 'Generation stopped' });
  }, [toast]);

  const messages = activeConversation?.messages ?? [];
  const showWelcome = messages.length === 0 && !isStreaming;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground">
      {/* Ambient gradient backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="aurora-blob absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
        <div
          className="aurora-blob absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-accent/15 blur-[120px]"
          style={{ animationDelay: '-4s' }}
        />
        <div
          className="aurora-blob absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-primary/10 blur-[120px]"
          style={{ animationDelay: '-8s' }}
        />
      </div>

      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        onNew={handleNewChat}
        onDelete={handleDelete}
        onClearAll={handleClearAll}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          title={activeConversation?.title ?? 'New conversation'}
          demoMode={demoMode}
          onMenu={() => setSidebarOpen(true)}
          onClear={handleClearCurrent}
          canClear={messages.length > 0}
        />

        <div className="relative flex flex-1 flex-col overflow-hidden">
          {showWelcome ? (
            <Welcome onPick={(text) => sendMessage(text)} />
          ) : (
            <>
              <DemoBanner visible={demoMode} />
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto scrollbar-thin"
              >
                <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
                  {messages.map((m) => (
                    <ChatMessageBubble key={m.id} message={m} />
                  ))}
                  {isStreaming && <TypingIndicator />}
                </div>
              </div>
            </>
          )}

          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={() => sendMessage(input)}
            onStop={handleStop}
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </div>
  );
}
