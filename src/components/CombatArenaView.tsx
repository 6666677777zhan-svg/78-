import React, { useState, useEffect, useRef } from 'react';
import { Player, SoulSkill, HiddenWeapon, CombatLog, CombatEntity, SoulBone } from '../types/game';
import { calculatePlayerStats } from '../utils/saveManager';
import { SoundEngine } from '../utils/audio';
import { SoulRingsDisplay } from './SoulRingsDisplay';
import { BATTLE_ARMOR_RANKS } from '../data/battleArmor';
import { DEFAULT_AVATAR_URL } from '../data/avatars';
import confetti from 'canvas-confetti';
import { MartialSoulSkillFxOverlay, ActiveSkillFxState } from './MartialSoulSkillFxOverlay';
import { 
  Swords, Shield, Zap, Heart, Award, Skull, Flame, Sparkles, 
  Bot, AlertOctagon, ShieldCheck, Crosshair, Wind, Eye
} from 'lucide-react';

interface CombatArenaViewProps {
  player: Player;
  enemyEntity: CombatEntity;
  combatTitle?: string;
  onVictory: (expGained: number, goldGained: number, itemsGained: any[], defeatedEnemy?: CombatEntity) => void;
  onDefeat: () => void;
  onEscape?: () => void;
}

interface FloatingDamage {
  id: string;
  text: string;
  isCrit?: boolean;
  type: 'damage' | 'heal' | 'shield' | 'poison' | 'gold' | 'dodge';
  targetIsPlayer?: boolean;
}

interface StatusEffect {
  id: string;
  name: string;
  type: 'stun' | 'poison' | 'bleed' | 'burn' | 'weaken' | 'dodge' | 'purify';
  turnsLeft: number;
  value: number; // damage or shield amount
}

