import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/database.js';
import extractRouter from './routes/extract.js';
import routesRouter from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/extract', extractRouter);
app.use('/api/routes', routesRouter);

// Initialize database then start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚐 PARA PO! Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
