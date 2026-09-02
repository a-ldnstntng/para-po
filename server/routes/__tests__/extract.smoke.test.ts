import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import express from 'express';
import type { Server } from 'http';

// Mock the Gemini SDK before importing the router
const mockGenerateContent = vi.fn();

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class MockGoogleGenerativeAI {
    getGenerativeModel() {
      return {
        generateContent: mockGenerateContent,
      };
    }
  },
}));

// Mock dotenv so it doesn't look for .env files
vi.mock('dotenv/config', () => ({}));

// Set a fake API key so the route handler doesn't reject
process.env.GEMINI_API_KEY = 'test-key-for-smoke';

import extractRouter from '../extract.js';

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/extract', extractRouter);

  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const addr = server.address();
      if (addr && typeof addr === 'object') {
        baseUrl = `http://localhost:${addr.port}`;
      }
      resolve();
    });
  });
});

afterAll(() => {
  server?.close();
});

describe('POST /api/extract smoke test', () => {
  it('returns a valid route with origin, destination, and at least one step', async () => {
    // Simulate what Gemini would return
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () =>
          JSON.stringify({
            origin: 'Cubao, Quezon City',
            destination: 'Kapitolyo, Pasig',
            options: [
              {
                option_id: 'opt-1',
                title: 'Ruta 1 (Recommended)',
                badge: 'Recommended',
                total_fare_php: 52,
                total_duration_min: 45,
                steps: [
                  {
                    step_order: 1,
                    mode: 'mrt',
                    line_label: 'MRT-3',
                    landmark: 'Cubao Station',
                    instruction: 'Sumakay MRT-3 mula Cubao papuntang Shaw Boulevard',
                    fare_estimate_php: 20,
                    estimated_duration_min: 15,
                    notes: null,
                  },
                  {
                    step_order: 2,
                    mode: 'walk',
                    line_label: null,
                    landmark: 'Shaw Blvd Station',
                    instruction: 'Lumabas at maglakad patungo sa kanto',
                    fare_estimate_php: 0,
                    estimated_duration_min: 3,
                    notes: null,
                  },
                  {
                    step_order: 3,
                    mode: 'jeep',
                    line_label: null,
                    landmark: 'Kapitolyo',
                    instruction: 'Sumakay jeep papuntang Kapitolyo',
                    fare_estimate_php: 13,
                    estimated_duration_min: 20,
                    notes: 'Pwede rin sumakay ng tricycle',
                  },
                ],
              },
            ],
          }),
      },
    });

    const res = await fetch(`${baseUrl}/api/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Galing Cubao, MRT to Shaw, tapos jeep pa-Kapitolyo' }),
    });

    expect(res.status).toBe(200);

    const data = await res.json();

    // Origin and destination are present
    expect(data.origin).toBe('Cubao, Quezon City');
    expect(data.destination).toBe('Kapitolyo, Pasig');

    // Has route options
    expect(data.options).toBeDefined();
    expect(data.options.length).toBeGreaterThanOrEqual(1);

    // First option has steps
    const steps = data.options[0].steps;
    expect(steps.length).toBeGreaterThanOrEqual(1);

    // Each step has the required fields
    for (const step of steps) {
      expect(step).toHaveProperty('mode');
      expect(step).toHaveProperty('instruction');
      expect(step).toHaveProperty('landmark');
      expect(step).toHaveProperty('estimated_duration_min');
    }

    // Totals are populated
    expect(typeof data.total_fare_php).toBe('number');
    expect(typeof data.total_duration_min).toBe('number');
  });

  it('returns 400 when text is missing', async () => {
    const res = await fetch(`${baseUrl}/api/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });
});
