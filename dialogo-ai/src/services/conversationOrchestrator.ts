import { useChatStore } from '../store/useChatStore';

export function useConversationOrchestrator() {
  const store = useChatStore();

  const submitUserTurn = async (text: string) => {
    store.setStatus('Transcrevendo');
    await store.sendUserMessage(text);
  };

  const suggestTopic = async () => {
    await store.pullTopic();
  };

  return {
    ...store,
    submitUserTurn,
    suggestTopic,
  };
}
