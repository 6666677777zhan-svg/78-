import { MartialSoul } from '../types/game';

export const ALL_MARTIAL_SOULS: MartialSoul[] = [
  // 1. 昊天锤
  {
    id: 'haotian_hammer',
    name: '昊天锤',
    chineseName: '昊天锤',
    type: 'tool',
    category: 'attack',
    description: '天下第一宗门昊天宗传承器武魂，名震斗罗大陆。纯粹力量的极致——乱披风风雷一锤定音，大须弥锤破天灭世！',
    iconName: 'Hammer',
    baseAtk: 48,
    baseDef: 24,
    baseHp: 320,
    baseSpeed: 18,
    baseCrit: 15,
    growthAtk: 8.5,
    growthDef: 3.5,
    growthHp: 45,
    growthSpeed: 1.2,
    element: 'physical',
    skills: [],
  },

  // 2. 蓝银皇
  {
    id: 'blue_silver_emperor',
    name: '蓝银皇',
    chineseName: '蓝银皇',
    type: 'plant',
    category: 'control',
    description: '植物系至高帝王武魂。生生不息的庞大生命力，具备毁天灭地的范围控制、麻痹神经剧毒与野火烧不尽的坚韧恢复！',
    iconName: 'Sprout',
    baseAtk: 28,
    baseDef: 30,
    baseHp: 420,
    baseSpeed: 24,
    baseCrit: 8,
    growthAtk: 5.2,
    growthDef: 4.8,
    growthHp: 65,
    growthSpeed: 2.0,
    element: 'plant',
    skills: [],
  },

  // 3. 七杀剑
  {
    id: 'seven_kill_sword',
    name: '七杀剑',
    chineseName: '七杀剑',
    type: 'tool',
    category: 'attack',
    description: '大陆第一杀伐攻击器武魂，剑道尘心一脉传承。一剑出而风云变——七杀领域与万剑归宗斩尽天下邪祟！',
    iconName: 'Sword',
    baseAtk: 52,
    baseDef: 20,
    baseHp: 310,
    baseSpeed: 26,
    baseCrit: 22,
    growthAtk: 9.0,
    growthDef: 2.8,
    growthHp: 42,
    growthSpeed: 2.2,
    element: 'physical',
    skills: [],
  },

  // 4. 六翼天使
  {
    id: 'seraphim',
    name: '六翼天使',
    chineseName: '六翼天使',
    type: 'god',
    category: 'god',
    description: '武魂殿教皇一脉神赐武魂。掌控至高太阳神火与纯净圣光，先天二十级满魂力，天使领域净化万物！',
    iconName: 'Sun',
    baseAtk: 46,
    baseDef: 28,
    baseHp: 360,
    baseSpeed: 26,
    baseCrit: 16,
    growthAtk: 7.8,
    growthDef: 4.0,
    growthHp: 52,
    growthSpeed: 2.1,
    element: 'light',
    skills: [],
  },

  // 5. 邪眸白虎
  {
    id: 'evil_white_tiger',
    name: '邪眸白虎',
    chineseName: '邪眸白虎',
    type: 'beast',
    category: 'attack',
    description: '星罗帝国皇室传承兽武魂。强攻猛破、攻防一体，白虎金刚变与白虎流星雨威震全场！',
    iconName: 'ShieldAlert',
    baseAtk: 42,
    baseDef: 32,
    baseHp: 380,
    baseSpeed: 22,
    baseCrit: 18,
    growthAtk: 7.2,
    growthDef: 4.2,
    growthHp: 55,
    growthSpeed: 1.6,
    element: 'physical',
    skills: [],
  },

  // 6. 幽冥灵猫
  {
    id: 'nether_civet',
    name: '幽冥灵猫',
    chineseName: '幽冥灵猫',
    type: 'beast',
    category: 'agility',
    description: '暗夜影杀至高敏攻兽武魂。幽冥分身与幽冥斩瞬间爆发致命暴击，疾如飞影，收割无形！',
    iconName: 'Moon',
    baseAtk: 44,
    baseDef: 18,
    baseHp: 300,
    baseSpeed: 35,
    baseCrit: 28,
    growthAtk: 7.6,
    growthDef: 2.8,
    growthHp: 42,
    growthSpeed: 3.0,
    element: 'dark',
    skills: [],
  },

  // 7. 邪火凤凰
  {
    id: 'evil_fire_phoenix',
    name: '邪火凤凰',
    chineseName: '邪火凤凰',
    type: 'beast',
    category: 'attack',
    description: '罕见变异神兽武魂，拥涅槃不灭火与极致之火亲和。凤凰啸天击焚天灭地，伤害毁天灭地！',
    iconName: 'Flame',
    baseAtk: 45,
    baseDef: 22,
    baseHp: 330,
    baseSpeed: 25,
    baseCrit: 20,
    growthAtk: 8.0,
    growthDef: 3.0,
    growthHp: 48,
    growthSpeed: 2.0,
    element: 'fire',
    skills: [],
  },

  // 8. 蓝电霸王龙
  {
    id: 'blue_lightning_dragon',
    name: '蓝电霸王龙',
    chineseName: '蓝电霸王龙',
    type: 'beast',
    category: 'attack',
    description: '上三宗蓝电霸王龙家族顶尖兽武魂。龙化能力强化强悍肉身，掌控万丈滚滚狂雷！',
    iconName: 'Zap',
    baseAtk: 47,
    baseDef: 25,
    baseHp: 350,
    baseSpeed: 23,
    baseCrit: 18,
    growthAtk: 8.2,
    growthDef: 3.4,
    growthHp: 50,
    growthSpeed: 1.8,
    element: 'thunder',
    skills: [],
  },

  // 9. 死亡蛛皇
  {
    id: 'death_spider_emperor',
    name: '死亡蛛皇',
    chineseName: '死亡蛛皇',
    type: 'beast',
    category: 'control',
    description: '武魂殿教皇比比东第一武魂！死亡身体、蛛皇刺与蚀骨剧毒，具备无与伦比的致命毒效与控制力！',
    iconName: 'Skull',
    baseAtk: 45,
    baseDef: 32,
    baseHp: 390,
    baseSpeed: 24,
    baseCrit: 16,
    growthAtk: 7.8,
    growthDef: 4.5,
    growthHp: 58,
    growthSpeed: 1.9,
    element: 'poison',
    skills: [],
  },

  // 10. 噬魂蛛皇
  {
    id: 'soul_eating_spider',
    name: '噬魂蛛皇',
    chineseName: '噬魂蛛皇',
    type: 'beast',
    category: 'attack',
    description: '比比东第二双生武魂！拥有噬魂吸魔、空间裂空镰与毁灭剧毒，令诸神动容恐惧！',
    iconName: 'Sparkles',
    baseAtk: 49,
    baseDef: 26,
    baseHp: 360,
    baseSpeed: 27,
    baseCrit: 20,
    growthAtk: 8.6,
    growthDef: 3.6,
    growthHp: 52,
    growthSpeed: 2.2,
    element: 'dark',
    skills: [],
  },

  // 11. 九宝琉璃塔
  {
    id: 'nine_treasure_pagoda',
    name: '九宝琉璃塔',
    chineseName: '九宝琉璃塔',
    type: 'tool',
    category: 'support',
    description: '大陆第一辅助器武魂。打破七环限制蜕变为九宝，赋予队友攻击、速度、魂力全面暴增与神级庇佑！',
    iconName: 'Sparkles',
    baseAtk: 20,
    baseDef: 36,
    baseHp: 450,
    baseSpeed: 28,
    baseCrit: 5,
    growthAtk: 3.8,
    growthDef: 6.0,
    growthHp: 75,
    growthSpeed: 2.4,
    element: 'divine',
    skills: [],
  },

  // 12. 九心海棠
  {
    id: 'nine_heart_begonia',
    name: '九心海棠',
    chineseName: '九心海棠',
    type: 'plant',
    category: 'support',
    description: '大陆奇迹治疗武魂，单传一脉。海棠花开，全员伤势即刻瞬间恢复如初，气血拉满！',
    iconName: 'Heart',
    baseAtk: 22,
    baseDef: 34,
    baseHp: 460,
    baseSpeed: 25,
    baseCrit: 6,
    growthAtk: 4.0,
    growthDef: 5.8,
    growthHp: 78,
    growthSpeed: 2.2,
    element: 'divine',
    skills: [],
  },

  // 13. 破魂枪
  {
    id: 'soul_breaking_gun',
    name: '破魂枪',
    chineseName: '破魂枪',
    type: 'tool',
    category: 'attack',
    description: '破之族杨无敌家族传承武魂！放弃一切防御换取极致破甲与毁灭性一枪刺穿！',
    iconName: 'Zap',
    baseAtk: 54,
    baseDef: 16,
    baseHp: 300,
    baseSpeed: 28,
    baseCrit: 25,
    growthAtk: 9.5,
    growthDef: 2.2,
    growthHp: 40,
    growthSpeed: 2.4,
    element: 'physical',
    skills: [],
  },

  // 14. 泰坦巨猿
  {
    id: 'titan_giant_ape',
    name: '泰坦巨猿',
    chineseName: '泰坦巨猿',
    type: 'beast',
    category: 'attack',
    description: '继承森林之王远古洪荒神力的兽武魂！掌控重力泥沼与泰坦苍穹破，体魄如金刚不坏！',
    iconName: 'Shield',
    baseAtk: 46,
    baseDef: 38,
    baseHp: 440,
    baseSpeed: 16,
    baseCrit: 12,
    growthAtk: 8.0,
    growthDef: 5.5,
    growthHp: 68,
    growthSpeed: 1.0,
    element: 'physical',
    skills: [],
  },

  // 15. 碧磷蛇皇
  {
    id: 'jade_serpent_emperor',
    name: '碧磷蛇皇',
    chineseName: '碧磷蛇皇',
    type: 'beast',
    category: 'control',
    description: '毒斗罗独孤博一脉传承武魂。喷吐漫天碧磷蛇毒雾，蚀骨融肉，百步之内生灵涂炭！',
    iconName: 'Skull',
    baseAtk: 43,
    baseDef: 26,
    baseHp: 370,
    baseSpeed: 25,
    baseCrit: 15,
    growthAtk: 7.5,
    growthDef: 3.8,
    growthHp: 52,
    growthSpeed: 2.0,
    element: 'poison',
    skills: [],
  },

  // 16. 冰碧帝皇蝎
  {
    id: 'ice_jade_scorpion',
    name: '冰碧帝皇蝎',
    chineseName: '冰碧帝皇蝎',
    type: 'beast',
    category: 'control',
    description: '极北三大天王之一！掌控极致之冰与冰帝之螯，永冻领域一出冻结时空与万物！',
    iconName: 'Snowflake',
    baseAtk: 47,
    baseDef: 30,
    baseHp: 380,
    baseSpeed: 25,
    baseCrit: 20,
    growthAtk: 8.3,
    growthDef: 4.4,
    growthHp: 54,
    growthSpeed: 2.1,
    element: 'ice',
    skills: [],
  },

  // 17. 黄金圣龙
  {
    id: 'golden_sacred_dragon',
    name: '黄金圣龙',
    chineseName: '黄金圣龙',
    type: 'god',
    category: 'god',
    description: '黄金铁三角三位一体融合神兽！蕴含纯正光明龙神血脉，驱散邪祟，普照天地！',
    iconName: 'Crown',
    baseAtk: 50,
    baseDef: 30,
    baseHp: 400,
    baseSpeed: 24,
    baseCrit: 18,
    growthAtk: 8.8,
    growthDef: 4.5,
    growthHp: 60,
    growthSpeed: 2.0,
    element: 'light',
    skills: [],
  },

  // 18. 食神香肠
  {
    id: 'sausage_spirit',
    name: '食神香肠',
    chineseName: '食神香肠',
    type: 'tool',
    category: 'support',
    description: '史莱克奥斯卡天赐食物系武魂！大恢复肠、解毒肠、飞行蘑菇肠、镜像肠全能全能辅助！',
    iconName: 'Sparkles',
    baseAtk: 25,
    baseDef: 30,
    baseHp: 420,
    baseSpeed: 26,
    baseCrit: 10,
    growthAtk: 4.5,
    growthDef: 4.8,
    growthHp: 66,
    growthSpeed: 2.2,
    element: 'divine',
    skills: [],
  },

  // 19. 天梦冰蚕
  {
    id: 'heavenly_dream_iceworm',
    name: '天梦冰蚕',
    chineseName: '天梦冰蚕',
    type: 'beast',
    category: 'god',
    description: '百万年精神智慧魂兽化身！精神探测共享、灵魂冲击与无尽精神风暴！',
    iconName: 'Sparkles',
    baseAtk: 46,
    baseDef: 28,
    baseHp: 430,
    baseSpeed: 27,
    baseCrit: 24,
    growthAtk: 8.0,
    growthDef: 4.0,
    growthHp: 62,
    growthSpeed: 2.5,
    element: 'divine',
    skills: [],
  }
];

