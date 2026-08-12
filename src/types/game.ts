/**
 * Douluo Dalu (Soul Land) RPG - Game Types & Interfaces
 */

import { InterstellarState } from './interstellar';
import { TangSectState } from './sect';
import { SpiritPagodaState } from './spiritPagoda';

export * from './sect';
export * from './spiritPagoda';

export type MartialSoulType = 'tool' | 'beast' | 'god' | 'plant';

export type WorldDifficulty = 'normal' | 'nightmare' | 'godlike';

export type SoulRingColor = 'white' | 'yellow' | 'purple' | 'black' | 'red' | 'gold';

export interface SoulSkill {
  id: string;
  name: string;
  ringOrder: number; // 1 ~ 9
  ringYears: number; // e.g. 420, 1500, 20000, 100000
  ringColor: SoulRingColor;
  soulPowerCost: number;
  cooldown: number; // in turns
  currentCooldown?: number;
  description: string;
  damageMultiplier?: number; // e.g., 2.5x ATK
  healMultiplier?: number;
  shieldMultiplier?: number;
  buffType?: 'atk' | 'def' | 'speed' | 'crit' | 'all';
  buffValue?: number;
  buffDuration?: number;
  debuffType?: 'stun' | 'poison' | 'bleed' | 'paralyze' | 'burn' | 'silence' | 'weaken';
  debuffDuration?: number;
  isAvatar?: boolean; // 第七魂技 武魂真身
  isDomain?: boolean; // 领域技能
  animationType?: 'slash' | 'smash' | 'lightning' | 'fire' | 'poison' | 'sacred' | 'heal' | 'domain';
}

export interface MartialSoul {
  id: string;
  name: string;
  chineseName: string;
  type: MartialSoulType;
  category?: 'attack' | 'agility' | 'control' | 'support' | 'god';
  description: string;
  iconName: string;
  baseAtk: number;
  baseDef: number;
  baseHp: number;
  baseSpeed: number;
  baseCrit: number;
  growthAtk: number;
  growthDef: number;
  growthHp: number;
  growthSpeed: number;
  element: 'physical' | 'plant' | 'fire' | 'thunder' | 'light' | 'dark' | 'poison' | 'divine' | 'ice';
  skills: SoulSkill[];
  isEvolved?: boolean;
  evolvedName?: string;
  avatarActive?: boolean;
}

export type SoulBoneSlot = 'head' | 'torso' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg' | 'external';

export interface SoulBone {
  id: string;
  name: string;
  slot: SoulBoneSlot;
  years: number;
  color: SoulRingColor;
  sourceBeast: string;
  description: string;
  atkBonus: number;
  defBonus: number;
  hpBonus: number;
  speedBonus: number;
  critBonus: number;
  skillName?: string;
  skillDesc?: string;
  skillCooldown?: number;
  equipped?: boolean;
}

export interface TangSectSkill {
  id: 'xuantian' | 'ziji' | 'guiying' | 'xuanyu' | 'konghe';
  name: string;
  chineseName: string;
  level: number; // 1 to 5
  maxLevel: number;
  stageName: string;
  description: string;
  effectDescription: string;
  exp: number;
  maxExp: number;
}

export interface HiddenWeapon {
  id: string;
  name: string;
  rank: 'low' | 'mid' | 'high' | 'god';
  quantity: number;
  damage: number;
  penetration: number; // ignore def %
  effect?: 'poison' | 'bleed' | 'instant_kill_chance' | 'aoe_burst';
  effectChance?: number;
  description: string;
  materialsNeeded: { itemId: string; count: number }[];
}

export interface ImmortalHerb {
  id: string;
  name: string;
  chineseName: string;
  description: string;
  effectDesc: string;
  consumed: boolean;
  targetSoulId?: string; // which soul it evolves
  rarity: 'rare' | 'immortal' | 'divine';
  statsBoost: {
    soulPowerLevel?: number;
    hpMax?: number;
    atk?: number;
    def?: number;
    speed?: number;
    crit?: number;
  };
}

export interface Item {
  id: string;
  name: string;
  type: 'material' | 'consumable' | 'ore' | 'herb' | 'beast_core';
  quantity: number;
  description: string;
  icon: string;
  price: number;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  soulPower: number; // Current combat soul power / MP
  maxSoulPower: number;
  atk: number;
  def: number;
  speed: number;
  critRate: number; // 0 ~ 100
  critDmg: number; // e.g. 150%
  penetration: number;
  poisonResist: number;
}

