import { TangSectSkill, HiddenWeapon } from '../types/game';
import { 
  TangSectState, 
  SectHall, 
  SectTradeOffer, 
  SectChallengeLetter,
  SectHallType
} from '../types/sect';

export const INITIAL_TANG_SECT_SKILLS: {
  xuantian: TangSectSkill;
  ziji: TangSectSkill;
  guiying: TangSectSkill;
  xuanyu: TangSectSkill;
  konghe: TangSectSkill;
} = {
  xuantian: {
    id: 'xuantian',
    name: '玄天功',
    chineseName: '玄天功',
    level: 1,
    maxLevel: 9,
    stageName: '第一重 · 气感知',
    description: '唐门至高无上内功心法，生生不息，中正和平，与魂力融合可大幅加快回复，提升经脉韧性。',
    effectDescription: '魂力上限提升15%，且战斗中每回合自动回复8%最大魂力。',
    exp: 0,
    maxExp: 100
  },
  ziji: {
    id: 'ziji',
    name: '紫极魔瞳',
    chineseName: '紫极魔瞳',
    level: 1,
    maxLevel: 4,
    stageName: '纵观境界',
    description: '每日清晨吸收东方朝阳紫气修炼之眼功。分为纵观、入微、芥子、浩瀚四大境界。',
    effectDescription: '看穿敌人破绽，暴击率提升10%，命中率提升至100%，并免疫精神幻术与魅惑。',
    exp: 0,
    maxExp: 150
  },
  guiying: {
    id: 'guiying',
    name: '鬼影迷踪',
    chineseName: '鬼影迷踪',
    level: 1,
    maxLevel: 5,
    stageName: '掠影初成',
    description: '唐门至高轻功身法，神奇莫测，如游龙惊鸿，可在狭小空间闪避狂暴攻击。',
    effectDescription: '出手速度提升25%，基础闪避率提升20%。',
    exp: 0,
    maxExp: 120
  },
  xuanyu: {
    id: 'xuanyu',
    name: '玄玉手',
    chineseName: '玄玉手',
    level: 1,
    maxLevel: 5,
    stageName: '玉化淬炼',
    description: '双掌凝结如羊脂白玉，坚不可摧，百毒不侵，可徒手抓取神兵利器与极寒极热仙草。',
    effectDescription: '物理防御提升25%，且完全免疫任何剧毒与剧毒负面伤害。',
    exp: 0,
    maxExp: 120
  },
  konghe: {
    id: 'konghe',
    name: '控鹤擒龙',
    chineseName: '控鹤擒龙',
    level: 1,
    maxLevel: 5,
    stageName: '借力打力',
    description: '唐门卸力与擒拿秘术，四两拨千斤，隔空取物，反化强敌猛烈攻势。',
    effectDescription: '受到近战攻击时，有25%概率招架并反弹30%伤害，同时打断敌方连招。',
    exp: 0,
    maxExp: 120
  }
};

