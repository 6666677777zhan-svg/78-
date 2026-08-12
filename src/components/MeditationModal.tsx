import React, { useState, useEffect } from 'react';
import { Player, Item } from '../types/game';
import { getSoulRankTitle } from '../data/martialSouls';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Flame, Zap, Coins, Clock, Award, Shield, 
  CheckCircle2, RotateCcw, ArrowUpRight, Heart, X, Feather, 
  Play, RefreshCw, Sun, Moon, Layers
} from 'lucide-react';

interface MeditationModalProps {
  player: Player;
  onUpdatePlayer: (updater: (prev: Player) => Player) => void;
  onAddExpAndGold: (exp: number, gold: number) => void;
  onClose: () => void;
  showToast?: (message: string, type?: 'success' | 'info' | 'gold') => void;
  isAutoOfflineNotice?: boolean;
}

export interface MeditationRates {
  expPerSec: number;
  goldPerMin: number;
  totalMultiplier: number;
  buffs: { name: string; bonus: string }[];
}

export function calculateMeditationRates(player: Player): MeditationRates {
  const activeSoul = player.martialSouls[player.activeSoulIndex] || player.martialSouls[0];
  const ringCount = activeSoul.skills?.length || 0;

  // Base rate per second
  let baseExp = Math.max(1, Math.floor(player.level * 0.8)) + ringCount * 2;
  let baseGoldPerMin = Math.floor(player.level * 1.6) + 8;

  const buffs: { name: string; bonus: string }[] = [];
  let totalMultiplier = 1.0;

  // 1. Tang Sect Xuan Tian Gong internal skill
  if (player.tangSectSkills?.xuantian) {
    const lvl = player.tangSectSkills.xuantian.level || 1;
    const bonus = lvl * 0.15; // +15% per lvl
    totalMultiplier += bonus;
    buffs.push({ name: `玄天功 第${lvl}重`, bonus: `+${Math.round(bonus * 100)}% 冥想效果` });
  }

  // 2. Twin Martial Souls resonance
  if (player.martialSouls.length > 1) {
    totalMultiplier += 0.25;
    buffs.push({ name: '双生武魂共鸣', bonus: '+25% 吸纳速率' });
  }

  // 3. Spirit Array Level
  const arrayLvl = player.cultivation?.spiritArrayLevel || 1;
  if (arrayLvl > 1) {
    const bonus = (arrayLvl - 1) * 0.10;
    totalMultiplier += bonus;
    buffs.push({ name: `聚灵法阵 Lv.${arrayLvl}`, bonus: `+${Math.round(bonus * 100)}% 灵气汇聚` });
  }

  // 4. God Position / Divine Affinity
  if (player.godPosition) {
    totalMultiplier += 0.35;
    buffs.push({ name: `【${player.godPosition}】位阶`, bonus: '+35% 神级法则冥想' });
  }

  // 5. Difficulty multiplier
  if (player.worldDifficulty === 'nightmare') {
    totalMultiplier += 0.20;
    buffs.push({ name: '噩梦模式磨砺', bonus: '+20% 修为收益' });
  } else if (player.worldDifficulty === 'godlike') {
    totalMultiplier += 0.50;
    buffs.push({ name: '神明深渊法则', bonus: '+50% 修为收益' });
  }

  const finalExpPerSec = Math.max(1, Math.floor(baseExp * totalMultiplier));
  const finalGoldPerMin = Math.max(1, Math.floor(baseGoldPerMin * totalMultiplier));

  return {
    expPerSec: finalExpPerSec,
    goldPerMin: finalGoldPerMin,
    totalMultiplier: parseFloat(totalMultiplier.toFixed(2)),
    buffs
  };
}

export function calculateMeditationRewards(player: Player, nowTime: number = Date.now()) {
  const lastTime = player.lastMeditationTime || nowTime;
  const elapsedSec = Math.max(0, Math.floor((nowTime - lastTime) / 1000));
  
  // Cap max offline meditation storage at 24 hours (86,400 seconds)
  const MAX_OFFLINE_SEC = 86400;
  const effectiveSec = Math.min(MAX_OFFLINE_SEC, elapsedSec);

  const rates = calculateMeditationRates(player);

  const accumulatedExp = Math.floor(effectiveSec * rates.expPerSec);
  const accumulatedGold = Math.floor((effectiveSec / 60) * rates.goldPerMin);

  // Bonus Item Drops for every 30 minutes of meditation (1800 sec)
  const dropIntervals = Math.floor(effectiveSec / 1800);
  const discoveredItems: Item[] = [];

  if (dropIntervals > 0) {
    discoveredItems.push({
      id: 'spirit_iron_ore',
      name: '沉银矿石',
      type: 'material',
      quantity: Math.min(50, dropIntervals * 2),
      description: '冥想顿悟时借天地灵气凝练萃取的沉银精矿',
      icon: 'Hammer',
      price: 35
    });

    if (dropIntervals >= 2) {
      discoveredItems.push({
        id: 'high_spirit_crystal',
        name: '极品魂晶',
        type: 'material',
        quantity: Math.min(20, Math.floor(dropIntervals * 1.5)),
        description: '静心打坐时天地灵气结晶',
        icon: 'Zap',
        price: 80
      });
    }

    if (dropIntervals >= 4) {
      discoveredItems.push({
        id: 'healing_pill',
        name: '回春丹',
        type: 'consumable',
        quantity: Math.min(10, Math.floor(dropIntervals)),
        description: '冥想中调理经脉炼制的疗伤佳品',
        icon: 'Heart',
        price: 20
      });
    }
  }

  return {
    elapsedSec,
    effectiveSec,
    isCapped: elapsedSec >= MAX_OFFLINE_SEC,
    rates,
    accumulatedExp,
    accumulatedGold,
    discoveredItems
  };
}

