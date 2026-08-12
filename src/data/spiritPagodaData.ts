import { 
  SpiritSoul, 
  SpiritAscensionStage, 
  SpiritBeastSanctuaryZone, 
  MechaCraftingRecipe, 
  SpiritPagodaState 
} from '../types/spiritPagoda';

export const PAGODA_RANKS = [
  { level: 1, title: '传灵新手使者', meritRequired: 0, goldRequired: 0, crystalsRequired: 0, dailyRainGold: 3000, dailyRainCrystals: 20, desc: '初入传灵塔，学习基础魂灵契约法门。' },
  { level: 2, title: '传灵巡查使', meritRequired: 300, goldRequired: 5000, crystalsRequired: 50, dailyRainGold: 6000, dailyRainCrystals: 40, desc: '巡查星斗大森林与猎杀保护区，调解人兽纷争。' },
  { level: 3, title: '传灵执事主管', meritRequired: 800, goldRequired: 15000, crystalsRequired: 100, dailyRainGold: 12000, dailyRainCrystals: 80, desc: '主理分塔分殿，为青年魂师主持升灵仪式。' },
  { level: 4, title: '传灵议会长老', meritRequired: 1800, goldRequired: 35000, crystalsRequired: 200, dailyRainGold: 25000, dailyRainCrystals: 150, desc: '跻身长老议会，掌握十万年凶兽魂灵融合秘术。' },
  { level: 5, title: '传灵副塔主', meritRequired: 3500, goldRequired: 80000, crystalsRequired: 400, dailyRainGold: 50000, dailyRainCrystals: 300, desc: '执掌全大陆升灵台与魂兽保护区，声名远播。' },
  { level: 6, title: '至高传灵塔主', meritRequired: 7000, goldRequired: 200000, crystalsRequired: 800, dailyRainGold: 100000, dailyRainCrystals: 600, desc: '继承冰冰斗罗霍雨浩之遗志，建立人与魂兽永恒和平！' }
];

