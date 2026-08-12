import express from 'express';
import http from 'http';
import path from 'path';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import {
  OnlinePlayerProfile,
  ChatMessage,
  PvpRoomState,
  PvpFighterState,
  PvpActionRequest,
  PvpCombatLogEntry,
  DirectDuelChallenge,
  CoopRoomState,
  CoopBossState,
  CoopMemberState,
  GlobalLeaderboardData,
  LeaderboardUser
} from './src/types/multiplayer';

const PORT = 3000;
const app = express();
app.use(express.json());

const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  pingTimeout: 30000,
  pingInterval: 10000
});

// ================= GLOBAL IN-MEMORY SERVER STATE =================
const onlinePlayers = new Map<string, OnlinePlayerProfile>(); // socketId -> Profile
const pvpRooms = new Map<string, PvpRoomState>(); // roomId -> Room
const coopRooms = new Map<string, CoopRoomState>(); // roomId -> CoopRoom
const activeChallenges = new Map<string, DirectDuelChallenge>(); // challengeId -> Challenge
const matchmakingQueue: { socketId: string; player: OnlinePlayerProfile; joinedAt: number }[] = [];

// Initial Global Chat History
let globalChatMessages: ChatMessage[] = [
  {
    id: 'sys_1',
    senderId: 'system',
    senderName: 'Heaven Dou Voice Pavilion',
    senderTitle: 'Server Broadcast',
    senderAvatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80',
    channel: 'world',
    text: '🎉 Welcome to the Soul Master Chronicles Cross-Server Lobby! Real-time PVP ladder tournaments and co-op raids against 100k-yr spirit beasts are now open!',
    timestamp: Date.now() - 3600000,
    isSystem: true,
    tag: '[System Notice]'
  },
  {
    id: 'sys_2',
    senderId: 'ai_chenxin',
    senderName: 'Sword Douluo Chen Xin',
    senderTitle: 'Supreme Sword Saint · Titled Douluo',
    senderAvatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80',
    senderSoul: 'Seven Kill Sword',
    channel: 'world',
    text: 'When my Seven Kill Sword unsheathes, none in the realm can match it! Are there fellow Titled Douluos ready to spar for ten rounds?',
    timestamp: Date.now() - 1800000,
    tag: '[Titled Douluo]'
  },
  {
    id: 'sys_3',
    senderId: 'ai_tanghao',
    senderName: 'Tang Hao',
    senderTitle: 'Clear Sky Douluo',
    senderAvatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
    senderSoul: 'Clear Sky Hammer',
    channel: 'world',
    text: 'Great Sumeru Hammer secret art mastered. Need 2 Attack & Support Titled Douluos for [Million-Yr Deep Sea Demon Whale King] raid!',
    timestamp: Date.now() - 900000,
    tag: '[Raid Recruit]'
  }
];

// Seeded Hall of Fame / Grandmasters for instant matching & matchmaking
const SEEDED_BOT_PLAYERS: OnlinePlayerProfile[] = [
  {
    id: 'bot_chenxin',
    name: 'Chen Xin',
    level: 97,
    title: 'Sword Douluo',
    avatarUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80',
    martialSoulName: 'Seven Kill Sword',
    martialSoulType: 'tool',
    battlePower: 985000,
    arenaBadge: 'Diamond Spirit Master',
    pvpPoints: 2480,
    pvpWins: 142,
    pvpLosses: 18,
    battleArmorRank: 'four_word',
    battleArmorName: '4-Word · Lucid Sword Heart',
    godPosition: null,
    status: 'idle',
    lastActive: Date.now(),
    isAi: true
  },
  {
    id: 'bot_tanghao',
    name: 'Tang Hao',
    level: 97,
    title: 'Clear Sky Douluo',
    avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
    martialSoulName: 'Clear Sky Hammer',
    martialSoulType: 'tool',
    battlePower: 1120000,
    arenaBadge: 'Diamond Spirit Master',
    pvpPoints: 2650,
    pvpWins: 180,
    pvpLosses: 12,
    battleArmorRank: 'five_word',
    battleArmorName: '5-Word · Boundless Clear Sky',
    godPosition: null,
    status: 'idle',
    lastActive: Date.now(),
    isAi: true
  },
  {
    id: 'bot_rongrong',
    name: 'Ning Rongrong',
    level: 95,
    title: 'Nine Colors Goddess · Titled Douluo',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    martialSoulName: 'Nine Treasure Glazed Tile Pagoda',
    martialSoulType: 'tool',
    battlePower: 860000,
    arenaBadge: 'Ruby Spirit Master',
    pvpPoints: 2150,
    pvpWins: 98,
    pvpLosses: 24,
    battleArmorRank: 'three_word',
    battleArmorName: '3-Word · Glazed Nine Treasures',
    godPosition: 'Nine Colors Goddess',
    status: 'idle',
    lastActive: Date.now(),
    isAi: true
  },
  {
    id: 'bot_dugubo',
    name: 'Dugu Bo',
    level: 92,
    title: 'Poison Douluo',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    martialSoulName: 'Jade Phosphor Serpent Emperor',
    martialSoulType: 'beast',
    battlePower: 790000,
    arenaBadge: 'Sapphire Spirit Master',
    pvpPoints: 1980,
    pvpWins: 85,
    pvpLosses: 32,
    battleArmorRank: 'two_word',
    battleArmorName: '2-Word · Jade Phosphor Poison Realm',
    godPosition: null,
    status: 'idle',
    lastActive: Date.now(),
    isAi: true
  },
  {
    id: 'bot_tangwulin',
    name: 'Tang Wulin',
    level: 99,
    title: 'Dragon Emperor Douluo · Golden Dragon Moon Song',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    martialSoulName: 'Golden Dragon King & Bluesilver Emperor',
    martialSoulType: 'god',
    battlePower: 1680000,
    arenaBadge: 'Diamond Spirit Master',
    pvpPoints: 3120,
    pvpWins: 230,
    pvpLosses: 8,
    battleArmorRank: 'five_word',
    battleArmorName: '5-Word · Golden Dragon Moon Song',
    godPosition: 'Dual Gods · Sea God & Asura',
    status: 'idle',
    lastActive: Date.now(),
    isAi: true
  }
];

