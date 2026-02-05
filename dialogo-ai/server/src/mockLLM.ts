import { AiResponse, ChatRequest } from './types';

export async function mockLLM(request: ChatRequest): Promise<AiResponse> {
  const lastUser = [...request.messages].reverse().find((item) => item.role === 'user');
  const text = lastUser?.text ?? 'Ready to practice.';
  const topic = request.command === 'PULL_TOPIC' ? 'daily life' : 'self introduction';

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    assistant_reply: `Thanks for sharing: "${text}".`,
    next_question: `Can you tell me more about ${topic}?`,
    topic,
    feedback: {
      corrected_user: request.correctionMode === 'none' ? text : `${text} (corrected sample)`,
      notes: ['Use one longer sentence.', 'Add one personal detail.'],
      new_vocab: [
        { term: 'routine', meaning: 'things you do every day' },
        { term: 'improve', meaning: 'to get better' },
      ],
    },
  };
}
