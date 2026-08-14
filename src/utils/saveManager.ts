import { Player, PlayerStats } from '../types/game';
import { ALL_MARTIAL_SOULS } from '../data/martialSouls';
import { INITIAL_TANG_SECT_SKILLS, CRAFTABLE_HIDDEN_WEAPONS, createInitialTangSectState } from '../data/tangSect';
import { createInitialSpiritPagodaState } from '../data/spiritPagodaData';
import { ICE_FIRE_HERBS } from '../data/immortalHerbs';
import { EIGHT_MERIDIANS, WATERFALL_STAGES, ZIJI_EYE_STAGES_CONFIG, SHREK_COMRADES_DATA } from '../data/cultivation';
import { DEFAULT_AVATAR_URL, ANIME_AVATARS } from '../data/avatars';
import { createInitialBattleArmor } from '../data/battleArmor';
import { INITIAL_SOUL_TOOLS } from '../data/soulTools';
import { INITIAL_DOULUO4_COMPANIONS } from '../data/douluo4Companions';
import { createDefaultAutoBattleStrategy } from '../data/afkStrategyData';
import { createDefaultInterstellarState } from '../data/interstellarData';
import { calculateAllDivineTalentBonuses } from '../data/godTalents';

const SAVE_KEY = 'douluo_dalu_rpg_save_v1';

export const RANDOM_CHARACTER_NAMES = [
  '唐三', '霍雨浩', '唐舞麟', '蓝轩宇', '尘心', '千仞雪',
  '戴沐白', '朱竹清', '马红俊', '古月娜', '波塞西', '独孤博',
  '宁荣荣', '奥斯卡', '小舞', '柳二龙', '比比东', '千道流'
];

export function getRandomMartialSoul(): typeof ALL_MARTIAL_SOULS[0] {
  const randomIndex = Math.floor(Math.random() * ALL_MARTIAL_SOULS.length);
  return ALL_MARTIAL_SOULS[randomIndex];
}

export function createRandomPlayer(customName?: string): Player {
  const primary = getRandomMartialSoul();
  const otherSouls = ALL_MARTIAL_SOULS.filter(s => s.id !== primary.id);
  const secondary = otherSouls[Math.floor(Math.random() * otherSouls.length)] || ALL_MARTIAL_SOULS[1];

  const randomName = customName || RANDOM_CHARACTER_NAMES[Math.floor(Math.random() * RANDOM_CHARACTER_NAMES.length)];
  const randomAvatar = ANIME_AVATARS[Math.floor(Math.random() * ANIME_AVATARS.length)]?.url || DEFAULT_AVATAR_URL;

  const player = createDefaultPlayer(randomName, primary.id, true, secondary.id);
  player.avatarUrl = randomAvatar;
  return player;
}

