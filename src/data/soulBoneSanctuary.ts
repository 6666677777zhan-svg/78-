import { SoulBoneSanctuaryTrial, SoulBone, SoulBoneAuctionItem } from '../types/game';

export const SOUL_BONE_TRIALS: SoulBoneSanctuaryTrial[] = [
  {
    id: 'trial_terrorclaw_bear',
    name: '【恐爪圣冢】暗金恐爪熊皇巢穴',
    desc: '远古魂兽森林深处的恐爪熊冢，蕴藏至高外附魂骨：【暗金恐爪】！撕天裂地，破防无双。',
    guardianName: '八万年暗金恐爪熊王',
    years: 80000,
    slot: 'external',
    recommendedLevel: 50,
    rewardBoneName: '外附魂骨 · 八万年暗金恐爪',
    rewardBoneDesc: '右手生出五道暗金利刃巨爪，具备撕裂神明防御与一切魂技的无上神威！',
    rewardBoneYears: 80000,
    cleared: false,
    bossHp: 65000,
    bossAtk: 2200,
    bossDef: 1800
  },
  {
    id: 'trial_ancient_dragon_tomb',
    name: '【真龙圣冢】山龙王厚土遗迹',
    desc: '九大龙王之山龙王沉眠之地。山岳般厚重的山龙躯干骨，赋予无尽生机与绝对稳固之壁。',
    guardianName: '十万年山龙王龙魂',
    years: 100000,
    slot: 'torso',
    recommendedLevel: 70,
    rewardBoneName: '十万年山龙王厚土躯干骨',
    rewardBoneDesc: '不动如山！承载远古真龙之力，赋予海量生命上限与 50% 物理免伤！',
    rewardBoneYears: 100000,
    cleared: false,
    bossHp: 150000,
    bossAtk: 3800,
    bossDef: 3500
  },
  {
    id: 'trial_evil_eye_abyss',
    name: '【邪眼魔窟】邪眼暴君主宰领域',
    desc: '邪魔森林至尊霸主的精神试炼！破除诡异精神幻境，夺取至高智慧头骨！',
    guardianName: '三十万年邪眼暴君分身',
    years: 300000,
    slot: 'head',
    recommendedLevel: 85,
    rewardBoneName: '三十万年邪眼暴君湮灭头骨',
    rewardBoneDesc: '释放时空毁灭之光，对敌方精神之海造成毁灭性打击并封印其魂力运转！',
    rewardBoneYears: 300000,
    cleared: false,
    bossHp: 280000,
    bossAtk: 6500,
    bossDef: 4200
  },
  {
    id: 'trial_deep_sea_demon_whale',
    name: '【深海魔巢】百万年深海魔鲸王神骨',
    desc: '半步化神的百万年深海霸主！战胜其滔天魔威，夺取百万年神级至尊躯干骨！',
    guardianName: '百万年深海魔鲸王',
    years: 1000000,
    slot: 'torso',
    recommendedLevel: 98,
    rewardBoneName: '百万年深海魔鲸神化躯干骨',
    rewardBoneDesc: '完全神化的至尊神骨！提供神光护体，全属性暴增 100%，附带【神化神光】被动！',
    rewardBoneYears: 1000000,
    cleared: false,
    bossHp: 680000,
    bossAtk: 12000,
    bossDef: 9500
  }
];

export const INITIAL_AUCTION_ITEMS: SoulBoneAuctionItem[] = [
  {
    id: 'auction_soft_bone',
    bone: {
      id: 'auction_soft_bone_arm',
      name: '十万年柔骨兔右臂骨',
      slot: 'rightArm',
      years: 100000,
      color: 'red',
      sourceBeast: '十万年柔骨兔',
      description: '蕴含瞬移与无敌金身的十万年极品神骨！',
      atkBonus: 480,
      defBonus: 360,
      hpBonus: 4200,
      speedBonus: 50,
      critBonus: 16,
      skillName: '无敌金身与瞬移',
      skillDesc: '获得3秒绝对无敌并瞬移闪避下一次致命打击！',
      skillCooldown: 4,
      equipped: false
    },
    currentBid: 12000,
    buyoutPrice: 20000,
    seller: '七宝琉璃宗拍卖商行',
    sold: false
  },
  {
    id: 'auction_swift_leg',
    bone: {
      id: 'auction_swift_leg_left',
      name: '万年疾风魔鸟左腿骨',
      slot: 'leftLeg',
      years: 45000,
      color: 'black',
      sourceBeast: '疾风神鸟',
      description: '敏攻系魂师梦寐以求的极速宝骨，步法如电。',
      atkBonus: 260,
      defBonus: 180,
      hpBonus: 2200,
      speedBonus: 60,
      critBonus: 15,
      skillName: '疾风神行步',
      skillDesc: '提升自身行动速度 60%，持续2回合！',
      skillCooldown: 3,
      equipped: false
    },
    currentBid: 6500,
    buyoutPrice: 10000,
    seller: '索托大斗魂场拍卖阁',
    sold: false
  },
  {
    id: 'auction_dark_wings',
    bone: {
      id: 'auction_dark_wings_external',
      name: '外附魂骨 · 邪神风雷暗魔翼',
      slot: 'external',
      years: 70000,
      color: 'black',
      sourceBeast: '暗魔邪神虎',
      description: '暗魔邪神虎背生风雷双翼，执掌时光与风雷极致速度！',
      atkBonus: 550,
      defBonus: 300,
      hpBonus: 3600,
      speedBonus: 80,
      critBonus: 22,
      skillName: '风雷神翼 · 破虚瞬闪',
      skillDesc: '撕裂虚空，造成 400% 风雷混合暴击伤害！',
      skillCooldown: 3,
      equipped: false
    },
    currentBid: 18000,
    buyoutPrice: 30000,
    seller: '杀戮之都黑市行商',
    sold: false
  }
];
