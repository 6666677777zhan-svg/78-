export type GodType = 'seagod' | 'asura' | 'angel' | 'rakshasa';

export interface GodTest {
  level: number; // 1 to 9
  godType: GodType;
  title: string;
  name: string;
  description: string;
  requirementLevel: number;
  stepsCount?: number;
  rewardAffinity: number;
  rewardExp: number;
  rewardItemName: string;
  bossId?: string;
  bossName?: string;
  bossTitle?: string;
  bossHp?: number;
  bossAtk?: number;
  bossDef?: number;
  specialChallengeType: 'steps' | 'boss' | 'tide' | 'weapon' | 'meditation' | 'godhood';
  artifactUnlocked?: string;
  domainUnlocked?: string;
}

export interface GodInheritanceInfo {
  id: GodType;
  name: string;
  title: string;
  element: string;
  artifactName: string;
  domainName: string;
  description: string;
  colorScheme: {
    bannerBg: string;
    badgeBg: string;
    border: string;
    accentText: string;
    glowColor: string;
    buttonBg: string;
  };
  tests: GodTest[];
}

// 1. 海神九考
export const SEA_GOD_TESTS: GodTest[] = [
  {
    level: 1,
    godType: 'seagod',
    title: '海神第一考',
    name: '穿越海神之光 · 登临 333 级海神阶梯',
    description: '在双倍神性重力压迫下，顶着浩瀚神威一步步攀登海神岛 333 级神圣阶梯，极限淬炼经脉与神魂意志！',
    requirementLevel: 50,
    stepsCount: 333,
    rewardAffinity: 5,
    rewardExp: 50000,
    rewardItemName: '海神之光亲和印记 + 全魂环年限+500年',
    specialChallengeType: 'steps'
  },
  {
    level: 2,
    godType: 'seagod',
    title: '海神第二考',
    name: '突破环形海魔魂大白鲨封锁',
    description: '在不伤害十万年魔魂大白鲨之王的前提下，运用精妙身法与控制技巧，突破环形海严密防御圈！',
    requirementLevel: 60,
    rewardAffinity: 5,
    rewardExp: 90000,
    rewardItemName: '瀚海听涛秘法 + 全魂环年限+1,000年',
    specialChallengeType: 'boss',
    bossName: '魔魂大白鲨之王 · 小白',
    bossTitle: '十万年海魂兽至尊',
    bossHp: 42000,
    bossAtk: 980,
    bossDef: 600
  },
  {
    level: 3,
    godType: 'seagod',
    title: '海神第三考',
    name: '怒浪绝境 · 潮汐淬体锻金身',
    description: '身缚怒浪沉银柱，日夜承受万吨惊涛骇浪无情拍击，锻造万劫不灭之强韧经脉金身！',
    requirementLevel: 70,
    rewardAffinity: 10,
    rewardExp: 150000,
    rewardItemName: '潮汐神体 · 永久防御力+40% + 全魂环年限+1,500年',
    specialChallengeType: 'tide'
  },
  {
    level: 4,
    godType: 'seagod',
    title: '海神第四考',
    name: '荡平深海邪魔 · 斩杀十万年邪魔虎鲸王',
    description: '协助魔魂大白鲨族群深入深海深渊，荡平嗜血凶残的十万年邪魔虎鲸王，平定海洋危机！',
    requirementLevel: 75,
    rewardAffinity: 10,
    rewardExp: 220000,
    rewardItemName: '十万年邪魔虎鲸王左腿骨 + 全魂环年限+2,000年',
    specialChallengeType: 'boss',
    bossName: '十万年邪魔虎鲸王',
    bossTitle: '嗜血残暴深海霸主',
    bossHp: 65000,
    bossAtk: 1450,
    bossDef: 850
  },
  {
    level: 5,
    godType: 'seagod',
    title: '海神第五考',
    name: '挑战海神岛七大圣柱斗罗',
    description: '三日内连战海马、海矛、海星、海魔女、海龙等海神岛七大圣柱封号斗罗，全胜登顶！',
    requirementLevel: 80,
    rewardAffinity: 15,
    rewardExp: 350000,
    rewardItemName: '海神领域蜕变升阶 + 全魂环年限+3,000年',
    domainUnlocked: '海神领域',
    specialChallengeType: 'boss',
    bossName: '七圣柱之首 · 海龙斗罗',
    bossTitle: '95级强攻系封号斗罗',
    bossHp: 85000,
    bossAtk: 1950,
    bossDef: 1150
  },
  {
    level: 6,
    godType: 'seagod',
    title: '海神第六考',
    name: '在99级绝世斗罗波塞西手下坚持一炷香',
    description: '正面对决无限接近神级的海神岛大祭司波塞西！在浩瀚无垠的海洋掌控与神力威压下坚持到底！',
    requirementLevel: 85,
    rewardAffinity: 20,
    rewardExp: 600000,
    rewardItemName: '海神之心彻底觉醒 · 海神亲和度达到85%',
    specialChallengeType: 'boss',
    bossName: '海神大祭司 · 波塞西',
    bossTitle: '99级绝世斗罗（半神）',
    bossHp: 150000,
    bossAtk: 3100,
    bossDef: 1900
  },
  {
    level: 7,
    godType: 'seagod',
    title: '海神第七考',
    name: '拔出超神器 · 海神三叉戟',
    description: '凝聚全身瀚海魂力与海神之光，拔出重达十万八千斤的真神器【海神三叉戟】！',
    requirementLevel: 90,
    rewardAffinity: 15,
    rewardExp: 1000000,
    rewardItemName: '执掌超神器【海神三叉戟】· 解锁黄金十三戟！',
    artifactUnlocked: '海神三叉戟',
    specialChallengeType: 'weapon'
  },
  {
    level: 8,
    godType: 'seagod',
    title: '海神第八考',
    name: '斩杀99万年深海魔鲸王 · 重铸全神级魂环',
    description: '战胜百万年海魂兽至尊深海魔鲸王，将九大魂环全数蜕变为十万年乃至神级金环！',
    requirementLevel: 95,
    rewardAffinity: 15,
    rewardExp: 2000000,
    rewardItemName: '99万年魔鲸躯干骨 + 百万年灿金神级魂环！',
    specialChallengeType: 'boss',
    bossName: '深海魔鲸王（准神级）',
    bossTitle: '99万年深海绝对主宰',
    bossHp: 240000,
    bossAtk: 3600,
    bossDef: 2300
  },
  {
    level: 9,
    godType: 'seagod',
    title: '海神第九考',
    name: '海神神位降临 · 百级成神！',
    description: '打破凡人界限，融合海神神位，召唤海神神装，登临百级真神之境，统御诸天万界汪洋！',
    requirementLevel: 99,
    rewardAffinity: 5,
    rewardExp: 9999999,
    rewardItemName: '成就【百级真神 · 海神】！所有神级魂技无消耗释放！',
    domainUnlocked: '海神领域',
    artifactUnlocked: '海神三叉戟',
    specialChallengeType: 'godhood'
  }
];

