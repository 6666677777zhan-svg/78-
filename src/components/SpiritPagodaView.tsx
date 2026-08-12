import React, { useState } from 'react';
import { Player } from '../types/game';
import { 
  SpiritSoul, 
  SpiritAscensionStage, 
  SpiritBeastSanctuaryZone, 
  MechaCraftingRecipe, 
  SpiritPagodaState,
  MechaGrade 
} from '../types/spiritPagoda';
import { 
  PAGODA_RANKS, 
  INITIAL_SPIRIT_SOULS, 
  INITIAL_ASCENSION_STAGES, 
  INITIAL_SANCTUARIES, 
  INITIAL_CRAFTABLE_MECHAS,
  createInitialSpiritPagodaState 
} from '../data/spiritPagodaData';
import { SoundEngine } from '../utils/audio';
import { calculatePlayerStats } from '../utils/saveManager';
import confetti from 'canvas-confetti';
import { 
  Building2, Sparkles, Flame, Shield, Swords, Zap, 
  Crown, Heart, Eye, ArrowUpCircle, CheckCircle2, 
  AlertTriangle, RefreshCw, Cpu, Trophy, Users, 
  Coins, Gem, Skull, Compass, TreePine, Crosshair,
  Feather, ShieldAlert, Award, Bot, ChevronRight
} from 'lucide-react';

