/**
 * Douluo Dalu - Multi-Path Cultivation & Training Data
 * Includes: Mimicry Cultivation Zones, Eight Extraordinary Meridians, Waterfall Weight Training, Purple Demon Eye Sunrise Gaze, and Shrek Resonance.
 */

import { MeridianInfo, MimicryZoneInfo, ShrekComradeInfo } from '../types/game';

// 1. Mimicry Cultivation Environments
export const MIMICRY_ZONES: MimicryZoneInfo[] = [
  {
    id: 'thunder_valley',
    name: '狂雷风暴大峡谷',
    chineseName: '狂雷风暴大峡谷',
    description: '天雷轰鸣、九天狂雷不绝的绝险峡谷。充沛暴烈的狂雷能量是淬炼雷系与强攻系武魂的圣地。',
    matchedElements: ['thunder', 'physical'],
    expMultiplier: 1.6,
    environmentBuff: '强攻系与雷系武魂修练效率+60%，暴击率+5%',
    bgGradient: 'from-amber-950 via-slate-900 to-indigo-950',
    colorClass: 'text-amber-300 border-amber-500/50'
  },
  {
    id: 'life_tree',
    name: '星斗生命古树圣境',
    chineseName: '星斗生命古树圣境',
    description: '扎根于星斗大森林生命湖畔，散发着无尽生机与自然古韵，滋养润泽万物生长。',
    matchedElements: ['plant', 'support', 'control'],
    expMultiplier: 1.6,
    environmentBuff: '植物系、控制系与辅助系修练效率+60%，生命上限+15%',
    bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    colorClass: 'text-emerald-300 border-emerald-500/50'
  },
  {
    id: 'core_magma',
    name: '地心纯阳赤炎岩浆池',
    chineseName: '地心纯阳赤炎岩浆池',
    description: '深达万丈的地心纯阳岩浆池，翻涌着永不熄灭的太阳神火，可焚尽一切杂质与暗黑邪毒。',
    matchedElements: ['fire', 'light', 'divine'],
    expMultiplier: 1.6,
    environmentBuff: '火系与光明神级武魂修练效率+60%，攻击力+10%',
    bgGradient: 'from-red-950 via-slate-900 to-orange-950',
    colorClass: 'text-orange-300 border-orange-500/50'
  },
  {
    id: 'deep_ocean',
    name: '深海怒涛狂涌海沟',
    chineseName: '深海怒涛狂涌海沟',
    description: '万丈海底庞大漩涡，千钧水压犹如重山压顶，专为淬炼海神与器武魂不屈意志而打造。',
    matchedElements: ['water', 'physical', 'divine'],
    expMultiplier: 1.6,
    environmentBuff: '器武魂与海神武魂修练效率+60%，防御力+12%',
    bgGradient: 'from-blue-950 via-slate-900 to-cyan-950',
    colorClass: 'text-cyan-300 border-cyan-500/50'
  },
  {
    id: 'everfrost_cavern',
    name: '极北万年玄冰洞窟',
    chineseName: '极北万年玄冰洞窟',
    description: '极北之地核心零下百度的万年玄冰圣域，将魂力凝练至绝对纯净，凝聚至臻精神专注。',
    matchedElements: ['ice', 'control'],
    expMultiplier: 1.6,
    environmentBuff: '冰系与控制系武魂修练效率+60%，最大魂力值+20%',
    bgGradient: 'from-sky-950 via-slate-900 to-blue-950',
    colorClass: 'text-sky-300 border-sky-500/50'
  },
  {
    id: 'venom_mire',
    name: '九幽蚀骨毒瘴沼泽',
    chineseName: '九幽蚀骨毒瘴沼泽',
    description: '五彩毒雾笼罩的绝毒沼泽，万毒滋生，最适合毒系与暗黑兽武魂淬炼经脉骨髓。',
    matchedElements: ['poison', 'dark', 'beast'],
    expMultiplier: 1.6,
    environmentBuff: '毒系与暗黑兽武魂修练效率+60%，破甲率+15%',
    bgGradient: 'from-purple-950 via-slate-900 to-neutral-950',
    colorClass: 'text-purple-300 border-purple-500/50'
  }
];