// 2. 修罗神九考
export const ASURA_GOD_TESTS: GodTest[] = [
  {
    level: 1,
    godType: 'asura',
    title: '修罗第一考',
    name: '地狱杀戮场 · 斩获三十连胜',
    description: '在被封禁魂技的杀戮之都地狱杀戮场中，凭借纯粹肉身与唐门绝技连斩三十位穷凶极恶之徒！',
    requirementLevel: 50,
    stepsCount: 30,
    rewardAffinity: 5,
    rewardExp: 50000,
    rewardItemName: '修罗杀戮印记 + 永久物理破甲+25%',
    specialChallengeType: 'steps'
  },
  {
    level: 2,
    godType: 'asura',
    title: '修罗第二考',
    name: '勇闯地狱路 · 斩杀暗金三头蝙蝠王',
    description: '踏足地狱路血池窄桥，力战千年暗金三头蝙蝠王，破其断肢重生之躯！',
    requirementLevel: 60,
    rewardAffinity: 5,
    rewardExp: 90000,
    rewardItemName: '暗金血翼幻身 + 永久暴击率+15%',
    specialChallengeType: 'boss',
    bossName: '暗金三头蝙蝠王',
    bossTitle: '地狱路远古魔君',
    bossHp: 45000,
    bossAtk: 1050,
    bossDef: 550
  },
  {
    level: 3,
    godType: 'asura',
    title: '修罗第三考',
    name: '斩杀十首烈阳蛇 · 夺取洪荒内丹',
    description: '在地狱血海中斩灭洪荒异兽十首烈阳蛇，炼化其赤红内丹，获得万毒不侵之体！',
    requirementLevel: 70,
    rewardAffinity: 10,
    rewardExp: 150000,
    rewardItemName: '十首烈阳蛇内丹（万毒不侵） + 攻击力+30%',
    specialChallengeType: 'boss',
    bossName: '十首烈阳蛇',
    bossTitle: '洪荒纯阳异兽',
    bossHp: 56000,
    bossAtk: 1300,
    bossDef: 720
  },
  {
    level: 4,
    godType: 'asura',
    title: '修罗第四考',
    name: '杀戮之都血脉洗礼 · 觉醒杀神领域',
    description: '将无尽杀气凝炼于识海，蜕变为纯白实质杀气，成功铭刻修罗杀神领域！',
    requirementLevel: 75,
    rewardAffinity: 10,
    rewardExp: 220000,
    rewardItemName: '杀神领域觉醒 · 敌方全属性-20% / 自身攻击+25%',
    domainUnlocked: '杀神领域',
    specialChallengeType: 'meditation'
  },
  {
    level: 5,
    godType: 'asura',
    title: '修罗第五考',
    name: '唤醒杀戮之王 · 共鸣唐晨半神之魂',
    description: '以海神之光破除血红九头蝙蝠王寄生，与一代绝世半神唐晨神念共鸣交锋！',
    requirementLevel: 80,
    rewardAffinity: 15,
    rewardExp: 350000,
    rewardItemName: '修罗神念灌注 + 昊天锤/主武魂魂环年限+3,000年',
    specialChallengeType: 'boss',
    bossName: '杀戮之王（唐晨神念）',
    bossTitle: '99级修罗半神',
    bossHp: 95000,
    bossAtk: 2200,
    bossDef: 1200
  },
  {
    level: 6,
    godType: 'asura',
    title: '修罗第六考',
    name: '九霄修罗劫雷淬骨 · 战纹入髓',
    description: '引动猩红神劫狂雷灌入经脉洗涤杂质，将刚猛无俦的修罗杀戮神纹烙印周身骨骼！',
    requirementLevel: 85,
    rewardAffinity: 20,
    rewardExp: 600000,
    rewardItemName: '修罗神纹灌体 · 暴击伤害提升至250% + 亲和度达到85%',
    specialChallengeType: 'tide'
  },
  {
    level: 7,
    godType: 'asura',
    title: '修罗第七考',
    name: '拔出超神器 · 修罗魔剑',
    description: '以唯我独尊之铁血杀意与无畏战心，握紧执掌寰宇生杀大权的超神器【修罗魔剑】！',
    requirementLevel: 90,
    rewardAffinity: 15,
    rewardExp: 1000000,
    rewardItemName: '执掌超神器【修罗魔剑】· 解锁修罗血斩！',
    artifactUnlocked: '修罗魔剑',
    specialChallengeType: 'weapon'
  },
  {
    level: 8,
    godType: 'asura',
    title: '修罗第八考',
    name: '斩灭修罗戾气心魔 · 魂环尽化赤红神环',
    description: '深入神魂幽壑斩尽杀气反噬衍生出的无尽心魔，将九大魂环淬炼为十万年修罗血红神环！',
    requirementLevel: 95,
    rewardAffinity: 15,
    rewardExp: 2000000,
    rewardItemName: '全套修罗血红神环 + 攻击力提升100%',
    specialChallengeType: 'boss',
    bossName: '修罗戾气心魔皇',
    bossTitle: '杀戮执念化身',
    bossHp: 220000,
    bossAtk: 3800,
    bossDef: 2200
  },
  {
    level: 9,
    godType: 'asura',
    title: '修罗第九考',
    name: '修罗神王神装降临 · 百级成神！',
    description: '神界五大神王之首！修罗血铠重组归位，统御神界法纪与寰宇最强杀戮审判！',
    requirementLevel: 99,
    rewardAffinity: 5,
    rewardExp: 9999999,
    rewardItemName: '成就【百级神王 · 修罗神】！解锁修罗审判天诛！',
    domainUnlocked: '修罗领域',
    artifactUnlocked: '修罗魔剑',
    specialChallengeType: 'godhood'
  }
];