export function createDefaultPlayer(
  name: string,
  chosenSoulId?: string,
  isTwinSouls: boolean = false,
  secondSoulId?: string
): Player {
  const soul1 = ALL_MARTIAL_SOULS.find(s => s.id === (chosenSoulId || 'haotian_hammer')) || ALL_MARTIAL_SOULS[0];
  
  let soul2;
  if (isTwinSouls) {
    if (secondSoulId) {
      soul2 = ALL_MARTIAL_SOULS.find(s => s.id === secondSoulId);
    }
    if (!soul2) {
      soul2 = ALL_MARTIAL_SOULS.find(s => s.id === (chosenSoulId === 'haotian_hammer' ? 'blue_silver_emperor' : 'haotian_hammer')) || ALL_MARTIAL_SOULS[1];
    }
  }

  const martialSouls = [JSON.parse(JSON.stringify(soul1))];
  if (soul2) {
    martialSouls.push(JSON.parse(JSON.stringify(soul2)));
  }

  const newPlayer: Player = {
    name: name || '唐门弟子',
    avatarUrl: DEFAULT_AVATAR_URL,
    level: 10, // Starts at level 10 ready for first soul ring!
    currentExp: 0,
    expNeeded: 100,
    gold: 1500,
    slaughterScore: 0,
    soulBoneEssence: 200,
    championMedals: 0,
    divineMetals: {
      '百炼精金': 25,
      '灵锻秘银': 10,
      '魂锻赤金': 5,
      '天锻神金': 0
    },

    // Divine God Trials (六大神考)
    seaGodTestLevel: 0,
    asuraGodTestLevel: 0,
    angelGodTestLevel: 0,
    rakshasaGodTestLevel: 0,
    emotionGodTestLevel: 0,
    dragonGodTestLevel: 0,

    seaGodAffinity: 0,
    asuraGodAffinity: 0,
    angelGodAffinity: 0,
    rakshasaGodAffinity: 0,
    emotionGodAffinity: 0,
    dragonGodAffinity: 0,

    // Divine Domains (至高领域)
    hasKillingGodDomain: false,
    hasBlueSilverDomain: false,
    hasAngelDomain: false,
    hasSeaGodDomain: false,
    hasAsuraDomain: false,
    hasRakshasaDomain: false,
    hasDeathDomain: false,
    hasDragonGodDomain: false,
    activeDomain: null,

    // Divine Position & Artifacts (神位与超神器)
    godPosition: null,
    divineArtifacts: [],
    divineSourcePoints: 0,
    divineTalents: {},

    martialSouls,
    activeSoulIndex: 0,

    soulBones: {},

    // Systems
    battleArmor: createInitialBattleArmor(),
    soulTools: JSON.parse(JSON.stringify(INITIAL_SOUL_TOOLS)),
    douluo4Companions: JSON.parse(JSON.stringify(INITIAL_DOULUO4_COMPANIONS)),
    tournamentProgress: {
      currentStageIndex: 0,
      championshipCount: 0,
      championMedals: 0,
      historyTitles: []
    },

    tangSectSkills: JSON.parse(JSON.stringify(INITIAL_TANG_SECT_SKILLS)),
    hiddenWeapons: JSON.parse(JSON.stringify(CRAFTABLE_HIDDEN_WEAPONS)),

    inventory: [
      { id: 'low_spirit_ore', name: '初级玄铁', type: 'material', quantity: 20, description: '打造基础暗器与魂导器的坚硬矿石', icon: 'Shield', price: 10 },
      { id: 'spirit_iron_ore', name: '沉银矿石', type: 'material', quantity: 12, description: '灵锻沉银原矿，打造高阶魂导器与斗铠', icon: 'Hammer', price: 35 },
      { id: 'deep_sea_silver', name: '深海沉银', type: 'material', quantity: 5, description: '深海万丈至宝，天锻神兵绝品主材', icon: 'Sparkles', price: 120 },
      { id: 'meteor_iron', name: '星陨神铁', type: 'material', quantity: 3, description: '九天外坠落天星神金，魂导大炮核心', icon: 'Flame', price: 200 },
      { id: 'high_spirit_crystal', name: '极品魂晶', type: 'material', quantity: 6, description: '高能魂力核心，充能奶瓶与定装法阵', icon: 'Zap', price: 80 },
      { id: 'snake_gall', name: '曼陀罗蛇胆', type: 'consumable', quantity: 5, description: '微毒药材，可解毒或淬炼暗器毒刃', icon: 'Zap', price: 50 },
      { id: 'healing_pill', name: '回春丹', type: 'consumable', quantity: 10, description: '迅速恢复1000点生命值', icon: 'Heart', price: 20 }
    ],
    immortalHerbs: JSON.parse(JSON.stringify(ICE_FIRE_HERBS)),

    arenaBadge: '铁斗魂',
    arenaPoints: 0,
    arenaWins: 0,
    arenaLosses: 0,
    slaughterStreak: 0,
    worldDifficulty: 'normal',
    isMeditationAuto: false,

    // Auto Battle & AFK Strategy
    autoBattleStrategy: undefined, // will be generated below

    // Multi-Path Cultivation State
    cultivation: {
      activeMimicryZoneId: 'thunder_valley',
      spiritArrayLevel: 1,
      accumulatedQiExp: 0,
      lastGatherTime: Date.now(),
      waterfallTrainingCount: 0,
      physiqueLevel: 1,
      hammerStrikeCount: 0,
      unlockedMeridians: [],
      zijiCultivateCount: 0,
      zijiEyeStage: '纵观',
      hasZijiDivineLight: false,
      comradeAffinities: {
        xiaowu: 20,
        mubai: 15,
        zhuqing: 15,
        rongrong: 15,
        oscar: 15,
        hongjun: 15
      }
    },
    interstellar: createDefaultInterstellarState(),
    sect: createInitialTangSectState(),
    spiritPagoda: createInitialSpiritPagodaState()
  };

  newPlayer.autoBattleStrategy = createDefaultAutoBattleStrategy(newPlayer);
  return newPlayer;
}