// 2. Eight Extraordinary Meridians
export const EIGHT_MERIDIANS: MeridianInfo[] = [
  {
    id: 'dumai',
    name: '督脉',
    chineseName: '督脉',
    acupoints: ['长强', '命门', '大椎', '百会', '神庭'],
    expCost: 500,
    bonusDesc: '贯穿脊髓主导诸阳之气，气血如龙，战意昂扬！',
    statsBonus: {
      atk: 450,
      critDmg: 20
    }
  },
  {
    id: 'renmai',
    name: '任脉',
    chineseName: '任脉',
    acupoints: ['会阴', '关元', '气海', '膻中', '承浆'],
    expCost: 800,
    bonusDesc: '统领诸阴经脉，生生不息，气血长存免伤！',
    statsBonus: {
      hp: 4000,
      def: 250
    }
  },
  {
    id: 'chongmai',
    name: '冲脉',
    chineseName: '冲脉',
    acupoints: ['幽门', '通谷', '商曲', '气冲'],
    expCost: 1200,
    bonusDesc: '连接全身气血百穴，魂力流转畅通无阻，降低魂力消耗！',
    statsBonus: {
      soulPower: 120,
      atk: 300
    }
  },
  {
    id: 'daimai',
    name: '带脉',
    chineseName: '带脉',
    acupoints: ['带脉', '五枢', '维道'],
    expCost: 1600,
    bonusDesc: '约束腰腹诸经，身法如燕，疾如鬼魅！',
    statsBonus: {
      speed: 40,
      critRate: 6
    }
  },
  {
    id: 'yinwei',
    name: '阴维脉',
    chineseName: '阴维脉',
    acupoints: ['筑宾', '冲门', '府舍', '大横', '期门'],
    expCost: 2200,
    bonusDesc: '调和体内阴精，辟退百毒，静心冥想收益倍增！',
    statsBonus: {
      poisonResist: 30,
      hp: 3000
    }
  },
  {
    id: 'yangwei',
    name: '阳维脉',
    chineseName: '阳维脉',
    acupoints: ['金门', '阳交', '臑会', '天寮', '风池'],
    expCost: 3000,
    bonusDesc: '纯阳护体之铠包裹全身，招招直击要害破甲！',
    statsBonus: {
      penetration: 15,
      critRate: 8,
      atk: 400
    }
  },
  {
    id: 'yinqiao',
    name: '阴跷脉',
    chineseName: '阴跷脉',
    acupoints: ['照海', '交信', '睛明'],
    expCost: 4000,
    bonusDesc: '足下生风，闪避如幻影，先手制敌！',
    statsBonus: {
      speed: 50,
      def: 300
    }
  },
  {
    id: 'yangqiao',
    name: '阳跷脉',
    chineseName: '阳跷脉',
    acupoints: ['申脉', '仆参', '巨髎', '肩髃', '巨骨'],
    expCost: 5500,
    bonusDesc: '奇经八脉全通圆满！开启【不灭金身】！',
    statsBonus: {
      atk: 800,
      def: 600,
      hp: 8000,
      critRate: 10,
      critDmg: 30,
      penetration: 20
    }
  }
];

// 3. Waterfall Training Stages
export const WATERFALL_STAGES = [
  {
    level: 1,
    name: '百斤铅背 · 洪流冲击',
    weight: 100,
    hammerHitsNeeded: 9,
    expReward: 300,
    physiqueTitle: '铜皮初成',
    hpGain: 800,
    atkGain: 80,
    desc: '身背百斤铅块，屹立于千钧瀑布巨石之上，承受水流激荡洗礼。'
  },
  {
    level: 2,
    name: '三百斤重负 · 逆流挥锤',
    weight: 300,
    hammerHitsNeeded: 18,
    expReward: 800,
    physiqueTitle: '铁骨战力',
    hpGain: 1800,
    atkGain: 180,
    desc: '在咆哮激流中挥动巨锤，掌握借力打力与卸力奇术。'
  },
  {
    level: 3,
    name: '八百斤玄铁 · 浪柱稳立',
    weight: 800,
    hammerHitsNeeded: 36,
    expReward: 1800,
    physiqueTitle: '金石之躯',
    hpGain: 3500,
    atkGain: 350,
    desc: '如磐石般镇守飞流直下的千丈瀑布，肉身与魂力完成蜕变。'
  },
  {
    level: 4,
    name: '两千斤陨铁 · 乱披风81锤',
    weight: 2000,
    hammerHitsNeeded: 64,
    expReward: 4000,
    physiqueTitle: '万钧霸体',
    hpGain: 7000,
    atkGain: 700,
    desc: '在瀑布正核心连续挥出81锤乱披风锤法，气势毁天灭地！'
  },
  {
    level: 5,
    name: '万斤神力 · 瀑布断流斩',
    weight: 10000,
    hammerHitsNeeded: 81,
    expReward: 8800,
    physiqueTitle: '神级金身',
    hpGain: 15000,
    atkGain: 1500,
    desc: '打破肉身凡胎极限；一锤轰出，让千丈巨瀑逆流直上，入圣破空！'
  }
];

