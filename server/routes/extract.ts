import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit } from 'express-rate-limit';
import { SYSTEM_PROMPT } from '../lib/prompt.js';

const router = Router();

// Rate limiter: relaxed for active commuting and testing (max 60 requests per minute)
const extractLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: { error: 'Naku, sandali lang! (Masyadong mabilis ang request). Pakisubukan ulit pagkalipas ng ilang segundo.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Resilient Model Cascade: If one model's quota is exhausted, auto-failover to the next available flash model
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.6-flash'
];

function getEstimatedDurationFallback(mode: string): number {
  switch (mode) {
    case 'walk': return 5;
    case 'jeep': return 20;
    case 'bus': return 25;
    case 'p2p_bus': return 35;
    case 'uv_express': return 25;
    case 'mrt':
    case 'lrt': return 15;
    case 'pnr': return 25;
    case 'tricycle': return 8;
    case 'grab': return 20;
    default: return 15;
  }
}

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
    let parsed: any = null;
    let lastError: any = null;

    // Try candidate models in cascade order
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT
        });

        const result = await model.generateContent(text);
        const responseText = result.response.text();
        
        // Clean up potential markdown code block
        const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
        parsed = JSON.parse(cleanedText);
        
        // Successfully generated and parsed JSON!
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next candidate in cascade. Reason:`, err.message?.slice(0, 120));
        // Continue loop to try next model in cascade
      }
    }

    if (!parsed) {
      if (lastError?.status === 429 || lastError?.message?.includes('429 Too Many Requests') || lastError?.message?.includes('Quota exceeded')) {
        return res.status(429).json({
          error: 'Naku, mabilis masyado! (Rate limit reached sa lahat ng free tier models). Pakihintay ng 20-30 seconds bago mag-extract ulit.'
        });
      }
      if (lastError?.message?.includes('API key not valid') || lastError?.status === 400) {
        return res.status(400).json({ error: 'Invalid Gemini API key. Please generate a valid key at aistudio.google.com/apikey and update server/.env' });
      }
      return res.status(500).json({ error: 'Failed to extract route from AI model' });
    }
    
    if (parsed.error) {
      return res.status(400).json(parsed);
    }
    
    if (!parsed.origin || !parsed.destination) {
      return res.status(500).json({ error: 'Invalid response format: missing origin or destination' });
    }

    // Normalize options, steps, fares, and durations
    let options = parsed.options;
    if (!Array.isArray(options) || options.length === 0) {
      if (Array.isArray(parsed.steps) && parsed.steps.length > 0) {
        options = [
          {
            option_id: 'opt-1',
            title: 'Ruta 1 (Recommended)',
            badge: 'Recommended',
            summary: `${parsed.origin} papuntang ${parsed.destination}`,
            total_fare_php: parsed.steps.reduce((sum: number, s: any) => sum + (s.fare_estimate_php || 0), 0),
            steps: parsed.steps,
          }
        ];
      } else {
        return res.status(500).json({ error: 'Invalid response format: no route steps or options found' });
      }
    }

    // Populate duration minutes for all options and steps
    options = options.map((opt: any, idx: number) => {
      const sanitizedSteps = (opt.steps || []).map((step: any, sIdx: number) => {
        const estDuration = step.estimated_duration_min && step.estimated_duration_min > 0
          ? step.estimated_duration_min
          : getEstimatedDurationFallback(step.mode);
        return {
          ...step,
          step_order: step.step_order || sIdx + 1,
          estimated_duration_min: estDuration,
        };
      });

      const totalDuration = opt.total_duration_min && opt.total_duration_min > 0
        ? opt.total_duration_min
        : sanitizedSteps.reduce((sum: number, s: any) => sum + (s.estimated_duration_min || 0), 0);

      const totalFare = opt.total_fare_php !== undefined && opt.total_fare_php !== null
        ? opt.total_fare_php
        : sanitizedSteps.reduce((sum: number, s: any) => sum + (s.fare_estimate_php || 0), 0);

      return {
        ...opt,
        option_id: opt.option_id || `opt-${idx + 1}`,
        total_fare_php: totalFare,
        total_duration_min: totalDuration,
        steps: sanitizedSteps,
      };
    });

    // Ensure first option's steps are available top-level for backward compatibility
    const responseData = {
      origin: parsed.origin,
      destination: parsed.destination,
      options: options,
      steps: options[0].steps,
      total_duration_min: options[0].total_duration_min,
      total_fare_php: options[0].total_fare_php,
    };

    res.json(responseData);
  } catch (error: any) {
    console.error('Extraction error:', error);
    res.status(502).json({ error: 'Failed to communicate with Google Generative AI' });
  }
});

export default router;
