export type MessageRole = 'user' | 'assistant' | 'system';

export type TargetLanguage = 'English' | 'Español' | '日本語' | '한국어' | '中文 (Mandarim)';

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type CorrectionMode = 'during' | 'final' | 'none';

export type AppStatus = 'Idle' | 'Ouvindo' | 'Transcrevendo' | 'Pensando' | 'Falando';

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: string;
  language: TargetLanguage;
  level: LanguageLevel;
}

export interface FeedbackItem {
  corrected_user: string;
  notes: string[];
  new_vocab: { term: string; meaning: string }[];
}

export interface AiResponse {
  assistant_reply: string;
  next_question: string;
  topic: string;
  feedback: FeedbackItem;
}

export interface ChatRequest {
  messages: Message[];
  language: TargetLanguage;
  level: LanguageLevel;
  correctionMode: CorrectionMode;
  command?: 'PULL_TOPIC';
}