export type SoulRankTitle =
  | '魂士' // 1-10
  | '魂师' // 11-20
  | '大魂师' // 21-30
  | '魂尊' // 31-40
  | '魂宗' // 41-50
  | '魂王' // 51-60
  | '魂帝' // 61-70
  | '魂圣' // 71-80
  | '魂斗罗' // 81-90
  | '封号斗罗' // 91-98
  | '绝世斗罗' // 99
  | '百级神祗'; // 100

export type ArenaBadge = '铁斗魂' | '铜斗魂' | '银斗魂' | '金斗魂' | '紫金斗魂' | '蓝宝石' | '红宝石' | '钻石斗魂';

export interface Player {
  name: string;
  avatarUrl?: string; // Pretty anime avatar
  level: number; // 1 to 100
  currentExp: number;
  expNeeded: number;
  gold: number;
  slaughterScore: number;
  soulBoneEssence?: number; // 魂骨精华，用于魂骨年份强化
  championMedals?: number; // 斗魂大赛冠军勋章
  divineMetals?: { [key: string]: number }; // 沉银、百炼精金、灵锻秘银、天锻神金
  stats?: PlayerStats;

  // Divine God Trials (四大神考)
  seaGodTestLevel: number; // 0 to 9
  asuraGodTestLevel: number; // 0 to 9
  angelGodTestLevel: number; // 0 to 9
  rakshasaGodTestLevel: number; // 0 to 9

  seaGodAffinity: number; // 0 to 100%
  asuraGodAffinity: number; // 0 to 100%
  angelGodAffinity: number; // 0 to 100%
  rakshasaGodAffinity: number; // 0 to 100%

  // Divine Domains (至高领域)
  hasKillingGodDomain: boolean; // 杀神领域
  hasBlueSilverDomain: boolean; // 蓝银领域
  hasAngelDomain: boolean; // 天使领域
  hasSeaGodDomain: boolean; // 海神领域
  hasAsuraDomain: boolean; // 修罗神领域
  hasRakshasaDomain: boolean; // 罗刹领域
  hasDeathDomain: boolean; // 死亡领域
  activeDomain?: string | null;

  // Divine Position & Artifacts (神位与超神器)
  godPosition?: '海神' | '修罗神' | '天使神' | '罗刹神' | '海神 & 修罗双神' | null;
  divineArtifacts: string[]; // e.g. '海神三叉戟', '修罗魔剑', '天使圣剑', '罗刹魔镰'

  // Martial Souls (supports Twin Souls)
  martialSouls: MartialSoul[];
  activeSoulIndex: number; // 0 or 1

  // Soul Bones
  soulBones: {
    head?: SoulBone;
    torso?: SoulBone;
    leftArm?: SoulBone;
    rightArm?: SoulBone;
    leftLeg?: SoulBone;
    rightLeg?: SoulBone;
    external?: SoulBone; // 八蛛矛 / 暗金恐爪
  };

  // Battle Armor System (一字到五字斗铠)
  battleArmor?: BattleArmorSet;

  // Soul Tools System (1~10级魂导器)
  soulTools?: SoulTool[];

  // Douluo 4 Companions (斗罗大陆4伙伴战队)
  douluo4Companions?: Douluo4Companion[];

  // Tournament Progress (斗魂大赛)
  tournamentProgress?: TournamentProgress;

  // Tang Sect
  tangSectSkills: {
    xuantian: TangSectSkill;
    ziji: TangSectSkill;
    guiying: TangSectSkill;
    xuanyu: TangSectSkill;
    konghe: TangSectSkill;
  };
  hiddenWeapons: HiddenWeapon[];

  // Inventory
  inventory: Item[];
  immortalHerbs: ImmortalHerb[];

  // Arena & Trials Progress
  arenaBadge: ArenaBadge;
  arenaPoints: number;
  arenaWins: number;
  arenaLosses: number;
  slaughterStreak: number; // 0 to 100
  worldDifficulty?: WorldDifficulty; // 'normal' | 'nightmare' | 'godlike'

  // Auto Combat & AFK Strategy Settings (挂机策略设置)
  autoBattleStrategy?: AutoBattleStrategy;

  // Material Mining & Gathering Expeditions (神材采掘与矿脉派遣)
  miningEnergy?: number; // 0 ~ 100 勘探体力
  maxMiningEnergy?: number; // default 100
  lastEnergyRegenTime?: number;
  miningDispatch?: { [zoneId: string]: MiningDispatchState };

