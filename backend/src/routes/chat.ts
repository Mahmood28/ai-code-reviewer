import { Router, Request, Response } from 'express';
import { runFollowUpChain } from '../chains/followUpChain.js';
import type { ChatRequest } from '../types.js';

const router = Router();

router.post('/', async (req: Request<object, object, ChatRequest>, res: Response) => {
  const { question, code, language, summary, history } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid `question` field.' });
  }

  try {
    const reply = await runFollowUpChain({ question, code, language, summary, history });
    res.json({ data: reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Chat failed.';
    console.error('[chat] chain error:', err);
    res.status(500).json({ error: message });
  }
});

export default router;
