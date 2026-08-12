import React, { useState } from 'react';
import { Player, BattleArmorRank, BattleArmorSlot, BattleArmorPiece, SoulTool } from '../types/game';
import { BATTLE_ARMOR_RANKS, BATTLE_ARMOR_SLOTS } from '../data/battleArmor';
import { INITIAL_SOUL_TOOLS } from '../data/soulTools';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Shield, Swords, Zap, Flame, Sparkles, Crown, 
  Hammer, ChevronRight, CheckCircle2, AlertCircle, RefreshCw,
  Plus, Edit3, ShieldAlert, Droplets, Crosshair, ArrowUpCircle
} from 'lucide-react';

interface BattleArmorForgeViewProps {
  player: Player;
  onUpdatePlayer: (updater: (prev: Player) => Player) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  onNavigateToGathering?: () => void;
}

export const BattleArmorForgeView: React.FC<BattleArmorForgeViewProps> = ({
  player,
  onUpdatePlayer,
  showToast,
  onNavigateToGathering
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'battle_armor' | 'soul_tools' | 'metal_smelt'>('battle_armor');
  const [selectedRank, setSelectedRank] = useState<BattleArmorRank>('one_word');
  const [customArmorName, setCustomArmorName] = useState(player.battleArmor?.customName || '龙皇');
  const [isEditingName, setIsEditingName] = useState(false);

  const battleArmor = player.battleArmor || {
    customName: '龙皇',
    rank: 'none',
    rankTitle: '未铸造',
    pieces: {},
    isActive: false,
    activeSkillName: '斗铠初成',
    activeSkillDesc: '集齐打造全部7件斗铠部件，即可激活整套斗铠属性与专属神技！',
    setBonusMultiplier: 1.0
  };

  const soulTools = player.soulTools || INITIAL_SOUL_TOOLS;
  const divineMetals = player.divineMetals || {
    '百锻沉金': 25,
    '灵锻秘银': 10,
    '魂锻赤金': 5,
    '天锻神金': 0
  };

  const rankMeta = BATTLE_ARMOR_RANKS.find(r => r.rank === selectedRank) || BATTLE_ARMOR_RANKS[0];
  const craftedPiecesCount = Object.keys(battleArmor.pieces || {}).length;
  const isFullSet = craftedPiecesCount >= 7;

  // Handle forging a battle armor piece
  const handleForgePiece = (slotMeta: { slot: BattleArmorSlot; name: string; statDesc: string }) => {
    if (player.level < rankMeta.requiredLevel) {
      showToast(`魂师等级需达到 ${rankMeta.requiredLevel} 级方可锻造【${rankMeta.title}】！`, 'warning');
      return;
    }

    const availableMetal = divineMetals[rankMeta.craftMetal] || 0;
    if (availableMetal < rankMeta.costPerPiece) {
      showToast(`锻造材料不足！需消耗【${rankMeta.craftMetal}】x${rankMeta.costPerPiece}，当前拥有 x${availableMetal}`, 'warning');
      return;
    }

    SoundEngine.playForge();

    const newPiece: BattleArmorPiece = {
      id: `ba_${selectedRank}_${slotMeta.slot}`,
      slot: slotMeta.slot,
      slotName: slotMeta.name,
      name: `${customArmorName} · ${slotMeta.name.replace('斗铠·', '')}`,
      rank: selectedRank,
      rankName: rankMeta.title,
      level: 1,
      atkBonus: Math.floor(180 * rankMeta.multiplier),
      defBonus: Math.floor(150 * rankMeta.multiplier),
      hpBonus: Math.floor(2200 * rankMeta.multiplier),
      speedBonus: Math.floor(25 * rankMeta.multiplier),
      critBonus: Math.floor(6 * rankMeta.multiplier),
      craftMetalName: rankMeta.craftMetal,
      craftMetalCount: rankMeta.costPerPiece
    };

    onUpdatePlayer(prev => {
      const currentPieces = { ...(prev.battleArmor?.pieces || {}) };
      currentPieces[slotMeta.slot] = newPiece;

      const newCraftedCount = Object.keys(currentPieces).length;
      const willBeFull = newCraftedCount >= 7;

      const updatedMetals = { ...(prev.divineMetals || divineMetals) };
      updatedMetals[rankMeta.craftMetal] = (updatedMetals[rankMeta.craftMetal] || 0) - rankMeta.costPerPiece;

      return {
        ...prev,
        divineMetals: updatedMetals,
        battleArmor: {
          ...(prev.battleArmor || battleArmor),
          customName: customArmorName,
          rank: willBeFull ? selectedRank : (prev.battleArmor?.rank || 'one_word'),
          rankTitle: willBeFull ? rankMeta.title : '锻造中',
          pieces: currentPieces,
          setBonusMultiplier: willBeFull ? rankMeta.multiplier : 1.0,
          activeSkillName: rankMeta.skillName,
          activeSkillDesc: rankMeta.skillDesc
        }
      };
    });

    if (craftedPiecesCount + 1 >= 7) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      showToast(`恭喜！集齐打造整套【${rankMeta.title} · ${customArmorName}】！`, 'success');
    } else {
      showToast(`成功锻造【${newPiece.name}】！`, 'success');
    }
  };

  // Handle piece upgrade (升星淬炼)
  const handleUpgradePiece = (slot: BattleArmorSlot) => {
    const piece = battleArmor.pieces[slot];
    if (!piece) return;

    if (piece.level >= 10) {
      showToast('该斗铠部件已淬炼至当前品阶顶级！', 'info');
      return;
    }

    const goldCost = piece.level * 2000;
    if (player.gold < goldCost) {
      showToast(`金币不足！需要 ${goldCost} 金币`, 'warning');
      return;
    }

    SoundEngine.playLevelUp();

    onUpdatePlayer(prev => {
      const pieces = { ...(prev.battleArmor?.pieces || {}) };
      if (pieces[slot]) {
        pieces[slot] = {
          ...pieces[slot]!,
          level: pieces[slot]!.level + 1,
          atkBonus: Math.floor(pieces[slot]!.atkBonus * 1.15),
          defBonus: Math.floor(pieces[slot]!.defBonus * 1.15),
          hpBonus: Math.floor(pieces[slot]!.hpBonus * 1.15),
          speedBonus: Math.floor(pieces[slot]!.speedBonus * 1.1)
        };
      }
      return {
        ...prev,
        gold: prev.gold - goldCost,
        battleArmor: {
          ...(prev.battleArmor || battleArmor),
          pieces
        }
      };
    });

    showToast(`【${piece.name}】淬炼升至 +${piece.level + 1} 阶！`, 'success');
  };

  // Toggle Battle Armor activation (斗铠附体)
  const handleToggleActivate = () => {
    SoundEngine.playSkill();
    const nextActive = !battleArmor.isActive;
    onUpdatePlayer(prev => ({
      ...prev,
      battleArmor: {
        ...(prev.battleArmor || battleArmor),
        isActive: nextActive
      }
    }));
    if (nextActive) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
      showToast(`【${battleArmor.customName}】斗铠附体成功！战力大幅暴增！`, 'success');
    } else {
      showToast('斗铠已收回魂力核心温养。', 'info');
    }
  };

  // Handle crafting a soul tool
  const handleCraftSoulTool = (tool: SoulTool) => {
    // Check materials
    for (const mat of tool.materialsNeeded) {
      const invItem = player.inventory.find(i => i.id === mat.itemId);
      if (!invItem || invItem.quantity < mat.count) {
        showToast(`锻造材料不足！需要【${mat.name}】x${mat.count}`, 'warning');
        return;
      }
    }

    SoundEngine.playForge();

    onUpdatePlayer(prev => {
      const newInv = prev.inventory.map(item => {
        const need = tool.materialsNeeded.find(m => m.itemId === item.id);
        if (need) {
          return { ...item, quantity: item.quantity - need.count };
        }
        return item;
      }).filter(i => i.quantity > 0);

      const updatedTools = (prev.soulTools || INITIAL_SOUL_TOOLS).map(t => {
        if (t.id === tool.id) {
          return { ...t, isUnlocked: true, isEquipped: true };
        }
        return t;
      });

      return {
        ...prev,
        inventory: newInv,
        soulTools: updatedTools
      };
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    showToast(`成功研制【${tool.name}】并已自动装备！`, 'success');
  };

  // Toggle soul tool equip
  const handleToggleEquipSoulTool = (toolId: string) => {
    SoundEngine.playClick();
    onUpdatePlayer(prev => {
      const updatedTools = (prev.soulTools || INITIAL_SOUL_TOOLS).map(t => {
        if (t.id === toolId) {
          return { ...t, isEquipped: !t.isEquipped };
        }
        return t;
      });
      return { ...prev, soulTools: updatedTools };
    });
    showToast('魂导器装备状态已更新！', 'info');
  };

  // Metal smelting / mining (神金锻造萃取)
  const handleSmeltMetal = (metalName: string, costGold: number, targetMetal: string) => {
    if (player.gold < costGold) {
      showToast(`金币不足！需要 ${costGold} 金币`, 'warning');
      return;
    }

    SoundEngine.playForge();

    onUpdatePlayer(prev => {
      const updatedMetals = { ...(prev.divineMetals || divineMetals) };
      updatedMetals[targetMetal] = (updatedMetals[targetMetal] || 0) + 5;

      return {
        ...prev,
        gold: prev.gold - costGold,
        divineMetals: updatedMetals
      };
    });

    showToast(`引地心灵火成功淬炼【${targetMetal}】x5！`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-indigo-900/60 border border-indigo-400/40 rounded-xl text-amber-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-indigo-300">
                  神匠铸造塔 · 斗铠与魂导器工坊
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  淬炼稀世神金，打造一字至五字绝世斗铠，研制日月帝国定装魂导炮与弑神超武。
                </p>
              </div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shrink-0 flex-wrap">
            <button
              onClick={() => { SoundEngine.playClick(); setActiveSubTab('battle_armor'); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'battle_armor'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>斗铠锻造</span>
            </button>
            <button
              onClick={() => { SoundEngine.playClick(); setActiveSubTab('soul_tools'); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'soul_tools'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>魂导兵装</span>
            </button>
            <button
              onClick={() => { SoundEngine.playClick(); setActiveSubTab('metal_smelt'); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'metal_smelt'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Hammer className="w-3.5 h-3.5" />
              <span>天火淬炼</span>
            </button>
            {onNavigateToGathering && (
              <button
                onClick={() => { SoundEngine.playClick(); onNavigateToGathering(); }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>⛏️ 前往采矿</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. BATTLE ARMOR FORGE TAB */}
      {activeSubTab === 'battle_armor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: Current Battle Armor Showcase & Activation */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <h3 className="font-black text-slate-100 text-base">当前本命斗铠</h3>
                </div>

                {isFullSet && (
                  <button
                    onClick={handleToggleActivate}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                      battleArmor.isActive
                        ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse'
                        : 'bg-slate-800 text-amber-400 border border-amber-500/40 hover:bg-amber-500/20'
                    }`}
                  >
                    {battleArmor.isActive ? '★ 斗铠附体中' : '斗铠附体'}
                  </button>
                )}
              </div>

              {/* Armor Set Status Card */}
              <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-amber-500/30 rounded-xl p-4 text-center relative overflow-hidden">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500/30 via-purple-500/20 to-cyan-500/30 border-2 border-amber-400/50 flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.3)] mb-3">
                  <Shield className={`w-10 h-10 ${battleArmor.isActive ? 'text-amber-300 animate-bounce' : 'text-amber-400'}`} />
                </div>

                <div className="flex items-center justify-center gap-2 mb-1">
                  {isEditingName ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={customArmorName}
                        onChange={(e) => setCustomArmorName(e.target.value.slice(0, 15))}
                        className="bg-slate-800 text-amber-300 font-black px-2 py-0.5 rounded border border-amber-400 text-sm text-center w-36"
                        placeholder="输入斗铠名"
                      />
                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          onUpdatePlayer(prev => ({
                            ...prev,
                            battleArmor: {
                              ...(prev.battleArmor || battleArmor),
                              customName: customArmorName
                            }
                          }));
                          showToast(`斗铠名称已设定为【${customArmorName}】！`, 'success');
                        }}
                        className="text-xs text-amber-400 font-bold px-2 py-0.5 bg-amber-950 border border-amber-500 rounded"
                      >
                        保存
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-lg font-black text-amber-300 tracking-wide">
                        【{battleArmor.customName || '龙皇'}】神铠
                      </h4>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="text-slate-400 hover:text-amber-300 p-1"
                        title="自定义斗铠名称"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-xs px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold">
                    {battleArmor.rankTitle || '一字斗铠'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    部件完成度: <strong className="text-cyan-300">{craftedPiecesCount}/7</strong>
                  </span>
                </div>

                {/* Set Skill */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-left text-xs">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>套装神技: {battleArmor.activeSkillName}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {battleArmor.activeSkillDesc}
                  </p>
                </div>
              </div>

              {/* Divine Metals summary */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 mt-4">
                <div className="text-xs font-bold text-slate-400 mb-2 flex items-center justify-between">
                  <span>拥有稀有神金:</span>
                  <span className="text-amber-400 font-medium">金币: {player.gold}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(divineMetals).map(([metal, count]) => (
                    <div key={metal} className="flex items-center justify-between bg-slate-900 px-2 py-1.5 rounded border border-slate-800">
                      <span className="text-slate-300 font-medium truncate max-w-[90px]">{metal}</span>
                      <span className="font-bold text-amber-300 font-mono">x{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 2 COLS: Rank Selector & 7 Armor Slot Pieces */}
          <div className="lg:col-span-2 space-y-4">
            {/* Rank Selection Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <div className="text-xs font-bold text-slate-400 mb-2">选择锻造斗铠品阶：</div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {BATTLE_ARMOR_RANKS.map(rank => {
                  const isSelected = selectedRank === rank.rank;
                  const isUnlocked = player.level >= rank.requiredLevel;
                  return (
                    <button
                      key={rank.rank}
                      onClick={() => {
                        SoundEngine.playClick();
                        setSelectedRank(rank.rank);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 relative ${
                        isSelected
                          ? `${rank.colorClass} ${rank.glowClass}`
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-black">{rank.title}</span>
                      <span className="text-[10px] text-slate-400">
                        {isUnlocked ? `Lv.${rank.requiredLevel}` : `需 Lv.${rank.requiredLevel}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 7 Armor Pieces List */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-200 flex items-center gap-2">
                  <Hammer className="w-4 h-4 text-amber-400" />
                  <span>【{rankMeta.title}】部位锻造列表</span>
                </h4>
                <span className="text-xs text-amber-300">
                  单件消耗: {rankMeta.craftMetal} x{rankMeta.costPerPiece}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {BATTLE_ARMOR_SLOTS.map(slotMeta => {
                  const piece = battleArmor.pieces[slotMeta.slot];
                  const isForged = !!piece;
                  const canForge = player.level >= rankMeta.requiredLevel && (divineMetals[rankMeta.craftMetal] || 0) >= rankMeta.costPerPiece;

                  return (
                    <div
                      key={slotMeta.slot}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isForged
                          ? 'border-amber-500/40 bg-amber-950/20 shadow-md'
                          : 'border-slate-800 bg-slate-950/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                          isForged ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-700 text-slate-500'
                        }`}>
                          <Shield className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-100">{slotMeta.name}</span>
                            {isForged && (
                              <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
                                +{piece.level}阶
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block">{slotMeta.statDesc}</span>
                          {isForged && (
                            <span className="text-[10px] text-cyan-300 font-mono">
                              攻击+{piece.atkBonus} 防御+{piece.defBonus} 气血+{piece.hpBonus}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        {isForged ? (
                          <button
                            onClick={() => handleUpgradePiece(slotMeta.slot)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-amber-600 hover:text-slate-950 text-amber-400 border border-amber-500/40 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <ArrowUpCircle className="w-3.5 h-3.5" />
                            <span>淬炼</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleForgePiece(slotMeta)}
                            disabled={!canForge}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                              canForge
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 shadow-md'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                            }`}
                          >
                            <Hammer className="w-3.5 h-3.5" />
                            <span>锻造</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SOUL TOOLS ARSENAL TAB */}
      {activeSubTab === 'soul_tools' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                  <Crosshair className="w-5 h-5 text-indigo-400" />
                  <span>定装魂导器与弑神武器库</span>
                </h3>
                <p className="text-xs text-slate-400">
                  魂导器可在战斗中主动激发，提供无敌护罩、高能充能、毁灭死神炮等强力战术主动技。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {soulTools.map(tool => {
                const canCraft = tool.materialsNeeded.every(mat => {
                  const item = player.inventory.find(i => i.id === mat.itemId);
                  return item && item.quantity >= mat.count;
                });

                return (
                  <div
                    key={tool.id}
                    className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                      tool.isUnlocked
                        ? tool.isEquipped
                          ? 'bg-indigo-950/40 border-indigo-500/60 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                          : 'bg-slate-950/80 border-slate-700'
                        : 'bg-slate-950/50 border-slate-800/80 opacity-90'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full font-bold border border-indigo-500/30">
                              {tool.rank}级魂导器
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase">
                              {tool.type === 'attack' ? '攻击型' : tool.type === 'defense' ? '防御型' : tool.type === 'assist' ? '辅助型' : '弑神超武'}
                            </span>
                          </div>
                          <h4 className="font-black text-slate-100 text-sm mt-1">{tool.name}</h4>
                        </div>

                        {tool.isUnlocked && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            tool.isEquipped ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {tool.isEquipped ? '已装备' : '未装备'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                        {tool.description}
                      </p>

                      {/* Stat boosts */}
                      <div className="bg-slate-900/90 rounded-xl p-2 border border-slate-800 text-[11px] space-y-1 mb-3">
                        <div className="flex items-center justify-between text-slate-300">
                          <span>属性加成:</span>
                          <span className="text-cyan-300 font-mono">
                            攻击+{tool.atkBonus} 防御+{tool.defBonus} 气血+{tool.hpBonus} 速度+{tool.speedBonus}
                          </span>
                        </div>
                        <div className="text-amber-300 font-medium">
                          技能: <strong>{tool.activeSkill.name}</strong>
                        </div>
                        <div className="text-slate-400 text-[10px]">
                          {tool.activeSkill.description}
                        </div>
                      </div>

                      {/* Materials needed if not unlocked */}
                      {!tool.isUnlocked && (
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px] mb-3">
                          <span className="text-slate-400 block mb-1">研制所需材料:</span>
                          <div className="space-y-0.5">
                            {tool.materialsNeeded.map(m => {
                              const invItem = player.inventory.find(i => i.id === m.itemId);
                              const hasCount = invItem?.quantity || 0;
                              const isEnough = hasCount >= m.count;
                              return (
                                <div key={m.itemId} className="flex items-center justify-between">
                                  <span className="text-slate-300">{m.name}</span>
                                  <span className={isEnough ? 'text-emerald-400 font-mono' : 'text-rose-400 font-mono'}>
                                    {hasCount}/{m.count}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-2 pt-2 border-t border-slate-800">
                      {tool.isUnlocked ? (
                        <button
                          onClick={() => handleToggleEquipSoulTool(tool.id)}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                            tool.isEquipped
                              ? 'bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-slate-700'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                          }`}
                        >
                          {tool.isEquipped ? '卸下兵装' : '装备至作战栏'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCraftSoulTool(tool)}
                          disabled={!canCraft}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            canCraft
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:brightness-110'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          }`}
                        >
                          <Hammer className="w-3.5 h-3.5" />
                          <span>研制魂导器</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. METAL SMELT TAB */}
      {activeSubTab === 'metal_smelt' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-black text-slate-100 flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>天火地晶淬炼 · 稀世神金熔炼</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              引地心天火与金币熔炼，可快速提纯百锻沉金、灵锻秘银、魂锻赤金与至高天锻神金。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: '百锻沉金', cost: 1500, desc: '一字斗铠核心基础金属', color: 'border-amber-500/40 text-amber-300' },
                { name: '灵锻秘银', cost: 4000, desc: '具备灵性融合特性的二字斗铠金属', color: 'border-purple-500/40 text-purple-300' },
                { name: '魂锻赤金', cost: 9000, desc: '诞生魂识灵性的三字斗铠圣金', color: 'border-rose-500/40 text-rose-300' },
                { name: '天锻神金', cost: 20000, desc: '历经雷劫洗礼的四字/五字神级至尊金属', color: 'border-yellow-400 text-yellow-300' }
              ].map(metal => (
                <div key={metal.name} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between text-center">
                  <div>
                    <div className="w-14 h-14 mx-auto rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mb-3">
                      <Sparkles className={`w-7 h-7 ${metal.color}`} />
                    </div>
                    <h4 className="font-bold text-slate-100 text-sm">{metal.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 mb-3">{metal.desc}</p>
                    <div className="text-xs text-amber-300 font-mono font-bold mb-4">
                      当前拥有: x{divineMetals[metal.name] || 0}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSmeltMetal(metal.name, metal.cost, metal.name)}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1"
                  >
                    <span>淬炼 x5 (消耗 {metal.cost} 金币)</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