  // Cultivation state & Multi-Path Training Systems (多元修练体系)
  isMeditationAuto?: boolean;
  lastMeditationTime?: number;
  cultivation?: {
    // 拟态环境挂机与阵法
    activeMimicryZoneId: string;
    spiritArrayLevel: number; // 聚灵法阵等级 1~10
    accumulatedQiExp: number; // 阵法积攒修为
    lastGatherTime: number; // 上次收取时间戳

    // 瀑布负重与乱披风体魄
    waterfallTrainingCount: number;
    physiqueLevel: number; // 1~5
    hammerStrikeCount: number; // 乱披风挥锤数

    // 奇经八脉洗髓
    unlockedMeridians: string[]; // ['dumai', 'renmai', ...]

    // 紫极魔瞳紫气东来
    zijiCultivateCount: number;
    zijiEyeStage: '纵观' | '入微' | '芥子' | '浩瀚';
    hasZijiDivineLight: boolean; // 是否解锁紫极神光

    // 史莱克七怪武魂共鸣合修
    comradeAffinities: { [key: string]: number };
  };

  // Interstellar Hangar, Star Fleet & Planetary Trade (星际机甲、宇宙战舰与行星贸易防卫)
  interstellar?: InterstellarState;

  // Tang Sect Establishment & Continental Sect Operations (唐门立宗、堂口、万宗贸易与战帖)
  sect?: TangSectState;

  // Spirit Pagoda & Spirit Soul Companions (传灵塔、魂灵并肩作战、升灵台与机甲神造)
  spiritPagoda?: SpiritPagodaState;
}

export type BattleArmorRank = 'none' | 'one_word' | 'two_word' | 'three_word' | 'four_word' | 'five_word';

export type BattleArmorSlot = 'helm' | 'cuirass' | 'shoulders' | 'gauntlets' | 'greaves' | 'boots' | 'wings';

export interface BattleArmorPiece {
  id: string;
  slot: BattleArmorSlot;
  slotName: string;
  name: string;
  rank: BattleArmorRank;
  rankName: string;
  level: number; // 1 to 10
  atkBonus: number;
  defBonus: number;
  hpBonus: number;
  speedBonus: number;
  critBonus: number;
  craftMetalName: string;
  craftMetalCount: number;
}

export interface BattleArmorSet {
  customName: string; // e.g. "龙皇", "冰魔", "天圣", "金龙月语"
  rank: BattleArmorRank;
  rankTitle: string; // "一字斗铠", "二字斗铠", "三字斗铠", "四字斗铠", "五字神铠"
  pieces: {
    helm?: BattleArmorPiece;
    cuirass?: BattleArmorPiece;
    shoulders?: BattleArmorPiece;
    gauntlets?: BattleArmorPiece;
    greaves?: BattleArmorPiece;
    boots?: BattleArmorPiece;
    wings?: BattleArmorPiece;
  };
  isActive: boolean; // 斗铠附体
  activeSkillName: string;
  activeSkillDesc: string;
  setBonusMultiplier: number; // e.g. 1.25 (25% all stats)
}

export type SoulToolType = 'attack' | 'defense' | 'assist' | 'artifact';

export interface SoulTool {
  id: string;
  name: string;
  rank: number; // 1 to 10
  type: SoulToolType;
  description: string;
  icon: string;
  atkBonus: number;
  defBonus: number;
  hpBonus: number;
  speedBonus: number;
  soulCost: number;
  cooldown: number;
  currentCooldown?: number;
  activeSkill: {
    name: string;
    description: string;
    damageMultiplier?: number;
    shieldMultiplier?: number;
    healMultiplier?: number;
    effect?: string;
  };
  isEquipped: boolean;
  isUnlocked: boolean;
  materialsNeeded: { itemId: string; name: string; count: number }[];
}

export interface Douluo4Companion {
  id: string;
  name: string;
  title: string;
  martialSoul: string;
  avatarUrl: string;
  themeColor: string;
  level: number; // 1 to 100
  affinity: number; // 0 to 100 好感度
  star: number; // 1 to 5 星级
  isRecruited: boolean;
  isInSquad: boolean; // 是否上阵 (最多3人)
  description: string;
  background: string;
  baseAtk: number;
  baseDef: number;
  baseHp: number;
  baseSpeed: number;
  skills: {
    name: string;
    desc: string;
    damageMultiplier: number;
    cooldown: number;
    currentCd?: number;
    effect?: string;
    isFusion?: boolean; // 武魂融合技
  }[];
  passiveAura: {
    name: string;
    desc: string;
    statsBoost: {
      atkPercent?: number;
      defPercent?: number;
      hpPercent?: number;
      speedPercent?: number;
      critRate?: number;
    };
  };
}

