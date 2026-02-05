interface Props {
  canUseSpeech: boolean;
  isListening: boolean;
  inputText: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onPullTopic: () => void;
  onClear: () => void;
  onConfig: () => void;
  onInputChange: (value: string) => void;
  onSendTyped: () => void;
}

export function ControlsBar({
  canUseSpeech,
  isListening,
  inputText,
  onStartListening,
  onStopListening,
  onPullTopic,
  onClear,
  onConfig,
  onInputChange,
  onSendTyped,
}: Props) {
  return (
    <section className="controls-bar">
      <div className="buttons-row">
        <button aria-label="Falar" onClick={onStartListening} disabled={!canUseSpeech || isListening}>
          Falar (Push-to-talk)
        </button>
        <button aria-label="Parar" onClick={onStopListening} disabled={!canUseSpeech || !isListening}>
          Parar
        </button>
        <button aria-label="Puxar tema" onClick={onPullTopic}>
          IA: puxe um tema
        </button>
        <button aria-label="Limpar chat" onClick={onClear}>
          Limpar
        </button>
        <button aria-label="Abrir configurações" onClick={onConfig}>
          Config
        </button>
      </div>

      {!canUseSpeech && (
        <div className="manual-input">
          <input
            aria-label="Mensagem manual"
            placeholder="Seu navegador não suporta STT. Digite aqui."
            value={inputText}
            onChange={(event) => onInputChange(event.target.value)}
          />
          <button aria-label="Enviar mensagem" onClick={onSendTyped}>
            Enviar
          </button>
        </div>
      )}
    </section>
  );
}
