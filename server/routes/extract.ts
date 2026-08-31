import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit } from 'express-rate-limit';
import { SYSTEM_PROMPT } from '../lib/prompt.js';

const router = Router();

// Rate limiter: max 10 route extraction calls per minute per IP address
const extractLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Too many route extraction requests. Please wait a minute before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', extractLimiter, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Missing text in request body' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
      return res.status(400).json({
        error: 'Missing GEMINI_API_KEY in server/.env. Please paste your key from aistudio.google.com/apikey into server/.env'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: SYSTEM_PROMPT
    });

    const result = await model.generateContent(text);
    const responseText = result.response.text();
    
    // Clean up potential markdown code block
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    
    const parsed = JSON.parse(cleanedText);
    
    if (parsed.error) {
      return res.status(400).json(parsed);
    }
    
    if (!parsed.origin || !parsed.destination || !Array.isArray(parsed.steps)) {
      return res.status(500).json({ error: 'Invalid response format from model' });
    }

    res.json(parsed);
  } catch (error: any) {
    console.error('Extraction error:', error);
    if (error?.status === 429 || error?.message?.includes('429 Too Many Requests') || error?.message?.includes('Quota exceeded')) {
      return res.status(429).json({
        error: 'Naku, mabilis masyado! (Rate limit reached: 15 req/min on free tier). Pakihintay ng 15-30 seconds bago mag-extract ulit.'
      });
    }
    if (error?.message?.includes('API key not valid') || error?.status === 400) {
      return res.status(400).json({ error: 'Invalid Gemini API key. Please generate a valid key at aistudio.google.com/apikey and update server/.env' });
    }
    if (error instanceof SyntaxError) {
      return res.status(500).json({ error: 'Failed to parse JSON response from model' });
    }
    res.status(502).json({ error: 'Failed to communicate with Google Generative AI' });
  }
});

export default router;