interface SpiritPagodaViewProps {
  player: Player;
  onUpdatePlayer: (updater: (prev: Player) => Player) => void;
  showToast?: (msg: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  onNavigateToGathering?: () => void;
}

export const SpiritPagodaView: React.FC<SpiritPagodaViewProps> = ({
  player,
  onUpdatePlayer,
  showToast,
  onNavigateToGathering
}) => {
  const [activeTab, setActiveTab] = useState<'halls' | 'souls' | 'ascension' | 'mecha' | 'sanctuary'>('souls');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Selected Soul for Detail Modal
  const [selectedSoul, setSelectedSoul] = useState<SpiritSoul | null>(null);

  // Ascension Combat State
  const [activeAscensionStage, setActiveAscensionStage] = useState<SpiritAscensionStage | null>(null);
  const [isAscensionBattleActive, setIsAscensionBattleActive] = useState<boolean>(false);
  const [ascBossHp, setAscBossHp] = useState<number>(0);
  const [ascPlayerHp, setAscPlayerHp] = useState<number>(0);
  const [ascPlayerShield, setAscPlayerShield] = useState<number>(0);
  const [ascBattleLogs, setAscBattleLogs] = useState<{ id: string; text: string; type: 'player' | 'soul' | 'boss' | 'system' | 'crit' }[]>([]);
  const [ascTurn, setAscTurn] = useState<number>(1);

  // Ensure pagoda state is loaded
  const pagoda: SpiritPagodaState = player.spiritPagoda || createInitialSpiritPagodaState();
  const playerStats = calculatePlayerStats(player);
  const currentRank = PAGODA_RANKS.find(r => r.level === pagoda.pagodaLevel) || PAGODA_RANKS[0];
  const nextRank = PAGODA_RANKS.find(r => r.level === pagoda.pagodaLevel + 1);

  const notify = (msg: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
    setStatusMsg(msg);
    if (showToast) showToast(msg, type);
  };

  // 1. Claim Daily Spirit Rain (领受万兽祈灵甘霖)
  const handleClaimSpiritRain = () => {
    SoundEngine.playCoins();
    const goldGain = currentRank.dailyRainGold + Math.floor(pagoda.spiritBeastPeaceIndex * 80);
    const crystalsGain = currentRank.dailyRainCrystals + Math.floor(pagoda.spiritBeastPeaceIndex * 0.8);

    onUpdatePlayer(prev => {
      const p = prev.spiritPagoda || createInitialSpiritPagodaState();
      return {
        ...prev,
        gold: prev.gold + goldGain,
        spiritPagoda: {
          ...p,
          spiritCrystals: p.spiritCrystals + crystalsGain,
          lastPeaceRainClaimTimestamp: Date.now()
        }
      };
    });

    try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch {}
    notify(`✨ 领受【万兽祈灵甘霖】：获得 +${goldGain.toLocaleString()} 金魂币、+${crystalsGain} 升灵晶石！万兽祥瑞庇护！`, 'success');
  };

  // 2. Promote Pagoda Rank (传灵塔职级晋升)
  const handlePromoteRank = () => {
    if (!nextRank) {
      notify('您已登临传灵塔至尊巅峰【万古传灵总塔主】！', 'info');
      return;
    }

    if (pagoda.pagodaMerits < nextRank.meritRequired || player.gold < nextRank.goldRequired || pagoda.spiritCrystals < nextRank.crystalsRequired) {
      notify(`晋升条件不足！需要 ${nextRank.meritRequired} 功勋、${nextRank.goldRequired.toLocaleString()} 金币 与 ${nextRank.crystalsRequired} 升灵晶石！`, 'warning');
      return;
    }

    SoundEngine.playBreakthrough();
    try { confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } }); } catch {}

    onUpdatePlayer(prev => {
      const p = prev.spiritPagoda || createInitialSpiritPagodaState();
      return {
        ...prev,
        gold: prev.gold - nextRank.goldRequired,
        spiritPagoda: {
          ...p,
          pagodaLevel: nextRank.level,
          pagodaTitle: nextRank.title,
          spiritCrystals: p.spiritCrystals - nextRank.crystalsRequired,
          spiritBeastPeaceIndex: Math.min(100, p.spiritBeastPeaceIndex + 5)
        }
      };
    });

    notify(`👑 恭贺晋升为【${nextRank.title}】！执掌传灵塔更高权限，万兽和平指数与每日甘霖大幅提升！`, 'success');
  };

  // 3. Contract Spirit Soul (缔结魂灵共生契约)
  const handleContractSoul = (soul: SpiritSoul) => {
    if (soul.isContracted) return;

    if (pagoda.pagodaLevel < soul.contractCost.requiredPagodaRank) {
      notify(`需要传灵塔职级达到 Lv.${soul.contractCost.requiredPagodaRank} 才能与【${soul.name}】缔结灵魂契约！`, 'warning');
      return;
    }

    if (player.gold < soul.contractCost.gold || pagoda.spiritCrystals < soul.contractCost.spiritCrystals) {
      notify(`契约资源不足！需要 ${soul.contractCost.gold.toLocaleString()} 金币 与 ${soul.contractCost.spiritCrystals} 升灵晶石！`, 'warning');
      return;
    }

    SoundEngine.playBreakthrough();
    try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch {}

    onUpdatePlayer(prev => {
      const p = prev.spiritPagoda || createInitialSpiritPagodaState();
      const updatedSouls = p.spiritSouls.map(s => {
        if (s.id === soul.id) {
          return { ...s, isContracted: true };
        }
        return s;
      });

      // Auto-assign to battling if slots available
      const activeIds = [...p.activeBattlingSoulIds];
      if (activeIds.length < 3 && !activeIds.includes(soul.id)) {
        activeIds.push(soul.id);
      }

      return {
        ...prev,
        gold: prev.gold - soul.contractCost.gold,
        spiritPagoda: {
          ...p,
          spiritCrystals: p.spiritCrystals - soul.contractCost.spiritCrystals,
          pagodaMerits: p.pagodaMerits + 200,
          totalSoulBeastsSaved: p.totalSoulBeastsSaved + 1,
          spiritSouls: updatedSouls,
          activeBattlingSoulIds: activeIds
        }
      };
    });

    notify(`🤝 契约达成！【${soul.name}】感念和平之愿，化作本命魂灵与您并肩作战！`, 'success');
  };

  // 4. Toggle Battling Soul (派遣/下阵并肩作战魂灵)
  const handleToggleBattleSoul = (soulId: string) => {
    SoundEngine.playClick();
    onUpdatePlayer(prev => {
      const p = prev.spiritPagoda || createInitialSpiritPagodaState();
      let activeIds = [...p.activeBattlingSoulIds];

      if (activeIds.includes(soulId)) {
        activeIds = activeIds.filter(id => id !== soulId);
      } else {
        if (activeIds.length >= 3) {
          notify('出战并肩作战魂灵已达上限（最多 3 位），请先下阵一位魂灵！', 'warning');
          return prev;
        }
        activeIds.push(soulId);
      }

      const updatedSouls = p.spiritSouls.map(s => ({
        ...s,
        isBattling: activeIds.includes(s.id)
      }));

      return {
        ...prev,
        spiritPagoda: {
          ...p,
          activeBattlingSoulIds: activeIds,
          spiritSouls: updatedSouls
        }
      };
    });
  };

  // 5. Upgrade / Evolve Spirit Soul (魂灵年份淬炼与升阶)
  const handleEvolveSoul = (soul: SpiritSoul) => {
    if (!soul.isContracted) {
      notify('请先与魂灵缔结契约！', 'warning');
      return;
    }

    if (soul.level >= 10) {
      notify(`【${soul.name}】已达到至高十阶神灵圆满之境！`, 'info');
      return;
    }

    const costCrystals = soul.evolutionCost.spiritCrystals * soul.level;
    const costGold = soul.evolutionCost.gold * soul.level;

    if (pagoda.spiritCrystals < costCrystals || player.gold < costGold) {
      notify(`升阶所需晶石或金币不足！需要 ${costCrystals} 晶石 与 ${costGold.toLocaleString()} 金币！`, 'warning');
      return;
    }

    SoundEngine.playBreakthrough();
    try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } }); } catch {}

    onUpdatePlayer(prev => {
      const p = prev.spiritPagoda || createInitialSpiritPagodaState();
      const updatedSouls = p.spiritSouls.map(s => {
        if (s.id === soul.id) {
          const newLevel = s.level + 1;
          const yearsInc = Math.floor(s.years * 0.15 + 5000);
          return {
            ...s,
            level: newLevel,
            years: s.years + yearsInc,
            statsBonus: {
              atk: Math.floor(s.statsBonus.atk * 1.25 + 200),
              def: Math.floor(s.statsBonus.def * 1.25 + 150),
              hp: Math.floor(s.statsBonus.hp * 1.25 + 2500),
              speed: Math.floor(s.statsBonus.speed * 1.15 + 15),
              critRate: s.statsBonus.critRate + 1.0
            },
            spiritSkill: {
              ...s.spiritSkill,
              damageMultiplier: Number((s.spiritSkill.damageMultiplier + 0.3).toFixed(1))
            }
          };
        }
        return s;
      });

      return {
        ...prev,
        gold: prev.gold - costGold,
        spiritPagoda: {
          ...p,
          spiritCrystals: p.spiritCrystals - costCrystals,
          pagodaMerits: p.pagodaMerits + 50,
          spiritSouls: updatedSouls
        }
      };
    });

    notify(`🔥 【${soul.name}】突破升阶至 Lv.${soul.level + 1}！年限修为增长，神技威能大幅提升！`, 'success');
  };

  // 6. Ascension Platform Battle Engine (升灵台模拟历练决战)
  const handleStartAscensionTrial = (stage: SpiritAscensionStage) => {
    SoundEngine.playSmash();
    setActiveAscensionStage(stage);
    setAscBossHp(stage.bossHp);
    setAscPlayerHp(playerStats.maxHp || 120000);
    setAscPlayerShield(35000 + pagoda.pagodaLevel * 10000);
    setAscTurn(1);
    setIsAscensionBattleActive(true);
    setAscBattleLogs([
      { id: '1', text: `🌀 进入【${stage.name}】！灵力矩阵激活，虚拟凶兽【${stage.bossName}】降临！`, type: 'system' },
      { id: '2', text: `✨ 传灵塔护罩启动，为您加持 ${ (35000 + pagoda.pagodaLevel * 10000).toLocaleString() } 点升灵结界护盾！`, type: 'system' }
    ]);
  };

  // Ascension Action (Player + Active Spirit Souls Assist)
  const handleAscensionAction = (action: 'master_attack' | 'soul_skill' | 'mecha_cannon' | 'purify') => {
    if (!activeAscensionStage || !isAscensionBattleActive) return;

    const pAtk = playerStats.atk || 8000;
    let pDamage = 0;
    let logText = '';
    let isCrit = false;

    // 1. Master & Souls Action
    if (action === 'master_attack') {
      pDamage = Math.floor(pAtk * (1.3 + Math.random() * 0.4));
      logText = `⚡ 魂师释放武魂神技，轰击【${activeAscensionStage.bossName}】，造成 ${pDamage.toLocaleString()} 点伤害！`;
    } else if (action === 'soul_skill') {
      // Trigger all active battling spirit souls!
      const activeSouls = pagoda.spiritSouls.filter(s => pagoda.activeBattlingSoulIds.includes(s.id));
      if (activeSouls.length === 0) {
        pDamage = Math.floor(pAtk * 1.5);
        logText = `💫 精神力凝聚震荡，造成 ${pDamage.toLocaleString()} 点基础冲击伤害！`;
      } else {
        const soul = activeSouls[Math.floor(Math.random() * activeSouls.length)];
        pDamage = Math.floor(pAtk * soul.spiritSkill.damageMultiplier + 25000);
        isCrit = true;
        logText = `❄️ 魂灵【${soul.name}】实体显现！并肩施展神技【${soul.spiritSkill.name}】，冰火雷芒引爆造成 ${pDamage.toLocaleString()} 点巨额暴击伤害！`;
      }
    } else if (action === 'mecha_cannon') {
      const activeMecha = pagoda.craftedMechas.find(m => m.id === pagoda.activeMechaId && m.isCrafted);
      if (activeMecha) {
        pDamage = Math.floor(pAtk * activeMecha.mechaWeapon.dmgMultiplier + 45000);
        isCrit = true;
        logText = `🤖 驾驶【${activeMecha.name}】引爆机甲重炮【${activeMecha.mechaWeapon.name}】，轰出 ${pDamage.toLocaleString()} 点超能贯穿真伤！`;
      } else {
        pDamage = Math.floor(pAtk * 1.8);
        logText = `🔫 启动标准机甲魂导副炮，射出能量弹造成 ${pDamage.toLocaleString()} 点伤害！`;
      }
    } else if (action === 'purify') {
      const healAmt = 30000 + pagoda.pagodaLevel * 8000;
      setAscPlayerHp(prev => Math.min(playerStats.maxHp || 120000, prev + healAmt));
      setAscPlayerShield(prev => prev + 25000);
      logText = `🌿 运转翡翠天鹅生灵治愈之光，恢复了 ${healAmt.toLocaleString()} 点生命，并修补 25,000 点结界护盾！`;
    }

    SoundEngine.playSmash();

    // Deduct Boss HP
    const newBossHp = Math.max(0, ascBossHp - pDamage);
    setAscBossHp(newBossHp);

    const newLogs = [
      ...ascBattleLogs,
      { id: `${Date.now()}_p`, text: logText, type: isCrit ? 'crit' as const : 'player' as const }
    ];

    // Check Boss Defeat
    if (newBossHp <= 0) {
      SoundEngine.playVictory();
      try { confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } }); } catch {}

      newLogs.push({
        id: `${Date.now()}_win`,
        text: `🏆 历练大捷！成功通关【${activeAscensionStage.name}】！击溃【${activeAscensionStage.bossName}】！`,
        type: 'system'
      });
      setAscBattleLogs(newLogs);
      setIsAscensionBattleActive(false);

      // Reward Player
      const r = activeAscensionStage.rewards;
      onUpdatePlayer(prev => {
        const p = prev.spiritPagoda || createInitialSpiritPagodaState();
        
        // Enhance all contracted spirit souls years!
        const updatedSouls = p.spiritSouls.map(s => {
          if (s.isContracted) {
            return { ...s, years: s.years + r.yearsGain };
          }
          return s;
        });

        return {
          ...prev,
          currentExp: prev.currentExp + r.exp,
          gold: prev.gold + r.gold,
          spiritPagoda: {
            ...p,
            spiritCrystals: p.spiritCrystals + r.spiritCrystals,
            pagodaMerits: p.pagodaMerits + 100,
            spiritBeastPeaceIndex: Math.min(100, p.spiritBeastPeaceIndex + r.peaceIndexGain),
            ascensionClearedCount: p.ascensionClearedCount + 1,
            spiritSouls: updatedSouls
          }
        };
      });

      notify(`🏆 升灵台挑战大捷！获得 +${r.spiritCrystals} 升灵晶石、全魂灵年限提升 +${r.yearsGain} 年！`, 'success');
      return;
    }

    // Boss Turn
    const bossDmg = Math.floor((activeAscensionStage.bossAtk || 5000) * (0.85 + Math.random() * 0.3));
    let newShield = ascPlayerShield;
    let newHp = ascPlayerHp;

    if (newShield > 0) {
      if (bossDmg <= newShield) {
        newShield -= bossDmg;
      } else {
        const rem = bossDmg - newShield;
        newShield = 0;
        newHp = Math.max(0, newHp - rem);
      }
    } else {
      newHp = Math.max(0, newHp - bossDmg);
    }

    setAscPlayerShield(newShield);
    setAscPlayerHp(newHp);

    newLogs.push({
      id: `${Date.now()}_boss`,
      text: `💥 【${activeAscensionStage.bossName}】发动凶兽狂暴冲击，造成 ${bossDmg.toLocaleString()} 点伤害！`,
      type: 'boss'
    });

    if (newHp <= 0) {
      newLogs.push({
        id: `${Date.now()}_lose`,
        text: `⚠️ 结界破碎，传灵阵法强行将魂师传送出升灵台！`,
        type: 'system'
      });
      setIsAscensionBattleActive(false);
    }

    setAscBattleLogs(newLogs);
    setAscTurn(prev => prev + 1);
  };

  // 7. Mecha Forging & Piloting (机甲神造工坊)
  const handleCraftMecha = (recipe: MechaCraftingRecipe) => {
    if (recipe.isCrafted) return;

    // Check costs
    const playerMetals = player.divineMetals || {};
    let hasMetals = true;
    let missingMetalDesc = '';

    Object.entries(recipe.craftCost.metals).forEach(([metalName, count]) => {
      if ((playerMetals[metalName] || 0) < count) {
        hasMetals = false;
        missingMetalDesc = `缺少金属【${metalName}】需 ${count} 块 (当前拥有 ${playerMetals[metalName] || 0})`;
      }
    });

    if (!hasMetals) {
      notify(`神材不足！${missingMetalDesc}，可前往神材宝地采矿！`, 'warning');
      return;
    }

    if (player.gold < recipe.craftCost.gold || pagoda.spiritCrystals < recipe.craftCost.spiritCrystals) {
      notify(`制造资金或晶石不足！需要 ${recipe.craftCost.gold.toLocaleString()} 金币 与 ${recipe.craftCost.spiritCrystals} 晶石！`, 'warning');
      return;
    }

    SoundEngine.playSmash();
    try { confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } }); } catch {}

    onUpdatePlayer(prev => {
      const p = prev.spiritPagoda || createInitialSpiritPagodaState();
      const updatedMetals = { ...(prev.divineMetals || {}) };

      Object.entries(recipe.craftCost.metals).forEach(([metalName, count]) => {
        updatedMetals[metalName] = Math.max(0, (updatedMetals[metalName] || 0) - count);
      });

      const updatedMechas = p.craftedMechas.map(m => {
        if (m.id === recipe.id) {
          return { ...m, isCrafted: true, isEquipped: true };
        }
        return { ...m, isEquipped: false }; // Auto-equip newly crafted
      });

      return {
        ...prev,
        gold: prev.gold - recipe.craftCost.gold,
        divineMetals: updatedMetals,
        spiritPagoda: {
          ...p,
          spiritCrystals: p.spiritCrystals - recipe.craftCost.spiritCrystals,
          pagodaMerits: p.pagodaMerits + 300,
          craftedMechas: updatedMechas,
          activeMechaId: recipe.id
        }
      };
    });

    notify(`🤖 神机问世！成功制造【${recipe.name}】！机甲系统与魂师神经元已全息链接！`, 'success');
  };

  // Toggle Equip / Pilot Mecha
  const handleToggleEquipMecha = (mechaId: string) => {
    SoundEngine.playClick();
    onUpdatePlayer(prev => {
      const p = prev.spiritPagoda || createInitialSpiritPagodaState();
      const isAlreadyEquipped = p.activeMechaId === mechaId;
      const newActiveId = isAlreadyEquipped ? null : mechaId;

      const updatedMechas = p.craftedMechas.map(m => ({
        ...m,
        isEquipped: m.id === newActiveId
      }));

      return {
        ...prev,
        spiritPagoda: {
          ...p,
          activeMechaId: newActiveId,
          craftedMechas: updatedMechas
        }
      };
    });
  };

  // 8. Sanctuary Patrol & Donation (魂兽生态保护区)
  const handleDonateSanctuary = (zone: SpiritBeastSanctuaryZone) => {
    if (player.gold < zone.donateCostGold) {
      notify(`捐献金币不足！需要 ${zone.donateCostGold.toLocaleString()} 金魂币！`, 'warning');
      return;
    }

    SoundEngine.playCoins();
    onUpdatePlayer(prev => {
      const p = prev.spiritPagoda || createInitialSpiritPagodaState();
      const updatedZones = p.sanctuaries.map(z => {
        if (z.id === zone.id) {
          return {
            ...z,
            peaceLevel: Math.min(100, z.peaceLevel + 6),
            sanctuaryFunds: z.sanctuaryFunds + zone.donateCostGold
          };
        }
        return z;
      });

      return {
        ...prev,
        gold: prev.gold - zone.donateCostGold,
        spiritPagoda: {
          ...p,
          spiritBeastPeaceIndex: Math.min(100, p.spiritBeastPeaceIndex + 3),
          pagodaMerits: p.pagodaMerits + 80,
          totalSoulBeastsSaved: p.totalSoulBeastsSaved + 12,
          sanctuaries: updatedZones
        }
      };
    });

    notify(`🌿 成功向【${zone.name}】注入生态繁育资金！万兽感戴，和平指数与全队属性显著提升！`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HEADER BANNER & PAGODA STATUS */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-cyan-950/90 border border-emerald-500/40 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-400 rounded-2xl shadow-lg text-slate-950 font-black">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-100 tracking-wide">
                    【传灵塔】魂灵圣殿 & 现代机甲神造
                  </h1>
                  <span className="px-3 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow">
                    {currentRank.title} (Lv.{pagoda.pagodaLevel})
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  《绝世唐门》灵冰斗罗·霍雨浩所创！以灵魂契约终结血腥猎杀，让魂兽以【魂灵】形态与人类并肩作战，更研发尖端现代化机甲武装！
                </p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="flex flex-wrap gap-2.5 mt-4">
              <div className="px-3 py-1.5 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-xs flex items-center gap-2">
                <Gem className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400">升灵晶石:</span>
                <strong className="text-cyan-300">{pagoda.spiritCrystals.toLocaleString()}</strong>
              </div>
              <div className="px-3 py-1.5 bg-slate-950/80 border border-amber-500/30 rounded-xl text-xs flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400">传灵功勋:</span>
                <strong className="text-amber-300">{pagoda.pagodaMerits.toLocaleString()}</strong>
              </div>
              <div className="px-3 py-1.5 bg-slate-950/80 border border-emerald-500/30 rounded-xl text-xs flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400">魂兽和平指数:</span>
                <strong className="text-emerald-300">{pagoda.spiritBeastPeaceIndex}%</strong>
                <span className="text-[10px] text-slate-500">(庇护 {pagoda.totalSoulBeastsSaved} 兽)</span>
              </div>
              <div className="px-3 py-1.5 bg-slate-950/80 border border-purple-500/30 rounded-xl text-xs flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span className="text-slate-400">出战机甲:</span>
                <strong className="text-purple-300">
                  {pagoda.activeMechaId ? pagoda.craftedMechas.find(m => m.id === pagoda.activeMechaId)?.name || '已装配' : '未搭载'}
                </strong>
              </div>
            </div>
          </div>

          {/* Action Buttons on Banner */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleClaimSpiritRain}
              className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.4)] flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>万兽祈灵甘霖</span>
            </button>

            {nextRank && (
              <button
                onClick={handlePromoteRank}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 transition-all"
              >
                <ArrowUpCircle className="w-3.5 h-3.5" />
                <span>晋升职级</span>
              </button>
            )}

            {onNavigateToGathering && (
              <button
                onClick={onNavigateToGathering}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 transition-all"
              >
                <Gem className="w-3.5 h-3.5" />
                <span>采矿神材</span>
              </button>
            )}
          </div>
        </div>

        {/* NOTIFICATION BOX */}
        {statusMsg && (
          <div className="mt-4 p-3 bg-slate-950/90 border border-emerald-500/50 rounded-2xl text-xs text-emerald-300 font-semibold flex items-center justify-between shadow-lg">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {statusMsg}
            </span>
            <button onClick={() => setStatusMsg(null)} className="text-slate-400 hover:text-slate-200">✕</button>
          </div>
        )}
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => { SoundEngine.playClick(); setActiveTab('souls'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'souls'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>魂灵圣殿·并肩作战 ({pagoda.spiritSouls.filter(s => s.isContracted).length} 契约)</span>
        </button>

        <button
          onClick={() => { SoundEngine.playClick(); setActiveTab('ascension'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ascension'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>升灵台·模拟历练 ({pagoda.ascensionStages.length} 阶)</span>
        </button>

        <button
          onClick={() => { SoundEngine.playClick(); setActiveTab('mecha'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'mecha'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-slate-100 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-400" />
          <span>机甲神造·机甲工坊 ({pagoda.craftedMechas.filter(m => m.isCrafted).length} 完工)</span>
        </button>

        <button
          onClick={() => { SoundEngine.playClick(); setActiveTab('sanctuary'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'sanctuary'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <TreePine className="w-4 h-4 text-amber-400" />
          <span>魂兽生态保护区 ({pagoda.sanctuaries.length} 圣域)</span>
        </button>

        <button
          onClick={() => { SoundEngine.playClick(); setActiveTab('halls'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'halls'
              ? 'bg-slate-800 text-slate-100 border border-emerald-500/50'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>传灵总坛与塔规</span>
        </button>
      </div>

      {/* TAB 1: SPIRIT SOULS & BATTLE SYNERGY (魂灵圣殿·并肩作战) */}
      {activeTab === 'souls' && (
        <div className="space-y-6">
          
          {/* Active Battling Squad Banner */}
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-slate-100">
                  出战魂灵队伍 (已派遣 {pagoda.activeBattlingSoulIds.length} / 3 位魂灵并肩作战)
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                魂灵将在战斗中施展专属神技并提供全属性光环
              </span>
            </div>

            {/* 3 Active Battling Soul Slots */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[0, 1, 2].map(slotIdx => {
                const soulId = pagoda.activeBattlingSoulIds[slotIdx];
                const soul = pagoda.spiritSouls.find(s => s.id === soulId);

                if (soul) {
                  return (
                    <div
                      key={soul.id}
                      className="bg-slate-950/90 border border-emerald-500/50 rounded-2xl p-3.5 flex items-center justify-between shadow-lg relative overflow-hidden group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-emerald-400/40 flex items-center justify-center text-2xl shadow">
                          {soul.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-slate-100">{soul.name}</h4>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                              Lv.{soul.level}
                            </span>
                          </div>
                          <p className="text-[11px] text-cyan-300 font-semibold">{soul.spiritSkill.name}</p>
                          <span className="text-[10px] text-slate-400">{(soul.years / 10000).toFixed(0)}万年 · {soul.synergyGroup}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleBattleSoul(soul.id)}
                        className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 transition-all"
                      >
                        下阵
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={slotIdx}
                    className="bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl p-4 flex items-center justify-center text-slate-500 text-xs text-center"
                  >
                    <span>+ 空闲魂灵出战席位 (点击下方契约魂灵上阵)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full List of Legendary Spirit Souls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pagoda.spiritSouls.map(soul => {
              const isContracted = soul.isContracted;
              const isBattling = pagoda.activeBattlingSoulIds.includes(soul.id);

              return (
                <div
                  key={soul.id}
                  className={`bg-slate-900/90 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                    isBattling 
                      ? 'border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-gradient-to-b from-slate-900 to-emerald-950/30' 
                      : isContracted
                      ? 'border-slate-700 hover:border-emerald-500/40'
                      : 'border-slate-800 opacity-90'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-2xl shadow">
                          {soul.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-slate-100">{soul.name}</h3>
                            {isBattling && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-slate-950 animate-pulse">
                                出战中
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-amber-300 font-semibold">{soul.beastTitle}</p>
                          <span className="text-[10px] text-cyan-400 font-mono">{(soul.years / 10000).toFixed(0)} 万年修练 · {soul.rarityTitle}</span>
                        </div>
                      </div>

                      <span className="px-2 py-1 rounded-full text-[11px] font-black bg-slate-800 text-emerald-300 border border-emerald-500/30">
                        {isContracted ? `Lv.${soul.level}` : '未契约'}
                      </span>
                    </div>

                    {/* Lore & Synergy */}
                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                      {soul.lore}
                    </p>

                    {/* Active Spirit Skill & Passive Aura */}
                    <div className="mt-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                      <div>
                        <span className="text-slate-400 font-medium">专属神技：</span>
                        <strong className="text-cyan-300 font-bold ml-1">{soul.spiritSkill.name}</strong>
                        <p className="text-[11px] text-slate-300 mt-0.5">{soul.spiritSkill.spiritEffect}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-slate-400 font-medium">被动光环：</span>
                        <strong className="text-emerald-400 ml-1">{soul.passiveAura.name}</strong>
                        <p className="text-[11px] text-slate-400 mt-0.5">{soul.passiveAura.desc}</p>
                      </div>

                      {/* Stat Bonuses */}
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                        <div>攻击加成: <strong className="text-rose-400">+{soul.statsBonus.atk}</strong></div>
                        <div>防御加成: <strong className="text-cyan-400">+{soul.statsBonus.def}</strong></div>
                        <div>生命加成: <strong className="text-emerald-400">+{soul.statsBonus.hp}</strong></div>
                        <div>暴击加成: <strong className="text-amber-400">+{soul.statsBonus.critRate}%</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    {isContracted ? (
                      <>
                        <button
                          onClick={() => handleToggleBattleSoul(soul.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                            isBattling
                              ? 'bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow'
                          }`}
                        >
                          {isBattling ? '召回待命' : '派遣出战'}
                        </button>

                        <button
                          onClick={() => handleEvolveSoul(soul)}
                          disabled={soul.level >= 10}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 flex items-center gap-1"
                        >
                          <ArrowUpCircle className="w-3.5 h-3.5" />
                          <span>{soul.level >= 10 ? '已至满阶' : `年份升阶 (Lv.${soul.level + 1})`}</span>
                        </button>
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-between">
                        <div className="text-[11px] text-slate-400">
                          <div>晶石: <strong className="text-cyan-300">{soul.contractCost.spiritCrystals}</strong></div>
                          <div>金币: <strong className="text-amber-300">{soul.contractCost.gold.toLocaleString()}</strong></div>
                        </div>

                        <button
                          onClick={() => handleContractSoul(soul)}
                          className="px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:scale-105 text-slate-950 shadow-lg transition-all"
                        >
                          缔结魂灵契约！
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SPIRIT ASCENSION PLATFORM (升灵台·模拟历练) */}
      {activeTab === 'ascension' && (
        <div className="space-y-4">
          
          {/* Active Ascension Battle Arena */}
          {activeAscensionStage && isAscensionBattleActive ? (
            <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
                  <h3 className="text-lg font-black text-slate-100">
                    【升灵台试炼】激战：{activeAscensionStage.bossName}
                  </h3>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  第 {ascTurn} 回合
                </span>
              </div>

              {/* HUD: Master & Souls VS Ascension Beast Boss */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Player Side */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-emerald-300">魂师本尊与协同魂灵</span>
                    <span className="text-xs text-slate-400">Lv.{player.level}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>生命值:</span>
                      <strong className="text-emerald-400">{Math.max(0, ascPlayerHp).toLocaleString()} / {(playerStats.maxHp || 120000).toLocaleString()}</strong>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, (ascPlayerHp / (playerStats.maxHp || 120000)) * 100))}%` }}
                      />
                    </div>
                  </div>
                  {ascPlayerShield > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-cyan-300 mb-1">
                        <span>升灵矩阵防护盾:</span>
                        <strong>{ascPlayerShield.toLocaleString()}</strong>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 transition-all" style={{ width: '100%' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Boss Side */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-rose-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-rose-300">{activeAscensionStage.bossName}</span>
                    <span className="text-xs text-slate-400">{activeAscensionStage.bossTitle}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>幻影凶兽生命:</span>
                      <strong className="text-rose-400">{Math.max(0, ascBossHp).toLocaleString()} / {activeAscensionStage.bossHp.toLocaleString()}</strong>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-rose-500 to-red-600 transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, (ascBossHp / activeAscensionStage.bossHp) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Combat Logs */}
              <div className="bg-slate-950/90 p-3 rounded-2xl border border-slate-800 h-32 overflow-y-auto space-y-1 text-xs font-mono">
                {ascBattleLogs.map(log => (
                  <div 
                    key={log.id} 
                    className={
                      log.type === 'crit' ? 'text-amber-300 font-bold' :
                      log.type === 'player' ? 'text-emerald-300' :
                      log.type === 'boss' ? 'text-rose-400' : 'text-slate-300'
                    }
                  >
                    {log.text}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => handleAscensionAction('master_attack')}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-100 flex flex-col items-center gap-1 border border-slate-700 transition-all"
                >
                  <Swords className="w-4 h-4 text-emerald-400" />
                  <span>武魂强攻</span>
                </button>

                <button
                  onClick={() => handleAscensionAction('soul_skill')}
                  className="p-2.5 bg-gradient-to-b from-teal-900/60 to-slate-800 hover:from-teal-800/80 rounded-xl text-xs font-bold text-teal-200 flex flex-col items-center gap-1 border border-teal-500/40 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  <span>魂灵协同神技 (暴击)</span>
                </button>

                <button
                  onClick={() => handleAscensionAction('mecha_cannon')}
                  className="p-2.5 bg-gradient-to-b from-purple-900/60 to-slate-800 hover:from-purple-800/80 rounded-xl text-xs font-bold text-purple-200 flex flex-col items-center gap-1 border border-purple-500/40 transition-all"
                >
                  <Bot className="w-4 h-4 text-purple-300" />
                  <span>机甲过载重炮</span>
                </button>

                <button
                  onClick={() => handleAscensionAction('purify')}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-cyan-300 flex flex-col items-center gap-1 border border-cyan-500/40 transition-all"
                >
                  <Heart className="w-4 h-4 text-cyan-400" />
                  <span>生灵治愈结界</span>
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => { setActiveAscensionStage(null); setIsAscensionBattleActive(false); }}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  退出升灵台试炼
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Platform Overview */}
              <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>传灵塔虚拟魂兽升灵空间</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    在不伤害真实魂兽的前提下，通过拟真矩阵历练提升自身魂力、出战魂灵年限与升灵晶石！
                  </p>
                </div>
              </div>

              {/* Stage Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pagoda.ascensionStages.map((stage) => (
                  <div
                    key={stage.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${stage.difficultyColor}`}>
                            {stage.difficulty}
                          </span>
                          <h3 className="font-bold text-base text-slate-100 mt-1">{stage.name}</h3>
                          <p className="text-xs text-rose-300 font-semibold">{stage.bossName}</p>
                          <span className="text-[10px] text-slate-400">{stage.bossTitle}</span>
                        </div>

                        <span className="text-xs font-bold text-slate-400">
                          推荐: Lv.{stage.recommendedLevel}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                        {stage.description}
                      </p>

                      {/* Boss Stats */}
                      <div className="mt-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs grid grid-cols-2 gap-1 text-slate-400">
                        <div>凶兽生命: <strong className="text-slate-200">{stage.bossHp.toLocaleString()}</strong></div>
                        <div>凶兽攻击: <strong className="text-rose-400">{stage.bossAtk.toLocaleString()}</strong></div>
                      </div>

                      {/* Rewards */}
                      <div className="mt-3 p-2.5 bg-slate-950/40 rounded-xl text-xs text-slate-300 space-y-1">
                        <div className="flex items-center gap-2">
                          <Gem className="w-3.5 h-3.5 text-cyan-400" />
                          <span>通关奖励:</span>
                          <strong className="text-cyan-300">+{stage.rewards.spiritCrystals} 晶石</strong>
                          <span className="text-amber-300">(+{stage.rewards.yearsGain} 魂灵年限)</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        和平指数: <strong className="text-emerald-400">+{stage.rewards.peaceIndexGain}%</strong>
                      </span>

                      <button
                        onClick={() => handleStartAscensionTrial(stage)}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-lg transition-all"
                      >
                        进入升灵台·历练！
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 3: MECHA FORGING & WORKSHOP (机甲神造·机甲工坊) */}
      {activeTab === 'mecha' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>传灵塔现代魂导机甲神造研发中心</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                采集深海沉银、天锻神金等神级金属与升灵晶石，制造黄级、紫级、黑级至红级神级机甲，全方位武装魂师！
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pagoda.craftedMechas.map(mecha => {
              const isCrafted = mecha.isCrafted;
              const isEquipped = pagoda.activeMechaId === mecha.id && isCrafted;

              return (
                <div
                  key={mecha.id}
                  className={`bg-slate-900/90 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                    isEquipped
                      ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] bg-purple-950/20'
                      : isCrafted
                      ? 'border-slate-700 hover:border-purple-500/40'
                      : 'border-slate-800 opacity-90'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${mecha.gradeColor}`}>
                          {mecha.gradeName}
                        </span>
                        <h3 className="font-bold text-base text-slate-100 mt-1">{mecha.name}</h3>
                        <p className="text-xs text-purple-300 font-semibold">{mecha.typeName}</p>
                      </div>

                      {isEquipped ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-purple-500 text-slate-950 shadow">
                          正在驾驶
                        </span>
                      ) : isCrafted ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-emerald-300 border border-emerald-500/30">
                          已完工
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          待制造
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                      {mecha.description}
                    </p>

                    {/* Mecha Combat Weapon */}
                    <div className="mt-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">机载专属主炮:</span>
                        <strong className="text-purple-300">{mecha.mechaWeapon.name}</strong>
                      </div>
                      <p className="text-[11px] text-slate-400">{mecha.mechaWeapon.desc}</p>
                    </div>

                    {/* Mecha Attributes */}
                    <div className="mt-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] grid grid-cols-2 gap-1 text-slate-400">
                      <div>生命加成: <strong className="text-emerald-400">+{mecha.combatStats.hp.toLocaleString()}</strong></div>
                      <div>装甲护盾: <strong className="text-cyan-400">+{mecha.combatStats.shield.toLocaleString()}</strong></div>
                      <div>攻击加成: <strong className="text-rose-400">+{mecha.combatStats.atk.toLocaleString()}</strong></div>
                      <div>防御加成: <strong className="text-amber-400">+{mecha.combatStats.def.toLocaleString()}</strong></div>
                    </div>

                    {/* Crafting Requirements */}
                    {!isCrafted && (
                      <div className="mt-3 p-2.5 bg-slate-950/40 rounded-xl text-xs text-slate-400 space-y-1">
                        <div className="text-slate-300 font-semibold">所需神材与晶石：</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px]">
                            晶石: {mecha.craftCost.spiritCrystals}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 text-[10px]">
                            金币: {mecha.craftCost.gold.toLocaleString()}
                          </span>
                          {Object.entries(mecha.craftCost.metals).map(([mName, count]) => (
                            <span key={mName} className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700 text-[10px]">
                              {mName} x{count}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    {isCrafted ? (
                      <button
                        onClick={() => handleToggleEquipMecha(mecha.id)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                          isEquipped
                            ? 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                            : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-slate-100 font-black shadow'
                        }`}
                      >
                        {isEquipped ? '解除驾驶模式' : '进入驾驶舱·机甲合体！'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCraftMecha(mecha)}
                        className="w-full py-2 rounded-xl text-xs font-black bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-slate-100 shadow-lg hover:scale-102 transition-all"
                      >
                        铸造神级机甲！
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: BEAST SANCTUARIES & HARMONY (魂兽生态保护区) */}
      {activeTab === 'sanctuary' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <TreePine className="w-4 h-4 text-amber-400" />
                <span>全大陆魂兽自然繁育与和平保护区</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                巡护星斗大森林、极北冰原等五大圣域，捐献资源提升万兽和平度，可获得万兽祈灵与全大陆属性常驻光环！
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pagoda.sanctuaries.map((zone) => (
              <div
                key={zone.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-100">{zone.name}</h3>
                      <p className="text-xs text-emerald-300 font-semibold">{zone.guardianName}</p>
                      <span className="text-[10px] text-slate-400">{zone.guardianTitle}</span>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-800 text-amber-300 border border-amber-500/30">
                      和平度: {zone.peaceLevel}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {zone.description}
                  </p>

                  <div className="mt-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
                    <div className="text-emerald-300 font-semibold">
                      ✦ 圣域光环：{zone.buffEffect}
                    </div>
                    <div className="text-amber-300 text-[11px]">
                      每日万灵朝贺礼：{zone.dailyHerbGift}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    修缮所需: <strong className="text-amber-300">{zone.donateCostGold.toLocaleString()} 金币</strong>
                  </span>

                  <button
                    onClick={() => handleDonateSanctuary(zone)}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg transition-all"
                  >
                    捐助圣域·提升和平！
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PAGODA HEADQUARTERS & LORE (传灵总坛与塔规) */}
      {activeTab === 'halls' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div>
            <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>传灵塔立宗宏愿与万古门规</span>
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              在斗罗大陆漫长的岁月中，人类魂师因获取魂环而对魂兽无休止地杀戮，导致星斗大森林与极北之地的魂兽面临灭绝危机。
              灵冰斗罗·霍雨浩联合百万年天梦冰蚕、极北三大天王雪帝与冰帝，开创了【魂灵体系】并创立【传灵塔】，
              旨在建立人类与魂兽之间的神圣和平契约，让魂兽在濒危之际化作不灭魂灵，与人类魂师心意相通、并肩作战！
            </p>
          </div>

          {/* Rank Track */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-200">传灵塔至尊职级晋升之路：</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PAGODA_RANKS.map(rank => (
                <div
                  key={rank.level}
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                    rank.level === pagoda.pagodaLevel
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg'
                      : rank.level < pagoda.pagodaLevel
                      ? 'bg-slate-950/60 border-slate-700 opacity-75'
                      : 'bg-slate-950/30 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-100">{rank.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-300">
                      Lv.{rank.level}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{rank.desc}</p>
                  <div className="text-[11px] text-amber-300">
                    每日甘霖: +{rank.dailyRainGold} 金币 / +{rank.dailyRainCrystals} 晶石
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
