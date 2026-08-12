import { ArenaOpponent } from '../types/game';

export const ARENA_OPPONENTS: ArenaOpponent[] = [
  // 铁斗魂 (Lv 12 ~ 20)
  {
    id: 'opp_mad_rhino',
    name: '狂犀',
    title: '狂犀战队队长',
    level: 18,
    martialSoulName: '狂犀',
    soulRings: [
      { years: 380, color: 'yellow' }
    ],
    hp: 1200,
    atk: 65,
    def: 45,
    speed: 25,
    badge: '铁斗魂',
    skills: [
      { name: '狂犀冲撞', desc: '蛮力横冲直撞，击退并眩晕目标', multiplier: 1.5, soulCost: 20, cd: 2 }
    ],
    rewardGold: 100,
    rewardPoints: 15
  },
  {
    id: 'opp_swift_cat',
    name: '影灵猫女',
    title: '索托大斗魂场新星',
    level: 22,
    martialSoulName: '幽冥灵猫',
    soulRings: [
      { years: 420, color: 'yellow' },
      { years: 680, color: 'yellow' }
    ],
    hp: 1500,
    atk: 85,
    def: 35,
    speed: 55,
    badge: '铁斗魂',
    skills: [
      { name: '猫爪幻影撕裂', desc: '极速爪击造成多段撕裂流血伤害', multiplier: 1.6, soulCost: 25, cd: 2 }
    ],
    rewardGold: 180,
    rewardPoints: 25
  },

  // 铜斗魂 (Lv 25 ~ 35)
  {
    id: 'opp_dai_mubai',
    name: '戴沐白（邪眸白虎）',
    title: '史莱克七怪 · 邪眸白虎老大',
    level: 32,
    martialSoulName: '邪眸白虎',
    soulRings: [
      { years: 400, color: 'yellow' },
      { years: 720, color: 'yellow' },
      { years: 1800, color: 'purple' }
    ],
    hp: 3600,
    atk: 180,
    def: 110,
    speed: 48,
    badge: '铜斗魂',
    skills: [
      { name: '白虎护身障', desc: '凝聚强力护盾抵御敌方猛烈攻击', multiplier: 1.2, soulCost: 30, cd: 3 },
      { name: '白虎烈光波', desc: '口中喷吐狂暴耀眼的白虎光波轰击', multiplier: 2.2, soulCost: 45, cd: 2 },
      { name: '白虎金刚变', desc: '狂暴变身，攻击力与防御力大幅暴涨50%', multiplier: 1.0, soulCost: 60, cd: 4 }
    ],
    rewardGold: 500,
    rewardPoints: 50
  },
  {
    id: 'opp_zhu_zhuqing',
    name: '朱竹清（幽冥灵猫）',
    title: '史莱克七怪 · 敏攻女王',
    level: 31,
    martialSoulName: '幽冥灵猫',
    soulRings: [
      { years: 450, color: 'yellow' },
      { years: 690, color: 'yellow' },
      { years: 1900, color: 'purple' }
    ],
    hp: 2800,
    atk: 210,
    def: 80,
    speed: 85,
    badge: '铜斗魂',
    skills: [
      { name: '幽冥突刺', desc: '极速瞬闪突刺，直取敌方破绽弱点', multiplier: 1.8, soulCost: 30, cd: 1 },
      { name: '幽冥百爪', desc: '瞬息间挥出百道残影爪芒狂暴撕裂', multiplier: 2.5, soulCost: 50, cd: 3 }
    ],
    rewardGold: 480,
    rewardPoints: 45
  },

  // 银斗魂 (Lv 38 ~ 48)
  {
    id: 'opp_yu_tianheng',
    name: '玉天恒（蓝电霸王龙）',
    title: '皇斗战队队长 · 蓝电宗双星',
    level: 43,
    martialSoulName: '蓝电霸王龙',
    soulRings: [
      { years: 520, color: 'yellow' },
      { years: 900, color: 'yellow' },
      { years: 2400, color: 'purple' },
      { years: 5800, color: 'purple' }
    ],
    hp: 6800,
    atk: 320,
    def: 190,
    speed: 62,
    badge: '银斗魂',
    skills: [
      { name: '雷霆龙爪', desc: '凝聚狂暴雷电之力，附带破甲撕裂重击', multiplier: 2.2, soulCost: 40, cd: 2 },
      { name: '雷霆万钧', desc: '引九天狂雷轰顶，大范围雷电轰炸', multiplier: 2.8, soulCost: 65, cd: 3 },
      { name: '龙化 · 雷霆之怒', desc: '右臂龙化为真龙之爪，全属性激增40%', multiplier: 1.5, soulCost: 80, cd: 4 }
    ],
    rewardGold: 1200,
    rewardPoints: 100
  },

  // 金斗魂 (Lv 50 ~ 65)
  {
    id: 'opp_tang_san',
    name: '唐三（千手修罗）',
    title: '史莱克灵魂核心 · 控制之王',
    level: 58,
    martialSoulName: '蓝银皇 & 昊天锤',
    soulRings: [
      { years: 423, color: 'yellow' },
      { years: 764, color: 'yellow' },
      { years: 2000, color: 'purple' },
      { years: 10000, color: 'black' },
      { years: 25000, color: 'black' }
    ],
    hp: 14000,
    atk: 580,
    def: 380,
    speed: 78,
    badge: '金斗魂',
    skills: [
      { name: '蛛网束缚', desc: '附带人面魔蛛剧毒的蛛网，绝对封锁束缚', multiplier: 2.0, soulCost: 45, cd: 2 },
      { name: '蓝银囚笼', desc: '万年第四魂技，突发式空间全方位禁锢', multiplier: 2.4, soulCost: 60, cd: 3 },
      { name: '蓝银霸皇枪', desc: '单体至强金光贯穿一击，洞穿一切防御！', multiplier: 3.8, soulCost: 90, cd: 4 },
      { name: '诸葛神弩齐射', desc: '十六根淬毒透骨铁箭瞬间连珠爆发！', multiplier: 2.6, soulCost: 0, cd: 3 }
    ],
    rewardGold: 3000,
    rewardPoints: 200
  },

  // 紫金斗魂 (Lv 68 ~ 80)
  {
    id: 'opp_hu_liena',
    name: '胡列娜（九尾妖狐）',
    title: '武魂殿黄金一代 · 教皇殿圣女',
    level: 72,
    martialSoulName: '九尾妖狐',
    soulRings: [
      { years: 600, color: 'yellow' },
      { years: 950, color: 'yellow' },
      { years: 2800, color: 'purple' },
      { years: 12000, color: 'black' },
      { years: 30000, color: 'black' },
      { years: 55000, color: 'black' },
      { years: 70000, color: 'black' }
    ],
    hp: 26000,
    atk: 880,
    def: 520,
    speed: 92,
    badge: '紫金斗魂',
    skills: [
      { name: '天狐魅惑', desc: '摄人心魄的天狐媚术，强控眩晕并削弱抗性', multiplier: 2.2, soulCost: 60, cd: 3 },
      { name: '狐影狂斩', desc: '血色狐影利刃风暴，席卷全场造成多段撕裂', multiplier: 3.5, soulCost: 85, cd: 3 },
      { name: '武魂真身 · 九尾天狐', desc: '第七魂技真身降临，全属性翻倍，魅惑不可抵御！', multiplier: 4.2, soulCost: 120, cd: 5 }
    ],
    rewardGold: 6000,
    rewardPoints: 350
  },

  // 蓝宝石 / 红宝石 (Lv 85 ~ 95 封号斗罗)
  {
    id: 'opp_dugu_bo',
    name: '独孤博（毒斗罗）',
    title: '落日森林客卿 · 碧磷斗罗',
    level: 92,
    martialSoulName: '碧磷蛇皇',
    soulRings: [
      { years: 800, color: 'yellow' },
      { years: 950, color: 'yellow' },
      { years: 3000, color: 'purple' },
      { years: 5000, color: 'purple' },
      { years: 15000, color: 'black' },
      { years: 30000, color: 'black' },
      { years: 60000, color: 'black' },
      { years: 80000, color: 'black' },
      { years: 95000, color: 'black' }
    ],
    hp: 55000,
    atk: 1400,
    def: 890,
    speed: 88,
    badge: '蓝宝石',
    skills: [
      { name: '碧磷蛇毒', desc: '屠城级剧毒侵蚀，每回合扣除巨额气血', multiplier: 3.0, soulCost: 80, cd: 2 },
      { name: '时光凝固 · 美杜莎凝望', desc: '第八魂技美杜莎之凝望，石化空间与一切生灵！', multiplier: 4.5, soulCost: 140, cd: 4 },
      { name: '第九魂技 · 碧磷神毒天劫', desc: '毁天灭地的碧绿毒雾遮天蔽日，吞噬一切！', multiplier: 5.5, soulCost: 200, cd: 5 }
    ],
    rewardGold: 15000,
    rewardPoints: 600
  },
  {
    id: 'opp_chen_xin',
    name: '尘心（剑斗罗）',
    title: '七宝琉璃宗供奉长老 · 剑道尘心',
    level: 97,
    martialSoulName: '七杀剑',
    soulRings: [
      { years: 900, color: 'yellow' },
      { years: 980, color: 'yellow' },
      { years: 3500, color: 'purple' },
      { years: 8000, color: 'purple' },
      { years: 25000, color: 'black' },
      { years: 50000, color: 'black' },
      { years: 75000, color: 'black' },
      { years: 90000, color: 'black' },
      { years: 100000, color: 'red' }
    ],
    hp: 92000,
    atk: 2600,
    def: 1350,
    speed: 105,
    badge: '红宝石',
    skills: [
      { name: '七杀剑气 · 平如流水', desc: '浩荡剑气纵横千米，无可阻挡！', multiplier: 3.8, soulCost: 90, cd: 2 },
      { name: '万剑归宗', desc: '第六魂技：漫天万柄七杀神剑如暴雨倾泻！', multiplier: 5.2, soulCost: 150, cd: 3 },
      { name: '第七魂技 · 七杀真身', desc: '人剑合一化为绝世神剑，斩断一切生机防御！', multiplier: 6.0, soulCost: 200, cd: 4 },
      { name: '第九魂技 · 神魔两斩', desc: '一剑诛神魔，绝世剑道爆发毁天灭地的无上剑威！', multiplier: 8.0, soulCost: 300, cd: 5 }
    ],
    rewardGold: 35000,
    rewardPoints: 1200
  },

  // 钻石斗魂 (Lv 99 绝世斗罗)
  {
    id: 'opp_bibi_dong',
    name: '比比东（武魂帝国女皇）',
    title: '罗刹神位传承者 · 双生武魂绝世斗罗',
    level: 99,
    martialSoulName: '死亡蛛皇 & 噬魂蛛皇',
    soulRings: [
      { years: 10000, color: 'black' },
      { years: 25000, color: 'black' },
      { years: 45000, color: 'black' },
      { years: 70000, color: 'black' },
      { years: 90000, color: 'black' },
      { years: 100000, color: 'red' },
      { years: 100000, color: 'red' },
      { years: 100000, color: 'red' },
      { years: 100000, color: 'red' }
    ],
    hp: 160000,
    atk: 3800,
    def: 2200,
    speed: 115,
    badge: '钻石斗魂',
    skills: [
      { name: '死亡蛛皇 · 荆棘蛛铠', desc: '反弹50%物理伤害并释放致命死亡死气', multiplier: 3.5, soulCost: 100, cd: 3 },
      { name: '罗刹死亡领域', desc: '吞噬削弱敌方全属性30%并封印疗愈效果！', multiplier: 4.8, soulCost: 200, cd: 4 },
      { name: '双生切换 · 噬魂蛛皇', desc: '切换第二武魂，刷新魂技冷却并恢复魂力！', multiplier: 5.5, soulCost: 250, cd: 5 },
      { name: '神技 · 罗刹魔镰斩', desc: '罗刹真神降临，召唤劈天裂地的罗刹魔镰！', multiplier: 9.5, soulCost: 400, cd: 6 }
    ],
    rewardGold: 100000,
    rewardPoints: 3000
  }
];
