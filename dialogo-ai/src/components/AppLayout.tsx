import { ReactNode } from 'react';

type Props = {
  header: ReactNode;
  sidebar: ReactNode;
  chat: ReactNode;
  controls: ReactNode;
  status: ReactNode;
  feedback: ReactNode;
};

export function AppLayout({ header, sidebar, chat, controls, status, feedback }: Props) {
  return (
    <main className="app-layout">
      <header>{header}</header>
      <section className="content-grid">
        <div>{sidebar}</div>
        <div className="chat-column">
          {status}
          {chat}
          {controls}
        </div>
        <div>{feedback}</div>
      </section>
    </main>
  );
}
