import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import reviewRouter from './routes/review.js';
import chatRouter from './routes/chat.js';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.use('/api/review', reviewRouter);
app.use('/api/chat', chatRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
