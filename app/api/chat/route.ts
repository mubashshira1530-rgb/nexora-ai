import { NextRequest, NextResponse } from 'next/server';
import type { ApiRequestBody, ApiErrorBody, ApiResponseBody } from '@/lib/chat-types';
import { generateDemoReply, isDemoMode } from '@/lib/demo';

export const runtime = 'nodejs';
// Never cache AI responses.
export const dynamic = 'force-dynamic';

const OPENAI_API_URL = 'https://api.openai.com/v1/responses';

interface OpenAIResponse {
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
  output_text?: string;
  error?: { code?: string; message?: string };
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  demo: boolean,
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { error: message, code, demo },
    { status },
  );
}

function extractReply(data: OpenAIResponse): string | null {
  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }
  const textBlock = data.output?.find((o) => o.type === 'message');
  const text = textBlock?.content?.find((c) => c.type === 'output_text')?.text;
  return text && text.trim() ? text.trim() : null;
}

const FRIENDLY_ERRORS: Record<number, string> = {
  400: 'Your request was malformed. Please try rephrasing your message.',
  401: 'The OpenAI API key is missing or invalid. Demo mode is active.',
  403: 'Access to the OpenAI API was forbidden. Please check your account permissions.',
  404: 'The requested model or endpoint was not found.',
  429: 'The AI service is busy right now (rate limit). Please wait a moment and try again.',
  500: 'The AI service had a problem on its end. Please try again shortly.',
};

export async function POST(req: NextRequest) {
  let body: ApiRequestBody;
  try {
    body = (await req.json()) as ApiRequestBody;
  } catch {
    return errorResponse(400, 'bad_body', 'Invalid request body.', false);
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const recent = incoming
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-12);

  if (recent.length === 0) {
    return errorResponse(400, 'empty_messages', 'No messages to send.', false);
  }

  const lastUser = [...recent].reverse().find((m) => m.role === 'user');

  // ---- Demo mode: no key configured ----
  if (isDemoMode()) {
    if (lastUser) {
      const reply = generateDemoReply(lastUser.content);
      const resBody: ApiResponseBody = { reply, demo: true };
      // Small delay so the typing animation is visible.
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json(resBody);
    }
    return errorResponse(400, 'no_user_message', 'No user message found.', true);
  }

  // ---- Live mode: call OpenAI Responses API server-side ----
  const apiKey = process.env.OPENAI_API_KEY as string;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  // Map our history to the Responses API input format.
  const input = recent.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let openaiRes: Response;
  try {
    openaiRes = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input,
      }),
    });
  } catch {
    // Network / DNS / connection failure → fall back to demo gracefully.
    const reply = lastUser
      ? generateDemoReply(lastUser.content)
      : 'Demo mode is active because the OpenAI API could not be reached.';
    const resBody: ApiResponseBody = { reply, demo: true };
    return NextResponse.json(resBody);
  }

  // Handle known HTTP error codes.
  if (!openaiRes.ok) {
    const status = openaiRes.status;
    let parsed: OpenAIResponse | null = null;
    try {
      parsed = (await openaiRes.json()) as OpenAIResponse;
    } catch {
      parsed = null;
    }

    if (status === 429 || status >= 500) {
      // Transient failures → demo fallback so the UX stays smooth.
      const reply = lastUser
        ? generateDemoReply(lastUser.content)
        : 'Demo mode is active due to a temporary AI service issue.';
      const resBody: ApiResponseBody = { reply, demo: true };
      return NextResponse.json(resBody);
    }

    const friendly =
      FRIENDLY_ERRORS[status] ??
      `The AI service returned an unexpected error (status ${status}).`;
    const code = parsed?.error?.code || `http_${status}`;
    return errorResponse(status, code, friendly, false);
  }

  let data: OpenAIResponse;
  try {
    data = (await openaiRes.json()) as OpenAIResponse;
  } catch {
    return errorResponse(500, 'bad_response', 'Could not parse the AI response.', false);
  }

  const reply = extractReply(data);
  if (!reply) {
    return errorResponse(500, 'empty_reply', 'The AI returned an empty response.', false);
  }

  const resBody: ApiResponseBody = { reply, demo: false };
  return NextResponse.json(resBody);
}