export const INITIAL_SPIRIT_SOULS: SpiritSoul[] = [
  {
    id: 'soul_tianmeng',
    name: '天梦冰蚕',
    beastTitle: '百万年精神智慧魂灵',
    rarity: 'million',
    rarityTitle: '百万年神级魂灵',
    years: 1000000,
    element: 'mental',
    icon: '🐛',
    avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    level: 1,
    isContracted: true,
    isBattling: true,
    statsBonus: {
      atk: 1200,
      def: 800,
      hp: 15000,
      speed: 120,
      critRate: 8.5
    },
    passiveAura: {
      name: '百万年精神本源',
      desc: '全队魂力与全属性+15%，攻击附带灵魂穿透',
      boostPct: 15
    },
    spiritSkill: {
      name: '天梦精神冲击',
      chineseName: '天梦 · 灵眸天灾神光',
      desc: '释放百万年神级精神冲击波，重创灵魂并眩晕目标1回合！',
      damageMultiplier: 2.8,
      cooldownTurns: 3,
      currentCooldown: 0,
      debuffEffect: 'stun',
      spiritEffect: '精神冲击：造成280%真实精神伤害并附带1回合灵魂眩晕',
      animationType: 'mental'
    },
    contractCost: { gold: 0, spiritCrystals: 0, requiredPagodaRank: 1 },
    evolutionCost: { spiritCrystals: 80, gold: 5000 },
    lore: '大陆历史上唯一的百万年魂兽，蕴含庞大精神本源，魂灵体系始祖！',
    species: '天梦冰蚕',
    synergyGroup: '冰霜灵契'
  },
  {
    id: 'soul_xuedi',
    name: '雪帝 · 冰天雪女',
    beastTitle: '极北三大天王之首 · 70万年凶兽',
    rarity: 'thirtytenthousand',
    rarityTitle: '70万年雪女魂灵',
    years: 700000,
    element: 'ice',
    icon: '❄️',
    avatarUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
    level: 1,
    isContracted: true,
    isBattling: true,
    statsBonus: {
      atk: 2200,
      def: 1400,
      hp: 24000,
      speed: 150,
      critRate: 12.0
    },
    passiveAura: {
      name: '极致之冰 · 绝对零度',
      desc: '冰系与水系伤害+25%，所有攻击附带寒冰迟钝',
      boostPct: 20
    },
    spiritSkill: {
      name: '帝寒天 · 帝剑雪帝三绝',
      chineseName: '雪帝三绝 · 帝剑无双',
      desc: '凝聚极致寒冰为帝剑斩击，斩断生机并冰冻目标！',
      damageMultiplier: 3.6,
      cooldownTurns: 4,
      currentCooldown: 0,
      debuffEffect: 'freeze',
      spiritEffect: '帝剑无双：造成360%极寒穿透伤害并冰冻敌方1回合',
      animationType: 'ice'
    },
    contractCost: { gold: 12000, spiritCrystals: 60, requiredPagodaRank: 1 },
    evolutionCost: { spiritCrystals: 120, gold: 10000 },
    lore: '天地灵气凝聚而生的雪精，极北之地至高无上的主宰！',
    species: '冰天雪女',
    synergyGroup: '极北三大天王'
  },
  {
    id: 'soul_bingdi',
    name: '冰帝 · 冰碧帝皇蝎',
    beastTitle: '极北三大天王次席 · 39万年凶兽',
    rarity: 'thirtytenthousand',
    rarityTitle: '39万年极北主宰',
    years: 390000,
    element: 'ice',
    icon: '🦂',
    avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    level: 1,
    isContracted: false,
    isBattling: false,
    statsBonus: {
      atk: 1850,
      def: 1600,
      hp: 20000,
      speed: 130,
      critRate: 10.0
    },
    passiveAura: {
      name: '永冻之冰 · 冰皇护铠',
      desc: '物理防御+20%，受到攻击时反弹15%极寒刺骨伤害',
      boostPct: 18
    },
    spiritSkill: {
      name: '冰帝螯 · 永冻之域',
      chineseName: '冰帝之怒 · 永冻领域',
      desc: '挥舞碧绿双螯，掀起浩瀚寒潮，撕裂并深度冰冻敌人！',
      damageMultiplier: 3.2,
      cooldownTurns: 3,
      currentCooldown: 0,
      spiritEffect: '冰帝螯：造成320%爆发伤害并叠加3层极寒剧毒',
      animationType: 'ice'
    },
    contractCost: { gold: 8000, spiritCrystals: 50, requiredPagodaRank: 2 },
    evolutionCost: { spiritCrystals: 100, gold: 8000 },
    lore: '极北之地身披翡翠钻石晶铠的蝎皇，守卫北方苔原的无双霸主！',
    species: '冰碧帝皇蝎',
    synergyGroup: '极北三大天王'
  },
  {
    id: 'soul_bajiao',
    name: '八角玄冰草',
    beastTitle: '冰火两仪眼十万年仙草魂灵',
    rarity: 'hundredthousand',
    rarityTitle: '十万年仙草魂灵',
    years: 100000,
    element: 'wood',
    icon: '🌸',
    avatarUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&q=80',
    level: 1,
    isContracted: false,
    isBattling: false,
    statsBonus: {
      atk: 1100,
      def: 950,
      hp: 18000,
      speed: 90,
      critRate: 6.0
    },
    passiveAura: {
      name: '仙草润泽',
      desc: '战斗中每回合自动回复6%最大气血与10点魂力',
      boostPct: 12
    },
    spiritSkill: {
      name: '八角玄冰舞',
      chineseName: '八角万年玄冰阵',
      desc: '撒播仙草寒霜花粉，庇护全队并在敌方脚下引爆寒冰！',
      damageMultiplier: 2.2,
      cooldownTurns: 3,
      currentCooldown: 0,
      healAmount: 12000,
      shieldAmount: 20000,
      spiritEffect: '八角复苏：造成220%伤害并生成20,000点气血的冰霜护盾',
      animationType: 'wood'
    },
    contractCost: { gold: 5000, spiritCrystals: 35, requiredPagodaRank: 2 },
    evolutionCost: { spiritCrystals: 70, gold: 4000 },
    lore: '诞生于冰火两仪眼的极致寒冰至宝，吸纳无尽天地精华。',
    species: '八角玄冰草',
    synergyGroup: '仙品灵智'
  },
  {
    id: 'soul_xiedi',
    name: '邪眼暴君主宰 · 邪帝',
    beastTitle: '十大凶兽次席 · 79万年邪帝',
    rarity: 'thirtytenthousand',
    rarityTitle: '79万年时空魔瞳',
    years: 790000,
    element: 'dark',
    icon: '👁️',
    avatarUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
    level: 1,
    isContracted: false,
    isBattling: false,
    statsBonus: {
      atk: 2500,
      def: 1300,
      hp: 22000,
      speed: 160,
      critRate: 15.0
    },
    passiveAura: {
      name: '时空扭曲视界',
      desc: '暴击伤害+35%，攻击无视敌方25%物理与魔法防御',
      boostPct: 22
    },
    spiritSkill: {
      name: '时空之光 · 湮灭神光',
      chineseName: '邪帝 · 时空毁灭神光',
      desc: '独眼睁开，喷射贯穿时间与空间的湮灭射线！',
      damageMultiplier: 3.8,
      cooldownTurns: 4,
      currentCooldown: 0,
      spiritEffect: '时空之光：造成380%破甲湮灭伤害并降低敌方30%攻击力与速度',
      animationType: 'dark'
    },
    contractCost: { gold: 20000, spiritCrystals: 90, requiredPagodaRank: 3 },
    evolutionCost: { spiritCrystals: 150, gold: 12000 },
    lore: '邪魔森林绝对主宰，时空毁灭之光可贯穿天空与法则。',
    species: '邪眼暴君主宰',
    synergyGroup: '星斗巨兽'
  },
  {
    id: 'soul_xiongjun',
    name: '暗金恐爪熊 · 熊君',
    beastTitle: '十大凶兽第六席 · 470,000年战熊',
    rarity: 'thirtytenthousand',
    rarityTitle: '470,000年撕天战熊',
    years: 470000,
    element: 'gold',
    icon: '🐻',
    avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    level: 1,
    isContracted: false,
    isBattling: false,
    statsBonus: {
      atk: 2600,
      def: 2100,
      hp: 30000,
      speed: 95,
      critRate: 11.0
    },
    passiveAura: {
      name: '暗金不灭金身',
      desc: '生命上限+25%，受到的暴击伤害降低30%',
      boostPct: 20
    },
    spiritSkill: {
      name: '撕天恐爪 · 撕裂裂隙',
      chineseName: '熊君 · 金色撕天五爪',
      desc: '暗金巨爪撕裂五道空间金色裂隙，破除敌方所有护盾与防御！',
      damageMultiplier: 3.5,
      cooldownTurns: 3,
      currentCooldown: 0,
      spiritEffect: '撕天恐爪：造成350%纯物理破甲撕裂伤害，毁灭敌方所有护盾',
      animationType: 'gold'
    },
    contractCost: { gold: 16000, spiritCrystals: 75, requiredPagodaRank: 3 },
    evolutionCost: { spiritCrystals: 130, gold: 10000 },
    lore: '魂兽界至高近战攻坚霸主，利爪曾正面撕裂兽神帝天！',
    species: '暗金恐爪熊',
    synergyGroup: '星斗巨兽'
  },
  {
    id: 'soul_biji',
    name: '翡翠天鹅 · 碧姬',
    beastTitle: '十大凶兽第四席 · 580,000年治愈圣者',
    rarity: 'thirtytenthousand',
    rarityTitle: '580,000年翡翠天鹅',
    years: 580000,
    element: 'light',
    icon: '🦢',
    avatarUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&q=80',
    level: 1,
    isContracted: false,
    isBattling: false,
    statsBonus: {
      atk: 900,
      def: 1800,
      hp: 35000,
      speed: 140,
      critRate: 5.0
    },
    passiveAura: {
      name: '生命雨露庇佑',
      desc: '全队受到的所有治疗效果+40%，每场战斗触发一次30%免死救赎',
      boostPct: 25
    },
    spiritSkill: {
      name: '普渡众生 · 翡翠之光',
      chineseName: '碧姬 · 翡翠圣光庇护',
      desc: '漫天洒下翡翠羽毛，净化负面效果并恢复庞大生命与护盾！',
      damageMultiplier: 1.5,
      cooldownTurns: 4,
      currentCooldown: 0,
      healAmount: 35000,
      shieldAmount: 25000,
      spiritEffect: '普渡圣光：恢复35,000点生命，净化所有负面状态并生成25,000点护盾',
      animationType: 'light'
    },
    contractCost: { gold: 15000, spiritCrystals: 70, requiredPagodaRank: 3 },
    evolutionCost: { spiritCrystals: 120, gold: 9000 },
    lore: '星斗大森林的神圣治愈天鹅，受全大陆万物生灵爱戴。',
    species: '翡翠天鹅',
    synergyGroup: '星斗巨兽'
  },
  {
    id: 'soul_ditian',
    name: '金眼黑龙王 · 帝天',
    beastTitle: '十大凶兽之首 · 890,000年兽神',
    rarity: 'thirtytenthousand',
    rarityTitle: '890,000年至高兽神',
    years: 890000,
    element: 'dragon',
    icon: '🐉',
    avatarUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
    level: 1,
    isContracted: false,
    isBattling: false,
    statsBonus: {
      atk: 3200,
      def: 2400,
      hp: 38000,
      speed: 170,
      critRate: 16.0
    },
    passiveAura: {
      name: '黑龙神压光环',
      desc: '全属性+20%，对非龙类目标造成额外30%压制伤害',
      boostPct: 25
    },
    spiritSkill: {
      name: '黑龙灭世斩',
      chineseName: '兽神 · 龙王斩灭',
      desc: '调动极致黑龙王神力，劈开苍穹，降下毁灭龙炎审判！',
      damageMultiplier: 4.2,
      cooldownTurns: 4,
      currentCooldown: 0,
      spiritEffect: '龙神灭世：造成420%毁灭性黑龙炎伤害并附带3回合龙炎灼烧',
      animationType: 'dragon'
    },
    contractCost: { gold: 35000, spiritCrystals: 150, requiredPagodaRank: 4 },
    evolutionCost: { spiritCrystals: 200, gold: 18000 },
    lore: '龙神九王之黑龙王纯血后裔，89万年半神级别的至高兽神！',
    species: '金眼黑龙王',
    synergyGroup: '创世龙神'
  },
  {
    id: 'soul_guyuna',
    name: '银龙王虚影 · 古月娜',
    beastTitle: '创世龙神半身 · 百万年元素主宰',
    rarity: 'million',
    rarityTitle: '百万年龙神魂灵',
    years: 1000000,
    element: 'dragon',
    icon: '✨',
    avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    level: 1,
    isContracted: false,
    isBattling: false,
    statsBonus: {
      atk: 3800,
      def: 2800,
      hp: 45000,
      speed: 200,
      critRate: 20.0
    },
    passiveAura: {
      name: '七元素创世法则',
      desc: '全元素伤害+35%，免疫所有负面状态与控制效果',
      boostPct: 30
    },
    spiritSkill: {
      name: '七元素湮灭爆发',
      chineseName: '银龙神术 · 万物本源',
      desc: '完美融合水火土风光暗空间七元素为创世神雷！',
      damageMultiplier: 5.0,
      cooldownTurns: 5,
      currentCooldown: 0,
      spiritEffect: '七元素湮灭：造成500%终极真实伤害并打断敌方所有行动',
      animationType: 'dragon'
    },
    contractCost: { gold: 60000, spiritCrystals: 250, requiredPagodaRank: 5 },
    evolutionCost: { spiritCrystals: 300, gold: 30000 },
    lore: '继承宇宙元素智慧的至高龙皇，魂兽一族真正的主宰！',
    species: '银龙王',
    synergyGroup: '创世龙神'
  }
];

