import React, { useState, useEffect } from 'react';
import { Player, TangSectSkill, HiddenWeapon } from '../types/game';
import { 
  TangSectState, 
  SectHall, 
  SectTradeOffer, 
  SectChallengeLetter,
  SectHallType 
} from '../types/sect';
import { 
  CRAFTABLE_HIDDEN_WEAPONS, 
  SECT_LEVEL_DATA, 
  INITIAL_SECT_HALLS, 
  SECT_TRADE_VISITORS_POOL, 
  SECT_CHALLENGE_LETTERS_POOL,
  createInitialTangSectState 
} from '../data/tangSect';
import { SoundEngine } from '../utils/audio';
import { calculatePlayerStats } from '../utils/saveManager';
import confetti from 'canvas-confetti';
import { 
  Building2, Shield, Hammer, Eye, Wind, Zap, Sparkles, 
  Crosshair, ScrollText, Swords, Handshake, Crown, Users, 
  Coins, ArrowUpCircle, CheckCircle2, AlertTriangle, RefreshCw,
  Flame, Skull, Trophy, ChevronRight, Gem, ShieldAlert, Award
} from 'lucide-react';

interface TangSectForgeViewProps {
  player: Player;
  onUpdatePlayer: (updater: (prev: Player) => Player) => void;
  showToast?: (msg: string, type?: 'success' | 'warning' | 'info') => void;
  onNavigateToGathering?: () => void;
  // Legacy props
  onUpdateTangSectSkills?: (skills: Player['tangSectSkills']) => void;
  onUpdateHiddenWeapons?: (weapons: HiddenWeapon[], costGold: number) => void;
}

