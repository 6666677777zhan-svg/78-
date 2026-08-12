import { TournamentStage } from '../types/game';

export const TOURNAMENT_STAGES: TournamentStage[] = [
  // 1. 预选赛
  {
    id: 'stage_elephant_armor',
    name: '预选赛第一轮 · 象甲宗战队',
    group: 'preliminary',
    groupName: '全大陆高级魂师学院精英大赛 · 预选赛',
    teamName: '象甲学院战队',
    teamDesc: '七大宗门呼延家族主力！全员武魂【钻石猛犸】，防御力惊人，犹如铜墙铁壁般的坚固壁垒。',
    captainName: '呼延力',
    level: 35,
    badge: '铜斗魂',
    teamBuff: '全队受到的所有伤害降低 30%',
    members: [
      { name: '呼延力', martialSoul: '钻石猛犸', role: '防御队长', avatarText: '力' },
      { name: '象甲副队长', martialSoul: '巨犀', role: '坚盾前锋', avatarText: '犀' },
      { name: '象甲队员', martialSoul: '重甲兽', role: '重装护卫', avatarText: '铠' }
    ],
    rewardExp: 3500,
    rewardGold: 1500,
    rewardMedals: 5,
    rewardSoulBoneChance: 0.2,
    rewardSoulBoneName: '象甲大地躯干骨',
    cleared: false
  },
  {
    id: 'stage_blazing_fire',
    name: '预选赛第二轮 · 炽火战队',
    group: 'preliminary',
    groupName: '全大陆高级魂师学院精英大赛 · 预选赛',
    teamName: '炽火学院战队',
    teamDesc: '五大元素学院之一！控火能力出神入化，队长火舞拥有极具爆发力的组合绝技【火舞耀阳】。',
    captainName: '火舞 & 火无双',
    level: 42,
    badge: '银斗魂',
    teamBuff: '全队火属性攻击力提升 40%',
    members: [
      { name: '火舞', martialSoul: '火影', role: '控制核心', avatarText: '舞' },
      { name: '火无双', martialSoul: '独角火暴龙', role: '强攻队长', avatarText: '双' },
      { name: '火云', martialSoul: '火鹤', role: '敏攻突袭', avatarText: '云' }
    ],
    rewardExp: 6000,
    rewardGold: 2500,
    rewardMedals: 10,
    rewardSoulBoneChance: 0.35,
    rewardSoulBoneName: '烈火暴龙右臂骨',
    cleared: false
  },
  {
    id: 'stage_divine_wind',
    name: '预选赛第三轮 · 神风战队',
    group: 'preliminary',
    groupName: '全大陆高级魂师学院精英大赛 · 预选赛',
    teamName: '神风学院战队',
    teamDesc: '空中机动大师！队长风笑天自创毁灭级魂技【疾风魔狼三十六连斩】，速度与破坏力并存。',
    captainName: '风笑天',
    level: 48,
    badge: '金斗魂',
    teamBuff: '全队开局速度与暴击率提升 35%',
    members: [
      { name: '风笑天', martialSoul: '疾风双头魔狼', role: '强攻队长', avatarText: '天' },
      { name: '神风副队', martialSoul: '青风雕', role: '高空侦察', avatarText: '雕' },
      { name: '神风队员', martialSoul: '疾风燕', role: '极速刺杀', avatarText: '燕' }
    ],
    rewardExp: 9000,
    rewardGold: 4000,
    rewardMedals: 15,
    rewardSoulBoneChance: 0.4,
    rewardSoulBoneName: '疾风神行左腿骨',
    cleared: false
  },
  {
    id: 'stage_heaven_water',
    name: '预选赛第四轮 · 天水战队',
    group: 'preliminary',
    groupName: '全大陆高级魂师学院精英大赛 · 预选赛',
    teamName: '天水学院战队',
    teamDesc: '全女子顶尖元素战队！水冰儿与雪舞联手施展惊艳全场的武魂融合技【冰雪飘零】！',
    captainName: '水冰儿',
    level: 52,
    badge: '金斗魂',
    teamBuff: '攻击附带深度冻结与全队减速效果',
    members: [
      { name: '水冰儿', martialSoul: '冰凤凰', role: '控制队长', avatarText: '冰' },
      { name: '雪舞', martialSoul: '纤舞雪花', role: '辅助疗愈', avatarText: '雪' },
      { name: '水月儿', martialSoul: '滑溜海豚', role: '敏攻突袭', avatarText: '月' }
    ],
    rewardExp: 12000,
    rewardGold: 6000,
    rewardMedals: 20,
    rewardSoulBoneChance: 0.5,
    rewardSoulBoneName: '极寒冰凤冠头部骨',
    cleared: false
  },

  // 2. 晋级赛
  {
    id: 'stage_heaven_dou_royal',
    name: '晋级赛第一轮 · 天斗皇家一队',
    group: 'qualifier',
    groupName: '全大陆高级魂师学院精英大赛 · 晋级赛',
    teamName: '天斗皇家学院一队',
    teamDesc: '天斗帝国皇室精英！队长玉天恒传承【蓝电霸王龙】，副队长独孤雁精通致命【碧磷蛇皇】剧毒。',
    captainName: '玉天恒 & 独孤雁',
    level: 58,
    badge: '紫金斗魂',
    teamBuff: '雷电麻痹与碧磷剧毒交织，持续消耗生命',
    members: [
      { name: '玉天恒', martialSoul: '蓝电霸王龙', role: '强攻队长', avatarText: '恒' },
      { name: '独孤雁', martialSoul: '碧磷蛇', role: '控制毒师', avatarText: '雁' },
      { name: '御风', martialSoul: '风铃鸟', role: '敏攻突袭', avatarText: '风' }
    ],
    rewardExp: 18000,
    rewardGold: 10000,
    rewardMedals: 30,
    rewardSoulBoneChance: 0.6,
    rewardSoulBoneName: '蓝电龙王碎裂右臂骨',
    cleared: false
  },
  {
    id: 'stage_star_luo_royal',
    name: '晋级赛第二轮 · 星罗皇家战队',
    group: 'qualifier',
    groupName: '全大陆高级魂师学院精英大赛 · 晋级赛',
    teamName: '星罗皇家战队',
    teamDesc: '星罗帝国大皇子戴维斯与朱竹云，出手狠辣，拥有顶级武魂融合技【幽冥白虎】！',
    captainName: '戴维斯 & 朱竹云',
    level: 65,
    badge: '蓝宝石',
    teamBuff: '幽冥白虎真身附体，全队攻击力提升 60%',
    members: [
      { name: '戴维斯', martialSoul: '邪眸白虎', role: '强攻大皇子', avatarText: '维' },
      { name: '朱竹云', martialSoul: '幽冥灵猫', role: '敏攻刺客', avatarText: '云' },
      { name: '星罗近卫', martialSoul: '破魂枪', role: '破阵前锋', avatarText: '枪' }
    ],
    rewardExp: 25000,
    rewardGold: 15000,
    rewardMedals: 40,
    rewardSoulBoneChance: 0.7,
    rewardSoulBoneName: '万年幽冥魔豹左腿骨',
    cleared: false
  },

  // 3. 武魂城总决赛
  {
    id: 'stage_spirit_hall_gold',
    name: '武魂城总决赛 · 武魂殿黄金一代',
    group: 'finals',
    groupName: '武魂城教皇殿前 · 总决赛巅峰战',
    teamName: '武魂殿黄金一代战队',
    teamDesc: '教皇比比东亲传弟子！胡列娜与邪月施展迷雾【妖魅领域】，焱释放毁天灭地的【火焰领主】！',
    captainName: '邪月 & 胡列娜 & 焱',
    level: 75,
    badge: '钻石斗魂',
    teamBuff: '妖魅领域：降低敌方50%感知与命中，魂力消耗翻倍',
    members: [
      { name: '邪月', martialSoul: '月刃', role: '强攻核心', avatarText: '月' },
      { name: '胡列娜', martialSoul: '九尾妖狐', role: '控制圣女', avatarText: '娜' },
      { name: '焱', martialSoul: '火焰领主', role: '火土双控', avatarText: '焱' }
    ],
    rewardExp: 40000,
    rewardGold: 30000,
    rewardMedals: 60,
    rewardSoulBoneChance: 1.0,
    rewardSoulBoneName: '精神凝聚之智慧头骨',
    cleared: false
  },

  // 4. 终极斗罗联邦跨时空巅峰决斗
  {
    id: 'stage_federation_shrek33',
    name: '联邦巅峰挑战 · 宿命巅峰决战',
    group: 'federation',
    groupName: '联邦大师赛 · 跨时代终极巅峰战',
    teamName: '天龙星骑士与战神殿联队',
    teamDesc: '终极斗罗最强跨次元交锋！天龙星次座龙骑士联手战神殿第一战神！',
    captainName: '神级天龙战神',
    level: 95,
    badge: '钻石斗魂',
    teamBuff: '超神龙王威压：全属性提升80%，免疫控制状态',
    members: [
      { name: '次座龙骑士', martialSoul: '真龙神枪', role: '神级骑士', avatarText: '龙' },
      { name: '第一战神', martialSoul: '戮神战斧', role: '战神殿主', avatarText: '战' },
      { name: '生命使者', martialSoul: '远古生命之树', role: '神级疗愈', avatarText: '生' }
    ],
    rewardExp: 80000,
    rewardGold: 60000,
    rewardMedals: 100,
    rewardSoulBoneChance: 1.0,
    rewardSoulBoneName: '十万年天青牛蟒右臂骨',
    cleared: false
  }
];
