import React, { useState, useEffect } from 'react';
import { Player, SoulRingColor } from '../types/game';
import { getSoulRankTitle } from '../data/martialSouls';
import { SOUL_BEASTS_DB } from '../data/soulBeasts';
import { 
  MIMICRY_ZONES, 
  EIGHT_MERIDIANS, 
  WATERFALL_STAGES, 
  ZIJI_EYE_STAGES_CONFIG, 
  SHREK_COMRADES_DATA 
} from '../data/cultivation';
import { AfkStrategySettingsView } from './AfkStrategySettingsView';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  BookOpen, Sparkles, UserCheck, Zap, BookMarked, Search, Award,
  TreePine, Flame, Snowflake, Sun, Skull, Waves, Hammer, Activity,
  Eye, HeartHandshake, Shield, Heart, Swords, ShieldAlert, ArrowUpRight,
  TrendingUp, CheckCircle, Lock, RefreshCw, Crown, Sliders
} from 'lucide-react';

interface MasterAcademyViewProps {
  player: Player;
  onMeditateGainExp: (exp: number) => void;
  onBreakthroughRank: () => void;
  onUpdatePlayer?: (updater: (prev: Player) => Player) => void;
}

export type CultivationTab = 
  | 'afk_strategy' // 挂机策略设置 (战斗技能释放优先顺序)
  | 'mimicry'     // 拟态环境与聚灵阵
  | 'waterfall'   // 瀑布乱披风负重
  | 'meridians'   // 奇经八脉洗髓
  | 'ziji'        // 紫极魔瞳紫气东来
  | 'comrades'    // 七怪武魂共鸣合修
  | 'theory'      // 大师核心理论
  | 'bestiary';   // 魂兽万灵图鉴

