# dialogo-ai

Protótipo MVP de conversação por voz com IA para aprendizado de idiomas (React + Vite + TypeScript).

## O que está implementado

- Chat com bolhas para `user`, `assistant`, `system`.
- Seletor de idioma alvo: English, Español, 日本語, 한국어, 中文 (Mandarim).
- Seletor de nível: A1, A2, B1, B2.
- Modo de correção: durante, final, sem correção.
- Botões: **Falar (Push-to-talk)**, **Parar**, **IA: puxe um tema**, **Limpar**, **Config**.
- Status visual: `Idle`, `Ouvindo`, `Transcrevendo`, `Pensando`, `Falando`.
- STT no navegador (Web Speech API) com push-to-talk e campo de digitação sempre disponível.
- TTS no navegador (SpeechSynthesis) com reprodução no idioma selecionado e botão **Ouvir IA**.
- Timer de inatividade (20s) com CTA: "Você está aí? Quer que eu puxe um tema?".
- Orquestrador de conversa para turnos e comando `PULL_TOPIC`.
- Persistência em memória de mensagens tipadas com `role`, `text`, `timestamp`, `language`, `level`.
- Modo Mock padrão (`src/services/mockAi.ts`) com latência simulada entre 600–1200ms.
- Modo Real opcional via `POST /api/chat` no backend `/server`.

## Estrutura

- Frontend: `src/`
  - Componentes: `AppLayout`, `ChatWindow`, `MessageBubble`, `ControlsBar`, `SettingsPanel`, `FeedbackPanel`
  - Hooks: `useSpeechRecognition`, `useSpeechSynthesis`, `useInactivityTimer`
  - Store Zustand: `src/store/useChatStore.ts`
  - Orquestrador: `src/services/conversationOrchestrator.ts`
- Backend: `server/`
  - Express + TypeScript
  - Endpoint `POST /api/chat`
  - Prompt builder `buildSystemPrompt(...)`
  - Validação de JSON e fallback amigável
  - Implementação plugável para LLM com fallback mock quando sem chave

## Como rodar

> Entre na pasta `dialogo-ai` antes dos comandos.

```bash
npm install
npm run dev
```

Frontend em modo mock por padrão: `http://localhost:5173`

### Backend opcional

```bash
npm install
npm run dev:server
```

Servidor: `http://localhost:8787`

### Front + Server juntos

```bash
npm install
npm run dev:full
```

## Variáveis de ambiente do backend

Copie `server/.env.example` para `server/.env`:

```env
PORT=8787
LLM_API_KEY=
```

Se `LLM_API_KEY` estiver vazio, backend continua funcional usando mock.

## Fluxo de uso (demo)

1. Selecione idioma, nível e modo de correção.
2. Clique **Falar (Push-to-talk)** para iniciar captação de voz.
3. Clique **Parar** para encerrar, transcrever e enviar.
4. A IA responde (`assistant_reply`) + pergunta seguinte (`next_question`) e também pode ser ouvida no idioma alvo.
5. Veja feedback em painel lateral (notas e vocabulário).
6. Clique **IA: puxe um tema** para receber novo tema + pergunta aberta.

## Limitações conhecidas

- Suporte de STT depende do navegador e permissões de microfone.
- Voz sintetizada usa vozes disponíveis no sistema do usuário.
- Sem banco de dados (histórico só em memória da sessão).
- Cliente de LLM real no backend está com placeholder plugável.

## Screenshot

Screenshot pendente de execução local. Gere após subir com `npm run dev`.
