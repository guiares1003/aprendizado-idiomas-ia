import { create } from 'zustand';
import { fetchAiResponse } from '../services/aiClient';
import { AiResponse, AppStatus, CorrectionMode, LanguageLevel, Message, TargetLanguage } from '../types/chat';

const initialLanguage: TargetLanguage = 'English';
const initialLevel: LanguageLevel = 'A1';

interface ChatState {
  messages: Message[];
  language: TargetLanguage;
  level: LanguageLevel;
  correctionMode: CorrectionMode;
  status: AppStatus;
  inputText: string;
  showInactivityPrompt: boolean;
  aiMode: 'mock' | 'real';
  latestResponse?: AiResponse;
  setLanguage: (language: TargetLanguage) => void;
  setLevel: (level: LanguageLevel) => void;
  setCorrectionMode: (mode: CorrectionMode) => void;
  setStatus: (status: AppStatus) => void;
  setInputText: (value: string) => void;
  clearMessages: () => void;
  setShowInactivityPrompt: (value: boolean) => void;
  sendUserMessage: (text: string) => Promise<void>;
  pullTopic: () => Promise<void>;
  setAiMode: (mode: 'mock' | 'real') => void;
}

const createMessage = (role: Message['role'], text: string, language: TargetLanguage, level: LanguageLevel): Message => ({
  id: crypto.randomUUID(),
  role,
  text,
  language,
  level,
  timestamp: new Date().toISOString(),
});

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [createMessage('system', 'Welcome! Start practicing whenever you are ready.', initialLanguage, initialLevel)],
  language: initialLanguage,
  level: initialLevel,
  correctionMode: 'during',
  status: 'Idle',
  inputText: '',
  showInactivityPrompt: false,
  aiMode: 'mock',
  latestResponse: undefined,
  setLanguage: (language) => set({ language }),
  setLevel: (level) => set({ level }),
  setCorrectionMode: (correctionMode) => set({ correctionMode }),
  setStatus: (status) => set({ status }),
  setInputText: (inputText) => set({ inputText }),
  setAiMode: (aiMode) => set({ aiMode }),
  setShowInactivityPrompt: (showInactivityPrompt) => set({ showInactivityPrompt }),
  clearMessages: () =>
    set((state) => ({
      messages: [createMessage('system', 'Conversation cleared. Pick a new theme.', state.language, state.level)],
      showInactivityPrompt: false,
      latestResponse: undefined,
    })),
  sendUserMessage: async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const state = get();
    const userMessage = createMessage('user', trimmed, state.language, state.level);

    set((prev) => ({
      messages: [...prev.messages, userMessage],
      inputText: '',
      status: 'Pensando',
      showInactivityPrompt: false,
    }));

    const response = await fetchAiResponse(
      {
        messages: [...get().messages],
        language: state.language,
        level: state.level,
        correctionMode: state.correctionMode,
      },
      state.aiMode
    );

    set((prev) => ({
      messages: [
        ...prev.messages,
        createMessage('assistant', response.assistant_reply, state.language, state.level),
        createMessage('assistant', response.next_question, state.language, state.level),
      ],
      status: 'Idle',
      latestResponse: response,
    }));
  },
  pullTopic: async () => {
    const state = get();
    set({ status: 'Pensando', showInactivityPrompt: false });
    const response = await fetchAiResponse(
      {
        messages: state.messages,
        language: state.language,
        level: state.level,
        correctionMode: state.correctionMode,
        command: 'PULL_TOPIC',
      },
      state.aiMode
    );

    set((prev) => ({
      messages: [
        ...prev.messages,
        createMessage('assistant', `${response.assistant_reply}\nTema: ${response.topic}`, state.language, state.level),
        createMessage('assistant', response.next_question, state.language, state.level),
      ],
      status: 'Idle',
      latestResponse: response,
    }));
  },
}));