export interface TournamentStage {
  id: string;
  name: string; // e.g. "预选赛·第一轮", "总决赛·武魂殿巅峰战"
  group: 'preliminary' | 'qualifier' | 'finals' | 'federation';
  groupName: string;
  teamName: string;
  teamDesc: string;
  captainName: string;
  level: number;
  badge: ArenaBadge;
  teamBuff: string;
  members: { name: string; martialSoul: string; role: string; avatarText: string }[];
  rewardExp: number;
  rewardGold: number;
  rewardMedals: number;
  rewardSoulBoneChance: number;
  rewardSoulBoneName?: string;
  cleared: boolean;
}

export interface TournamentProgress {
  currentStageIndex: number;
  championshipCount: number;
  championMedals: number;
  historyTitles: string[];
}

export interface SoulBoneSanctuaryTrial {
  id: string;
  name: string;
  desc: string;
  guardianName: string;
  years: number;
  slot: SoulBoneSlot;
  recommendedLevel: number;
  rewardBoneName: string;
  rewardBoneDesc: string;
  rewardBoneYears: number;
  cleared: boolean;
  bossHp: number;
  bossAtk: number;
  bossDef: number;
}

export interface SoulBoneAuctionItem {
  id: string;
  bone: SoulBone;
  currentBid: number;
  buyoutPrice: number;
  seller: string;
  sold: boolean;
}

export interface MeridianInfo {
  id: string;
  name: string;
  chineseName: string;
  acupoints: string[];
  expCost: number;
  bonusDesc: string;
  statsBonus: {
    atk?: number;
    def?: number;
    hp?: number;
    soulPower?: number;
    speed?: number;
    critRate?: number;
    critDmg?: number;
    penetration?: number;
    poisonResist?: number;
  };
}

export interface MimicryZoneInfo {
  id: string;
  name: string;
  chineseName: string;
  description: string;
  matchedElements: string[];
  expMultiplier: number;
  environmentBuff: string;
  bgGradient: string;
  colorClass: string;
}

export interface ShrekComradeInfo {
  id: string;
  name: string;
  title: string;
  martialSoul: string;
  description: string;
  avatarText: string;
  colorTheme: string;
  synergySkill: string;
  synergyBuffDesc: string;
  baseBoost: {
    atk?: number;
    def?: number;
    hp?: number;
    speed?: number;
    critRate?: number;
  };
}

export interface SoulBeast {
  id: string;
  name: string;
  chineseName: string;
  minYears: number;
  maxYears: number;
  years: number;
  color: SoulRingColor;
  habitat: 'outer' | 'middle' | 'core' | 'lake' | 'north' | 'sunset' | 'sea';
  description: string;
  element: string;
  level: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  speed: number;
  skills: {
    name: string;
    description: string;
    damageMultiplier: number;
    effect?: string;
  }[];
  dropRing: {
    skillNameTemplate: string;
    skillDescTemplate: string;
    multiplier: number;
  };
  possibleBone?: {
    slot: SoulBoneSlot;
    name: string;
    dropRate: number; // 0 ~ 1
  };
  dropItems: { itemId: string; name: string; dropRate: number; count: number }[];
}

export interface CombatEntity {
  id: string;
  name: string;
  isPlayer: boolean;
  avatarIcon: string;
  level: number;
  rankTitle?: string;
  hp: number;
  maxHp: number;
  soulPower: number;
  maxSoulPower: number;
  atk: number;
  def: number;
  speed: number;
  critRate: number;
  shield: number;
  actionGauge: number; // 0 ~ 1000 for turn meter
  buffs: {
    id: string;
    name: string;
    type: 'atk' | 'def' | 'speed' | 'crit' | 'shield' | 'domain' | 'avatar' | 'invincible';
    value: number;
    turnsLeft: number;
  }[];
  debuffs: {
    id: string;
    name: string;
    type: 'stun' | 'poison' | 'bleed' | 'burn' | 'paralyze' | 'silence' | 'weaken';
    value: number;
    turnsLeft: number;
  }[];
  soulRings: { years: number; color: SoulRingColor }[];
  skills: SoulSkill[];
  boneSkills?: { name: string; desc: string; cd: number; currentCd: number; damage: number }[];
  hiddenWeapons?: HiddenWeapon[];
}

export interface CombatLog {
  id: string;
  turn: number;
  actorName: string;
  actionText: string;
  type: 'attack' | 'skill' | 'heal' | 'buff' | 'debuff' | 'crit' | 'dodge' | 'hidden_weapon' | 'death' | 'domain';
  damageValue?: number;
  isCritical?: boolean;
}

