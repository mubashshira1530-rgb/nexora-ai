export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface ApiRequestBody {
  messages: { role: ChatRole; content: string }[];
}

export interface ApiResponseBody {
  reply: string;
  demo: boolean;
}

export interface ApiErrorBody {
  error: string;
  code: string;
  demo: boolean;
}
