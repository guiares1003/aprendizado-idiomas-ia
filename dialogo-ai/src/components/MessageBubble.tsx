import { Message } from '../types/chat';

type Props = {
  message: Message;
};

export function MessageBubble({ message }: Props) {
  return (
    <article className={`bubble bubble-${message.role}`}>
      <p>{message.text}</p>
      <small>
        {new Date(message.timestamp).toLocaleTimeString()} · {message.language} · {message.level}
      </small>
    </article>
  );
}
