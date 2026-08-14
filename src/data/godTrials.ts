export type GodType = 'seagod' | 'asura' | 'angel' | 'rakshasa' | 'emotion' | 'dragongod';

export interface GodTest {
  level: number; // 1 to 12
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
  },
  {
    level: 10,
    godType: 'seagod',
    title: '海神第十考 (神王级)',
    name: '星域远古龙皇 · 镇压汪洋虚空',
    description: '深入神界汪洋边界，对决太古深海星域龙皇，破灭虚空海啸，重塑海洋星云法则！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 15000000,
    rewardItemName: '瀚海神威限界突破 · 攻击+35% / 魂力上限+500',
    specialChallengeType: 'boss',
    bossName: '太古星域深海龙皇',
    bossTitle: '神界星域无上龙尊',
    bossHp: 320000,
    bossAtk: 4500,
    bossDef: 2800
  },
  {
    level: 11,
    godType: 'seagod',
    title: '海神第十一考 (神王级)',
    name: '万流归宗 · 凝聚诸天海洋信仰神力',
    description: '引动斗罗星与神界亿万汪洋万灵信仰海潮，将神海意志灌注于神核识海！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 20000000,
    rewardItemName: '解锁【万流归宗】至高神威 · 全属性提升50%',
    specialChallengeType: 'meditation'
  },
  {
    level: 12,
    godType: 'seagod',
    title: '海神第十二考 (神王终极)',
    name: '海神·深海灭世风暴 · 寰宇主宰',
    description: '突破海神极限，开启【海神·灭世风暴】神王领域，成为掌管万界汪洋的至高主宰！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 50000000,
    rewardItemName: '成就【至高神王 · 汪洋主宰波塞冬】！全技能无视神级冷却！',
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
  },
  {
    level: 10,
    godType: 'asura',
    title: '修罗第十考 (神王级)',
    name: '神界委员会 · 执法者至高法裁',
    description: '引动杀戮真意镇压神界原罪违逆之神，掌管诸天万界生杀大权！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 15000000,
    rewardItemName: '修罗执法神威 · 暴击率+30% / 杀戮伤害+50%',
    specialChallengeType: 'boss',
    bossName: '原罪魔神合体化身',
    bossTitle: '神界原罪逆法则',
    bossHp: 350000,
    bossAtk: 4800,
    bossDef: 2900
  },
  {
    level: 11,
    godType: 'asura',
    title: '修罗第十一考 (神王级)',
    name: '修罗魔剑极意 · 裁决九霄',
    description: '万物皆可为修罗杀刃！将杀神真意融入天地万象，一剑斩断因果轮回！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 20000000,
    rewardItemName: '解锁【修罗极意斩】· 斩击无视90%防御',
    specialChallengeType: 'meditation'
  },
  {
    level: 12,
    godType: 'asura',
    title: '修罗第十二考 (神王终极)',
    name: '修罗·审判天诛斩 · 寰宇主宰',
    description: '融汇杀戮与执法的极限，斩灭一切邪妄，成就至高无上第一执法神王！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 50000000,
    rewardItemName: '成就【至高神王 · 修罗执掌者】！全局杀戮破甲100%！',
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
  },
  {
    level: 10,
    godType: 'angel',
    title: '天使第十考 (神王级)',
    name: '大日金阳 · 炼化寰宇邪祟',
    description: '引动万丈太阳真火光辉，将虚空外魔与邪祟尽数焚灭，光耀诸天！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 15000000,
    rewardItemName: '大日金阳裁决 · 神圣伤害+40% / 魔法防御+3000',
    specialChallengeType: 'boss',
    bossName: '外魔邪天大帝',
    bossTitle: '黑暗虚空侵蚀者',
    bossHp: 310000,
    bossAtk: 4300,
    bossDef: 2700
  },
  {
    level: 11,
    godType: 'angel',
    title: '天使第十一考 (神王级)',
    name: '圣光永恒 · 天使神皇翼觉醒',
    description: '展开十二翼金阳神皇威严法相，凝聚亿万信徒光明信仰之力！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 20000000,
    rewardItemName: '解锁【十二翼金阳神皇翼】· 受到致命伤护盾锁血3秒',
    specialChallengeType: 'meditation'
  },
  {
    level: 12,
    godType: 'angel',
    title: '天使第十二考 (神王终极)',
    name: '天使·大日净化斩 · 寰宇主宰',
    description: '重塑光明至高天道，成就掌控诸天光明大日的无上大天使神皇！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 50000000,
    rewardItemName: '成就【至高神王 · 光明主宰天使皇】！神圣伤害提高120%！',
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
  },
  {
    level: 10,
    godType: 'rakshasa',
    title: '罗刹第十考 (神王级)',
    name: '深渊魔皇 · 吞噬九幽极阴',
    description: '引九幽极阴死气重筑深渊黑洞，吞噬神界违逆恶念！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 15000000,
    rewardItemName: '罗刹魔皇诅咒 · 剧毒伤害+50% / 吸血+25%',
    specialChallengeType: 'boss',
    bossName: '深渊原初幽冥邪尊',
    bossTitle: '深渊极阴魔主',
    bossHp: 330000,
    bossAtk: 4600,
    bossDef: 2750
  },
  {
    level: 11,
    godType: 'rakshasa',
    title: '罗刹第十一考 (神王级)',
    name: '罗刹九幽镰影 · 斩灭虚妄',
    description: '罗刹魔镰与神魂合一，一镰出，九幽寂灭，诸邪退避！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 20000000,
    rewardItemName: '解锁【九幽寂灭连斩】· 攻击造成最大生命值百分比伤害',
    specialChallengeType: 'meditation'
  },
  {
    level: 12,
    godType: 'rakshasa',
    title: '罗刹第十二考 (神王终极)',
    name: '罗刹·幽冥斩仙诀 · 寰宇主宰',
    description: '掌控深渊与幽冥极阴大道，登临至高深渊女帝神王法相！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 50000000,
    rewardItemName: '成就【至高神王 · 幽冥死神比比东】！全局剧毒腐蚀提升100%！',
    domainUnlocked: '罗刹领域',
    artifactUnlocked: '罗刹魔镰',
    specialChallengeType: 'godhood'
  }
];