export const MeditationModal: React.FC<MeditationModalProps> = ({
  player,
  onUpdatePlayer,
  onAddExpAndGold,
  onClose,
  showToast,
  isAutoOfflineNotice = false
}) => {
  const [now, setNow] = useState<number>(Date.now());
  const [isClaiming, setIsClaiming] = useState(false);

  // Live timer tick every 1 second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const rewards = calculateMeditationRewards(player, now);
  const rankInfo = getSoulRankTitle(player.level);

  // Format time as HH:MM:SS
  const formatDuration = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs}小时 ${mins}分 ${secs}秒`;
    }
    return `${mins}分 ${secs}秒`;
  };

  // Claim Meditation Rewards
  const handleClaim = () => {
    if (rewards.accumulatedExp <= 0 && rewards.accumulatedGold <= 0) {
      showToast?.('目前积累的冥想修为较少，请稍后再来领取！', 'info');
      return;
    }

    setIsClaiming(true);
    SoundEngine.playVictory();

    // 1. Add Exp & Gold
    onAddExpAndGold(rewards.accumulatedExp, rewards.accumulatedGold);

    // 2. Update Items & reset lastMeditationTime
    onUpdatePlayer(prev => {
      const updatedInventory = [...prev.inventory];

      rewards.discoveredItems.forEach(item => {
        const existingIndex = updatedInventory.findIndex(i => i.id === item.id);
        if (existingIndex >= 0) {
          updatedInventory[existingIndex] = {
            ...updatedInventory[existingIndex],
            quantity: updatedInventory[existingIndex].quantity + item.quantity
          };
        } else {
          updatedInventory.push({ ...item });
        }
      });

      return {
        ...prev,
        lastMeditationTime: Date.now(),
        inventory: updatedInventory,
        soulBoneEssence: (prev.soulBoneEssence || 0) + Math.floor(rewards.effectiveSec / 1200) * 10
      };
    });

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}

    showToast?.(
      `🧘 冥想收益结清！斩获 魂力修为 +${rewards.accumulatedExp.toLocaleString()}，金魂币 +${rewards.accumulatedGold.toLocaleString()}！`,
      'success'
    );

    setIsClaiming(false);
    onClose();
  };

  // Instant 2-Hour Meditation Boost (静心神丹顿悟)
  const handleInstantMeditationBoost = () => {
    const BOOST_GOLD_COST = 500;
    if (player.gold < BOOST_GOLD_COST) {
      SoundEngine.playClick();
      showToast?.(`金魂币不足！使用静心神丹速成需要 ${BOOST_GOLD_COST} 金魂币`, 'info');
      return;
    }

    const boostSec = 7200; // 2 hours
    const boostExp = Math.floor(boostSec * rewards.rates.expPerSec);
    const boostGold = Math.floor((boostSec / 60) * rewards.rates.goldPerMin);

    SoundEngine.playBreakthrough();

    // Deduct Gold and grant instant EXP/Gold
    onUpdatePlayer(prev => ({
      ...prev,
      gold: Math.max(0, prev.gold - BOOST_GOLD_COST)
    }));

    onAddExpAndGold(boostExp, boostGold);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    showToast?.(`✨ 顿悟成功！服用静心神丹，瞬间获得2小时冥想修为 (魂力 +${boostExp.toLocaleString()})！`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950/90 to-slate-950 border border-indigo-500/50 rounded-3xl max-w-2xl w-full p-6 text-slate-100 shadow-[0_0_60px_rgba(99,102,241,0.35)] relative overflow-hidden space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Animated Spiritual Aura Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-500 flex items-center justify-center shadow-lg animate-pulse">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-100 flex items-center gap-2">
                <span>静心冥想 · 挂机周天</span>
                {isAutoOfflineNotice && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold">
                    离线收益自动结算
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                运功聚气，沟通天地玄机。离线时依然可源源不断汲取天地灵气，凝聚魂力修为！
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ZEN MEDITATION CANVAS / VISUAL AREA */}
        <div className="relative bg-slate-950/80 rounded-2xl border border-indigo-500/30 p-6 text-center overflow-hidden z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950/80 to-slate-950 pointer-events-none" />

          {/* Orbiting Soul Rings Visual Effect */}
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center my-2">
            {/* Outer Ring Animation */}
            <div className="absolute inset-0 border-2 border-dashed border-purple-500/50 rounded-full animate-spin" style={{ animationDuration: '12s' }} />
            <div className="absolute inset-2 border-2 border-dashed border-amber-400/40 rounded-full animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />

            {/* Lotus Lotus Meditation Silhouette Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-900/80 to-indigo-900/80 border border-purple-400/60 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)] z-10">
              <span className="text-3xl animate-bounce" style={{ animationDuration: '3s' }}>🧘</span>
            </div>
          </div>

          <div className="relative z-10 mt-3 space-y-1">
            <span className="text-xs font-bold text-indigo-300 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              玄天功第九重 · 大周天运转中
            </span>
            <div className="text-2xl font-black text-amber-300 font-mono tracking-wider">
              {formatDuration(rewards.effectiveSec)}
            </div>
            <p className="text-[11px] text-slate-400">
              {rewards.isCapped ? (
                <span className="text-rose-400 font-bold">⚠️ 离线时长已达 24 小时储存上限，请及时领取收益！</span>
              ) : (
                `离线最大可自动收益 24 小时 (已累积 ${(rewards.effectiveSec / 86400 * 100).toFixed(1)}%)`
              )}
            </p>
          </div>
        </div>

        {/* REWARDS SUMMARY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10">
          
          {/* Card 1: Exp */}
          <div className="bg-slate-900/90 border border-amber-500/40 p-3.5 rounded-2xl text-center space-y-1 shadow-lg">
            <span className="text-[11px] text-slate-400 block font-semibold flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              当前累积魂力修为
            </span>
            <div className="text-xl font-black font-mono text-amber-300">
              +{rewards.accumulatedExp.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">
              效率: +{rewards.rates.expPerSec}/秒
            </div>
          </div>

          {/* Card 2: Gold */}
          <div className="bg-slate-900/90 border border-yellow-500/40 p-3.5 rounded-2xl text-center space-y-1 shadow-lg">
            <span className="text-[11px] text-slate-400 block font-semibold flex items-center justify-center gap-1">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              当前累积金魂币
            </span>
            <div className="text-xl font-black font-mono text-yellow-300">
              +{rewards.accumulatedGold.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">
              效率: +{rewards.rates.goldPerMin}/分钟
            </div>
          </div>

          {/* Card 3: Multiplier */}
          <div className="col-span-2 sm:col-span-1 bg-slate-900/90 border border-indigo-500/40 p-3.5 rounded-2xl text-center space-y-1 shadow-lg">
            <span className="text-[11px] text-slate-400 block font-semibold flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              当前聚气增幅倍率
            </span>
            <div className="text-xl font-black font-mono text-indigo-300">
              {rewards.rates.totalMultiplier}x
            </div>
            <div className="text-[10px] text-emerald-400 font-bold">
              +{Math.round((rewards.rates.totalMultiplier - 1) * 100)}% 附加效率
            </div>
          </div>

        </div>

        {/* DISCOVERED ITEMS LIST */}
        {rewards.discoveredItems.length > 0 && (
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2 relative z-10">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5" />
              冥想顿悟获赠天材地宝 ({rewards.discoveredItems.length} 种):
            </span>
            <div className="flex flex-wrap gap-2">
              {rewards.discoveredItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
                  <span className="font-bold text-slate-200">{item.name}</span>
                  <span className="font-mono text-amber-400 font-bold">x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUFF BREAKDOWN */}
        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2 relative z-10 text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            冥想加成加持列表:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {rewards.rates.buffs.map((b, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800/80 text-[11px]">
                <span className="text-slate-300 font-semibold">{b.name}</span>
                <span className="text-emerald-400 font-mono font-bold">{b.bonus}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 relative z-10">
          
          {/* Claim Button */}
          <button
            onClick={handleClaim}
            disabled={isClaiming || rewards.accumulatedExp <= 0}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:brightness-110 text-white font-black text-sm rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>一键结算领取冥想修为</span>
          </button>

          {/* Instant 2h Boost */}
          <button
            onClick={handleInstantMeditationBoost}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 text-amber-300 font-bold text-xs rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>服用静心神丹 (立获2小时修为 · 500金币)</span>
          </button>

        </div>

      </div>
    </div>
  );
};
