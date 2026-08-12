import React, { useState, useEffect } from 'react';
import { Player, AutoBattleStrategy, CombatTacticalStance, SkillPriorityItem } from '../types/game';
import {
  STANCE_PRESETS,
  generateSkillPriorityList,
  sortSkillListByStance,
  calculateAfkWinRate,
  createDefaultAutoBattleStrategy
} from '../data/afkStrategyData';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Swords,
  Shield,
  Zap,
  Sparkles,
  Award,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Snowflake,
  Play,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Star,
  Settings,
  Activity,
  Heart,
  Crosshair,
  TrendingUp,
  Eye,
  Crown,
  ChevronRight,
  Clock,
  Coins
} from 'lucide-react';

interface AfkStrategySettingsViewProps {
  player: Player;
  onUpdatePlayer?: (updater: (prev: Player) => Player) => void;
  onMeditateGainExp: (exp: number) => void;
}

interface SimulationLog {
  turn: number;
  actor: string;
  action: string;
  stanceNote: string;
  damage: number;
  isCrit: boolean;
  type: 'attack' | 'control' | 'defense' | 'combo' | 'armor';
}

export const AfkStrategySettingsView: React.FC<AfkStrategySettingsViewProps> = ({
  player,
  onUpdatePlayer,
  onMeditateGainExp
}) => {
  // Initialize strategy from player or default
  const [strategy, setStrategy] = useState<AutoBattleStrategy>(() => {
    if (player.autoBattleStrategy && player.autoBattleStrategy.skillPriorityList?.length > 0) {
      return player.autoBattleStrategy;
    }
    return createDefaultAutoBattleStrategy(player);
  });

  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simOpponent, setSimOpponent] = useState<'tiger' | 'scorpion' | 'ape' | 'wuhun'>('tiger');
  const [simLogs, setSimLogs] = useState<SimulationLog[]>([]);
  const [simResult, setSimResult] = useState<{
    victory: boolean;
    turns: number;
    playerHpPercent: number;
    totalDamage: number;
    rating: string;
  } | null>(null);

  // Realtime AFK offline reward simulation in academy
  const [afkExpAccumulated, setAfkExpAccumulated] = useState(120);
  const [afkGoldAccumulated, setAfkGoldAccumulated] = useState(45);
  const [afkEssenceAccumulated, setAfkEssenceAccumulated] = useState(5);
  const [afkRunning, setAfkRunning] = useState(true);

  // Calculate live win rate
  const winRateInfo = calculateAfkWinRate(player, strategy);

  // Synchronize skill priority list if player martial soul or skills change
  useEffect(() => {
    if (!strategy.skillPriorityList || strategy.skillPriorityList.length === 0) {
      const generated = generateSkillPriorityList(player, strategy.tacticalStance);
      setStrategy(prev => ({
        ...prev,
        skillPriorityList: generated
      }));
    }
  }, [player.martialSouls, player.activeSoulIndex, player.battleArmor, player.soulTools, player.douluo4Companions]);

  // Realtime AFK reward accumulation ticker
  useEffect(() => {
    if (!afkRunning) return;
    const interval = setInterval(() => {
      const bonusMult = 1 + (winRateInfo.bonusRate / 100);
      const expTick = Math.max(2, Math.floor((8 + player.level * 3) * bonusMult));
      const goldTick = Math.max(1, Math.floor((3 + player.level * 1.2) * bonusMult));

      setAfkExpAccumulated(prev => prev + expTick);
      setAfkGoldAccumulated(prev => prev + goldTick);
      if (Math.random() < 0.2) {
        setAfkEssenceAccumulated(prev => prev + 1);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [afkRunning, winRateInfo.bonusRate, player.level]);

  // Switch tactical stance preset
  const handleSelectStance = (stanceId: CombatTacticalStance) => {
    SoundEngine.playClick();
    const preset = STANCE_PRESETS.find(p => p.id === stanceId) || STANCE_PRESETS[0];

    const currentList = strategy.skillPriorityList?.length > 0
      ? strategy.skillPriorityList
      : generateSkillPriorityList(player, stanceId);

    const reorderedList = sortSkillListByStance(currentList, stanceId);

    const updated: AutoBattleStrategy = {
      ...strategy,
      tacticalStance: stanceId,
      prioritySkillCategory: preset.priorityCategory,
      skillPriorityList: reorderedList,
      offlineBonusWinRate: preset.winRateBonus
    };

    setStrategy(updated);
    commitStrategy(updated, `已切换至【${preset.name}】战术流派！技能出招序列已自动优化。`);
  };

  // Reorder a skill in priority list: move up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    SoundEngine.playClick();
    const list = [...strategy.skillPriorityList];
    const temp = list[index - 1];
    list[index - 1] = list[index];
    list[index] = temp;

    const reIndexed = list.map((item, idx) => ({ ...item, priorityOrder: idx + 1 }));
    const updated: AutoBattleStrategy = {
      ...strategy,
      tacticalStance: 'custom',
      skillPriorityList: reIndexed
    };
    setStrategy(updated);
    commitStrategy(updated);
  };

  // Reorder a skill in priority list: move down
  const handleMoveDown = (index: number) => {
    if (index >= strategy.skillPriorityList.length - 1) return;
    SoundEngine.playClick();
    const list = [...strategy.skillPriorityList];
    const temp = list[index + 1];
    list[index + 1] = list[index];
    list[index] = temp;

    const reIndexed = list.map((item, idx) => ({ ...item, priorityOrder: idx + 1 }));
    const updated: AutoBattleStrategy = {
      ...strategy,
      tacticalStance: 'custom',
      skillPriorityList: reIndexed
    };
    setStrategy(updated);
    commitStrategy(updated);
  };

  // Set as top priority
  const handleSetTop = (index: number) => {
    if (index === 0) return;
    SoundEngine.playBreakthrough();
    const list = [...strategy.skillPriorityList];
    const [selected] = list.splice(index, 1);
    list.unshift(selected);

    const reIndexed = list.map((item, idx) => ({ ...item, priorityOrder: idx + 1 }));
    const updated: AutoBattleStrategy = {
      ...strategy,
      tacticalStance: 'custom',
      skillPriorityList: reIndexed
    };
    setStrategy(updated);
    commitStrategy(updated, `已将【${selected.name}】设置为第一顺位！`);
  };

  // Toggle skill inclusion
  const handleToggleSkill = (index: number) => {
    SoundEngine.playClick();
    const list = [...strategy.skillPriorityList];
    list[index] = { ...list[index], isEnabled: !list[index].isEnabled };

    const updated: AutoBattleStrategy = {
      ...strategy,
      skillPriorityList: list
    };
    setStrategy(updated);
    commitStrategy(updated);
  };

  // Quick sort filters
  const handleQuickSort = (category: 'attack' | 'control' | 'defense') => {
    SoundEngine.playClick();
    let targetStance: CombatTacticalStance = 'burst';
    if (category === 'control') targetStance = 'control';
    if (category === 'defense') targetStance = 'sustain';

    handleSelectStance(targetStance);
  };

  // Reset to default list
  const handleResetDefaults = () => {
    SoundEngine.playClick();
    const defaultList = generateSkillPriorityList(player, 'burst');
    const updated: AutoBattleStrategy = {
      ...createDefaultAutoBattleStrategy(player),
      skillPriorityList: defaultList
    };
    setStrategy(updated);
    commitStrategy(updated, '已重置恢复【强攻爆发流】默认出招顺序。');
  };

  // Commit changes to Player state
  const commitStrategy = (strat: AutoBattleStrategy, message?: string) => {
    onUpdatePlayer?.(prev => ({
      ...prev,
      autoBattleStrategy: strat
    }));

    if (message) {
      setSavedBanner(message);
      setTimeout(() => setSavedBanner(null), 3000);
    }
  };

  // Harvest AFK rewards
  const handleHarvestAfkRewards = () => {
    if (afkExpAccumulated <= 0) return;
    SoundEngine.playMeditationChime();
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });

    onMeditateGainExp(afkExpAccumulated);
    onUpdatePlayer?.(prev => ({
      ...prev,
      gold: prev.gold + afkGoldAccumulated,
      soulBoneEssence: (prev.soulBoneEssence || 0) + afkEssenceAccumulated
    }));

    setSavedBanner(`🎉 成功收获拟态挂机收益！获得 ${afkExpAccumulated} 修为经验、${afkGoldAccumulated} 金魂币及 ${afkEssenceAccumulated} 魂骨本源！`);
    setTimeout(() => setSavedBanner(null), 4000);

    setAfkExpAccumulated(0);
    setAfkGoldAccumulated(0);
    setAfkEssenceAccumulated(0);
  };

  // Execute AFK simulation battle
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimLogs([]);
    setSimResult(null);
    SoundEngine.playSlash();

    const oppConfigs = {
      tiger: { name: '万年暗魔邪神虎', type: '敏攻极速', hp: 85000, atk: 4800, def: 2200 },
      scorpion: { name: '五万年人面魔蛛皇', type: '剧毒强控', hp: 120000, atk: 5200, def: 3100 },
      ape: { name: '十万年泰坦巨猿', type: '重装霸体', hp: 260000, atk: 7800, def: 4500 },
      wuhun: { name: '武魂殿黄金一代战队', type: '协同合击', hp: 180000, atk: 6500, def: 3800 }
    };

    const target = oppConfigs[simOpponent];
    const enabledSkills = strategy.skillPriorityList.filter(s => s.isEnabled);

    setTimeout(() => {
      const logs: SimulationLog[] = [];
      let enemyCurrentHp = target.hp;
      let totalDmg = 0;
      let round = 1;

      // Simulate up to 4 rounds based on priority order
      for (let i = 0; i < Math.min(4, enabledSkills.length); i++) {
        const skill = enabledSkills[i];
        let dmg = 0;
        let isCrit = Math.random() < 0.4;
        const critMult = isCrit ? 1.8 : 1.0;

        let stanceNote = '';
        if (skill.category === 'control') {
          stanceNote = '【控制压制生效】 封锁敌方核心行动，免受狂暴反击！';
          dmg = Math.floor((player.level * 450 + 15000) * critMult);
        } else if (skill.category === 'attack') {
          stanceNote = '【强攻爆发破甲】 撕裂护体魂力，打出高额暴击爆发！';
          dmg = Math.floor((player.level * 680 + 26000) * critMult);
        } else if (skill.type === 'battle_armor') {
          stanceNote = '【斗铠神威降临】 龙皇斗铠实体化，全属性暴涨贯穿敌阵！';
          dmg = Math.floor((player.level * 900 + 42000) * critMult);
        } else if (skill.type === 'companion') {
          stanceNote = '【伙伴战队连携】 出战伙伴凌空突袭，打出连携武魂融合技！';
          dmg = Math.floor((player.level * 600 + 22000) * critMult);
        } else {
          stanceNote = '【战术魂技施展】 稳健压制对手，削减其护盾与生机！';
          dmg = Math.floor((player.level * 400 + 12000) * critMult);
        }

        totalDmg += dmg;
        enemyCurrentHp = Math.max(0, enemyCurrentHp - dmg);

        logs.push({
          turn: round,
          actor: player.name,
          action: `第${i + 1}顺位 释放【${skill.name}】`,
          stanceNote,
          damage: dmg,
          isCrit,
          type: skill.category === 'control' ? 'control' :
                skill.type === 'battle_armor' ? 'armor' :
                skill.type === 'companion' ? 'combo' : 'attack'
        });

        round++;
        if (enemyCurrentHp <= 0) break;
      }

      setSimLogs(logs);
      setSimResult({
        victory: true,
        turns: logs.length,
        playerHpPercent: strategy.tacticalStance === 'control' ? 95 : strategy.tacticalStance === 'sustain' ? 98 : 88,
        totalDamage: totalDmg,
        rating: strategy.tacticalStance === 'control' ? 'SSS 完美无伤控场' :
                strategy.tacticalStance === 'burst' ? 'SSS 瞬间破甲斩杀' :
                strategy.tacticalStance === 'combo' ? 'SS+ 战队连携神威' : 'S+ 稳健克敌'
      });

      setIsSimulating(false);
      SoundEngine.playBreakthrough();
      confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
    }, 700);
  };

  const currentStancePreset = STANCE_PRESETS.find(p => p.id === strategy.tacticalStance) || STANCE_PRESETS[0];

  return (
    <div className="space-y-6">
      
      {/* SUCCESS/SAVE NOTIFICATION BANNER */}
      {savedBanner && (
        <div className="bg-emerald-950/90 border border-emerald-500/60 rounded-2xl p-4 flex items-center justify-between animate-fade-in shadow-xl">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-bold text-emerald-200">{savedBanner}</span>
          </div>
          <button
            onClick={() => setSavedBanner(null)}
            className="text-xs text-emerald-400 hover:text-emerald-200 underline font-semibold"
          >
            我知道了
          </button>
        </div>
      )}

      {/* HEADER BANNER & WINRATE SUMMARY CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 border border-indigo-500/50 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Title & Strategy Description */}
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                史莱克战斗学院 · 拟态战术模拟
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {currentStancePreset.badge}
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
              <Sliders className="w-6 h-6 text-indigo-400" />
              <span>智能挂机策略 · 技能出招优先级队列</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              精细化配置实战与离线托管中的技能出招序列 <strong className="text-amber-300">（先手控制 / 强攻爆发 / 防守反击）</strong> 以及斗铠降临与魂导炮触发时机。精准的战术编排可大幅提高拟态修炼与魂兽猎杀胜率！
            </p>

            {/* Tactical Stance Tagline */}
            <div className="pt-2 flex items-center gap-2 text-xs text-indigo-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>当前战术核心: <strong className="text-amber-300">{currentStancePreset.name}</strong> — {currentStancePreset.tagline}</span>
            </div>
          </div>

          {/* Right Win Rate Gauge Card */}
          <div className="lg:col-span-4 bg-slate-950/90 border border-indigo-500/40 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">预估挂机胜率</span>
              <span className="text-xs font-mono font-black text-emerald-400">
                +{winRateInfo.bonusRate}% 战术增幅
              </span>
            </div>

            {/* Big Winrate Number */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-400 font-mono">
                {winRateInfo.totalWinRate}%
              </span>
              <span className="text-xs text-emerald-400 font-bold">高胜率 (极度稳定)</span>
            </div>

            {/* Winrate Progress Bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/80">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                style={{ width: `${winRateInfo.totalWinRate}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              {winRateInfo.analysisText}
            </p>
          </div>

        </div>
      </div>

      {/* SECTION 1: TACTICAL STANCES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-black text-slate-100">核心战术流派预设 (一键自动编排)</h3>
          </div>
          <span className="text-xs text-slate-400">点击任意流派即可自动重组技能优先级队列</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {STANCE_PRESETS.map(preset => {
            const isSelected = strategy.tacticalStance === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectStance(preset.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? `bg-gradient-to-b ${preset.bgGradient} ${preset.borderTheme} shadow-[0_0_20px_rgba(99,102,241,0.3)] ring-2 ring-indigo-500/50`
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className={`font-black text-xs ${isSelected ? preset.colorTheme : 'text-slate-200'}`}>
                      {preset.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/80 text-emerald-400 font-mono font-bold">
                      +{preset.winRateBonus}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed mb-3">
                    {preset.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">{preset.badge}</span>
                  <span className={isSelected ? 'text-indigo-300 font-bold' : 'text-slate-500'}>
                    {isSelected ? '✓ 当前生效' : '点击应用'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE SKILL PRIORITY SEQUENCE & QUICK TOOLS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        
        {/* Sequence Control Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-black text-slate-100">技能施放优先级出招队列</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              排在上方（第1顺位）的技能拥有最高出招权重，冷却就绪且魂力充足时立即优先释放
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleQuickSort('attack')}
              className="px-2.5 py-1 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>强攻先手</span>
            </button>
            <button
              onClick={() => handleQuickSort('control')}
              className="px-2.5 py-1 bg-sky-950/60 hover:bg-sky-900 border border-sky-500/40 text-sky-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              <Snowflake className="w-3.5 h-3.5 text-sky-400" />
              <span>控制先手</span>
            </button>
            <button
              onClick={() => handleQuickSort('defense')}
              className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>防御先手</span>
            </button>
            <button
              onClick={handleResetDefaults}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>恢复默认</span>
            </button>
          </div>
        </div>

        {/* Skill Items List */}
        <div className="space-y-2.5">
          {strategy.skillPriorityList.map((item, index) => {
            const isTop = index === 0;

            const categoryBadgeStyle =
              item.category === 'control' ? 'bg-sky-950/80 text-sky-300 border-sky-500/50' :
              item.category === 'defense' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' :
              item.category === 'buff' ? 'bg-purple-950/80 text-purple-300 border-purple-500/50' :
              item.category === 'special' ? 'bg-amber-950/80 text-amber-300 border-amber-500/50' :
              'bg-red-950/80 text-red-300 border-red-500/50';

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                  !item.isEnabled
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : isTop
                    ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/60 shadow-lg ring-1 ring-amber-500/40'
                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Left: Priority Badge, Category & Skill Name */}
                <div className="flex items-center gap-3">
                  {/* Priority Number Badge */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isTop
                        ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-md font-mono'
                        : index < 3
                        ? 'bg-indigo-900/60 text-indigo-200 border border-indigo-500/40 font-mono'
                        : 'bg-slate-800 text-slate-400 font-mono'
                    }`}
                  >
                    {isTop ? '★1' : `#${index + 1}`}
                  </div>

                  {/* Skill Details */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-100">{item.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${categoryBadgeStyle}`}>
                        {item.categoryName}
                      </span>
                      {item.soulCost !== undefined && (
                        <span className="text-[10px] text-cyan-400 font-mono font-semibold">
                          消耗: {item.soulCost} 魂力
                        </span>
                      )}
                      {item.cooldown !== undefined && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          冷却: {item.cooldown} 回合
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1 max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right: Reorder & Toggle Action Controls */}
                <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                  
                  {/* Set Top Button */}
                  {!isTop && item.isEnabled && (
                    <button
                      onClick={() => handleSetTop(index)}
                      title="置顶为第一顺位"
                      className="px-2 py-1 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>置顶</span>
                    </button>
                  )}

                  {/* Move Up */}
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="上移顺位"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg transition-all"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === strategy.skillPriorityList.length - 1}
                    title="下移顺位"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg transition-all"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Enable/Disable Toggle */}
                  <button
                    onClick={() => handleToggleSkill(index)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                      item.isEnabled
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    {item.isEnabled ? '已启用' : '已禁用'}
                  </button>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* SECTION 3: FINE-TUNING TACTICAL RULES & THRESHOLDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Battle Armor & Soul Tools Automation Rule */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="font-black text-sm text-slate-100">斗铠与定装魂导器触发策略</h4>
          </div>

          {/* Battle Armor trigger timing */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-bold">斗铠附体释放时机:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'instant', label: '开局立即释放', desc: '爆发拉满碾压' },
                { id: 'low_hp', label: '生命<50% 应急', desc: '绝境护体逆转' },
                { id: 'never', label: '手动施放', desc: '保留神级本源' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    SoundEngine.playClick();
                    const updated = { ...strategy, autoBattleArmor: opt.id as any };
                    setStrategy(updated);
                    commitStrategy(updated);
                  }}
                  className={`p-2 rounded-xl text-left border text-xs transition-all ${
                    strategy.autoBattleArmor === opt.id
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[10px] text-slate-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Soul Tool Trigger timing */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <label className="text-xs text-slate-400 font-bold">定装魂导炮发射时机:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'always', label: '就绪即发射', desc: '高频火力覆盖' },
                { id: 'execute', label: '残血收割发射', desc: '敌方<50%血收割' },
                { id: 'never', label: '禁用自动发射', desc: '仅纯手动触发' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    SoundEngine.playClick();
                    const updated = { ...strategy, autoSoulTool: opt.id as any };
                    setStrategy(updated);
                    commitStrategy(updated);
                  }}
                  className={`p-2 rounded-xl text-left border text-xs transition-all ${
                    strategy.autoSoulTool === opt.id
                      ? 'bg-sky-950/80 border-sky-500 text-sky-200'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[10px] text-slate-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Companion Auto-Synergy & Domain Toggles */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                SoundEngine.playClick();
                const updated = { ...strategy, autoCompanions: !strategy.autoCompanions };
                setStrategy(updated);
                commitStrategy(updated);
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                strategy.autoCompanions
                  ? 'bg-purple-950/60 border-purple-500/60 text-purple-200'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400'
              }`}
            >
              <span>战队伙伴连携</span>
              <span>{strategy.autoCompanions ? '✓ 自动唤出' : '✕ 已禁用'}</span>
            </button>

            <button
              onClick={() => {
                SoundEngine.playClick();
                const updated = { ...strategy, autoDomain: !strategy.autoDomain };
                setStrategy(updated);
                commitStrategy(updated);
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                strategy.autoDomain
                  ? 'bg-red-950/60 border-red-500/60 text-red-200'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400'
              }`}
            >
              <span>至尊神级领域</span>
              <span>{strategy.autoDomain ? '✓ 开局展开' : '✕ 已禁用'}</span>
            </button>
          </div>
        </div>

        {/* Survival & HP/MP Threshold Rules */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-400" />
            <h4 className="font-black text-sm text-slate-100">生存急救与玄天功控气底线</h4>
          </div>

          {/* Auto Potion Threshold */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold">自动吞服灵药阈值:</span>
              <span className="text-emerald-400 font-mono font-bold">
                生命值低于 {strategy.autoPotionHpThreshold || 35}% 时自动回春
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[25, 35, 50].map(val => (
                <button
                  key={val}
                  onClick={() => {
                    SoundEngine.playClick();
                    const updated = { ...strategy, autoPotionHpThreshold: val };
                    setStrategy(updated);
                    commitStrategy(updated);
                  }}
                  className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${
                    strategy.autoPotionHpThreshold === val
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  低于 {val}%
                </button>
              ))}
            </div>
          </div>

          {/* MP Reserve Threshold */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold">玄天功护体魂力储备:</span>
              <span className="text-cyan-400 font-mono font-bold">
                保留 {strategy.mpReserveThreshold || 15}% 魂力防止力竭
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[10, 15, 25].map(val => (
                <button
                  key={val}
                  onClick={() => {
                    SoundEngine.playClick();
                    const updated = { ...strategy, mpReserveThreshold: val };
                    setStrategy(updated);
                    commitStrategy(updated);
                  }}
                  className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${
                    strategy.mpReserveThreshold === val
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  保留 {val}% 魂力
                </button>
              ))}
            </div>
          </div>

          {/* Hidden Weapon Auto-Throw Toggle */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                SoundEngine.playClick();
                const updated = { ...strategy, autoHiddenWeapons: !strategy.autoHiddenWeapons };
                setStrategy(updated);
                commitStrategy(updated);
              }}
              className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                strategy.autoHiddenWeapons
                  ? 'bg-amber-950/60 border-amber-500/60 text-amber-200'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400'
              }`}
            >
              <span>唐门机括暗器自动绝杀</span>
              <span>{strategy.autoHiddenWeapons ? '✓ 自动投掷' : '✕ 已禁用'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* SECTION 4: AFK HARVESTING & SIMULATION SANDBOX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Continuous AFK Harvesting in Academy */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/40 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h4 className="font-black text-sm text-slate-100">史莱克拟态空间 · 离线挂机修炼</h4>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              挂机中
            </span>
          </div>

          <p className="text-xs text-slate-400">
            根据您当前设定的【{currentStancePreset.name}】战术，魂师在模拟环境中自动扫荡万年魂兽，源源不断地产出实战收益。
          </p>

          {/* Accumulated Reward Cards */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-3">
              <span className="text-[10px] text-slate-400">修炼修为</span>
              <div className="text-lg font-black text-indigo-300 font-mono mt-1">
                +{afkExpAccumulated}
              </div>
            </div>
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-3">
              <span className="text-[10px] text-slate-400">金魂币</span>
              <div className="text-lg font-black text-amber-300 font-mono mt-1">
                +{afkGoldAccumulated}
              </div>
            </div>
            <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-3">
              <span className="text-[10px] text-slate-400">魂骨本源</span>
              <div className="text-lg font-black text-purple-300 font-mono mt-1">
                +{afkEssenceAccumulated}
              </div>
            </div>
          </div>

          {/* Harvest Button */}
          <button
            onClick={handleHarvestAfkRewards}
            disabled={afkExpAccumulated <= 0}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:brightness-110 active:scale-95 text-white font-black text-sm rounded-2xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>一键领取挂机修炼收益</span>
          </button>
        </div>

        {/* Right: Live Battle Simulation Sandbox */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-amber-400" />
              <h4 className="font-black text-sm text-slate-100">战斗推演沙盘 · 战术实战评测</h4>
            </div>

            {/* Test Opponent Picker */}
            <div className="flex items-center gap-1.5">
              {[
                { id: 'tiger', name: '暗魔邪神虎' },
                { id: 'scorpion', name: '人面蛛皇' },
                { id: 'ape', name: '泰坦巨猿' },
                { id: 'wuhun', name: '武魂殿战队' }
              ].map(opp => (
                <button
                  key={opp.id}
                  onClick={() => setSimOpponent(opp.id as any)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                    simOpponent === opp.id
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opp.name}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400">
            实时推演您当前设定的技能出招序列、控场成功率与爆发斩杀力：
          </p>

          {/* Simulation Output Area */}
          <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 min-h-[160px] max-h-[220px] overflow-y-auto space-y-2 font-sans text-xs">
            {simLogs.length === 0 ? (
              <div className="py-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                <Crosshair className="w-8 h-8 text-slate-600" />
                <span>点击下方推演按钮，验证当前战术序列的实战威能</span>
              </div>
            ) : (
              simLogs.map(log => (
                <div
                  key={log.turn}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1 animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">
                      第 {log.turn} 回合 · {log.action}
                    </span>
                    <span className="font-mono font-bold text-red-400">
                      造成 {log.damage.toLocaleString()} 点伤害 {log.isCrit && '⚡ 暴击！'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {log.stanceNote}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Simulation Victory Rating & Run Button */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            {simResult && (
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-amber-300">
                  战术评级: {simResult.rating} (剩余血量 {simResult.playerHpPercent}%)
                </span>
              </div>
            )}

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="ml-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>{isSimulating ? '战术推演中...' : '开始战术推演'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* FINAL SAVE & APPLY BUTTON */}
      <div className="bg-slate-900/90 border border-indigo-500/40 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-black text-sm text-slate-100">战斗战术就绪</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            策略保存后将即时同步生效于各类实战挂机与离线拟态训练
          </p>
        </div>

        <button
          onClick={() => {
            SoundEngine.playBreakthrough();
            commitStrategy(strategy, '✨ 挂机战斗战术已成功保存并全局生效！');
            confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 active:scale-95 text-white font-black text-sm rounded-2xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center gap-2 shrink-0"
        >
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>保存并应用战术策略</span>
        </button>
      </div>

    </div>
  );
};