export interface ArenaOpponent {
  id: string;
  name: string;
  title: string;
  level: number;
  martialSoulName: string;
  soulRings: { years: number; color: SoulRingColor }[];
  hp: number;
  atk: number;
  def: number;
  speed: number;
  badge: ArenaBadge;
  skills: { name: string; desc: string; multiplier: number; soulCost: number; cd: number }[];
  rewardGold: number;
  rewardPoints: number;
}

// ----------------------------------------------------
// AUTO BATTLE & AFK STRATEGY TYPES (挂机策略设置)
// ----------------------------------------------------

export type CombatTacticalStance = 
  | 'burst'      // 强攻爆发流：优先释放高倍率强攻魂技、万年/十万年奥义与斗铠降世，追求极致秒杀
  | 'control'    // 控制压制流：优先释放眩晕/束缚/冰冻/麻痹等控制魂技与领域，锁死敌方行动
  | 'sustain'    // 防御续航流：血量受损时优先开启护盾/玄天功回气/定装无敌护罩，拉扯反打
  | 'combo'      // 战队连携流：控场起手 -> 召唤斗罗4伙伴合击 -> 强攻斩杀 -> 魂骨补刀
  | 'custom';    // 自定义技能队列排序

export interface SkillPriorityItem {
  id: string; // unique identifier (e.g. "skill_1", "battle_armor", "soul_tool", "companion_blue", "bone_torso")
  type: 'soul_skill' | 'battle_armor' | 'soul_tool' | 'companion' | 'soul_bone' | 'potion' | 'basic';
  name: string;
  category: 'attack' | 'control' | 'defense' | 'buff' | 'special';
  categoryName: string;
  description: string;
  soulCost?: number;
  cooldown?: number;
  priorityOrder: number; // 1, 2, 3...
  isEnabled: boolean;
}

export interface AutoBattleStrategy {
  tacticalStance: CombatTacticalStance;
  prioritySkillCategory: 'attack' | 'control' | 'defense' | 'balanced';
  skillPriorityList: SkillPriorityItem[];
  autoBattleArmor: 'instant' | 'low_hp' | 'never'; // 斗铠附体时机：战斗伊始/生命低于50%/手动
  autoSoulTool: 'always' | 'execute' | 'never'; // 定装魂导器：冷却好即放/敌方血量低于50%/手动
  autoCompanions: boolean; // 是否自动召唤斗罗4伙伴合击
  autoDomain: boolean; // 是否自动开启杀神/至高领域
  autoHiddenWeapons: boolean; // 是否自动投掷唐门暗器
  autoPotionHpThreshold: number; // 吞服回春丹血量阈值 (百分比，如 35%)
  defenseShieldHpThreshold: number; // 触发保命护盾/无敌罩血量阈值 (百分比，如 50%)
  mpReserveThreshold: number; // 魂力保留红线 (百分比，如 15%)
  offlineBonusWinRate: number; // 基于战术计算的挂机额外胜率增幅 (+15% ~ +35%)
  
  // 离线/拟态挂机历练记录
  isAfkHuntingEnabled?: boolean;
  afkHuntingZoneName?: string;
  afkLogs?: string[];
  totalAfkVictories?: number;
  lastAfkRewardTimestamp?: number;
}

// ----------------------------------------------------
// MATERIAL MINING & GATHERING EXPEDITION TYPES (神材采掘与矿脉)
// ----------------------------------------------------

export interface ProducedMaterialMeta {
  itemId: string;
  name: string;
  isDivineMetal?: boolean; // If true, credited to player.divineMetals[name]
  type: 'metal' | 'poison' | 'crystal' | 'god_material';
  typeName: string;
  dropChance: number; // 0 ~ 1
  baseCount: [number, number]; // [min, max]
  description: string;
  icon: string;
  targetSystem: 'battle_armor' | 'hidden_weapon' | 'soul_tool' | 'both';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'godly';
}

export interface MiningVeinZone {
  id: string;
  name: string;
  category: 'gengxin_city' | 'forest_swamp' | 'sea_abyss';
  categoryName: string;
  subtitle: string;
  description: string;
  requiredLevel: number;
  bannerBg: string;
  badgeColor: string;
  icon: string;
  accentColor: string;
  producedMaterials: ProducedMaterialMeta[];
  staminaCost: number;
  expPerGather: number;
  goldPerGather: number;
  tangSkillBonusDesc: string;
  tangSkillKey?: 'ziji' | 'xuanyu' | 'konghe' | 'xuantian' | 'guiying' | 'anqi';
  hazardWarning?: string;
}

export interface MiningDispatchState {
  zoneId: string;
  dispatchedAt: number; // timestamp
  workerCount: number; // 1~3
  lastCollectTime: number;
}

