import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { getAiChatResponse } from './llmClient';
import { ChatRequest } from './types';

const app = express();
const port = Number(process.env.PORT ?? 8787);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/chat', async (req, res) => {
  const body = req.body as ChatRequest;
  if (!Array.isArray(body.messages)) {
    return res.status(400).json({ error: 'messages inválidas' });
  }

  const response = await getAiChatResponse(body);
  return res.json(response);
});

app.listen(port, () => {
  console.log(`dialogo-ai server listening on http://localhost:${port}`);
});
