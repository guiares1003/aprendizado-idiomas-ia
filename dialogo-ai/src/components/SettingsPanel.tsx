import { CorrectionMode, LanguageLevel, TargetLanguage } from '../types/chat';

const languages: TargetLanguage[] = ['English', 'Español', '日本語', '한국어', '中文 (Mandarim)'];
const levels: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2'];

interface Props {
  language: TargetLanguage;
  level: LanguageLevel;
  correctionMode: CorrectionMode;
  aiMode: 'mock' | 'real';
  onLanguageChange: (value: TargetLanguage) => void;
  onLevelChange: (value: LanguageLevel) => void;
  onCorrectionModeChange: (value: CorrectionMode) => void;
  onAiModeChange: (value: 'mock' | 'real') => void;
}

export function SettingsPanel({
  language,
  level,
  correctionMode,
  aiMode,
  onLanguageChange,
  onLevelChange,
  onCorrectionModeChange,
  onAiModeChange,
}: Props) {
  return (
    <section className="settings-panel">
      <label>
        Idioma alvo
        <select value={language} onChange={(event) => onLanguageChange(event.target.value as TargetLanguage)}>
          {languages.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label>
        Nível
        <select value={level} onChange={(event) => onLevelChange(event.target.value as LanguageLevel)}>
          {levels.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label>
        Correção
        <select value={correctionMode} onChange={(event) => onCorrectionModeChange(event.target.value as CorrectionMode)}>
          <option value="during">Corrigir durante</option>
          <option value="final">Corrigir no final</option>
          <option value="none">Sem correção</option>
        </select>
      </label>

      <label>
        Modo IA
        <select value={aiMode} onChange={(event) => onAiModeChange(event.target.value as 'mock' | 'real')}>
          <option value="mock">Mock</option>
          <option value="real">Real (backend)</option>
        </select>
      </label>
    </section>
  );
}
