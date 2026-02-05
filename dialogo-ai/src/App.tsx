import { useEffect, useMemo, useState } from 'react';
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
  const recognition = useSpeechRecognition();
  const synthesis = useSpeechSynthesis();
  const orchestrator = useConversationOrchestrator();

  const latestAssistantMessage = useMemo(
    () => [...orchestrator.messages].reverse().find((message) => message.role === 'assistant'),
    [orchestrator.messages]
  );

  useInactivityTimer(
    20000,
    () => {
      orchestrator.setShowInactivityPrompt(true);
    },
    [orchestrator.messages.length]
  );

  useEffect(() => {
    if (!latestAssistantMessage || lastSpokenMessageId === latestAssistantMessage.id) return;
    orchestrator.setStatus('Falando');
    synthesis.speak(latestAssistantMessage.text, toSpeechLang(orchestrator.language));
    setLastSpokenMessageId(latestAssistantMessage.id);
    window.setTimeout(() => orchestrator.setStatus('Idle'), 900);
  }, [lastSpokenMessageId, latestAssistantMessage, orchestrator, synthesis]);

  const handleStop = async () => {
    recognition.stop();
    orchestrator.setStatus('Transcrevendo');
    const text = recognition.transcript || orchestrator.inputText;
    if (text.trim()) {
      await orchestrator.submitUserTurn(text);
    }
    recognition.reset();
  };

  const handleSendTyped = async () => {
    await orchestrator.submitUserTurn(orchestrator.inputText);
    orchestrator.setInputText('');
  };

  const speakLastAssistantMessage = () => {
    if (!latestAssistantMessage) return;
    orchestrator.setStatus('Falando');
    synthesis.speak(latestAssistantMessage.text, toSpeechLang(orchestrator.language));
    setLastSpokenMessageId(latestAssistantMessage.id);
    window.setTimeout(() => orchestrator.setStatus('Idle'), 900);
  };

  return (
    <AppLayout
      header={<h1>Dialogo AI · Protótipo de voz para idiomas</h1>}
      sidebar={
        showConfig ? (
          <SettingsPanel
            language={orchestrator.language}
            level={orchestrator.level}
            correctionMode={orchestrator.correctionMode}
            aiMode={orchestrator.aiMode}
            onLanguageChange={orchestrator.setLanguage}
            onLevelChange={orchestrator.setLevel}
            onCorrectionModeChange={orchestrator.setCorrectionMode}
            onAiModeChange={orchestrator.setAiMode}
          />
        ) : null
      }
      status={
        <section className="status-row" aria-live="polite">
          <strong>Status:</strong> {orchestrator.status}
          <button aria-label="Falar última resposta" onClick={speakLastAssistantMessage}>
            Ouvir IA
          </button>
          {orchestrator.showInactivityPrompt && (
            <button aria-label="Puxar tema por inatividade" onClick={orchestrator.suggestTopic}>
              Você está aí? Quer que eu puxe um tema?
            </button>
          )}
        </section>
      }
      chat={<ChatWindow messages={orchestrator.messages} />}
      controls={
        <ControlsBar
          canUseSpeech={recognition.isSupported}
          isListening={recognition.isListening}
          inputText={orchestrator.inputText}
          onStartListening={() => {
            orchestrator.setStatus('Ouvindo');
            recognition.start(toSpeechLang(orchestrator.language));
          }}
          onStopListening={handleStop}
          onPullTopic={orchestrator.suggestTopic}
          onClear={orchestrator.clearMessages}
          onConfig={() => setShowConfig((current) => !current)}
          onInputChange={orchestrator.setInputText}
          onSendTyped={handleSendTyped}
        />
      }
      feedback={<FeedbackPanel feedback={orchestrator.latestResponse?.feedback} />}
    />
  );
}

export default App;