export const CombatArenaView: React.FC<CombatArenaViewProps> = ({
  player,
  enemyEntity,
  combatTitle = '魂兽决斗猎杀',
  onVictory,
  onDefeat,
  onEscape
}) => {
  const playerStats = calculatePlayerStats(player);
  const activeSoul = player.martialSouls.find(s => s.id === player.activeSoulId) || player.martialSouls[0];

  const difficulty = player.worldDifficulty || 'normal';
  const diffConfig = {
    normal: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      shieldMult: 1.0,
      critBonus: 0,
      rewardMult: 1.0,
      enrageThreshold: 0.25,
      name: '凡俗之道',
      badgeClass: 'bg-slate-800 text-slate-300 border-slate-700'
    },
    nightmare: {
      hpMult: 1.8,
      atkMult: 1.5,
      defMult: 1.35,
      shieldMult: 1.5,
      critBonus: 0.2,
      rewardMult: 2.0,
      enrageThreshold: 0.38,
      name: '修罗地狱 🔥',
      badgeClass: 'bg-rose-950/90 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
    },
    godlike: {
      hpMult: 2.8,
      atkMult: 2.0,
      defMult: 1.7,
      shieldMult: 2.5,
      critBonus: 0.35,
      rewardMult: 3.5,
      enrageThreshold: 0.48,
      name: '深红神祇 ⚡',
      badgeClass: 'bg-amber-950/90 text-amber-300 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
    }
  }[difficulty];

  // Calculated Enemy Scaled Stats
  const scaledEnemyMaxHp = Math.floor(enemyEntity.maxHp * diffConfig.hpMult);
  const scaledEnemyAtk = Math.floor(enemyEntity.atk * diffConfig.atkMult);
  const scaledEnemyDef = Math.floor(enemyEntity.def * diffConfig.defMult);
  const initialEnemyShield = enemyEntity.shield 
    ? Math.floor(enemyEntity.shield * diffConfig.shieldMult) 
    : (difficulty !== 'normal' ? Math.floor(scaledEnemyMaxHp * (difficulty === 'godlike' ? 0.25 : 0.15)) : 0);

  // Combat States
  const [playerHp, setPlayerHp] = useState(() => calculatePlayerStats(player).maxHp);
  const [playerMaxHp] = useState(() => calculatePlayerStats(player).maxHp);
  const [playerMp, setPlayerMp] = useState(() => calculatePlayerStats(player).maxSoulPower);
  const [playerMaxMp] = useState(() => calculatePlayerStats(player).maxSoulPower);
  const [playerShield, setPlayerShield] = useState(0);

  const [enemyHp, setEnemyHp] = useState(scaledEnemyMaxHp);
  const [enemyMaxHp] = useState(scaledEnemyMaxHp);
  const [enemyMp, setEnemyMp] = useState(enemyEntity.soulPower || 100);
  const [enemyShield, setEnemyShield] = useState(initialEnemyShield);
  const [isEnemyEnraged, setIsEnemyEnraged] = useState(false);

  // Status Effects
  const [playerDebuffs, setPlayerDebuffs] = useState<StatusEffect[]>([]);
  const [enemyDebuffs, setEnemyDebuffs] = useState<StatusEffect[]>([]);
  const [playerDodgeBuff, setPlayerDodgeBuff] = useState<number>(0); // turns left

  const [turn, setTurn] = useState(1);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAvatarActive, setIsAvatarActive] = useState(false);
  const [isDomainActive, setIsDomainActive] = useState(false);

  // Cooldowns
  const [skillCooldowns, setSkillCooldowns] = useState<Record<string, number>>({});
  const [boneCooldowns, setBoneCooldowns] = useState<Record<string, number>>({});
  const [armorCooldown, setArmorCooldown] = useState<number>(0);
  const [soulToolCooldown, setSoulToolCooldown] = useState<number>(0);
  const [companionCooldowns, setCompanionCooldowns] = useState<Record<string, number>>({});
  const [spiritSoulCooldowns, setSpiritSoulCooldowns] = useState<Record<string, number>>({});
  const [mechaCooldown, setMechaCooldown] = useState<number>(0);
  const [zijiCooldown, setZijiCooldown] = useState<number>(0);
  const [guiyingCooldown, setGuiyingCooldown] = useState<number>(0);
  const [xuanyuCooldown, setXuanyuCooldown] = useState<number>(0);

  const [hiddenWeaponInventory, setHiddenWeaponInventory] = useState<HiddenWeapon[]>(player.hiddenWeapons || []);
  const [isBattleArmorActive, setIsBattleArmorActive] = useState(player.battleArmor?.isActive || false);

  const [combatLogs, setCombatLogs] = useState<CombatLog[]>([]);
  const [floatingDamages, setFloatingDamages] = useState<FloatingDamage[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  const [battleState, setBattleState] = useState<'ongoing' | 'victory' | 'defeat'>('ongoing');
  const [isAutoBattle, setIsAutoBattle] = useState<boolean>(player.isMeditationAuto || false);
  const [activeSkillFx, setActiveSkillFx] = useState<ActiveSkillFxState | null>(null);

  const logContainerRef = useRef<HTMLDivElement>(null);
  const strategy = player.autoBattleStrategy;

  // Trigger martial soul skill SVG path animation feedback
  const triggerSkillFx = (
    skillName: string,
    soulName?: string,
    colorTheme?: ActiveSkillFxState['colorTheme'],
    isCrit?: boolean
  ) => {
    const activeName = soulName || activeSoul?.name || '武魂奥义';
    let theme = colorTheme;
    if (!theme) {
      if (activeName.includes('锤')) theme = 'hammer';
      else if (activeName.includes('草') || activeName.includes('皇')) theme = 'grass';
      else if (activeName.includes('虎') || activeName.includes('猫') || activeName.includes('龙')) theme = 'tiger';
      else if (activeName.includes('天使')) theme = 'angel';
      else if (activeName.includes('塔') || activeName.includes('琉璃')) theme = 'pagoda';
      else theme = 'gold';
    }

    const isPossessed = (player.godPossessionUntil || 0) > Date.now();
    const godPos = player.godPosition || null;

    setActiveSkillFx({
      id: `fx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      skillName,
      soulName: activeName,
      colorTheme: theme,
      isCrit,
      godPossessionTheme: isPossessed ? (godPos || '海神') : (godPos || null)
    });
  };

  // Equipped soul bones with active skills
  const equippedBonesWithSkills = (Object.values(player.soulBones || {}) as (SoulBone | undefined)[]).filter(
    (b): b is SoulBone => Boolean(b && b.skillName)
  );

  // Trigger floating damage
  const triggerDamageFloat = (text: string, isCrit = false, type: FloatingDamage['type'] = 'damage', targetIsPlayer = false) => {
    const id = `float_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setFloatingDamages(prev => [...prev, { id, text, isCrit, type, targetIsPlayer }]);
    setTimeout(() => {
      setFloatingDamages(prev => prev.filter(f => f.id !== id));
    }, 1200);
  };

  const triggerShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
  };

  const addLog = (actorName: string, actionText: string, type: CombatLog['type'], damageValue?: number, isCritical?: boolean) => {
    const newLog: CombatLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      turn,
      actorName,
      actionText,
      type,
      damageValue,
      isCritical
    };
    setCombatLogs(prev => [...prev.slice(-40), newLog]);
  };

  // Scroll logs to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [combatLogs]);

  // Initial greeting
  useEffect(() => {
    let diffIntro = '';
    if (difficulty === 'godlike') diffIntro = '【深红神界法则压制生效：敌方全属性获得神级激增与真身护盾！】';
    else if (difficulty === 'nightmare') diffIntro = '【修罗地狱领域生效：敌方攻击暴涨并具备吸血暴击增益！】';
    
    addLog('法阵结界', `遭遇强敌【${enemyEntity.name}】(Lv.${enemyEntity.level})！战斗正式打响！${diffIntro}`, 'buff');
  }, []);

  // AUTO BATTLE EXECUTION ENGINE
  useEffect(() => {
    if (!isAutoBattle || !isPlayerTurn || isProcessing || battleState !== 'ongoing') {
      return;
    }

    const timer = setTimeout(() => {
      // Step 1: Emergency Potion
      const hpPercent = (playerHp / playerMaxHp) * 100;
      const potionThreshold = strategy?.autoPotionHpThreshold || 35;
      if (hpPercent <= potionThreshold) {
        handleUsePotion();
        return;
      }

      // Step 2: Emergency Purify
      if (playerDebuffs.length > 0 && xuanyuCooldown === 0) {
        handleUseXuanyuPurify();
        return;
      }

      // Step 3: Domain activation
      if (strategy?.autoDomain !== false && player.hasKillingGodDomain && !isDomainActive) {
        handleActivateDomain();
        return;
      }

      // Step 4: Battle Armor Summoning
      const hasCraftedArmor = player.battleArmor && (player.battleArmor.rank !== 'none' || Object.keys(player.battleArmor.pieces || {}).length > 0 || player.battleArmor.isActive);
      if (hasCraftedArmor && armorCooldown === 0) {
        const armorTiming = strategy?.autoBattleArmor || 'instant';
        if (armorTiming === 'instant' || (armorTiming === 'low_hp' && hpPercent <= 50)) {
          handleActivateBattleArmor();
          return;
        }
      }

      // Step 5: Purple Demon Eye Control
      if (zijiCooldown === 0 && (difficulty === 'nightmare' || difficulty === 'godlike' || isEnemyEnraged)) {
        handleUseZijiShock();
        return;
      }

      // Step 6: Evaluate Skill Priority List in configured order
      const priorityList = strategy?.skillPriorityList?.filter(i => i.isEnabled) || [];

      for (const item of priorityList) {
        // Soul Skill
        if (item.type === 'soul_skill') {
          const matchSkill = activeSoul.skills.find(s => s.id === item.id || `skill_${s.ringOrder}` === item.id);
          if (matchSkill && playerMp >= matchSkill.soulPowerCost && (skillCooldowns[matchSkill.id] || 0) === 0) {
            handleUseSoulSkill(matchSkill);
            return;
          }
        }
        // Soul Tool
        if (item.type === 'soul_tool' && player.equippedSoulTool && soulToolCooldown === 0) {
          handleUseSoulTool();
          return;
        }
        // Soul Bone
        if (item.type === 'soul_bone') {
          const matchBone = equippedBonesWithSkills.find(b => b.id === item.id);
          if (matchBone && (boneCooldowns[matchBone.id] || 0) === 0) {
            handleUseBoneSkill(matchBone);
            return;
          }
        }
        // Companion
        if (item.type === 'companion') {
          const matchComp = (player.douluo4Companions || []).find(c => c.isRecruited && c.isInSquad && c.id === item.id);
          if (matchComp && (companionCooldowns[matchComp.id] || 0) === 0) {
            handleCompanionAssault(matchComp);
            return;
          }
        }
      }

      // Fallback: Use highest ready Soul Skill or Basic Attack
      const readySkill = [...activeSoul.skills].reverse().find(s => playerMp >= s.soulPowerCost && (skillCooldowns[s.id] || 0) === 0);
      if (readySkill) {
        handleUseSoulSkill(readySkill);
      } else {
        handleBasicAttack();
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [isAutoBattle, isPlayerTurn, isProcessing, battleState, playerHp, playerMp, skillCooldowns, boneCooldowns, armorCooldown, soulToolCooldown, companionCooldowns, zijiCooldown, xuanyuCooldown, playerDebuffs]);

  // TURN TRANSITION & ENEMY TURN TRIGGER
  const endPlayerTurn = () => {
    setIsPlayerTurn(false);
    setIsProcessing(false);

    // Apply DoT and Debuffs on Enemy
    let currentEnemyHp = enemyHp;
    if (enemyDebuffs.length > 0) {
      let totalDot = 0;
      const nextDebuffs: StatusEffect[] = [];

      enemyDebuffs.forEach(deb => {
        totalDot += deb.value;
        if (deb.turnsLeft > 1) {
          nextDebuffs.push({ ...deb, turnsLeft: deb.turnsLeft - 1 });
        }
      });

      if (totalDot > 0) {
        currentEnemyHp = Math.max(0, currentEnemyHp - totalDot);
        setEnemyHp(currentEnemyHp);
        triggerDamageFloat(`-${totalDot} 持续伤害`, false, 'poison', false);
        addLog(enemyEntity.name, `受到异常状态反噬，承受 ${totalDot} 点持续灼烧/中毒伤害！`, 'debuff');
      }

      setEnemyDebuffs(nextDebuffs);
    }

    if (currentEnemyHp <= 0) {
      handleVictory();
      return;
    }

    // Process Enemy Turn
    setTimeout(() => {
      executeEnemyTurn();
    }, 700);
  };

  // ENEMY ACTION AI WITH BOSS ENRAGE & DIFFICULTY MECHANICS
  const executeEnemyTurn = () => {
    if (battleState !== 'ongoing' || enemyHp <= 0) return;

    // Check if Enemy is Stunned
    const stunDebuff = enemyDebuffs.find(d => d.type === 'stun');
    if (stunDebuff) {
      addLog(enemyEntity.name, `【眩晕中】受到紫极魔瞳精神震慑瘫痪，本回合无法行动！`, 'buff');
      // Decrement cooldowns for player
      decrementCooldowns();
      setTurn(prev => prev + 1);
      setIsPlayerTurn(true);
      setIsProcessing(false);
      return;
    }

    // Check Boss Enrage Trigger
    if (!isEnemyEnraged && enemyHp <= enemyMaxHp * diffConfig.enrageThreshold) {
      setIsEnemyEnraged(true);
      SoundEngine.playThunder();
      triggerShake();
      const enrageShield = Math.floor(enemyMaxHp * 0.3);
      setEnemyShield(prev => prev + enrageShield);
      addLog(
        enemyEntity.name,
        `⚡【绝境狂暴】触发！周身血煞狂涌，获得 ${enrageShield} 点护盾并大幅提升攻击与暴击！`,
        'domain'
      );
    }

    // Calculate Enemy Attack
    const availableSkills = enemyEntity.skills || [];
    const enrageAtkMult = isEnemyEnraged ? 1.5 : 1.0;
    const shouldUseSkill = availableSkills.length > 0 && Math.random() > 0.35 && enemyMp >= 20;

    let baseDmg = 0;
    let actionDesc = '';
    const isCrit = Math.random() < (0.15 + diffConfig.critBonus + (isEnemyEnraged ? 0.2 : 0));

    if (shouldUseSkill) {
      const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
      setEnemyMp(prev => Math.max(0, prev - 20));
      baseDmg = Math.floor(scaledEnemyAtk * (skill.damageMultiplier || 1.8) * enrageAtkMult * (isCrit ? 1.6 : 1.0));
      actionDesc = `施展专属魂技【${skill.name}】！${skill.description}`;
      SoundEngine.playThunder();
      triggerShake();

      // In Nightmare/Godlike, skills apply Debuffs
      if (difficulty !== 'normal' && Math.random() < 0.45) {
        const debuffType = Math.random() < 0.5 ? 'bleed' : 'burn';
        const debuffName = debuffType === 'bleed' ? '撕裂流血' : '神火灼烧';
        const dotValue = Math.floor(playerMaxHp * 0.05);
        setPlayerDebuffs(prev => [...prev.filter(d => d.type !== debuffType), {
          id: `deb_${Date.now()}`,
          name: debuffName,
          type: debuffType,
          turnsLeft: 3,
          value: dotValue
        }]);
        addLog(enemyEntity.name, `攻击附带侵蚀效果，对您施加了【${debuffName}】(持续3回合)！`, 'debuff');
      }
    } else {
      baseDmg = Math.floor(scaledEnemyAtk * 1.15 * enrageAtkMult * (isCrit ? 1.45 : 1.0));
      actionDesc = isEnemyEnraged ? `狂暴利爪凶狠撕扯！` : `发起沉重普通打击！`;
      SoundEngine.playSlash();
    }

    // Check Player Dodge (Ghost Shadow Track)
    if (playerDodgeBuff > 0) {
      if (Math.random() < 0.35) {
        SoundEngine.playClick();
        triggerDamageFloat('完全闪避！', false, 'dodge', true);
        addLog(player.name, `施展【鬼影迷踪】，幻影残相优雅闪避了致命一击！`, 'buff');
        decrementCooldowns();
        setTurn(prev => prev + 1);
        setIsPlayerTurn(true);
        setIsProcessing(false);
        return;
      }
    }

    // Tang sect Mysterious Jade Hand & Defensive Reduction (balanced mitigation)
    const xuanyuDef = (player.tangSectSkills?.xuanyu?.level || 1) * 5;
    const finalDmg = Math.max(25, Math.floor(baseDmg - (playerStats.def * 0.28) - xuanyuDef));

    // Shield Absorption
    let remainingDmg = finalDmg;
    if (playerShield > 0) {
      if (playerShield >= remainingDmg) {
        setPlayerShield(prev => prev - remainingDmg);
        remainingDmg = 0;
      } else {
        remainingDmg -= playerShield;
        setPlayerShield(0);
      }
    }

    setPlayerHp(prev => {
      const next = Math.max(0, prev - remainingDmg);
      if (next <= 0) {
        handleDefeat();
      }
      return next;
    });

    triggerDamageFloat(`-${finalDmg}`, isCrit, 'damage', true);
    addLog(enemyEntity.name, `${actionDesc} 对您造成 ${finalDmg} 点伤害！`, 'attack', finalDmg, isCrit);

    decrementCooldowns();
    setTurn(prev => prev + 1);
    setIsPlayerTurn(true);
    setIsProcessing(false);
  };

  const decrementCooldowns = () => {
    setSkillCooldowns(prev => {
      const updated: Record<string, number> = {};
      Object.entries(prev).forEach(([k, v]) => {
        const num = typeof v === 'number' ? v : Number(v);
        if (num > 1) updated[k] = num - 1;
      });
      return updated;
    });

    setBoneCooldowns(prev => {
      const updated: Record<string, number> = {};
      Object.entries(prev).forEach(([k, v]) => {
        const num = typeof v === 'number' ? v : Number(v);
        if (num > 1) updated[k] = num - 1;
      });
      return updated;
    });

    setCompanionCooldowns(prev => {
      const updated: Record<string, number> = {};
      Object.entries(prev).forEach(([k, v]) => {
        const num = typeof v === 'number' ? v : Number(v);
        if (num > 1) updated[k] = num - 1;
      });
      return updated;
    });

    setSpiritSoulCooldowns(prev => {
      const updated: Record<string, number> = {};
      Object.entries(prev).forEach(([k, v]) => {
        const num = typeof v === 'number' ? v : Number(v);
        if (num > 1) updated[k] = num - 1;
      });
      return updated;
    });

    if (armorCooldown > 0) setArmorCooldown(prev => prev - 1);
    if (soulToolCooldown > 0) setSoulToolCooldown(prev => prev - 1);
    if (mechaCooldown > 0) setMechaCooldown(prev => prev - 1);
    if (zijiCooldown > 0) setZijiCooldown(prev => prev - 1);
    if (guiyingCooldown > 0) setGuiyingCooldown(prev => prev - 1);
    if (xuanyuCooldown > 0) setXuanyuCooldown(prev => prev - 1);
    if (playerDodgeBuff > 0) setPlayerDodgeBuff(prev => prev - 1);

    // Decrement player debuffs
    if (playerDebuffs.length > 0) {
      let totalDot = 0;
      const nextDebuffs: StatusEffect[] = [];
      playerDebuffs.forEach(deb => {
        totalDot += deb.value;
        if (deb.turnsLeft > 1) {
          nextDebuffs.push({ ...deb, turnsLeft: deb.turnsLeft - 1 });
        }
      });
      if (totalDot > 0) {
        setPlayerHp(prev => {
          const next = Math.max(0, prev - totalDot);
          if (next <= 0) {
            handleDefeat();
          }
          return next;
        });
        triggerDamageFloat(`-${totalDot}`, false, 'poison', true);
        addLog(player.name, `体内气血翻涌，受到异常侵蚀损失 ${totalDot} 点生命值！`, 'debuff');
      }
      setPlayerDebuffs(nextDebuffs);
    }
  };

  // TANG SECT ACTIVE ABILITIES
  const handleUseZijiShock = () => {
    if (!isPlayerTurn || isProcessing || zijiCooldown > 0) return;
    setIsProcessing(true);
    setZijiCooldown(4);
    SoundEngine.playThunder();
    triggerShake();

    const zijiLvl = player.tangSectSkills?.ziji?.level || 1;
    const shockDmg = Math.floor(playerStats.atk * 1.1 + zijiLvl * 45);

    setEnemyDebuffs(prev => [...prev.filter(d => d.type !== 'stun'), {
      id: `stun_${Date.now()}`,
      name: '紫极神光眩晕',
      type: 'stun',
      turnsLeft: 1,
      value: 0
    }]);

    triggerSkillFx('紫极魔瞳 · 精神震慑', '唐门绝技', 'purple', true);
    applyDamageToEnemy(
      shockDmg,
      true,
      `${player.name} 双眸金紫光华大放！施展【紫极魔瞳 · 精神震慑】！直击敌方精神之海造成 ${shockDmg} 点真实精神伤害并使其眩晕！`
    );
  };

  const handleUseGuiyingDodge = () => {
    if (!isPlayerTurn || isProcessing || guiyingCooldown > 0) return;
    setIsProcessing(true);
    setGuiyingCooldown(4);
    setPlayerDodgeBuff(2);
    SoundEngine.playClick();

    triggerSkillFx('鬼影迷踪 · 虚幻步伐', '唐门绝技', 'purple', false);
    addLog(player.name, `施展【唐门绝技 · 鬼影迷踪】！步伐虚幻如鬼魅，下一回合获得 35% 灵巧闪避率！`, 'buff');
    setTimeout(() => endPlayerTurn(), 450);
  };

  const handleUseXuanyuPurify = () => {
    if (!isPlayerTurn || isProcessing || xuanyuCooldown > 0) return;
    setIsProcessing(true);
    setXuanyuCooldown(3);
    setPlayerDebuffs([]);
    const shieldGain = Math.floor(playerMaxHp * 0.18 + playerStats.def * 1.5);
    setPlayerShield(prev => prev + shieldGain);
    SoundEngine.playSkill();
    triggerDamageFloat(`净化+${shieldGain}护盾`, false, 'shield', true);

    triggerSkillFx('玄玉手 · 御之壁', '唐门绝技', 'grass', false);
    addLog(player.name, `双掌凝如寒玉！运转【玄玉手 · 御之壁】，瞬间净化全身负面状态并获得 ${shieldGain} 点玄玉护盾！`, 'heal');
    setTimeout(() => endPlayerTurn(), 500);
  };

  // BASIC ATTACK & SKILLS
  const handleBasicAttack = () => {
    if (!isPlayerTurn || isProcessing) return;
    setIsProcessing(true);
    SoundEngine.playSlash();

    const isCrit = Math.random() < ((playerStats.critRate + (player.tangSectSkills?.ziji?.level || 1) * 1.5) / 100);
    const critMult = isCrit ? (1 + (playerStats.critDmg || 50) / 100) : 1.0;
    const avatarMult = isAvatarActive ? 1.25 : 1.0;
    const domainMult = isDomainActive ? 1.1 : 1.0;

    const rawAtk = playerStats.atk * critMult * avatarMult * domainMult;
    const finalDmg = Math.max(15, Math.floor(rawAtk * 0.75 - scaledEnemyDef * 0.45));

    triggerSkillFx('近身重击', activeSoul.name, undefined, isCrit);
    applyDamageToEnemy(finalDmg, isCrit, `${player.name} 驭动 ${activeSoul.name} 发动近身普通打击！`);
  };

  const handleUseSoulSkill = (skill: SoulSkill) => {
    if (!isPlayerTurn || isProcessing) return;
    if (playerMp < skill.soulPowerCost) {
      addLog('魂力不足', `释放【${skill.name}】需要消耗 ${skill.soulPowerCost} 点魂力！`, 'buff');
      return;
    }
    if ((skillCooldowns[skill.id] || 0) > 0) {
      addLog('技能冷却中', `【${skill.name}】尚在冷却中 (剩余 ${skillCooldowns[skill.id]} 回合)！`, 'buff');
      return;
    }

    setIsProcessing(true);
    setPlayerMp(prev => prev - skill.soulPowerCost);
    setSkillCooldowns(prev => ({ ...prev, [skill.id]: skill.cooldown }));

    const isPossessed = (player.godPossessionUntil || 0) > Date.now();
    if (player.godPosition || isPossessed) {
      SoundEngine.playDivineDeclaration(player.godPosition || '海神', skill.name);
    } else if (skill.animationType === 'lightning') {
      SoundEngine.playThunder();
    } else if (skill.animationType === 'smash') {
      SoundEngine.playSmash();
      triggerShake();
    } else {
      SoundEngine.playSlash();
    }

    if (skill.isAvatar) {
      setIsAvatarActive(true);
      setPlayerShield(prev => prev + Math.floor(playerMaxHp * 0.22));
      SoundEngine.playSoulRingAura('gold');
      triggerSkillFx('武魂真身 · 绝世降临', activeSoul.name, 'gold', true);
      addLog(player.name, `【第七魂技 · 武魂真身】降临！激发武魂真意，获得 25% 属性强化与真身护盾！`, 'buff');
      setTimeout(() => endPlayerTurn(), 500);
      return;
    }

    const isCrit = Math.random() < ((playerStats.critRate + 8) / 100);
    const critMult = isCrit ? (1 + (playerStats.critDmg || 50) / 100) : 1.0;
    const avatarMult = isAvatarActive ? 1.25 : 1.0;
    const domainMult = isDomainActive ? 1.15 : 1.0;

    const mult = (skill.damageMultiplier || 1.8) * 0.75;
    const rawAtk = playerStats.atk * mult * critMult * avatarMult * domainMult;
    const finalDmg = Math.max(20, Math.floor(rawAtk * 0.8 - scaledEnemyDef * 0.4));

    triggerSkillFx(skill.name, activeSoul.name, undefined, isCrit);
    applyDamageToEnemy(finalDmg, isCrit, `${player.name} 施展【${skill.name}】！${skill.description}`);
  };

  const handleUseHiddenWeapon = (weapon: HiddenWeapon) => {
    if (!isPlayerTurn || isProcessing || weapon.quantity <= 0) return;

    setIsProcessing(true);
    SoundEngine.playSmash();
    triggerShake();

    setHiddenWeaponInventory(prev => prev.map(w => w.id === weapon.id ? { ...w, quantity: w.quantity - 1 } : w));

    let finalDmg = Math.floor(weapon.damage * 0.65);
    if (weapon.rank === 'god') {
      finalDmg = Math.floor(weapon.damage * 0.85);
      SoundEngine.playThunder();
    }

    triggerDamageFloat(`-${finalDmg}`, true, 'gold', false);
    triggerSkillFx(`暗器 · ${weapon.name}`, '唐门暗器', 'gold', true);
    applyDamageToEnemy(finalDmg, true, `${player.name} 掷出唐门机括暗器【${weapon.name}】！机簧炸裂，破空穿刺！`);
  };

  const handleUseBoneSkill = (bone: SoulBone) => {
    if (!isPlayerTurn || isProcessing || (boneCooldowns[bone.id] || 0) > 0) return;

    setIsProcessing(true);
    setBoneCooldowns(prev => ({ ...prev, [bone.id]: bone.skillCooldown || 3 }));
    SoundEngine.playSmash();
    triggerShake();

    const dmg = Math.floor((bone.atkBonus * 0.6 + player.level * 6) * 1.8);
    triggerSkillFx(bone.skillName || '魂骨神技', bone.name, 'gold', true);
    applyDamageToEnemy(dmg, true, `${player.name} 引动【${bone.name}】魂技【${bone.skillName}】！`);
  };

  const handleActivateBattleArmor = () => {
    if (!isPlayerTurn || isProcessing || armorCooldown > 0 || !player.battleArmor) return;

    setIsProcessing(true);
    setArmorCooldown(4);
    setIsBattleArmorActive(true);
    SoundEngine.playSkill();
    triggerShake();

    const rankMeta = BATTLE_ARMOR_RANKS.find(r => r.rank === player.battleArmor?.rank);
    const armorCustomName = player.battleArmor.customName || '龙皇';
    const armorRankTitle = player.battleArmor.rankTitle || rankMeta?.title || '一字斗铠';
    const skillName = player.battleArmor.activeSkillName || rankMeta?.skillName || `${armorCustomName}·神御降世`;

    const piecesList = Object.values(player.battleArmor?.pieces || {}).filter(Boolean) as any[];
    const pieceAtk: number = piecesList.reduce((sum: number, p: any): number => sum + (Number(p?.atkBonus) || 0), 0);
    const pieceDef: number = piecesList.reduce((sum: number, p: any): number => sum + (Number(p?.defBonus) || 0), 0);

    const rankMult: number = Number(rankMeta?.multiplier) || 1.3;
    const shieldBonus: number = Math.max(300, Math.floor(playerMaxHp * 0.2 + (playerStats.def + pieceDef) * 1.2));
    setPlayerShield(prev => prev + shieldBonus);
    triggerDamageFloat(`斗铠护盾+${shieldBonus}`, false, 'shield', true);

    const critMult: number = 1 + (Number(playerStats.critDmg) || 50) / 100;
    const baseDamage: number = (playerStats.atk * 1.6 + pieceAtk * 2.0 + player.level * 15) * rankMult;
    const calculatedDmg: number = Math.max(100, Math.floor(baseDamage * critMult * 0.7));

    triggerSkillFx(skillName, armorRankTitle, 'angel', true);
    applyDamageToEnemy(
      calculatedDmg,
      true,
      `${player.name} 全身斗铠共鸣显化！引爆【${armorRankTitle} · ${armorCustomName}】神套合击【${skillName}】！生成 ${shieldBonus} 点护盾！`
    );
  };

  const handleUseSoulTool = () => {
    if (!isPlayerTurn || isProcessing || soulToolCooldown > 0 || !player.equippedSoulTool) return;
    const tool = player.equippedSoulTool;

    setIsProcessing(true);
    setSoulToolCooldown(3);
    SoundEngine.playThunder();
    triggerShake();

    if (tool.category === 'defense') {
      const shieldVal = Math.floor(playerMaxHp * 0.25);
      setPlayerShield(prev => prev + shieldVal);
      triggerDamageFloat(`+${shieldVal} 无敌护罩`, false, 'shield', true);
      triggerSkillFx(tool.name, '高能魂导器', 'pagoda', false);
      addLog(player.name, `激活【${tool.name}】！展开防御力场，获得 ${shieldVal} 点护盾！`, 'buff');
      setTimeout(() => endPlayerTurn(), 600);
    } else {
      const toolDmg = Math.floor(tool.tierLevel * 350 + player.level * 12);
      triggerSkillFx(tool.name, '高能魂导器', 'pagoda', true);
      applyDamageToEnemy(toolDmg, true, `${player.name} 扣动【${tool.name}】扳机！高能魂力光束贯穿全场！`);
    }
  };

  const handleCompanionAssault = (companion: any) => {
    if (!isPlayerTurn || isProcessing || (companionCooldowns[companion.id] || 0) > 0) return;

    setIsProcessing(true);
    setCompanionCooldowns(prev => ({ ...prev, [companion.id]: 3 }));
    SoundEngine.playSkill();
    triggerShake();

    const compSkill = companion.skills[0];
    const compDmg = Math.floor(companion.baseAtk * 1.5 + player.level * 10);
    triggerSkillFx(compSkill.name, companion.name, 'tiger', true);
    applyDamageToEnemy(compDmg, true, `战队伙伴【${companion.name}】协同突击！施展成名绝技【${compSkill.name}】！`);
  };

  const handleSpiritSoulSkill = (soul: any) => {
    if (!isPlayerTurn || isProcessing || (spiritSoulCooldowns[soul.id] || 0) > 0) return;

    setIsProcessing(true);
    setSpiritSoulCooldowns(prev => ({ ...prev, [soul.id]: soul.spiritSkill.cooldownTurns || 3 }));
    SoundEngine.playBreakthrough();
    triggerShake();

    const mult = (soul.spiritSkill.damageMultiplier || 3.0) * 0.55;
    const baseAtk = activeSoul.baseAtk + player.level * 8 + ((soul.statsBonus?.atk || 0) * 0.5);
    const dmg = Math.floor(baseAtk * mult);

    if (soul.spiritSkill.healAmount) {
      const healAmt = Math.floor(soul.spiritSkill.healAmount * 0.6);
      setPlayerHp(prev => Math.min(playerMaxHp, prev + healAmt));
      triggerDamageFloat(`+${healAmt} 治疗`, false, 'heal', true);
    }
    if (soul.spiritSkill.shieldAmount) {
      const shieldAmt = Math.floor(soul.spiritSkill.shieldAmount * 0.6);
      setPlayerShield(prev => prev + shieldAmt);
      triggerDamageFloat(`魂灵护盾+${shieldAmt}`, false, 'shield', true);
    }

    triggerSkillFx(soul.spiritSkill.name, soul.name, 'grass', true);
    applyDamageToEnemy(dmg, true, `❄️ 契约魂灵【${soul.name}】显灵！施放魂技【${soul.spiritSkill.name}】！`);
  };

  const handleMechaWeapon = (mecha: any) => {
    if (!isPlayerTurn || isProcessing || mechaCooldown > 0) return;

    setIsProcessing(true);
    setMechaCooldown(mecha.mechaWeapon.cooldown || 3);
    SoundEngine.playThunder();
    triggerShake();

    const mult = (mecha.mechaWeapon.dmgMultiplier || 3.5) * 0.55;
    const dmg = Math.floor((activeSoul.baseAtk + (mecha.combatStats.atk * 0.5) + player.level * 10) * mult);

    if (mecha.combatStats.shield) {
      const shieldGain = Math.floor(mecha.combatStats.shield * 0.15);
      setPlayerShield(prev => prev + shieldGain);
      triggerDamageFloat(`机甲护甲+${shieldGain}`, false, 'shield', true);
    }

    triggerSkillFx(mecha.mechaWeapon.name, mecha.name, 'hammer', true);
    applyDamageToEnemy(dmg, true, `🤖 出动【${mecha.name}】机甲！轰射【${mecha.mechaWeapon.name}】！`);
  };

  const handleActivateDomain = () => {
    if (isDomainActive || !isPlayerTurn || isProcessing) return;
    setIsDomainActive(true);
    SoundEngine.playSoulRingAura('red');
    triggerSkillFx('杀神 / 海神领域', '神级领域', 'red', true);
    addLog(player.name, `【杀神 / 海神领域】展开！神光笼罩战场，压制敌方15%攻击力并强化我方！`, 'domain');
  };

  const handleUsePotion = () => {
    if (!isPlayerTurn || isProcessing) return;
    const healVal = Math.floor(playerMaxHp * 0.25);
    setPlayerHp(prev => Math.min(playerMaxHp, prev + healVal));
    triggerDamageFloat(`+${healVal} 回复`, false, 'heal', true);
    addLog(player.name, `服下九宝回魂丹，瞬间愈合周身伤势并回复 ${healVal} 点生命值！`, 'heal');
    endPlayerTurn();
  };

  const applyDamageToEnemy = (dmg: number, isCrit: boolean, logText: string) => {
    const safeDmg = (typeof dmg !== 'number' || !Number.isFinite(dmg) || isNaN(dmg) || dmg <= 0)
      ? Math.max(50, Math.floor(playerStats.atk * 1.5))
      : Math.floor(dmg);

    // Shield absorption for Enemy
    let remainingDmg = safeDmg;
    if (enemyShield > 0) {
      if (enemyShield >= remainingDmg) {
        setEnemyShield(prev => prev - remainingDmg);
        remainingDmg = 0;
      } else {
        remainingDmg -= enemyShield;
        setEnemyShield(0);
      }
    }

    triggerDamageFloat(`-${safeDmg}`, isCrit, 'damage', false);
    addLog(player.name, `${logText} 造成 ${safeDmg} 点伤害！`, 'attack', safeDmg, isCrit);

    setEnemyHp(prev => {
      const currentHp = (typeof prev !== 'number' || isNaN(prev)) ? enemyMaxHp : prev;
      const next = Math.max(0, currentHp - remainingDmg);
      if (next <= 0) {
        handleVictory();
      } else {
        setTimeout(() => endPlayerTurn(), 500);
      }
      return next;
    });
  };

  const handleVictory = () => {
    setBattleState('victory');
    SoundEngine.playVictory();

    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch {}

    const baseExp = enemyEntity.level * 160 + 200;
    const baseGold = enemyEntity.level * 90 + 100;
    const rewardExp = Math.floor(baseExp * diffConfig.rewardMult);
    const rewardGold = Math.floor(baseGold * diffConfig.rewardMult);

    const bonusText = difficulty !== 'normal' ? ` (含【${diffConfig.name}】x${diffConfig.rewardMult} 难度加成)` : '';
    addLog('战斗胜利', `大获全胜！成功击败【${enemyEntity.name}】！获得 ${rewardExp} 点经验值与 ${rewardGold} 金魂币！${bonusText}`, 'buff');

    setTimeout(() => {
      onVictory(rewardExp, rewardGold, [], enemyEntity);
    }, 2200);
  };

  const handleDefeat = () => {
    setBattleState('defeat');
    addLog('战斗败北', `魂力耗尽，被迫撤退回城调养生息...`, 'death');
    setTimeout(() => {
      onDefeat();
    }, 2200);
  };

  return (
    <div className={`relative w-full max-w-5xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-4 md:p-6 text-slate-100 shadow-2xl overflow-hidden ${screenShake ? 'animate-bounce' : ''}`}>
      
      {/* Martial Soul Skill SVG Path Animation Overlay */}
      <MartialSoulSkillFxOverlay activeFx={activeSkillFx} onAnimationComplete={() => setActiveSkillFx(null)} />

      {/* Background Arena Theme Aura */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      {isDomainActive && (
        <div className="absolute inset-0 bg-red-950/20 border-2 border-red-500/40 pointer-events-none animate-pulse" />
      )}
      {isEnemyEnraged && (
        <div className="absolute inset-0 bg-rose-950/25 pointer-events-none animate-pulse" />
      )}

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-3 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <Swords className="w-5 h-5 text-amber-400" />
          <h2 className="font-bold text-base md:text-lg text-amber-300">{combatTitle}</h2>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${diffConfig.badgeClass}`}>
            {diffConfig.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-slate-300">
            第 <strong className="text-amber-400">{turn}</strong> 回合
          </span>
          {onEscape && (
            <button
              onClick={onEscape}
              className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-full border border-slate-700 transition-colors"
            >
              撤退脱离
            </button>
          )}
        </div>
      </div>

      {/* DUAL COMBATANTS BATTLEFIELD */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
        
        {/* PLAYER SIDE */}
        <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          {/* Floating Damage Render */}
          {floatingDamages.filter(f => f.targetIsPlayer).map(f => (
            <div
              key={f.id}
              className={`absolute top-8 left-1/2 -translate-x-1/2 z-30 font-black text-xl md:text-2xl animate-bounce drop-shadow-md ${
                f.type === 'heal' ? 'text-emerald-400' :
                f.type === 'shield' ? 'text-cyan-300' :
                f.type === 'dodge' ? 'text-sky-300' : 'text-rose-500'
              }`}
            >
              {f.text} {f.isCrit && '★暴击!'}
            </div>
          ))}

          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 via-indigo-500 to-amber-400 border-2 border-blue-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)] overflow-hidden">
                <img
                  src={player.avatarUrl || DEFAULT_AVATAR_URL}
                  alt={player.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              {isAvatarActive && (
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-amber-500 text-slate-950 rounded-full text-[10px] font-black animate-pulse shadow-md">
                  真身
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-slate-100">{player.name}</span>
                <span className="text-xs text-amber-400 font-semibold">Lv.{player.level} {activeSoul.name}</span>
              </div>

              {/* HP Bar */}
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-500" /> 生命值 (HP)</span>
                  <span>{playerHp} / {playerMaxHp}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-600 to-red-400 h-full transition-all duration-300"
                    style={{ width: `${Math.max(0, (playerHp / playerMaxHp) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Soul Power (MP) Bar */}
              <div className="mt-1.5 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-cyan-400" /> 魂力值 (MP)</span>
                  <span>{playerMp} / {playerMaxMp}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                    style={{ width: `${Math.max(0, (playerMp / playerMaxMp) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Shields & Buffs */}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {playerShield > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" /> 护盾: {playerShield}
                  </span>
                )}
                {playerDodgeBuff > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/40 text-sky-300 flex items-center gap-1">
                    <Wind className="w-2.5 h-2.5" /> 鬼影迷踪 (闪避)
                  </span>
                )}
                {playerDebuffs.map(d => (
                  <span key={d.id} className="text-[10px] px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 flex items-center gap-1 animate-pulse">
                    <AlertOctagon className="w-2.5 h-2.5" /> {d.name} ({d.turnsLeft}回合)
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Soul Rings Display */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <SoulRingsDisplay
              rings={activeSoul.skills.map(s => ({ years: s.ringYears, color: s.ringColor }))}
              size="sm"
            />
            <div className="text-right text-xs text-slate-400">
              <div>攻击: <strong className="text-rose-400">{playerStats.atk}</strong></div>
              <div>防御: <strong className="text-blue-400">{playerStats.def}</strong></div>
            </div>
          </div>
        </div>

        {/* ENEMY SIDE */}
        <div className={`bg-slate-900/90 border rounded-2xl p-4 shadow-lg relative overflow-hidden transition-all ${
          isEnemyEnraged ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.4)]' : 'border-rose-500/30'
        }`}>
          {/* Floating Damage Render */}
          {floatingDamages.filter(f => !f.targetIsPlayer).map(f => (
            <div
              key={f.id}
              className={`absolute top-8 left-1/2 -translate-x-1/2 z-30 font-black text-xl md:text-2xl animate-bounce drop-shadow-md ${
                f.type === 'gold' ? 'text-amber-300' : 'text-yellow-300'
              }`}
            >
              {f.text} {f.isCrit && '★暴击!'}
            </div>
          ))}

          <div className="flex items-center gap-3">
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-lg text-white shadow-lg relative ${
              isEnemyEnraged
                ? 'bg-gradient-to-tr from-red-600 to-amber-600 border-yellow-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.8)]'
                : 'bg-gradient-to-tr from-red-600 to-rose-900 border-rose-400'
            }`}>
              <Skull className="w-8 h-8 text-rose-200" />
              {isEnemyEnraged && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-black animate-bounce shadow">
                  狂暴
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                  {enemyEntity.name}
                  {isEnemyEnraged && <Flame className="w-4 h-4 text-red-500 animate-pulse" />}
                </span>
                <span className="text-xs text-rose-400 font-semibold">Lv.{enemyEntity.level}</span>
              </div>

              {/* Enemy HP Bar */}
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-500" /> 生命值 (HP)</span>
                  <span>{enemyHp} / {enemyMaxHp}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isEnemyEnraged
                        ? 'bg-gradient-to-r from-red-600 via-rose-500 to-yellow-400'
                        : 'bg-gradient-to-r from-red-600 to-amber-500'
                    }`}
                    style={{ width: `${Math.max(0, (enemyHp / enemyMaxHp) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Enemy Stats & Shields */}
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
                <span>攻击: {Math.floor(scaledEnemyAtk * (isEnemyEnraged ? 1.5 : 1.0))}</span>
                <span>防御: {scaledEnemyDef}</span>
                <span>速度: {enemyEntity.speed}</span>
              </div>

              {/* Enemy Debuffs & Shields indicator */}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {enemyShield > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" /> 护盾: {enemyShield}
                  </span>
                )}
                {enemyDebuffs.map(d => (
                  <span key={d.id} className="text-[10px] px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-purple-400" /> {d.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Enemy Soul Rings */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <SoulRingsDisplay rings={enemyEntity.soulRings || []} size="sm" />
            <div className="text-xs text-rose-400 font-medium">
              {isEnemyEnraged ? '🔥 绝境狂暴状态' : enemyEntity.isPlayer ? '魂师切磋' : '凶兽领主'}
            </div>
          </div>
        </div>

      </div>

      {/* COMBAT LOG WINDOW */}
      <div
        ref={logContainerRef}
        className="relative z-10 bg-slate-900/70 border border-slate-800 rounded-xl p-3 my-3 h-28 overflow-y-auto font-mono text-xs space-y-1 scrollbar-thin"
      >
        {combatLogs.map(log => (
          <div
            key={log.id}
            className={`flex items-start gap-1.5 ${
              log.type === 'buff' ? 'text-amber-300' :
              log.type === 'heal' ? 'text-emerald-400' :
              log.type === 'domain' ? 'text-purple-300 font-bold' :
              log.type === 'death' ? 'text-red-500 font-bold' :
              log.type === 'debuff' ? 'text-rose-400 font-semibold' :
              'text-slate-300'
            }`}
          >
            <span className="text-slate-500 shrink-0">[{log.actorName}]:</span>
            <span>{log.actionText}</span>
          </div>
        ))}
      </div>

      {/* ACTION COMMAND CENTER */}
      {battleState === 'ongoing' && (
        <div className="relative z-10 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`w-2.5 h-2.5 rounded-full ${isPlayerTurn ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
              <span className="font-bold text-xs text-slate-200">
                {isAutoBattle
                  ? '【托管自动战斗中】正在依策略优先级释放魂技...'
                  : isPlayerTurn
                  ? '请选择魂师行动指令:'
                  : '敌方正在蓄力行动...'}
              </span>

              {isAutoBattle && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                  {strategy?.tacticalStance === 'control' ? '❄️ 控制压制姿态' :
                   strategy?.tacticalStance === 'sustain' ? '🛡️ 持续防御姿态' :
                   strategy?.tacticalStance === 'combo' ? '👥 战队连招姿态' :
                   strategy?.tacticalStance === 'custom' ? '⚙️ 自定义优先级' : '⚡ 极致爆发姿态'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
              {/* Auto Battle Toggle Switch */}
              <button
                onClick={() => {
                  SoundEngine.playClick();
                  setIsAutoBattle(prev => !prev);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isAutoBattle
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 border-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>{isAutoBattle ? '自动战斗 (开启)' : '自动战斗 (关闭)'}</span>
              </button>

              {player.hasKillingGodDomain && !isDomainActive && (
                <button
                  onClick={handleActivateDomain}
                  disabled={!isPlayerTurn || isProcessing}
                  className="px-3 py-1 bg-red-900/60 hover:bg-red-800 border border-red-500/50 text-red-200 rounded-lg text-xs font-bold transition-transform active:scale-95 disabled:opacity-50"
                >
                  释放杀神领域
                </button>
              )}
              <button
                onClick={handleUsePotion}
                disabled={!isPlayerTurn || isProcessing}
                className="px-3 py-1 bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/50 text-emerald-200 rounded-lg text-xs font-bold transition-transform active:scale-95 disabled:opacity-50"
              >
                服用回魂丹
              </button>
            </div>
          </div>

          {/* BASIC ATTACK & SOUL SKILLS ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
            
            {/* Basic Attack Button */}
            <button
              onClick={handleBasicAttack}
              disabled={!isPlayerTurn || isProcessing}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-left transition-all active:scale-95 disabled:opacity-50 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-100">普通打击</span>
                <Swords className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-400 mt-1">无消耗基础攻击</span>
            </button>

            {/* Soul Skills (1 ~ 9) */}
            {activeSoul.skills.map((skill) => {
              const cd = skillCooldowns[skill.id] || 0;
              const hasMp = playerMp >= skill.soulPowerCost;
              const disabled = !isPlayerTurn || isProcessing || cd > 0 || !hasMp;

              return (
                <button
                  key={skill.id}
                  onClick={() => handleUseSoulSkill(skill)}
                  disabled={disabled}
                  className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 relative overflow-hidden flex flex-col justify-between ${
                    skill.ringColor === 'red' ? 'border-red-500/60 bg-red-950/40 hover:bg-red-900/60' :
                    skill.ringColor === 'black' ? 'border-neutral-900 bg-neutral-950/80 hover:bg-neutral-900' :
                    skill.ringColor === 'purple' ? 'border-purple-500/60 bg-purple-950/40 hover:bg-purple-900/60' :
                    'border-amber-500/60 bg-amber-950/40 hover:bg-amber-900/60'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-300 truncate max-w-[100px]">{skill.name}</span>
                    <span className="text-[10px] text-cyan-400 font-semibold">{skill.soulPowerCost}魂力</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {cd > 0 ? `冷却中 (${cd}回合)` : skill.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* TACTICAL TANG SECT MARTIAL ARTS ROW */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-purple-300 font-bold flex items-center gap-1 mr-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> 唐门绝学:
            </span>

            {/* Ziji Shock */}
            <button
              onClick={handleUseZijiShock}
              disabled={!isPlayerTurn || isProcessing || zijiCooldown > 0}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border border-purple-400/60 rounded-lg text-xs font-bold text-purple-200 hover:brightness-125 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md"
            >
              <Eye className="w-3.5 h-3.5 text-purple-300" />
              <span>紫极魔瞳·震慑</span>
              {zijiCooldown > 0 && <span className="text-rose-400 text-[10px]">({zijiCooldown}冷却)</span>}
            </button>

            {/* Guiying Dodge */}
            <button
              onClick={handleUseGuiyingDodge}
              disabled={!isPlayerTurn || isProcessing || guiyingCooldown > 0}
              className="px-3 py-1.5 bg-gradient-to-r from-sky-950 to-blue-950 border border-sky-400/60 rounded-lg text-xs font-bold text-sky-200 hover:brightness-125 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md"
            >
              <Wind className="w-3.5 h-3.5 text-sky-300" />
              <span>鬼影迷踪·步法</span>
              {guiyingCooldown > 0 && <span className="text-rose-400 text-[10px]">({guiyingCooldown}冷却)</span>}
            </button>

            {/* Xuanyu Purify */}
            <button
              onClick={handleUseXuanyuPurify}
              disabled={!isPlayerTurn || isProcessing || xuanyuCooldown > 0}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-400/60 rounded-lg text-xs font-bold text-emerald-200 hover:brightness-125 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>玄玉手·净体</span>
              {xuanyuCooldown > 0 && <span className="text-rose-400 text-[10px]">({xuanyuCooldown}冷却)</span>}
            </button>
          </div>

          {/* SECONDARY ROW: BATTLE ARMOR, SOUL TOOLS, COMPANIONS, SOUL BONES & HIDDEN WEAPONS */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
            
            {/* Battle Armor Invocations */}
            {player.battleArmor && (
              <button
                onClick={handleActivateBattleArmor}
                disabled={!isPlayerTurn || isProcessing || armorCooldown > 0}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 border border-amber-300/60 rounded-lg text-xs font-bold text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>【{player.battleArmor.rankTitle || '斗铠'}】神御共鸣</span>
                {armorCooldown > 0 && <span className="text-slate-900 text-[10px]">({armorCooldown}冷却)</span>}
              </button>
            )}

            {/* Soul Tool Trigger */}
            {player.equippedSoulTool && (
              <button
                onClick={handleUseSoulTool}
                disabled={!isPlayerTurn || isProcessing || soulToolCooldown > 0}
                className="px-3 py-1.5 bg-gradient-to-r from-sky-900/80 to-blue-900/80 border border-sky-400/60 rounded-lg text-xs font-bold text-sky-200 hover:brightness-125 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md"
              >
                <Zap className="w-3.5 h-3.5 text-sky-300" />
                <span>{player.equippedSoulTool.name}</span>
                {soulToolCooldown > 0 && <span className="text-rose-400 text-[10px]">({soulToolCooldown}冷却)</span>}
              </button>
            )}

            {/* Douluo 4 Squad Companions Quick Strike */}
            {(player.douluo4Companions || []).filter(c => c.isRecruited && c.isInSquad).map(comp => {
              const cCd = companionCooldowns[comp.id] || 0;
              return (
                <button
                  key={comp.id}
                  onClick={() => handleCompanionAssault(comp)}
                  disabled={!isPlayerTurn || isProcessing || cCd > 0}
                  className="px-3 py-1.5 bg-gradient-to-r from-indigo-950 to-blue-950 border border-sky-500/50 rounded-lg text-xs font-bold text-sky-200 hover:border-sky-400 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-sky-400/30 text-sky-300 font-black text-[9px] flex items-center justify-center">
                    {comp.name.slice(0, 1)}
                  </span>
                  <span>{comp.name} · 协战</span>
                  {cCd > 0 && <span className="text-rose-400 text-[10px]">({cCd}冷却)</span>}
                </button>
              );
            })}

            {/* Soul Bone Skills */}
            {equippedBonesWithSkills.map(bone => (
              <button
                key={bone.id}
                onClick={() => handleUseBoneSkill(bone)}
                disabled={!isPlayerTurn || isProcessing || (boneCooldowns[bone.id] || 0) > 0}
                className="px-3 py-1.5 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-purple-500/50 rounded-lg text-xs font-semibold text-purple-200 hover:brightness-125 disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{bone.skillName}</span>
                {(boneCooldowns[bone.id] || 0) > 0 && <span className="text-rose-400 text-[10px]">({boneCooldowns[bone.id]}冷却)</span>}
              </button>
            ))}

            {/* Spirit Souls */}
            {(player.spiritPagoda?.spiritSouls || [])
              .filter(s => s.isContracted && (player.spiritPagoda?.activeBattlingSoulIds || []).includes(s.id))
              .map(soul => {
                const sCd = spiritSoulCooldowns[soul.id] || 0;
                return (
                  <button
                    key={soul.id}
                    onClick={() => handleSpiritSoulSkill(soul)}
                    disabled={!isPlayerTurn || isProcessing || sCd > 0}
                    className="px-3 py-1.5 bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-400/60 rounded-lg text-xs font-bold text-emerald-200 hover:border-emerald-300 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <span className="text-xs">{soul.icon}</span>
                    <span>{soul.name} · {soul.spiritSkill.name}</span>
                    {sCd > 0 && <span className="text-rose-400 text-[10px]">({sCd}冷却)</span>}
                  </button>
                );
              })}

            {/* Equipped Mecha Heavy Cannon */}
            {player.spiritPagoda?.activeMechaId && (() => {
              const activeMecha = player.spiritPagoda.craftedMechas?.find(m => m.id === player.spiritPagoda?.activeMechaId && m.isCrafted);
              if (!activeMecha) return null;
              return (
                <button
                  onClick={() => handleMechaWeapon(activeMecha)}
                  disabled={!isPlayerTurn || isProcessing || mechaCooldown > 0}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-400/70 rounded-lg text-xs font-bold text-purple-200 hover:border-purple-300 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Bot className="w-3.5 h-3.5 text-purple-300" />
                  <span>【{activeMecha.name}】{activeMecha.mechaWeapon.name}</span>
                  {mechaCooldown > 0 && <span className="text-rose-400 text-[10px]">({mechaCooldown}冷却)</span>}
                </button>
              );
            })()}

            {/* Hidden Weapons Quick Throw */}
            {hiddenWeaponInventory.filter(w => w.quantity > 0).map(weapon => (
              <button
                key={weapon.id}
                onClick={() => handleUseHiddenWeapon(weapon)}
                disabled={!isPlayerTurn || isProcessing}
                className="px-3 py-1.5 bg-amber-950/60 border border-amber-500/50 rounded-lg text-xs font-semibold text-amber-300 hover:bg-amber-900/60 disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                <span>{weapon.name} ({weapon.quantity}枚)</span>
              </button>
            ))}
          </div>

        </div>
      )}

      {/* VICTORY OVERLAY */}
      {battleState === 'victory' && (
        <div className="relative z-20 py-8 text-center space-y-4 bg-slate-900/90 border border-amber-500/50 rounded-2xl my-4 animate-fade-in">
          <Award className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
          <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
            战斗大获全胜！
          </h3>
          <p className="text-sm text-slate-300">
            在【{diffConfig.name}】难度下斩获无双战功！正在结算战利品 (经验与金魂币 x{diffConfig.rewardMult})...
          </p>
        </div>
      )}

      {/* DEFEAT OVERLAY */}
      {battleState === 'defeat' && (
        <div className="relative z-20 py-8 text-center space-y-4 bg-slate-900/90 border border-red-500/50 rounded-2xl my-4">
          <Skull className="w-16 h-16 text-red-500 mx-auto" />
          <h3 className="text-2xl font-black text-rose-500">战斗憾负</h3>
          <p className="text-sm text-slate-400">对手实力过于强悍，已安全撤回修养，请提升战力后再来挑战！</p>
        </div>
      )}

    </div>
  );
};
