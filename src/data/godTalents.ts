import { GodType } from './godTrials';

export interface GodTalentNode {
  id: string;
  godType: GodType;
  name: string;
  icon: string; // emoji or lucide icon key
  tier: number; // 1, 2, 3, 4
  maxRank: number; // max rank (e.g., 3 or 5)
  costPerRank: number; // default 1
  prerequisiteId?: string;
  reqTreePoints?: number;
  description: string;
  statEffectText: (rank: number) => string;
  statBonusPerRank: {
    attackPercent?: number;
    hpPercent?: number;
    defPercent?: number;
    critRate?: number;
    critDamage?: number;
    damageBoost?: number;
    damageReduction?: number;
    lifesteal?: number;
    soulPowerCap?: number;
    speedBonus?: number;
  };
}

export interface GodTalentTree {
  godType: GodType;
  godName: string;
  subtitle: string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    glow: string;
    gradient: string;
    activeBorder: string;
  };
  nodes: GodTalentNode[];
}

export const GOD_TALENT_TREES: GodTalentTree[] = [
  // 1. 海神天赋树 (Sea God)
  {
    godType: 'seagod',
    godName: '海神·波塞冬',
    subtitle: '浩瀚汪洋 · 瀚海神威与水元素主宰',
    themeColor: {
      bg: 'bg-cyan-950/80',
      border: 'border-cyan-500/50',
      text: 'text-cyan-300',
      glow: 'rgba(6,182,212,0.6)',
      gradient: 'from-cyan-900/90 via-blue-900/80 to-slate-900',
      activeBorder: 'border-cyan-400'
    },
    nodes: [
      {
        id: 'sea_t1_1',
        godType: 'seagod',
        name: '瀚海心法',
        icon: '🌊',
        tier: 1,
        maxRank: 5,
        costPerRank: 1,
        description: '融合浩瀚汪洋生灵气运，提升气血上限与水元素抗性。',
        statEffectText: (rank) => `生命上限 +${rank * 4}%，全减伤 +${rank * 2}%`,
        statBonusPerRank: { hpPercent: 4, damageReduction: 2 }
      },
      {
        id: 'sea_t1_2',
        godType: 'seagod',
        name: '碧波狂浪',
        icon: '💦',
        tier: 1,
        maxRank: 5,
        costPerRank: 1,
        description: '将魂力化为无休止的重叠涛浪，提高自身攻击力与法术威力。',
        statEffectText: (rank) => `攻击力 +${rank * 3}%，技能伤害 +${rank * 3}%`,
        statBonusPerRank: { attackPercent: 3, damageBoost: 3 }
      },
      {
        id: 'sea_t2_1',
        godType: 'seagod',
        name: '黄金十三式·无定风波',
        icon: '🔱',
        tier: 2,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'sea_t1_1',
        reqTreePoints: 3,
        description: '海神三叉戟第一式！限制强敌并大幅提升自身会心打击概率。',
        statEffectText: (rank) => `暴击率 +${rank * 4}%，暴击伤害 +${rank * 8}%`,
        statBonusPerRank: { critRate: 4, critDamage: 8 }
      },
      {
        id: 'sea_t2_2',
        godType: 'seagod',
        name: '瀚海护体神光',
        icon: '🛡️',
        tier: 2,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'sea_t1_2',
        reqTreePoints: 3,
        description: '在周身凝聚海神护体结界，提高物理与魔法防御。',
        statEffectText: (rank) => `防御力 +${rank * 6}%，减伤 +${rank * 3}%`,
        statBonusPerRank: { defPercent: 6, damageReduction: 3 }
      },
      {
        id: 'sea_t3_1',
        godType: 'seagod',
        name: '万流归宗神核',
        icon: '🌌',
        tier: 3,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'sea_t2_1',
        reqTreePoints: 8,
        description: '引动诸天汪洋信仰之力，扩张最大魂力存储上限与迅捷敏捷。',
        statEffectText: (rank) => `魂力上限 +${rank * 150}，速度 +${rank * 10}`,
        statBonusPerRank: { soulPowerCap: 150, speedBonus: 10 }
      },
      {
        id: 'sea_t4_1',
        godType: 'seagod',
        name: '海神·灭世风暴 (神王主宰)',
        icon: '👑',
        tier: 4,
        maxRank: 1,
        costPerRank: 2,
        prerequisiteId: 'sea_t3_1',
        reqTreePoints: 12,
        description: '登临海神神王至高主宰！全伤害爆增，且攻击附带水元素破甲。',
        statEffectText: () => '全局终极伤害 +25%，全属性 +15%',
        statBonusPerRank: { damageBoost: 25, attackPercent: 15, hpPercent: 15 }
      }
    ]
  },

  // 2. 修罗神天赋树 (Asura God)
  {
    godType: 'asura',
    godName: '修罗神·执掌者',
    subtitle: '杀戮审判 · 神界第一执法人',
    themeColor: {
      bg: 'bg-rose-950/80',
      border: 'border-rose-500/50',
      text: 'text-rose-300',
      glow: 'rgba(244,63,94,0.6)',
      gradient: 'from-rose-950/90 via-red-950/80 to-slate-900',
      activeBorder: 'border-rose-400'
    },
    nodes: [
      {
        id: 'asura_t1_1',
        godType: 'asura',
        name: '修罗杀意',
        icon: '🗡️',
        tier: 1,
        maxRank: 5,
        costPerRank: 1,
        description: '将极致杀意凝结于剑锋，无视敌人防御并大幅提升攻击。',
        statEffectText: (rank) => `攻击力 +${rank * 4}%，暴击率 +${rank * 2}%`,
        statBonusPerRank: { attackPercent: 4, critRate: 2 }
      },
      {
        id: 'asura_t1_2',
        godType: 'asura',
        name: '血气沸腾',
        icon: '🩸',
        tier: 1,
        maxRank: 5,
        costPerRank: 1,
        description: '在战场中不断汲取杀戮煞气，提升暴击伤害与生命上限。',
        statEffectText: (rank) => `暴击伤害 +${rank * 10}%，生命上限 +${rank * 3}%`,
        statBonusPerRank: { critDamage: 10, hpPercent: 3 }
      },
      {
        id: 'asura_t2_1',
        godType: 'asura',
        name: '修罗魔剑极意',
        icon: '⚔️',
        tier: 2,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'asura_t1_1',
        reqTreePoints: 3,
        description: '沟通修罗魔剑本体，赋予普通攻击与技能高额生命汲取。',
        statEffectText: (rank) => `生命吸取 +${rank * 5}%，全伤害 +${rank * 4}%`,
        statBonusPerRank: { lifesteal: 5, damageBoost: 4 }
      },
      {
        id: 'asura_t2_2',
        godType: 'asura',
        name: '杀戮领域深造',
        icon: '🩸',
        tier: 2,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'asura_t1_2',
        reqTreePoints: 3,
        description: '强化杀戮领域范围，使自身行动更加迅捷且坚固。',
        statEffectText: (rank) => `防御力 +${rank * 5}%，速度 +${rank * 8}`,
        statBonusPerRank: { defPercent: 5, speedBonus: 8 }
      },
      {
        id: 'asura_t3_1',
        godType: 'asura',
        name: '神界执法天诛',
        icon: '⚖️',
        tier: 3,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'asura_t2_1',
        reqTreePoints: 8,
        description: '以神界执法者之名行天诛之罚，暴击率与攻击大幅飙升。',
        statEffectText: (rank) => `暴击率 +${rank * 5}%，攻击力 +${rank * 5}%`,
        statBonusPerRank: { critRate: 5, attackPercent: 5 }
      },
      {
        id: 'asura_t4_1',
        godType: 'asura',
        name: '修罗·审判天诛斩 (神王主宰)',
        icon: '☠️',
        tier: 4,
        maxRank: 1,
        costPerRank: 2,
        prerequisiteId: 'asura_t3_1',
        reqTreePoints: 12,
        description: '掌控修罗神王终极执法人之力！暴击伤害爆发增长，终极斩杀一切。',
        statEffectText: () => '暴击伤害 +50%，全伤害 +20%，吸血 +10%',
        statBonusPerRank: { critDamage: 50, damageBoost: 20, lifesteal: 10 }
      }
    ]
  },

  // 3. 天使神天赋树 (Angel God)
  {
    godType: 'angel',
    godName: '天使神·千仞雪',
    subtitle: '光明炽阳 · 神圣光辉与天使圣剑',
    themeColor: {
      bg: 'bg-amber-950/80',
      border: 'border-amber-500/50',
      text: 'text-amber-300',
      glow: 'rgba(245,158,11,0.6)',
      gradient: 'from-amber-950/90 via-yellow-950/80 to-slate-900',
      activeBorder: 'border-amber-400'
    },
    nodes: [
      {
        id: 'angel_t1_1',
        godType: 'angel',
        name: '圣光普照',
        icon: '☀️',
        tier: 1,
        maxRank: 5,
        costPerRank: 1,
        description: '太阳真火净化周身邪祟，提升圣光伤害与生命回复。',
        statEffectText: (rank) => `全伤害 +${rank * 3}%，生命上限 +${rank * 4}%`,
        statBonusPerRank: { damageBoost: 3, hpPercent: 4 }
      },
      {
        id: 'angel_t1_2',
        godType: 'angel',
        name: '天使金辉',
        icon: '✨',
        tier: 1,
        maxRank: 5,
        costPerRank: 1,
        description: '神圣金光铸造不灭之躯，提高防御力与减伤效果。',
        statEffectText: (rank) => `防御力 +${rank * 5}%，全减伤 +${rank * 2}%`,
        statBonusPerRank: { defPercent: 5, damageReduction: 2 }
      },
      {
        id: 'angel_t2_1',
        godType: 'angel',
        name: '天使圣剑真意',
        icon: '🗡️',
        tier: 2,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'angel_t1_1',
        reqTreePoints: 3,
        description: '注入太阳金火于天使圣剑，攻击力与暴击率显著增幅。',
        statEffectText: (rank) => `攻击力 +${rank * 5}%，暴击率 +${rank * 3}%`,
        statBonusPerRank: { attackPercent: 5, critRate: 3 }
      },
      {
        id: 'angel_t2_2',
        godType: 'angel',
        name: '净化神辉结界',
        icon: '🛡️',
        tier: 2,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'angel_t1_2',
        reqTreePoints: 3,
        description: '在周身张开大日净化结界，大幅提高魂力上限与减伤。',
        statEffectText: (rank) => `魂力上限 +${rank * 120}，全减伤 +${rank * 3}%`,
        statBonusPerRank: { soulPowerCap: 120, damageReduction: 3 }
      },
      {
        id: 'angel_t3_1',
        godType: 'angel',
        name: '十二翼金阳神皇翼',
        icon: '🪽',
        tier: 3,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'angel_t2_1',
        reqTreePoints: 8,
        description: '舒展十二翼金阳神翼，迅捷翱翔天际并强化暴击效果。',
        statEffectText: (rank) => `速度 +${rank * 12}，暴击伤害 +${rank * 10}%`,
        statBonusPerRank: { speedBonus: 12, critDamage: 10 }
      },
      {
        id: 'angel_t4_1',
        godType: 'angel',
        name: '天使·大日净化斩 (神王主宰)',
        icon: '🌟',
        tier: 4,
        maxRank: 1,
        costPerRank: 2,
        prerequisiteId: 'angel_t3_1',
        reqTreePoints: 12,
        description: '登临光明至高天道主宰！神圣光辉庇佑，全伤害与生存极大突破。',
        statEffectText: () => '全伤害 +30%，全减伤 +15%，生命上限 +20%',
        statBonusPerRank: { damageBoost: 30, damageReduction: 15, hpPercent: 20 }
      }
    ]
  },

  // 4. 罗刹神天赋树 (Rakshasa God)
  {
    godType: 'rakshasa',
    godName: '罗刹神·比比东',
    subtitle: '幽冥魔毒 · 极阴深渊与罗刹魔镰',
    themeColor: {
      bg: 'bg-purple-950/80',
      border: 'border-purple-500/50',
      text: 'text-purple-300',
      glow: 'rgba(168,85,247,0.6)',
      gradient: 'from-purple-950/90 via-fuchsia-950/80 to-slate-900',
      activeBorder: 'border-purple-400'
    },
    nodes: [
      {
        id: 'rak_t1_1',
        godType: 'rakshasa',
        name: '深渊死气',
        icon: '💀',
        tier: 1,
        maxRank: 5,
        costPerRank: 1,
        description: '引深渊九幽死气缠绕，大幅提升攻击力与毒素侵蚀。',
        statEffectText: (rank) => `攻击力 +${rank * 4}%，全伤害 +${rank * 2}%`,
        statBonusPerRank: { attackPercent: 4, damageBoost: 2 }
      },
      {
        id: 'rak_t1_2',
        godType: 'rakshasa',
        name: '幽冥鬼步',
        icon: '👻',
        tier: 1,
        maxRank: 5,
        costPerRank: 1,
        description: '身形如幽冥虚影般穿梭战场，提升攻击速度与会心。',
        statEffectText: (rank) => `速度 +${rank * 6}，暴击率 +${rank * 2}%`,
        statBonusPerRank: { speedBonus: 6, critRate: 2 }
      },
      {
        id: 'rak_t2_1',
        godType: 'rakshasa',
        name: '罗刹魔镰断魂',
        icon: '🌙',
        tier: 2,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'rak_t1_1',
        reqTreePoints: 3,
        description: '握持罗刹魔镰挥舞断魂魔阵，获得高额生命吸取与暴伤。',
        statEffectText: (rank) => `吸血 +${rank * 4}%，暴击伤害 +${rank * 8}%`,
        statBonusPerRank: { lifesteal: 4, critDamage: 8 }
      },
      {
        id: 'rak_t2_2',
        godType: 'rakshasa',
        name: '九幽极阴魔躯',
        icon: '🖤',
        tier: 2,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'rak_t1_2',
        reqTreePoints: 3,
        description: '将九幽魔煞融入肉身，提升生命上限与物理防御。',
        statEffectText: (rank) => `生命上限 +${rank * 5}%，防御力 +${rank * 5}%`,
        statBonusPerRank: { hpPercent: 5, defPercent: 5 }
      },
      {
        id: 'rak_t3_1',
        godType: 'rakshasa',
        name: '深渊原初诅咒',
        icon: '🔮',
        tier: 3,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'rak_t2_1',
        reqTreePoints: 8,
        description: '施展深渊原初魔咒，侵蚀敌人心智并爆增全伤害。',
        statEffectText: (rank) => `全伤害 +${rank * 6}%，攻击力 +${rank * 4}%`,
        statBonusPerRank: { damageBoost: 6, attackPercent: 4 }
      },
      {
        id: 'rak_t4_1',
        godType: 'rakshasa',
        name: '罗刹·幽冥斩仙诀 (神王主宰)',
        icon: '🕷️',
        tier: 4,
        maxRank: 1,
        costPerRank: 2,
        prerequisiteId: 'rak_t3_1',
        reqTreePoints: 12,
        description: '掌控幽冥死神与罗刹女帝神王法相！极致吸血与腐蚀全开。',
        statEffectText: () => '吸血 +15%，暴击率 +20%，全伤害 +25%',
        statBonusPerRank: { lifesteal: 15, critRate: 20, damageBoost: 25 }
      }
    ]
  },

  // 5. 情绪之神天赋树 (Emotion God)
  {
    godType: 'emotion',
    godName: '情绪之神·霍雨浩',
    subtitle: '灵眸浩冬 · 精神识海与极致天眼',
    themeColor: {
      bg: 'bg-sky-950/80',
      border: 'border-sky-500/50',
      text: 'text-sky-300',
      glow: 'rgba(56,189,248,0.6)',
      gradient: 'from-sky-950/90 via-teal-950/80 to-slate-900',
      activeBorder: 'border-sky-400'
    },
    nodes: [
      {
        id: 'emo_t1_1',
        godType: 'emotion',
        name: '灵眸通明',
        icon: '👁️',
        tier: 1,
        maxRank: 5,
        costPerRank: 1,
        description: '百万年灵眸精神识海大开，大幅提高魂力上限与命中率。',
        statEffectText: (rank) => `魂力上限 +${rank * 100}，暴击率 +${rank * 2}%`,
        statBonusPerRank: { soulPowerCap: 100, critRate: 2 }
      },
      {
        id: 'emo_t1_2',
        godType: 'emotion',
        name: '浩冬共鸣',
        icon: '❄️',
        tier: 1,
        maxRank: 5,
        costPerRank: 1,
        description: '浩冬神力相融共鸣，提升极致之冰威力与全技能伤害。',
        statEffectText: (rank) => `全伤害 +${rank * 3}%，速度 +${rank * 5}`,
        statBonusPerRank: { damageBoost: 3, speedBonus: 5 }
      },
      {
        id: 'emo_t2_1',
        godType: 'emotion',
        name: '命运天眼',
        icon: '🔮',
        tier: 2,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'emo_t1_1',
        reqTreePoints: 3,
        description: '开启超神器命运天眼，洞察天地命运因果线，爆发极致暴伤。',
        statEffectText: (rank) => `暴击伤害 +${rank * 10}%，攻击力 +${rank * 4}%`,
        statBonusPerRank: { critDamage: 10, attackPercent: 4 }
      },
      {
        id: 'emo_t2_2',
        godType: 'emotion',
        name: '冰天雪女之护',
        icon: '❄️',
        tier: 2,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'emo_t1_2',
        reqTreePoints: 3,
        description: '雪帝冰极领域守护，大幅提高防御与减伤比例。',
        statEffectText: (rank) => `防御力 +${rank * 6}%，全减伤 +${rank * 3}%`,
        statBonusPerRank: { defPercent: 6, damageReduction: 3 }
      },
      {
        id: 'emo_t3_1',
        godType: 'emotion',
        name: '七彩情绪神光',
        icon: '🌈',
        tier: 3,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'emo_t2_1',
        reqTreePoints: 8,
        description: '融汇喜怒哀乐爱恶欲七彩情绪，大幅增幅生命与全伤害。',
        statEffectText: (rank) => `生命上限 +${rank * 6}%，全伤害 +${rank * 5}%`,
        statBonusPerRank: { hpPercent: 6, damageBoost: 5 }
      },
      {
        id: 'emo_t4_1',
        godType: 'emotion',
        name: '情绪·浩冬永恒神光 (神王主宰)',
        icon: '💎',
        tier: 4,
        maxRank: 1,
        costPerRank: 2,
        prerequisiteId: 'emo_t3_1',
        reqTreePoints: 12,
        description: '掌管万界情感与命运的至高神王！暴击率、暴伤与全属性全面暴涨。',
        statEffectText: () => '暴击率 +25%，暴击伤害 +40%，全伤害 +20%',
        statBonusPerRank: { critRate: 25, critDamage: 40, damageBoost: 20 }
      }
    ]
  },
  // 6. 龙神天赋树 (Dragon God)
  {
    godType: 'dragongod',
    godName: '至高龙神·蓝轩宇/唐舞麟',
    subtitle: '万龙朝圣 · 黄金龙力量与银龙九彩元素至尊',
    themeColor: {
      bg: 'bg-amber-950/80',
      border: 'border-amber-400/50',
      text: 'text-amber-200',
      glow: 'rgba(245,158,11,0.6)',
      gradient: 'from-amber-900/90 via-yellow-900/80 to-emerald-950',
      activeBorder: 'border-amber-300'
    },
    nodes: [
      {
        id: 'dragon_t1_1',
        godType: 'dragongod',
        name: '金龙躯体',
        icon: '🐲',
        tier: 1,
        maxRank: 5,
        costPerRank: 1,
        description: '承载黄金龙王不灭血脉，大幅提升基础攻击力与物理破甲。',
        statEffectText: (rank) => `攻击力 +${rank * 4}%，暴击率 +${rank * 2}%`,
        statBonusPerRank: { attackPercent: 4, critRate: 2 }
      },
      {
        id: 'dragon_t1_2',
        godType: 'dragongod',
        name: '九彩元素掌控',
        icon: '🌈',
        tier: 1,
        maxRank: 5,
        costPerRank: 1,
        description: '熔炼银龙王九大元素法则，提升全元素技能伤害与伤害减免。',
        statEffectText: (rank) => `全伤害 +${rank * 3}%，全减伤 +${rank * 2}%`,
        statBonusPerRank: { damageBoost: 3, damageReduction: 2 }
      },
      {
        id: 'dragon_t2_1',
        godType: 'dragongod',
        name: '龙神爪撕裂',
        icon: '💥',
        tier: 2,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'dragon_t1_1',
        reqTreePoints: 3,
        description: '龙神第一杀招！爆裂破空，极大增幅暴击伤害与物理吸血。',
        statEffectText: (rank) => `暴击伤害 +${rank * 10}%，吸血率 +${rank * 3}%`,
        statBonusPerRank: { critDamage: 10, lifesteal: 3 }
      },
      {
        id: 'dragon_t2_2',
        godType: 'dragongod',
        name: '九彩龙鳞壁垒',
        icon: '🛡️',
        tier: 2,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'dragon_t1_2',
        reqTreePoints: 3,
        description: '凝练九彩龙鳞神圣铠甲，大幅强化气血上限与防御倍率。',
        statEffectText: (rank) => `生命上限 +${rank * 5}%，防御力 +${rank * 5}%`,
        statBonusPerRank: { hpPercent: 5, defPercent: 5 }
      },
      {
        id: 'dragon_t3_1',
        godType: 'dragongod',
        name: '龙神核心聚变',
        icon: '🔮',
        tier: 3,
        maxRank: 3,
        costPerRank: 1,
        prerequisiteId: 'dragon_t2_1',
        reqTreePoints: 8,
        description: '龙神核心威能全开，提升魂力上限与出手速度。',
        statEffectText: (rank) => `魂力上限 +${rank * 30}，敏捷速度 +${rank * 10}`,
        statBonusPerRank: { soulPowerCap: 30, speedBonus: 10 }
      },
      {
        id: 'dragon_t4_1',
        godType: 'dragongod',
        name: '至高龙神·万龙朝圣 (宇宙神王)',
        icon: '👑',
        tier: 4,
        maxRank: 1,
        costPerRank: 2,
        prerequisiteId: 'dragon_t3_1',
        reqTreePoints: 12,
        description: '万龙朝圣至高法则！攻击力、暴击与全技能伤害迎来毁灭性暴涨！',
        statEffectText: () => '攻击力 +30%，暴击率 +20%，全伤害 +25%',
        statBonusPerRank: { attackPercent: 30, critRate: 20, damageBoost: 25 }
      }
    ]
  }
];