export function calculatePlayerStats(player: Player): PlayerStats {
  const activeSoul = player.martialSouls[player.activeSoulIndex] || player.martialSouls[0];
  
  // Base stats with level growth
  let maxHp = activeSoul.baseHp + activeSoul.growthHp * player.level;
  let atk = activeSoul.baseAtk + activeSoul.growthAtk * player.level;
  let def = activeSoul.baseDef + activeSoul.growthDef * player.level;
  let speed = activeSoul.baseSpeed + activeSoul.growthSpeed * player.level;
  let critRate = activeSoul.baseCrit;
  let critDmg = 150;
  let penetration = 0;
  let poisonResist = 0;
  let maxSoulPower = 100 + player.level * 25;

  // Tang Sect internal skill buffs (balanced scaling)
  if (player.tangSectSkills) {
    const xuantianLvl = player.tangSectSkills.xuantian?.level || 1;
    maxSoulPower += xuantianLvl * 15;
    maxHp += xuantianLvl * 50;

    const zijiLvl = player.tangSectSkills.ziji?.level || 1;
    critRate += zijiLvl * 1.5;
    critDmg += zijiLvl * 4;

    const guiyingLvl = player.tangSectSkills.guiying?.level || 1;
    speed += guiyingLvl * 2;

    const xuanyuLvl = player.tangSectSkills.xuanyu?.level || 1;
    def += xuanyuLvl * 6;
    poisonResist += xuanyuLvl * 10;

    const kongheLvl = player.tangSectSkills.konghe?.level || 1;
    atk += kongheLvl * 5;
  }

  // Soul Rings bonuses (toned down from extreme stacking)
  activeSoul.skills.forEach((skill) => {
    const bonus = Math.floor(skill.ringYears / 1000);
    maxHp += bonus * 12;
    atk += Math.floor(bonus * 1.8);
    def += Math.floor(bonus * 1.2);
    speed += Math.floor(bonus * 0.15);
    maxSoulPower += 8;
  });

  // Soul Bones bonuses
  Object.values(player.soulBones || {}).forEach((bone) => {
    if (bone) {
      atk += bone.atkBonus || 0;
      def += bone.defBonus || 0;
      maxHp += bone.hpBonus || 0;
      speed += bone.speedBonus || 0;
      critRate += bone.critBonus || 0;
    }
  });

  // Consumed Immortal Herbs
  player.immortalHerbs.forEach((herb) => {
    if (herb.consumed && herb.statsBoost) {
      if (herb.statsBoost.hpMax) maxHp += herb.statsBoost.hpMax;
      if (herb.statsBoost.atk) atk += herb.statsBoost.atk;
      if (herb.statsBoost.def) def += herb.statsBoost.def;
      if (herb.statsBoost.speed) speed += herb.statsBoost.speed;
      if (herb.statsBoost.crit) critRate += herb.statsBoost.crit;
    }
  });

  // Battle Armor (斗铠部件与附体加成)
  if (player.battleArmor) {
    let armorMultiplier = player.battleArmor.setBonusMultiplier || 1.0;
    if (player.battleArmor.isActive) {
      armorMultiplier *= 1.25; // 附体额外25%加成
    }

    Object.values(player.battleArmor.pieces || {}).forEach((piece) => {
      if (piece) {
        atk += (piece.atkBonus || 0) * (piece.level || 1);
        def += (piece.defBonus || 0) * (piece.level || 1);
        maxHp += (piece.hpBonus || 0) * (piece.level || 1);
        speed += (piece.speedBonus || 0) * (piece.level || 1);
        critRate += piece.critBonus || 0;
      }
    });

    if (armorMultiplier > 1.0) {
      atk = Math.floor(atk * armorMultiplier);
      def = Math.floor(def * armorMultiplier);
      maxHp = Math.floor(maxHp * armorMultiplier);
      speed = Math.floor(speed * (1 + (armorMultiplier - 1) * 0.5));
    }
  }

  // Soul Tools (已装备魂导器加成)
  if (player.soulTools) {
    player.soulTools.filter(st => st.isEquipped && st.isUnlocked).forEach((st) => {
      atk += st.atkBonus || 0;
      def += st.defBonus || 0;
      maxHp += st.hpBonus || 0;
      speed += st.speedBonus || 0;
    });
  }

  // Douluo 4 Companions Squad Passive Auras (斗罗4上阵伙伴战队光环)
  if (player.douluo4Companions) {
    const squad = player.douluo4Companions.filter(c => c.isRecruited && c.isInSquad);
    squad.forEach((companion) => {
      const aura = companion.passiveAura?.statsBoost;
      if (aura) {
        const starRatio = 1 + (companion.star - 1) * 0.2;
        if (aura.atkPercent) atk = Math.floor(atk * (1 + (aura.atkPercent * starRatio) / 100));
        if (aura.defPercent) def = Math.floor(def * (1 + (aura.defPercent * starRatio) / 100));
        if (aura.hpPercent) maxHp = Math.floor(maxHp * (1 + (aura.hpPercent * starRatio) / 100));
        if (aura.speedPercent) speed = Math.floor(speed * (1 + (aura.speedPercent * starRatio) / 100));
        if (aura.critRate) critRate += aura.critRate;
      }
    });
  }

  // Interstellar Mecha & Star Fleet Buffs (机甲与星际旗舰属性加成)
  if (player.interstellar) {
    // Equipped Mechas
    const equippedMechas = player.interstellar.mechas?.filter(m => m.isEquipped && m.isUnlocked) || [];
    equippedMechas.forEach(mecha => {
      const lvlMultiplier = 1 + (mecha.level - 1) * 0.15;
      atk += Math.floor(mecha.atkBonus * lvlMultiplier);
      def += Math.floor(mecha.defBonus * lvlMultiplier);
      maxHp += Math.floor(mecha.hpBonus * lvlMultiplier);
      speed += Math.floor(mecha.speedBonus * lvlMultiplier);
      critRate += mecha.critBonus || 0;
    });

    // Active Flagship command aura
    const flagship = player.interstellar.starships?.find(s => s.id === player.interstellar?.activeFlagshipId && s.isUnlocked);
    if (flagship) {
      atk += Math.floor(flagship.cannonAtk * 0.1);
      maxHp += Math.floor(flagship.hullHp * 0.05);
      def += Math.floor(flagship.shield * 0.05);
    }
  }

  // Tang Sect Halls & Sect Prestige Buffs (唐门总坛与堂口属性加成)
  if (player.sect && player.sect.isEstablished) {
    Object.values(player.sect.halls || {}).forEach((hall) => {
      const lvlMultiplier = 1 + (hall.level - 1) * 0.25;
      atk += Math.floor((hall.statsBonus.atk || 0) * lvlMultiplier);
      def += Math.floor((hall.statsBonus.def || 0) * lvlMultiplier);
      maxHp += Math.floor((hall.statsBonus.hp || 0) * lvlMultiplier);
      speed += Math.floor((hall.statsBonus.speed || 0) * lvlMultiplier);
      critRate += (hall.statsBonus.critRate || 0) * 100 * lvlMultiplier;
    });

    // Sect rank bonus multiplier
    const rankBonusPct = Math.min(30, (player.sect.sectLevel - 1) * 3);
    if (rankBonusPct > 0) {
      atk = Math.floor(atk * (1 + rankBonusPct / 100));
      def = Math.floor(def * (1 + rankBonusPct / 100));
      maxHp = Math.floor(maxHp * (1 + rankBonusPct / 100));
    }
  }

  // Spirit Pagoda, Battling Spirit Souls & Mechas (传灵塔、魂灵协同作战与神级机甲属性加成)
  if (player.spiritPagoda && player.spiritPagoda.isEstablished) {
    const pagoda = player.spiritPagoda;
    
    // 1. Active Battling Spirit Souls stats & aura
    const battlingSoulIds = pagoda.activeBattlingSoulIds || [];
    (pagoda.spiritSouls || []).forEach(soul => {
      if (soul.isContracted && (battlingSoulIds.includes(soul.id) || soul.isBattling)) {
        const lvlMultiplier = 1 + (soul.level - 1) * 0.2;
        atk += Math.floor(soul.statsBonus.atk * lvlMultiplier);
        def += Math.floor(soul.statsBonus.def * lvlMultiplier);
        maxHp += Math.floor(soul.statsBonus.hp * lvlMultiplier);
        speed += Math.floor(soul.statsBonus.speed * lvlMultiplier);
        critRate += soul.statsBonus.critRate * lvlMultiplier;

        // Passive Aura boost
        if (soul.passiveAura && soul.passiveAura.boostPct > 0) {
          const auraPct = soul.passiveAura.boostPct / 100;
          atk += Math.floor(atk * auraPct * 0.5);
          def += Math.floor(def * auraPct * 0.5);
          maxHp += Math.floor(maxHp * auraPct * 0.5);
        }
      }
    });

    // 2. Continental Spirit Beast Peace Index Buff (魂兽和平指数光环)
    const peaceIndex = pagoda.spiritBeastPeaceIndex || 50;
    if (peaceIndex > 50) {
      const peaceBuffPct = (peaceIndex - 50) * 0.3; // Up to +15%
      atk = Math.floor(atk * (1 + peaceBuffPct / 100));
      maxHp = Math.floor(maxHp * (1 + peaceBuffPct / 100));
      critRate += (peaceBuffPct * 0.5);
    }

    // 3. Pagoda Rank Title Bonus
    const pagodaRankBonus = (pagoda.pagodaLevel - 1) * 4; // Up to +20%
    if (pagodaRankBonus > 0) {
      atk = Math.floor(atk * (1 + pagodaRankBonus / 100));
      def = Math.floor(def * (1 + pagodaRankBonus / 100));
    }

    // 4. Equipped Mecha Stats (出战驾驶的机甲属性)
    if (pagoda.activeMechaId) {
      const activeMecha = (pagoda.craftedMechas || []).find(m => m.id === pagoda.activeMechaId && m.isCrafted);
      if (activeMecha) {
        atk += activeMecha.combatStats.atk;
        def += activeMecha.combatStats.def;
        maxHp += activeMecha.combatStats.hp;
        speed += activeMecha.combatStats.speed;
      }
    }
  }

  // Divine Artifacts bonuses (balanced)
  if (player.divineArtifacts && player.divineArtifacts.length > 0) {
    player.divineArtifacts.forEach(() => {
      atk += 160;
      def += 100;
      maxHp += 850;
      penetration += 5;
      critRate += 3;
    });
  }

  // Divine Talent Trees Bonuses (神祇天赋树加成)
  if (player.divineTalents) {
    const divineBonuses = calculateAllDivineTalentBonuses(player.divineTalents);
    if (divineBonuses.attackPercent > 0) atk = Math.floor(atk * (1 + (divineBonuses.attackPercent * 0.6) / 100));
    if (divineBonuses.hpPercent > 0) maxHp = Math.floor(maxHp * (1 + (divineBonuses.hpPercent * 0.6) / 100));
    if (divineBonuses.defPercent > 0) def = Math.floor(def * (1 + (divineBonuses.defPercent * 0.6) / 100));
    if (divineBonuses.critRate > 0) critRate += Math.floor(divineBonuses.critRate * 0.6);
    if (divineBonuses.critDamage > 0) critDmg += Math.floor(divineBonuses.critDamage * 0.6);
    if (divineBonuses.soulPowerCap > 0) maxSoulPower += Math.floor(divineBonuses.soulPowerCap * 0.6);
    if (divineBonuses.speedBonus > 0) speed += Math.floor(divineBonuses.speedBonus * 0.6);
  }

  // Cultivation System Stat Boosts (经脉洗髓、瀑布炼体、紫极魔瞳、七怪共鸣)
  if (player.cultivation) {
    // 1. 奇经八脉
    const unlocked = player.cultivation.unlockedMeridians || [];
    unlocked.forEach(meridianId => {
      const meridian = EIGHT_MERIDIANS.find(m => m.id === meridianId);
      if (meridian) {
        if (meridian.statsBonus.atk) atk += Math.floor(meridian.statsBonus.atk * 0.5);
        if (meridian.statsBonus.def) def += Math.floor(meridian.statsBonus.def * 0.5);
        if (meridian.statsBonus.hp) maxHp += Math.floor(meridian.statsBonus.hp * 0.5);
        if (meridian.statsBonus.speed) speed += Math.floor(meridian.statsBonus.speed * 0.5);
        if (meridian.statsBonus.soulPower) maxSoulPower += Math.floor(meridian.statsBonus.soulPower * 0.5);
        if (meridian.statsBonus.critRate) critRate += Math.floor(meridian.statsBonus.critRate * 0.5);
        if (meridian.statsBonus.critDmg) critDmg += Math.floor(meridian.statsBonus.critDmg * 0.5);
        if (meridian.statsBonus.penetration) penetration += Math.floor(meridian.statsBonus.penetration * 0.5);
        if (meridian.statsBonus.poisonResist) poisonResist += Math.floor(meridian.statsBonus.poisonResist * 0.5);
      }
    });

    // 2. 瀑布体魄负重
    const physLvl = player.cultivation.physiqueLevel || 1;
    for (let i = 0; i < physLvl - 1; i++) {
      const stage = WATERFALL_STAGES[i];
      if (stage) {
        maxHp += Math.floor(stage.hpGain * 0.4);
        atk += Math.floor(stage.atkGain * 0.4);
      }
    }

    // 3. 紫极魔瞳境界加成
    const currentZijiStage = player.cultivation.zijiEyeStage || '纵观';
    const zijiConfig = ZIJI_EYE_STAGES_CONFIG.find(z => z.stage === currentZijiStage);
    if (zijiConfig) {
      critRate += Math.floor(zijiConfig.critRateBonus * 0.5);
      critDmg += Math.floor(zijiConfig.critDmgBonus * 0.5);
    }

    // 4. 史莱克七怪武魂共鸣合修加成
    const affinities = player.cultivation.comradeAffinities || {};
    Object.entries(affinities).forEach(([cid, aff]) => {
      const comrade = SHREK_COMRADES_DATA.find(c => c.id === cid);
      if (comrade && aff > 0) {
        const ratio = aff / 200;
        if (comrade.baseBoost.atk) atk += Math.floor(comrade.baseBoost.atk * ratio);
        if (comrade.baseBoost.def) def += Math.floor(comrade.baseBoost.def * ratio);
        if (comrade.baseBoost.hp) maxHp += Math.floor(comrade.baseBoost.hp * ratio);
        if (comrade.baseBoost.speed) speed += Math.floor(comrade.baseBoost.speed * ratio);
        if (comrade.baseBoost.critRate) critRate += Math.floor(comrade.baseBoost.critRate * ratio);
      }
    });
  }

  // Godhood / Domain bonus (balanced values)
  if (player.hasKillingGodDomain || player.hasAsuraDomain) {
    atk = Math.floor(atk * 1.08);
    critRate += 6;
    penetration += 8;
  }
  if (player.hasBlueSilverDomain) {
    maxHp = Math.floor(maxHp * 1.08);
  }
  if (player.hasSeaGodDomain) {
    atk = Math.floor(atk * 1.06);
    def = Math.floor(def * 1.06);
    maxHp = Math.floor(maxHp * 1.06);
  }
  if (player.hasAngelDomain) {
    atk = Math.floor(atk * 1.06);
    def = Math.floor(def * 1.05);
    speed = Math.floor(speed * 1.05);
  }
  if (player.hasRakshasaDomain || player.hasDeathDomain) {
    atk = Math.floor(atk * 1.07);
    poisonResist += 15;
    critDmg += 10;
  }

  // Level 100 or Godhood Ascended (fair endgame scaling)
  if (player.level >= 100 || player.godPosition) {
    atk = Math.floor(atk * 1.25);
    maxHp = Math.floor(maxHp * 1.25);
    def = Math.floor(def * 1.2);
    speed = Math.floor(speed * 1.1);
    critRate = Math.min(100, critRate + 8);
    critDmg += 15;
  }

  return {
    hp: maxHp,
    maxHp,
    soulPower: maxSoulPower,
    maxSoulPower,
    atk: Math.floor(atk),
    def: Math.floor(def),
    speed: Math.floor(speed),
    critRate: Math.min(100, Math.floor(critRate)),
    critDmg: Math.floor(critDmg),
    penetration,
    poisonResist: Math.min(100, poisonResist)
  };
}

