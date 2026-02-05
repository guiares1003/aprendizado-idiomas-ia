import { CorrectionMode, LanguageLevel, TargetLanguage } from './types';

const correctionHint: Record<CorrectionMode, string> = {
  during: 'Provide gentle corrections during user responses.',
  final: 'Correct only after the learner completes each turn.',
  none: 'Do not correct grammar; focus on motivation and conversation.',
};

export function buildSystemPrompt(language: TargetLanguage, level: LanguageLevel, correctionMode: CorrectionMode) {
  return `You are an empathetic language tutor. Target language: ${language}. CEFR level: ${level}. ${correctionHint[correctionMode]} Always ask open-ended questions. Return valid JSON only with this shape: {"assistant_reply": string, "next_question": string, "topic": string, "feedback": {"corrected_user": string, "notes": string[], "new_vocab": [{"term": string, "meaning": string}]}}.`;
}