// 5. 情绪之神十二考（霍雨浩传承）
export const EMOTION_GOD_TESTS: GodTest[] = [
  {
    level: 1,
    godType: 'emotion',
    title: '情绪第一考',
    name: '天梦冰蚕融合 · 精神识海蜕变',
    description: '吸收百万年天梦冰蚕魂环，开辟百万年精神识海与灵眸武魂！',
    requirementLevel: 50,
    stepsCount: 100,
    rewardAffinity: 10,
    rewardExp: 50000,
    rewardItemName: '百万年灵眸魂环 + 精神力上限+1000',
    specialChallengeType: 'steps'
  },
  {
    level: 2,
    godType: 'emotion',
    title: '情绪第二考',
    name: '冰天雪女融合 · 极寒冰帝掌控',
    description: '融合冰碧帝皇蝎与冰天雪女雪帝魂灵，掌极致之冰！',
    requirementLevel: 60,
    rewardAffinity: 10,
    rewardExp: 100000,
    rewardItemName: '极致之冰帝皇威 · 全冰系技能伤害+50%',
    specialChallengeType: 'meditation'
  },
  {
    level: 3,
    godType: 'emotion',
    title: '情绪第三考',
    name: '死灵圣法神 · 亡灵天灾印记',
    description: '得伊莱克斯死灵传承，掌握死灵天灾与净化光辉！',
    requirementLevel: 70,
    rewardAffinity: 10,
    rewardExp: 200000,
    rewardItemName: '死灵圣法神吟唱 · 召唤亡灵军团助战',
    specialChallengeType: 'boss',
    bossName: '深渊死灵恶皇',
    bossTitle: '亡灵界怨邪影',
    bossHp: 80000,
    bossAtk: 1800,
    bossDef: 1000
  },
  {
    level: 4,
    godType: 'emotion',
    title: '情绪第四考',
    name: '情绪七色之光 · 喜怒哀乐熔炼',
    description: '熔炼喜、怒、哀、乐、爱、恶、欲七大情绪种子，凝练七彩神光！',
    requirementLevel: 75,
    rewardAffinity: 10,
    rewardExp: 350000,
    rewardItemName: '情绪七彩之光 · 控制与辅助效果+40%',
    specialChallengeType: 'meditation'
  },
  {
    level: 5,
    godType: 'emotion',
    title: '情绪第五考',
    name: '浩冬掌 · 三式君临天下',
    description: '融合唐舞桐浩冬神力，自创【浩冬掌·君临天下】战技！',
    requirementLevel: 80,
    rewardAffinity: 10,
    rewardExp: 500000,
    rewardItemName: '浩冬掌战技 · 造成破防物理与精神双重打击',
    specialChallengeType: 'boss',
    bossName: '邪眼暴君主宰幻影',
    bossTitle: '70万年十大凶兽',
    bossHp: 120000,
    bossAtk: 2600,
    bossDef: 1500
  },
  {
    level: 6,
    godType: 'emotion',
    title: '情绪第六考',
    name: '击败邪眼暴君主宰 · 吸收毁灭之瞳',
    description: '斩杀日月帝国邪眼暴君主宰，将时空之光与毁灭之瞳纳入灵眸！',
    requirementLevel: 85,
    rewardAffinity: 10,
    rewardExp: 800000,
    rewardItemName: '邪眼毁灭之瞳 · 毁灭时空射线',
    specialChallengeType: 'boss',
    bossName: '邪眼暴君主宰本尊',
    bossTitle: '十大凶兽第二位',
    bossHp: 180000,
    bossAtk: 3400,
    bossDef: 2000
  },
  {
    level: 7,
    godType: 'emotion',
    title: '情绪第七考',
    name: '拔出超神器 · 鬼雕神刀/永恒之眼',
    description: '融合生灵之金与超神器永恒之眼，握持鬼雕神刀划破虚空！',
    requirementLevel: 90,
    rewardAffinity: 10,
    rewardExp: 1200000,
    rewardItemName: '超神器【永恒之眼】· 灵魂透视与全免控',
    artifactUnlocked: '永恒之眼',
    specialChallengeType: 'weapon'
  },
  {
    level: 8,
    godType: 'emotion',
    title: '情绪第八考',
    name: '融念冰神念考验 · 七柄神之刃',
    description: '接受情绪之神融念冰考核，继承冰雪、火焰、自由等七柄神刃！',
    requirementLevel: 95,
    rewardAffinity: 15,
    rewardExp: 2500000,
    rewardItemName: '七柄元素神刃 · 全元素伤害+60%',
    specialChallengeType: 'tide'
  },
  {
    level: 9,
    godType: 'emotion',
    title: '情绪第九考',
    name: '情绪神位融汇 · 百级情绪之神！',
    description: '承载情绪神皇大能，百级成神！浩冬神力无双，掌管诸天七情六欲！',
    requirementLevel: 99,
    rewardAffinity: 5,
    rewardExp: 9999999,
    rewardItemName: '成就【百级真神 · 情绪之神霍雨浩】！',
    domainUnlocked: '灵眸精神领域',
    artifactUnlocked: '永恒之眼',
    specialChallengeType: 'godhood'
  },
  {
    level: 10,
    godType: 'emotion',
    title: '情绪第十考 (神王级)',
    name: '精神识海星云 · 镇压神界风暴',
    description: '精神识海蜕化为浩瀚宇宙星云，以情绪神威定海安邦！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 15000000,
    rewardItemName: '星云识海印记 · 精神攻击+50% / 免疫眩晕',
    specialChallengeType: 'boss',
    bossName: '星元乱流狂兽皇',
    bossTitle: '宇宙狂暴之源',
    bossHp: 320000,
    bossAtk: 4400,
    bossDef: 2700
  },
  {
    level: 11,
    godType: 'emotion',
    title: '情绪第十一考 (神王级)',
    name: '融念冰终极传承 · 情绪神王之眼',
    description: '将七情六欲与命运天眼完美交融，凝练神界第一精神识海！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 20000000,
    rewardItemName: '解锁【命运天眼·超神判决】· 全技能触发灵魂爆破',
    specialChallengeType: 'meditation'
  },
  {
    level: 12,
    godType: 'emotion',
    title: '情绪第十二考 (神王终极)',
    name: '情绪·浩冬永恒神光 · 寰宇主宰',
    description: '携手唐舞桐打造永恒神光，成就掌管万界情感与命运的至高神王！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 50000000,
    rewardItemName: '成就【至高神王 · 情绪主宰霍雨浩】！全技能带有浩冬冰爆！',
    domainUnlocked: '灵眸精神领域',
    artifactUnlocked: '永恒之眼',
    specialChallengeType: 'godhood'
  }
];

