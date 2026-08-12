import { MiningVeinZone } from '../types/game';

export interface SmelterRecipe {
  id: string;
  name: string;
  targetItemId: string;
  targetName: string;
  targetCount: number;
  isDivineMetal: boolean;
  costGold: number;
  ingredients: {
    itemId: string;
    name: string;
    count: number;
    isDivineMetal?: boolean;
  }[];
  description: string;
  requiredLevel: number;
}

export const MINING_VEIN_ZONES: MiningVeinZone[] = [
  // =========================================================================
  // 1. City of Metals: Gengxin City Mines
  // =========================================================================
  {
    id: 'gengxin_outer',
    name: '庚辛城外围 · 寒铁沉金矿区',
    category: 'gengxin_city',
    categoryName: '金属之都 · 矿区',
    subtitle: '基础暗器材料与一字斗铠神金产地',
    description: '庚辛城外围庞大的露天采矿群，蕴藏着丰富的初级寒铁、沉银矿石与精钢。',
    requiredLevel: 10,
    bannerBg: 'from-amber-950/80 via-slate-900 to-slate-950 border-amber-500/40',
    badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/50',
    icon: 'Hammer',
    accentColor: '#f59e0b',
    staminaCost: 5,
    expPerGather: 40,
    goldPerGather: 30,
    tangSkillBonusDesc: '【玄天功】 净化内息，使寒铁与沉银产出率额外+50%！',
    tangSkillKey: 'xuantian',
    hazardWarning: '山石间偶有地鼠穿梭，偶发轻微震荡',
    producedMaterials: [
      {
        itemId: 'low_spirit_ore',
        name: '初级寒铁',
        type: 'metal',
        typeName: '基础矿石',
        dropChance: 0.95,
        baseCount: [2, 5],
        description: '坚硬锋利的寒铁矿石，用于打造无声袖箭、诸葛神弩与基础魂导器配件。',
        icon: 'Shield',
        targetSystem: 'both',
        rarity: 'common'
      },
      {
        itemId: 'spirit_iron_ore',
        name: '沉银矿石',
        type: 'metal',
        typeName: '灵性沉银',
        dropChance: 0.70,
        baseCount: [1, 3],
        description: '密实沉重的暗银色灵性矿石，用于打造诸葛神弩、龙须针与高阶防御魂导器。',
        icon: 'Hammer',
        targetSystem: 'both',
        rarity: 'rare'
      },
      {
        itemId: 'Refined Steel',
        name: '精钢',
        isDivineMetal: true,
        type: 'god_material',
        typeName: '斗铠神金',
        dropChance: 0.45,
        baseCount: [1, 2],
        description: '百炼成钢的精金材料，打造一字斗铠全套7件套的必备之物！',
        icon: 'Sparkles',
        targetSystem: 'battle_armor',
        rarity: 'rare'
      },
      {
        itemId: 'snake_gall',
        name: '地脉龙胆',
        type: 'poison',
        typeName: '剧毒配方',
        dropChance: 0.25,
        baseCount: [1, 2],
        description: '深矿裂隙中滋生的灵蛇胆，用于为子母追魂夺命胆淬炼致命剧毒。',
        icon: 'Zap',
        targetSystem: 'hidden_weapon',
        rarity: 'common'
      }
    ]
  },
  {
    id: 'gengxin_magma',
    name: '神匠协会 · 地心天火熔岩窟',
    category: 'gengxin_city',
    categoryName: '金属之都 · 熔岩窟',
    subtitle: '二字/三字斗铠神金与纯阳赤炎核',
    description: '铁匠协会地下千尺的地热熔岩矿脉！产出具备灵性的灵锻秘银、魂锻红金与纯阳赤炎核。',
    requiredLevel: 40,
    bannerBg: 'from-rose-950/80 via-slate-900 to-slate-950 border-rose-500/40',
    badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-500/50',
    icon: 'Flame',
    accentColor: '#f43f5e',
    staminaCost: 10,
    expPerGather: 120,
    goldPerGather: 80,
    tangSkillBonusDesc: '【玄玉手】 凝结如玉避退高温，使灵锻秘银与赤炎核掉率+35%！',
    tangSkillKey: 'xuanyu',
    hazardWarning: '地心高温灼热，建议魂宗(Lv.40+)以上魂师前往采集',
    producedMaterials: [
      {
        itemId: 'Spirit Forged Mithril',
        name: '灵锻秘银',
        isDivineMetal: true,
        type: 'god_material',
        typeName: '斗铠神金',
        dropChance: 0.65,
        baseCount: [1, 3],
        description: '蕴含生命律动的有灵金属，打造二字斗铠的核心材料！',
        icon: 'Sparkles',
        targetSystem: 'battle_armor',
        rarity: 'epic'
      },
      {
        itemId: 'Spirit Forged Red Gold',
        name: '魂锻红金',
        isDivineMetal: true,
        type: 'god_material',
        typeName: '斗铠神金',
        dropChance: 0.40,
        baseCount: [1, 2],
        description: '注入灵魂意志的神金，觉醒斗铠领域，赋予极高暴击与免控能力。',
        icon: 'Crown',
        targetSystem: 'battle_armor',
        rarity: 'legendary'
      },
      {
        itemId: 'red_core',
        name: '纯阳赤炎核',
        type: 'crystal',
        typeName: '火系本源核',
        dropChance: 0.35,
        baseCount: [1, 2],
        description: '地热熔岩孕育的高能太阳核心，佛怒唐莲的引爆核心！',
        icon: 'Flame',
        targetSystem: 'hidden_weapon',
        rarity: 'legendary'
      },
      {
        itemId: 'high_spirit_crystal',
        name: '极品魂晶',
        type: 'crystal',
        typeName: '高能晶石',
        dropChance: 0.50,
        baseCount: [1, 3],
        description: '高浓缩天然魂力晶体，用于构建无敌护罩与高能奶瓶。',
        icon: 'Zap',
        targetSystem: 'soul_tool',
        rarity: 'rare'
      }
    ]
  },
  {
    id: 'gengxin_meteor',
    name: '神匠圣域 · 九天星陨坑',
    category: 'gengxin_city',
    categoryName: '金属之都 · 陨石坑',
    subtitle: '天锻神金、五字铠本源石与星陨神铁',
    description: '九天之外陨石坠落形成的太古陨石坑，蕴含雷劫天威与天锻神采。',
    requiredLevel: 75,
    bannerBg: 'from-cyan-950/80 via-slate-900 to-slate-950 border-cyan-500/40',
    badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/50',
    icon: 'Sparkles',
    accentColor: '#06b6d4',
    staminaCost: 15,
    expPerGather: 300,
    goldPerGather: 200,
    tangSkillBonusDesc: '【紫极魔瞳】 看穿星陨杂质，使天锻神金与本源石发现率+40%！',
    tangSkillKey: 'ziji',
    hazardWarning: '残存九天劫雷，仅限至强魂师探索',
    producedMaterials: [
      {
        itemId: 'Divine Heavenly Forged Gold',
        name: '天锻神金',
        isDivineMetal: true,
        type: 'god_material',
        typeName: '四字斗铠材料',
        dropChance: 0.55,
        baseCount: [1, 3],
        description: '渡过九天雷劫、赋予真正神智的绝世神金！四字斗铠必备。',
        icon: 'Crown',
        targetSystem: 'battle_armor',
        rarity: 'legendary'
      },
      {
        itemId: 'Super Divine Origin Stone',
        name: '超神级本源石',
        isDivineMetal: true,
        type: 'god_material',
        typeName: '五字超神级',
        dropChance: 0.25,
        baseCount: [1, 2],
        description: '神界崩溃遗留的超神器本源原石，打造五字超神斗铠的核心！',
        icon: 'Sparkles',
        targetSystem: 'battle_armor',
        rarity: 'godly'
      },
      {
        itemId: 'meteor_iron',
        name: '星陨神铁',
        type: 'metal',
        typeName: '天外神铁',
        dropChance: 0.45,
        baseCount: [1, 2],
        description: '恒星撞击凝结的神铁，用于打造9级定制魂导重炮与破甲暗器。',
        icon: 'Flame',
        targetSystem: 'both',
        rarity: 'epic'
      },
      {
        itemId: 'crystal_hair',
        name: '板晶发金',
        type: 'crystal',
        typeName: '绝品发金',
        dropChance: 0.30,
        baseCount: [1, 3],
        description: '天然水晶板晶中的柔金细丝，见血剧烈蜷缩，打造龙须针的核心！',
        icon: 'Zap',
        targetSystem: 'hidden_weapon',
        rarity: 'epic'
      }
    ]
  },

  // =========================================================================
  // 2. Star Dou Forest & Sunset Valley: Swamps and Magma Valleys
  // =========================================================================
  {
    id: 'forest_toxic_swamp',
    name: '星斗大森林 · 曼陀罗蛇毒瘴沼泽',
    category: 'forest_swamp',
    categoryName: '大森林 · 毒瘴沼泽',
    subtitle: '蚀骨毒液、蛇胆与穿心毒煞',
    description: '星斗大森林深处被五彩毒雾笼罩的泥泞湿地。栖息着曼陀罗蛇与人面魔蛛。',
    requiredLevel: 20,
    bannerBg: 'from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500/40',
    badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/50',
    icon: 'Skull',
    accentColor: '#10b981',
    staminaCost: 6,
    expPerGather: 60,
    goldPerGather: 40,
    tangSkillBonusDesc: '【玄玉手】 百毒不侵，使毒物采集收益翻倍！',
    tangSkillKey: 'xuanyu',
    hazardWarning: '空气中充斥着神经毒雾，需具备抗毒手段',
    producedMaterials: [
      {
        itemId: 'corrosive_poison',
        name: '曼陀罗蛇毒液',
        type: 'poison',
        typeName: '蚀骨毒液',
        dropChance: 0.85,
        baseCount: [2, 4],
        description: '高浓度神经剧毒，用于为龙须针与子母追魂夺命胆淬毒。',
        icon: 'Skull',
        targetSystem: 'hidden_weapon',
        rarity: 'rare'
      },
      {
        itemId: 'snake_gall',
        name: '鸡冠蛇胆',
        type: 'poison',
        typeName: '绝品蛇胆',
        dropChance: 0.70,
        baseCount: [1, 3],
        description: '千年凤尾鸡冠蛇的完整胆囊，用于淬毒暗器与炼制高阶解毒丹。',
        icon: 'Zap',
        targetSystem: 'hidden_weapon',
        rarity: 'rare'
      },
      {
        itemId: 'poison_sac',
        name: '魔蛛毒腺',
        type: 'poison',
        typeName: '致命毒腺',
        dropChance: 0.50,
        baseCount: [1, 2],
        description: '人面魔蛛的蚀骨酸性毒腺，瞬间腐蚀护体魂力。',
        icon: 'Skull',
        targetSystem: 'hidden_weapon',
        rarity: 'rare'
      }
    ]
  },
  {
    id: 'forest_volcano_cave',
    name: '落日森林 · 烈火赤炎谷',
    category: 'forest_swamp',
    categoryName: '落日森林 · 赤炎谷',
    subtitle: '纯阳赤炎核、魂锻红金与暗金玄铁矿',
    description: '紧邻冰火两仪眼阳泉的温热温泉熔岩谷，富含纯阳赤炎核与暗金矿脉。',
    requiredLevel: 50,
    bannerBg: 'from-orange-950/80 via-slate-900 to-slate-950 border-orange-500/40',
    badgeColor: 'text-orange-400 bg-orange-950/60 border-orange-500/50',
    icon: 'Flame',
    accentColor: '#f97316',
    staminaCost: 8,
    expPerGather: 150,
    goldPerGather: 100,
    tangSkillBonusDesc: '【控鹤擒龙】 隔空取物隔绝地火，使采集安全度与收益+40%！',
    tangSkillKey: 'konghe',
    hazardWarning: '火山炽热，岩石不稳定易塌方',
    producedMaterials: [
      {
        itemId: 'red_core',
        name: '纯阳赤炎核',
        type: 'crystal',
        typeName: '太阳赤炎核',
        dropChance: 0.50,
        baseCount: [1, 2],
        description: '佛怒唐莲的核心材料，引爆后化作焚天金焰！',
        icon: 'Flame',
        targetSystem: 'hidden_weapon',
        rarity: 'legendary'
      },
      {
        itemId: 'spirit_iron_ore',
        name: '暗金玄铁矿',
        type: 'metal',
        typeName: '地火淬炼铁',
        dropChance: 0.75,
        baseCount: [2, 4],
        description: '经地火万年淬炼的玄铁，极具韧性，用于打造高阶暗器与配件。',
        icon: 'Hammer',
        targetSystem: 'both',
        rarity: 'rare'
      },
      {
        itemId: 'Spirit Forged Red Gold',
        name: '魂锻红金',
        isDivineMetal: true,
        type: 'god_material',
        typeName: '三字斗铠神金',
        dropChance: 0.35,
        baseCount: [1, 2],
        description: '赤炎魂力凝结的红金神物，三字斗铠之核心！',
        icon: 'Sparkles',
        targetSystem: 'battle_armor',
        rarity: 'epic'
      }
    ]
  },

  // =========================================================================
  // 3. Endless Sea · Dragon Abyss Trench & Sea Emperor Ruins
  // =========================================================================
  {
    id: 'sea_abyss_trench',
    name: '无尽蔚蓝海 · 万丈龙渊海沟',
    category: 'sea_abyss',
    categoryName: '无尽蔚蓝海 · 龙渊',
    subtitle: '深海沉银神铁、魔鲸龙珠与超神级本源石',
    description: '海神岛深海千米之下的太古海沟与沉没遗迹！隐藏着深海沉银神铁与魔鲸龙珠。',
    requiredLevel: 65,
    bannerBg: 'from-blue-950/80 via-slate-900 to-slate-950 border-blue-500/40',
    badgeColor: 'text-blue-400 bg-blue-950/60 border-blue-500/50',
    icon: 'Waves',
    accentColor: '#3b82f6',
    staminaCost: 12,
    expPerGather: 250,
    goldPerGather: 160,
    tangSkillBonusDesc: '【鬼影迷踪】 穿梭深海洋流，使沉银与龙珠打捞率+45%！',
    tangSkillKey: 'guiying',
    hazardWarning: '海沟万钧水压与凶猛深海海魂兽，需要极高防御',
    producedMaterials: [
      {
        itemId: 'god_iron',
        name: '深海沉银神铁',
        type: 'god_material',
        typeName: '神级暗器铁',
        dropChance: 0.50,
        baseCount: [1, 3],
        description: '深海万钧水压下诞生的绝世神铁！暴雨梨花针与佛怒唐莲之基石！',
        icon: 'Sparkles',
        targetSystem: 'hidden_weapon',
        rarity: 'legendary'
      },
      {
        itemId: 'whale_pearl',
        name: '深海魔鲸龙珠',
        type: 'god_material',
        typeName: '海皇神珠',
        dropChance: 0.30,
        baseCount: [1, 1],
        description: '百万年深海魔鲸王结晶龙珠，佛怒唐莲之神级引爆枢纽！',
        icon: 'Crown',
        targetSystem: 'hidden_weapon',
        rarity: 'godly'
      },
      {
        itemId: 'deep_sea_silver',
        name: '深海沉银',
        type: 'metal',
        typeName: '深海沉银矿',
        dropChance: 0.80,
        baseCount: [2, 4],
        description: '稀有海洋矿石，用于构建6级飞行魂导机翼与高级斗铠。',
        icon: 'Shield',
        targetSystem: 'soul_tool',
        rarity: 'epic'
      },
      {
        itemId: 'Super Divine Origin Stone',
        name: '超神级本源石',
        isDivineMetal: true,
        type: 'god_material',
        typeName: '五字铠本源石',
        dropChance: 0.20,
        baseCount: [1, 1],
        description: '海皇遗迹深处的超神器本源石碎片，用于打造五字斗铠！',
        icon: 'Sparkles',
        targetSystem: 'battle_armor',
        rarity: 'godly'
      }
    ]
  }
];