export const INITIAL_ASCENSION_STAGES: SpiritAscensionStage[] = [
  {
    id: 'asc_junior',
    name: '初级升灵台',
    stageLevel: 1,
    difficulty: '普通试炼',
    difficultyColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
    description: '传灵塔为青年魂师搭建的虚拟魂兽森林，栖息着百年与千年级魂兽。',
    bossName: '狂暴嗜血魔狼王',
    bossTitle: '3000年狼王主宰',
    bossHp: 80000,
    bossAtk: 3500,
    bossDef: 1800,
    recommendedLevel: 25,
    rewards: {
      exp: 15000,
      gold: 5000,
      spiritCrystals: 25,
      yearsGain: 500,
      peaceIndexGain: 2
    },
    unlocked: true,
    clearedCount: 0
  },
  {
    id: 'asc_mid',
    name: '中级升灵台',
    stageLevel: 2,
    difficulty: '万年凶险',
    difficultyColor: 'text-purple-400 border-purple-500/40 bg-purple-950/40',
    description: '模拟星斗大森林深处环境，拥有人面魔蛛、地穴魔蛛皇与恐爪幼崽！',
    bossName: '人面魔蛛皇',
    bossTitle: '50000年剧毒霸主',
    bossHp: 250000,
    bossAtk: 8500,
    bossDef: 4500,
    recommendedLevel: 55,
    rewards: {
      exp: 45000,
      gold: 15000,
      spiritCrystals: 60,
      yearsGain: 2500,
      peaceIndexGain: 4
    },
    unlocked: true,
    clearedCount: 0
  },
  {
    id: 'asc_senior',
    name: '高级升灵台',
    stageLevel: 3,
    difficulty: '十万年烈狱',
    difficultyColor: 'text-rose-400 border-rose-500/40 bg-rose-950/40',
    description: '采用顶尖魂导法阵构建，具现十万年泰坦巨猿与天青牛蟒幻影！',
    bossName: '泰坦巨猿残影',
    bossTitle: '森林之王 · 十万年霸主',
    bossHp: 650000,
    bossAtk: 19000,
    bossDef: 11000,
    recommendedLevel: 75,
    rewards: {
      exp: 120000,
      gold: 40000,
      spiritCrystals: 150,
      yearsGain: 10000,
      peaceIndexGain: 6
    },
    unlocked: true,
    clearedCount: 0
  },
  {
    id: 'asc_rampage',
    name: '暴走期 · 升灵狂潮',
    stageLevel: 4,
    difficulty: '神兽暴走 · 至尊试炼',
    difficultyColor: 'text-amber-300 border-amber-500/60 bg-amber-950/60 animate-pulse',
    description: '升灵台核心能量超载，具现凶兽与兽神投影，收益暴增10倍！',
    bossName: '暴走兽神 · 黑龙降世投影',
    bossTitle: '89万年暴走狂乱分身',
    bossHp: 1800000,
    bossAtk: 38000,
    bossDef: 22000,
    recommendedLevel: 90,
    rewards: {
      exp: 350000,
      gold: 120000,
      spiritCrystals: 350,
      yearsGain: 35000,
      peaceIndexGain: 12
    },
    unlocked: true,
    clearedCount: 0
  }
];

