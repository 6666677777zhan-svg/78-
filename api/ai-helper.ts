import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// Per-IP rate limiting
const ipMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 20; // 20 requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipMap.get(ip);
  if (!record || now > record.resetTime) {
    ipMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  record.count += 1;
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || '127.0.0.1';

  // 1. Rate limiting check
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Rate limit exceeded for AI queries. Please wait 1 minute.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Request body validation & strict parameter whitelist
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid JSON request body.' });
  }

  const allowedKeys = ['prompt', 'martialSoul', 'level'];
  const bodyKeys = Object.keys(body);
  const hasExtraKeys = bodyKeys.some(k => !allowedKeys.includes(k));
  if (hasExtraKeys) {
    return res.status(400).json({ error: 'Request body contains invalid or unexpected fields.' });
  }

  const { prompt, martialSoul, level } = body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt is required and must be a non-empty string.' });
  }

  // 3. Cap size of input
  if (prompt.length > 1000) {
    return res.status(400).json({ error: 'Prompt exceeds maximum allowed length of 1000 characters.' });
  }

  // 4. Secure process.env API key access
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY environment variable is not configured on the server.',
      fallbackAdvice: `Grandmaster Advice for [${martialSoul || 'Soul Master'}] (Lv.${level || 1}): Focus on hunting high-year spirit beasts in the Great Star Dou Forest and train in the Arena to unlock Spirit Saint Avatar!`
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are Grandmaster Yu Xiaogang in Douluo Dalu (Soul Land). Provide concise, strategic advice for a Spirit Master (Martial Soul: ${martialSoul || 'Unknown'}, Level: ${level || 10}). User question: "${prompt.trim()}". Keep advice to maximum 3 sentences.`
            }
          ]
        }
      ]
    });

    const reply = response.text || 'Grandmaster is currently pondering spiritual laws.';
    return res.status(200).json({ advice: reply });
  } catch (err: any) {
    console.error('Gemini API Error:', err?.message || err);
    return res.status(500).json({
      error: 'Failed to communicate with AI Service.',
      details: err?.message || 'Unknown error'
    });
  }
}
