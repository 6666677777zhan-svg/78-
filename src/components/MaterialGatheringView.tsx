import React, { useState, useEffect, useMemo } from 'react';
import { Player, Item, MiningVeinZone, ProducedMaterialMeta, MiningDispatchState } from '../types/game';
import { MINING_VEIN_ZONES, SMELTER_RECIPES, MATERIAL_WIKI_DB, SmelterRecipe } from '../data/materialGathering';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Hammer,
  Sparkles,
  Flame,
  Crown,
  Zap,
  Skull,
  Waves,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Coins,
  ArrowRight,
  Plus,
  Play,
  Layers,
  Award,
  BookOpen,
  Droplets,
  PackageCheck
} from 'lucide-react';

interface MaterialGatheringViewProps {
  player: Player;
  onUpdatePlayer: (updater: (prev: Player) => Player) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  onNavigateToView?: (view: any) => void;
}

export const MaterialGatheringView: React.FC<MaterialGatheringViewProps> = ({
  player,
  onUpdatePlayer,
  showToast,
  onNavigateToView
}) => {
  const [activeTab, setActiveTab] = useState<'veins' | 'smelter' | 'wiki'>('veins');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'gengxin_city' | 'forest_swamp' | 'sea_abyss'>('all');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(MINING_VEIN_ZONES[0].id);
  const [miningCombo, setMiningCombo] = useState<number>(0);
  const [isMiningAnim, setIsMiningAnim] = useState<boolean>(false);
  const [recentGains, setRecentGains] = useState<{ id: string; name: string; count: number; isCrit?: boolean; isDivineMetal?: boolean }[]>([]);
  const [wikiSearch, setWikiSearch] = useState<string>('');
  const [wikiCategoryFilter, setWikiCategoryFilter] = useState<'all' | '斗铠神金' | '唐门暗器材' | '魂导核心材'>('all');
  const [smeltMultiplier, setSmeltMultiplier] = useState<number>(1);

  // Current selected zone
  const selectedZone = useMemo(() => {
    return MINING_VEIN_ZONES.find(z => z.id === selectedZoneId) || MINING_VEIN_ZONES[0];
  }, [selectedZoneId]);

  // Current energy (stamina)
  const currentEnergy = player.miningEnergy ?? 100;
  const maxEnergy = player.maxMiningEnergy ?? 100;

  // Realtime energy passive regen ticker (1 point every 15s if below max)
  useEffect(() => {
    const interval = setInterval(() => {
      onUpdatePlayer(prev => {
        const cur = prev.miningEnergy ?? 100;
        const max = prev.maxMiningEnergy ?? 100;
        if (cur < max) {
          return {
            ...prev,
            miningEnergy: Math.min(max, cur + 1),
            lastEnergyRegenTime: Date.now()
          };
        }
        return prev;
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [onUpdatePlayer]);

  // Filtered zones
  const filteredZones = useMemo(() => {
    if (selectedCategory === 'all') return MINING_VEIN_ZONES;
    return MINING_VEIN_ZONES.filter(z => z.category === selectedCategory);
  }, [selectedCategory]);

  // Tang Sect skill bonus calculation
  const tangSkillLevel = useMemo(() => {
    if (!selectedZone.tangSkillKey) return 1;
    const skill = player.tangSectSkills[selectedZone.tangSkillKey];
    return skill ? skill.level : 1;
  }, [player.tangSectSkills, selectedZone]);

  // Execute Active Mining / Rock Cracking (主动采掘 / 乱披风碎石)
  const handlePerformMining = (isMulti: boolean = false) => {
    if (player.level < selectedZone.requiredLevel) {
      showToast(`魂力等级不足！需要达到 Lv.${selectedZone.requiredLevel} 方可深入此矿脉！`, 'warning');
      return;
    }

    const costEnergy = isMulti ? selectedZone.staminaCost * 5 : selectedZone.staminaCost;
    if (currentEnergy < costEnergy) {
      showToast(`采掘体力不足！需要 ${costEnergy} 点体力（每15秒自然恢复1点）！`, 'warning');
      return;
    }

    setIsMiningAnim(true);
    SoundEngine.playForge();

    const iterations = isMulti ? 5 : 1;
    const gainedItems: { id: string; name: string; count: number; isCrit?: boolean; isDivineMetal?: boolean }[] = [];
    let totalExp = 0;
    let totalGold = 0;

    // Check Tang Skill boost multiplier (1.0 + (level-1) * 0.15)
    const skillBoost = 1.0 + (tangSkillLevel - 1) * 0.15;
    const nextCombo = miningCombo + iterations;
    setMiningCombo(nextCombo);

    for (let i = 0; i < iterations; i++) {
      totalExp += selectedZone.expPerGather;
      totalGold += selectedZone.goldPerGather;

      // Evaluate drops from produced materials
      for (const mat of selectedZone.producedMaterials) {
        // Roll chance
        const isCrit = Math.random() < 0.20 + (tangSkillLevel * 0.05);
        const effectiveChance = Math.min(1.0, mat.dropChance * skillBoost);

        if (Math.random() <= effectiveChance) {
          const [minC, maxC] = mat.baseCount;
          let count = Math.floor(Math.random() * (maxC - minC + 1)) + minC;
          if (isCrit) {
            count = Math.floor(count * 1.5) + 1;
          }

          // Push into gain
          const existing = gainedItems.find(g => g.id === mat.itemId);
          if (existing) {
            existing.count += count;
            if (isCrit) existing.isCrit = true;
          } else {
            gainedItems.push({
              id: mat.itemId,
              name: mat.name,
              count,
              isCrit,
              isDivineMetal: mat.isDivineMetal
            });
          }
        }
      }
    }

    // Update player state with materials
    onUpdatePlayer(prev => {
      const updatedMetals = { ...(prev.divineMetals || {}) };
      const currentInv = [...prev.inventory];

      for (const gain of gainedItems) {
        if (gain.isDivineMetal) {
          updatedMetals[gain.name] = (updatedMetals[gain.name] || 0) + gain.count;
        } else {
          const invIdx = currentInv.findIndex(item => item.id === gain.id);
          if (invIdx >= 0) {
            currentInv[invIdx] = {
              ...currentInv[invIdx],
              quantity: currentInv[invIdx].quantity + gain.count
            };
          } else {
            currentInv.push({
              id: gain.id,
              name: gain.name,
              type: 'material',
              quantity: gain.count,
              description: '在斗罗神材宝地开采获得的稀有材料',
              icon: gain.id.includes('poison') || gain.id.includes('snake') ? 'Skull' : 'Hammer',
              price: 50
            });
          }
        }
      }

      return {
        ...prev,
        miningEnergy: Math.max(0, (prev.miningEnergy ?? 100) - costEnergy),
        gold: prev.gold + totalGold,
        currentExp: prev.currentExp + totalExp,
        divineMetals: updatedMetals,
        inventory: currentInv
      };
    });

    setRecentGains(gainedItems);
    setTimeout(() => setIsMiningAnim(false), 400);

    const hasCrit = gainedItems.some(g => g.isCrit);
    if (hasCrit) {
      SoundEngine.playThunder();
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      showToast(`💥 触发【乱披风·绝脉暴击】！收获大量极品神材！`, 'success');
    }
  };

  // Dispatch / Station AFK Workers (拟态矿工派遣)
  const handleToggleDispatch = (zoneId: string) => {
    SoundEngine.playClick();
    onUpdatePlayer(prev => {
      const dispatches = { ...(prev.miningDispatch || {}) };
      if (dispatches[zoneId]) {
        // Recall
        delete dispatches[zoneId];
        showToast('已召回该矿脉的驻扎探矿分身。', 'info');
      } else {
        // Deploy
        dispatches[zoneId] = {
          zoneId,
          dispatchedAt: Date.now(),
          workerCount: 1,
          lastCollectTime: Date.now()
        };
        showToast('成功派遣神匠探矿分身驻扎矿脉！将随时间源源不断开采神金与暗器原石！', 'success');
      }
      return {
        ...prev,
        miningDispatch: dispatches
      };
    });
  };

  // Collect All AFK Mining Yields (一键收取所有驻扎收益)
  const handleCollectAfkYield = () => {
    const dispatches = player.miningDispatch || {};
    const activeZones = Object.values(dispatches);
    if (activeZones.length === 0) {
      showToast('当前暂无派遣驻扎的矿脉，请先派遣分身驻扎！', 'info');
      return;
    }

    const now = Date.now();
    let totalHarvestCount = 0;
    const gainedItems: { id: string; name: string; count: number; isDivineMetal?: boolean }[] = [];

    onUpdatePlayer(prev => {
      const currentDispatches = { ...(prev.miningDispatch || {}) };
      const updatedMetals = { ...(prev.divineMetals || {}) };
      const currentInv = [...prev.inventory];

      for (const d of Object.values(currentDispatches) as MiningDispatchState[]) {
        const zone = MINING_VEIN_ZONES.find(z => z.id === d.zoneId);
        if (!zone) continue;

        const timeDiffSeconds = Math.max(0, Math.floor((now - d.lastCollectTime) / 1000));
        // Every 30 seconds yields 1 batch of materials
        const batches = Math.min(120, Math.floor(timeDiffSeconds / 30)); // max 1 hour accumulated per collect

        if (batches > 0) {
          totalHarvestCount += batches;
          for (const mat of zone.producedMaterials) {
            const count = Math.max(1, Math.floor(batches * mat.dropChance * 1.2));
            if (mat.isDivineMetal) {
              updatedMetals[mat.name] = (updatedMetals[mat.name] || 0) + count;
            } else {
              const invIdx = currentInv.findIndex(i => i.id === mat.itemId);
              if (invIdx >= 0) {
                currentInv[invIdx] = {
                  ...currentInv[invIdx],
                  quantity: currentInv[invIdx].quantity + count
                };
              } else {
                currentInv.push({
                  id: mat.itemId,
                  name: mat.name,
                  type: 'material',
                  quantity: count,
                  description: '驻扎矿脉自动采掘获得的稀有神材',
                  icon: 'Hammer',
                  price: 40
                });
              }
            }

            gainedItems.push({
              id: mat.itemId,
              name: mat.name,
              count,
              isDivineMetal: mat.isDivineMetal
            });
          }

          d.lastCollectTime = now;
        }
      }

      return {
        ...prev,
        miningDispatch: currentDispatches,
        divineMetals: updatedMetals,
        inventory: currentInv
      };
    });

    if (totalHarvestCount === 0) {
      showToast('驻扎时间尚短，矿脉正在加速勘探凝矿中，请稍后再来收取！', 'info');
      return;
    }

    SoundEngine.playVictory();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    showToast(`🎉 成功收获各矿脉驻扎产出的丰厚斗铠神金与绝密暗器材料！`, 'success');
  };

  // Handle Smelting in Furnace (神炉炼化)
  const handleCraftSmelt = (recipe: SmelterRecipe) => {
    if (player.level < recipe.requiredLevel) {
      showToast(`魂力等级不足！需要达到 Lv.${recipe.requiredLevel} 才能启动此熔炼法阵！`, 'warning');
      return;
    }

    const multiplier = smeltMultiplier;
    const totalGoldCost = recipe.costGold * multiplier;
    if (player.gold < totalGoldCost) {
      showToast(`金魂币不足！需要 ${totalGoldCost} 金魂币`, 'warning');
      return;
    }

    // Check ingredients
    const divineMetals = player.divineMetals || {};
    for (const ing of recipe.ingredients) {
      const neededCount = ing.count * multiplier;
      if (ing.isDivineMetal) {
        const available = divineMetals[ing.name] || 0;
        if (available < neededCount) {
          showToast(`材料不足！需要【${ing.name}】x${neededCount}，当前拥有 x${available}`, 'warning');
          return;
        }
      } else {
        const invItem = player.inventory.find(i => i.id === ing.itemId);
        const available = invItem ? invItem.quantity : 0;
        if (available < neededCount) {
          showToast(`材料不足！需要【${ing.name}】x${neededCount}，当前拥有 x${available}`, 'warning');
          return;
        }
      }
    }

    SoundEngine.playForge();

    onUpdatePlayer(prev => {
      const updatedMetals = { ...(prev.divineMetals || {}) };
      let updatedInv = [...prev.inventory];

      // Deduct ingredients
      for (const ing of recipe.ingredients) {
        const neededCount = ing.count * multiplier;
        if (ing.isDivineMetal) {
          updatedMetals[ing.name] = Math.max(0, (updatedMetals[ing.name] || 0) - neededCount);
        } else {
          updatedInv = updatedInv.map(item => {
            if (item.id === ing.itemId) {
              return { ...item, quantity: Math.max(0, item.quantity - neededCount) };
            }
            return item;
          }).filter(i => i.quantity > 0);
        }
      }

      // Add target product
      const totalYield = recipe.targetCount * multiplier;
      if (recipe.isDivineMetal) {
        updatedMetals[recipe.targetName] = (updatedMetals[recipe.targetName] || 0) + totalYield;
      } else {
        const invIdx = updatedInv.findIndex(i => i.id === recipe.targetItemId);
        if (invIdx >= 0) {
          updatedInv[invIdx] = {
            ...updatedInv[invIdx],
            quantity: updatedInv[invIdx].quantity + totalYield
          };
        } else {
          updatedInv.push({
            id: recipe.targetItemId,
            name: recipe.targetName,
            type: 'material',
            quantity: totalYield,
            description: recipe.description,
            icon: recipe.targetItemId.includes('core') ? 'Flame' : 'Sparkles',
            price: 150
          });
        }
      }

      return {
        ...prev,
        gold: prev.gold - totalGoldCost,
        divineMetals: updatedMetals,
        inventory: updatedInv
      };
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    showToast(`✨ 天火淬炼成功！获得【${recipe.targetName}】x${recipe.targetCount * multiplier}！`, 'success');
  };

  // Helper to check user quantity of any material
  const getMaterialUserCount = (idOrName: string, isDivine?: boolean) => {
    if (isDivine) {
      return player.divineMetals?.[idOrName] || 0;
    }
    const inv = player.inventory.find(i => i.id === idOrName || i.name === idOrName);
    if (inv) return inv.quantity;
    return player.divineMetals?.[idOrName] || 0;
  };

  // Filtered Wiki Items
  const filteredWiki = useMemo(() => {
    return MATERIAL_WIKI_DB.filter(w => {
      const matchCat = wikiCategoryFilter === 'all' || w.category === wikiCategoryFilter;
      const matchSearch = !wikiSearch || w.name.toLowerCase().includes(wikiSearch.toLowerCase()) || w.description.includes(wikiSearch) || w.sources.some(s => s.includes(wikiSearch)) || w.usedFor.some(u => u.includes(wikiSearch));
      return matchCat && matchSearch;
    });
  }, [wikiSearch, wikiCategoryFilter]);

  const dispatchesCount = Object.keys(player.miningDispatch || {}).length;

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/70 to-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="p-2.5 bg-amber-900/60 border border-amber-400/50 rounded-2xl text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.4)]">
                <Hammer className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">
                  神材宝地 · 庚辛矿脉与秘境采掘场
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  寻访斗罗三大宝地！采集一字至五字斗铠神金、唐门顶级暗器剧毒与绝密材料，神匠熔炼化凡入圣！
                </p>
              </div>
            </div>

            {/* Quick Status Pill Bar */}
            <div className="flex items-center gap-3 flex-wrap mt-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/80 border border-amber-500/30 text-amber-300 font-bold">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>采掘体力: {currentEnergy} / {maxEnergy}</span>
                <span className="text-[10px] text-slate-400 font-normal ml-1">(自动回复)</span>
              </div>
              
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-300 font-medium">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>百炼精金: <strong className="text-amber-300 font-bold">{player.divineMetals?.['百炼精金'] || 0}</strong></span>
                <span className="mx-1 text-slate-600">|</span>
                <span>灵锻秘银: <strong className="text-purple-300 font-bold">{player.divineMetals?.['灵锻秘银'] || 0}</strong></span>
                <span className="mx-1 text-slate-600">|</span>
                <span>魂锻赤金: <strong className="text-rose-300 font-bold">{player.divineMetals?.['魂锻赤金'] || 0}</strong></span>
                <span className="mx-1 text-slate-600">|</span>
                <span>天锻神金: <strong className="text-yellow-300 font-bold">{player.divineMetals?.['天锻神金'] || 0}</strong></span>
              </div>
            </div>
          </div>

          {/* Sub Navigation Buttons */}
          <div className="flex items-center gap-2 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => { SoundEngine.playClick(); setActiveTab('veins'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'veins'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Hammer className="w-4 h-4" />
              <span>神材矿脉探采</span>
            </button>
            <button
              onClick={() => { SoundEngine.playClick(); setActiveTab('smelter'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'smelter'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>神匠天火熔炉</span>
            </button>
            <button
              onClick={() => { SoundEngine.playClick(); setActiveTab('wiki'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'wiki'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>神材获取百科</span>
            </button>
          </div>

        </div>
      </div>

      {/* =========================================================================
          TAB 1: 矿脉探采 (ACTIVE MINING & DISPATCH)
          ========================================================================= */}
      {activeTab === 'veins' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Zone List (4 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
              {[
                { id: 'all', label: '全部宝地' },
                { id: 'gengxin_city', label: '庚辛矿脉' },
                { id: 'forest_swamp', label: '森林毒沼' },
                { id: 'sea_abyss', label: '海渊龙沟' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { SoundEngine.playClick(); setSelectedCategory(cat.id as any); }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Zone Cards */}
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredZones.map(zone => {
                const isSelected = zone.id === selectedZone.id;
                const isLocked = player.level < zone.requiredLevel;
                const isDispatched = Boolean(player.miningDispatch?.[zone.id]);

                return (
                  <div
                    key={zone.id}
                    onClick={() => {
                      SoundEngine.playClick();
                      setSelectedZoneId(zone.id);
                    }}
                    className={`relative p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'bg-slate-900 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                        : isLocked
                        ? 'bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-80'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${zone.badgeColor}`}>
                            {zone.categoryName}
                          </span>
                          {isDispatched && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold animate-pulse">
                              ⛏️ 驻扎开采中
                            </span>
                          )}
                        </div>
                        <h4 className={`font-bold text-sm ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                          {zone.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {zone.subtitle}
                        </p>
                      </div>

                      {isLocked ? (
                        <span className="px-2 py-1 rounded-lg bg-red-950/60 text-red-400 border border-red-500/40 text-[10px] font-bold shrink-0">
                          Lv.{zone.requiredLevel} 解锁
                        </span>
                      ) : (
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-bold text-yellow-400 block">
                            耗体: {zone.staminaCost}点
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            产出: {zone.producedMaterials.length}种
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Produced Materials Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2.5 border-t border-slate-800/80">
                      {zone.producedMaterials.map(m => (
                        <span
                          key={m.itemId}
                          className={`text-[10px] px-2 py-0.5 rounded-lg border font-medium ${
                            m.isDivineMetal
                              ? 'bg-amber-950/50 border-amber-500/40 text-amber-300'
                              : m.type === 'poison'
                              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-900 border-slate-700 text-slate-300'
                          }`}
                        >
                          {m.name} ({getMaterialUserCount(m.isDivineMetal ? m.name : m.itemId, m.isDivineMetal)})
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AFK Harvest Banner */}
            <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <PackageCheck className="w-4 h-4" />
                  <span>分身驻扎矿脉 ({dispatchesCount}处驻守)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  每30秒自动勘探产出一批斗铠神金与暗器原石
                </p>
              </div>

              <button
                onClick={handleCollectAfkYield}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0"
              >
                一键收取产出
              </button>
            </div>

          </div>

          {/* Right Column: Active Gathering Arena (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Active Zone Detail Stage */}
            <div className={`bg-gradient-to-br ${selectedZone.bannerBg} rounded-3xl p-6 border shadow-2xl relative overflow-hidden`}>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${selectedZone.badgeColor}`}>
                      {selectedZone.categoryName}
                    </span>
                    <h3 className="text-xl font-black text-slate-100">
                      {selectedZone.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {selectedZone.description}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleDispatch(selectedZone.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 ${
                    player.miningDispatch?.[selectedZone.id]
                      ? 'bg-red-950/60 border-red-500/50 text-red-300 hover:bg-red-900/60'
                      : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                  }`}
                >
                  <Hammer className="w-3.5 h-3.5" />
                  <span>{player.miningDispatch?.[selectedZone.id] ? '召回驻扎分身' : '派遣驻扎分身'}</span>
                </button>
              </div>

              {/* Tang Skill Synergy Banner */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 mb-5 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-amber-300">
                    唐门绝技勘探加成（当前绝技等级: Lv.{tangSkillLevel}）
                  </h5>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    {selectedZone.tangSkillBonusDesc}
                  </p>
                </div>
              </div>

              {/* Interactive Mining Core Box */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 text-center relative overflow-hidden mb-5">
                <div className="absolute inset-0 bg-radial from-amber-500/5 to-transparent pointer-events-none" />

                {/* Animated Mining Crystal / Rock */}
                <div className={`w-28 h-28 mx-auto mb-4 rounded-3xl flex items-center justify-center border transition-all duration-300 shadow-2xl ${
                  isMiningAnim
                    ? 'scale-90 rotate-6 bg-gradient-to-br from-amber-400 to-yellow-600 border-yellow-200 shadow-[0_0_40px_rgba(245,158,11,0.8)] ring-4 ring-amber-300/60'
                    : 'bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:scale-105'
                }`}>
                  <Hammer className={`w-14 h-14 text-amber-300 transition-transform ${isMiningAnim ? '-rotate-45' : ''}`} />
                </div>

                <h4 className="font-black text-base text-slate-100 mb-1">
                  乱披风碎石 · 魂力天工采掘
                </h4>
                <p className="text-xs text-slate-400 mb-5">
                  运转玄玉手与控鹤擒龙化劲凿击！累积暴击连击已达 <strong className="text-amber-400 font-bold">{miningCombo}</strong> 次
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handlePerformMining(false)}
                    disabled={currentEnergy < selectedZone.staminaCost}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5"
                  >
                    <Hammer className="w-4 h-4" />
                    <span>单次探采 ({selectedZone.staminaCost}点体力)</span>
                  </button>

                  <button
                    onClick={() => handlePerformMining(true)}
                    disabled={currentEnergy < selectedZone.staminaCost * 5}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-600 to-orange-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(234,179,8,0.5)] disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>五连极速爆矿 ({selectedZone.staminaCost * 5}点体力)</span>
                  </button>
                </div>
              </div>

              {/* Recent Drops Grid */}
              <div>
                <h5 className="font-bold text-xs text-slate-300 mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>本次开采收获与该宝地物产一览：</span>
                </h5>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {selectedZone.producedMaterials.map(mat => {
                    const userCount = getMaterialUserCount(mat.isDivineMetal ? mat.name : mat.itemId, mat.isDivineMetal);
                    const recentGain = recentGains.find(g => g.id === mat.itemId);

                    return (
                      <div
                        key={mat.itemId}
                        className={`p-3 rounded-2xl border transition-all ${
                          recentGain
                            ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50'
                            : 'bg-slate-950/80 border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            mat.rarity === 'godly' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                            mat.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            mat.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {mat.typeName}
                          </span>
                          {recentGain && (
                            <span className="text-[10px] text-emerald-400 font-bold animate-bounce">
                              +{recentGain.count}
                            </span>
                          )}
                        </div>

                        <h6 className="font-bold text-xs text-slate-200 truncate">
                          {mat.name}
                        </h6>

                        <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">拥有量:</span>
                          <strong className="text-amber-300 font-bold">{userCount}</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: 神匠天火熔炉 (SMELTER & ALCHEMY)
          ========================================================================= */}
      {activeTab === 'smelter' && (
        <div className="space-y-5">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
                <h3 className="font-black text-lg text-slate-100">
                  神匠天火淬炼炉 · 金属升星提纯
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                千锤百炼化凡入圣！将低阶寒铁矿石逐步熔炼为一字【百炼精金】、二字【灵锻秘银】、三字【魂锻赤金】、四字【天锻神金】与五字【至高超神源石】！
              </p>
            </div>

            {/* Quantity Multiplier Picker */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
              <span className="text-xs text-slate-400 font-bold pl-2">单次炼化倍率:</span>
              {[1, 5, 10].map(mult => (
                <button
                  key={mult}
                  onClick={() => { SoundEngine.playClick(); setSmeltMultiplier(mult); }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    smeltMultiplier === mult
                      ? 'bg-rose-500 text-white shadow-md font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  x{mult}
                </button>
              ))}
            </div>
          </div>

          {/* Smelter Recipes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SMELTER_RECIPES.map(recipe => {
              const isLocked = player.level < recipe.requiredLevel;
              const mult = smeltMultiplier;
              const goldCost = recipe.costGold * mult;
              const hasGold = player.gold >= goldCost;

              // Check ingredients availability
              let canCraft = hasGold && !isLocked;
              const divineMetals = player.divineMetals || {};

              return (
                <div
                  key={recipe.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isLocked
                      ? 'bg-slate-950/60 border-slate-800 opacity-60'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-xl'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-rose-950/60 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                          神炉配方
                        </span>
                        <h4 className="font-bold text-sm text-slate-100">
                          {recipe.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {recipe.description}
                      </p>
                    </div>

                    {isLocked ? (
                      <span className="px-2.5 py-1 rounded-lg bg-red-950/60 text-red-400 border border-red-500/40 text-[10px] font-bold shrink-0">
                        Lv.{recipe.requiredLevel} 解锁
                      </span>
                    ) : (
                      <div className="text-right shrink-0">
                        <span className="text-xs text-amber-300 font-bold block">
                          产出: +{recipe.targetCount * mult}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          拥有: {getMaterialUserCount(recipe.isDivineMetal ? recipe.targetName : recipe.targetItemId, recipe.isDivineMetal)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Required Ingredients */}
                  <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800/80 my-3 space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">所需消耗材料：</span>
                    {recipe.ingredients.map(ing => {
                      const needed = ing.count * mult;
                      const userHave = ing.isDivineMetal ? (divineMetals[ing.name] || 0) : (player.inventory.find(i => i.id === ing.itemId)?.quantity || 0);
                      const isEnough = userHave >= needed;
                      if (!isEnough) canCraft = false;

                      return (
                        <div key={ing.itemId} className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium">【{ing.name}】</span>
                          <span className={`font-bold ${isEnough ? 'text-emerald-400' : 'text-red-400'}`}>
                            {userHave} / {needed}
                          </span>
                        </div>
                      );
                    })}

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                      <span className="text-slate-400">消耗金魂币:</span>
                      <span className={`font-bold ${hasGold ? 'text-amber-300' : 'text-red-400'}`}>
                        {player.gold} / {goldCost}
                      </span>
                    </div>
                  </div>

                  {/* Craft Button */}
                  <button
                    onClick={() => handleCraftSmelt(recipe)}
                    disabled={!canCraft}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-1.5"
                  >
                    <Flame className="w-4 h-4" />
                    <span>天火淬炼 (铸造 x{recipe.targetCount * mult} {recipe.targetName})</span>
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 3: 神材获取百科 (MATERIAL WIKI & QUICK SEARCH)
          ========================================================================= */}
      {activeTab === 'wiki' && (
        <div className="space-y-5">
          
          {/* Wiki Search & Filter Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={wikiSearch}
                onChange={e => setWikiSearch(e.target.value)}
                placeholder="搜索材料名称、出处或用途..."
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 w-full md:w-auto">
              {[
                { id: 'all', label: '全部神材' },
                { id: '斗铠神金', label: '斗铠神金' },
                { id: '唐门暗器材', label: '唐门暗器材料' },
                { id: '魂导核心材', label: '魂导核心材料' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { SoundEngine.playClick(); setWikiCategoryFilter(cat.id as any); }}
                  className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    wikiCategoryFilter === cat.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

          {/* Wiki Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWiki.map(item => {
              const isDivine = item.category === '斗铠神金';
              const userHave = getMaterialUserCount(item.id, isDivine);

              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${
                          item.category === '斗铠神金'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                            : item.category === '唐门暗器材'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                            : 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40'
                        }`}>
                          {item.category} · {item.tierRank}
                        </span>
                        <h4 className="font-bold text-base text-slate-100 mt-1">
                          {item.name}
                        </h4>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">当前拥有</span>
                        <strong className="text-sm font-black text-amber-300">{userHave}</strong>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {item.description}
                    </p>

                    {/* Sources */}
                    <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 mb-3 space-y-1">
                      <span className="text-[10px] font-bold text-cyan-400 block">📍 主要获取途径：</span>
                      {item.sources.map((src, i) => (
                        <span key={i} className="text-[11px] text-slate-300 block">
                          • {src}
                        </span>
                      ))}
                    </div>

                    {/* Used For */}
                    <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-amber-400 block">🔨 用于锻造铸造：</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.usedFor.map((use, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300 font-medium">
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Jump To Mine Button */}
                  <button
                    onClick={() => {
                      SoundEngine.playClick();
                      setSelectedZoneId(item.recommendedZoneId);
                      setActiveTab('veins');
                    }}
                    className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <span>前往产出宝地开采</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
