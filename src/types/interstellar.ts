export type MechaGrade = 'white' | 'yellow' | 'purple' | 'black' | 'red';

export interface MechaSkill {
  name: string;
  desc: string;
  dmgMultiplier: number;
  cooldownTurns: number;
}

export interface Mecha {
  id: string;
  name: string;
  grade: MechaGrade;
  gradeName: string;
  level: number; // 1 to 10
  type: 'assault' | 'heavy' | 'stealth' | 'god';
  typeName: string;
  description: string;
  icon: string;
  powerRating: number;
  hpBonus: number;
  atkBonus: number;
  defBonus: number;
  speedBonus: number;
  critBonus: number;
  specialSkill: MechaSkill;
  isUnlocked: boolean;
  isEquipped: boolean;
  pilotCompanionId?: string; // e.g. 'lan_xuanyu', 'bai_xiuxiu'
  pilotName?: string;
  cost: {
    gold: number;
    spaceGold?: number;
    starCores?: number;
    metals: { [key: string]: number };
  };
  upgradeCost: {
    gold: number;
    spaceGold?: number;
    starCores?: number;
    metals: { [key: string]: number };
  };
  modules: {
    weapon: string;
    armor: string;
    thruster: string;
  };
}

export type FighterGrade = 'standard' | 'elite' | 'ace' | 'god';

export interface FighterJet {
  id: string;
  name: string;
  grade: FighterGrade;
  gradeName: string;
  type: 'interceptor' | 'bomber' | 'stealth' | 'god';
  typeName: string;
  description: string;
  level: number;
  atk: number;
  speed: number;
  shield: number;
  specialWeapon: string;
  isUnlocked: boolean;
  isInHangar: boolean;
  cost: {
    gold: number;
    spaceGold?: number;
    starCores?: number;
    metals: { [key: string]: number };
  };
}

export type StarshipClass = 'corvette' | 'destroyer' | 'cruiser' | 'battleship' | 'carrier' | 'flagship';

export interface Starship {
  id: string;
  name: string;
  shipClass: StarshipClass;
  className: string;
  level: number;
  hullHp: number;
  maxHullHp: number;
  shield: number;
  maxShield: number;
  cannonAtk: number;
  fighterCapacity: number;
  cargoCapacity: number;
  mainWeaponName: string;
  mainWeaponDesc: string;
  isUnlocked: boolean;
  isFlagship: boolean;
  cost: {
    gold: number;
    spaceGold?: number;
    starCores?: number;
    metals: { [key: string]: number };
  };
}

export type PlanetId = 'bluestar' | 'pegasus' | 'dragon' | 'sin_planet' | 'senluo' | 'elven';

export interface TradeGood {
  goodId: string;
  name: string;
  category: 'ore' | 'energy' | 'biotech' | 'relic' | 'weapon';
  categoryName: string;
  basePrice: number;
  currentPrice: number;
  trend: 'surging' | 'rising' | 'stable' | 'falling' | 'crashing';
  stock: number;
  description: string;
  icon: string;
}

export interface PlanetInfo {
  id: PlanetId;
  name: string;
  title: string;
  description: string;
  affiliation: string;
  distanceLightYears: number;
  warpEnergyCost: number;
  dangerLevel: 'safe' | 'moderate' | 'perilous' | 'extreme';
  themeColor: string;
  bgGradient: string;
  tradeGoods: TradeGood[];
  specialFeatures: string[];
  exclusiveMissions?: {
    id: string;
    title: string;
    demandGoodId: string;
    demandCount: number;
    rewardSpaceGold: number;
    rewardStarCores: number;
    rewardMedals: number;
    isCompleted: boolean;
  }[];
}

export interface CargoItem {
  goodId: string;
  name: string;
  quantity: number;
  buyAvgPrice: number;
}

export interface SpaceEvent {
  id: string;
  title: string;
  type: 'salvage' | 'pirate' | 'wormhole' | 'trade_caravan' | 'anomaly';
  description: string;
  options: {
    text: string;
    effectType: 'gain_reward' | 'space_fight' | 'trade_bargain' | 'risk_gamble';
    rewardDesc: string;
  }[];
}

export interface AlienSpecialSkill {
  name: string;
  desc: string;
  dmg: number;
  shieldPenetration?: number;
}

export interface AlienInvasionFleet {
  id: string;
  name: string;
  faction: string;
  commander: string;
  description: string;
  threatLevel: 'B' | 'A' | 'S' | 'SS' | 'SSS';
  fleetHp: number;
  maxFleetHp: number;
  shieldHp: number;
  maxShieldHp: number;
  fleetAtk: number;
  specialSkills: AlienSpecialSkill[];
  rewards: {
    spaceGold: number;
    starCores: number;
    defenseMedals: number;
    divineMetals?: { [key: string]: number };
    droppedBlueprintName?: string;
  };
}

export interface SpaceBattleLog {
  id: string;
  text: string;
  type: 'player' | 'enemy' | 'system' | 'critical' | 'heal';
  timestamp: number;
}

export type ExpeditionRisk = 'safe' | 'low' | 'moderate' | 'high' | 'legendary';

export interface ExpeditionDestination {
  id: string;
  name: string;
  targetPlanetId: PlanetId | 'deep_space';
  targetPlanetName: string;
  durationSeconds: number;
  requiredFleetPower: number;
  riskLevel: ExpeditionRisk;
  riskTitle: string;
  description: string;
  icon: string;
  badgeColor: string;
  rewards: {
    spaceGold: number;
    starCores: number;
    defenseMedals: number;
    divineMetals: { [metalName: string]: number };
    specialGoodName?: string;
  };
}

export interface ActiveTradeExpedition {
  id: string;
  destinationId: string;
  destinationName: string;
  targetPlanetName: string;
  assignedShipId: string;
  assignedShipName: string;
  assignedShipClass: string;
  powerScore: number;
  startTime: number;
  durationSeconds: number;
  endTime: number;
  isClaimed: boolean;
  rewards: {
    spaceGold: number;
    starCores: number;
    defenseMedals: number;
    divineMetals: { [metalName: string]: number };
    specialGoodName?: string;
  };
}

export interface InterstellarState {
  currentPlanetId: PlanetId;
  spaceGold: number; // 联邦星币
  starCores: number; // 星海源晶
  defenseMedals: number; // 星域荣耀勋章
  
  // Blue Star Defense Grid
  defenseGridLevel: number; // 1 to 10
  defenseShieldHp: number;
  maxDefenseShieldHp: number;
  planetaryPeaceRating: number; // 0 to 100

  // Fleets & Hangar
  mechas: Mecha[];
  fighters: FighterJet[];
  starships: Starship[];
  activeFlagshipId: string;

  // Cargo & Trade
  cargo: CargoItem[];
  cargoCapacity: number;
  tradeHistoryCount: number;
  totalTradeProfits: number;

  // Repelled Alien Incursions count
  repelledInvasionsCount: number;
  lastDailyMarketRefresh?: number;

  // Interstellar Trade Expeditions (战舰委派自动远征)
  activeExpeditions?: ActiveTradeExpedition[];
  completedExpeditionsCount?: number;
}