// Helper to calculate Soul Ring Color from years
export function getSoulRingColorHex(years: number): string {
  if (years >= 1000000) return '#f59e0b'; // 百万年 - 白金/黄金
  if (years >= 100000) return '#ef4444'; // 十万年 - 鲜红
  if (years >= 10000) return '#1e1b4b'; // 万年 - 纯黑
  if (years >= 1000) return '#a855f7'; // 千年 - 炫紫
  if (years >= 100) return '#eab308'; // 百年 - 灿黄
  return '#ffffff'; // 十年 - 纯白
}

export function getSoulRankTitle(level: number): {
  title: string;
  order: number;
  maxRings: number;
  nextBottleneck: number;
  colorClass: string;
} {
  if (level >= 100) return { title: '神级 (100级+)', order: 10, maxRings: 10, nextBottleneck: 100, colorClass: 'text-amber-300 font-bold' };
  if (level >= 99) return { title: '极限斗罗 (半神)', order: 9, maxRings: 9, nextBottleneck: 100, colorClass: 'text-rose-400 font-bold' };
  if (level >= 91) return { title: '封号斗罗', order: 9, maxRings: 9, nextBottleneck: 99, colorClass: 'text-red-500 font-bold' };
  if (level >= 81) return { title: '魂斗罗', order: 8, maxRings: 8, nextBottleneck: 90, colorClass: 'text-purple-400 font-bold' };
  if (level >= 71) return { title: '魂圣 (武魂真身)', order: 7, maxRings: 7, nextBottleneck: 80, colorClass: 'text-indigo-400 font-semibold' };
  if (level >= 61) return { title: '魂帝', order: 6, maxRings: 6, nextBottleneck: 70, colorClass: 'text-blue-400 font-semibold' };
  if (level >= 51) return { title: '魂王', order: 5, maxRings: 5, nextBottleneck: 60, colorClass: 'text-cyan-400 font-semibold' };
  if (level >= 41) return { title: '魂宗', order: 4, maxRings: 4, nextBottleneck: 50, colorClass: 'text-teal-400 font-semibold' };
  if (level >= 31) return { title: '魂尊', order: 3, maxRings: 3, nextBottleneck: 40, colorClass: 'text-emerald-400 font-medium' };
  if (level >= 21) return { title: '大魂师', order: 2, maxRings: 2, nextBottleneck: 30, colorClass: 'text-yellow-400 font-medium' };
  if (level >= 11) return { title: '魂师', order: 1, maxRings: 1, nextBottleneck: 20, colorClass: 'text-slate-200' };
  return { title: '魂士', order: 0, maxRings: 0, nextBottleneck: 10, colorClass: 'text-slate-400' };
}
