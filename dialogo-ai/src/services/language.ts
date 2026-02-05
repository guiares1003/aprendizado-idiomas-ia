import { TargetLanguage } from '../types/chat';

const languageMap: Record<TargetLanguage, string> = {
  English: 'en-US',
  Español: 'es-ES',
  日本語: 'ja-JP',
  한국어: 'ko-KR',
  '中文 (Mandarim)': 'zh-CN',
};

export function toSpeechLang(language: TargetLanguage) {
  return languageMap[language];
}