// Helper: Convert profile to battle fighter
function createFighterFromProfile(profile: OnlinePlayerProfile, socketId?: string): PvpFighterState {
  const hpBase = profile.level * 450 + 2000;
  const atkBase = Math.floor(profile.battlePower / 12) + profile.level * 25 + 150;
  const defBase = Math.floor(profile.battlePower / 25) + profile.level * 15 + 80;

  return {
    id: profile.id,
    socketId: socketId || profile.socketId,
    name: profile.name,
    level: profile.level,
    title: profile.title,
    avatarUrl: profile.avatarUrl,
    martialSoulName: profile.martialSoulName,
    hp: hpBase,
    maxHp: hpBase,
    soulPower: 100,
    maxSoulPower: 100,
    shield: 0,
    atk: atkBase,
    def: defBase,
    speed: 100 + profile.level * 2,
    critRate: 35,
    critDmg: 160,
    penetration: 15,
    isAvatarActive: false,
    isDomainActive: false,
    activeDomainName: profile.godPosition ? 'Asura God Domain' : 'Death God Domain',
    battleArmorRank: profile.battleArmorRank || 'none',
    battleArmorCustomName: profile.battleArmorName || 'Battle Armor',
    battleArmorSkillAvailable: profile.battleArmorRank && profile.battleArmorRank !== 'none',
    skills: [
      {
        id: 'sk_1',
        name: '1st Skill · Void Slash',
        ringOrder: 1,
        ringYears: 420,
        ringColor: 'yellow',
        soulPowerCost: 15,
        cooldown: 1,
        currentCooldown: 0,
        description: 'Condenses initial spirit power, dealing 1.8x physical penetration damage.',
        damageMultiplier: 1.8
      },
      {
        id: 'sk_2',
        name: '2nd Skill · Tiangang Hegemony',
        ringOrder: 2,
        ringYears: 1500,
        ringColor: 'yellow',
        soulPowerCost: 20,
        cooldown: 2,
        currentCooldown: 0,
        description: 'Channels thousand-year ring vigor, gaining shield equal to 400% DEF and +30% ATK.',
        damageMultiplier: 1.2,
        shieldMultiplier: 2.5,
        buffType: 'atk',
        buffValue: 30,
        buffDuration: 2
      },
      {
        id: 'sk_3',
        name: '3rd Skill · Myriad Blade Thunder',
        ringOrder: 3,
        ringYears: 5000,
        ringColor: 'purple',
        soulPowerCost: 25,
        cooldown: 2,
        currentCooldown: 0,
        description: 'Summons purple lightning piercing the enemy, dealing 2.6x CRIT damage with weaken.',
        damageMultiplier: 2.6,
        debuffType: 'weaken',
        debuffDuration: 2
      },
      {
        id: 'sk_4',
        name: '4th Skill · Star Shattering Peak',
        ringOrder: 4,
        ringYears: 9800,
        ringColor: 'purple',
        soulPowerCost: 30,
        cooldown: 3,
        currentCooldown: 0,
        description: 'Ten-thousand-year peak force slams down, dealing 3.2x damage and reducing enemy defense.',
        damageMultiplier: 3.2,
        debuffType: 'paralyze',
        debuffDuration: 1
      },
      {
        id: 'sk_5',
        name: '5th Skill · Nether Soul Piercer',
        ringOrder: 5,
        ringYears: 25000,
        ringColor: 'black',
        soulPowerCost: 35,
        cooldown: 3,
        currentCooldown: 0,
        description: 'Black-tier 25,000-year spear of piercing, ignoring 50% DEF to deal 3.8x massive damage!',
        damageMultiplier: 3.8
      },
      {
        id: 'sk_6',
        name: '6th Skill · Thousand-Jin Dragon Emperor Seal',
        ringOrder: 6,
        ringYears: 55000,
        ringColor: 'black',
        soulPowerCost: 40,
        cooldown: 4,
        currentCooldown: 0,
        description: '55,000-year dragon emperor seal, dealing 4.5x devastating area shockwave!',
        damageMultiplier: 4.5
      },
      {
        id: 'sk_7',
        name: '7th Skill · Spirit Avatar',
        ringOrder: 7,
        ringYears: 80000,
        ringColor: 'black',
        soulPowerCost: 50,
        cooldown: 5,
        currentCooldown: 0,
        description: 'Soul Saint realm! Unleashes Spirit Avatar, boosting all stats and skill damage by 50%!',
        damageMultiplier: 2.0,
        isAvatar: true
      },
      {
        id: 'sk_8',
        name: '8th Skill · Sacred World Annihilation Wave',
        ringOrder: 8,
        ringYears: 100000,
        ringColor: 'red',
        soulPowerCost: 55,
        cooldown: 5,
        currentCooldown: 0,
        description: '100,000-year red supreme soul skill! Rips through spacetime, dealing 5.8x annihilation damage!',
        damageMultiplier: 5.8
      },
      {
        id: 'sk_9',
        name: '9th Skill · Genesis Judgment',
        ringOrder: 9,
        ringYears: 200000,
        ringColor: 'red',
        soulPowerCost: 65,
        cooldown: 6,
        currentCooldown: 0,
        description: 'Titled Douluo ultimate secret art! Channels astral divine power, dealing 7.5x godlike world-shattering damage!',
        damageMultiplier: 7.5
      }
    ],
    hiddenWeapons: [
      { id: 'fntanglian', name: 'Buddha Fury Tang Lotus', damage: 8500, penetration: 75, count: 3 },
      { id: 'byrain', name: 'Torrential Pear Blossom Needle', damage: 4500, penetration: 50, count: 5 }
    ],
    activeBuffs: [],
    activeDebuffs: [],
    isAi: profile.isAi || false
  };
}

