import { BattleArmorRank, BattleArmorSlot, BattleArmorPiece, BattleArmorSet } from '../types/game';

export interface BattleArmorRankMeta {
  rank: BattleArmorRank;
  title: string;
  nameLength: number; // e.g., 1 word, 2 words, 3 words...
  colorClass: string;
  glowClass: string;
  requiredLevel: number;
  multiplier: number;
  craftMetal: string;
  costPerPiece: number;
  skillName: string;
  skillDesc: string;
}

export const BATTLE_ARMOR_RANKS: BattleArmorRankMeta[] = [
  {
    rank: 'one_word',
    title: '一字斗铠',
    nameLength: 1,
    colorClass: 'text-amber-300 border-amber-500/50 bg-amber-950/40',
    glowClass: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]',
    requiredLevel: 40,
    multiplier: 1.15,
    craftMetal: '百锻沉金',
    costPerPiece: 10,
    skillName: '一字铠·魂力共鸣',
    skillDesc: '激活核心法阵，减少20%魂力消耗，全属性提升15%！'
  },
  {
    rank: 'two_word',
    title: '二字斗铠',
    nameLength: 2,
    colorClass: 'text-purple-300 border-purple-500/50 bg-purple-950/40',
    glowClass: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    requiredLevel: 60,
    multiplier: 1.30,
    craftMetal: '灵锻秘银',
    costPerPiece: 20,
    skillName: '二字铠·有灵附体',
    skillDesc: '斗铠与肉身有灵相合，泛起炫光：攻击与防御提升30%，行动条提速25%！'
  },
  {
    rank: 'three_word',
    title: '三字斗铠',
    nameLength: 3,
    colorClass: 'text-rose-300 border-rose-500/50 bg-rose-950/40',
    glowClass: 'shadow-[0_0_25px_rgba(244,63,94,0.5)]',
    requiredLevel: 80,
    multiplier: 1.50,
    craftMetal: '魂锻赤金',
    costPerPiece: 35,
    skillName: '三字铠·领域觉醒',
    skillDesc: '觉醒斗铠本命领域，获得50%控制抗性，暴击率与暴击伤害提升40%！'
  },
  {
    rank: 'four_word',
    title: '四字斗铠',
    nameLength: 4,
    colorClass: 'text-yellow-300 border-yellow-400 bg-yellow-950/50',
    glowClass: 'shadow-[0_0_30px_rgba(234,179,8,0.7)]',
    requiredLevel: 95,
    multiplier: 1.80,
    craftMetal: '天锻神金',
    costPerPiece: 50,
    skillName: '四字铠·半神守护',
    skillDesc: '赋予真正独立的灵智与半神神性！触发【真神护体】，抵消3次致命攻击并反弹全额伤害！'
  },
  {
    rank: 'five_word',
    title: '五字神铠',
    nameLength: 5,
    colorClass: 'text-cyan-200 border-cyan-400 bg-cyan-950/60',
    glowClass: 'shadow-[0_0_40px_rgba(6,182,212,0.9)]',
    requiredLevel: 100,
    multiplier: 2.30,
    craftMetal: '至高创世神石',
    costPerPiece: 80,
    skillName: '五字铠·至高神祇',
    skillDesc: '超神器级神铠！激活【至尊龙皇天御】：全属性翻倍，魂技伤害增幅150%！'
  }
];

export const BATTLE_ARMOR_SLOTS: { slot: BattleArmorSlot; name: string; icon: string; statDesc: string }[] = [
  { slot: 'helm', name: '斗铠·头盔', icon: 'Crown', statDesc: '气血 + 暴击' },
  { slot: 'cuirass', name: '斗铠·胸铠', icon: 'Shield', statDesc: '防御 + 最大气血' },
  { slot: 'shoulders', name: '斗铠·肩铠', icon: 'ShieldAlert', statDesc: '防御 + 伤害减免' },
  { slot: 'gauntlets', name: '斗铠·臂铠', icon: 'Swords', statDesc: '攻击 + 穿透破甲' },
  { slot: 'greaves', name: '斗铠·腿铠', icon: 'Zap', statDesc: '速度 + 防御' },
  { slot: 'boots', name: '斗铠·战靴', icon: 'Flame', statDesc: '速度 + 闪避' },
  { slot: 'wings', name: '斗铠·天翼', icon: 'Sparkles', statDesc: '先手行动 + 全面增幅' },
];

export function createInitialBattleArmor(): BattleArmorSet {
  return {
    customName: '龙皇',
    rank: 'none',
    rankTitle: '未锻造',
    pieces: {},
    isActive: false,
    activeSkillName: '斗铠初始',
    activeSkillDesc: '锻造并集齐全部7件斗铠部位以激活套装属性与专属斗铠技能！',
    setBonusMultiplier: 1.0
  };
}


