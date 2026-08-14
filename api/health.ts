import type { VercelRequest, VercelResponse } from '@vercel/node';

// Per-IP rate limiting
const ipMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 60; // max 60 requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window

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

export default function handler(req: VercelRequest, res: VercelResponse) {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || '127.0.0.1';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'production',
    timestamp: Date.now()
  });
}