// =========================================================================
// Smelter Recipes
// =========================================================================

export const SMELTER_RECIPES: SmelterRecipe[] = [
  {
    id: 'smelt_refined_gold',
    name: '百炼精铁 -> 精钢',
    targetItemId: 'Refined Steel',
    targetName: '精钢',
    targetCount: 1,
    isDivineMetal: true,
    costGold: 200,
    requiredLevel: 20,
    description: '采用百炼锻造锤法，将10份初级寒铁熔炼提纯为1份精钢。',
    ingredients: [
      { itemId: 'low_spirit_ore', name: '初级寒铁', count: 10 }
    ]
  },
  {
    id: 'smelt_spirit_mithril',
    name: '金灵融锻 -> 灵锻秘银',
    targetItemId: 'Spirit Forged Mithril',
    targetName: '灵锻秘银',
    targetCount: 1,
    isDivineMetal: true,
    costGold: 600,
    requiredLevel: 45,
    description: '将魂力融入精钢与沉银矿石，赋予金属灵性，铸造二字斗铠。',
    ingredients: [
      { itemId: 'Refined Steel', name: '精钢', count: 4, isDivineMetal: true },
      { itemId: 'spirit_iron_ore', name: '沉银矿石', count: 4 }
    ]
  },
  {
    id: 'smelt_soul_red_gold',
    name: '秘银注入 -> 魂锻红金',
    targetItemId: 'Spirit Forged Red Gold',
    targetName: '魂锻红金',
    targetCount: 1,
    isDivineMetal: true,
    costGold: 1500,
    requiredLevel: 65,
    description: '将灵锻秘银与极品魂晶结合地火淬炼唤醒金魂，铸造三字斗铠。',
    ingredients: [
      { itemId: 'Spirit Forged Mithril', name: '灵锻秘银', count: 4, isDivineMetal: true },
      { itemId: 'high_spirit_crystal', name: '极品魂晶', count: 2 }
    ]
  },
  {
    id: 'smelt_heaven_god_gold',
    name: '红金渡劫 -> 天锻神金',
    targetItemId: 'Divine Heavenly Forged Gold',
    targetName: '天锻神金',
    targetCount: 1,
    isDivineMetal: true,
    costGold: 4000,
    requiredLevel: 80,
    description: '四字斗铠核心！将魂锻红金置于星陨渡劫台接受雷劫淬炼！',
    ingredients: [
      { itemId: 'Spirit Forged Red Gold', name: '魂锻红金', count: 4, isDivineMetal: true },
      { itemId: 'meteor_iron', name: '星陨神铁', count: 2 }
    ]
  },
  {
    id: 'smelt_supreme_origin_stone',
    name: '神金化蜕 -> 超神级本源石',
    targetItemId: 'Super Divine Origin Stone',
    targetName: '超神级本源石',
    targetCount: 1,
    isDivineMetal: true,
    costGold: 10000,
    requiredLevel: 95,
    description: '五字超神斗铠之巅峰石！融合天锻神金与魔鲸龙珠孕育超神灵智！',
    ingredients: [
      { itemId: 'Divine Heavenly Forged Gold', name: '天锻神金', count: 3, isDivineMetal: true },
      { itemId: 'whale_pearl', name: '深海魔鲸龙珠', count: 1 }
    ]
  },
  {
    id: 'smelt_god_iron',
    name: '沉银提纯 -> 深海沉银神铁',
    targetItemId: 'god_iron',
    targetName: '深海沉银神铁',
    targetCount: 1,
    isDivineMetal: false,
    costGold: 800,
    requiredLevel: 50,
    description: '提纯3份深海沉银矿石，构筑暴雨梨花针与佛怒唐莲之神级躯干。',
    ingredients: [
      { itemId: 'deep_sea_silver', name: '深海沉银', count: 3 }
    ]
  },
  {
    id: 'smelt_red_core',
    name: '地火凝练 -> 纯阳赤炎核',
    targetItemId: 'red_core',
    targetName: '纯阳赤炎核',
    targetCount: 1,
    isDivineMetal: false,
    costGold: 1200,
    requiredLevel: 60,
    description: '压缩极品魂晶与火山熔岩精粹，凝练佛怒唐莲的爆发点火核心。',
    ingredients: [
      { itemId: 'high_spirit_crystal', name: '极品魂晶', count: 3 },
      { itemId: 'spirit_iron_ore', name: '沉银矿石', count: 5 }
    ]
  }
];