export const INITIAL_SANCTUARIES: SpiritBeastSanctuaryZone[] = [
  {
    id: 'sanc_star_lake',
    name: '星斗大森林 · 核心生命之湖',
    description: '全大陆第一魂兽圣地，蕴含浓郁生命之液，由翡翠天鹅碧姬守护。',
    guardianName: '翡翠天鹅 · 碧姬',
    guardianTitle: '生命之湖守护者',
    peaceLevel: 65,
    sanctuaryFunds: 8000,
    dailyHerbGift: '生命泉水精粹',
    buffEffect: '全队生命上限+15%，魂灵能量恢复+20%',
    donateCostGold: 5000
  },
  {
    id: 'sanc_north_snow',
    name: '极北苔原 · 冰雪圣域',
    description: '万年冰封雪原，雪帝与冰帝率领北方魂兽栖息之地，严禁非法猎杀。',
    guardianName: '雪帝 · 冰天雪女',
    guardianTitle: '极北至高主宰',
    peaceLevel: 70,
    sanctuaryFunds: 12000,
    dailyHerbGift: '万年雪莲精华',
    buffEffect: '冰系/水系魂灵技能暴击率+18%，防御力+12%',
    donateCostGold: 8000
  },
  {
    id: 'sanc_evil_forest',
    name: '邪魔森林 · 时空魔瞳圣窟',
    description: '日月大陆西方神秘古林，时空扭曲，邪眼暴君一族繁衍生息。',
    guardianName: '邪眼暴君主宰',
    guardianTitle: '时空古林守护神',
    peaceLevel: 55,
    sanctuaryFunds: 6000,
    dailyHerbGift: '时空晶核碎片',
    buffEffect: '精神系魂技命中率+25%，攻击无视15%防御',
    donateCostGold: 6000
  },
  {
    id: 'sanc_sunset_well',
    name: '落日森林 · 冰火仙草圣谷',
    description: '天地钟爱的阴阳宝池，培育八角玄冰草、烈火杏娇疏等十万年仙草魂兽。',
    guardianName: '绮罗郁金香',
    guardianTitle: '仙草统领',
    peaceLevel: 80,
    sanctuaryFunds: 15000,
    dailyHerbGift: '至尊灵智甘露',
    buffEffect: '每回合自动净化1个负面效果并恢复5,000点生命',
    donateCostGold: 7000
  },
  {
    id: 'sanc_pagoda_park',
    name: '传灵塔 · 万兽生态保护园区',
    description: '传灵塔总部建立的万兽栖息园区，魂师与自愿魂灵共生共修。',
    guardianName: '冰灵使者护卫队',
    guardianTitle: '和平共生导师',
    peaceLevel: 90,
    sanctuaryFunds: 25000,
    dailyHerbGift: '升灵神级晶石',
    buffEffect: '声望与魂兽亲和度每日递增，全魂灵技能伤害+20%',
    donateCostGold: 10000
  }
];