/**
 * Calculates total accumulated stat bonuses from all allocated divine talent nodes.
 */
export function calculateAllDivineTalentBonuses(divineTalents?: {
  [godType: string]: { [talentId: string]: number };
}) {
  const totals = {
    attackPercent: 0,
    hpPercent: 0,
    defPercent: 0,
    critRate: 0,
    critDamage: 0,
    damageBoost: 0,
    damageReduction: 0,
    lifesteal: 0,
    soulPowerCap: 0,
    speedBonus: 0
  };

  if (!divineTalents) return totals;

  for (const tree of GOD_TALENT_TREES) {
    const godAllocated = divineTalents[tree.godType] || {};
    for (const node of tree.nodes) {
      const rank = godAllocated[node.id] || 0;
      if (rank > 0) {
        const bonus = node.statBonusPerRank;
        if (bonus.attackPercent) totals.attackPercent += bonus.attackPercent * rank;
        if (bonus.hpPercent) totals.hpPercent += bonus.hpPercent * rank;
        if (bonus.defPercent) totals.defPercent += bonus.defPercent * rank;
        if (bonus.critRate) totals.critRate += bonus.critRate * rank;
        if (bonus.critDamage) totals.critDamage += bonus.critDamage * rank;
        if (bonus.damageBoost) totals.damageBoost += bonus.damageBoost * rank;
        if (bonus.damageReduction) totals.damageReduction += bonus.damageReduction * rank;
        if (bonus.lifesteal) totals.lifesteal += bonus.lifesteal * rank;
        if (bonus.soulPowerCap) totals.soulPowerCap += bonus.soulPowerCap * rank;
        if (bonus.speedBonus) totals.speedBonus += bonus.speedBonus * rank;
      }
    }
  }

  return totals;
}

/**
 * Calculates total spent points in a given god talent tree.
 */
export function getSpentPointsInGodTree(
  godType: GodType,
  divineTalents?: { [godType: string]: { [talentId: string]: number } }
): number {
  if (!divineTalents || !divineTalents[godType]) return 0;
  const godAllocated = divineTalents[godType];
  let sum = 0;
  const tree = GOD_TALENT_TREES.find((t) => t.godType === godType);
  if (!tree) return 0;

  for (const node of tree.nodes) {
    const rank = godAllocated[node.id] || 0;
    sum += rank * node.costPerRank;
  }
  return sum;
}