// 3. 天使神九考（千仞雪）
export const ANGEL_GOD_TESTS: GodTest[] = [
  {
    level: 1,
    godType: 'angel',
    title: '天使第一考',
    name: '沐浴天使圣光 · 登临千级云阶',
    description: '在斗罗殿圣光笼罩下，一步步攀登云巅千级圣阶，净化周身凡俗杂质！',
    requirementLevel: 50,
    stepsCount: 1000,
    rewardAffinity: 5,
    rewardExp: 50000,
    rewardItemName: '天使圣光洗礼 + 圣光抗性与气血+30%',
    specialChallengeType: 'steps'
  },
  {
    level: 2,
    godType: 'angel',
    title: '天使第二考',
    name: '直面心魔幻境 · 斩断七情执念',
    description: '在圣镜幻境中直面过往一切执念，澄澈心神，坚定向光向正之道！',
    requirementLevel: 60,
    rewardAffinity: 5,
    rewardExp: 90000,
    rewardItemName: '光明净心琉璃境 + 全技能冷却-1回合',
    specialChallengeType: 'meditation'
  },
  {
    level: 3,
    godType: 'angel',
    title: '天使第三考',
    name: '初试神器 · 天使圣剑拔出初试',
    description: '握住悬浮于斗罗殿中央的炽金天使圣剑，承受万度太阳真火的猛烈炙烤！',
    requirementLevel: 70,
    rewardAffinity: 10,
    rewardExp: 150000,
    rewardItemName: '天使圣剑初锋 + 攻击附带【太阳真火】灼烧',
    artifactUnlocked: '天使圣剑',
    specialChallengeType: 'weapon'
  },
  {
    level: 4,
    godType: 'angel',
    title: '天使第四考',
    name: '觉醒天使领域 · 净化极北幽影',
    description: '展开六翼金羽，释放神圣天使领域，净化极北极寒阴影中潜伏的十万年暗夜恶灵！',
    requirementLevel: 75,
    rewardAffinity: 10,
    rewardExp: 220000,
    rewardItemName: '天使领域完全觉醒 · 自身全属性+25% / 敌方削弱',
    domainUnlocked: '天使领域',
    specialChallengeType: 'boss',
    bossName: '极北暗夜噬魂恶灵',
    bossTitle: '十万年极阴暗魔',
    bossHp: 62000,
    bossAtk: 1400,
    bossDef: 800
  },
  {
    level: 5,
    godType: 'angel',
    title: '天使第五考',
    name: '对决武魂殿二供奉 · 金鳄斗罗',
    description: '正面对决98级巅峰强攻金鳄斗罗！在厚重如山岳的金鳄霸力下展现神圣天使之真正威仪！',
    requirementLevel: 80,
    rewardAffinity: 15,
    rewardExp: 350000,
    rewardItemName: '金鳄重甲神性碎片 + 全魂环年限+3,000年',
    specialChallengeType: 'boss',
    bossName: '金鳄斗罗（98级）',
    bossTitle: '武魂殿二供奉',
    bossHp: 90000,
    bossAtk: 2100,
    bossDef: 1350
  },
  {
    level: 6,
    godType: 'angel',
    title: '天使第六考',
    name: '大供奉千道流神念投影考核',
    description: '99级天空无敌绝世斗罗千道流降下神圣法身，接下三道太阳天使神圣绝技！',
    requirementLevel: 85,
    rewardAffinity: 20,
    rewardExp: 600000,
    rewardItemName: '大日神焰神髓 + 天使亲和度达到85%',
    specialChallengeType: 'boss',
    bossName: '大供奉 · 千道流（神念化身）',
    bossTitle: '99级天空无敌绝世斗罗',
    bossHp: 160000,
    bossAtk: 3200,
    bossDef: 1950
  },
  {
    level: 7,
    godType: 'angel',
    title: '天使第七考',
    name: '千道流献祭唤醒 · 天使神门开启',
    description: '大供奉千道流燃尽生命化作通天圣柱，开启通往天使神位的远古天门！',
    requirementLevel: 90,
    rewardAffinity: 15,
    rewardExp: 1000000,
    rewardItemName: '执掌超神器【天使圣剑】· 解锁大天使降临！',
    artifactUnlocked: '天使圣剑',
    specialChallengeType: 'meditation'
  },
  {
    level: 8,
    godType: 'angel',
    title: '天使第八考',
    name: '太阳真火重塑六翼圣光金身',
    description: '投身炽烈熔炉，将凡俗之躯彻底重铸为纯金太阳神躯，九大魂环尽化灿金！',
    requirementLevel: 95,
    rewardAffinity: 15,
    rewardExp: 2000000,
    rewardItemName: '纯阳太阳金身 + 全属性提升100%',
    specialChallengeType: 'tide'
  },
  {
    level: 9,
    godType: 'angel',
    title: '天使第九考',
    name: '六翼天使神装融合 · 百级成神！',
    description: '天使六大神装合一，金芒照耀九天十地，成为执掌光明与大日的至高神祇！',
    requirementLevel: 99,
    rewardAffinity: 5,
    rewardExp: 9999999,
    rewardItemName: '成就【百级真神 · 天使神】！解锁天使圣剑审判！',
    domainUnlocked: '天使领域',
    artifactUnlocked: '天使圣剑',
    specialChallengeType: 'godhood'
  }
];

