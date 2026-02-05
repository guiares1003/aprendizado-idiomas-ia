import { Message } from '../types/chat';
import { MessageBubble } from './MessageBubble';

type Props = {
  messages: Message[];
};

export function ChatWindow({ messages }: Props) {
  return (
    <section className="chat-window" aria-label="Histórico do chat">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </section>
  );
}