export const TangSectForgeView: React.FC<TangSectForgeViewProps> = ({
  player,
  onUpdatePlayer,
  showToast,
  onNavigateToGathering,
  onUpdateTangSectSkills,
  onUpdateHiddenWeapons
}) => {
  const [activeTab, setActiveTab] = useState<'halls' | 'trade' | 'challenges' | 'arts' | 'forge'>('halls');
  const [cultivationMsg, setCultivationMsg] = useState<string | null>(null);

  // Challenge Combat State
  const [activeCombatChallenge, setActiveCombatChallenge] = useState<SectChallengeLetter | null>(null);
  const [combatEnemyHp, setCombatEnemyHp] = useState<number>(0);
  const [combatEnemyShield, setCombatEnemyShield] = useState<number>(0);
  const [combatPlayerHp, setCombatPlayerHp] = useState<number>(0);
  const [combatPlayerShield, setCombatPlayerShield] = useState<number>(0);
  const [combatLogs, setCombatLogs] = useState<{ id: string; text: string; type: 'player' | 'enemy' | 'system' | 'crit' }[]>([]);
  const [isCombatRunning, setIsCombatRunning] = useState<boolean>(false);
  const [combatTurn, setCombatTurn] = useState<number>(1);

  // Selected trade offer modal / detail
  const [selectedTrade, setSelectedTrade] = useState<SectTradeOffer | null>(null);

  // Ensure sect state is initialized
  const sect: TangSectState = player.sect || createInitialTangSectState();
  const playerStats = calculatePlayerStats(player);
  const currentSectLevelInfo = SECT_LEVEL_DATA.find(l => l.level === sect.sectLevel) || SECT_LEVEL_DATA[0];
  const nextSectLevelInfo = SECT_LEVEL_DATA.find(l => l.level === sect.sectLevel + 1);

  const notify = (msg: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setCultivationMsg(msg);
    if (showToast) showToast(msg, type);
  };

  // 1. Tang Sect Founding Ceremony (开宗立派大典)
  const handleEstablishTangSect = () => {
    SoundEngine.playBreakthrough();
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch {}

    onUpdatePlayer(prev => {
      const currentSect = prev.sect || createInitialTangSectState();
      return {
        ...prev,
        sect: {
          ...currentSect,
          isEstablished: true,
          sectName: '唐门',
          prestige: Math.max(currentSect.prestige, 500),
          sectFunds: Math.max(currentSect.sectFunds, 5000),
          prosperity: Math.max(currentSect.prosperity, 300),
          totalDisciples: Math.max(currentSect.totalDisciples, 120),
          eliteDisciples: Math.max(currentSect.eliteDisciples, 16),
          visitors: [...SECT_TRADE_VISITORS_POOL],
          challenges: [...SECT_CHALLENGE_LETTERS_POOL]
        }
      };
    });

    notify('🎉 鸣礼炮，昭告天下！唐门正式开宗立派，威震斗罗大陆！四大单属性宗族全部归心！', 'success');
  };

  // 2. Claim Daily Sect Tributes (领受万宗降伏岁贡)
  const handleClaimTributes = () => {
    SoundEngine.playCoins();
    const accumulatedGold = Math.max(5000, sect.repelledChallengesCount * 3000 + sect.sectLevel * 2000);
    const accumulatedFunds = Math.max(1000, sect.repelledChallengesCount * 600 + sect.sectLevel * 500);

    onUpdatePlayer(prev => {
      const currentSect = prev.sect || createInitialTangSectState();
      return {
        ...prev,
        gold: prev.gold + accumulatedGold,
        sect: {
          ...currentSect,
          sectFunds: currentSect.sectFunds + accumulatedFunds,
          dailyTributeAccumulated: 0,
          lastTributeClaimTime: Date.now()
        }
      };
    });

    try {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    } catch {}

    notify(`💰 成功领受各大降伏宗门朝贡：获得 +${accumulatedGold.toLocaleString()} 金魂币、+${accumulatedFunds.toLocaleString()} 宗门金库发展金！`, 'success');
  };

  // 3. Upgrade Tang Sect Level (宗门晋升)
  const handleUpgradeSectLevel = () => {
    if (!nextSectLevelInfo) {
      notify('唐门已登临至尊巅峰品阶【万古神级唐门】！', 'info');
      return;
    }

    if (sect.sectFunds < nextSectLevelInfo.upgradeCostFunds || player.gold < nextSectLevelInfo.upgradeCostGold) {
      notify(`升级所需资金不足！需要 ${nextSectLevelInfo.upgradeCostFunds.toLocaleString()} 宗门金库 与 ${nextSectLevelInfo.upgradeCostGold.toLocaleString()} 金魂币！`, 'warning');
      return;
    }

    SoundEngine.playBreakthrough();
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch {}

    onUpdatePlayer(prev => {
      const currentSect = prev.sect || createInitialTangSectState();
      return {
        ...prev,
        gold: prev.gold - nextSectLevelInfo.upgradeCostGold,
        sect: {
          ...currentSect,
          sectLevel: currentSect.sectLevel + 1,
          sectRankTitle: nextSectLevelInfo.title,
          sectFunds: currentSect.sectFunds - nextSectLevelInfo.upgradeCostFunds,
          prosperity: currentSect.prosperity + 300,
          prestige: currentSect.prestige + nextSectLevelInfo.dailyPrestigeBonus * 2,
          totalDisciples: Math.min(nextSectLevelInfo.maxDisciples, currentSect.totalDisciples + 60)
        }
      };
    });

    notify(`✨ 恭贺唐门宗门晋升为【${nextSectLevelInfo.title}】！宗门弟子上限扩增，全大陆声望暴涨！`, 'success');
  };

  // 4. Upgrade Hall (堂口升级)
  const handleUpgradeHall = (hallId: SectHallType) => {
    const hall = sect.halls[hallId];
    if (hall.level >= hall.maxLevel) {
      notify(`【${hall.chineseName}】已达至高十级圆满！`, 'info');
      return;
    }

    const costFunds = hall.upgradeCost.sectFunds * hall.level;
    const costGold = hall.upgradeCost.gold * hall.level;

    if (sect.sectFunds < costFunds || player.gold < costGold) {
      notify(`升级殿堂资源不足！需要 ${costFunds.toLocaleString()} 宗门金库 与 ${costGold.toLocaleString()} 金魂币！`, 'warning');
      return;
    }

    SoundEngine.playSmash();
    onUpdatePlayer(prev => {
      const currentSect = prev.sect || createInitialTangSectState();
      const updatedHalls = { ...currentSect.halls };
      const currentHall = updatedHalls[hallId];

      updatedHalls[hallId] = {
        ...currentHall,
        level: currentHall.level + 1,
        statsBonus: {
          ...currentHall.statsBonus,
          atk: Math.floor(currentHall.statsBonus.atk * 1.3 + 15),
          def: Math.floor(currentHall.statsBonus.def * 1.3 + 12),
          hp: Math.floor(currentHall.statsBonus.hp * 1.3 + 100),
          speed: Math.floor(currentHall.statsBonus.speed * 1.2 + 5)
        }
      };

      return {
        ...prev,
        gold: prev.gold - costGold,
        sect: {
          ...currentSect,
          sectFunds: currentSect.sectFunds - costFunds,
          prosperity: currentSect.prosperity + 80,
          prestige: currentSect.prestige + 50,
          halls: updatedHalls
        }
      };
    });

    notify(`🏛️ 【${hall.chineseName}】成功晋升至 Lv.${hall.level + 1}！堂主率众传授无上技艺，全员战力暴涨！`, 'success');
  };

  // 5. Recruit Disciples (招募真传弟子)
  const handleRecruitDisciples = () => {
    const recruitCost = 3000;
    if (player.gold < recruitCost) {
      notify(`金魂币不足！招募新晋弟子需要 ${recruitCost} 金魂币！`, 'warning');
      return;
    }

    SoundEngine.playClick();
    const newDisciples = Math.floor(Math.random() * 15) + 10;
    const newElites = Math.random() > 0.6 ? 2 : 1;

    onUpdatePlayer(prev => {
      const currentSect = prev.sect || createInitialTangSectState();
      return {
        ...prev,
        gold: prev.gold - recruitCost,
        sect: {
          ...currentSect,
          totalDisciples: currentSect.totalDisciples + newDisciples,
          eliteDisciples: currentSect.eliteDisciples + newElites,
          prosperity: currentSect.prosperity + 40,
          prestige: currentSect.prestige + 20
        }
      };
    });

    notify(`👥 唐门广开山门收徒：新招募了 ${newDisciples} 名外门弟子，选拔出 ${newElites} 名天资卓绝的真传弟子！`, 'success');
  };

  // 6. Complete Trade with Visiting Sects (与来访宗门达成交易)
  const handleFulfillTrade = (trade: SectTradeOffer) => {
    SoundEngine.playClick();

    // Check if player has the desired item
    const requiredItem = trade.desiredItem;
    let hasItem = false;

    if (requiredItem.type === 'hidden_weapon') {
      const weapon = (player.hiddenWeapons || []).find(w => w.id === requiredItem.itemId);
      if (weapon && weapon.quantity >= requiredItem.quantity) {
        hasItem = true;
      }
    } else {
      const inv = (player.inventory || []).find(i => i.id === requiredItem.itemId);
      if (inv && inv.quantity >= requiredItem.quantity) {
        hasItem = true;
      }
    }

    if (!hasItem) {
      notify(`所需交易物资不足！需要交付 ${requiredItem.quantity} 份【${requiredItem.itemName}】！可前往铸造工坊或神材宝地获取！`, 'warning');
      return;
    }

    SoundEngine.playCoins();
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    } catch {}

    onUpdatePlayer(prev => {
      const currentSect = prev.sect || createInitialTangSectState();
      
      // Deduct item
      let updatedWeapons = [...(prev.hiddenWeapons || [])];
      let updatedInv = [...(prev.inventory || [])];

      if (requiredItem.type === 'hidden_weapon') {
        const wIdx = updatedWeapons.findIndex(w => w.id === requiredItem.itemId);
        if (wIdx >= 0) {
          updatedWeapons[wIdx].quantity = Math.max(0, updatedWeapons[wIdx].quantity - requiredItem.quantity);
        }
      } else {
        const iIdx = updatedInv.findIndex(i => i.id === requiredItem.itemId);
        if (iIdx >= 0) {
          updatedInv[iIdx].quantity = Math.max(0, updatedInv[iIdx].quantity - requiredItem.quantity);
        }
      }

      // Add rewards (metals, items, gold, etc.)
      const updatedMetals = { ...(prev.divineMetals || {}) };
      if (trade.offerRewards.metals) {
        Object.entries(trade.offerRewards.metals).forEach(([name, count]) => {
          updatedMetals[name] = (updatedMetals[name] || 0) + count;
        });
      }

      // Update trade status
      const updatedVisitors = currentSect.visitors.map(v => {
        if (v.id === trade.id) {
          return { ...v, status: 'completed' as const, favorability: Math.min(100, v.favorability + trade.offerRewards.favorGain) };
        }
        return v;
      });

      return {
        ...prev,
        gold: prev.gold + trade.offerRewards.gold,
        hiddenWeapons: updatedWeapons,
        inventory: updatedInv,
        divineMetals: updatedMetals,
        sect: {
          ...currentSect,
          sectFunds: currentSect.sectFunds + trade.offerRewards.sectFunds,
          prestige: currentSect.prestige + trade.offerRewards.prestige,
          completedTradesCount: currentSect.completedTradesCount + 1,
          visitors: updatedVisitors
        }
      };
    });

    notify(`🤝 契约达成！成功与【${trade.sectName}】完成大宗军械贸易，获得 +${trade.offerRewards.gold.toLocaleString()} 金魂币、+${trade.offerRewards.sectFunds} 宗门金库与稀有神材！`, 'success');
  };

  // Refresh or Host Banquet for Visitors
  const handleHostTeaBanquet = () => {
    const cost = 2000;
    if (player.gold < cost) {
      notify(`举办品茗宴需要 ${cost} 金魂币！`, 'warning');
      return;
    }

    SoundEngine.playClick();
    onUpdatePlayer(prev => {
      const currentSect = prev.sect || createInitialTangSectState();
      // Re-populate pending visitors
      const freshVisitors = SECT_TRADE_VISITORS_POOL.map(v => ({
        ...v,
        id: `${v.id}_${Date.now()}`,
        status: 'pending' as const
      }));

      return {
        ...prev,
        gold: prev.gold - cost,
        sect: {
          ...currentSect,
          prosperity: currentSect.prosperity + 50,
          visitors: freshVisitors
        }
      };
    });

    notify('🍵 唐门举办【万宗品茗大会】，天斗皇室、七宝琉璃宗、昊天宗等各大商团代表纷至沓来！', 'success');
  };

  // 7. Mountain Gate Challenge Duel Combat Engine (山门决战对决系统)
  const handleStartChallengeCombat = (challenge: SectChallengeLetter) => {
    SoundEngine.playSmash();
    const enemy = challenge.enemyLeaderStats;
    const playerStats = calculatePlayerStats(player);
    const playerMaxHp = playerStats.maxHp || 100000;
    const defenseHall = sect.halls.defense;
    const extraShield = Math.floor(playerMaxHp * (0.2 + (defenseHall.level - 1) * 0.05));

    setActiveCombatChallenge(challenge);
    setCombatEnemyHp(enemy.hp);
    setCombatEnemyShield(enemy.shield);
    setCombatPlayerHp(playerMaxHp);
    setCombatPlayerShield(extraShield);
    setCombatTurn(1);
    setIsCombatRunning(true);
    setCombatLogs([
      { id: '1', text: `⚔️ 山门警钟长鸣！【${challenge.senderSect}】首领【${enemy.name}】携众强行攻打唐门大门！`, type: 'system' },
      { id: '2', text: `🛡️ 御堂堂主牛皋启动【玄武金汤大阵】，为唐门宗主加持 ${extraShield.toLocaleString()} 点宗门结界护盾！`, type: 'system' }
    ]);
  };

  // Combat Player Actions
  const handleCombatPlayerAction = (actionType: 'normal' | 'xuantian' | 'crossbow' | 'pear' | 'lotus' | 'shield') => {
    if (!activeCombatChallenge || !isCombatRunning) return;

    const enemy = activeCombatChallenge.enemyLeaderStats;
    const playerStats = calculatePlayerStats(player);
    const pAtk = playerStats.atk || 5000;
    let pDamage = 0;
    let actionLog = '';
    let isCrit = false;
    let enemyStunned = false;

    // Determine damage based on action
    if (actionType === 'normal') {
      pDamage = Math.floor(pAtk * (1.2 + Math.random() * 0.4));
      actionLog = `⚡ 唐门宗主挥动昊天锤/蓝银霸皇枪，强力轰击【${enemy.name}】，造成 ${pDamage.toLocaleString()} 点伤害！`;
    } else if (actionType === 'xuantian') {
      // 玄天宝录绝技 (控鹤擒龙 + 紫极魔瞳)
      pDamage = Math.floor(pAtk * 1.8 + 15000);
      isCrit = true;
      enemyStunned = true;
      actionLog = `👁️ 紫极魔瞳神光贯穿！施展【控鹤擒龙】打断敌方气机，造成 ${pDamage.toLocaleString()} 点暴击伤害并使敌方定身震荡！`;
    } else if (actionType === 'crossbow') {
      // 诸葛神弩
      pDamage = Math.floor(pAtk * 1.5 + 28000);
      actionLog = `🏹 诸葛神弩十六发精钢破心箭暴射而出，撕裂护甲造成 ${pDamage.toLocaleString()} 点穿透杀伤！`;
    } else if (actionType === 'pear') {
      // 暴雨梨花针
      pDamage = Math.floor(pAtk * 2.2 + 58000);
      isCrit = true;
      actionLog = `🌸 暴雨梨花针二十七枚银光破空化作璀璨风暴，爆发出 ${pDamage.toLocaleString()} 点毁天灭地巨额伤害！`;
    } else if (actionType === 'lotus') {
      // 佛怒唐莲
      pDamage = Math.floor(pAtk * 3.5 + 120000);
      isCrit = true;
      actionLog = `🔥 【佛怒唐莲】盛放金莲火海！毁灭性神铁暴风引爆，重创【${enemy.name}】，爆发出 ${pDamage.toLocaleString()} 点惊世神威！`;
    } else if (actionType === 'shield') {
      const restoreShield = 40000 + (sect.halls.defense.level * 8000);
      setCombatPlayerShield(prev => prev + restoreShield);
      actionLog = `🛡️ 催动【御堂金汤玄武壁】，修补宗门结界护盾，恢复了 ${restoreShield.toLocaleString()} 点护盾值！`;
    }

    SoundEngine.playSmash();

    // Apply player damage to enemy shield / hp
    let newEnemyShield = combatEnemyShield;
    let newEnemyHp = combatEnemyHp;

    if (pDamage > 0) {
      if (newEnemyShield > 0) {
        if (pDamage <= newEnemyShield) {
          newEnemyShield -= pDamage;
        } else {
          const rem = pDamage - newEnemyShield;
          newEnemyShield = 0;
          newEnemyHp = Math.max(0, newEnemyHp - rem);
        }
      } else {
        newEnemyHp = Math.max(0, newEnemyHp - pDamage);
      }
    }

    setCombatEnemyShield(newEnemyShield);
    setCombatEnemyHp(newEnemyHp);

    const newLogs = [
      ...combatLogs,
      { id: `${Date.now()}_p`, text: actionLog, type: isCrit ? 'crit' as const : 'player' as const }
    ];

    // Check enemy defeat
    if (newEnemyHp <= 0) {
      SoundEngine.playVictory();
      try {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
      } catch {}

      newLogs.push({
        id: `${Date.now()}_win`,
        text: `🏆 战报大捷！唐门全员力克【${enemy.name}】！敌方仓皇败退，奉上降表战败贡品！`,
        type: 'system'
      });
      setCombatLogs(newLogs);
      setIsCombatRunning(false);

      // Reward player
      const r = activeCombatChallenge.rewards;
      onUpdatePlayer(prev => {
        const currentSect = prev.sect || createInitialTangSectState();
        const updatedMetals = { ...(prev.divineMetals || {}) };
        if (r.metals) {
          Object.entries(r.metals).forEach(([name, count]) => {
            updatedMetals[name] = (updatedMetals[name] || 0) + count;
          });
        }

        const updatedChallenges = currentSect.challenges.map(c => {
          if (c.id === activeCombatChallenge.id) {
            return { ...c, status: 'defeated' as const };
          }
          return c;
        });

        return {
          ...prev,
          gold: prev.gold + r.gold,
          divineMetals: updatedMetals,
          sect: {
            ...currentSect,
            sectFunds: currentSect.sectFunds + r.sectFunds,
            prestige: currentSect.prestige + r.sectPrestige,
            totalDisciples: currentSect.totalDisciples + r.disciplesRecruited,
            repelledChallengesCount: currentSect.repelledChallengesCount + 1,
            dailyTributeAccumulated: currentSect.dailyTributeAccumulated + r.tributePerDay,
            challenges: updatedChallenges
          }
        };
      });

      notify(`🏆 击溃【${activeCombatChallenge.senderSect}】！获得 +${r.gold.toLocaleString()} 金魂币、+${r.sectFunds} 宗门金库、收编 +${r.disciplesRecruited} 名新弟子！`, 'success');
      return;
    }

    // Enemy turn if not stunned
    if (!enemyStunned) {
      const skills = enemy.skills;
      const chosenSkill = skills[Math.floor(Math.random() * skills.length)] || skills[0];
      const eDmg = Math.floor((chosenSkill.dmg || 15000) * (0.85 + Math.random() * 0.3));

      let newPlayerShield = combatPlayerShield;
      let newPlayerHp = combatPlayerHp;

      if (newPlayerShield > 0) {
        if (eDmg <= newPlayerShield) {
          newPlayerShield -= eDmg;
        } else {
          const rem = eDmg - newPlayerShield;
          newPlayerShield = 0;
          newPlayerHp = Math.max(0, newPlayerHp - rem);
        }
      } else {
        newPlayerHp = Math.max(0, newPlayerHp - eDmg);
      }

      setCombatPlayerShield(newPlayerShield);
      setCombatPlayerHp(newPlayerHp);

      newLogs.push({
        id: `${Date.now()}_e`,
        text: `💥 【${enemy.name}】施展【${chosenSkill.name}】，狂暴轰击造成 ${eDmg.toLocaleString()} 点伤害！`,
        type: 'enemy'
      });

      if (newPlayerHp <= 0) {
        newLogs.push({
          id: `${Date.now()}_lose`,
          text: `⚠️ 山门失守！唐门众长老与弟子护送宗主退守议事大殿，待恢复后再战！`,
          type: 'system'
        });
        setIsCombatRunning(false);
      }
    } else {
      newLogs.push({
        id: `${Date.now()}_stun`,
        text: `💫 【${enemy.name}】处于控鹤擒龙震荡状态，无法发动攻击！`,
        type: 'system'
      });
    }

    setCombatLogs(newLogs);
    setCombatTurn(prev => prev + 1);
  };

  // Generate new Challenge Letter (引动大陆敌宗新战帖)
  const handleSummonNewChallenge = () => {
    const cost = 2500;
    if (player.gold < cost) {
      notify(`发送武林邀战贴需要 ${cost} 金魂币！`, 'warning');
      return;
    }

    SoundEngine.playClick();
    onUpdatePlayer(prev => {
      const currentSect = prev.sect || createInitialTangSectState();
      const freshChallenges = SECT_CHALLENGE_LETTERS_POOL.map(c => ({
        ...c,
        id: `${c.id}_${Date.now()}`,
        status: 'active' as const
      }));

      return {
        ...prev,
        gold: prev.gold - cost,
        sect: {
          ...currentSect,
          prestige: currentSect.prestige + 40,
          challenges: freshChallenges
        }
      };
    });

    notify('📜 唐门向全大陆各大敌对势力发出【绝顶问剑令】，各路封号斗罗与大宗首领携战帖登门！', 'info');
  };

  // Secret Arts & Weapon crafting handlers
  const handleTrainSkill = (skillKey: keyof Player['tangSectSkills']) => {
    SoundEngine.playClick();
    const skills = player.tangSectSkills;
    const skill = skills[skillKey];
    if (skill.level >= skill.maxLevel) {
      notify(`【${skill.chineseName}】已修炼至至高圆满之境！`, 'info');
      return;
    }

    const costGold = skill.level * 200;
    if (player.gold < costGold) {
      notify(`金魂币不足！修炼此重需要 ${costGold} 金魂币！`, 'warning');
      return;
    }

    const nextStages = {
      xuantian: `第${skill.level + 1}重·生生不息`,
      ziji: ['纵观之境', '入微之境', '芥子之境', '浩瀚之境'][skill.level] || '浩瀚神境',
      guiying: `第${skill.level + 1}重·浮光掠影`,
      xuanyu: `第${skill.level + 1}重·凝玉百毒不侵`,
      konghe: `第${skill.level + 1}重·四两拨千斤`
    };

    onUpdatePlayer(prev => ({
      ...prev,
      gold: prev.gold - costGold,
      tangSectSkills: {
        ...prev.tangSectSkills,
        [skillKey]: {
          ...skill,
          level: skill.level + 1,
          stageName: (nextStages as any)[skillKey] || `第${skill.level + 1}重`
        }
      }
    }));

    SoundEngine.playBreakthrough();
    try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } }); } catch {}
    notify(`🎉 【${skill.chineseName}】突破至 第${skill.level + 1}重！`, 'success');
  };

  const handleCraftWeapon = (weapon: HiddenWeapon) => {
    SoundEngine.playSmash();
    const updatedInventory = [...player.inventory];
    let canCraft = true;

    for (const mat of weapon.materialsNeeded) {
      const found = updatedInventory.find(i => i.id === mat.itemId);
      if (!found || found.quantity < mat.count) {
        canCraft = false;
        break;
      }
    }

    if (!canCraft) {
      notify(`材料不足！无法锻造【${weapon.name}】！可前往神材宝地采矿！`, 'warning');
      return;
    }

    // Deduct materials
    for (const mat of weapon.materialsNeeded) {
      const found = updatedInventory.find(i => i.id === mat.itemId);
      if (found) found.quantity -= mat.count;
    }

    const currentWeapons = [...(player.hiddenWeapons || CRAFTABLE_HIDDEN_WEAPONS)];
    const existingIdx = currentWeapons.findIndex(w => w.id === weapon.id);
    if (existingIdx >= 0) {
      currentWeapons[existingIdx].quantity += (weapon.rank === 'god' ? 1 : weapon.rank === 'high' ? 2 : 5);
    } else {
      currentWeapons.push({ ...weapon, quantity: 1 });
    }

    onUpdatePlayer(prev => ({
      ...prev,
      inventory: updatedInventory,
      hiddenWeapons: currentWeapons
    }));

    SoundEngine.playBreakthrough();
    try { confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 } }); } catch {}
    notify(`✨ 神机出炉！成功锻造唐门绝顶暗器【${weapon.name}】！`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HEADER BANNER & SECT STATUS */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/40 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-2xl shadow-lg text-slate-950 font-black">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-100 tracking-wide">
                    {sect.isEstablished ? `【${sect.sectName}】宗门总坛` : '唐门·开宗立派'}
                  </h1>
                  {sect.isEstablished && (
                    <span className="px-3 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow">
                      {currentSectLevelInfo.title} (Lv.{sect.sectLevel})
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {sect.isEstablished 
                    ? `门规：${sect.sectMotto} | 四大单属性宗族聚首，暗器威震天下，万宗登门朝贺贸易与决战演武！`
                    : '集结力之一族泰坦、御之一族牛皋、敏之一族白鹤与破之一族杨无敌，开创万古第一宗门！'}
                </p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            {sect.isEstablished && (
              <div className="flex flex-wrap gap-2.5 mt-4">
                <div className="px-3 py-1.5 bg-slate-950/80 border border-amber-500/30 rounded-xl text-xs flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-400">唐门金库:</span>
                  <strong className="text-amber-300">{sect.sectFunds.toLocaleString()}</strong>
                </div>
                <div className="px-3 py-1.5 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-xs flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-400">大陆声望:</span>
                  <strong className="text-cyan-300">{sect.prestige.toLocaleString()}</strong>
                </div>
                <div className="px-3 py-1.5 bg-slate-950/80 border border-emerald-500/30 rounded-xl text-xs flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-400">门下弟子:</span>
                  <strong className="text-emerald-300">{sect.totalDisciples.toLocaleString()} 人</strong>
                  <span className="text-[10px] text-slate-500">({sect.eliteDisciples} 真传)</span>
                </div>
                <div className="px-3 py-1.5 bg-slate-950/80 border border-indigo-500/30 rounded-xl text-xs flex items-center gap-2">
                  <Crown className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-400">繁荣度:</span>
                  <strong className="text-indigo-300">{sect.prosperity.toLocaleString()}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons on Banner */}
          <div className="flex flex-wrap items-center gap-2">
            {sect.isEstablished ? (
              <>
                <button
                  onClick={handleClaimTributes}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center gap-1.5 transition-all"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>领受万宗岁贡</span>
                </button>
                <button
                  onClick={handleRecruitDisciples}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition-all"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>开山纳徒</span>
                </button>
                {nextSectLevelInfo && (
                  <button
                    onClick={handleUpgradeSectLevel}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 transition-all"
                  >
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    <span>晋升宗门</span>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={handleEstablishTangSect}
                className="px-6 py-3 rounded-2xl text-sm font-black bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:scale-105 transition-all flex items-center gap-2 animate-pulse"
              >
                <Crown className="w-5 h-5" />
                <span>举行开宗立派大典！</span>
              </button>
            )}
          </div>
        </div>

        {/* NOTIFICATION BOX */}
        {cultivationMsg && (
          <div className="mt-4 p-3 bg-slate-950/90 border border-emerald-500/50 rounded-2xl text-xs text-emerald-300 font-semibold flex items-center justify-between shadow-lg">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {cultivationMsg}
            </span>
            <button onClick={() => setCultivationMsg(null)} className="text-slate-400 hover:text-slate-200">✕</button>
          </div>
        )}
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => { SoundEngine.playClick(); setActiveTab('halls'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'halls'
              ? 'bg-emerald-600 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>宗门堂口 ({Object.keys(sect.halls).length})</span>
        </button>

        <button
          onClick={() => { SoundEngine.playClick(); setActiveTab('trade'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'trade'
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Handshake className="w-4 h-4 text-amber-400" />
          <span>万宗朝贺·商贸会馆 ({sect.visitors.filter(v => v.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => { SoundEngine.playClick(); setActiveTab('challenges'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'challenges'
              ? 'bg-rose-600 text-slate-100 shadow-[0_0_15px_rgba(225,29,72,0.4)]'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Swords className="w-4 h-4 text-rose-400" />
          <span>山门决战·万宗战帖 ({sect.challenges.filter(c => c.status === 'active').length})</span>
        </button>

        <button
          onClick={() => { SoundEngine.playClick(); setActiveTab('arts'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'arts'
              ? 'bg-cyan-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>玄天宝录·五大绝学</span>
        </button>

        <button
          onClick={() => { SoundEngine.playClick(); setActiveTab('forge'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'forge'
              ? 'bg-indigo-600 text-slate-100 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Crosshair className="w-4 h-4" />
          <span>暗器工坊·机括神造</span>
        </button>
      </div>

      {/* TAB 1: 6 SECT HALLS & GRAND HEADQUARTERS */}
      {activeTab === 'halls' && (
        <div className="space-y-4">
          {!sect.isEstablished ? (
            <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-8 text-center space-y-4 shadow-xl">
              <Crown className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-xl font-black text-slate-100">请先举行【唐门开宗立派大典】</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                四大单属性宗族力之一族、御之一族、敏之一族与破之一族已全部在山下等候宗主谕令！
              </p>
              <button
                onClick={handleEstablishTangSect}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black rounded-2xl text-sm shadow-lg hover:scale-105 transition-all"
              >
                立即立宗！
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.entries(sect.halls) as [SectHallType, SectHall][]).map(([hallKey, hall]) => {
                const isMax = hall.level >= hall.maxLevel;
                const costFunds = hall.upgradeCost.sectFunds * hall.level;
                const costGold = hall.upgradeCost.gold * hall.level;
                const canAfford = sect.sectFunds >= costFunds && player.gold >= costGold;

                return (
                  <div
                    key={hallKey}
                    className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
                  >
                    <div>
                      {/* Hall Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            {hall.specialty}
                          </span>
                          <h3 className="font-bold text-base text-slate-100 mt-0.5">{hall.chineseName}</h3>
                          <p className="text-xs text-amber-300 font-semibold">{hall.leaderName}</p>
                          <span className="text-[10px] text-slate-400">{hall.leaderTitle}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-800 text-emerald-300 border border-emerald-500/30">
                          Lv.{hall.level} / {hall.maxLevel}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                        {hall.description}
                      </p>

                      {/* Hall Bonuses */}
                      <div className="mt-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
                        <div className="text-emerald-300 font-semibold">
                          ✦ {hall.effectSummary}
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                          <div>攻击加成: <strong className="text-rose-400">+{hall.statsBonus.atk}</strong></div>
                          <div>防御加成: <strong className="text-cyan-400">+{hall.statsBonus.def}</strong></div>
                          <div>生命加成: <strong className="text-emerald-400">+{hall.statsBonus.hp}</strong></div>
                          <div>速度加成: <strong className="text-amber-400">+{hall.statsBonus.speed}</strong></div>
                        </div>
                      </div>
                    </div>

                    {/* Upgrade Hall Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400">
                        {isMax ? (
                          <span className="text-emerald-400 font-bold">殿堂已达最高级</span>
                        ) : (
                          <div>
                            <div>金库: <strong className="text-amber-300">{costFunds}</strong></div>
                            <div>金魂币: <strong className="text-slate-200">{costGold}</strong></div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleUpgradeHall(hallKey)}
                        disabled={isMax || !canAfford}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 ${
                          isMax
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : canAfford
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {isMax ? '功成名就' : '扩建修缮！'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SECT TRADE & CONTINENTAL COMMERCE (万宗朝贺·商贸会馆) */}
      {activeTab === 'trade' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Handshake className="w-4 h-4 text-amber-400" />
                <span>全大陆各宗代表来访唐门求购暗器与丹药</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                完成各大宗门的订购需求，可获取万千金魂币、宗门建设金、深海沉银、天锻神金与万年魂骨碎片！
              </p>
            </div>

            <button
              onClick={handleHostTeaBanquet}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>举办品茗宴·迎引新商团</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sect.visitors.map((trade) => {
              const req = trade.desiredItem;
              let playerStock = 0;
              if (req.type === 'hidden_weapon') {
                const w = (player.hiddenWeapons || []).find(item => item.id === req.itemId);
                playerStock = w ? w.quantity : 0;
              } else {
                const i = (player.inventory || []).find(item => item.id === req.itemId);
                playerStock = i ? i.quantity : 0;
              }
              const hasEnough = playerStock >= req.quantity;
              const isCompleted = trade.status === 'completed';

              return (
                <div
                  key={trade.id}
                  className={`bg-slate-900/90 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                    isCompleted 
                      ? 'border-emerald-500/30 bg-emerald-950/10 opacity-80' 
                      : 'border-slate-800 hover:border-amber-500/50'
                  }`}
                >
                  <div>
                    {/* Visitor Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${trade.sectLogoColor} text-slate-950 font-black shadow`}>
                          <Handshake className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-slate-100">{trade.sectName}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-300 border border-amber-500/30">
                              好感: {trade.favorability}
                            </span>
                          </div>
                          <p className="text-xs text-cyan-300 font-semibold">{trade.repName}</p>
                          <span className="text-[10px] text-slate-400">{trade.repTitle}</span>
                        </div>
                      </div>

                      {isCompleted ? (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          已履约
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950/60 text-amber-300 border border-amber-500/40">
                          商谈中
                        </span>
                      )}
                    </div>

                    {/* Dialogue */}
                    <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-300 italic leading-relaxed">
                      {trade.dialogue}
                    </div>

                    {/* Desired Requirement */}
                    <div className="mt-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">求购物资需求：</span>
                        <span className={hasEnough ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          库存: {playerStock} / {req.quantity} 份
                        </span>
                      </div>
                      <p className="text-amber-300 font-medium">{req.description}</p>
                    </div>

                    {/* Rewards Summary */}
                    <div className="mt-3 p-2.5 bg-slate-950/40 rounded-xl text-xs text-slate-400 space-y-1">
                      <div className="text-slate-300 font-semibold flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span>交付酬劳：</span>
                        <strong className="text-amber-300">+{trade.offerRewards.gold.toLocaleString()} 金魂币</strong>
                        <span className="text-cyan-300">(+{trade.offerRewards.sectFunds} 金库)</span>
                      </div>
                      {trade.offerRewards.items && trade.offerRewards.items.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {trade.offerRewards.items.map((it, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-300 border border-slate-700">
                              🎁 {it.name} x{it.quantity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trade Action */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      好感提升: <strong className="text-emerald-400">+{trade.offerRewards.favorGain}</strong>
                    </span>

                    <button
                      onClick={() => handleFulfillTrade(trade)}
                      disabled={isCompleted || !hasEnough}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : hasEnough
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg font-black'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {isCompleted ? '契约已达成' : hasEnough ? '交付物资·达成契约！' : '物资不足 (去工坊锻造)'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CHALLENGE LETTERS & MOUNTAIN GATE BATTLES (山门决战·万宗战帖) */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          
          {/* COMBAT ARENA POPUP / VIEW */}
          {activeCombatChallenge && isCombatRunning ? (
            <div className="bg-slate-900 border-2 border-rose-500/60 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Swords className="w-6 h-6 text-rose-400 animate-pulse" />
                  <h3 className="text-lg font-black text-slate-100">
                    【山门护宗决战】迎战：{activeCombatChallenge.senderLeader}
                  </h3>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-bold bg-rose-950 text-rose-300 border border-rose-500/40">
                  第 {combatTurn} 回合
                </span>
              </div>

              {/* DUEL HUD: PLAYER VS ENEMY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Player Side */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-cyan-300">唐门宗主 (唐三)</span>
                    <span className="text-xs text-slate-400">Lv.{player.level} 封号斗罗</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>生命值:</span>
                      <strong className="text-emerald-400">{Math.max(0, combatPlayerHp).toLocaleString()} / {(playerStats.maxHp || 100000).toLocaleString()}</strong>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, (combatPlayerHp / (playerStats.maxHp || 100000)) * 100))}%` }}
                      />
                    </div>
                  </div>
                  {combatPlayerShield > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-cyan-300 mb-1">
                        <span>御堂玄武结界护盾:</span>
                        <strong>{combatPlayerShield.toLocaleString()}</strong>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-400 transition-all"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Enemy Side */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-rose-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-rose-300">{activeCombatChallenge.enemyLeaderStats.name}</span>
                    <span className="text-xs text-slate-400">Lv.{activeCombatChallenge.enemyLeaderStats.level}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>敌首生命:</span>
                      <strong className="text-rose-400">{Math.max(0, combatEnemyHp).toLocaleString()} / {activeCombatChallenge.enemyLeaderStats.maxHp.toLocaleString()}</strong>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-rose-500 to-red-600 transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, (combatEnemyHp / activeCombatChallenge.enemyLeaderStats.maxHp) * 100))}%` }}
                      />
                    </div>
                  </div>
                  {combatEnemyShield > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-amber-300 mb-1">
                        <span>敌方护体魂力罡气:</span>
                        <strong>{combatEnemyShield.toLocaleString()}</strong>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 transition-all"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* COMBAT LOGS */}
              <div className="bg-slate-950/90 p-3 rounded-2xl border border-slate-800 h-36 overflow-y-auto space-y-1 text-xs font-mono">
                {combatLogs.map(log => (
                  <div 
                    key={log.id} 
                    className={
                      log.type === 'crit' ? 'text-amber-300 font-bold' :
                      log.type === 'player' ? 'text-cyan-300' :
                      log.type === 'enemy' ? 'text-rose-400' : 'text-slate-300'
                    }
                  >
                    {log.text}
                  </div>
                ))}
              </div>

              {/* PLAYER COMBAT ACTION BUTTONS */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                <button
                  onClick={() => handleCombatPlayerAction('normal')}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-100 flex flex-col items-center gap-1 border border-slate-700 transition-all"
                >
                  <Hammer className="w-4 h-4 text-cyan-400" />
                  <span>武魂重击</span>
                </button>

                <button
                  onClick={() => handleCombatPlayerAction('xuantian')}
                  className="p-2.5 bg-gradient-to-b from-purple-900/60 to-slate-800 hover:from-purple-800/80 rounded-xl text-xs font-bold text-purple-200 flex flex-col items-center gap-1 border border-purple-500/40 transition-all"
                >
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span>紫极控鹤 (眩晕)</span>
                </button>

                <button
                  onClick={() => handleCombatPlayerAction('crossbow')}
                  className="p-2.5 bg-gradient-to-b from-amber-900/60 to-slate-800 hover:from-amber-800/80 rounded-xl text-xs font-bold text-amber-200 flex flex-col items-center gap-1 border border-amber-500/40 transition-all"
                >
                  <Crosshair className="w-4 h-4 text-amber-400" />
                  <span>诸葛神弩 (穿透)</span>
                </button>

                <button
                  onClick={() => handleCombatPlayerAction('pear')}
                  className="p-2.5 bg-gradient-to-b from-cyan-900/60 to-slate-800 hover:from-cyan-800/80 rounded-xl text-xs font-bold text-cyan-200 flex flex-col items-center gap-1 border border-cyan-500/40 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>暴雨梨花针</span>
                </button>

                <button
                  onClick={() => handleCombatPlayerAction('lotus')}
                  className="p-2.5 bg-gradient-to-b from-rose-900/60 to-slate-800 hover:from-rose-800/80 rounded-xl text-xs font-bold text-rose-200 flex flex-col items-center gap-1 border border-rose-500/40 transition-all"
                >
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>佛怒唐莲 (神威)</span>
                </button>

                <button
                  onClick={() => handleCombatPlayerAction('shield')}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-emerald-300 flex flex-col items-center gap-1 border border-emerald-500/40 transition-all"
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>御堂玄武结界</span>
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => { setActiveCombatChallenge(null); setIsCombatRunning(false); }}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  退出决战界面
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Challenge Letters List Header */}
              <div className="flex items-center justify-between bg-slate-900/90 border border-rose-500/30 rounded-2xl p-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    <Swords className="w-4 h-4 text-rose-400" />
                    <span>全大陆各大宗门送达唐门之战帖与绝命书</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    率领唐门四堂长老与弟子迎战强敌，战胜后可收缴敌宗岁贡、收降弟子并提升全大陆霸主声望！
                  </p>
                </div>

                <button
                  onClick={handleSummonNewChallenge}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <ScrollText className="w-3.5 h-3.5" />
                  <span>全大陆邀战·发英雄帖</span>
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sect.challenges.map((c) => {
                  const isDefeated = c.status === 'defeated';

                  return (
                    <div
                      key={c.id}
                      className={`bg-slate-900/90 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                        isDefeated
                          ? 'border-emerald-500/30 bg-emerald-950/10 opacity-75'
                          : 'border-slate-800 hover:border-rose-500/50'
                      }`}
                    >
                      <div>
                        {/* Title & Badge */}
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-black text-rose-400">{c.senderSect}</span>
                            <h3 className="font-bold text-base text-slate-100 mt-0.5">{c.title}</h3>
                            <p className="text-xs text-amber-300 font-semibold">{c.senderLeader}</p>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${c.difficultyColor}`}>
                            {c.difficultyName}
                          </span>
                        </div>

                        {/* Letter Text Quote */}
                        <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-300 italic leading-relaxed">
                          {c.letterText}
                        </div>

                        {/* Leader Enemy Stats Preview */}
                        <div className="mt-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">敌首战力等级:</span>
                            <strong className="text-rose-400">Lv.{c.enemyLeaderStats.level} ({c.enemyLeaderStats.title})</strong>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                            <div>生命上限: <strong className="text-slate-200">{c.enemyLeaderStats.maxHp.toLocaleString()}</strong></div>
                            <div>攻击强度: <strong className="text-rose-300">{c.enemyLeaderStats.atk.toLocaleString()}</strong></div>
                          </div>
                        </div>

                        {/* Rewards Preview */}
                        <div className="mt-3 p-2.5 bg-slate-950/40 rounded-xl text-xs text-slate-400 space-y-1">
                          <div className="text-slate-300 font-semibold flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span>降伏战利品：</span>
                            <strong className="text-amber-300">+{c.rewards.gold.toLocaleString()} 金魂币</strong>
                            <span className="text-emerald-300">(+{c.rewards.disciplesRecruited} 门徒)</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            每日纳贡岁贡: <strong className="text-amber-400">+{c.rewards.tributePerDay} 金币/日</strong> | {c.rewards.rareItemDesc}
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          声望奖励: <strong className="text-cyan-400">+{c.rewards.sectPrestige}</strong>
                        </span>

                        <button
                          onClick={() => handleStartChallengeCombat(c)}
                          disabled={isDefeated}
                          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isDefeated
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-slate-100 shadow-lg active:scale-95'
                          }`}
                        >
                          <Swords className="w-3.5 h-3.5" />
                          <span>{isDefeated ? '敌宗已俯首俯降' : '移步山门·应战对决！'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 4: 5 SECRET ARTS (玄天宝录·五大绝学) */}
      {activeTab === 'arts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.entries(player.tangSectSkills) as [keyof Player['tangSectSkills'], TangSectSkill][]).map(([key, skill]) => {
            const isMax = skill.level >= skill.maxLevel;
            const costGold = skill.level * 200;

            return (
              <div
                key={key}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                        {key === 'xuantian' ? <Zap className="w-6 h-6 text-cyan-400" /> :
                         key === 'ziji' ? <Eye className="w-6 h-6 text-purple-400" /> :
                         key === 'guiying' ? <Wind className="w-6 h-6 text-emerald-400" /> :
                         key === 'xuanyu' ? <Shield className="w-6 h-6 text-blue-300" /> :
                         <Sparkles className="w-6 h-6 text-amber-400" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-100">{skill.chineseName}</h3>
                        <span className="text-xs text-cyan-400 font-semibold">{skill.stageName}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      Lv.{skill.level} / {skill.maxLevel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {skill.description}
                  </p>

                  <div className="mt-3 bg-slate-950/70 p-2.5 rounded-xl text-xs text-emerald-300 border border-slate-800/80">
                    <strong>绝学加成：</strong>{skill.effectDescription}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {isMax ? '已至最高境界' : `消耗: ${costGold} 金魂币`}
                  </span>

                  <button
                    onClick={() => handleTrainSkill(key as any)}
                    disabled={isMax || player.gold < costGold}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 ${
                      isMax
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow'
                    }`}
                  >
                    {isMax ? '功德圆满' : '潜心突破！'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 5: HIDDEN WEAPONS FORGE (暗器工坊·机括神造) */}
      {activeTab === 'forge' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CRAFTABLE_HIDDEN_WEAPONS.map((weapon) => {
            const playerWeapon = (player.hiddenWeapons || []).find(w => w.id === weapon.id);
            const currentQty = playerWeapon ? playerWeapon.quantity : 0;

            return (
              <div
                key={weapon.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Crosshair className="w-5 h-5 text-amber-400" />
                      <h3 className="font-bold text-base text-slate-100">{weapon.name}</h3>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                      weapon.rank === 'god' ? 'border-yellow-400 bg-yellow-950 text-yellow-300' :
                      weapon.rank === 'high' ? 'border-purple-500 bg-purple-950 text-purple-300' :
                      'border-amber-500 bg-amber-950 text-amber-300'
                    }`}>
                      {weapon.rank === 'god' ? '神级绝品' : weapon.rank === 'high' ? '顶级机括' : '精良机括'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {weapon.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-xl text-xs text-slate-300 mt-3 border border-slate-800">
                    <div>暗器杀伤: <strong className="text-rose-400">{weapon.damage}</strong></div>
                    <div>破甲穿透: <strong className="text-amber-400">{weapon.penetration}%</strong></div>
                  </div>

                  {/* Materials Needed */}
                  <div className="mt-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">所需铸造材料：</span>
                      {onNavigateToGathering && (
                        <button
                          onClick={() => onNavigateToGathering()}
                          className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                        >
                          <span>采矿获取</span>
                          <Sparkles className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {weapon.materialsNeeded.map((mat, mIdx) => {
                        const invItem = player.inventory.find(i => i.id === mat.itemId);
                        const hasEnough = (invItem?.quantity || 0) >= mat.count;

                        return (
                          <span
                            key={mIdx}
                            className={`px-2 py-0.5 rounded text-[11px] border ${
                              hasEnough ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-rose-950/60 border-rose-800 text-rose-300 font-bold'
                            }`}
                          >
                            {invItem?.name || mat.itemId} ({invItem?.quantity || 0}/{mat.count})
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    当前备弹：<strong className="text-amber-400">{currentQty}</strong> 枚
                  </span>

                  <button
                    onClick={() => handleCraftWeapon(weapon)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl text-xs transition-transform active:scale-95 shadow"
                  >
                    开炉锻造！
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