// 4. 罗刹神九考（比比东）
export const RAKSHASA_GOD_TESTS: GodTest[] = [
  {
    level: 1,
    godType: 'rakshasa',
    title: '罗刹第一考',
    name: '深渊怨念入体 · 凝练极阴死气',
    description: '引深渊污秽怨气入体淬炼经脉，熔炼九万九千冤魂化为纯正极阴罗刹魔力！',
    requirementLevel: 50,
    stepsCount: 999,
    rewardAffinity: 5,
    rewardExp: 50000,
    rewardItemName: '罗刹极阴怨力 + 剧毒伤害与吸血+30%',
    specialChallengeType: 'steps'
  },
  {
    level: 2,
    godType: 'rakshasa',
    title: '罗刹第二考',
    name: '双生武魂冲突化解 · 蛛皇合一',
    description: '将死亡蛛皇与噬魂蛛皇经脉冲突尽数融解，纳为罗刹魔源之本！',
    requirementLevel: 60,
    rewardAffinity: 5,
    rewardExp: 90000,
    rewardItemName: '双生武魂无缝无CD切换 + 全属性+20%',
    specialChallengeType: 'meditation'
  },
  {
    level: 3,
    godType: 'rakshasa',
    title: '罗刹第三考',
    name: '荡灭深渊蛛皇',
    description: '深入罗刹深渊魔窟斩杀万年深渊蛛皇，夺其魔核！',
    requirementLevel: 70,
    rewardAffinity: 10,
    rewardExp: 150000,
    rewardItemName: '深渊魔晶 + 获得【吸血魔蛛网】技能',
    specialChallengeType: 'boss',
    bossName: '深渊魔蛛皇',
    bossTitle: '十万年深渊魔兽',
    bossHp: 58000,
    bossAtk: 1350,
    bossDef: 750
  },
  {
    level: 4,
    godType: 'rakshasa',
    title: '罗刹第四考',
    name: '觉醒罗刹/死亡领域 · 万物枯萎',
    description: '释放暗紫罗刹幽芒，方圆百里化为生机断绝之死地！',
    requirementLevel: 75,
    rewardAffinity: 10,
    rewardExp: 220000,
    rewardItemName: '罗刹死亡领域觉醒 · 敌方持续流血与剧毒腐蚀',
    domainUnlocked: '罗刹领域',
    specialChallengeType: 'boss',
    bossName: '深渊幽魂统领',
    bossTitle: '罗刹守门魔尊',
    bossHp: 72000,
    bossAtk: 1600,
    bossDef: 900
  },
  {
    level: 5,
    godType: 'rakshasa',
    title: '罗刹第五考',
    name: '千寻疾心魔幻境 · 斩灭过往执念',
    description: '在神魂深渊中斩灭过去一切屈辱与复仇心魔，完成暗黑意志蜕变！',
    requirementLevel: 80,
    rewardAffinity: 15,
    rewardExp: 350000,
    rewardItemName: '破妄魔心 + 攻击力与暴击率+40%',
    specialChallengeType: 'meditation'
  },
  {
    level: 6,
    godType: 'rakshasa',
    title: '罗刹第六考',
    name: '九幽魔火淬体 · 罗刹魔躯大成',
    description: '置身九幽地狱火窟四十九日，练就不死不灭罗刹魔躯，免疫诸毒诸邪！',
    requirementLevel: 85,
    rewardAffinity: 20,
    rewardExp: 600000,
    rewardItemName: '罗刹魔体 · 受到伤害-40% + 亲和度达到85%',
    specialChallengeType: 'tide'
  },
  {
    level: 7,
    godType: 'rakshasa',
    title: '罗刹第七考',
    name: '拔出超神器 · 罗刹魔镰',
    description: '握住散发着幽冥死气的漆黑紫芒超神器【罗刹魔镰】！',
    requirementLevel: 90,
    rewardAffinity: 15,
    rewardExp: 1000000,
    rewardItemName: '执掌超神器【罗刹魔镰】· 罗刹魔刃撕裂斩！',
    artifactUnlocked: '罗刹魔镰',
    specialChallengeType: 'weapon'
  },
  {
    level: 8,
    godType: 'rakshasa',
    title: '罗刹第八考',
    name: '斩灭远古九幽阻道魔影',
    description: '对决远古罗刹遗留的魔神化身，九大魂环尽化暗金神环！',
    requirementLevel: 95,
    rewardAffinity: 15,
    rewardExp: 2000000,
    rewardItemName: '全套暗金神环 + 攻击力提升100%',
    specialChallengeType: 'boss',
    bossName: '远古罗刹残魂魔影',
    bossTitle: '洪荒深渊魔念',
    bossHp: 230000,
    bossAtk: 3700,
    bossDef: 2250
  },
  {
    level: 9,
    godType: 'rakshasa',
    title: '罗刹第九考',
    name: '罗刹魔装降临 · 百级成神！',
    description: '罗刹魔铠附体，统御深渊幽冥死界权柄，登临斗罗绝世女帝之巅！',
    requirementLevel: 99,
    rewardAffinity: 5,
    rewardExp: 9999999,
    rewardItemName: '成就【百级真神 · 罗刹神】！解锁罗刹死神宣判！',
    domainUnlocked: '罗刹领域',
    artifactUnlocked: '罗刹魔镰',
    specialChallengeType: 'godhood'
  }
];

