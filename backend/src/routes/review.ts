import { Router, Request, Response } from 'express';
import { runReviewChain } from '../chains/reviewChain.js';
import type { ReviewRequest } from '../types.js';

const router = Router();

router.post('/', async (req: Request<object, object, ReviewRequest>, res: Response) => {
  const { code, language } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid `code` field.' });
  }
  if (!language || typeof language !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid `language` field.' });
  }

  try {
    const review = await runReviewChain({ code, language });
    res.json({ data: review });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Review failed.';
    console.error('[review] chain error:', err);
    res.status(500).json({ error: message });
  }
});

export default router;