// Global Leaderboard generator
function generateLeaderboard(): GlobalLeaderboardData {
  const allKnown = [...Array.from(onlinePlayers.values()), ...SEEDED_BOT_PLAYERS];
  const uniqueById = new Map<string, OnlinePlayerProfile>();
  allKnown.forEach(p => uniqueById.set(p.id, p));

  const list = Array.from(uniqueById.values());

  // Sort by pvpPoints
  const topPvp: LeaderboardUser[] = [...list]
    .sort((a, b) => (b.pvpPoints || 0) - (a.pvpPoints || 0))
    .slice(0, 20)
    .map((p, idx) => ({
      rank: idx + 1,
      id: p.id,
      name: p.name,
      title: p.title,
      avatarUrl: p.avatarUrl,
      martialSoulName: p.martialSoulName,
      level: p.level,
      battlePower: p.battlePower,
      pvpPoints: p.pvpPoints || 1200,
      pvpWins: p.pvpWins || 0,
      winRate: (p.pvpWins || 0) + (p.pvpLosses || 0) > 0
        ? Math.round(((p.pvpWins || 0) / ((p.pvpWins || 0) + (p.pvpLosses || 0))) * 100)
        : 100,
      godPosition: p.godPosition,
      battleArmorRank: p.battleArmorRank
    }));

  // Sort by battlePower
  const topPower: LeaderboardUser[] = [...list]
    .sort((a, b) => (b.battlePower || 0) - (a.battlePower || 0))
    .slice(0, 20)
    .map((p, idx) => ({
      rank: idx + 1,
      id: p.id,
      name: p.name,
      title: p.title,
      avatarUrl: p.avatarUrl,
      martialSoulName: p.martialSoulName,
      level: p.level,
      battlePower: p.battlePower,
      pvpPoints: p.pvpPoints || 1200,
      pvpWins: p.pvpWins || 0,
      winRate: (p.pvpWins || 0) + (p.pvpLosses || 0) > 0
        ? Math.round(((p.pvpWins || 0) / ((p.pvpWins || 0) + (p.pvpLosses || 0))) * 100)
        : 100,
      godPosition: p.godPosition,
      battleArmorRank: p.battleArmorRank
    }));

  return {
    topPvp,
    topPower,
    topRaid: [
      {
        rank: 1,
        teamName: 'Shrek Seven Monsters Vanguard',
        bossName: 'Deep Sea Demon Whale King · Million-Yr',
        totalDamage: 9980000,
        leaderName: 'Tang San',
        clearedAt: 'Today 14:32'
      },
      {
        rank: 2,
        teamName: 'Seven Treasure Godslayer Array',
        bossName: 'Evil Eye Tyrant Dominator · 700k-Yr',
        totalDamage: 8540000,
        leaderName: 'Chen Xin',
        clearedAt: 'Today 12:10'
      },
      {
        rank: 3,
        teamName: 'Clear Sky Alliance',
        bossName: 'Crimson Mother · God Dominator',
        totalDamage: 7890000,
        leaderName: 'Tang Hao',
        clearedAt: 'Yesterday 21:45'
      }
    ]
  };
}

// Broadcast online players list
function broadcastOnlinePlayers() {
  const players = [
    ...Array.from(onlinePlayers.values()),
    ...SEEDED_BOT_PLAYERS
  ];
  io.emit('server:online_players', players);
}

// ================= CO-OP RAID PRESETS =================
const RAID_BOSSES: Record<string, CoopBossState> = {
  deep_sea_whale: {
    id: 'deep_sea_whale',
    name: 'Deep Sea Demon Whale King',
    title: 'Million-Yr Sea Spirit Beast · Half-Step God',
    years: 1000000,
    avatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&auto=format&fit=crop&q=80',
    hp: 500000,
    maxHp: 500000,
    atk: 12000,
    def: 3500,
    enrageTurn: 20,
    currentTurn: 1,
    skills: [
      { name: 'Sea Demon Heaven Swallowing Roar', description: 'Towering demonic waves sweep the field, dealing immense water impact to all members!', damage: 8500, cooldownTurns: 3, currentCd: 0, target: 'all' },
      { name: 'Million-Yr Whale Tail Slam', description: 'A god-tier colossal tail slams down, shattering the current primary target shield and flesh!', damage: 15000, cooldownTurns: 2, currentCd: 0, target: 'single' }
    ],
    element: 'water'
  },
  evil_eye_tyrant: {
    id: 'evil_eye_tyrant',
    name: 'Evil Eye Tyrant Dominator',
    title: '700,000-Yr Fierce Beast · Lord of Evil Forest',
    years: 700000,
    avatar: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=80',
    hp: 420000,
    maxHp: 420000,
    atk: 14500,
    def: 3000,
    enrageTurn: 18,
    currentTurn: 1,
    skills: [
      { name: 'Spacetime Annihilation Beam', description: '700k-yr dominator divine pupil fires annihilation rays, dealing true mental collapse to the entire team!', damage: 11000, cooldownTurns: 3, currentCd: 0, target: 'all' }
    ],
    element: 'dark'
  },
  crimson_mother: {
    id: 'crimson_mother',
    name: 'Crimson Mother',
    title: 'God-Tier Crimson Realm Overlord · Star Devourer',
    years: 2000000,
    avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80',
    hp: 880000,
    maxHp: 880000,
    atk: 18000,
    def: 4500,
    enrageTurn: 25,
    currentTurn: 1,
    skills: [
      { name: 'Crimson Annihilation Tide', description: 'Realm-devouring tide reducing whole team DEF by 30% and dealing extreme hybrid damage!', damage: 14000, cooldownTurns: 3, currentCd: 0, target: 'all' }
    ],
    element: 'divine'
  }
};

// ================= REST API ROUTES =================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    onlineCount: onlinePlayers.size + SEEDED_BOT_PLAYERS.length,
    activePvPRooms: pvpRooms.size,
    activeCoopRooms: coopRooms.size,
    timestamp: Date.now()
  });
});

app.get('/api/leaderboard', (req, res) => {
  res.json(generateLeaderboard());
});

