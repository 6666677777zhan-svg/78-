import { Player, AutoBattleStrategy, CombatTacticalStance, SkillPriorityItem, SoulSkill } from '../types/game';

export interface StancePresetInfo {
  id: CombatTacticalStance;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  winRateBonus: number; // e.g. 25 for +25%
  recommendedTarget: string;
  priorityCategory: 'attack' | 'control' | 'defense' | 'balanced';
  tacticsList: string[];
  colorTheme: string;
  borderTheme: string;
  bgGradient: string;
}

export const STANCE_PRESETS: StancePresetInfo[] = [
  {
    id: 'burst',
    name: '强攻爆发流 (破甲秒杀)',
    badge: '极致爆发',
    tagline: '开局倾泻全部神技，以绝对攻击力碾碎敌方一切防御',
    description: '优先释放高倍率强攻魂技、万年/十万年奥义、斗铠附体神威与重型定装魂导炮，力求在最少回合内速斩敌酋。',
    winRateBonus: 26,
    recommendedTarget: '克制强攻型/防御型巨兽（如泰坦巨猿、大地之王、象甲宗肉盾）',
    priorityCategory: 'attack',
    tacticsList: [
      '开局即刻激发斗铠神威与杀神领域，拉满攻击力倍率增幅',
      '优先施展万年、十万年高爆发武魂奥义',
      '配合重型定装魂导炮与伙伴高暴击火力覆盖压制',
      '残血时引爆魂骨主动技与唐门暗器绝杀'
    ],
    colorTheme: 'text-amber-400',
    borderTheme: 'border-amber-500/50 hover:border-amber-400',
    bgGradient: 'from-amber-950/80 via-slate-900 to-red-950/80'
  },
  {
    id: 'control',
    name: '先手控制流 (窒息锁死)',
    badge: '控场主宰',
    tagline: '抢先压制对手行动力，让敌人在窒息控场中溃败',
    description: '优先施展控制系魂技（眩晕、冰冻、蛛网束缚、麻痹、迟缓），从首回合即锁死敌方核心战力，杜绝意外翻盘。',
    winRateBonus: 30,
    recommendedTarget: '克制敏攻型刺客与高爆发魂师（如暗魔邪神虎、神风战队、幽冥灵猫）',
    priorityCategory: 'control',
    tacticsList: [
      '首回合必放缠绕/冰冻/眩晕强控技能，直接剥夺敌方行动回合',
      '在控制期间安全施展伙伴连击与中阶技能打满稳定输出',
      '控制冷却结束后立即无缝衔接第二轮控场，形成无限压制循环',
      '保持健康血线，实现极低翻车率的高胜率挂机'
    ],
    colorTheme: 'text-sky-400',
    borderTheme: 'border-sky-500/50 hover:border-sky-400',
    bgGradient: 'from-sky-950/80 via-slate-900 to-indigo-950/80'
  },
  {
    id: 'sustain',
    name: '防守反击流 (不灭金身)',
    badge: '极致生存',
    tagline: '不动如山，凭借护盾与玄天功在持久战中耗尽敌手',
    description: '低血量时自动触发护盾、玄天功回气、无敌金身与回春丹，硬抗狂暴Boss终结技，化解一切危机。',
    winRateBonus: 22,
    recommendedTarget: '适合跨级挑战十万年凶兽与神祇试炼高阶祭司（极北三天王、深海魔鲸王）',
    priorityCategory: 'defense',
    tacticsList: [
      '生命值低于50%时自动开启护盾技能与防御魂导器',
      '生命值低于35%时自动吞服回春丹，杜绝暴毙风险',
      '依托玄天功持续回气，在漫长持久战中耗干敌方魂力',
      '关键时刻保留斗铠护体残血反杀护盾'
    ],
    colorTheme: 'text-emerald-400',
    borderTheme: 'border-emerald-500/50 hover:border-emerald-400',
    bgGradient: 'from-emerald-950/80 via-slate-900 to-teal-950/80'
  },
  {
    id: 'combo',
    name: '战队协同流 (终极共鸣)',
    badge: '团队共鸣',
    tagline: '终极斗罗四代伙伴全员出动，武魂融合技与连携绝杀',
    description: '完美协同蓝轩宇、白秀秀、唐雨格等伙伴与斗铠魂导器，开局聚拢控制，紧接多段高频连击破甲。',
    winRateBonus: 34,
    recommendedTarget: '全大陆精英魂师大赛、武魂殿黄金一代与高阶大斗魂场',
    priorityCategory: 'balanced',
    tacticsList: [
      '开局释放双武魂融合技与全队共鸣被动光环',
      '交替呼叫出战伙伴释放奥义，形成持续不断的火力压制',
      '中局切入斗铠降临与定装魂导炮锁定战局',
      '多段连携暴击大幅削减敌方全体防御'
    ],
    colorTheme: 'text-purple-400',
    borderTheme: 'border-purple-500/50 hover:border-purple-400',
    bgGradient: 'from-purple-950/80 via-slate-900 to-pink-950/80'
  },
  {
    id: 'custom',
    name: '自由定制流 (个性编排)',
    badge: '自由编排',
    tagline: '自由拖拽排列技能施放顺序，打造专属于你的战术序列',
    description: '魂师可完全自主决定每一枚魂环魂技、斗铠奥义、魂导器与伙伴连携的出招优先级。',
    winRateBonus: 28,
    recommendedTarget: '全场景通用，根据魂师独特战术直觉与特定Boss针对性调整',
    priorityCategory: 'balanced',
    tacticsList: [
      '自由点击调整1~8号技能出招优先级',
      '随时启用或禁用单项特定技能的释放开关',
      '灵活适配双生武魂与多样化的魂骨主动技',
      '精细化调节紧急回血阈值与魂力保留红线'
    ],
    colorTheme: 'text-yellow-400',
    borderTheme: 'border-yellow-500/50 hover:border-yellow-400',
    bgGradient: 'from-yellow-950/80 via-slate-900 to-slate-900'
  }
];

