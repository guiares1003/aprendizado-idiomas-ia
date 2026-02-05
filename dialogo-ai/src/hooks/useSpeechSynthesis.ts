import { useCallback } from 'react';

export function useSpeechSynthesis() {
  const speak = useCallback((text: string, lang?: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang) utterance.lang = lang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  return { speak, stop };
}
