import type { VercelRequest, VercelResponse } from '@vercel/node';

// Per-IP Rate Limiting
const ipMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW = 60 * 1000;

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

const DEFAULT_LEADERBOARD = {
  topPvp: [
    { rank: 1, id: 'bot_tangwulin', name: 'Tang Wulin', title: 'Dragon Emperor Douluo', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', martialSoulName: 'Golden Dragon King', level: 99, battlePower: 1680000, pvpPoints: 3120, pvpWins: 230, winRate: 97, godPosition: 'Dual Gods · Sea God & Asura', battleArmorRank: 'five_word' },
    { rank: 2, id: 'bot_tanghao', name: 'Tang Hao', title: 'Clear Sky Douluo', avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80', martialSoulName: 'Clear Sky Hammer', level: 97, battlePower: 1120000, pvpPoints: 2650, pvpWins: 180, winRate: 93, godPosition: null, battleArmorRank: 'five_word' },
    { rank: 3, id: 'bot_chenxin', name: 'Chen Xin', title: 'Sword Douluo', avatarUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80', martialSoulName: 'Seven Kill Sword', level: 97, battlePower: 985000, pvpPoints: 2480, pvpWins: 142, winRate: 88, godPosition: null, battleArmorRank: 'four_word' }
  ],
  topPower: [
    { rank: 1, id: 'bot_tangwulin', name: 'Tang Wulin', title: 'Dragon Emperor Douluo', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', martialSoulName: 'Golden Dragon King', level: 99, battlePower: 1680000, pvpPoints: 3120, pvpWins: 230, winRate: 97, godPosition: 'Dual Gods · Sea God & Asura', battleArmorRank: 'five_word' },
    { rank: 2, id: 'bot_tanghao', name: 'Tang Hao', title: 'Clear Sky Douluo', avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80', martialSoulName: 'Clear Sky Hammer', level: 97, battlePower: 1120000, pvpPoints: 2650, pvpWins: 180, winRate: 93, godPosition: null, battleArmorRank: 'five_word' }
  ],
  topRaid: [
    { rank: 1, teamName: 'Shrek Seven Monsters Vanguard', bossName: 'Deep Sea Demon Whale King · Million-Yr', totalDamage: 9980000, leaderName: 'Tang San', clearedAt: 'Today 14:32' },
    { rank: 2, teamName: 'Seven Treasure Godslayer Array', bossName: 'Evil Eye Tyrant Dominator · 700k-Yr', totalDamage: 8540000, leaderName: 'Chen Xin', clearedAt: 'Today 12:10' }
  ]
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || '127.0.0.1';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please wait a minute.' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json(DEFAULT_LEADERBOARD);
}