// Helper to determine skill category from SoulSkill definition
export function classifySoulSkill(skill: SoulSkill): {
  category: 'attack' | 'control' | 'defense' | 'buff' | 'special';
  categoryName: string;
} {
  const desc = (skill.description || '').toLowerCase();
  const name = (skill.name || '').toLowerCase();

  if (
    skill.debuffType === 'stun' || 
    skill.debuffType === 'paralyze' || 
    skill.debuffType === 'silence' ||
    desc.includes('stun') ||
    desc.includes('control') ||
    desc.includes('entangle') ||
    desc.includes('freeze') ||
    desc.includes('bind') ||
    desc.includes('paralyze') ||
    desc.includes('slow') ||
    desc.includes('眩晕') ||
    desc.includes('控制') ||
    desc.includes('缠绕') ||
    desc.includes('冰冻') ||
    desc.includes('束缚') ||
    desc.includes('麻痹') ||
    desc.includes('迟缓')
  ) {
    return { category: 'control', categoryName: '控制技能' };
  }

  if (
    skill.shieldMultiplier || 
    skill.healMultiplier || 
    desc.includes('shield') || 
    desc.includes('defense') || 
    desc.includes('heal') || 
    desc.includes('restore') ||
    desc.includes('golden body') ||
    desc.includes('护盾') || 
    desc.includes('防御') || 
    desc.includes('恢复') || 
    desc.includes('治疗') ||
    desc.includes('金身')
  ) {
    return { category: 'defense', categoryName: '防御护盾' };
  }

  if (
    skill.isDomain || 
    skill.buffType || 
    desc.includes('buff') || 
    desc.includes('berserk') || 
    desc.includes('domain') || 
    desc.includes('speed') ||
    desc.includes('增幅') || 
    desc.includes('狂暴') || 
    desc.includes('领域') ||
    desc.includes('加速')
  ) {
    return { category: 'buff', categoryName: '增幅领域' };
  }

  if (
    skill.isAvatar || 
    desc.includes('avatar') || 
    desc.includes('divine light') || 
    desc.includes('true body') ||
    desc.includes('真身') || 
    desc.includes('神光')
  ) {
    return { category: 'special', categoryName: '无上奥义' };
  }

  return { category: 'attack', categoryName: '强攻爆发' };
}

