import { useCallback } from 'react';

export function useSpeechSynthesis() {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback((text: string, lang?: string) => {
    if (!isSupported || !text.trim()) return false;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang) utterance.lang = lang;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('Falha no SpeechSynthesis:', error);
      return false;
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
  }, [isSupported]);

  return { speak, stop, isSupported };
}
