import { useEffect, useMemo, useRef, useState } from 'react';
import { AppLayout } from './components/AppLayout';
import { ChatWindow } from './components/ChatWindow';
import { ControlsBar } from './components/ControlsBar';
import { FeedbackPanel } from './components/FeedbackPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { useInactivityTimer } from './hooks/useInactivityTimer';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { toSpeechLang } from './services/language';
import { useConversationOrchestrator } from './services/conversationOrchestrator';
import './styles/app.css';

function App() {
  const [showConfig, setShowConfig] = useState(true);
  const [lastSpokenMessageId, setLastSpokenMessageId] = useState<string | null>(null);
  const statusTimerRef = useRef<number | null>(null);
  const recognition = useSpeechRecognition();
  const synthesis = useSpeechSynthesis();
  const orchestrator = useConversationOrchestrator();

  const {
    messages,
    language,
    level,
    correctionMode,
    aiMode,
    status,
    inputText,
    showInactivityPrompt,
    latestResponse,
    setLanguage,
    setLevel,
    setCorrectionMode,
    setAiMode,
    setStatus,
    setShowInactivityPrompt,
    setInputText,
    clearMessages,
    suggestTopic,
    submitUserTurn,
  } = orchestrator;

  const latestAssistantMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === 'assistant'),
    [messages]
  );

  useInactivityTimer(
    20000,
    () => {
      setShowInactivityPrompt(true);
    },
    [messages.length]
  );

  useEffect(() => {
    return () => {
      if (statusTimerRef.current) window.clearTimeout(statusTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!latestAssistantMessage || lastSpokenMessageId === latestAssistantMessage.id) return;
    setStatus('Falando');
    synthesis.speak(latestAssistantMessage.text, toSpeechLang(language));
    setLastSpokenMessageId(latestAssistantMessage.id);
    if (statusTimerRef.current) window.clearTimeout(statusTimerRef.current);
    statusTimerRef.current = window.setTimeout(() => setStatus('Idle'), 900);
  }, [language, lastSpokenMessageId, latestAssistantMessage, setStatus, synthesis]);

  const handleStop = async () => {
    recognition.stop();
    setStatus('Transcrevendo');
    const text = recognition.transcript || inputText;
    if (text.trim()) {
      await submitUserTurn(text);
    }
    recognition.reset();
  };

  const handleSendTyped = async () => {
    await submitUserTurn(inputText);
    setInputText('');
  };

  const speakLastAssistantMessage = () => {
    if (!latestAssistantMessage) return;
    setStatus('Falando');
    synthesis.speak(latestAssistantMessage.text, toSpeechLang(language));
    setLastSpokenMessageId(latestAssistantMessage.id);
    if (statusTimerRef.current) window.clearTimeout(statusTimerRef.current);
    statusTimerRef.current = window.setTimeout(() => setStatus('Idle'), 900);
  };

  return (
    <AppLayout
      header={<h1>Dialogo AI · Protótipo de voz para idiomas</h1>}
      sidebar={
        showConfig ? (
          <SettingsPanel
            language={language}
            level={level}
            correctionMode={correctionMode}
            aiMode={aiMode}
            onLanguageChange={setLanguage}
            onLevelChange={setLevel}
            onCorrectionModeChange={setCorrectionMode}
            onAiModeChange={setAiMode}
          />
        ) : null
      }
      status={
        <section className="status-row" aria-live="polite">
          <strong>Status:</strong> {status}
          <button aria-label="Falar última resposta" onClick={speakLastAssistantMessage} disabled={!synthesis.isSupported}>
            Ouvir IA
          </button>
          {showInactivityPrompt && (
            <button aria-label="Puxar tema por inatividade" onClick={suggestTopic}>
              Você está aí? Quer que eu puxe um tema?
            </button>
          )}
        </section>
      }
      chat={<ChatWindow messages={messages} />}
      controls={
        <ControlsBar
          canUseSpeech={recognition.isSupported}
          isListening={recognition.isListening}
          inputText={inputText}
          onStartListening={() => {
            setStatus('Ouvindo');
            recognition.start(toSpeechLang(language));
          }}
          onStopListening={handleStop}
          onPullTopic={suggestTopic}
          onClear={clearMessages}
          onConfig={() => setShowConfig((current) => !current)}
          onInputChange={setInputText}
          onSendTyped={handleSendTyped}
        />
      }
      feedback={<FeedbackPanel feedback={latestResponse?.feedback} />}
    />
  );
}

export default App;
