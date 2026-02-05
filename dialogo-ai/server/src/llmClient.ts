import { buildSystemPrompt } from './prompting';
import { mockLLM } from './mockLLM';
import { AiResponse, ChatRequest } from './types';

function validateAiResponse(data: unknown): data is AiResponse {
  if (!data || typeof data !== 'object') return false;
  const v = data as Record<string, unknown>;
  const feedback = v.feedback as Record<string, unknown>;
  return (
    typeof v.assistant_reply === 'string' &&
    typeof v.next_question === 'string' &&
    typeof v.topic === 'string' &&
    !!feedback &&
    typeof feedback.corrected_user === 'string' &&
    Array.isArray(feedback.notes) &&
    Array.isArray(feedback.new_vocab)
  );
}

export async function getAiChatResponse(request: ChatRequest): Promise<AiResponse> {
  const apiKey = process.env.LLM_API_KEY;
  const systemPrompt = buildSystemPrompt(request.language, request.level, request.correctionMode);

  if (!apiKey) {
    return mockLLM(request);
  }

  // Placeholder plugável: substitua por SDK real (OpenAI/Anthropic/etc).
  const mockedRaw = {
    assistant_reply: `System prompt loaded (${systemPrompt.length} chars).`,
    next_question: 'What would you like to practice next?',
    topic: 'placeholder',
    feedback: {
      corrected_user: '',
      notes: ['LLM SDK placeholder in use.'],
      new_vocab: [],
    },
  };

  if (validateAiResponse(mockedRaw)) return mockedRaw;

  return {
    assistant_reply: 'Sorry, I could not format the answer correctly this time.',
    next_question: 'Can we retry with another short answer?',
    topic: 'error-handling',
    feedback: {
      corrected_user: '',
      notes: ['Invalid JSON from provider. Using fallback response.'],
      new_vocab: [],
    },
  };
}