export const ALL_GOD_INHERITANCES: GodInheritanceInfo[] = [
  {
    id: 'seagod',
    name: '海神九考',
    title: '浩瀚汪洋主宰 · 海神波塞冬神位传承',
    element: 'water',
    artifactName: '海神三叉戟',
    domainName: '海神领域',
    description: '统御浩瀚诸天汪洋神力！完成海神九考，拔出十万八千斤海神三叉戟，重铸百万年神级魂环，登临百级神祇之巅！',
    colorScheme: {
      bannerBg: 'from-blue-950/90 via-slate-900 to-slate-900',
      badgeBg: 'bg-blue-950/80 border-blue-500/50 text-cyan-300',
      border: 'border-blue-500/40',
      accentText: 'text-cyan-400',
      glowColor: 'rgba(59,130,246,0.3)',
      buttonBg: 'from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
    },
    tests: SEA_GOD_TESTS
  },
  {
    id: 'asura',
    name: '修罗九考',
    title: '神界五大神王之首 · 修罗执法神传承',
    element: 'dark',
    artifactName: '修罗魔剑',
    domainName: '修罗领域',
    description: '执掌寰宇至高杀戮与铁血审判！杀出杀戮之都地狱路，拔出超神器修罗魔剑，成就至高无上的修罗神王！',
    colorScheme: {
      bannerBg: 'from-red-950/90 via-slate-900 to-slate-900',
      badgeBg: 'bg-red-950/80 border-red-500/50 text-red-300',
      border: 'border-red-500/40',
      accentText: 'text-red-400',
      glowColor: 'rgba(239,68,68,0.3)',
      buttonBg: 'from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white'
    },
    tests: ASURA_GOD_TESTS
  },
  {
    id: 'angel',
    name: '天使九考',
    title: '光明与大日主宰 · 六翼天使神位传承',
    element: 'light',
    artifactName: '天使圣剑',
    domainName: '天使领域',
    description: '执掌太阳真火与光明神圣之力！登临千级云阶，拔出天使圣剑，金身重塑，成就百级天使真神！',
    colorScheme: {
      bannerBg: 'from-amber-950/90 via-slate-900 to-slate-900',
      badgeBg: 'bg-yellow-950/80 border-yellow-500/50 text-yellow-300',
      border: 'border-yellow-500/40',
      accentText: 'text-yellow-400',
      glowColor: 'rgba(234,179,8,0.3)',
      buttonBg: 'from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black'
    },
    tests: ANGEL_GOD_TESTS
  },
  {
    id: 'rakshasa',
    name: '罗刹九考',
    title: '深渊九幽死神 · 罗刹神位传承',
    element: 'poison',
    artifactName: '罗刹魔镰',
    domainName: '罗刹领域',
    description: '执掌深渊极阴与九幽死气！吞噬极阴怨念，化解双生武魂冲突，执掌罗刹魔镰，成就斗罗绝世女帝！',
    colorScheme: {
      bannerBg: 'from-purple-950/90 via-slate-900 to-slate-900',
      badgeBg: 'bg-purple-950/80 border-purple-500/50 text-purple-300',
      border: 'border-purple-500/40',
      accentText: 'text-purple-400',
      glowColor: 'rgba(168,85,247,0.3)',
      buttonBg: 'from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-fuchsia-500 text-white'
    },
    tests: RAKSHASA_GOD_TESTS
  }
];