// Material Wiki & Guide Entry
export interface MaterialWikiItem {
  id: string;
  name: string;
  category: 'Armor Divine Metal' | 'Tang Sect Weapon Material' | 'Soul Tool Core Material';
  tierRank: string;
  description: string;
  sources: string[];
  usedFor: string[];
  recommendedZoneId: string;
}

export const MATERIAL_WIKI_DB: MaterialWikiItem[] = [
  {
    id: 'low_spirit_ore',
    name: '初级寒铁',
    category: 'Tang Sect Weapon Material',
    tierRank: '基础矿石',
    description: '坚硬锋利的寒铁矿石，用于打造无声袖箭、诸葛神弩与基础工具。',
    sources: ['庚辛城外围采矿', '猎杀风猩猩/冥狼', '黑匠熔炉分解'],
    usedFor: ['无声袖箭', '诸葛神弩', '3级坚固魂盾', '熔炼精钢'],
    recommendedZoneId: 'gengxin_outer'
  },
  {
    id: 'spirit_iron_ore',
    name: '沉银矿石 (暗金玄铁)',
    category: 'Tang Sect Weapon Material',
    tierRank: '进阶矿石',
    description: '密实沉重的暗银色灵性矿石，中阶唐门暗器与魂导器斗铠基石。',
    sources: ['庚辛城外围采矿', '落日森林赤炎谷', '猎杀暗金恐爪熊'],
    usedFor: ['诸葛神弩', '龙须针', '子母追魂夺命胆', '5级无敌护罩', '6级飞行机翼'],
    recommendedZoneId: 'gengxin_outer'
  },
  {
    id: 'Refined Steel',
    name: '精钢',
    category: 'Armor Divine Metal',
    tierRank: '一字斗铠',
    description: '百炼成钢的精金材料，打造一字斗铠全套7件套的基石。',
    sources: ['庚辛城外围采矿', '黑匠熔炉(初级寒铁熔炼)', '斗魂大赛奖励'],
    usedFor: ['一字斗铠7件套', '熔炼灵锻秘银'],
    recommendedZoneId: 'gengxin_outer'
  },
  {
    id: 'Spirit Forged Mithril',
    name: '灵锻秘银',
    category: 'Armor Divine Metal',
    tierRank: '二字斗铠',
    description: '蕴含生命律动的有灵金属，使斗铠能与魂师血脉产生共鸣。',
    sources: ['神匠协会熔岩窟', '熔炉(精钢融锻)', '猎杀万年魂兽'],
    usedFor: ['二字斗铠7件套', '熔炼魂锻红金'],
    recommendedZoneId: 'gengxin_magma'
  },
  {
    id: 'Spirit Forged Red Gold',
    name: '魂锻红金',
    category: 'Armor Divine Metal',
    tierRank: '三字斗铠',
    description: '注入灵魂意志的神金，觉醒斗铠领域与庞大暴击加成。',
    sources: ['神匠协会熔岩窟', '落日森林赤炎谷', '熔炉(秘银注入)'],
    usedFor: ['三字斗铠7件套', '熔炼天锻神金'],
    recommendedZoneId: 'gengxin_magma'
  },
  {
    id: 'Divine Heavenly Forged Gold',
    name: '天锻神金',
    category: 'Armor Divine Metal',
    tierRank: '四字斗铠',
    description: '渡过九天雷劫、赋予真正神智的绝世神金！四字斗铠必备。',
    sources: ['九天星陨坑', '熔炉(红金渡劫)', '十万年泰坦巨猿掉落'],
    usedFor: ['四字斗铠7件套', '熔炼超神级本源石'],
    recommendedZoneId: 'gengxin_meteor'
  },
  {
    id: 'Super Divine Origin Stone',
    name: '超神级本源石',
    category: 'Armor Divine Metal',
    tierRank: '五字斗铠',
    description: '神界崩溃遗留的超神器本源原石，打造五字超神斗铠的核心！',
    sources: ['九天星陨坑', '无尽蔚蓝海龙渊海沟', '熔炉(神金化蜕)'],
    usedFor: ['五字超神斗铠7件套'],
    recommendedZoneId: 'gengxin_meteor'
  },
  {
    id: 'corrosive_poison',
    name: '曼陀罗蛇毒液',
    category: 'Tang Sect Weapon Material',
    tierRank: '剧毒配方',
    description: '高腐蚀性神经剧毒，用于武器涂毒与子母追魂夺命胆。',
    sources: ['星斗毒瘴沼泽', '猎杀曼陀罗蛇/碧磷蛇皇'],
    usedFor: ['龙须针', '子母追魂夺命胆'],
    recommendedZoneId: 'forest_toxic_swamp'
  },
  {
    id: 'snake_gall',
    name: '鸡冠蛇胆',
    category: 'Tang Sect Weapon Material',
    tierRank: '绝品药材',
    description: '完整药用蛇胆，用于打造追魂胆与九转大还丹。',
    sources: ['星斗毒瘴沼泽', '猎杀凤尾鸡冠蛇', '庚辛城采矿'],
    usedFor: ['子母追魂夺命胆', '高阶丹药炼制'],
    recommendedZoneId: 'forest_toxic_swamp'
  },
  {
    id: 'god_iron',
    name: '深海沉银神铁',
    category: 'Tang Sect Weapon Material',
    tierRank: '神级暗器材料',
    description: '深海万钧水压下诞生的绝世神铁，神级暗器之基石。',
    sources: ['无尽蔚蓝海龙渊海沟', '熔炉(沉银提纯)', '猎杀深海魔鲸王'],
    usedFor: ['暴雨梨花针', '佛怒唐莲'],
    recommendedZoneId: 'sea_abyss_trench'
  },
  {
    id: 'whale_pearl',
    name: '深海魔鲸龙珠',
    category: 'Tang Sect Weapon Material',
    tierRank: '至尊龙珠',
    description: '百万年魔鲸王结晶龙珠，佛怒唐莲的神级引爆枢纽。',
    sources: ['无尽蔚蓝海龙渊海沟', '猎杀深海魔鲸王', '海神九考考场'],
    usedFor: ['佛怒唐莲', '熔炼超神级本源石'],
    recommendedZoneId: 'sea_abyss_trench'
  },
  {
    id: 'red_core',
    name: '纯阳赤炎核',
    category: 'Tang Sect Weapon Material',
    tierRank: '赤炎本源',
    description: '地热熔岩孕育的高能太阳核心，佛怒唐莲之引爆触发器。',
    sources: ['神匠协会熔岩窟', '落日森林赤炎谷', '熔炉地火凝练'],
    usedFor: ['佛怒唐莲'],
    recommendedZoneId: 'gengxin_magma'
  }
];
