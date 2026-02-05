import { AiResponse, ChatRequest, TargetLanguage } from '../types/chat';

const topicsByLanguage: Record<TargetLanguage, string[]> = {
  English: ['travel', 'daily routines', 'food'],
  Español: ['viajes', 'rutina diaria', 'comida'],
  日本語: ['旅行', '日常生活', '食べ物'],
  한국어: ['여행', '일상', '음식'],
  '中文 (Mandarim)': ['旅行', '日常生活', '美食'],
};

const openersByLanguage: Record<TargetLanguage, string> = {
  English: 'Great effort! Let us keep practicing.',
  Español: '¡Muy bien! Sigamos practicando.',
  日本語: 'いいですね。練習を続けましょう。',
  한국어: '좋아요. 계속 연습해 봐요.',
  '中文 (Mandarim)': '很好，我们继续练习吧。',
};

const fallbackUserText = {
  English: 'I am still thinking.',
  Español: 'Todavía estoy pensando.',
  日本語: 'まだ考えています。',
  한국어: '아직 생각 중이에요.',
  '中文 (Mandarim)': '我还在想。',
};

const wait = (min = 600, max = 1200) =>
  new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (max - min) + min)));

export async function getMockAiResponse(request: ChatRequest): Promise<AiResponse> {
  await wait();

  const lastUserMessage = [...request.messages].reverse().find((message) => message.role === 'user');
  const topicPool = topicsByLanguage[request.language];
  const topic = topicPool[Math.floor(Math.random() * topicPool.length)];
  const userText = lastUserMessage?.text ?? fallbackUserText[request.language];

  const assistant_reply = `${openersByLanguage[request.language]} (${request.level}) ${request.command === 'PULL_TOPIC' ? 'Here is a fresh topic.' : 'I understood your message'}: "${userText}"`;

  const next_question =
    request.command === 'PULL_TOPIC'
      ? `Let's talk about ${topic}. What is your personal experience with this topic?`
      : `Can you explain more details about ${topic} in ${request.language}?`;

  return {
    assistant_reply,
    next_question,
    topic,
    feedback: {
      corrected_user:
        request.correctionMode === 'none' ? userText : `${userText} ${request.correctionMode === 'during' ? '(quick correction)' : '(end correction)'}`,
      notes:
        request.correctionMode === 'none'
          ? ['No correction mode enabled.']
          : ['Try using one extra connector.', 'Keep verb tense consistent.'],
      new_vocab: [
        { term: topic, meaning: `Keyword about ${topic}` },
        { term: 'opinion', meaning: 'What you think about a topic' },
      ],
    },
  };
}