export const CRAFTABLE_HIDDEN_WEAPONS: HiddenWeapon[] = [
  {
    id: 'sleeve_dart',
    name: '无声袖箭',
    rank: 'low',
    quantity: 10,
    damage: 180,
    penetration: 15,
    effect: 'bleed',
    effectChance: 0.4,
    description: '精致机巧的手腕暗器，可顺发三枚钢箭，隐蔽无声，防不胜防。',
    materialsNeeded: [
      { itemId: 'low_spirit_ore', count: 3 }
    ]
  },
  {
    id: 'zhuge_crossbow',
    name: '诸葛神弩',
    rank: 'mid',
    quantity: 3,
    damage: 650,
    penetration: 40,
    effect: 'bleed',
    effectChance: 0.7,
    description: '唐门威名赫赫的强力机括暗器！瞬间喷射十六发穿云铁箭，足以击穿四十级魂宗护体魂力！',
    materialsNeeded: [
      { itemId: 'low_spirit_ore', count: 8 },
      { itemId: 'spirit_iron_ore', count: 5 }
    ]
  },
  {
    id: 'dragon_whisker_needle',
    name: '龙须针',
    rank: 'mid',
    quantity: 5,
    damage: 1100,
    penetration: 85,
    effect: 'instant_kill_chance',
    effectChance: 0.15,
    description: '用稀世板晶发金打造的手掷暗器，见血剧烈收缩，蜷缩肉身经脉，痛不欲生！',
    materialsNeeded: [
      { itemId: 'spirit_iron_ore', count: 6 },
      { itemId: 'corrosive_poison', count: 2 }
    ]
  },
  {
    id: 'child_mother_cannon',
    name: '子母追魂夺命胆',
    rank: 'high',
    quantity: 2,
    damage: 2400,
    penetration: 60,
    effect: 'poison',
    effectChance: 0.95,
    description: '双球碰撞引爆，喷射蚀骨剧毒迷雾与数百枚破甲毒针，纵使封号斗罗亦要避其锋芒！',
    materialsNeeded: [
      { itemId: 'spirit_iron_ore', count: 12 },
      { itemId: 'corrosive_poison', count: 6 },
      { itemId: 'snake_gall', count: 3 }
    ]
  },
  {
    id: 'torrential_pear_needle',
    name: '暴雨梨花针',
    rank: 'high',
    quantity: 1,
    damage: 4800,
    penetration: 90,
    effect: 'aoe_burst',
    effectChance: 1.0,
    description: '唐门三大神级机括暗器之一！深海沉银打造，二十七枚梨花银针迸发绝美银光风暴！',
    materialsNeeded: [
      { itemId: 'god_iron', count: 5 },
      { itemId: 'spirit_iron_ore', count: 20 }
    ]
  },
  {
    id: 'buddha_fury_tang_lotus',
    name: '佛怒唐莲',
    rank: 'god',
    quantity: 1,
    damage: 15000,
    penetration: 100,
    effect: 'aoe_burst',
    effectChance: 1.0,
    description: '唐门机括工艺之巅峰绝作！金色机括莲花绽放，毁天灭地，曾轰杀武魂殿多位封号长老！',
    materialsNeeded: [
      { itemId: 'god_iron', count: 12 },
      { itemId: 'whale_pearl', count: 1 },
      { itemId: 'red_core', count: 1 }
    ]
  }
];

// Tang Sect Level & Title System
export const SECT_LEVEL_DATA: {
  level: number;
  title: string;
  maxDisciples: number;
  dailyPrestigeBonus: number;
  dailySectFundsBonus: number;
  upgradeCostFunds: number;
  upgradeCostGold: number;
  desc: string;
}[] = [
  {
    level: 1,
    title: '初创草创宗门',
    maxDisciples: 60,
    dailyPrestigeBonus: 20,
    dailySectFundsBonus: 500,
    upgradeCostFunds: 1000,
    upgradeCostGold: 2000,
    desc: '唐门初立，力族入驻建立山门基业。'
  },
  {
    level: 2,
    title: '新锐崭露宗门',
    maxDisciples: 150,
    dailyPrestigeBonus: 50,
    dailySectFundsBonus: 1200,
    upgradeCostFunds: 2500,
    upgradeCostGold: 5000,
    desc: '御族加入，山门扩建，声名响彻天斗城。'
  },
  {
    level: 3,
    title: '闻名遐迩宗门',
    maxDisciples: 350,
    dailyPrestigeBonus: 100,
    dailySectFundsBonus: 2500,
    upgradeCostFunds: 5000,
    upgradeCostGold: 10000,
    desc: '单属性四大宗族全面归心，暗器铸造工坊日夜轰鸣。'
  },
  {
    level: 4,
    title: '雄霸一方名门',
    maxDisciples: 800,
    dailyPrestigeBonus: 200,
    dailySectFundsBonus: 5000,
    upgradeCostFunds: 10000,
    upgradeCostGold: 20000,
    desc: '与七宝琉璃宗签订军备盟约，贵族争相订购神弩。'
  },
  {
    level: 5,
    title: '帝国中流砥柱',
    maxDisciples: 1800,
    dailyPrestigeBonus: 400,
    dailySectFundsBonus: 9000,
    upgradeCostFunds: 20000,
    upgradeCostGold: 40000,
    desc: '宗门弟子突破千人，护山大阵固若金汤。'
  },
  {
    level: 6,
    title: '大陆名门望族',
    maxDisciples: 3500,
    dailyPrestigeBonus: 700,
    dailySectFundsBonus: 15000,
    upgradeCostFunds: 40000,
    upgradeCostGold: 80000,
    desc: '下四宗退让分毫，纵使武魂殿亦不敢轻举妄动。'
  },
  {
    level: 7,
    title: '下四宗之首',
    maxDisciples: 6500,
    dailyPrestigeBonus: 1200,
    dailySectFundsBonus: 25000,
    upgradeCostFunds: 80000,
    upgradeCostGold: 150000,
    desc: '号令群雄，足以与上三宗平起平坐！'
  },
  {
    level: 8,
    title: '媲美上三宗',
    maxDisciples: 12000,
    dailyPrestigeBonus: 2000,
    dailySectFundsBonus: 40000,
    upgradeCostFunds: 150000,
    upgradeCostGold: 300000,
    desc: '重塑上三宗格局！唐门暗器列装帝国大军！'
  },
  {
    level: 9,
    title: '斗罗第一天下绝宗',
    maxDisciples: 25000,
    dailyPrestigeBonus: 3500,
    dailySectFundsBonus: 70000,
    upgradeCostFunds: 300000,
    upgradeCostGold: 600000,
    desc: '全大陆公认第一宗门，威震两大帝国！'
  },
  {
    level: 10,
    title: '万古不朽神级唐门',
    maxDisciples: 50000,
    dailyPrestigeBonus: 6000,
    dailySectFundsBonus: 120000,
    upgradeCostFunds: 0,
    upgradeCostGold: 0,
    desc: '横跨凡俗与神界的万古神宗！佛怒唐莲之光永照世间！'
  }
];