// Generate the initial skill priority list from the player's active abilities
export function generateSkillPriorityList(
  player: Player,
  stance: CombatTacticalStance = 'burst'
): SkillPriorityItem[] {
  const activeSoul = player.martialSouls[player.activeSoulIndex] || player.martialSouls[0];
  const items: SkillPriorityItem[] = [];

  // 1. Martial Soul Skills
  activeSoul.skills.forEach((skill, idx) => {
    const classification = classifySoulSkill(skill);
    items.push({
      id: `skill_${skill.id}`,
      type: 'soul_skill',
      name: `第${skill.ringOrder || idx + 1}魂技 · ${skill.name}`,
      category: classification.category,
      categoryName: classification.categoryName,
      description: skill.description,
      soulCost: skill.soulPowerCost,
      cooldown: skill.cooldown,
      priorityOrder: idx + 1,
      isEnabled: true
    });
  });

  // 2. Battle Armor (if unlocked)
  if (player.battleArmor) {
    items.push({
      id: 'action_battle_armor',
      type: 'battle_armor',
      name: `【${player.battleArmor.rankTitle || '斗铠'}】斗铠降临`,
      category: 'special',
      categoryName: '斗铠神技',
      description: `开启【${player.battleArmor.customName || '龙皇'}】斗铠，全属性暴增并获得巨额护盾与套装奥义`,
      cooldown: 4,
      priorityOrder: items.length + 1,
      isEnabled: true
    });
  }

  // 3. Soul Tools (if equipped)
  const equippedTool = (player.soulTools || []).find(t => t.isEquipped);
  if (equippedTool) {
    items.push({
      id: 'action_soul_tool',
      type: 'soul_tool',
      name: equippedTool.name,
      category: equippedTool.type === 'defense' ? 'defense' : 'attack',
      categoryName: equippedTool.type === 'defense' ? '防御魂导器' : '攻击重炮',
      description: `${equippedTool.rank}级定制魂导器神威轰击`,
      cooldown: 3,
      priorityOrder: items.length + 1,
      isEnabled: true
    });
  }

  // 4. Douluo 4 Squad Companions (if recruited in squad)
  const squad = (player.douluo4Companions || []).filter(c => c.isRecruited && c.isInSquad);
  squad.forEach(comp => {
    items.push({
      id: `companion_${comp.id}`,
      type: 'companion',
      name: `伙伴 · ${comp.name} 连携奥义`,
      category: 'special',
      categoryName: '战队连携',
      description: `召唤 ${comp.name} 释放【${comp.skills[0]?.name || '奥义'}】`,
      cooldown: 3,
      priorityOrder: items.length + 1,
      isEnabled: true
    });
  });

  // 5. Equipped Soul Bones
  Object.values(player.soulBones || {}).forEach(bone => {
    if (bone && bone.skillName) {
      items.push({
        id: `bone_${bone.id}`,
        type: 'soul_bone',
        name: `魂骨 · ${bone.skillName}`,
        category: 'attack',
        categoryName: '魂骨技能',
        description: bone.skillDesc || '附着于魂骨上的强力主动技',
        cooldown: bone.skillCooldown || 3,
        priorityOrder: items.length + 1,
        isEnabled: true
      });
    }
  });

  // Sort according to stance
  return sortSkillListByStance(items, stance);
}

// Sort skill items based on tactical stance
export function sortSkillListByStance(
  items: SkillPriorityItem[],
  stance: CombatTacticalStance
): SkillPriorityItem[] {
  const cloned = [...items];

  cloned.sort((a, b) => {
    if (stance === 'burst') {
      const score = (item: SkillPriorityItem) => {
        if (item.type === 'battle_armor') return 100;
        if (item.category === 'special') return 90;
        if (item.category === 'attack') return 80;
        if (item.type === 'soul_tool') return 70;
        if (item.category === 'control') return 50;
        if (item.category === 'buff') return 40;
        return 30;
      };
      return score(b) - score(a);
    } else if (stance === 'control') {
      const score = (item: SkillPriorityItem) => {
        if (item.category === 'control') return 100;
        if (item.category === 'buff') return 85;
        if (item.type === 'companion') return 75;
        if (item.category === 'attack') return 60;
        if (item.type === 'battle_armor') return 50;
        return 40;
      };
      return score(b) - score(a);
    } else if (stance === 'sustain') {
      const score = (item: SkillPriorityItem) => {
        if (item.category === 'defense') return 100;
        if (item.category === 'control') return 80;
        if (item.type === 'battle_armor') return 75;
        if (item.type === 'soul_tool') return 70;
        if (item.category === 'buff') return 60;
        return 40;
      };
      return score(b) - score(a);
    } else if (stance === 'combo') {
      const score = (item: SkillPriorityItem) => {
        if (item.type === 'companion') return 100;
        if (item.category === 'special') return 90;
        if (item.category === 'control') return 80;
        if (item.type === 'battle_armor') return 70;
        if (item.category === 'attack') return 60;
        return 40;
      };
      return score(b) - score(a);
    }
    return 0;
  });

  // Re-index priorityOrder
  return cloned.map((item, index) => ({
    ...item,
    priorityOrder: index + 1
  }));
}