export function savePlayer(player: Player): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(player));
  } catch (err) {
    console.error('Failed to save game state', err);
  }
}

export function loadPlayer(): Player | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.name && data.martialSouls) {
        // Ensure avatar is populated with pretty anime girl avatar
        if (!data.avatarUrl) data.avatarUrl = DEFAULT_AVATAR_URL;

        // Ensure missing fields are populated
        if (data.seaGodTestLevel === undefined) data.seaGodTestLevel = 0;
        if (data.asuraGodTestLevel === undefined) data.asuraGodTestLevel = 0;
        if (data.angelGodTestLevel === undefined) data.angelGodTestLevel = 0;
        if (data.rakshasaGodTestLevel === undefined) data.rakshasaGodTestLevel = 0;
        if (data.emotionGodTestLevel === undefined) data.emotionGodTestLevel = 0;
        if (data.dragonGodTestLevel === undefined) data.dragonGodTestLevel = 0;

        if (data.seaGodAffinity === undefined) data.seaGodAffinity = 0;
        if (data.asuraGodAffinity === undefined) data.asuraGodAffinity = 0;
        if (data.angelGodAffinity === undefined) data.angelGodAffinity = 0;
        if (data.rakshasaGodAffinity === undefined) data.rakshasaGodAffinity = 0;
        if (data.emotionGodAffinity === undefined) data.emotionGodAffinity = 0;
        if (data.dragonGodAffinity === undefined) data.dragonGodAffinity = 0;

        if (data.hasKillingGodDomain === undefined) data.hasKillingGodDomain = false;
        if (data.hasBlueSilverDomain === undefined) data.hasBlueSilverDomain = false;
        if (data.hasAngelDomain === undefined) data.hasAngelDomain = false;
        if (data.hasSeaGodDomain === undefined) data.hasSeaGodDomain = false;
        if (data.hasAsuraDomain === undefined) data.hasAsuraDomain = false;
        if (data.hasRakshasaDomain === undefined) data.hasRakshasaDomain = false;
        if (data.hasDeathDomain === undefined) data.hasDeathDomain = false;
        if (data.hasDragonGodDomain === undefined) data.hasDragonGodDomain = false;

        if (!data.divineArtifacts) data.divineArtifacts = [];
        if (data.divineSourcePoints === undefined) data.divineSourcePoints = 0;
        if (!data.divineTalents) data.divineTalents = {};

        // Ensure cultivation state is initialized
        if (!data.cultivation) {
          data.cultivation = {
            activeMimicryZoneId: 'thunder_valley',
            spiritArrayLevel: 1,
            accumulatedQiExp: 0,
            lastGatherTime: Date.now(),
            waterfallTrainingCount: 0,
            physiqueLevel: 1,
            hammerStrikeCount: 0,
            unlockedMeridians: [],
            zijiCultivateCount: 0,
            zijiEyeStage: '纵观',
            hasZijiDivineLight: false,
            comradeAffinities: {
              xiaowu: 20,
              mubai: 15,
              zhuqing: 15,
              rongrong: 15,
              oscar: 15,
              hongjun: 15
            }
          };
        } else {
          if (!data.cultivation.unlockedMeridians) data.cultivation.unlockedMeridians = [];
          if (!data.cultivation.activeMimicryZoneId) data.cultivation.activeMimicryZoneId = 'thunder_valley';
          if (!data.cultivation.spiritArrayLevel) data.cultivation.spiritArrayLevel = 1;
          if (data.cultivation.accumulatedQiExp === undefined) data.cultivation.accumulatedQiExp = 0;
          if (!data.cultivation.lastGatherTime) data.cultivation.lastGatherTime = Date.now();
          if (data.cultivation.waterfallTrainingCount === undefined) data.cultivation.waterfallTrainingCount = 0;
          if (!data.cultivation.physiqueLevel) data.cultivation.physiqueLevel = 1;
          if (data.cultivation.hammerStrikeCount === undefined) data.cultivation.hammerStrikeCount = 0;
          if (data.cultivation.zijiCultivateCount === undefined) data.cultivation.zijiCultivateCount = 0;
          if (!data.cultivation.zijiEyeStage) data.cultivation.zijiEyeStage = '纵观';
          if (!data.cultivation.comradeAffinities) {
            data.cultivation.comradeAffinities = {
              xiaowu: 20,
              mubai: 15,
              zhuqing: 15,
              rongrong: 15,
              oscar: 15,
              hongjun: 15
            };
          }
        }

        // Ensure Battle Armor, Soul Tools, Douluo 4 Companions, and Tournament Progress
        if (!data.battleArmor) data.battleArmor = createInitialBattleArmor();
        if (!data.soulTools || data.soulTools.length === 0) data.soulTools = JSON.parse(JSON.stringify(INITIAL_SOUL_TOOLS));
        if (!data.douluo4Companions || data.douluo4Companions.length === 0) data.douluo4Companions = JSON.parse(JSON.stringify(INITIAL_DOULUO4_COMPANIONS));
        if (!data.tournamentProgress) {
          data.tournamentProgress = {
            currentStageIndex: 0,
            championshipCount: 0,
            championMedals: 0,
            historyTitles: []
          };
        }
        if (data.soulBoneEssence === undefined) data.soulBoneEssence = 200;
        if (data.championMedals === undefined) data.championMedals = 0;
        if (!data.worldDifficulty) data.worldDifficulty = 'normal';
        if (!data.divineMetals) {
          data.divineMetals = {
            '百炼精金': 25,
            '灵锻秘银': 10,
            '魂锻赤金': 5,
            '天锻神金': 0
          };
        }

        if (!data.autoBattleStrategy) {
          data.autoBattleStrategy = createDefaultAutoBattleStrategy(data);
        }

        if (!data.interstellar) {
          data.interstellar = createDefaultInterstellarState();
        } else {
          // Ensure all subfields are populated
          if (!data.interstellar.mechas || data.interstellar.mechas.length === 0) {
            data.interstellar.mechas = createDefaultInterstellarState().mechas;
          }
          if (!data.interstellar.fighters || data.interstellar.fighters.length === 0) {
            data.interstellar.fighters = createDefaultInterstellarState().fighters;
          }
          if (!data.interstellar.starships || data.interstellar.starships.length === 0) {
            data.interstellar.starships = createDefaultInterstellarState().starships;
          }
          if (!data.interstellar.cargo) data.interstellar.cargo = [];
          if (data.interstellar.spaceGold === undefined) data.interstellar.spaceGold = 1500;
          if (data.interstellar.starCores === undefined) data.interstellar.starCores = 10;
          if (data.interstellar.defenseMedals === undefined) data.interstellar.defenseMedals = 5;
          if (!data.interstellar.defenseGridLevel) data.interstellar.defenseGridLevel = 1;
          if (data.interstellar.defenseShieldHp === undefined) data.interstellar.defenseShieldHp = 50000;
          if (data.interstellar.maxDefenseShieldHp === undefined) data.interstellar.maxDefenseShieldHp = 50000;
          if (data.interstellar.planetaryPeaceRating === undefined) data.interstellar.planetaryPeaceRating = 100;
          if (!data.interstellar.currentPlanetId) data.interstellar.currentPlanetId = 'bluestar';
          if (!data.interstellar.activeFlagshipId) data.interstellar.activeFlagshipId = 'ship_meteor_corvette';
          if (!data.interstellar.activeExpeditions) data.interstellar.activeExpeditions = [];
          if (data.interstellar.completedExpeditionsCount === undefined) data.interstellar.completedExpeditionsCount = 0;
        }

        if (!data.sect) {
          data.sect = createInitialTangSectState();
        } else {
          const defaultSect = createInitialTangSectState();
          if (data.sect.isEstablished === undefined) data.sect.isEstablished = false;
          if (!data.sect.sectName) data.sect.sectName = '唐门';
          if (!data.sect.halls) data.sect.halls = defaultSect.halls;
          if (!data.sect.visitors || data.sect.visitors.length === 0) data.sect.visitors = defaultSect.visitors;
          if (!data.sect.challenges || data.sect.challenges.length === 0) data.sect.challenges = defaultSect.challenges;
          if (data.sect.sectFunds === undefined) data.sect.sectFunds = 2000;
          if (data.sect.prestige === undefined) data.sect.prestige = 150;
          if (data.sect.prosperity === undefined) data.sect.prosperity = 100;
          if (data.sect.totalDisciples === undefined) data.sect.totalDisciples = 50;
          if (data.sect.sectLevel === undefined) data.sect.sectLevel = 1;
        }

        if (!data.spiritPagoda) {
          data.spiritPagoda = createInitialSpiritPagodaState();
        } else {
          const defaultPagoda = createInitialSpiritPagodaState();
          if (data.spiritPagoda.isEstablished === undefined) data.spiritPagoda.isEstablished = true;
          if (!data.spiritPagoda.pagodaName) data.spiritPagoda.pagodaName = '传灵塔';
          if (!data.spiritPagoda.spiritSouls || data.spiritPagoda.spiritSouls.length === 0) data.spiritPagoda.spiritSouls = defaultPagoda.spiritSouls;
          if (!data.spiritPagoda.activeBattlingSoulIds) data.spiritPagoda.activeBattlingSoulIds = defaultPagoda.activeBattlingSoulIds;
          if (!data.spiritPagoda.craftedMechas || data.spiritPagoda.craftedMechas.length === 0) data.spiritPagoda.craftedMechas = defaultPagoda.craftedMechas;
          if (!data.spiritPagoda.sanctuaries || data.spiritPagoda.sanctuaries.length === 0) data.spiritPagoda.sanctuaries = defaultPagoda.sanctuaries;
          if (!data.spiritPagoda.ascensionStages || data.spiritPagoda.ascensionStages.length === 0) data.spiritPagoda.ascensionStages = defaultPagoda.ascensionStages;
          if (data.spiritPagoda.spiritCrystals === undefined) data.spiritPagoda.spiritCrystals = 120;
          if (data.spiritPagoda.pagodaMerits === undefined) data.spiritPagoda.pagodaMerits = 150;
          if (data.spiritPagoda.spiritBeastPeaceIndex === undefined) data.spiritPagoda.spiritBeastPeaceIndex = 68;
          if (data.spiritPagoda.pagodaLevel === undefined) data.spiritPagoda.pagodaLevel = 1;
        }

        return data;
      }
    }
  } catch (err) {
    console.error('Failed to load game state', err);
  }
  return null;
}

export function clearSave(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SAVE_KEY);
}