// Initial configuration of Tang Sect Six Halls
export const INITIAL_SECT_HALLS: { [key in SectHallType]: SectHall } = {
  main: {
    id: 'main',
    name: '主殿 · 宗门大堂',
    chineseName: '唐门主殿 · 议事大堂',
    leaderName: '唐三 (宗主)',
    leaderTitle: '千手修罗 · 海神修罗双神位',
    level: 1,
    maxLevel: 10,
    description: '宗门核心权力与统筹枢纽，协调各堂、资源调度、外交与防御。',
    specialty: '宗门治理与全属性增益',
    effectSummary: '全员基础属性+5%，宗门繁荣度与声望获取效率+10%',
    statsBonus: {
      atk: 50,
      def: 40,
      hp: 500,
      speed: 15,
      critRate: 0.02,
      tradeProfitBonusPct: 5
    },
    upgradeCost: {
      gold: 1500,
      sectFunds: 800
    }
  },
  power: {
    id: 'power',
    name: '力堂',
    chineseName: '力堂 · 神铸锻造室',
    leaderName: '泰坦 (堂主)',
    leaderTitle: '力族族长 · 神匠',
    level: 1,
    maxLevel: 10,
    description: '由力族掌管，专注于神兵锻造、机括暗器量产与稀有金属冶炼。',
    specialty: '暗器量产与攻击爆发',
    effectSummary: '攻击力+80，机括暗器伤害+15%，锻造材料消耗降低10%',
    statsBonus: {
      atk: 80,
      def: 20,
      hp: 300,
      speed: 0,
      critRate: 0.03,
      forgeDiscountPct: 10
    },
    upgradeCost: {
      gold: 1200,
      sectFunds: 600
    }
  },
  defense: {
    id: 'defense',
    name: '御堂',
    chineseName: '御堂 · 堡垒防御阵',
    leaderName: '牛皋 (堂主)',
    leaderTitle: '御族族长 · 板甲犀牛魂斗罗',
    level: 1,
    maxLevel: 10,
    description: '由御族掌管，专注于宗门防御设施建造、山门堡垒构筑与玄武结界维护。',
    specialty: '宗门防御与坚固护盾',
    effectSummary: '生命值+800，物理与魂力防御+60，山门战斗获得20%额外护盾庇护',
    statsBonus: {
      atk: 10,
      def: 60,
      hp: 800,
      speed: 0,
      critRate: 0,
      shieldBonusPct: 20
    },
    upgradeCost: {
      gold: 1200,
      sectFunds: 600
    }
  },
  agility: {
    id: 'agility',
    name: '敏堂',
    chineseName: '敏堂 · 千里情报网',
    leaderName: '白鹤 (堂主)',
    leaderTitle: '敏族族长 · 尖尾雨燕魂斗罗',
    level: 1,
    maxLevel: 10,
    description: '由敏族掌管，负责全大陆情报侦察、截获敌对情报与引导商队来访。',
    specialty: '大陆情报与极速闪避',
    effectSummary: '速度+30，闪避率+5%，云游商人刷新效率与高阶挑战出现率+25%',
    statsBonus: {
      atk: 25,
      def: 15,
      hp: 200,
      speed: 30,
      critRate: 0.02,
      tradeProfitBonusPct: 10
    },
    upgradeCost: {
      gold: 1200,
      sectFunds: 600
    }
  },
  alchemy: {
    id: 'alchemy',
    name: '药堂',
    chineseName: '药堂 · 阎王绝毒室',
    leaderName: '杨无敌 (堂主)',
    leaderTitle: '破族族长 · 破魂枪狂战士',
    level: 1,
    maxLevel: 10,
    description: '由破族掌管，精通绝世毒经、九转大还丹炼制与破甲杀伐秘术。',
    specialty: '丹药炼制与破甲杀伐',
    effectSummary: '破甲率+15%，暴击伤害+20%，仙草炼丹成功率与丹药产出+25%',
    statsBonus: {
      atk: 70,
      def: 10,
      hp: 250,
      speed: 10,
      critRate: 0.05,
      herbRefineBonusPct: 25
    },
    upgradeCost: {
      gold: 1400,
      sectFunds: 700
    }
  },
  martial: {
    id: 'martial',
    name: '武堂',
    chineseName: '武堂 · 绝技传承',
    leaderName: '马红俊 / 赵无极 (堂主)',
    leaderTitle: '邪火凤凰 · 不动明王',
    level: 1,
    maxLevel: 10,
    description: '负责招收内门弟子，传授唐门五大绝学，训练山门战阵。',
    specialty: '弟子传授与绝学研习',
    effectSummary: '研习五大绝学消耗降低20%，大幅提升招募精英弟子的概率',
    statsBonus: {
      atk: 45,
      def: 35,
      hp: 400,
      speed: 15,
      critRate: 0.02
    },
    upgradeCost: {
      gold: 1300,
      sectFunds: 650
    }
  }
};