// Create initial default auto battle strategy
export function createDefaultAutoBattleStrategy(player: Player): AutoBattleStrategy {
  const initialList = generateSkillPriorityList(player, 'burst');
  return {
    tacticalStance: 'burst',
    prioritySkillCategory: 'attack',
    skillPriorityList: initialList,
    autoBattleArmor: 'instant',
    autoSoulTool: 'always',
    autoCompanions: true,
    autoDomain: true,
    autoHiddenWeapons: true,
    autoPotionHpThreshold: 35,
    defenseShieldHpThreshold: 50,
    mpReserveThreshold: 15,
    offlineBonusWinRate: 26,
    isAfkHuntingEnabled: true,
    afkHuntingZoneName: '星斗大森林 · 混合区',
    afkLogs: [
      '[战术就绪] 已启用【强攻爆发流】托管战术；技能队列已同步至星斗拟态空间。',
      '[拟态挂机修炼] 正在自动匹配最佳猎场；战术胜率增幅 +26% 生效中。'
    ],
    totalAfkVictories: 0,
    lastAfkRewardTimestamp: Date.now()
  };
}

// Calculate comprehensive winrate for AFK hunting
export function calculateAfkWinRate(player: Player, strategy?: AutoBattleStrategy): {
  baseWinRate: number;
  bonusRate: number;
  totalWinRate: number;
  analysisText: string;
} {
  const activeSoul = player.martialSouls[player.activeSoulIndex] || player.martialSouls[0];
  const stance = strategy?.tacticalStance || 'burst';
  const preset = STANCE_PRESETS.find(p => p.id === stance) || STANCE_PRESETS[0];

  // Base calculation from player level, skills count, soul bones
  const ringCount = activeSoul.skills.length;
  const boneCount = Object.values(player.soulBones || {}).filter(b => !!b).length;
  const armorRankBonus = player.battleArmor?.rank === 'five_word' ? 12 :
                         player.battleArmor?.rank === 'four_word' ? 9 :
                         player.battleArmor?.rank === 'three_word' ? 6 :
                         player.battleArmor?.rank === 'two_word' ? 4 : 2;

  let baseRate = 60 + Math.min(25, player.level * 0.25) + ringCount * 1.5 + boneCount * 1.2 + armorRankBonus;
  baseRate = Math.min(85, Math.max(50, Math.floor(baseRate)));

  const bonusRate = preset.winRateBonus;
  const totalWinRate = Math.min(99.5, Number((baseRate + bonusRate).toFixed(1)));

  let analysisText = '';
  if (stance === 'burst') {
    analysisText = `当前采用【强攻爆发流】，凭借高暴击与倍率神技迅速瓦解敌阵，战术胜率增幅 +${bonusRate}%！`;
  } else if (stance === 'control') {
    analysisText = `当前采用【先手控制流】，开局死锁敌方行动力，有效杜绝意外减员，战术胜率增幅 +${bonusRate}%！`;
  } else if (stance === 'sustain') {
    analysisText = `当前采用【防守反击流】，残血自动触发无敌护盾与灵药，具备极强韧性，战术胜率增幅 +${bonusRate}%！`;
  } else if (stance === 'combo') {
    analysisText = `当前采用【战队协同流】，协同终极斗罗伙伴与武魂融合技倾泻输出，战术胜率增幅 +${bonusRate}%！`;
  } else {
    analysisText = `当前采用【自由定制流】，精准贴合魂师个人独特战斗偏好，战术胜率增幅 +${bonusRate}%！`;
  }

  return {
    baseWinRate: baseRate,
    bonusRate,
    totalWinRate,
    analysisText
  };
}
