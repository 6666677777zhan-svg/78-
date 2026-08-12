export type SpiritSoulRarity = 
  | 'hundred' 
  | 'thousand' 
  | 'tenthousand' 
  | 'hundredthousand' 
  | 'thirtytenthousand' 
  | 'million' 
  | 'divine_beast';

export interface SpiritSoulSkill {
  name: string;
  chineseName: string;
  desc: string;
  damageMultiplier: number;
  cooldownTurns: number;
  currentCooldown?: number;
  healAmount?: number;
  shieldAmount?: number;
  debuffEffect?: string;
  spiritEffect: string; // e.g. "大寒无雪：极寒绝对冰封敌方并造成 350% 冰系穿透神伤"
  animationType: 'ice' | 'mental' | 'dark' | 'light' | 'poison' | 'wood' | 'gold' | 'dragon';
}

export interface SpiritSoul {
  id: string;
  name: string;
  beastTitle: string;
  rarity: SpiritSoulRarity;
  rarityTitle: string;
  years: number; // e.g. 10000, 390000, 700000, 1000000
  element: 'ice' | 'mental' | 'dark' | 'light' | 'poison' | 'wood' | 'gold' | 'dragon';
  icon: string;
  avatarUrl: string;
  level: number; // 1 to 10
  isContracted: boolean; // 是否已缔结契约
  isBattling: boolean; // 是否出战并肩作战 (最多3位)
  statsBonus: {
    atk: number;
    def: number;
    hp: number;
    speed: number;
    critRate: number;
  };
  passiveAura: {
    name: string;
    desc: string;
    boostPct: number;
  };
  spiritSkill: SpiritSoulSkill;
  contractCost: {
    gold: number;
    spiritCrystals: number;
    requiredPagodaRank: number;
  };
  evolutionCost: {
    spiritCrystals: number;
    gold: number;
  };
  lore: string;
  species: string;
  synergyGroup: string; // e.g. "极北三天王", "星斗凶兽", "仙草通灵", "创世龙神"
}

export interface SpiritAscensionStage {
  id: string;
  name: string;
  stageLevel: number;
  difficulty: string;
  difficultyColor: string;
  description: string;
  bossName: string;
  bossTitle: string;
  bossHp: number;
  bossAtk: number;
  bossDef: number;
  recommendedLevel: number;
  rewards: {
    exp: number;
    gold: number;
    spiritCrystals: number;
    yearsGain: number;
    peaceIndexGain: number;
  };
  unlocked: boolean;
  clearedCount: number;
}

export interface SpiritBeastSanctuaryZone {
  id: string;
  name: string;
  description: string;
  guardianName: string;
  guardianTitle: string;
  peaceLevel: number; // 0 to 100
  sanctuaryFunds: number;
  dailyHerbGift: string;
  buffEffect: string;
  donateCostGold: number;
}

export type MechaGrade = 'yellow' | 'purple' | 'black' | 'red' | 'god';

export interface MechaCraftingRecipe {
  id: string;
  name: string;
  grade: MechaGrade;
  gradeName: string;
  gradeColor: string;
  type: 'assault' | 'heavy' | 'stealth' | 'god';
  typeName: string;
  description: string;
  craftCost: {
    gold: number;
    spiritCrystals: number;
    metals: { [key: string]: number };
  };
  combatStats: {
    hp: number;
    atk: number;
    def: number;
    speed: number;
    shield: number;
  };
  mechaWeapon: {
    name: string;
    desc: string;
    dmgMultiplier: number;
    cooldown: number;
  };
  isCrafted: boolean;
  isEquipped: boolean;
}

export interface SpiritPagodaState {
  isEstablished: boolean;
  pagodaName: string;
  pagodaLevel: number; // 1: 传灵使, 2: 巡察使, 3: 传灵殿主, 4: 传灵长老, 5: 议会副塔主, 6: 万古总塔主
  pagodaTitle: string;
  pagodaMerits: number; // 传灵功勋
  spiritCrystals: number; // 升灵晶石
  spiritBeastPeaceIndex: number; // 0 ~ 100 魂兽和平指数 / 保护度
  lastPeaceRainClaimTimestamp: number;
  spiritSouls: SpiritSoul[];
  activeBattlingSoulIds: string[]; // Up to 3 spirit souls fighting together with human master
  craftedMechas: MechaCraftingRecipe[];
  activeMechaId: string | null;
  sanctuaries: SpiritBeastSanctuaryZone[];
  ascensionStages: SpiritAscensionStage[];
  totalSoulBeastsSaved: number;
  ascensionClearedCount: number;
}
