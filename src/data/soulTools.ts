import { SoulTool } from '../types/game';

export const INITIAL_SOUL_TOOLS: SoulTool[] = [
  {
    id: 'soul_shield_generator',
    name: '三级·坚固魂导护罩',
    rank: 3,
    type: 'defense',
    description: '日月帝国经典防御魂导器，瞬间展开能量护罩吸收大量伤害。',
    icon: 'Shield',
    atkBonus: 50,
    defBonus: 220,
    hpBonus: 1200,
    speedBonus: 0,
    soulCost: 20,
    cooldown: 3,
    activeSkill: {
      name: '坚固护盾·能量偏转',
      description: '获得相当于自身30%最大气血的魂力护盾，持续2回合。',
      shieldMultiplier: 0.3
    },
    isEquipped: true,
    isUnlocked: true,
    materialsNeeded: [
      { itemId: 'low_spirit_ore', name: '低阶魂石', count: 5 }
    ]
  },
  {
    id: 'invincible_barrier',
    name: '五级·无敌护罩',
    rank: 5,
    type: 'defense',
    description: '魂导师核心保命神器！爆发金色绝对壁障，免疫一切魂力与物理伤害。',
    icon: 'ShieldAlert',
    atkBonus: 120,
    defBonus: 450,
    hpBonus: 2800,
    speedBonus: 10,
    soulCost: 40,
    cooldown: 5,
    activeSkill: {
      name: '无敌护罩·金光庇佑',
      description: '进入1回合绝对无敌状态，免疫一切伤害与异常状态！',
      effect: 'invincible'
    },
    isEquipped: false,
    isUnlocked: false,
    materialsNeeded: [
      { itemId: 'spirit_iron_ore', name: '沉银矿石', count: 12 },
      { itemId: 'high_spirit_crystal', name: '极品魂晶', count: 4 }
    ]
  },
  {
    id: 'soul_flight_wings',
    name: '六级·超音速飞行魂导翼',
    rank: 6,
    type: 'assist',
    description: '背负式高阶核心推进魂导翼，提供惊人的空中机动与先手制空权。',
    icon: 'Zap',
    atkBonus: 200,
    defBonus: 180,
    hpBonus: 1500,
    speedBonus: 65,
    soulCost: 25,
    cooldown: 4,
    activeSkill: {
      name: '超音速俯冲掠影',
      description: '行动条立即拉满，并提升35%闪避率与暴击率，持续2回合！',
      effect: 'speed_boost'
    },
    isEquipped: false,
    isUnlocked: false,
    materialsNeeded: [
      { itemId: 'spirit_iron_ore', name: '沉银矿石', count: 15 },
      { itemId: 'deep_sea_silver', name: '深海沉银', count: 5 }
    ]
  },
  {
    id: 'soul_recharge_bottle',
    name: '六级·高能魂力奶瓶',
    rank: 6,
    type: 'assist',
    description: '高度压缩的充能储魂法器，战时激发可瞬间回满魂力储量。',
    icon: 'Droplets',
    atkBonus: 100,
    defBonus: 100,
    hpBonus: 2000,
    speedBonus: 15,
    soulCost: 0,
    cooldown: 4,
    activeSkill: {
      name: '魂力释放·神能灌注',
      description: '瞬间恢复100%魂力，并回复25%最大气血！',
      healMultiplier: 0.25
    },
    isEquipped: false,
    isUnlocked: false,
    materialsNeeded: [
      { itemId: 'spirit_iron_ore', name: '沉银矿石', count: 10 },
      { itemId: 'high_spirit_crystal', name: '极品魂晶', count: 6 }
    ]
  },
  {
    id: 'death_ray_cannon',
    name: '九级·定装魂导炮【死神之光】',
    rank: 9,
    type: 'attack',
    description: '镇国级毁灭超武！发射毁天灭地的死神射线，足以重创95级封号斗罗！',
    icon: 'Flame',
    atkBonus: 850,
    defBonus: 200,
    hpBonus: 3500,
    speedBonus: 20,
    soulCost: 60,
    cooldown: 4,
    activeSkill: {
      name: '定装怒啸·死神湮灭射线',
      description: '发射高纯度死神之光，造成450%穿透破甲伤害并附加重度解离腐蚀！',
      damageMultiplier: 4.5
    },
    isEquipped: false,
    isUnlocked: false,
    materialsNeeded: [
      { itemId: 'deep_sea_silver', name: '深海沉银', count: 15 },
      { itemId: 'meteor_iron', name: '星陨天铁', count: 8 },
      { itemId: 'divine_god_ore', name: '天锻神金', count: 4 }
    ]
  },
  {
    id: 'eternal_paradise',
    name: '十级神级·永恒天国',
    rank: 10,
    type: 'artifact',
    description: '人类智慧终极弑神核爆超武！引爆超质能湮灭，具备毁灭神级强者的至高威能。',
    icon: 'Sparkles',
    atkBonus: 1800,
    defBonus: 900,
    hpBonus: 10000,
    speedBonus: 50,
    soulCost: 80,
    cooldown: 6,
    activeSkill: {
      name: '弑神之威·永恒天国降临',
      description: '引爆永恒天国神之湮灭，造成800%无视防御的真实神圣伤害并眩晕敌方2回合！',
      damageMultiplier: 8.0,
      effect: 'stun'
    },
    isEquipped: false,
    isUnlocked: false,
    materialsNeeded: [
      { itemId: 'divine_god_ore', name: '天锻神金', count: 15 },
      { itemId: 'meteor_iron', name: '星陨天铁', count: 20 },
      { itemId: 'high_spirit_crystal', name: '极品魂晶', count: 20 }
    ]
  },
  {
    id: 'space_time_needle',
    name: '十级神级·时空神针',
    rank: 10,
    type: 'artifact',
    description: '掌控时空维度法则的至尊魂导超神器，定格时间流速，封锁空间跃迁。',
    icon: 'Crosshair',
    atkBonus: 1500,
    defBonus: 1100,
    hpBonus: 8500,
    speedBonus: 80,
    soulCost: 70,
    cooldown: 5,
    activeSkill: {
      name: '时空定格·寰宇凝固',
      description: '冻结时空维度，造成500%伤害并封印敌方全部魂技2回合！',
      damageMultiplier: 5.0,
      effect: 'silence'
    },
    isEquipped: false,
    isUnlocked: false,
    materialsNeeded: [
      { itemId: 'divine_god_ore', name: '天锻神金', count: 12 },
      { itemId: 'deep_sea_silver', name: '深海沉银', count: 18 }
    ]
  }
];

