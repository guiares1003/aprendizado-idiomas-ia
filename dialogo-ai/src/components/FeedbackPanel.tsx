import { AiResponse } from '../types/chat';

type Props = {
  feedback?: AiResponse['feedback'];
};

export function FeedbackPanel({ feedback }: Props) {
  if (!feedback) return null;

  return (
    <aside className="feedback-panel" aria-label="Painel de feedback">
      <h3>Feedback</h3>
      <p>
        <strong>Correção:</strong> {feedback.corrected_user || '—'}
      </p>
      <ul>
        {feedback.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <div>
        {feedback.new_vocab.map((word) => (
          <p key={word.term}>
            <strong>{word.term}</strong>: {word.meaning}
          </p>
        ))}
      </div>
    </aside>
  );
}
