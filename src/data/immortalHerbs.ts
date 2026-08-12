import { ImmortalHerb } from '../types/game';

export const ICE_FIRE_HERBS: ImmortalHerb[] = [
  {
    id: 'ice_fire_dual_herbs',
    name: '八角玄冰草与烈火杏娇疏',
    chineseName: '两极仙品 · 冰火双生仙草',
    description: '极寒极热两极仙草！一株采于寒冰刺骨之泉，淬炼冰肌玉骨；一株采于烈火滚烫之池，灼烧奇经八脉。需同时服用并借助冰火两仪眼冰火交融炼化。',
    effectDesc: '获得【水火不侵、百毒不生】金身！永久提升魂力5级，生命上限+3,000，防御+200，并完全免疫冰冻、灼烧与剧毒负面状态！',
    consumed: false,
    rarity: 'divine',
    statsBoost: {
      soulPowerLevel: 5,
      hpMax: 3000,
      def: 200,
      atk: 150
    }
  },
  {
    id: 'lovesick_heartbroken_red',
    name: '相思断肠红',
    chineseName: '仙草至尊 · 相思断肠红',
    description: '花中之王，天地灵粹！唯有采摘者倾注至情至爱的吐血方能摘下。具备生死肉骨、重塑至尊神魂的奇迹！',
    effectDesc: '瞬间暴增魂力10级！生命上限+8,000，全属性+35%，并获得战斗被动【不灭涅槃 · 瞬间满血复活】（每场战斗生效一次）！',
    consumed: false,
    rarity: 'divine',
    statsBoost: {
      soulPowerLevel: 10,
      hpMax: 8000,
      atk: 450,
      def: 350,
      speed: 40,
      crit: 15
    }
  },
  {
    id: 'strange_velvet_chrysanthemum',
    name: '奇绒通天菊',
    chineseName: '中和仙草 · 奇绒通天菊',
    description: '服之气通四肢，血贯八脉，可练就金刚不坏之身，通天达地。',
    effectDesc: '提升魂力6级，获得【金刚不坏之身】，攻击+350，物理防御+300，且受到的伤害降低25%。',
    consumed: false,
    rarity: 'immortal',
    statsBoost: {
      soulPowerLevel: 6,
      atk: 350,
      def: 300,
      hpMax: 2500
    }
  },
  {
    id: 'water_gazing_eye_dew',
    name: '望穿秋水露',
    chineseName: '精神仙草 · 望穿秋水露',
    description: '晶莹剔透，食之洗涤眼部奇经八脉，彻底蜕变精神力之核。',
    effectDesc: '瞬间提升【紫极魔瞳】至最高【浩瀚境界】，暴击率+25%，暴击伤害+50%，并免疫所有精神控制与幻术！',
    consumed: false,
    rarity: 'immortal',
    statsBoost: {
      soulPowerLevel: 4,
      crit: 25,
      atk: 200,
      speed: 30
    }
  },
  {
    id: 'immortal_tulip',
    name: '绮罗郁金香',
    chineseName: '高贵仙品 · 绮罗郁金香',
    description: '雍容华贵，能吸天地精华，日月之光。可解除器武魂的层数限制！',
    effectDesc: '提升魂力6级。若武魂为【七宝琉璃塔】，将触发神迹进化为【九宝琉璃塔】！全队增益效果额外提升50%！',
    consumed: false,
    rarity: 'immortal',
    targetSoulId: 'nine_treasure_pagoda',
    statsBoost: {
      soulPowerLevel: 6,
      hpMax: 4000,
      speed: 45
    }
  },
  {
    id: 'narcissus_jade_bone',
    name: '水仙玉肌骨',
    chineseName: '润泽仙品 · 水仙玉肌骨',
    description: '润筋补骨，通畅奇经八脉，使肉身轻盈如飞，冰清玉洁。',
    effectDesc: '提升魂力5级，速度+50，闪避率+20%，且受到的伤害降低15%。',
    consumed: false,
    rarity: 'immortal',
    statsBoost: {
      soulPowerLevel: 5,
      speed: 50,
      hpMax: 2000,
      def: 180
    }
  },
  {
    id: 'phoenix_sunflower',
    name: '鸡冠凤凰葵',
    chineseName: '纯阳火仙草 · 鸡冠凤凰葵',
    description: '纯阳至宝，可净化提炼兽武魂中的杂质邪火，升华为九天九炽纯净神火！',
    effectDesc: '提升魂力6级。若武魂为【邪火凤凰】，进化为【九转神凰】，火系技能伤害+60%并无视40%火抗！',
    consumed: false,
    rarity: 'immortal',
    targetSoulId: 'evil_fire_phoenix',
    statsBoost: {
      soulPowerLevel: 6,
      atk: 400,
      crit: 20
    }
  },
  {
    id: 'fragrant_silk_herb',
    name: '幽香绮罗仙品',
    chineseName: '解毒至尊 · 幽香绮罗仙品',
    description: '百草之王，万毒克星！香飘十里，在此香气范围内，世间一切致命剧毒皆化为乌有。',
    effectDesc: '永久获得【辟毒神庇】：战斗开始时净化全队负面效果，并生成相当于3000伤害的幽香防护罩。',
    consumed: false,
    rarity: 'immortal',
    statsBoost: {
      soulPowerLevel: 4,
      def: 250,
      hpMax: 3500
    }
  }
];