// 4. Purple Demon Eye Stages
export const ZIJI_EYE_STAGES_CONFIG = [
  {
    stage: '纵观' as const,
    title: '纵观境界',
    desc: '吸纳紫气入瞳，纵观全局，洞察战场微小破绽与敌人出手前摇。',
    critRateBonus: 5,
    critDmgBonus: 10,
    requiredGazeCount: 5,
    skillDesc: '被动：暴击率+5%，暴击伤害+10%'
  },
  {
    stage: '入微' as const,
    title: '入微境界',
    desc: '视线可捕捉极速飞行的暗器轨迹与敌方魂力流动瑕疵。',
    critRateBonus: 10,
    critDmgBonus: 25,
    requiredGazeCount: 15,
    skillDesc: '被动：暴击率+10%，暴击伤害+25%，解锁精神感知'
  },
  {
    stage: '芥子' as const,
    title: '芥子境界',
    desc: '视微如著，察芥子如宇宙；精神力凝结为实质性的精神风暴。',
    critRateBonus: 18,
    critDmgBonus: 40,
    requiredGazeCount: 30,
    skillDesc: '被动：暴击率+18%，暴击伤害+40%，物理破甲+15%'
  },
  {
    stage: '浩瀚' as const,
    title: '浩瀚境界 (神念觉醒)',
    desc: '双瞳如浩瀚星河；神识超凡入圣！免疫一切精神控制，解锁【紫极神光】！',
    critRateBonus: 28,
    critDmgBonus: 60,
    requiredGazeCount: 50,
    skillDesc: '绝技【紫极神光】：消耗魂力喷射无视防御的精神毁灭神光！'
  }
];

// 5. Shrek Seven Devils Resonance Co-Cultivation
export const SHREK_COMRADES_DATA: ShrekComradeInfo[] = [
  {
    id: 'xiaowu',
    name: '小舞',
    title: '柔骨魅兔',
    martialSoul: '柔骨兔',
    description: '十万年魂兽化形，三世相伴的至爱挚友。双修可淬炼柔韧身法与瞬移秘术。',
    avatarText: '小舞',
    colorTheme: 'from-pink-500 to-rose-600',
    synergySkill: '柔骨 · 瞬移连击',
    synergyBuffDesc: '生命上限+12%，暴击时有30%概率触发一次额外追击',
    baseBoost: { hp: 3500, speed: 25 }
  },
  {
    id: 'mubai',
    name: '戴沐白',
    title: '邪眸白虎',
    martialSoul: '白虎',
    description: '史莱克七怪队长，星罗皇子。双修可点燃暴烈武魂血脉。',
    avatarText: '沐白',
    colorTheme: 'from-amber-500 to-yellow-600',
    synergySkill: '白虎金刚 · 破阵冲锋',
    synergyBuffDesc: '物理攻击+15%，暴击伤害+25%',
    baseBoost: { atk: 400, def: 200 }
  },
  {
    id: 'zhuqing',
    name: '朱竹清',
    title: '幽冥灵猫',
    martialSoul: '幽冥灵猫',
    description: '极致的速度与暗夜刺客。双修解锁踏影与幽冥刺杀。',
    avatarText: '竹清',
    colorTheme: 'from-purple-600 to-indigo-700',
    synergySkill: '幽冥影杀 · 幻影分身',
    synergyBuffDesc: '速度+25%，物理闪避率+15%',
    baseBoost: { speed: 45, atk: 250 }
  },
  {
    id: 'rongrong',
    name: '宁荣荣',
    title: '九宝琉璃',
    martialSoul: '九宝琉璃塔',
    description: '第一辅助宗门继承人。双修沐浴七宝神光增幅！',
    avatarText: '荣荣',
    colorTheme: 'from-cyan-500 to-blue-600',
    synergySkill: '九宝琉璃 · 神光庇佑',
    synergyBuffDesc: '全属性+10%，修练经验收益+25%',
    baseBoost: { hp: 3000, def: 300, atk: 250 }
  },
  {
    id: 'oscar',
    name: '奥斯卡',
    title: '香肠专卖',
    martialSoul: '香肠',
    description: '先天满魂力食物系天才。双修提供每日神级香肠补给。',
    avatarText: '小奥',
    colorTheme: 'from-emerald-500 to-teal-600',
    synergySkill: '亢奋香肠 · 灵泉复生',
    synergyBuffDesc: '每回合自动恢复8%生命与15点魂力',
    baseBoost: { hp: 4000, def: 200 }
  },
  {
    id: 'hongjun',
    name: '马红俊',
    title: '邪火凤凰',
    martialSoul: '火凤凰',
    description: '纯阳极致神凰血脉。双修淬炼涅槃爆发神力！',
    avatarText: '红俊',
    colorTheme: 'from-orange-500 to-red-600',
    synergySkill: '凤鸣九天 · 焚天之怒',
    synergyBuffDesc: '暴击率+12%，攻击附带20%真实灼烧伤害',
    baseBoost: { atk: 500, critRate: 8 }
  }
];
