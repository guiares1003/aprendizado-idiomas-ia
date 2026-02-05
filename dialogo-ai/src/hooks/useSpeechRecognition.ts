import { useCallback, useMemo, useRef, useState } from 'react';

type RecognitionState = {
  transcript: string;
  isSupported: boolean;
  isListening: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
};

export function useSpeechRecognition(): RecognitionState {
  const SpeechRecognition = useMemo(
    () => window.SpeechRecognition || (window as typeof window & { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition,
    []
  );
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  const isSupported = Boolean(SpeechRecognition);

  const createRecognition = useCallback(() => {
    if (!SpeechRecognition) return null;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ');
      setTranscript(text.trim());
    };
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    return recognition;
  }, [SpeechRecognition]);

  const start = useCallback(() => {
    if (!isSupported) return;
    if (!recognitionRef.current) {
      recognitionRef.current = createRecognition();
    }
    recognitionRef.current?.start();
  }, [createRecognition, isSupported]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const reset = useCallback(() => setTranscript(''), []);

  return { transcript, isSupported, isListening, start, stop, reset };
}