export const INITIAL_CRAFTABLE_MECHAS: MechaCraftingRecipe[] = [
  {
    id: 'mecha_yellow_assault',
    name: '黄级 · 破甲强攻机甲',
    grade: 'yellow',
    gradeName: '黄级 (标准制式)',
    gradeColor: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
    type: 'assault',
    typeName: '强攻近战型',
    description: '全大陆标准制式个人单兵机甲，配备高频合金震动刃与轻型魂力护盾。',
    craftCost: {
      gold: 15000,
      spiritCrystals: 50,
      metals: { 'Refined Steel': 20 }
    },
    combatStats: {
      hp: 35000,
      atk: 1500,
      def: 1200,
      speed: 60,
      shield: 25000
    },
    mechaWeapon: {
      name: '高频震动长刃',
      desc: '高速旋转近战斩击，造成180%物理破甲伤害',
      dmgMultiplier: 1.8,
      cooldown: 2
    },
    isCrafted: false,
    isEquipped: false
  },
  {
    id: 'mecha_purple_wind',
    name: '紫级 · 狂风影刃机甲',
    grade: 'purple',
    gradeName: '紫级 (精英进阶)',
    gradeColor: 'text-purple-400 border-purple-500/40 bg-purple-950/40',
    type: 'stealth',
    typeName: '高速敏攻型',
    description: '配备矢量魂力推进引擎与折叠双刃，极适合敏攻系魂师驾驭。',
    craftCost: {
      gold: 35000,
      spiritCrystals: 120,
      metals: { 'Spirit Forged Mithril': 25, 'Refined Steel': 30 }
    },
    combatStats: {
      hp: 60000,
      atk: 2800,
      def: 2000,
      speed: 130,
      shield: 45000
    },
    mechaWeapon: {
      name: '疾风影刃光剑',
      desc: '迅雷不及掩耳连续三次斩击，造成260%极速暴击伤害',
      dmgMultiplier: 2.6,
      cooldown: 3
    },
    isCrafted: false,
    isEquipped: false
  },
  {
    id: 'mecha_black_cannon',
    name: '黑级 · 玄冥重装攻城炮机甲',
    grade: 'black',
    gradeName: '黑级 (封号斗罗级)',
    gradeColor: 'text-slate-200 border-slate-600 bg-slate-900',
    type: 'heavy',
    typeName: '超重型远攻炮火型',
    description: '肩扛超聚能魂力毁灭巨炮，拥有灵锻坚固重装甲，足以平定重山！',
    craftCost: {
      gold: 80000,
      spiritCrystals: 280,
      metals: { 'Spirit Forged Red Gold': 20, 'Spirit Forged Mithril': 40 }
    },
    combatStats: {
      hp: 120000,
      atk: 5200,
      def: 4500,
      speed: 80,
      shield: 100000
    },
    mechaWeapon: {
      name: '玄冥毁灭重炮',
      desc: '蓄力轰出毁灭神光，对全场敌方造成360%毁天灭地范围伤害',
      dmgMultiplier: 3.6,
      cooldown: 4
    },
    isCrafted: false,
    isEquipped: false
  },
  {
    id: 'mecha_black_justice',
    name: '黑级 · 狂雷裁决者机甲',
    grade: 'black',
    gradeName: '黑级 (封号斗罗级)',
    gradeColor: 'text-cyan-300 border-cyan-500/50 bg-slate-900',
    type: 'assault',
    typeName: '全能强攻型',
    description: '传灵塔核心长老定制机甲，将雷霆魂力与纳米液态金属外骨骼完美融合。',
    craftCost: {
      gold: 95000,
      spiritCrystals: 320,
      metals: { 'Spirit Forged Red Gold': 25, 'Spirit Forged Mithril': 50 }
    },
    combatStats: {
      hp: 140000,
      atk: 6000,
      def: 4800,
      speed: 120,
      shield: 120000
    },
    mechaWeapon: {
      name: '狂雷裁决神枪',
      desc: '掷出九天狂雷神枪，造成400%穿透暴击伤害并麻痹目标',
      dmgMultiplier: 4.0,
      cooldown: 3
    },
    isCrafted: false,
    isEquipped: false
  },
  {
    id: 'mecha_red_dragon',
    name: '红级 · 龙皇弑神机甲',
    grade: 'red',
    gradeName: '红级神装机甲 (半神级)',
    gradeColor: 'text-rose-400 border-rose-500/70 bg-rose-950/50 shadow-[0_0_15px_rgba(225,29,72,0.4)]',
    type: 'god',
    typeName: '弑神机甲',
    description: '真龙骨骼与天锻神金打造的至高红色神级机甲，战力直逼极限斗罗！',
    craftCost: {
      gold: 250000,
      spiritCrystals: 700,
      metals: { 'Divine Heavenly Forged Gold': 10, 'Spirit Forged Red Gold': 50, 'Spirit Forged Mithril': 80 }
    },
    combatStats: {
      hp: 280000,
      atk: 12000,
      def: 9500,
      speed: 180,
      shield: 220000
    },
    mechaWeapon: {
      name: '龙皇弑神斩 · 破空',
      desc: '激发天锻神核点燃龙皇之怒，爆发520%灭世威能！',
      dmgMultiplier: 5.2,
      cooldown: 4
    },
    isCrafted: false,
    isEquipped: false
  },
  {
    id: 'mecha_god_ice_bing',
    name: '神级 · 冰灵神兵 · 雨浩号',
    grade: 'god',
    gradeName: '永恒神级机甲 (神明傀儡)',
    gradeColor: 'text-amber-300 border-amber-400 bg-gradient-to-r from-amber-950/60 via-purple-950/60 to-cyan-950/60 shadow-[0_0_25px_rgba(251,191,36,0.6)] animate-pulse',
    type: 'god',
    typeName: '情绪之神傀儡',
    description: '冰冰斗罗霍雨浩亲自留下的至高神级机甲，可同时搭载四大神级魂灵！',
    craftCost: {
      gold: 600000,
      spiritCrystals: 1500,
      metals: { 'Divine Heavenly Forged Gold': 25, 'Spirit Forged Red Gold': 100, 'Spirit Forged Mithril': 150 }
    },
    combatStats: {
      hp: 500000,
      atk: 25000,
      def: 18000,
      speed: 260,
      shield: 400000
    },
    mechaWeapon: {
      name: '情绪神雷 · 极光炮',
      desc: '融合七情六欲与绝对零度法则，引爆680%宇宙神罚！',
      dmgMultiplier: 6.8,
      cooldown: 4
    },
    isCrafted: false,
    isEquipped: false
  }
];

export function createInitialSpiritPagodaState(): SpiritPagodaState {
  return {
    isEstablished: true,
    pagodaName: '传灵塔',
    pagodaLevel: 1,
    pagodaTitle: '传灵新手使者',
    pagodaMerits: 150,
    spiritCrystals: 120,
    spiritBeastPeaceIndex: 68,
    lastPeaceRainClaimTimestamp: 0,
    spiritSouls: [...INITIAL_SPIRIT_SOULS],
    activeBattlingSoulIds: ['soul_tianmeng', 'soul_xuedi'],
    craftedMechas: [...INITIAL_CRAFTABLE_MECHAS],
    activeMechaId: null,
    sanctuaries: [...INITIAL_SANCTUARIES],
    ascensionStages: [...INITIAL_ASCENSION_STAGES],
    totalSoulBeastsSaved: 128,
    ascensionClearedCount: 0
  };
}