// ================= SOCKET.IO REALTIME EVENTS =================
io.on('connection', (socket: Socket) => {
  console.log(`[Socket.IO] New client connected: ${socket.id}`);

  // Send initial chat history & online count
  socket.emit('server:chat_history', globalChatMessages.slice(-50));
  socket.emit('server:leaderboard', generateLeaderboard());
  broadcastOnlinePlayers();

  // 1. REGISTER / SYNC PLAYER PROFILE
  socket.on('player:register', (profile: OnlinePlayerProfile) => {
    if (!profile || !profile.id) return;
    const playerWithSocket: OnlinePlayerProfile = {
      ...profile,
      socketId: socket.id,
      status: 'idle',
      lastActive: Date.now()
    };
    onlinePlayers.set(socket.id, playerWithSocket);
    console.log(`[Socket.IO] Player registered: ${profile.name} (Lv.${profile.level} - ${profile.title})`);
    broadcastOnlinePlayers();
  });

  // 2. CHAT MESSAGE
  socket.on('chat:send', (msg: { channel: string; text: string; tag?: string }) => {
    const sender = onlinePlayers.get(socket.id);
    if (!sender) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: sender.id,
      senderName: sender.name,
      senderTitle: sender.title,
      senderAvatar: sender.avatarUrl,
      senderSoul: sender.martialSoulName,
      channel: (msg.channel as any) || 'world',
      text: msg.text.trim().slice(0, 150),
      timestamp: Date.now(),
      tag: msg.tag || (sender.godPosition ? '[Rank 100 God]' : sender.level >= 90 ? '[Titled Douluo]' : '[Spirit Master]')
    };

    globalChatMessages.push(newMsg);
    if (globalChatMessages.length > 100) {
      globalChatMessages.shift();
    }

    io.emit('server:chat_message', newMsg);
  });

  // 3. DIRECT DUEL CHALLENGE
  socket.on('challenge:send', ({ targetId, mode }: { targetId: string; mode?: 'friendly' | 'ranked' }) => {
    const challenger = onlinePlayers.get(socket.id);
    if (!challenger) return;

    // Check if target is online
    let targetSocketId: string | null = null;
    let targetPlayer: OnlinePlayerProfile | null = null;

    for (const [sId, p] of onlinePlayers.entries()) {
      if (p.id === targetId) {
        targetSocketId = sId;
        targetPlayer = p;
        break;
      }
    }

    // Check if target is a bot
    const botTarget = SEEDED_BOT_PLAYERS.find(b => b.id === targetId);
    if (botTarget) {
      // Auto-accept by bot! Create a battle room immediately!
      const roomId = `room_pvp_${Date.now()}_bot`;
      const hostFighter = createFighterFromProfile(challenger, socket.id);
      const guestFighter = createFighterFromProfile(botTarget, 'bot_socket');

      const roomState: PvpRoomState = {
        id: roomId,
        roomName: `${challenger.name} VS ${botTarget.name}`,
        mode: mode || 'friendly',
        hostId: challenger.id,
        guestId: botTarget.id,
        hostReady: true,
        guestReady: true,
        status: 'in_battle',
        turnCount: 1,
        currentTurnPlayerId: (challenger.speed || 100) >= (botTarget.level * 2 + 100) ? challenger.id : botTarget.id,
        turnTimeLimit: 15,
        turnTimeRemaining: 15,
        hostFighter,
        guestFighter,
        battleLogs: [
          {
            id: `log_init`,
            turn: 1,
            attackerName: 'System Referee',
            actionName: 'Duel Commences',
            text: `⚔️ Continental Tournament Sparring match begins! [${challenger.name}] VS [${botTarget.name}]!`,
            type: 'system',
            timestamp: Date.now()
          }
        ],
        winnerId: null,
        winnerName: null,
        createdAt: Date.now()
      };

      pvpRooms.set(roomId, roomState);
      socket.join(roomId);
      challenger.status = 'in_pvp';
      challenger.currentRoomId = roomId;

      socket.emit('pvp:match_start', roomState);
      broadcastOnlinePlayers();
      return;
    }

    if (!targetSocketId || !targetPlayer) {
      socket.emit('server:toast', { message: 'Target Spirit Master is offline or has left the lobby!', type: 'warning' });
      return;
    }

    const challengeId = `chal_${Date.now()}_${socket.id}`;
    const challenge: DirectDuelChallenge = {
      challengeId,
      challenger,
      targetId,
      mode: mode || 'friendly',
      timestamp: Date.now()
    };

    activeChallenges.set(challengeId, challenge);
    io.to(targetSocketId).emit('challenge:received', challenge);
    socket.emit('server:toast', { message: `Challenge invitation sent to [${targetPlayer.name}]!`, type: 'info' });
  });

  socket.on('challenge:respond', ({ challengeId, accepted }: { challengeId: string; accepted: boolean }) => {
    const challenge = activeChallenges.get(challengeId);
    if (!challenge) return;
    activeChallenges.delete(challengeId);

    const responder = onlinePlayers.get(socket.id);
    if (!responder) return;

    const challengerSocketId = challenge.challenger.socketId;

    if (!accepted) {
      if (challengerSocketId) {
        io.to(challengerSocketId).emit('server:toast', {
          message: `Spirit Master [${responder.name}] declined your duel challenge.`,
          type: 'info'
        });
      }
      return;
    }

    // Both accepted! Create PVP Room!
    const roomId = `room_pvp_${Date.now()}`;
    const hostFighter = createFighterFromProfile(challenge.challenger, challengerSocketId);
    const guestFighter = createFighterFromProfile(responder, socket.id);

    const firstTurnId = hostFighter.speed >= guestFighter.speed ? hostFighter.id : guestFighter.id;

    const roomState: PvpRoomState = {
      id: roomId,
      roomName: `${challenge.challenger.name} VS ${responder.name}`,
      mode: challenge.mode,
      hostId: challenge.challenger.id,
      guestId: responder.id,
      hostReady: true,
      guestReady: true,
      status: 'in_battle',
      turnCount: 1,
      currentTurnPlayerId: firstTurnId,
      turnTimeLimit: 15,
      turnTimeRemaining: 15,
      hostFighter,
      guestFighter,
      battleLogs: [
        {
          id: `log_${Date.now()}`,
          turn: 1,
          attackerName: 'Grand Arena Referee',
          actionName: 'Battle Commences',
          text: `🔥 Real-time PVP Duel starts! [${challenge.challenger.name}] and [${responder.name}] step into the holographic arena! Faster spirit master moves first!`,
          type: 'system',
          timestamp: Date.now()
        }
      ],
      winnerId: null,
      winnerName: null,
      createdAt: Date.now()
    };

    pvpRooms.set(roomId, roomState);

    // Update statuses
    const chProfile = onlinePlayers.get(challengerSocketId || '');
    if (chProfile) {
      chProfile.status = 'in_pvp';
      chProfile.currentRoomId = roomId;
    }
    responder.status = 'in_pvp';
    responder.currentRoomId = roomId;

    socket.join(roomId);
    if (challengerSocketId) {
      const challengerSocket = io.sockets.sockets.get(challengerSocketId);
      challengerSocket?.join(roomId);
    }

    io.to(roomId).emit('pvp:match_start', roomState);
    broadcastOnlinePlayers();
  });

  // 4. QUICK MATCHMAKING QUEUE
  socket.on('pvp:queue_match', () => {
    const player = onlinePlayers.get(socket.id);
    if (!player) return;

    // Check if already in queue
    const existingIndex = matchmakingQueue.findIndex(q => q.socketId === socket.id);
    if (existingIndex !== -1) return;

    player.status = 'queued';
    broadcastOnlinePlayers();

    // Check if another real player is in queue
    if (matchmakingQueue.length > 0) {
      const opponent = matchmakingQueue.shift()!;
      const opponentSocket = io.sockets.sockets.get(opponent.socketId);

      const roomId = `room_pvp_queue_${Date.now()}`;
      const hostFighter = createFighterFromProfile(opponent.player, opponent.socketId);
      const guestFighter = createFighterFromProfile(player, socket.id);

      const roomState: PvpRoomState = {
        id: roomId,
        roomName: `Ranked Clash · ${opponent.player.name} VS ${player.name}`,
        mode: 'ranked',
        hostId: opponent.player.id,
        guestId: player.id,
        hostReady: true,
        guestReady: true,
        status: 'in_battle',
        turnCount: 1,
        currentTurnPlayerId: hostFighter.speed >= guestFighter.speed ? hostFighter.id : guestFighter.id,
        turnTimeLimit: 15,
        turnTimeRemaining: 15,
        hostFighter,
        guestFighter,
        battleLogs: [
          {
            id: `log_q_${Date.now()}`,
            turn: 1,
            attackerName: 'Ladder System',
            actionName: 'Match Found',
            text: `⚡ Ranked Match Found! [${opponent.player.name}] VS [${player.name}], competing for arena rank points!`,
            type: 'system',
            timestamp: Date.now()
          }
        ],
        winnerId: null,
        winnerName: null,
        createdAt: Date.now()
      };

      pvpRooms.set(roomId, roomState);
      opponent.player.status = 'in_pvp';
      opponent.player.currentRoomId = roomId;
      player.status = 'in_pvp';
      player.currentRoomId = roomId;

      socket.join(roomId);
      opponentSocket?.join(roomId);

      io.to(roomId).emit('pvp:match_start', roomState);
      broadcastOnlinePlayers();
    } else {
      matchmakingQueue.push({ socketId: socket.id, player, joinedAt: Date.now() });
      socket.emit('pvp:queue_status', { inQueue: true, message: 'Searching cross-server for opponents of similar caliber...' });

      // If no opponent in 3.5s, auto-match with a random grandmaster bot for instant thrilling gameplay!
      setTimeout(() => {
        const idx = matchmakingQueue.findIndex(q => q.socketId === socket.id);
        if (idx !== -1) {
          matchmakingQueue.splice(idx, 1);
          const randomBot = SEEDED_BOT_PLAYERS[Math.floor(Math.random() * SEEDED_BOT_PLAYERS.length)];

          const roomId = `room_pvp_bot_${Date.now()}`;
          const hostFighter = createFighterFromProfile(player, socket.id);
          const guestFighter = createFighterFromProfile(randomBot, 'bot_socket');

          const roomState: PvpRoomState = {
            id: roomId,
            roomName: `Ranked Clash · ${player.name} VS ${randomBot.name}`,
            mode: 'ranked',
            hostId: player.id,
            guestId: randomBot.id,
            hostReady: true,
            guestReady: true,
            status: 'in_battle',
            turnCount: 1,
            currentTurnPlayerId: hostFighter.speed >= guestFighter.speed ? hostFighter.id : randomBot.id,
            turnTimeLimit: 15,
            turnTimeRemaining: 15,
            hostFighter,
            guestFighter,
            battleLogs: [
              {
                id: `log_bot_${Date.now()}`,
                turn: 1,
                attackerName: 'Ladder Referee',
                actionName: 'Grandmaster Arrival',
                text: `⚡ Match ready! Renowned grandmaster [${randomBot.title} · ${randomBot.name}] answers the challenge!`,
                type: 'system',
                timestamp: Date.now()
              }
            ],
            winnerId: null,
            winnerName: null,
            createdAt: Date.now()
          };

          pvpRooms.set(roomId, roomState);
          player.status = 'in_pvp';
          player.currentRoomId = roomId;
          socket.join(roomId);

          socket.emit('pvp:match_start', roomState);
          broadcastOnlinePlayers();
        }
      }, 3500);
    }
  });

  socket.on('pvp:cancel_queue', () => {
    const idx = matchmakingQueue.findIndex(q => q.socketId === socket.id);
    if (idx !== -1) {
      matchmakingQueue.splice(idx, 1);
    }
    const player = onlinePlayers.get(socket.id);
    if (player && player.status === 'queued') {
      player.status = 'idle';
    }
    socket.emit('pvp:queue_status', { inQueue: false });
    broadcastOnlinePlayers();
  });

  // 5. PVP TURN-BASED ACTION EXECUTION
  socket.on('pvp:action', (req: PvpActionRequest) => {
    const player = onlinePlayers.get(socket.id);
    if (!player || !player.currentRoomId) return;

    const room = pvpRooms.get(player.currentRoomId);
    if (!room || room.status !== 'in_battle') return;

    const isHost = room.hostFighter.id === player.id;
    const attacker = isHost ? room.hostFighter : room.guestFighter;
    const defender = isHost ? room.guestFighter : room.hostFighter;

    if (!attacker || !defender) return;
    if (room.currentTurnPlayerId !== attacker.id) {
      socket.emit('server:toast', { message: 'Not your turn yet!', type: 'warning' });
      return;
    }

    // Execute the action
    let damage = 0;
    let logText = '';
    let logType: PvpCombatLogEntry['type'] = 'attack';
    let isCrit = false;

    const avatarMult = attacker.isAvatarActive ? 1.5 : 1.0;
    const domainMult = attacker.isDomainActive ? 1.3 : 1.0;

    if (req.actionType === 'normal_attack') {
      const rawDmg = (attacker.atk * 1.1 + Math.random() * (attacker.atk * 0.2)) * avatarMult * domainMult;
      const defMitigation = Math.max(10, defender.def * (1 - attacker.penetration / 100));
      damage = Math.max(50, Math.floor(rawDmg - defMitigation * 0.4));
      isCrit = Math.random() * 100 < attacker.critRate;
      if (isCrit) damage = Math.floor(damage * (attacker.critDmg / 100));

      attacker.soulPower = Math.min(attacker.maxSoulPower, attacker.soulPower + 15);
      logText = `⚔️ [${attacker.name}] executes a basic spirit strike on [${defender.name}], dealing ${damage}${isCrit ? ' (CRIT💥)' : ''} damage!`;
      logType = 'attack';
    } else if (req.actionType === 'cast_skill') {
      const skill = attacker.skills.find(s => s.id === req.skillId);
      if (!skill) return;

      if (attacker.soulPower < skill.soulPowerCost) {
        socket.emit('server:toast', { message: 'Insufficient Spirit Power to cast this skill!', type: 'warning' });
        return;
      }
      if (skill.currentCooldown > 0) {
        socket.emit('server:toast', { message: `This skill is on cooldown (${skill.currentCooldown} turns remaining)!`, type: 'warning' });
        return;
      }

      attacker.soulPower -= skill.soulPowerCost;
      skill.currentCooldown = skill.cooldown;

      if (skill.isAvatar) {
        attacker.isAvatarActive = true;
        logText = `🌟 [${attacker.name}] triggers [${skill.name}]! Spirit Avatar descends, boosting all stats by 50%!`;
        logType = 'avatar';
      } else {
        const rawDmg = (attacker.atk * skill.damageMultiplier + attacker.level * 35) * avatarMult * domainMult;
        const defMitigation = Math.max(10, defender.def * (1 - attacker.penetration / 100));
        damage = Math.max(80, Math.floor(rawDmg - defMitigation * 0.35));
        isCrit = Math.random() * 100 < (attacker.critRate + 15);
        if (isCrit) damage = Math.floor(damage * (attacker.critDmg / 100));

        if (skill.shieldMultiplier) {
          const sBonus = Math.floor(attacker.def * skill.shieldMultiplier);
          attacker.shield += sBonus;
          logText = `🛡️ [${attacker.name}] casts [${skill.name}], gaining ${sBonus} shield and striking [${defender.name}] for ${damage} damage!`;
        } else {
          logText = `⚡ [${attacker.name}] unleashes [${skill.name}] on [${defender.name}], dealing ${damage}${isCrit ? ' (FATAL CRIT💥)' : ''} massive spirit damage!`;
        }
        logType = 'skill';
      }
    } else if (req.actionType === 'activate_avatar') {
      attacker.isAvatarActive = true;
      attacker.soulPower = Math.max(0, attacker.soulPower - 30);
      logText = `✨ [${attacker.name}] summons 7th Skill [Spirit Avatar]! Colossal avatar manifests, surging battle power!`;
      logType = 'avatar';
    } else if (req.actionType === 'activate_domain') {
      attacker.isDomainActive = true;
      attacker.soulPower = Math.max(0, attacker.soulPower - 25);
      logText = `🌀 [${attacker.name}] expands supreme [${attacker.activeDomainName || 'Death God Domain'}]! Domain force dominates the field!`;
      logType = 'domain';
    } else if (req.actionType === 'activate_battle_armor') {
      if (!attacker.battleArmorSkillAvailable) return;
      attacker.battleArmorSkillAvailable = false;
      const shieldVal = Math.floor(attacker.maxHp * 0.4 + attacker.def * 3);
      attacker.shield += shieldVal;
      damage = Math.floor(attacker.atk * 3.2 * avatarMult * domainMult);
      logText = `👑 [${attacker.name}] awakens [${attacker.battleArmorCustomName || 'Battle Armor'}]! Shield +${shieldVal} and armor laser fires at [${defender.name}] for ${damage} piercing damage!`;
      logType = 'armor';
    } else if (req.actionType === 'use_hidden_weapon') {
      const hw = attacker.hiddenWeapons.find(w => w.id === req.weaponId || w.count > 0);
      if (hw && hw.count > 0) {
        hw.count -= 1;
        damage = Math.floor(hw.damage * 1.5 + attacker.atk * 1.2);
        logText = `🎯 [${attacker.name}] fires Tang Sect supreme weapon [${hw.name}]! Volley deals ${damage} lethal penetration damage to [${defender.name}]!`;
        logType = 'weapon';
      }
    } else if (req.actionType === 'surrender') {
      defender.hp = defender.hp; // Keep defender
      attacker.hp = 0;
      logText = `🏳️ [${attacker.name}] concedes the match. The duel ends early!`;
      logType = 'system';
    }

    // Apply Damage to Defender Shield & HP
    if (damage > 0) {
      if (defender.shield > 0) {
        if (defender.shield >= damage) {
          defender.shield -= damage;
        } else {
          const rem = damage - defender.shield;
          defender.shield = 0;
          defender.hp = Math.max(0, defender.hp - rem);
        }
      } else {
        defender.hp = Math.max(0, defender.hp - damage);
      }
    }

    // Append Battle Log
    room.battleLogs.unshift({
      id: `log_${Date.now()}_${Math.random()}`,
      turn: room.turnCount,
      attackerName: attacker.name,
      actionName: req.actionType,
      text: logText,
      damage,
      isCrit,
      type: logType,
      timestamp: Date.now()
    });

    // Check Victory
    if (defender.hp <= 0) {
      room.status = 'ended';
      room.winnerId = attacker.id;
      room.winnerName = attacker.name;

      // Ladder Points Calculation
      if (room.mode === 'ranked') {
        const winnerProfile = onlinePlayers.get(attacker.socketId || '') || SEEDED_BOT_PLAYERS.find(b => b.id === attacker.id);
        const loserProfile = onlinePlayers.get(defender.socketId || '') || SEEDED_BOT_PLAYERS.find(b => b.id === defender.id);

        if (winnerProfile) {
          winnerProfile.pvpPoints = (winnerProfile.pvpPoints || 1200) + 25;
          winnerProfile.pvpWins = (winnerProfile.pvpWins || 0) + 1;
        }
        if (loserProfile) {
          loserProfile.pvpPoints = Math.max(1000, (loserProfile.pvpPoints || 1200) - 15);
          loserProfile.pvpLosses = (loserProfile.pvpLosses || 0) + 1;
        }
      }

      room.battleLogs.unshift({
        id: `log_win_${Date.now()}`,
        turn: room.turnCount,
        attackerName: 'Referee Announcement',
        actionName: 'Match Outcome',
        text: `🏆 Duel Concluded! [${attacker.name}] triumphs over the opponent, claiming glory in this arena clash!`,
        type: 'system',
        timestamp: Date.now()
      });

      io.to(room.id).emit('pvp:battle_update', room);
      io.to(room.id).emit('pvp:battle_end', {
        winnerId: attacker.id,
        winnerName: attacker.name,
        rewards: {
          pointsChange: room.mode === 'ranked' ? (isHost ? 25 : -15) : 0,
          arenaMedals: room.mode === 'ranked' ? 50 : 15,
          gold: 5000,
          exp: 8000
        }
      });
      broadcastOnlinePlayers();
      return;
    }

    // Decrement Cooldowns for Attacker
    attacker.skills.forEach(s => {
      if (s.currentCooldown > 0) s.currentCooldown -= 1;
    });

    // Pass turn to Defender
    room.turnCount += 1;
    room.currentTurnPlayerId = defender.id;
    room.turnTimeRemaining = 15;

    io.to(room.id).emit('pvp:battle_update', room);

    // If defender is a BOT, auto-respond after 1.2 seconds!
    if (defender.isAi && room.status === 'in_battle') {
      setTimeout(() => {
        executeBotTurn(room, defender, attacker);
      }, 1200);
    }
  });

  // BOT AUTO TURN RESOLVER
  function executeBotTurn(room: PvpRoomState, bot: PvpFighterState, playerTarget: PvpFighterState) {
    if (room.status !== 'in_battle' || room.currentTurnPlayerId !== bot.id) return;

    let actionType: PvpActionRequest['actionType'] = 'normal_attack';
    let chosenSkillId: string | undefined = undefined;

    // AI Decision logic
    if (!bot.isAvatarActive && bot.level >= 70 && Math.random() < 0.4) {
      actionType = 'activate_avatar';
    } else if (!bot.isDomainActive && Math.random() < 0.35) {
      actionType = 'activate_domain';
    } else if (bot.battleArmorSkillAvailable && bot.hp < bot.maxHp * 0.6) {
      actionType = 'activate_battle_armor';
    } else {
      // Pick highest ready skill
      const availableSkills = bot.skills.filter(s => s.currentCooldown === 0 && bot.soulPower >= s.soulPowerCost && !s.isAvatar);
      if (availableSkills.length > 0) {
        const topSkill = availableSkills.sort((a, b) => b.damageMultiplier - a.damageMultiplier)[0];
        actionType = 'cast_skill';
        chosenSkillId = topSkill.id;
      }
    }

    // Execute bot action through the main flow
    let damage = 0;
    let logText = '';
    let logType: PvpCombatLogEntry['type'] = 'attack';
    const avatarMult = bot.isAvatarActive ? 1.5 : 1.0;
    const domainMult = bot.isDomainActive ? 1.3 : 1.0;

    if (actionType === 'normal_attack') {
      const rawDmg = (bot.atk * 1.1 + Math.random() * (bot.atk * 0.2)) * avatarMult * domainMult;
      const defMitigation = Math.max(10, playerTarget.def * (1 - bot.penetration / 100));
      damage = Math.max(50, Math.floor(rawDmg - defMitigation * 0.4));
      bot.soulPower = Math.min(bot.maxSoulPower, bot.soulPower + 15);
      logText = `⚔️ [${bot.name}] dashes swiftly, brandishing [${bot.martialSoulName}] against [${playerTarget.name}] for ${damage} physical penetration damage!`;
      logType = 'attack';
    } else if (actionType === 'cast_skill') {
      const skill = bot.skills.find(s => s.id === chosenSkillId);
      if (skill) {
        bot.soulPower -= skill.soulPowerCost;
        skill.currentCooldown = skill.cooldown;
        const rawDmg = (bot.atk * skill.damageMultiplier + bot.level * 30) * avatarMult * domainMult;
        const defMitigation = Math.max(10, playerTarget.def * (1 - bot.penetration / 100));
        damage = Math.max(80, Math.floor(rawDmg - defMitigation * 0.35));
        logText = `⚡ [${bot.name}] roars and casts [${skill.name}]! Tempestuous spirit power sweeps, dealing ${damage} burst spirit skill damage to [${playerTarget.name}]!`;
        logType = 'skill';
      }
    } else if (actionType === 'activate_avatar') {
      bot.isAvatarActive = true;
      logText = `✨ [${bot.name}] triggers [7th Skill · Spirit Avatar]! Radiance surges, all attributes increased by 50%!`;
      logType = 'avatar';
    } else if (actionType === 'activate_domain') {
      bot.isDomainActive = true;
      logText = `🌀 [${bot.name}] deploys supreme [${bot.activeDomainName || 'Death God Domain'}]! Killing intent blankets the battlefield!`;
      logType = 'domain';
    } else if (actionType === 'activate_battle_armor') {
      bot.battleArmorSkillAvailable = false;
      const sVal = Math.floor(bot.maxHp * 0.4 + bot.def * 3);
      bot.shield += sVal;
      damage = Math.floor(bot.atk * 3.0 * avatarMult * domainMult);
      logText = `👑 [${bot.name}] summons [${bot.battleArmorCustomName || 'Battle Armor'}] fully equipped! Gains ${sVal} shield and strikes [${playerTarget.name}] for ${damage} severe damage!`;
      logType = 'armor';
    }

    if (damage > 0) {
      if (playerTarget.shield > 0) {
        if (playerTarget.shield >= damage) {
          playerTarget.shield -= damage;
        } else {
          const rem = damage - playerTarget.shield;
          playerTarget.shield = 0;
          playerTarget.hp = Math.max(0, playerTarget.hp - rem);
        }
      } else {
        playerTarget.hp = Math.max(0, playerTarget.hp - damage);
      }
    }

    room.battleLogs.unshift({
      id: `log_bot_${Date.now()}_${Math.random()}`,
      turn: room.turnCount,
      attackerName: bot.name,
      actionName: actionType,
      text: logText,
      damage,
      type: logType,
      timestamp: Date.now()
    });

    if (playerTarget.hp <= 0) {
      room.status = 'ended';
      room.winnerId = bot.id;
      room.winnerName = bot.name;

      room.battleLogs.unshift({
        id: `log_bot_win_${Date.now()}`,
        turn: room.turnCount,
        attackerName: 'Referee Announcement',
        actionName: 'Duel Concluded',
        text: `🏆 Match Decided! Grandmaster [${bot.name}] demonstrated superior mastery and claimed victory!`,
        type: 'system',
        timestamp: Date.now()
      });

      io.to(room.id).emit('pvp:battle_update', room);
      io.to(room.id).emit('pvp:battle_end', {
        winnerId: bot.id,
        winnerName: bot.name,
        rewards: {
          pointsChange: room.mode === 'ranked' ? -15 : 0,
          arenaMedals: 10,
          gold: 2000,
          exp: 3000
        }
      });
      return;
    }

    bot.skills.forEach(s => {
      if (s.currentCooldown > 0) s.currentCooldown -= 1;
    });

    room.turnCount += 1;
    room.currentTurnPlayerId = playerTarget.id;
    room.turnTimeRemaining = 15;

    io.to(room.id).emit('pvp:battle_update', room);
  }

  // 6. CO-OP RAIDS: CREATE, JOIN, BATTLE
  socket.on('coop:create_room', ({ bossId }: { bossId: string }) => {
    const leader = onlinePlayers.get(socket.id);
    if (!leader) return;

    const baseBoss = RAID_BOSSES[bossId] || RAID_BOSSES['deep_sea_whale'];
    const bossState: CoopBossState = JSON.parse(JSON.stringify(baseBoss));

    const roomId = `coop_${Date.now()}_${socket.id.substring(0, 5)}`;
    const leaderMember: CoopMemberState = {
      id: leader.id,
      socketId: socket.id,
      name: leader.name,
      title: leader.title,
      avatarUrl: leader.avatarUrl,
      level: leader.level,
      martialSoulName: leader.martialSoulName,
      hp: leader.level * 450 + 2000,
      maxHp: leader.level * 450 + 2000,
      soulPower: 100,
      maxSoulPower: 100,
      shield: 0,
      atk: Math.floor(leader.battlePower / 12) + 200,
      def: Math.floor(leader.battlePower / 25) + 100,
      speed: 120,
      critRate: 35,
      isAvatarActive: false,
      isDomainActive: false,
      totalDamageDealt: 0,
      dps: 0,
      isReady: true,
      isLeader: true
    };

    // Auto-fill 2 helpful bot companions if alone, so the raid can be enjoyed solo or with friends!
    const companionBots: CoopMemberState[] = [
      {
        id: 'bot_chenxin',
        name: 'Chen Xin',
        title: 'Seven Kill Sword · Titled Douluo',
        avatarUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80',
        level: 97,
        martialSoulName: 'Seven Kill Sword',
        hp: 45000,
        maxHp: 45000,
        soulPower: 100,
        maxSoulPower: 100,
        shield: 0,
        atk: 82000,
        def: 39000,
        speed: 140,
        critRate: 45,
        isAvatarActive: true,
        isDomainActive: false,
        totalDamageDealt: 0,
        dps: 0,
        isReady: true,
        isLeader: false,
        isAi: true
      },
      {
        id: 'bot_rongrong',
        name: 'Ning Rongrong',
        title: 'Nine Treasure Glazed Tile Pagoda · Titled Douluo',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        level: 95,
        martialSoulName: 'Nine Treasure Glazed Tile Pagoda',
        hp: 38000,
        maxHp: 38000,
        soulPower: 100,
        maxSoulPower: 100,
        shield: 5000,
        atk: 68000,
        def: 34000,
        speed: 130,
        critRate: 25,
        isAvatarActive: false,
        isDomainActive: false,
        totalDamageDealt: 0,
        dps: 0,
        isReady: true,
        isLeader: false,
        isAi: true
      }
    ];

    const coopRoom: CoopRoomState = {
      id: roomId,
      roomName: `Cross-Server Raid [${bossState.name}] Squad`,
      bossId,
      boss: bossState,
      leaderId: leader.id,
      maxMembers: 4,
      members: [leaderMember, ...companionBots],
      status: 'fighting',
      currentTurn: 1,
      timeRemaining: 180,
      battleLogs: [
        {
          id: `log_coop_init`,
          turn: 1,
          attackerName: 'Squad Leader',
          actionName: 'Raid Commences',
          text: `🐉 Cross-Server Raid on [${bossState.title} · ${bossState.name}] officially begins! All members enter combat stance!`,
          type: 'system',
          timestamp: Date.now()
        }
      ],
      createdAt: Date.now()
    };

    coopRooms.set(roomId, coopRoom);
    socket.join(roomId);
    leader.status = 'in_coop';
    leader.currentRoomId = roomId;

    socket.emit('coop:room_update', coopRoom);
    broadcastOnlinePlayers();
  });

  socket.on('coop:action', ({ roomId, actionType, skillMultiplier }: { roomId: string; actionType: string; skillMultiplier?: number }) => {
    const coop = coopRooms.get(roomId);
    if (!coop || coop.status !== 'fighting') return;

    const player = onlinePlayers.get(socket.id);
    if (!player) return;

    const member = coop.members.find(m => m.id === player.id);
    if (!member) return;

    // Player action damage to boss
    const mult = skillMultiplier || 2.5;
    const dmg = Math.floor(member.atk * mult * (1 + Math.random() * 0.2));
    coop.boss.hp = Math.max(0, coop.boss.hp - dmg);
    member.totalDamageDealt += dmg;

    coop.battleLogs.unshift({
      id: `log_c_${Date.now()}_${Math.random()}`,
      turn: coop.currentTurn,
      attackerName: member.name,
      actionName: actionType,
      text: `⚔️ [${member.name}] unleashes spirit skill strike on [${coop.boss.name}], dealing ${dmg.toLocaleString()} squad damage!`,
      damage: dmg,
      type: 'skill',
      timestamp: Date.now()
    });

    // Companion Bots auto-damage
    coop.members.filter(m => m.isAi).forEach(bot => {
      const botDmg = Math.floor(bot.atk * (1.8 + Math.random() * 0.8));
      coop.boss.hp = Math.max(0, coop.boss.hp - botDmg);
      bot.totalDamageDealt += botDmg;
    });

    // Check Boss Defeat
    if (coop.boss.hp <= 0) {
      coop.status = 'victory';
      coop.rewards = {
        gold: 30000,
        championMedals: 100,
        soulBoneEssence: 200,
        rareMetals: { 'Divine Heavenly Forged Gold': 5, 'Spirit Forged Red Gold': 10, 'Supreme Divine Origin Stone': 2 },
        legendaryTitle: `Continental Conqueror of [${coop.boss.name}]`
      };

      coop.battleLogs.unshift({
        id: `log_coop_win_${Date.now()}`,
        turn: coop.currentTurn,
        attackerName: 'System Broadcast',
        actionName: 'Godslayer Triumph',
        text: `🎉 [${coop.boss.name}] has collapsed in defeat! The squad returns in triumph with 100,000-year soul bone essence, divine forged metals, and god medals!`,
        type: 'system',
        timestamp: Date.now()
      });

      io.to(roomId).emit('coop:room_update', coop);
      return;
    }

    // Boss Retaliation AOE
    if (Math.random() < 0.5) {
      const bossSkill = coop.boss.skills[0];
      const bossDmg = Math.floor(coop.boss.atk * 0.7);
      coop.members.forEach(m => {
        m.hp = Math.max(1, m.hp - bossDmg);
      });

      coop.battleLogs.unshift({
        id: `log_boss_atk_${Date.now()}`,
        turn: coop.currentTurn,
        attackerName: coop.boss.name,
        actionName: bossSkill?.name || 'Beast Roar',
        text: `🌊 [${coop.boss.name}] unleashes [${bossSkill?.name || 'Beast Roar'}]! Squad takes ${bossDmg} shockwave damage!`,
        damage: bossDmg,
        type: 'attack',
        timestamp: Date.now()
      });
    }

    coop.currentTurn += 1;
    io.to(roomId).emit('coop:room_update', coop);
  });

  // 7. DISCONNECT CLEANUP
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    const player = onlinePlayers.get(socket.id);
    if (player) {
      // Remove from matchmaking queue
      const qIdx = matchmakingQueue.findIndex(q => q.socketId === socket.id);
      if (qIdx !== -1) matchmakingQueue.splice(qIdx, 1);

      // Notify PVP Room if in match
      if (player.currentRoomId) {
        const room = pvpRooms.get(player.currentRoomId);
        if (room && room.status === 'in_battle') {
          room.status = 'ended';
          const winner = room.hostFighter.id === player.id ? room.guestFighter : room.hostFighter;
          room.winnerId = winner?.id || null;
          room.winnerName = winner?.name || null;
          io.to(room.id).emit('pvp:battle_end', {
            winnerId: room.winnerId,
            winnerName: room.winnerName,
            reason: 'Opponent disconnected, declared victory by forfeit!'
          });
        }
      }

      onlinePlayers.delete(socket.id);
      broadcastOnlinePlayers();
    }
  });
});

// ================= VITE INTEGRATION & PRODUCTION SERVING =================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Douluo Dalu Multiplayer Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