// Continental trade caravan visitors pool
export const SECT_TRADE_VISITORS_POOL: SectTradeOffer[] = [
  {
    id: 'trade_seven_treasure_1',
    sectName: '七宝琉璃宗',
    sectLogoColor: 'from-amber-400 to-cyan-400',
    repName: '宁风致 (宗主) & 骨斗罗 古榕',
    repTitle: '上三宗 · 七宝琉璃宗宗主',
    favorability: 40,
    dialogue: '“唐宗主！宁某带骨叔拜访唐门！我宗直系弟子皆为辅助魂师，急需诸葛神弩与无声袖箭防身！愿以万年琉璃髓与重金换取！”',
    desiredItem: {
      type: 'hidden_weapon',
      itemId: 'zhuge_crossbow',
      itemName: '诸葛神弩',
      quantity: 2,
      description: '交付2架完好的【诸葛神弩】供七宝琉璃宗弟子使用'
    },
    offerRewards: {
      gold: 18000,
      sectFunds: 2200,
      prestige: 280,
      items: [
        { id: 'god_iron', name: '深海沉银矿石', quantity: 4, desc: '七宝宝库中的顶级锻造神铁' },
        { id: 'soul_bone_shard', name: '万年琉璃魂骨碎片', quantity: 2, desc: '蕴含充沛辅助魂力的魂骨至宝' }
      ],
      metals: {
        '沉银': 6,
        '生命之金': 2
      },
      favorGain: 15
    },
    status: 'pending'
  },
  {
    id: 'trade_clear_sky_1',
    sectName: '昊天宗',
    sectLogoColor: 'from-blue-600 to-slate-800',
    repName: '唐啸 (宗主 · 啸天斗罗)',
    repTitle: '天下第一宗 · 昊天宗宗主',
    favorability: 50,
    dialogue: '“好兄弟！唐门暗器与我昊天锤法相得益彰！我特意从山门带来雷风髓，订购两套子母追魂夺命胆与十盒解毒丹！”',
    desiredItem: {
      type: 'hidden_weapon',
      itemId: 'child_mother_cannon',
      itemName: '子母追魂夺命胆',
      quantity: 1,
      description: '交付1套【子母追魂夺命胆】供昊天宗长老防身'
    },
    offerRewards: {
      gold: 25000,
      sectFunds: 3000,
      prestige: 400,
      items: [
        { id: 'god_iron', name: '昊天玄铁精核', quantity: 6, desc: '昊天宗专属百炼玄铁神金' }
      ],
      metals: {
        '暗金': 8,
        '寒铁精核': 4
      },
      favorGain: 20
    },
    status: 'pending'
  },
  {
    id: 'trade_blue_dragon_1',
    sectName: '蓝电霸王龙家族',
    sectLogoColor: 'from-blue-500 to-indigo-600',
    repName: '玉元震 (宗主 · 雷霆斗罗)',
    repTitle: '上三宗 · 第一兽武魂宗门',
    favorability: 30,
    dialogue: '“狂雷奔涌！听闻药堂杨无敌堂主炼制出了辟毒龙化丹！我族愿以真龙圣血换取龙须针！”',
    desiredItem: {
      type: 'hidden_weapon',
      itemId: 'dragon_whisker_needle',
      itemName: '龙须针',
      quantity: 3,
      description: '交付3枚【龙须针】供龙族弟子演练'
    },
    offerRewards: {
      gold: 22000,
      sectFunds: 2500,
      prestige: 320,
      items: [
        { id: 'whale_pearl', name: '真龙圣血晶', quantity: 2, desc: '淬炼万年雷龙血脉的绝世晶石' }
      ],
      metals: {
        '魔银': 5,
        '精金': 8
      },
      favorGain: 15
    },
    status: 'pending'
  },
  {
    id: 'trade_heaven_dou_royal',
    sectName: '天斗皇室御前商团',
    sectLogoColor: 'from-yellow-400 to-amber-600',
    repName: '太子 雪清河 (皇家特使)',
    repTitle: '天斗帝国第一继承人',
    favorability: 45,
    dialogue: '“唐宗主，父皇深知唐门军备乃国之重器！皇家禁卫军愿永久采购袖箭与诸葛弩，倾尽帝国资源相助！”',
    desiredItem: {
      type: 'hidden_weapon',
      itemId: 'sleeve_dart',
      itemName: '无声袖箭',
      quantity: 5,
      description: '交付5把【无声袖箭】供皇家禁卫军列装'
    },
    offerRewards: {
      gold: 30000,
      sectFunds: 4000,
      prestige: 500,
      items: [
        { id: 'god_iron', name: '皇室贡品宝箱', quantity: 3, desc: '内含海量金币与皇家传世珍宝' }
      ],
      metals: {
        '秘银': 10,
        '天外陨铁': 4
      },
      favorGain: 25
    },
    status: 'pending'
  },
  {
    id: 'trade_spirit_pagoda_1',
    sectName: '传灵塔特别使团',
    sectLogoColor: 'from-purple-500 to-cyan-500',
    repName: '千古丈亭 (特使)',
    repTitle: '传灵塔少塔主',
    favorability: 25,
    dialogue: '“传灵塔高度赞赏唐门微型机括工艺与暴雨梨花针！我等愿提供高阶升灵玉与人造魂灵胚胎交流合作！”',
    desiredItem: {
      type: 'hidden_weapon',
      itemId: 'torrential_pear_needle',
      itemName: '暴雨梨花针',
      quantity: 1,
      description: '交付1盒【暴雨梨花针】供传灵塔研习'
    },
    offerRewards: {
      gold: 45000,
      sectFunds: 6000,
      prestige: 650,
      items: [
        { id: 'red_core', name: '万年升灵玉', quantity: 2, desc: '可大幅提升魂灵亲和度的神玉' }
      ],
      metals: {
        '天锻神金': 3,
        '龙纹黑金': 5
      },
      favorGain: 30
    },
    status: 'pending'
  }
];