export const MasterAcademyView: React.FC<MasterAcademyViewProps> = ({
  player,
  onMeditateGainExp,
  onUpdatePlayer
}) => {
  const [activeTab, setActiveTab] = useState<CultivationTab>('mimicry');
  const [beastSearch, setBeastSearch] = useState('');
  const [selectedBestiaryZone, setSelectedBestiaryZone] = useState<string>('all');
  
  // Interactive Waterfall Hammer combo state
  const [hammerCombo, setHammerCombo] = useState(0);
  const [hammerEffect, setHammerEffect] = useState<string | null>(null);

  // Qi gathering real-time counter
  const [realtimeQi, setRealtimeQi] = useState<number>(0);
  const [justHarvested, setJustHarvested] = useState(false);

  const activeSoul = player.martialSouls[player.activeSoulIndex] || player.martialSouls[0];
  const rankInfo = getSoulRankTitle(player.level);
  const isAtBottleneck = player.level % 10 === 0 && activeSoul.skills.length < rankInfo.order;

  const cultivation = player.cultivation || {
    activeMimicryZoneId: 'thunder_valley',
    spiritArrayLevel: 1,
    accumulatedQiExp: 0,
    lastGatherTime: Date.now(),
    waterfallTrainingCount: 0,
    physiqueLevel: 1,
    hammerStrikeCount: 0,
    unlockedMeridians: [],
    zijiCultivateCount: 0,
    zijiEyeStage: '纵观',
    hasZijiDivineLight: false,
    comradeAffinities: { xiaowu: 20, mubai: 15, zhuqing: 15, rongrong: 15, oscar: 15, hongjun: 15 }
  };

  const activeZone = MIMICRY_ZONES.find(z => z.id === cultivation.activeMimicryZoneId) || MIMICRY_ZONES[0];
  const isZoneMatched = activeZone.matchedElements.includes(activeSoul.element) || 
    (activeZone.matchedElements.includes('physical') && activeSoul.type === 'tool') ||
    (activeZone.matchedElements.includes('plant') && activeSoul.type === 'plant') ||
    (activeZone.matchedElements.includes('beast') && activeSoul.type === 'beast') ||
    (activeZone.matchedElements.includes('divine') && activeSoul.type === 'god');

  // Realtime Spirit Array Qi accumulation calculation
  useEffect(() => {
    const interval = setInterval(() => {
      const arrayLvl = cultivation.spiritArrayLevel || 1;
      const matchBonus = isZoneMatched ? 1.6 : 1.0;
      const ratePerSec = Math.max(1, Math.floor((5 + arrayLvl * 4 + player.level * 2) * matchBonus));
      const maxCap = 2000 + arrayLvl * 1500;
      
      setRealtimeQi(prev => Math.min(maxCap, prev + ratePerSec));
    }, 1000);

    return () => clearInterval(interval);
  }, [cultivation.spiritArrayLevel, isZoneMatched, player.level]);

  // Harvest accumulated Qi
  const handleHarvestQi = () => {
    if (realtimeQi <= 0) return;
    SoundEngine.playMeditationChime();
    
    const expGained = realtimeQi;
    onMeditateGainExp(expGained);
    setRealtimeQi(0);
    setJustHarvested(true);
    setTimeout(() => setJustHarvested(false), 2000);
  };

  // Upgrade Spirit Array
  const handleUpgradeSpiritArray = () => {
    const currentLvl = cultivation.spiritArrayLevel || 1;
    if (currentLvl >= 10) return;
    const cost = currentLvl * 400;

    if (player.gold < cost) {
      alert(`金币不足！升级聚灵法阵至 Lv.${currentLvl + 1} 需要 ${cost} 金币`);
      return;
    }

    SoundEngine.playBreakthrough();
    onUpdatePlayer?.(prev => {
      const prevCult = prev.cultivation || {
        activeMimicryZoneId: 'thunder_valley',
        spiritArrayLevel: 1,
        accumulatedQiExp: 0,
        lastGatherTime: Date.now(),
        waterfallTrainingCount: 0,
        physiqueLevel: 1,
        hammerStrikeCount: 0,
        unlockedMeridians: [],
        zijiCultivateCount: 0,
        zijiEyeStage: '纵观',
        hasZijiDivineLight: false,
        comradeAffinities: {}
      };
      return {
        ...prev,
        gold: prev.gold - cost,
        cultivation: {
          ...prevCult,
          spiritArrayLevel: currentLvl + 1
        }
      };
    });
  };

  // Switch Mimicry Zone
  const handleSelectMimicryZone = (zoneId: string) => {
    SoundEngine.playClick();
    onUpdatePlayer?.(prev => {
      const prevCult = prev.cultivation || {
        activeMimicryZoneId: 'thunder_valley',
        spiritArrayLevel: 1,
        accumulatedQiExp: 0,
        lastGatherTime: Date.now(),
        waterfallTrainingCount: 0,
        physiqueLevel: 1,
        hammerStrikeCount: 0,
        unlockedMeridians: [],
        zijiCultivateCount: 0,
        zijiEyeStage: '纵观',
        hasZijiDivineLight: false,
        comradeAffinities: {}
      };
      return {
        ...prev,
        cultivation: {
          ...prevCult,
          activeMimicryZoneId: zoneId
        }
      };
    });
  };

  // 1. Deep Retreat in Mimicry Zone
  const handleDeepRetreatMeditation = () => {
    SoundEngine.playMeditationChime();
    const mult = isZoneMatched ? 1.6 : 1.0;
    const gained = Math.floor((120 + player.level * 25 + cultivation.spiritArrayLevel * 30) * mult);
    onMeditateGainExp(gained);

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  // 2. Waterfall Training Actions
  const currentPhysiqueStage = WATERFALL_STAGES.find(s => s.level === cultivation.physiqueLevel) || WATERFALL_STAGES[0];

  const handleWaterfallTorrentTraining = () => {
    SoundEngine.playWaterfallSmash();
    const expGained = 180 + player.level * 20;
    onMeditateGainExp(expGained);

    onUpdatePlayer?.(prev => {
      const prevCult = prev.cultivation!;
      return {
        ...prev,
        cultivation: {
          ...prevCult,
          waterfallTrainingCount: (prevCult.waterfallTrainingCount || 0) + 1
        }
      };
    });
  };

  const handleHammerStrike = () => {
    SoundEngine.playWaterfallSmash();
    const nextCombo = hammerCombo + 1;
    setHammerCombo(nextCombo);
    setHammerEffect(`乱披风第 ${nextCombo} 锤！重击波浪！`);
    setTimeout(() => setHammerEffect(null), 800);

    const expGained = 40 + nextCombo * 10;
    onMeditateGainExp(expGained);

    onUpdatePlayer?.(prev => {
      const prevCult = prev.cultivation!;
      return {
        ...prev,
        cultivation: {
          ...prevCult,
          hammerStrikeCount: (prevCult.hammerStrikeCount || 0) + 1
        }
      };
    });

    // Check next physique stage breakthrough
    if (nextCombo >= currentPhysiqueStage.hammerHitsNeeded && cultivation.physiqueLevel < WATERFALL_STAGES.length) {
      SoundEngine.playBreakthrough();
      confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
      onUpdatePlayer?.(prev => {
        const prevCult = prev.cultivation!;
        return {
          ...prev,
          cultivation: {
            ...prevCult,
            physiqueLevel: Math.min(5, (prevCult.physiqueLevel || 1) + 1)
          }
        };
      });
      setHammerCombo(0);
    }
  };

  // 3. Meridian Breakthrough
  const handleUnlockMeridian = (meridianId: string, expCost: number) => {
    if (cultivation.unlockedMeridians.includes(meridianId)) return;

    if (player.currentExp < expCost) {
      alert(`当前修为经验不足！打通此经脉需要 ${expCost} 点修为经验，请先修炼积攒经验。`);
      return;
    }

    SoundEngine.playMeridianBreakthrough();
    confetti({ particleCount: 60, spread: 90, origin: { y: 0.5 } });

    onUpdatePlayer?.(prev => {
      const prevCult = prev.cultivation!;
      return {
        ...prev,
        currentExp: Math.max(0, prev.currentExp - expCost),
        cultivation: {
          ...prevCult,
          unlockedMeridians: [...prevCult.unlockedMeridians, meridianId]
        }
      };
    });
  };

  // 4. Purple Demon Eye Sunrise Gaze
  const handleZijiGaze = () => {
    SoundEngine.playZijiGaze();
    const expGained = 200 + player.level * 22;
    onMeditateGainExp(expGained);

    const nextCount = (cultivation.zijiCultivateCount || 0) + 1;
    let nextStage = cultivation.zijiEyeStage;
    let unlockedDivineLight = cultivation.hasZijiDivineLight;

    if (nextCount >= 50) {
      nextStage = '浩瀚';
      unlockedDivineLight = true;
    } else if (nextCount >= 30) {
      nextStage = '芥子';
    } else if (nextCount >= 15) {
      nextStage = '入微';
    } else if (nextCount >= 5) {
      nextStage = '纵观';
    }

    if (nextStage !== cultivation.zijiEyeStage) {
      SoundEngine.playBreakthrough();
      confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
    }

    onUpdatePlayer?.(prev => {
      const prevCult = prev.cultivation!;
      return {
        ...prev,
        cultivation: {
          ...prevCult,
          zijiCultivateCount: nextCount,
          zijiEyeStage: nextStage,
          hasZijiDivineLight: unlockedDivineLight
        }
      };
    });
  };

  // 5. Comrade Synergy Harmonization
  const handleHarmonizeComrade = (comradeId: string) => {
    const cost = 250;
    if (player.gold < cost) {
      alert(`金币不足！与伙伴共鸣修炼需要 ${cost} 金币准备补给药材。`);
      return;
    }

    SoundEngine.playMeditationChime();
    const expGained = 250 + player.level * 20;
    onMeditateGainExp(expGained);

    onUpdatePlayer?.(prev => {
      const prevCult = prev.cultivation!;
      const currentAff = prevCult.comradeAffinities[comradeId] || 0;
      const nextAff = Math.min(100, currentAff + 10);

      return {
        ...prev,
        gold: prev.gold - cost,
        cultivation: {
          ...prevCult,
          comradeAffinities: {
            ...prevCult.comradeAffinities,
            [comradeId]: nextAff
          }
        }
      };
    });
  };

  // Bestiary filtering
  const filteredBestiaryBeasts = SOUL_BEASTS_DB.filter(beast => {
    if (selectedBestiaryZone !== 'all' && beast.habitat !== selectedBestiaryZone) return false;
    if (beastSearch.trim()) {
      const q = beastSearch.toLowerCase();
      return (
        beast.chineseName.toLowerCase().includes(q) ||
        beast.name.toLowerCase().includes(q) ||
        beast.element.toLowerCase().includes(q) ||
        beast.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const theories = [
    {
      title: '第一核心理论：武魂拟态环境修炼',
      desc: '植物系武魂在星斗森林中修炼事半功倍；火系武魂在落日森林炽热熔岩处淬炼速度倍增。顺应自然天地法则，魂力流转更加圆融无碍。'
    },
    {
      title: '第二核心理论：魂环年限极限承载法则',
      desc: '第一魂环极限423年，第二764年，第三1760年，第四5000年，第五12000年... 若经仙草洗髓或服食十万年魂骨强固经脉，可越级吸收更高年限魂环！'
    },
    {
      title: '第三核心理论：没有废物的武魂，只有废物的魂师',
      desc: '蓝银草虽被世人视为废武魂，但因其生命韧性极强，具备极大的可塑性与容纳剧毒、藤蔓变异潜能，终能觉醒为大陆帝皇——蓝银皇！'
    },
    {
      title: '第四核心理论：双生武魂的至高修炼之法',
      desc: '切记不可同时给两个武魂加装低年份魂环！必须将第一武魂修炼至封号斗罗（90级）后，再给第二武魂全套附加万年、十万年乃至百万年神环，一举成为天下无敌的存在！'
    },
    {
      title: '第五核心理论：外附魂骨的进化与融合',
      desc: '外附魂骨（如八蛛矛、暗金恐爪掌）乃魂师梦寐以求的稀世珍宝，能随着宿主实力的精进而不断蜕变升级，甚至进化为神级骨铠！'
    },
    {
      title: '第六核心理论：领域与武魂真身之奥秘',
      desc: '达到70级魂圣后开启武魂真身，实力倍增；更有绝世天才觉醒杀戮领域、蓝银领域、海神领域等至高领域，领域之内，唯我独尊！'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/40 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-full bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-black text-slate-100">史莱克学院 · 魂师修练圣地</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              汇聚斗罗大陆最全修练体系：拟态聚灵洞府、万丈瀑布乱披风体魄、奇经八脉通脉洗髓、紫极魔瞳朝阳紫气、七怪武魂共鸣合修与大师核心理论！
            </p>
          </div>

          {/* Player Rank & Bottleneck status */}
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl text-xs space-y-1 shrink-0">
            <div>
              当前境界：<strong className={rankInfo.colorClass}>{rankInfo.title} (Lv.{player.level})</strong>
            </div>
            <div>
              经脉气血：
              <strong className={isAtBottleneck ? 'text-rose-400 font-bold ml-1' : 'text-emerald-400 font-bold ml-1'}>
                {isAtBottleneck ? '处于魂环瓶颈 (需猎魂吸收)' : '真气通达·顺畅修练'}
              </strong>
            </div>
          </div>
        </div>

        {/* CULTIVATION PATHWAY SUB-TABS */}
        <div className="flex gap-1.5 mt-5 pt-3 border-t border-slate-800/80 flex-wrap">
          {[
            { id: 'afk_strategy', label: '挂机战术策略', icon: <Sliders className="w-3.5 h-3.5 text-amber-400" />, highlight: true },
            { id: 'mimicry', label: '拟态聚灵洞府', icon: <TreePine className="w-3.5 h-3.5" /> },
            { id: 'waterfall', label: '瀑布乱披风炼体', icon: <Hammer className="w-3.5 h-3.5" /> },
            { id: 'meridians', label: '奇经八脉洗髓', icon: <Activity className="w-3.5 h-3.5" /> },
            { id: 'ziji', label: '紫气东来·淬眸', icon: <Eye className="w-3.5 h-3.5" /> },
            { id: 'comrades', label: '七怪武魂合修', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
            { id: 'theory', label: '大师核心理论', icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: 'bestiary', label: `万灵图鉴 (${SOUL_BEASTS_DB.length})`, icon: <BookMarked className="w-3.5 h-3.5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                SoundEngine.playClick();
                setActiveTab(tab.id as CultivationTab);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                  : tab.highlight
                  ? 'bg-amber-950/40 border border-amber-500/50 text-amber-300 hover:text-amber-100 hover:bg-amber-900/50'
                  : 'bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 0. 挂机战斗策略设置 (AFK STRATEGY SETTINGS) */}
      {activeTab === 'afk_strategy' && (
        <AfkStrategySettingsView
          player={player}
          onUpdatePlayer={onUpdatePlayer}
          onMeditateGainExp={onMeditateGainExp}
        />
      )}

      {/* 1. 拟态修炼环境与聚灵洞府 (MIMICRY & SPIRIT ARRAY) */}
      {activeTab === 'mimicry' && (
        <div className="space-y-6">
          
          {/* SPIRIT ARRAY QI ACCUMULATION HUD */}
          <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                    聚灵法阵 Lv.{cultivation.spiritArrayLevel || 1}
                  </span>
                  <h3 className="font-bold text-base text-slate-100">
                    【{activeZone.chineseName}】吐纳聚气中
                  </h3>
                  {isZoneMatched && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/50">
                      ⚡ 武魂完美契合 (+60%修练效率)
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300">
                  当前洞府正自动凝聚天地魂力源能。升级法阵等级可提升每秒聚灵速度与总储气上限！
                </p>

                {/* Progress bar of current Qi storage */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-64 bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (realtimeQi / (2000 + (cultivation.spiritArrayLevel || 1) * 1500)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-cyan-300">
                    {realtimeQi.toLocaleString()} / {(2000 + (cultivation.spiritArrayLevel || 1) * 1500).toLocaleString()} 修为
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                <button
                  onClick={handleHarvestQi}
                  disabled={realtimeQi <= 0}
                  className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${
                    realtimeQi > 0
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  {justHarvested ? '已成功吸收！' : `一键收取灵气 (+${realtimeQi}修为)`}
                </button>

                <button
                  onClick={handleDeepRetreatMeditation}
                  className="px-5 py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  洞府静心闭关
                </button>

                <button
                  onClick={handleUpgradeSpiritArray}
                  disabled={(cultivation.spiritArrayLevel || 1) >= 10}
                  className="px-4 py-3 rounded-xl font-bold text-xs bg-slate-950 border border-slate-700 hover:border-amber-400 text-amber-300 flex items-center gap-1.5 shadow-sm"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  升级聚灵阵 ({(cultivation.spiritArrayLevel || 1) * 400}金币)
                </button>
              </div>

            </div>
          </div>

          {/* MIMICRY ZONES SELECTION GRID */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <TreePine className="w-5 h-5 text-emerald-400" />
                六大拟态闭关秘境
              </h3>
              <span className="text-xs text-slate-400">选择与自身武魂属性契合的秘境修炼，可获大幅额外加成</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MIMICRY_ZONES.map(zone => {
                const isSelected = zone.id === cultivation.activeMimicryZoneId;
                const isMatched = zone.matchedElements.includes(activeSoul.element) ||
                  (zone.matchedElements.includes('physical') && activeSoul.type === 'tool') ||
                  (zone.matchedElements.includes('plant') && activeSoul.type === 'plant') ||
                  (zone.matchedElements.includes('beast') && activeSoul.type === 'beast') ||
                  (zone.matchedElements.includes('divine') && activeSoul.type === 'god');

                return (
                  <div
                    key={zone.id}
                    className={`bg-slate-900/90 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-950/20'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-sm text-slate-100">{zone.chineseName}</h4>
                          <span className="text-[10px] text-slate-400">{zone.name}</span>
                        </div>
                        {isMatched && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/50">
                            契合武魂
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                        {zone.description}
                      </p>

                      <div className="mt-3.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-cyan-300">
                        ✨ {zone.environmentBuff}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-400">
                        修练倍率：<strong className="text-amber-400 font-bold">{zone.expMultiplier}x</strong>
                      </span>

                      {isSelected ? (
                        <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> 正在此秘境修炼
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSelectMimicryZone(zone.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200"
                        >
                          切换至此秘境
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

      {/* 2. 万丈瀑布·乱披风负重体魄 (WATERFALL WEIGHT-BEARING & 81 HAMMERS) */}
      {activeTab === 'waterfall' && (
        <div className="space-y-6">
          
          <div className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-950 text-blue-300 border border-blue-500/40">
                    体魄境界：{currentPhysiqueStage.physiqueTitle} (第{cultivation.physiqueLevel}/5重)
                  </span>
                  <h3 className="font-bold text-base text-slate-100">
                    【{currentPhysiqueStage.name}】
                  </h3>
                </div>

                <p className="text-xs text-slate-300">
                  {currentPhysiqueStage.desc}
                </p>

                <div className="flex items-center gap-4 text-xs pt-1">
                  <span className="text-slate-400">
                    当前负重：<strong className="text-blue-400 font-bold">{currentPhysiqueStage.weight} 斤黑铅</strong>
                  </span>
                  <span className="text-slate-400">
                    乱披风挥锤进度：<strong className="text-amber-400 font-bold">{hammerCombo} / {currentPhysiqueStage.hammerHitsNeeded} 锤</strong>
                  </span>
                  <span className="text-slate-400">
                    已累计冲刷：<strong className="text-cyan-400 font-bold">{cultivation.waterfallTrainingCount || 0} 次</strong>
                  </span>
                </div>
              </div>

              {/* Dynamic Hammer Actions */}
              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                <button
                  onClick={handleWaterfallTorrentTraining}
                  className="px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
                >
                  <Waves className="w-4 h-4 text-cyan-300" />
                  逆流桩功·硬抗水浪
                </button>

                <button
                  onClick={handleHammerStrike}
                  className="px-6 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 transition-transform"
                >
                  <Hammer className="w-4 h-4 text-slate-950" />
                  乱披风挥锤 (Combo {hammerCombo})
                </button>
              </div>

            </div>

            {hammerEffect && (
              <div className="mt-4 p-2 bg-amber-500/20 border border-amber-500/50 rounded-xl text-center text-xs font-bold text-amber-300 animate-pulse">
                ⚡ {hammerEffect}
              </div>
            )}
          </div>

          {/* 5 STAGES OF WATERFALL PHYSIQUE ROADMAP */}
          <div>
            <h3 className="font-bold text-base text-slate-100 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              万丈瀑布体魄淬炼之路
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {WATERFALL_STAGES.map(stage => {
                const isUnlocked = (cultivation.physiqueLevel || 1) >= stage.level;
                const isCurrent = (cultivation.physiqueLevel || 1) === stage.level;

                return (
                  <div
                    key={stage.level}
                    className={`p-4 rounded-2xl border flex flex-col justify-between text-xs transition-all ${
                      isCurrent
                        ? 'bg-blue-950/40 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-blue-400'
                        : isUnlocked
                        ? 'bg-slate-900/80 border-slate-700 text-slate-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-300">第{stage.level}重</span>
                        {isUnlocked ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-600" />
                        )}
                      </div>

                      <div className="font-black text-sm text-slate-100 mt-1">{stage.physiqueTitle}</div>
                      <div className="text-[11px] text-amber-300 font-semibold">{stage.weight} 斤负重</div>
                      <p className="text-[10px] text-slate-400 mt-2 line-clamp-3">{stage.desc}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-0.5 text-[10px]">
                      <div className="text-rose-400 font-semibold">生命上限 +{stage.hpGain}</div>
                      <div className="text-amber-400 font-semibold">攻击力 +{stage.atkGain}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* 3. 奇经八脉·玄天通脉洗髓 (EIGHT MERIDIANS) */}
      {activeTab === 'meridians' && (
        <div className="space-y-6">
          
          <div className="bg-slate-900/90 border border-purple-500/40 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-base text-purple-300 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  玄天通脉 · 奇经八脉洗髓录
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  运转唐门玄天宝录心法，调动周天真气冲击体内八大神秘经脉。每贯通一条经脉，皆可获得永久属性暴增与特殊被动神技！
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-xs space-y-1 shrink-0">
                <div>已贯通经脉：<strong className="text-purple-400 font-bold">{cultivation.unlockedMeridians.length} / 8 脉</strong></div>
                <div>当前修为存量：<strong className="text-cyan-400 font-bold">{player.currentExp.toLocaleString()} 经验</strong></div>
              </div>
            </div>
          </div>

          {/* 8 MERIDIAN CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {EIGHT_MERIDIANS.map((meridian, idx) => {
              const isUnlocked = cultivation.unlockedMeridians.includes(meridian.id);
              const canUnlock = !isUnlocked && player.currentExp >= meridian.expCost;

              return (
                <div
                  key={meridian.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between text-xs transition-all ${
                    isUnlocked
                      ? 'bg-purple-950/30 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-purple-400 font-bold">第{idx + 1}经脉</span>
                        <h4 className="font-black text-sm text-slate-100">{meridian.chineseName}</h4>
                      </div>

                      {isUnlocked ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-900/80 text-purple-300 border border-purple-500/40">
                          已贯通
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">
                          需 {meridian.expCost} 修为
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {meridian.bonusDesc}
                    </p>

                    {/* Acupoints */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {meridian.acupoints.map(ac => (
                        <span
                          key={ac}
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            isUnlocked
                              ? 'bg-purple-900/50 text-purple-200 border border-purple-600/40'
                              : 'bg-slate-950 text-slate-500'
                          }`}
                        >
                          {ac}穴
                        </span>
                      ))}
                    </div>

                    {/* Stats Boost breakdown */}
                    <div className="mt-3.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/80 text-[10px] text-amber-300 space-y-0.5">
                      {meridian.statsBonus.atk && <div>⚔️ 攻击力 +{meridian.statsBonus.atk}</div>}
                      {meridian.statsBonus.hp && <div>❤️ 生命上限 +{meridian.statsBonus.hp}</div>}
                      {meridian.statsBonus.def && <div>🛡️ 防御力 +{meridian.statsBonus.def}</div>}
                      {meridian.statsBonus.speed && <div>⚡ 速度身法 +{meridian.statsBonus.speed}</div>}
                      {meridian.statsBonus.critRate && <div>✨ 暴击率 +{meridian.statsBonus.critRate}%</div>}
                      {meridian.statsBonus.critDmg && <div>💥 暴击伤害 +{meridian.statsBonus.critDmg}%</div>}
                      {meridian.statsBonus.penetration && <div>🗡️ 物理穿透 +{meridian.statsBonus.penetration}%</div>}
                      {meridian.statsBonus.poisonResist && <div>🧪 百毒不侵抗性 +{meridian.statsBonus.poisonResist}%</div>}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    {isUnlocked ? (
                      <div className="text-center text-xs font-bold text-purple-300">
                        ✓ 真气流转顺畅
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUnlockMeridian(meridian.id, meridian.expCost)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                          canUnlock
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md active:scale-95'
                            : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                        }`}
                      >
                        {canUnlock ? '运转真气·贯通经脉' : `修为不足 (差 ${meridian.expCost - player.currentExp})`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 4. 紫气东来·紫极魔瞳朝阳淬眸 (ZIJI DEMON EYE SUNRISE GAZE) */}
      {activeTab === 'ziji' && (
        <div className="space-y-6">
          
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-amber-950 border border-purple-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-950 text-purple-300 border border-purple-500/40">
                    紫极魔瞳：{cultivation.zijiEyeStage || '纵观'}境界
                  </span>
                  <h3 className="font-bold text-base text-amber-200">
                    东方破晓 · 采撷天际紫气
                  </h3>
                </div>

                <p className="text-xs text-slate-300 max-w-xl">
                  每日清晨东方初生第一缕紫气，乃天地至纯至刚的精神源粹。引紫气入双眸，可使眼力与精神识海产生质的飞跃！
                </p>

                <div className="text-xs text-slate-400 pt-1">
                  已累计采撷紫气：<strong className="text-purple-300 font-bold">{cultivation.zijiCultivateCount || 0} 次</strong>
                  {cultivation.hasZijiDivineLight && (
                    <span className="ml-3 px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/50 font-bold">
                      ⚡ 已觉醒【紫极神光】神识穿透
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleZijiGaze}
                className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 transition-transform flex items-center gap-2 shrink-0"
              >
                <Sun className="w-4 h-4 text-yellow-300" />
                迎朝阳凝视·引紫气淬眸！
              </button>

            </div>
          </div>

          {/* 4 STAGES OF ZIJI DEMON EYE */}
          <div>
            <h3 className="font-bold text-base text-slate-100 mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              紫极魔瞳四大修练境界
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {ZIJI_EYE_STAGES_CONFIG.map(cfg => {
                const isCurrent = cultivation.zijiEyeStage === cfg.stage;
                const isPassed = (cultivation.zijiCultivateCount || 0) >= cfg.requiredGazeCount;

                return (
                  <div
                    key={cfg.stage}
                    className={`p-5 rounded-2xl border flex flex-col justify-between text-xs transition-all ${
                      isCurrent
                        ? 'bg-purple-950/40 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
                        : isPassed
                        ? 'bg-slate-900/80 border-slate-700 text-slate-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-sm text-slate-100">{cfg.title}</span>
                        {isPassed && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      </div>

                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {cfg.desc}
                      </p>

                      <div className="mt-3 p-2 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] text-amber-300">
                        {cfg.skillDesc}
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      所需凝眸次数：<strong className="text-purple-300">{cfg.requiredGazeCount} 次</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* 5. 史莱克七怪·武魂共鸣合修 (SHREK COMRADES SYNERGY) */}
      {activeTab === 'comrades' && (
        <div className="space-y-6">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-rose-300 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-rose-400" />
                  史莱克七怪 · 武魂羁绊共鸣合修
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  史莱克七怪同生共死！与伙伴们定期进行武魂交融与战术合修，不仅能提升羁绊亲密度，还能激活七怪专属神效被动！
                </p>
              </div>
            </div>
          </div>

          {/* 6 COMRADES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SHREK_COMRADES_DATA.map(comrade => {
              const currentAff = cultivation.comradeAffinities[comrade.id] || 0;

              return (
                <div
                  key={comrade.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${comrade.colorTheme} flex items-center justify-center font-bold text-xs text-white shadow-md`}>
                          {comrade.avatarText}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-slate-100">{comrade.name} · {comrade.title}</h4>
                          <span className="text-[10px] text-slate-400">本命武魂：{comrade.martialSoul}</span>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-rose-400">
                        契合度 {currentAff}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                      {comrade.description}
                    </p>

                    {/* Synergy skill preview */}
                    <div className="mt-3.5 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs space-y-1">
                      <div className="font-bold text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                        {comrade.synergySkill}
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {comrade.synergyBuffDesc}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">
                      消耗 250 金币准备药材
                    </span>

                    <button
                      onClick={() => handleHarmonizeComrade(comrade.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-md active:scale-95 transition-transform"
                    >
                      武魂共鸣合修
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 6. 大师核心理论 (THEORIES) */}
      {activeTab === 'theory' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {theories.map((theory, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-indigo-300 mb-1.5">{theory.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{theory.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. 魂兽万灵图鉴 (BESTIARY) */}
      {activeTab === 'bestiary' && (
        <div className="space-y-4">
          {/* Bestiary Filter bar */}
          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', name: '全部领地' },
                { id: 'outer', name: '星斗外围' },
                { id: 'middle', name: '星斗混合' },
                { id: 'core', name: '星斗核心' },
                { id: 'lake', name: '生命之湖' },
                { id: 'north', name: '极北之地' },
                { id: 'sunset', name: '落日森林' },
                { id: 'sea', name: '无尽海域' }
              ].map(zone => (
                <button
                  key={zone.id}
                  onClick={() => {
                    SoundEngine.playClick();
                    setSelectedBestiaryZone(zone.id);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedBestiaryZone === zone.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {zone.name}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索图鉴中的魂兽..."
                value={beastSearch}
                onChange={e => setBeastSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          {/* Grid of Beasts in Bestiary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBestiaryBeasts.map(beast => (
              <div
                key={beast.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-100">{beast.chineseName}</h4>
                      <span className="text-[11px] text-slate-400">{beast.name}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                        beast.color === 'gold'
                          ? 'border-yellow-400 bg-yellow-950 text-yellow-300'
                          : beast.color === 'red'
                          ? 'border-red-500 bg-red-950 text-red-300'
                          : beast.color === 'black'
                          ? 'border-neutral-700 bg-neutral-950 text-neutral-200'
                          : beast.color === 'purple'
                          ? 'border-purple-500 bg-purple-950 text-purple-300'
                          : 'border-amber-400 bg-amber-950 text-amber-300'
                      }`}
                    >
                      {beast.years >= 10000 ? `${(beast.years / 10000).toFixed(0)}万年` : `${beast.years}年`}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
                    {beast.description}
                  </p>

                  <div className="mt-3 bg-slate-950/60 p-2 rounded-xl text-[11px] text-slate-400 space-y-1 border border-slate-800">
                    <div className="flex justify-between">
                      <span>属性：<strong className="text-slate-200">{beast.element}</strong></span>
                      <span>等级：<strong className="text-cyan-400">Lv.{beast.level}</strong></span>
                    </div>
                    <div className="flex justify-between">
                      <span>生命：<strong className="text-rose-400">{beast.hp.toLocaleString()}</strong></span>
                      <span>攻击：<strong className="text-amber-400">{beast.atk}</strong></span>
                      <span>防御：<strong className="text-blue-400">{beast.def}</strong></span>
                    </div>
                  </div>

                  {/* Ring & Bone Preview */}
                  <div className="mt-2.5 text-[11px] space-y-1 text-slate-300">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">魂环技能：{beast.dropRing.skillNameTemplate}</span>
                    </div>
                    {beast.possibleBone && (
                      <div className="flex items-center gap-1 text-purple-300">
                        <Award className="w-3 h-3 text-purple-400 shrink-0" />
                        <span className="truncate">极品魂骨：{beast.possibleBone.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
