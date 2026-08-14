/**
 * Douluo Dalu (Soul Land) RPG - Main Application
 * Classic 2D Interactive RPG / Clicker / Strategy Battler
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Player, 
  CombatEntity, 
  SoulBeast, 
  ArenaOpponent, 
  SoulSkill, 
  SoulBone, 
  ImmortalHerb, 
  HiddenWeapon, 
  Item,
  SoulBoneSlot,
  ArenaBadge,
  WorldDifficulty
} from './types/game';
import { GodTest, GodType } from './data/godTrials';
import { getSpentPointsInGodTree } from './data/godTalents';
import { 
  loadPlayer, 
  savePlayer, 
  createDefaultPlayer, 
  createRandomPlayer,
  calculatePlayerStats, 
  clearSave 
} from './utils/saveManager';
import { ALL_MARTIAL_SOULS, getSoulRankTitle } from './data/martialSouls';
import { SoundEngine } from './utils/audio';
import confetti from 'canvas-confetti';

// Components & Views
import { Navbar, GameView } from './components/Navbar';
import { CharacterPanel } from './components/CharacterPanel';
import { BattleArmorForgeView } from './components/BattleArmorForgeView';
import { Douluo4CompanionsView } from './components/Douluo4CompanionsView';
import { ContinentalTournamentView } from './components/ContinentalTournamentView';
import { SoulBoneSanctuaryView } from './components/SoulBoneSanctuaryView';
import { ForestHuntingView } from './components/ForestHuntingView';
import { GreatSoulArenaView } from './components/GreatSoulArenaView';
import { TangSectForgeView } from './components/TangSectForgeView';
import { SpiritPagodaView } from './components/SpiritPagodaView';
import { IceFireWellView } from './components/IceFireWellView';
import { SlaughterCityView } from './components/SlaughterCityView';
import { DivineGodTrialsView } from './components/DivineGodTrialsView';
import { MasterAcademyView } from './components/MasterAcademyView';
import { MaterialGatheringView } from './components/MaterialGatheringView';
import { InterstellarHangarView } from './components/InterstellarHangarView';
import { GameGuideView } from './components/GameGuideView';
import { CombatArenaView } from './components/CombatArenaView';
import { MultiplayerArenaView } from './components/MultiplayerArenaView';
import { GlobalChatDrawer } from './components/GlobalChatDrawer';

// Modals
import { InventoryModal } from './components/InventoryModal';
import { AwakeningModal } from './components/AwakeningModal';
import { SoulRingAbsorbModal } from './components/SoulRingAbsorbModal';
import { MeditationModal } from './components/MeditationModal';

interface CombatContext {
  type: 'forest' | 'arena' | 'slaughter' | 'god_test';
  beast?: SoulBeast;
  arenaOpponent?: ArenaOpponent;
  isSlaughterBoss?: boolean;
  godTest?: GodTest;
}

export default function App() {
  // 1. Player State with Save/Load
  const [player, setPlayer] = useState<Player>(() => {
    const saved = loadPlayer();
    if (saved) return saved;
    return createRandomPlayer();
  });

  // 2. Navigation State
  const [currentView, setCurrentView] = useState<GameView>('character');

  // 3. Modals State
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isAwakeningOpen, setIsAwakeningOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMeditationOpen, setIsMeditationOpen] = useState(false);
  const [isAutoOfflineNotice, setIsAutoOfflineNotice] = useState(false);
  const [absorbingBeast, setAbsorbingBeast] = useState<SoulBeast | null>(null);

  // Auto Offline Meditation Check on Mount
  useEffect(() => {
    const now = Date.now();
    if (!player.lastMeditationTime) {
      setPlayer(prev => ({ ...prev, lastMeditationTime: now }));
    } else {
      const offlineSeconds = Math.floor((now - player.lastMeditationTime) / 1000);
      // Auto trigger offline meditation modal if offline for > 120 seconds (2 minutes)
      if (offlineSeconds >= 120) {
        setIsMeditationOpen(true);
        setIsAutoOfflineNotice(true);
      }
    }
  }, []);

  // 4. Combat State
  const [inCombat, setInCombat] = useState(false);
  const [combatEnemy, setCombatEnemy] = useState<CombatEntity | null>(null);
  const [combatTitle, setCombatTitle] = useState<string>('切磋决斗');
  const [combatContext, setCombatContext] = useState<CombatContext | null>(null);

  // 5. Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'gold' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'gold' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 3500);
  }, []);

  // Save on change
  useEffect(() => {
    savePlayer(player);
  }, [player]);

  // Level Up / Exp Handling
  const addExpAndGold = useCallback((exp: number, gold: number) => {
    setPlayer(prev => {
      let currentExp = prev.currentExp + exp;
      let expNeeded = prev.expNeeded;
      let level = prev.level;
      let leveledUp = false;

      // Check for level caps tied to Soul Ring counts
      const activeSoul = prev.martialSouls[prev.activeSoulIndex] || prev.martialSouls[0];
      const maxPossibleLevel = (activeSoul.skills.length + 1) * 10;

      while (currentExp >= expNeeded && level < 100) {
        if (level >= maxPossibleLevel) {
          // Level capped until absorbing next soul ring!
          currentExp = expNeeded - 1;
          break;
        }

        currentExp -= expNeeded;
        level += 1;
        expNeeded = Math.floor(expNeeded * 1.25) + 50;
        leveledUp = true;
      }

      if (leveledUp) {
        SoundEngine.playLevelUp();
        const rank = getSoulRankTitle(level);
        showToast(`🎉 恭喜！魂力等级提升至 Lv.${level}【${rank.title}】！`, 'success');
        try {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        } catch {}
      }

      return {
        ...prev,
        level,
        currentExp,
        expNeeded,
        gold: prev.gold + gold
      };
    });
  }, [showToast]);

  // =========================================================================
  // Combat Handlers
  // =========================================================================

  // 1. Forest Hunting
  const handleInitiateForestCombat = (beast: SoulBeast, entity: CombatEntity) => {
    SoundEngine.playCombatStart();
    setCombatEnemy(entity);
    setCombatTitle(`星斗大森林·猎杀【${beast.name}】(${beast.years.toLocaleString()}年)`);
    setCombatContext({ type: 'forest', beast });
    setInCombat(true);
  };

  // 2. Soto Great Soul Arena
  const handleInitiateArenaDuel = (opponent: ArenaOpponent, entity: CombatEntity) => {
    SoundEngine.playCombatStart();
    setCombatEnemy(entity);
    setCombatTitle(`索托大斗魂场·对决【${opponent.name}】(${opponent.title})`);
    setCombatContext({ type: 'arena', arenaOpponent: opponent });
    setInCombat(true);
  };

  // 3. Slaughter City Combat
  const handleInitiateSlaughterCombat = (enemy: CombatEntity, isBoss: boolean) => {
    SoundEngine.playCombatStart();
    setCombatEnemy(enemy);
    setCombatTitle(isBoss ? `地狱路·终极试炼【暗金三头蝙蝠王 & 十首烈阳蛇】` : `杀戮之都·地狱杀戮场 (第${(player.slaughterStreak || 0) + 1}战)`);
    setCombatContext({ type: 'slaughter', isSlaughterBoss: isBoss });
    setInCombat(true);
  };

  // 4. Divine God Trials
  const handleInitiateGodBossCombat = (test: GodTest, entity: CombatEntity) => {
    SoundEngine.playCombatStart();
    setCombatEnemy(entity);
    setCombatTitle(`神位试炼·【第${test.level}考：${test.title}】`);
    setCombatContext({ type: 'god_test', godTest: test });
    setInCombat(true);
  };

  // Combat Victory
  const handleCombatVictory = (
    rewardExp: number, 
    rewardGold: number, 
    droppedItems: any[], 
    defeatedEntity: CombatEntity
  ) => {
    setInCombat(false);
    SoundEngine.playVictory();

    addExpAndGold(rewardExp, rewardGold);

    // Process dropped materials from defeated entity (Forest beasts, Arena opponents, etc.)
    if (droppedItems && droppedItems.length > 0) {
      setPlayer(prev => {
        const currentInv = [...prev.inventory];
        const currentMetals = { ...(prev.divineMetals || {}) };
        const gainedDescriptions: string[] = [];

        for (const drop of droppedItems) {
          const itemName = drop.name || drop.itemId;
          const count = drop.count || 1;

          // Check if divine metal
          if (['百炼精金', '灵锻秘银', '魂锻赤金', '天锻神金', '至高超神源石'].includes(itemName)) {
            currentMetals[itemName] = (currentMetals[itemName] || 0) + count;
            gainedDescriptions.push(`${itemName} x${count}`);
          } else {
            const idx = currentInv.findIndex(i => i.id === drop.itemId || i.name === itemName);
            if (idx >= 0) {
              currentInv[idx] = {
                ...currentInv[idx],
                quantity: currentInv[idx].quantity + count
              };
            } else {
              currentInv.push({
                id: drop.itemId,
                name: itemName,
                type: 'material',
                quantity: count,
                description: '战斗战利品中斩获的稀有神材原料',
                icon: itemName.includes('毒') || itemName.includes('胆') ? 'Skull' : 'Hammer',
                price: 60
              });
            }
            gainedDescriptions.push(`${itemName} x${count}`);
          }
        }

        if (gainedDescriptions.length > 0) {
          showToast(`🎁 战利品掉落：斩获【${gainedDescriptions.join('、')}】！已存入背包/神金库！`, 'gold');
        }

        return {
          ...prev,
          inventory: currentInv,
          divineMetals: currentMetals
        };
      });
    }

    const ctx = combatContext;
    setCombatContext(null);
    setCombatEnemy(null);

    // Context specific victory actions
    if (ctx?.type === 'forest' && ctx.beast) {
      const activeSoul = player.martialSouls[player.activeSoulIndex] || player.martialSouls[0];
      if (activeSoul.skills.length < 9) {
        // Prompt for soul ring absorption
        setAbsorbingBeast(ctx.beast);
      } else {
        showToast(`击败 ${ctx.beast.name}！当前武魂九环已满，获得 ${rewardGold} 金魂币与 ${rewardExp} 修为！`, 'gold');
      }
    } else if (ctx?.type === 'arena' && ctx.arenaOpponent) {
      // Advance arena score and badge
      setPlayer(prev => {
        const newPoints = prev.arenaPoints + ctx.arenaOpponent!.rewardPoints;
        const newWins = prev.arenaWins + 1;
        let badge: ArenaBadge = prev.arenaBadge;

        if (newPoints >= 2000) badge = '钻石斗魂';
        else if (newPoints >= 1500) badge = '红宝石';
        else if (newPoints >= 1000) badge = '蓝宝石';
        else if (newPoints >= 700) badge = '紫金斗魂';
        else if (newPoints >= 450) badge = '金斗魂';
        else if (newPoints >= 250) badge = '银斗魂';
        else if (newPoints >= 100) badge = '铜斗魂';

        if (badge !== prev.arenaBadge) {
          showToast(`🏆 斗魂积分达成！荣获【${badge}】勋章！`, 'success');
        }

        return {
          ...prev,
          arenaPoints: newPoints,
          arenaWins: newWins,
          arenaBadge: badge
        };
      });
      showToast(`斗魂获胜！积分 +${ctx.arenaOpponent.rewardPoints}，获得 ${rewardGold} 金魂币！`, 'gold');
    } else if (ctx?.type === 'slaughter') {
      if (ctx.isSlaughterBoss) {
        // Defeated Hell Road Boss -> Gain Killing God Domain!
        setPlayer(prev => ({
          ...prev,
          hasKillingGodDomain: true,
          hasAsuraDomain: true,
          activeDomain: '杀神领域'
        }));
        showToast(`🩸 浴血闯过地狱路！成功领悟至高【杀神领域】与修罗神亲和！`, 'success');
        try {
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
        } catch {}
      } else {
        setPlayer(prev => ({
          ...prev,
          slaughterStreak: (prev.slaughterStreak || 0) + 1,
          slaughterScore: prev.slaughterScore + 100
        }));
        showToast(`地狱竞技场连胜 ${(player.slaughterStreak || 0) + 1} 场！杀气正在凝聚！`, 'info');
      }
    } else if (ctx?.type === 'god_test' && ctx.godTest) {
      handleCompleteGodTestDirectly(ctx.godTest);
    }
  };

  // Combat Defeat
  const handleCombatDefeat = () => {
    setInCombat(false);
    setCombatContext(null);
    setCombatEnemy(null);
    SoundEngine.playDefeat();
    showToast('魂力耗尽，切磋战败！休养生息后再战！', 'info');
  };

  // Complete God Test
  const handleCompleteGodTestDirectly = (test: GodTest) => {
    SoundEngine.playBreakthrough();
    try {
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.5 } });
    } catch {}

    setPlayer(prev => {
      let seaGodLvl = prev.seaGodTestLevel || 0;
      let asuraLvl = prev.asuraGodTestLevel || 0;
      let angelLvl = prev.angelGodTestLevel || 0;
      let rakshasaLvl = prev.rakshasaGodTestLevel || 0;
      let emotionLvl = prev.emotionGodTestLevel || 0;
      let dragonLvl = prev.dragonGodTestLevel || 0;

      let seaAff = prev.seaGodAffinity || 0;
      let asuraAff = prev.asuraGodAffinity || 0;
      let angelAff = prev.angelGodAffinity || 0;
      let rakshasaAff = prev.rakshasaGodAffinity || 0;
      let emotionAff = prev.emotionGodAffinity || 0;
      let dragonAff = prev.dragonGodAffinity || 0;

      let godPos = prev.godPosition;
      let hasDragonDomain = prev.hasDragonGodDomain || false;
      const artifacts = [...(prev.divineArtifacts || [])];

      if (test.godType === 'seagod') {
        seaGodLvl = Math.min(12, seaGodLvl + 1);
        seaAff = Math.min(100, seaAff + 15);
        if (seaGodLvl >= 7 && !artifacts.includes('海神三叉戟')) artifacts.push('海神三叉戟');
        if (seaGodLvl >= 9) {
          godPos = '海神';
          seaAff = 100;
        }
      } else if (test.godType === 'asura') {
        asuraLvl = Math.min(12, asuraLvl + 1);
        asuraAff = Math.min(100, asuraAff + 15);
        if (asuraLvl >= 7 && !artifacts.includes('修罗魔剑')) artifacts.push('修罗魔剑');
        if (asuraLvl >= 9) {
          godPos = godPos === '海神' ? '海神 & 修罗双神' : '修罗神';
          asuraAff = 100;
        }
      } else if (test.godType === 'angel') {
        angelLvl = Math.min(12, angelLvl + 1);
        angelAff = Math.min(100, angelAff + 15);
        if (angelLvl >= 7 && !artifacts.includes('天使圣剑')) artifacts.push('天使圣剑');
        if (angelLvl >= 9) {
          godPos = '天使神';
          angelAff = 100;
        }
      } else if (test.godType === 'rakshasa') {
        rakshasaLvl = Math.min(12, rakshasaLvl + 1);
        rakshasaAff = Math.min(100, rakshasaAff + 15);
        if (rakshasaLvl >= 7 && !artifacts.includes('罗刹魔镰')) artifacts.push('罗刹魔镰');
        if (rakshasaLvl >= 9) {
          godPos = '罗刹神';
          rakshasaAff = 100;
        }
      } else if (test.godType === 'emotion') {
        emotionLvl = Math.min(12, emotionLvl + 1);
        emotionAff = Math.min(100, emotionAff + 15);
        if (emotionLvl >= 7 && !artifacts.includes('永恒之眼')) artifacts.push('永恒之眼');
        if (emotionLvl >= 9) {
          godPos = '情绪之神';
          emotionAff = 100;
        }
      } else if (test.godType === 'dragongod') {
        dragonLvl = Math.min(12, dragonLvl + 1);
        dragonAff = Math.min(100, dragonAff + 15);
        if (dragonLvl >= 7 && !artifacts.includes('龙神枪')) artifacts.push('龙神枪');
        if (dragonLvl >= 9) {
          godPos = '至高龙神';
          dragonAff = 100;
          hasDragonDomain = true;
        }
      }

      showToast(`⚡ 神考通过！【${test.title}】完成！神性亲和度提升！获得 3 点神源点！`, 'success');

      return {
        ...prev,
        level: Math.max(prev.level, godPos ? 100 : prev.level + 2),
        seaGodTestLevel: seaGodLvl,
        asuraGodTestLevel: asuraLvl,
        angelGodTestLevel: angelLvl,
        rakshasaGodTestLevel: rakshasaLvl,
        emotionGodTestLevel: emotionLvl,
        dragonGodTestLevel: dragonLvl,
        seaGodAffinity: seaAff,
        asuraGodAffinity: asuraAff,
        angelGodAffinity: angelAff,
        rakshasaGodAffinity: rakshasaAff,
        emotionGodAffinity: emotionAff,
        dragonGodAffinity: dragonAff,
        hasDragonGodDomain: hasDragonDomain,
        godPosition: godPos,
        divineArtifacts: artifacts,
        divineSourcePoints: (prev.divineSourcePoints || 0) + 3
      };
    });
  };

  // Divine Talent Upgrade
  const handleUpgradeGodTalent = (godType: GodType, talentId: string) => {
    setPlayer(prev => {
      const pts = prev.divineSourcePoints || 0;
      if (pts <= 0) return prev;

      const currentTalents = prev.divineTalents || {};
      const godMap = currentTalents[godType] || {};
      const currentRank = godMap[talentId] || 0;

      const updatedGodMap = {
        ...godMap,
        [talentId]: currentRank + 1
      };

      const updatedTalents = {
        ...currentTalents,
        [godType]: updatedGodMap
      };

      showToast(`⚡ 点亮神术！【${godType}】神效属性得到升阶！`, 'success');

      return {
        ...prev,
        divineSourcePoints: pts - 1,
        divineTalents: updatedTalents
      };
    });
  };

  // Divine Talent Reset
  const handleResetGodTalents = (godType: GodType) => {
    setPlayer(prev => {
      const currentTalents = prev.divineTalents || {};
      const spent = getSpentPointsInGodTree(godType, currentTalents);
      if (spent <= 0) return prev;

      const updatedTalents = {
        ...currentTalents,
        [godType]: {}
      };

      showToast(`🔄 重置神树成功，返还 ${spent} 点神源！`, 'info');

      return {
        ...prev,
        divineSourcePoints: (prev.divineSourcePoints || 0) + spent,
        divineTalents: updatedTalents
      };
    });
  };

  // Soul Ring Absorption Success
  const handleAbsorbSuccess = (newSkill: SoulSkill, droppedBone?: SoulBone) => {
    setAbsorbingBeast(null);
    SoundEngine.playBreakthrough();

    setPlayer(prev => {
      const activeIdx = prev.activeSoulIndex;
      const updatedSouls = [...prev.martialSouls];
      const targetSoul = { ...updatedSouls[activeIdx] };

      targetSoul.skills = [...targetSoul.skills, newSkill];
      updatedSouls[activeIdx] = targetSoul;

      const updatedBones = { ...prev.soulBones };
      if (droppedBone) {
        if (!updatedBones[droppedBone.slot]) {
          updatedBones[droppedBone.slot] = droppedBone;
          showToast(`✨ 奇遇大爆发！获得并自动装备【${droppedBone.name}】！`, 'success');
        } else {
          showToast(`✨ 猎魂获得稀有魂骨【${droppedBone.name}】！`, 'gold');
        }
      }

      showToast(`🌟 成功吸收【第${targetSoul.skills.length}魂环】！领悟魂技：${newSkill.name}！`, 'success');

      return {
        ...prev,
        martialSouls: updatedSouls,
        soulBones: updatedBones,
        level: Math.min(100, prev.level + 3)
      };
    });
  };

  // Consume Immortal Herb
  const handleConsumeHerb = (herb: ImmortalHerb) => {
    setPlayer(prev => {
      const updatedHerbs = prev.immortalHerbs.map(h => 
        h.id === herb.id ? { ...h, consumed: true } : h
      );

      // Check for specific martial soul evolutions
      const updatedSouls = prev.martialSouls.map(soul => {
        if (herb.id === 'baji_ice' || herb.id === 'liehuo_apricot') {
          if (soul.id === 'blue_silver_grass' || soul.name.includes('蓝银')) {
            return {
              ...soul,
              id: 'blue_silver_emperor',
              name: '蓝银皇',
              chineseName: '蓝银皇',
              isEvolved: true
            };
          }
        }
        if (herb.id === 'cockscomb_phoenix') {
          if (soul.id === 'evil_fire_phoenix') {
            return {
              ...soul,
              chineseName: '九首十阳凤凰',
              isEvolved: true
            };
          }
        }
        if (herb.id === 'qirong_chrysanthemum') {
          if (soul.id === 'seven_treasure_pagoda') {
            return {
              ...soul,
              chineseName: '九宝琉璃塔',
              isEvolved: true
            };
          }
        }
        return soul;
      });

      return {
        ...prev,
        level: Math.min(100, prev.level + (herb.statsBoost.soulPowerLevel || 3)),
        immortalHerbs: updatedHerbs,
        martialSouls: updatedSouls
      };
    });
  };

  // Switch Martial Soul
  const handleSwitchMartialSoul = (idx: number) => {
    setPlayer(prev => ({
      ...prev,
      activeSoulIndex: idx
    }));
  };

  // Inherit Second Soul
  const handleAddSecondSoul = (soulId: string) => {
    const newSoul = ALL_MARTIAL_SOULS.find(s => s.id === soulId);
    if (!newSoul) return;

    setPlayer(prev => {
      if (prev.martialSouls.length >= 2) return prev;
      showToast(`🔥 绝世双生觉醒！获得第二武魂【${newSoul.chineseName}】！`, 'success');
      return {
        ...prev,
        martialSouls: [...prev.martialSouls, JSON.parse(JSON.stringify(newSoul))]
      };
    });
  };

  // Unequip Bone
  const handleUnequipBone = (slot: SoulBoneSlot) => {
    setPlayer(prev => {
      const updated = { ...prev.soulBones };
      delete updated[slot];
      showToast(`已卸下【${slot}】魂骨`, 'info');
      return {
        ...prev,
        soulBones: updated
      };
    });
  };

  // Reset Game / Awakening
  const handleResetGame = () => {
    setIsAwakeningOpen(true);
  };

  const handleAwakeningComplete = (newPlayer: Player) => {
    setPlayer(newPlayer);
    savePlayer(newPlayer);
    setIsAwakeningOpen(false);
    setCurrentView('character');
    SoundEngine.playBreakthrough();
    showToast(`✨ 武魂觉醒礼成！欢迎来到斗罗大陆，魂师【${newPlayer.name}】！`, 'success');
  };

  // Use Item from Inventory
  const handleUseItem = (item: Item) => {
    if (item.type === 'consumable') {
      setPlayer(prev => {
        const updatedInv = prev.inventory.map(invItem => {
          if (invItem.id === item.id) {
            return { ...invItem, quantity: Math.max(0, invItem.quantity - 1) };
          }
          return invItem;
        }).filter(invItem => invItem.quantity > 0);

        showToast(`使用了【${item.name}】！生命与气血大幅恢复！`, 'success');
        return {
          ...prev,
          inventory: updatedInv
        };
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none relative overflow-x-hidden">
      
      {/* BACKGROUND PARTICLES & GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-[32rem] h-[32rem] bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      {/* TOP NAVBAR (Always Visible) */}
      <Navbar 
        player={player}
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onResetGame={handleResetGame}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenMeditation={() => {
          setIsMeditationOpen(true);
          setIsAutoOfflineNotice(false);
        }}
        onChangeDifficulty={(diff) => {
          setPlayer(prev => ({ ...prev, worldDifficulty: diff }));
          showToast(`世界难度纪元已调整为：${diff === 'godlike' ? '深红极难 ⚡' : diff === 'nightmare' ? '修罗地狱 🔥' : '凡俗之路'}`);
        }}
      />

      {/* TOAST FLOATING BANNER */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-black border shadow-2xl backdrop-blur-md flex items-center gap-2 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : toastMessage.type === 'gold'
                ? 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                : 'bg-slate-900/90 border-cyan-500 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
            }`}>
              <span>{toastMessage.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-6 relative z-10">
        <AnimatePresence mode="wait">
          {inCombat && combatEnemy ? (
            /* ACTIVE COMBAT ARENA VIEW */
            <motion.div
              key="combat_arena"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <CombatArenaView 
                player={player}
                enemyEntity={combatEnemy}
                combatTitle={combatTitle}
                onVictory={handleCombatVictory}
                onDefeat={handleCombatDefeat}
                onEscape={() => {
                  setInCombat(false);
                  setCombatContext(null);
                  setCombatEnemy(null);
                  showToast('迅速撤退脱离战场！', 'info');
                }}
              />
            </motion.div>
          ) : (
            /* TAB VIEWS */
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {currentView === 'character' && (
                <CharacterPanel 
                  player={player}
                  onSwitchMartialSoul={handleSwitchMartialSoul}
                  onAddOrChangeSecondSoul={handleAddSecondSoul}
                  onUnequipBone={handleUnequipBone}
                  onUpdateAvatar={(newAvatarUrl) => {
                    setPlayer(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
                    showToast('形象幻化成功！', 'success');
                  }}
                  onNavigateToGuide={() => setCurrentView('guide')}
                  onNavigateToTrials={() => setCurrentView('seagod')}
                  onUpdatePlayer={(updater) => setPlayer(updater)}
                  onOpenMeditation={() => {
                    setIsMeditationOpen(true);
                    setIsAutoOfflineNotice(false);
                  }}
                  onOpenAwakening={() => setIsAwakeningOpen(true)}
                  showToast={(msg, type) => showToast(msg, type === 'warning' ? 'gold' : type === 'success' ? 'success' : 'info')}
                />
              )}

              {currentView === 'multiplayer' && (
                <MultiplayerArenaView 
                  player={player}
                  onUpdatePlayer={(updater) => setPlayer(updater)}
                  onShowToast={(msg, type) => showToast(msg, type === 'gold' ? 'gold' : type === 'success' ? 'success' : 'info')}
                />
              )}

              {currentView === 'guide' && (
                <GameGuideView 
                  player={player}
                  onNavigateToView={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'spiritpagoda' && (
                <SpiritPagodaView 
                  player={player}
                  onUpdatePlayer={(updater) => setPlayer(updater)}
                  showToast={(msg, type) => showToast(msg, type === 'warning' ? 'gold' : type === 'success' ? 'success' : 'info')}
                  onNavigateToGathering={() => setCurrentView('gathering')}
                />
              )}

              {currentView === 'interstellar' && (
                <InterstellarHangarView 
                  player={player}
                  onUpdatePlayer={(updater) => setPlayer(updater)}
                  showToast={(msg, type) => showToast(msg, type === 'warning' ? 'gold' : type === 'success' ? 'success' : 'info')}
                  onNavigateToView={(view) => setCurrentView(view as GameView)}
                />
              )}

              {currentView === 'battlearmor' && (
                <BattleArmorForgeView 
                  player={player}
                  onUpdatePlayer={(updater) => setPlayer(updater)}
                  showToast={(msg, type) => showToast(msg, type === 'warning' ? 'gold' : type === 'success' ? 'success' : 'info')}
                  onNavigateToGathering={() => setCurrentView('gathering')}
                />
              )}

              {currentView === 'gathering' && (
                <MaterialGatheringView 
                  player={player}
                  onUpdatePlayer={(updater) => setPlayer(updater)}
                  showToast={(msg, type) => showToast(msg, type === 'warning' ? 'gold' : type === 'success' ? 'success' : 'info')}
                  onNavigateToView={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'companions' && (
                <Douluo4CompanionsView 
                  player={player}
                  onUpdatePlayer={(updater) => setPlayer(updater)}
                  showToast={(msg, type) => showToast(msg, type === 'warning' ? 'gold' : type === 'success' ? 'success' : 'info')}
                />
              )}

              {currentView === 'tournament' && (
                <ContinentalTournamentView 
                  player={player}
                  onUpdatePlayer={(updater) => setPlayer(updater)}
                  showToast={(msg, type) => showToast(msg, type === 'warning' ? 'gold' : type === 'success' ? 'success' : 'info')}
                />
              )}

              {currentView === 'soulbones' && (
                <SoulBoneSanctuaryView 
                  player={player}
                  onUpdatePlayer={(updater) => setPlayer(updater)}
                  showToast={(msg, type) => showToast(msg, type === 'warning' ? 'gold' : type === 'success' ? 'success' : 'info')}
                />
              )}

              {currentView === 'forest' && (
                <ForestHuntingView 
                  player={player}
                  onInitiateCombat={handleInitiateForestCombat}
                  onUpdatePlayer={(updater) => setPlayer(updater)}
                  showToast={(msg, type) => showToast(msg, type === 'warning' ? 'gold' : type === 'success' ? 'success' : 'info')}
                />
              )}

              {currentView === 'arena' && (
                <GreatSoulArenaView 
                  player={player}
                  onChallengeOpponent={handleInitiateArenaDuel}
                />
              )}

              {currentView === 'tangsect' && (
                <TangSectForgeView 
                  player={player}
                  onUpdatePlayer={(updater) => setPlayer(updater)}
                  showToast={(msg, type) => showToast(msg, type === 'warning' ? 'gold' : type === 'success' ? 'success' : 'info')}
                  onUpdateTangSectSkills={(skills) => {
                    setPlayer(prev => ({ ...prev, tangSectSkills: skills }));
                  }}
                  onUpdateHiddenWeapons={(weapons, costGold) => {
                    setPlayer(prev => ({
                      ...prev,
                      gold: Math.max(0, prev.gold - costGold),
                      hiddenWeapons: weapons
                    }));
                  }}
                  onNavigateToGathering={() => setCurrentView('gathering')}
                />
              )}

              {currentView === 'icefire' && (
                <IceFireWellView 
                  player={player}
                  onConsumeHerb={handleConsumeHerb}
                />
              )}

              {currentView === 'slaughter' && (
                <SlaughterCityView 
                  player={player}
                  onInitiateSlaughterCombat={handleInitiateSlaughterCombat}
                  onAcquireKillingDomain={() => {
                    setPlayer(prev => ({
                      ...prev,
                      hasKillingGodDomain: true,
                      activeDomain: '杀神领域'
                    }));
                    showToast('领悟杀神领域！全属性大幅暴涨！', 'success');
                  }}
                />
              )}

              {currentView === 'seagod' && (
                <DivineGodTrialsView 
                  player={player}
                  onInitiateGodBossCombat={handleInitiateGodBossCombat}
                  onCompleteGodTestDirectly={handleCompleteGodTestDirectly}
                  onUpgradeGodTalent={handleUpgradeGodTalent}
                  onResetGodTalents={handleResetGodTalents}
                />
              )}

              {currentView === 'academy' && (
                <MasterAcademyView 
                  player={player}
                  onMeditateGainExp={(exp) => addExpAndGold(exp, Math.floor(exp * 0.3))}
                  onBreakthroughRank={() => {
                    setPlayer(prev => ({
                      ...prev,
                      level: Math.min(100, prev.level + 1)
                    }));
                  }}
                  onUpdatePlayer={(updater) => setPlayer(updater)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* INVENTORY MODAL */}
      {isInventoryOpen && (
        <InventoryModal 
          player={player}
          onClose={() => setIsInventoryOpen(false)}
          onUseItem={handleUseItem}
        />
      )}

      {/* AWAKENING MODAL (武魂觉醒) */}
      <AwakeningModal 
        isOpen={isAwakeningOpen}
        onClose={() => setIsAwakeningOpen(false)}
        onAwakenPlayer={handleAwakeningComplete}
      />

      {/* SOUL RING ABSORPTION MODAL */}
      {absorbingBeast && (
        <SoulRingAbsorbModal 
          beast={absorbingBeast}
          currentRingsCount={player.martialSouls[player.activeSoulIndex]?.skills.length || 0}
          playerLevel={player.level}
          onAbsorbSuccess={handleAbsorbSuccess}
          onCancel={() => {
            setAbsorbingBeast(null);
            showToast('放弃吸收该魂环。', 'info');
          }}
        />
      )}

      {/* GLOBAL CHAT DRAWER (跨服千里传音阁) */}
      <GlobalChatDrawer 
        player={player}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* MEDITATION AFK MODAL (静心冥想挂机) */}
      {isMeditationOpen && (
        <MeditationModal 
          player={player}
          onUpdatePlayer={(updater) => setPlayer(updater)}
          onAddExpAndGold={addExpAndGold}
          onClose={() => setIsMeditationOpen(false)}
          showToast={(msg, type) => showToast(msg, type === 'gold' ? 'gold' : type === 'success' ? 'success' : 'info')}
          isAutoOfflineNotice={isAutoOfflineNotice}
        />
      )}

    </div>
  );
}
