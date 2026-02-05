import { AiResponse, ChatRequest } from '../types/chat';
import { getMockAiResponse } from './mockAi';

function parseAiResponse(raw: unknown): AiResponse | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  if (typeof data.assistant_reply !== 'string' || typeof data.next_question !== 'string' || typeof data.topic !== 'string') {
    return null;
  }
  const feedback = data.feedback as Record<string, unknown> | undefined;
  if (!feedback || typeof feedback.corrected_user !== 'string' || !Array.isArray(feedback.notes) || !Array.isArray(feedback.new_vocab)) {
    return null;
  }
  return {
    assistant_reply: data.assistant_reply,
    next_question: data.next_question,
    topic: data.topic,
    feedback: {
      corrected_user: feedback.corrected_user,
      notes: feedback.notes.filter((item): item is string => typeof item === 'string'),
      new_vocab: feedback.new_vocab
        .map((entry) => {
          const value = entry as Record<string, unknown>;
          if (typeof value.term === 'string' && typeof value.meaning === 'string') {
            return { term: value.term, meaning: value.meaning };
          }
          return null;
        })
        .filter((entry): entry is { term: string; meaning: string } => entry !== null),
    },
  };
}

export async function fetchAiResponse(request: ChatRequest, mode: 'mock' | 'real' = 'mock'): Promise<AiResponse> {
  if (mode === 'mock') {
    return getMockAiResponse(request);
  }

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const data = await response.json();
    const validated = parseAiResponse(data);
    if (validated) return validated;
  } catch (error) {
    console.error('Erro ao chamar /api/chat', error);
  }

  return {
    assistant_reply: 'Não consegui processar agora. Vamos tentar novamente?',
    next_question: 'Qual tema você quer praticar?',
    topic: 'fallback',
    feedback: {
      corrected_user: '',
      notes: ['Resposta de fallback por erro de integração.'],
      new_vocab: [],
    },
  };
}