// 6. 龙神十二考 (Dragon God Trials)
export const DRAGON_GOD_TESTS: GodTest[] = [
  {
    level: 1,
    godType: 'dragongod',
    title: '龙神第一考',
    name: '龙神血脉觉醒 · 登临 999 级龙神祭坛',
    description: '在远古龙神九彩浩瀚神威下，顶着极其沉重的黄金龙王血脉重力，攀登龙神遗迹 999 级龙王神坛！',
    requirementLevel: 50,
    stepsCount: 999,
    rewardAffinity: 5,
    rewardExp: 60000,
    rewardItemName: '九彩龙鳞抗性印记 + 全魂环年限+800年',
    specialChallengeType: 'steps'
  },
  {
    level: 2,
    godType: 'dragongod',
    title: '龙神第二考',
    name: '龙神爪破空 · 突围十万年太古魔龙群',
    description: '施展龙神爪摧枯拉朽之势，在星斗大森林万兽深渊中，斩灭十万年太古魔龙王！',
    requirementLevel: 60,
    rewardAffinity: 5,
    rewardExp: 100000,
    rewardItemName: '龙神爪撕裂感悟 + 物理破甲+30%',
    specialChallengeType: 'boss',
    bossName: '太古魔龙王 · 龙魔尊',
    bossTitle: '十万年太古龙族霸主',
    bossHp: 50000,
    bossAtk: 1200,
    bossDef: 700
  },
  {
    level: 3,
    godType: 'dragongod',
    title: '龙神第三考',
    name: '金银双龙合体 · 黄金龙枪与白银神枪交融',
    description: '承受金龙王极致力量与银龙王九大元素风暴交织冲刷，淬炼不灭九彩龙躯！',
    requirementLevel: 70,
    rewardAffinity: 10,
    rewardExp: 180000,
    rewardItemName: '金银双龙变 · 力量/防御/元素掌控全面+35%',
    specialChallengeType: 'tide'
  },
  {
    level: 4,
    godType: 'dragongod',
    title: '龙神第四考',
    name: '试炼九大龙王神魂 · 斩胜山龙王与光明龙王',
    description: '深入龙族墓地真意，承受山龙王沉重如天与光明龙王圣光裁决的双重合击考验！',
    requirementLevel: 75,
    rewardAffinity: 10,
    rewardExp: 260000,
    rewardItemName: '山龙王厚土护体 + 光明龙王圣剑印记',
    specialChallengeType: 'boss',
    bossName: '山龙王与光明龙王神魂',
    bossTitle: '龙族九大龙王朝圣神魂',
    bossHp: 80000,
    bossAtk: 1800,
    bossDef: 1100
  },
  {
    level: 5,
    godType: 'dragongod',
    title: '龙神第五考',
    name: '龙神核心聚变 · 熔炼九彩元素法则',
    description: '将水、火、土、风、光明、黑暗、空间等九大龙族元素法则与金龙王极致血脉融合，凝练龙神核！',
    requirementLevel: 80,
    rewardAffinity: 15,
    rewardExp: 400000,
    rewardItemName: '龙神核初凝 · 技能冷却缩减20% / 全元素伤害+30%',
    specialChallengeType: 'meditation'
  },
  {
    level: 6,
    godType: 'dragongod',
    title: '龙神第六考',
    name: '镇压狂暴心魔 · 对决金龙王神核分身',
    description: '正面对决神界破灭之源【金龙王狂暴神核分身】，打破无尽毁灭意念，拯救神魔识海！',
    requirementLevel: 85,
    rewardAffinity: 20,
    rewardExp: 750000,
    rewardItemName: '黄金龙体九变 · 亲和度达到85% / 暴击率+25%',
    specialChallengeType: 'boss',
    bossName: '金龙王狂暴分身（准神级）',
    bossTitle: '神界毁灭与极致力量化身',
    bossHp: 180000,
    bossAtk: 3500,
    bossDef: 2000
  },
  {
    level: 7,
    godType: 'dragongod',
    title: '龙神第七考',
    name: '拔出超神器 · 龙神枪',
    description: '以万龙至尊血脉与九彩龙神威压，拔出重达十万八千斤的远古第一破坏神器【龙神枪】！',
    requirementLevel: 90,
    rewardAffinity: 15,
    rewardExp: 1200000,
    rewardItemName: '执掌超神器【龙神枪】· 解锁龙神怒与龙神爪爆裂连击！',
    artifactUnlocked: '龙神枪',
    specialChallengeType: 'weapon'
  },
  {
    level: 8,
    godType: 'dragongod',
    title: '龙神第八考',
    name: '九彩万龙朝圣 · 重铸九彩九万年/百万年神级龙环',
    description: '召集斗罗星与龙界万龙归宗，将周身魂环全数重铸升级为九彩神级龙环！',
    requirementLevel: 95,
    rewardAffinity: 15,
    rewardExp: 2500000,
    rewardItemName: '全套九彩神级龙环 + 龙神威压全场敌方减速30%',
    specialChallengeType: 'boss',
    bossName: '兽神帝天与紫姬合体龙皇',
    bossTitle: '89万年黑龙王至尊',
    bossHp: 280000,
    bossAtk: 4200,
    bossDef: 2600
  },
  {
    level: 9,
    godType: 'dragongod',
    title: '龙神第九考',
    name: '至高龙神降临 · 融汇金银成就百级至高龙神！',
    description: '打破一切凡人与诸神界限，融合龙神神位，九彩龙神铠降临，成为宇宙诸天龙族至高主宰！',
    requirementLevel: 99,
    rewardAffinity: 5,
    rewardExp: 9999999,
    rewardItemName: '成就【百级真神 · 至高龙神】！全技能带有龙神九彩灭世！',
    domainUnlocked: '龙神领域',
    artifactUnlocked: '龙神枪',
    specialChallengeType: 'godhood'
  },
  {
    level: 10,
    godType: 'dragongod',
    title: '龙神第十考 (神王级)',
    name: '镇压深渊位面 · 破灭深渊圣君',
    description: '手握龙神枪突入深渊108层，一枪破灭深渊圣君，吸收深渊位面能量巩固龙界！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 18000000,
    rewardItemName: '深渊破灭印记 · 全吸血+25% / 破甲+50%',
    specialChallengeType: 'boss',
    bossName: '深渊圣君（神王级）',
    bossTitle: '深渊位面至高主宰',
    bossHp: 400000,
    bossAtk: 5200,
    bossDef: 3200
  },
  {
    level: 11,
    godType: 'dragongod',
    title: '龙神第十一考 (神王级)',
    name: '龙界九彩神星聚变 · 宇宙万龙意志',
    description: '将龙界演化为九彩神星，凝聚宇宙诸天维度万千龙族之魂！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 25000000,
    rewardItemName: '解锁【万龙朝圣】至高神威 · 无视一切眩晕与控制',
    specialChallengeType: 'meditation'
  },
  {
    level: 12,
    godType: 'dragongod',
    title: '龙神第十二考 (神王终极)',
    name: '至高龙神·九彩龙皇灭世波 · 宇宙第一神王',
    description: '融汇金银龙王与九大龙王至高本源，成就掌控宇宙万物毁灭与创生的第一神王！',
    requirementLevel: 100,
    rewardAffinity: 5,
    rewardExp: 60000000,
    rewardItemName: '成就【至高神王 · 龙神】！解锁龙神九彩灭世爆破！',
    domainUnlocked: '龙神领域',
    artifactUnlocked: '龙神枪',
    specialChallengeType: 'godhood'
  }
];