// Continental challenge letters pool
export const SECT_CHALLENGE_LETTERS_POOL: SectChallengeLetter[] = [
  {
    id: 'challenge_spirit_hall_1',
    title: '【武魂殿 · 教皇绝杀讨伐令】',
    senderSect: '武魂殿特使军团',
    senderLeader: '菊斗罗 月关 & 鬼斗罗 鬼魅 (95级封号斗罗)',
    difficulty: 'nightmare',
    difficultyName: '生死存亡 · 封号亲征',
    difficultyColor: 'text-rose-400 border-rose-500/50 bg-rose-950/30',
    letterText: '“教皇比比东有令！唐门胆敢收容单属性四大宗族并击伤我殿执事！限3日内交出佛怒唐莲图纸，否则两万魂师大军必平踏唐门！”',
    enemyLeaderStats: {
      name: '菊鬼双斗罗 (月关 & 鬼魅)',
      title: '武魂殿长老殿 95级封号斗罗',
      level: 95,
      hp: 380000,
      maxHp: 380000,
      shield: 60000,
      maxShield: 60000,
      atk: 18500,
      def: 13500,
      speed: 88,
      skills: [
        { name: '奇绒通天菊 · 菊花残满地伤', desc: '金灿瓣片化作漫天刃风切割，附带极高破甲效果', dmg: 24000 },
        { name: '鬼魅影杀斩', desc: '融入暗夜刺杀，造成致死流血与恐惧效果', dmg: 28000 },
        { name: '武魂融合技 · 两极静止领域', desc: '冻结时空，封印敌方行动2回合并降低50%防御', dmg: 35000, isUltimate: true }
      ]
    },
    rewards: {
      gold: 50000,
      sectFunds: 6500,
      sectPrestige: 800,
      disciplesRecruited: 50,
      tributePerDay: 1200,
      metals: {
        '天锻神金': 4,
        '生命之金': 5
      },
      rareItemDesc: '武魂殿长老令 & 万年魂骨精粹'
    },
    status: 'active'
  },
  {
    id: 'challenge_elephant_armor_1',
    title: '【象甲宗 · 踏平山门下战书】',
    senderSect: '象甲宗 · 呼延氏',
    senderLeader: '宗主 呼延震 (89级魂斗罗巅峰)',
    difficulty: 'normal',
    difficultyName: '暴力对决 · 重甲冲撞',
    difficultyColor: 'text-amber-400 border-amber-500/50 bg-amber-950/30',
    letterText: '“哼！听说你唐门力堂与御堂号称天下强攻与防御无双？我呼延震带八位猛犸魂斗罗亲自登门！若你们暗器破不开我钻石猛犸真身，这宗门招牌便给我当踏脚石！”',
    enemyLeaderStats: {
      name: '象甲宗宗主 · 呼延震',
      title: '下四宗 · 89级钻石猛犸魂斗罗',
      level: 89,
      hp: 320000,
      maxHp: 320000,
      shield: 80000,
      maxShield: 80000,
      atk: 14000,
      def: 21000,
      speed: 45,
      skills: [
        { name: '猛犸践踏 · 地裂狂轰', desc: '践踏地面引发剧烈冲击波，眩晕目标1回合', dmg: 16000 },
        { name: '钻石猛犸真身', desc: '钻石重铠包裹全身，反弹30%近战伤害并暴增防御', dmg: 12000 },
        { name: '泰山压顶狂暴践踏', desc: '如崩塌山岳砸向全场，造成庞大震荡伤害', dmg: 22000, isUltimate: true }
      ]
    },
    rewards: {
      gold: 30000,
      sectFunds: 3500,
      sectPrestige: 450,
      disciplesRecruited: 30,
      tributePerDay: 600,
      metals: {
        '玄武铁': 8,
        '暗金': 10
      },
      rareItemDesc: '象甲宗玄武盾魂 & 钻石猛犸铠板'
    },
    status: 'active'
  },
  {
    id: 'challenge_holy_ghost_cult_1',
    title: '【圣灵教 · 幽冥厉鬼血杀令】',
    senderSect: '圣灵教邪魂师暗影分部',
    senderLeader: '副教主 · 万魂斗罗 (93级邪魂斗罗)',
    difficulty: 'hard',
    difficultyName: '邪魂入侵 · 厉鬼袭杀',
    difficultyColor: 'text-purple-400 border-purple-500/50 bg-purple-950/30',
    letterText: '“桀桀桀！唐门弟子的气血血气充沛异常，乃是本座万魂幡最好的滋补大品！今夜子时百鬼夜行，本座亲自抽取你等灵魂！”',
    enemyLeaderStats: {
      name: '万魂斗罗 (邪魂师长老)',
      title: '圣灵教 93级噬魂邪斗罗',
      level: 93,
      hp: 350000,
      maxHp: 350000,
      shield: 40000,
      maxShield: 40000,
      atk: 20500,
      def: 11500,
      speed: 92,
      skills: [
        { name: '百鬼夜行 · 噬魂煞', desc: '召唤厉鬼啃噬经脉，造成严重精神与灵魂伤害', dmg: 23000 },
        { name: '九幽毒煞瘴气', desc: '喷吐毒雾使敌方每回合扣除8%最大生命', dmg: 18000 },
        { name: '万魂幡 · 寂灭血海', desc: '引爆血海，将所造成伤害的50%转化为自身治疗', dmg: 32000, isUltimate: true }
      ]
    },
    rewards: {
      gold: 42000,
      sectFunds: 5000,
      sectPrestige: 680,
      disciplesRecruited: 40,
      tributePerDay: 900,
      metals: {
        '暗魔神玉': 3,
        '魔银': 8
      },
      rareItemDesc: '辟邪舍利珠 & 邪教圣主令'
    },
    status: 'active'
  },
  {
    id: 'challenge_wind_sword_1',
    title: '【风剑宗 & 火豹宗 · 友好切磋帖】',
    senderSect: '风剑宗与火豹宗联军',
    senderLeader: '风剑斗罗 (88级魂斗罗)',
    difficulty: 'easy',
    difficultyName: '同道切磋 · 试剑唐门',
    difficultyColor: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/30',
    letterText: '“风剑宗宗主率火豹宗长老带高足拜山并奉上厚礼！久闻唐门绝学与暗器神威，特来拜会切磋！若唐门胜出，我等愿奉上岁贡结为同盟！”',
    enemyLeaderStats: {
      name: '风剑斗罗与火豹斗罗',
      title: '风剑宗 88级敏攻魂斗罗',
      level: 88,
      hp: 240000,
      maxHp: 240000,
      shield: 30000,
      maxShield: 30000,
      atk: 15500,
      def: 9800,
      speed: 95,
      skills: [
        { name: '疾风剑气 · 万剑穿心', desc: '挥舞数百道呼啸剑气穿透全场', dmg: 14000 },
        { name: '烈火豹爪狂袭', desc: '跃起烈焰爪击，附带严重灼烧效果', dmg: 17000 },
        { name: '九天风剑 · 冰霜闪击', desc: '雷霆极速斩击，无视敌方40%防御', dmg: 21000, isUltimate: true }
      ]
    },
    rewards: {
      gold: 20000,
      sectFunds: 2200,
      sectPrestige: 320,
      disciplesRecruited: 20,
      tributePerDay: 400,
      metals: {
        '精金': 6,
        '秘银': 6
      },
      rareItemDesc: '万剑图录 & 剑宗切磋贡金'
    },
    status: 'active'
  }
];

// Initialize default Tang Sect state
export function createInitialTangSectState(): TangSectState {
  return {
    isEstablished: false,
    sectName: '唐门',
    sectMotto: '唐门暗器雄霸天下，玄天宝录万古长青！',
    sectLevel: 1,
    sectRankTitle: '初创草创宗门',
    prosperity: 100,
    prestige: 150,
    sectFunds: 2000,
    totalDisciples: 50,
    eliteDisciples: 8,
    elderCount: 4,
    halls: INITIAL_SECT_HALLS,
    visitors: [...SECT_TRADE_VISITORS_POOL],
    challenges: [...SECT_CHALLENGE_LETTERS_POOL],
    completedTradesCount: 0,
    repelledChallengesCount: 0,
    dailyTributeAccumulated: 0,
    lastTributeClaimTime: Date.now()
  };
}
