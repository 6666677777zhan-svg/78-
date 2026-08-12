/**
 * Douluo Dalu RPG - Real-time Multiplayer & PVP Types
 */

export type OnlinePlayerStatus = 'idle' | 'in_pvp' | 'in_coop' | 'queued';

export interface OnlinePlayerProfile {
  id: string;
  socketId?: string;
  name: string;
  level: number;
  title: string;
  avatarUrl: string;
  martialSoulName: string;
  martialSoulType?: string;
  battlePower: number;
  speed?: number;
  arenaBadge?: string;
  pvpPoints: number;
  pvpWins: number;
  pvpLosses: number;
  battleArmorRank?: string;
  battleArmorName?: string;
  godPosition?: string | null;
  status: OnlinePlayerStatus;
  currentRoomId?: string | null;
  lastActive: number;
  isAi?: boolean;
}

export type ChatChannel = 'world' | 'pvp' | 'team' | 'system';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderTitle: string;
  senderAvatar: string;
  senderSoul?: string;
  channel: ChatChannel;
  text: string;
  timestamp: number;
  isSystem?: boolean;
  tag?: string; // e.g. '【封号斗罗】', '【天梯第1】', '【组队招募】'
}

export interface PvpSkillState {
  id: string;
  name: string;
  ringOrder: number;
  ringYears: number;
  ringColor: string;
  soulPowerCost: number;
  cooldown: number;
  currentCooldown: number;
  description: string;
  damageMultiplier: number;
  healMultiplier?: number;
  shieldMultiplier?: number;
  isAvatar?: boolean;
  isDomain?: boolean;
  buffType?: string;
  buffValue?: number;
  buffDuration?: number;
  debuffType?: string;
  debuffDuration?: number;
}

export interface PvpFighterState {
  id: string;
  socketId?: string;
  name: string;
  level: number;
  title: string;
  avatarUrl: string;
  martialSoulName: string;
  hp: number;
  maxHp: number;
  soulPower: number;
  maxSoulPower: number;
  shield: number;
  atk: number;
  def: number;
  speed: number;
  critRate: number;
  critDmg: number;
  penetration: number;
  isAvatarActive: boolean;
  isDomainActive: boolean;
  activeDomainName?: string | null;
  battleArmorRank?: string;
  battleArmorCustomName?: string;
  battleArmorSkillAvailable?: boolean;
  skills: PvpSkillState[];
  hiddenWeapons: {
    id: string;
    name: string;
    damage: number;
    penetration: number;
    count: number;
  }[];
  activeBuffs: {
    id: string;
    name: string;
    type: 'atk' | 'def' | 'speed' | 'crit' | 'shield' | 'domain';
    value: number;
    duration: number; // turns
  }[];
  activeDebuffs: {
    id: string;
    name: string;
    type: 'stun' | 'poison' | 'bleed' | 'paralyze' | 'burn' | 'silence' | 'weaken';
    value: number;
    duration: number; // turns
  }[];
  isAi?: boolean;
}

export interface PvpCombatLogEntry {
  id: string;
  turn: number;
  attackerName: string;
  actionName: string;
  text: string;
  damage?: number;
  isCrit?: boolean;
  isHeal?: boolean;
  isShield?: boolean;
  type: 'attack' | 'skill' | 'avatar' | 'domain' | 'armor' | 'weapon' | 'system';
  timestamp: number;
}

export type PvpBattleStatus = 'waiting' | 'ready' | 'in_battle' | 'ended';
export type PvpRoomMode = 'ranked' | 'friendly' | 'ladder';

export interface PvpRoomState {
  id: string;
  roomName: string;
  mode: PvpRoomMode;
  passcode?: string;
  hostId: string;
  guestId?: string | null;
  hostReady: boolean;
  guestReady: boolean;
  status: PvpBattleStatus;
  turnCount: number;
  currentTurnPlayerId: string;
  turnTimeLimit: number; // seconds (e.g. 15s)
  turnTimeRemaining: number;
  hostFighter: PvpFighterState;
  guestFighter: PvpFighterState | null;
  battleLogs: PvpCombatLogEntry[];
  winnerId: string | null;
  winnerName: string | null;
  createdAt: number;
}

export interface PvpActionRequest {
  roomId: string;
  actionType: 'normal_attack' | 'cast_skill' | 'activate_avatar' | 'activate_domain' | 'activate_battle_armor' | 'use_hidden_weapon' | 'surrender';
  skillId?: string;
  weaponId?: string;
}

export interface DirectDuelChallenge {
  challengeId: string;
  challenger: OnlinePlayerProfile;
  targetId: string;
  mode: PvpRoomMode;
  timestamp: number;
}

// Co-op Raid Types
export interface CoopBossSkill {
  name: string;
  description: string;
  damage: number;
  cooldownTurns: number;
  currentCd: number;
  target: 'single' | 'all';
}

export interface CoopBossState {
  id: string;
  name: string;
  title: string;
  years: number; // e.g. 1000000 (百万年)
  avatar: string;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  enrageTurn: number; // enters berserk mode after X turns
  currentTurn: number;
  skills: CoopBossSkill[];
  element: string;
}

export interface CoopMemberState {
  id: string;
  socketId?: string;
  name: string;
  title: string;
  avatarUrl: string;
  level: number;
  martialSoulName: string;
  hp: number;
  maxHp: number;
  soulPower: number;
  maxSoulPower: number;
  shield: number;
  atk: number;
  def: number;
  speed: number;
  critRate: number;
  isAvatarActive: boolean;
  isDomainActive: boolean;
  totalDamageDealt: number;
  dps: number;
  isReady: boolean;
  isLeader: boolean;
  isAi?: boolean;
}

export interface CoopRoomState {
  id: string;
  roomName: string;
  bossId: string;
  boss: CoopBossState;
  leaderId: string;
  maxMembers: number; // 2 to 4
  members: CoopMemberState[];
  status: 'lobby' | 'fighting' | 'victory' | 'defeat';
  currentTurn: number;
  timeRemaining: number;
  battleLogs: PvpCombatLogEntry[];
  rewards?: {
    gold: number;
    championMedals: number;
    soulBoneEssence: number;
    rareMetals: { [key: string]: number };
    legendaryTitle?: string;
  };
  createdAt: number;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  martialSoulName: string;
  level: number;
  battlePower: number;
  pvpPoints: number;
  pvpWins: number;
  winRate: number;
  godPosition?: string | null;
  battleArmorRank?: string;
}

export interface GlobalLeaderboardData {
  topPvp: LeaderboardUser[];
  topPower: LeaderboardUser[];
  topRaid: {
    rank: number;
    teamName: string;
    bossName: string;
    totalDamage: number;
    leaderName: string;
    clearedAt: string;
  }[];
}