export const ALL_GOD_INHERITANCES: GodInheritanceInfo[] = [
  {
    id: 'seagod',
    name: '海神十二考',
    title: '浩瀚汪洋主宰 · 海神波塞冬神位传承',
    element: 'water',
    artifactName: '海神三叉戟',
    domainName: '海神领域',
    description: '统御浩瀚诸天汪洋神力！完成海神十二考，拔出十万八千斤海神三叉戟，重铸百万年神级魂环，登临神王主宰之巅！',
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
    name: '修罗十二考',
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
    name: '天使十二考',
    title: '光明与大日主宰 · 六翼天使神位传承',
    element: 'light',
    artifactName: '天使圣剑',
    domainName: '天使领域',
    description: '执掌太阳真火与光明神圣之力！登临千级云阶，拔出天使圣剑，金身重塑，成就百级天使神王！',
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
    name: '罗刹十二考',
    title: '深渊九幽死神 · 罗刹神位传承',
    element: 'poison',
    artifactName: '罗刹魔镰',
    domainName: '罗刹领域',
    description: '执掌深渊极阴与九幽死气！吞噬极阴怨念，化解双生武魂冲突，执掌罗刹魔镰，成就斗罗绝世神王女帝！',
    colorScheme: {
      bannerBg: 'from-purple-950/90 via-slate-900 to-slate-900',
      badgeBg: 'bg-purple-950/80 border-purple-500/50 text-purple-300',
      border: 'border-purple-500/40',
      accentText: 'text-purple-400',
      glowColor: 'rgba(168,85,247,0.3)',
      buttonBg: 'from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-fuchsia-500 text-white'
    },
    tests: RAKSHASA_GOD_TESTS
  },
  {
    id: 'emotion',
    name: '情绪十二考',
    title: '灵眸浩冬主宰 · 情绪之神霍雨浩传承',
    element: 'ice',
    artifactName: '永恒之眼',
    domainName: '灵眸精神领域',
    description: '承载融念冰情绪神位！熔炼七情六欲与极冰天眼，掌控死灵法术与浩冬神光，登临情绪神王主宰！',
    colorScheme: {
      bannerBg: 'from-sky-950/90 via-slate-900 to-slate-900',
      badgeBg: 'bg-sky-950/80 border-sky-500/50 text-sky-300',
      border: 'border-sky-500/40',
      accentText: 'text-sky-400',
      glowColor: 'rgba(56,189,248,0.3)',
      buttonBg: 'from-sky-500 via-teal-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white'
    },
    tests: EMOTION_GOD_TESTS
  },
  {
    id: 'dragongod',
    name: '龙神十二考',
    title: '万龙之祖至高神皇 · 龙神蓝轩宇/唐舞麟传承',
    element: 'light',
    artifactName: '龙神枪',
    domainName: '龙神领域',
    description: '融合金龙王毁灭力量与银龙王九大元素法则！拔出超神器龙神枪，凝聚九彩龙神核，统御诸天万界万龙朝圣，成就宇宙第一至高龙神！',
    colorScheme: {
      bannerBg: 'from-amber-950/90 via-yellow-950/80 to-slate-900',
      badgeBg: 'bg-amber-950/90 border-amber-400/60 text-amber-200',
      border: 'border-amber-400/50',
      accentText: 'text-amber-300',
      glowColor: 'rgba(245,158,11,0.4)',
      buttonBg: 'from-amber-500 via-yellow-400 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black'
    },
    tests: DRAGON_GOD_TESTS
  }
];

