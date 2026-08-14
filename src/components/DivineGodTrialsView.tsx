import React, { useState } from 'react';
import { Player, CombatEntity } from '../types/game';
import { ALL_GOD_INHERITANCES, GodInheritanceInfo, GodTest, GodType, SEA_GOD_TESTS } from '../data/godTrials';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { GodTrialReplayModal } from './GodTrialReplayModal';
import { GodTalentTreeView } from './GodTalentTreeView';
import { 
  Waves, Swords, Sun, Skull, Sparkles, Award, Shield, 
  Crown, CheckCircle2, Lock, Flame, Zap, ArrowRight, Compass,
  History, Play, RotateCcw, Filter, GitBranch
} from 'lucide-react';

interface DivineGodTrialsViewProps {
  player: Player;
  onInitiateGodBossCombat: (test: GodTest, entity: CombatEntity) => void;
  onCompleteGodTestDirectly: (test: GodTest) => void;
  onUpgradeGodTalent: (godType: GodType, talentId: string) => void;
  onResetGodTalents: (godType: GodType) => void;
}

export const DivineGodTrialsView: React.FC<DivineGodTrialsViewProps> = ({
  player,
  onInitiateGodBossCombat,
  onCompleteGodTestDirectly,
  onUpgradeGodTalent,
  onResetGodTalents
}) => {
  const [mainTab, setMainTab] = useState<'trials' | 'talents'>('trials');
  const [selectedGodId, setSelectedGodId] = useState<GodType>('seagod');
  const [isProcessingChallenge, setIsProcessingChallenge] = useState(false);
  const [selectedReplayTest, setSelectedReplayTest] = useState<GodTest | null>(null);
  const [historyGodFilter, setHistoryGodFilter] = useState<'all' | GodType>('all');

  const currentInheritance = ALL_GOD_INHERITANCES.find(g => g.id === selectedGodId) || ALL_GOD_INHERITANCES[0];

  // Get current level for this god
  const getGodTestLevel = (god: GodType): number => {
    switch (god) {
      case 'seagod': return player.seaGodTestLevel || 0;
      case 'asura': return player.asuraGodTestLevel || 0;
      case 'angel': return player.angelGodTestLevel || 0;
      case 'rakshasa': return player.rakshasaGodTestLevel || 0;
      case 'emotion': return player.emotionGodTestLevel || 0;
      case 'dragongod': return player.dragonGodTestLevel || 0;
      default: return 0;
    }
  };

  // Get affinity for this god
  const getGodAffinity = (god: GodType): number => {
    switch (god) {
      case 'seagod': return player.seaGodAffinity || 0;
      case 'asura': return player.asuraGodAffinity || 0;
      case 'angel': return player.angelGodAffinity || 0;
      case 'rakshasa': return player.rakshasaGodAffinity || 0;
      case 'emotion': return player.emotionGodAffinity || 0;
      case 'dragongod': return player.dragonGodAffinity || 0;
      default: return 0;
    }
  };

  const currentTestLevel = getGodTestLevel(selectedGodId);
  const currentAffinity = getGodAffinity(selectedGodId);

  const activeTest = currentInheritance.tests.find(t => t.level === currentTestLevel + 1) || 
    currentInheritance.tests[currentInheritance.tests.length - 1];

  const maxLevel = currentInheritance.tests.length;
  const isAllPassed = currentTestLevel >= maxLevel;

  const handleStartChallenge = (test: GodTest) => {
    if (player.level < test.requirementLevel) {
      SoundEngine.playClick();
      alert(`魂师等级不足！需达到 ${test.requirementLevel} 级方可解锁【${test.title}】！`);
      return;
    }

    SoundEngine.playClick();

    if (
      test.specialChallengeType === 'steps' ||
      test.specialChallengeType === 'tide' ||
      test.specialChallengeType === 'weapon' ||
      test.specialChallengeType === 'meditation'
    ) {
      setIsProcessingChallenge(true);
      SoundEngine.playSoulRingAura('gold');

      setTimeout(() => {
        setIsProcessingChallenge(false);
        onCompleteGodTestDirectly(test);
        SoundEngine.playBreakthrough();
        try {
          confetti({
            particleCount: 130,
            spread: 90,
            origin: { y: 0.6 }
          });
        } catch {}
      }, 1200);
      return;
    }

    if (test.specialChallengeType === 'boss' || test.specialChallengeType === 'godhood') {
      const bossEntity: CombatEntity = {
        id: `god_boss_${test.godType}_${test.level}`,
        name: `${test.bossName || '神考考核者'} · (${test.bossTitle || '绝世强者'})`,
        isPlayer: false,
        avatarIcon: 'Crown',
        level: test.requirementLevel,
        rankTitle: test.bossTitle,
        hp: test.bossHp || 60000,
        maxHp: test.bossHp || 60000,
        soulPower: 250,
        maxSoulPower: 250,
        atk: test.bossAtk || 1500,
        def: test.bossDef || 850,
        speed: 95,
        critRate: 30,
        shield: 6000,
        actionGauge: 0,
        buffs: [],
        debuffs: [],
        soulRings: [
          { years: 100000, color: 'red' },
          { years: 100000, color: 'red' },
          { years: 100000, color: 'red' },
          { years: 100000, color: 'red' },
          { years: 100000, color: 'red' }
        ],
        skills: [
          {
            id: `god_boss_sk1_${test.level}`,
            name: `${test.bossName}·神威震荡`,
            ringOrder: 1,
            ringYears: 100000,
            ringColor: 'red',
            soulPowerCost: 40,
            cooldown: 2,
            description: '引动远古神威，造成毁天灭地的全场神力冲击！',
            damageMultiplier: 2.8
          },
          {
            id: `god_boss_sk2_${test.level}`,
            name: '破界神芒',
            ringOrder: 2,
            ringYears: 100000,
            ringColor: 'red',
            soulPowerCost: 60,
            cooldown: 3,
            description: '凝练神圣法则神光，无视凡俗一切护甲壁垒！',
            damageMultiplier: 3.6
          }
        ]
      };

      onInitiateGodBossCombat(test, bossEntity);
    }
  };

  const getGodIcon = (id: GodType) => {
    switch (id) {
      case 'seagod': return <Waves className="w-5 h-5 text-cyan-400" />;
      case 'asura': return <Swords className="w-5 h-5 text-red-500" />;
      case 'angel': return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'rakshasa': return <Skull className="w-5 h-5 text-purple-400" />;
      case 'emotion': return <Sparkles className="w-5 h-5 text-sky-400" />;
      case 'dragongod': return <Flame className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* TOP NAVIGATION SUB-TABS: Divine God Trials vs Divine Talent Tree */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              SoundEngine.playClick();
              setMainTab('trials');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
              mainTab === 'trials'
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            神祇考核 (十二神考)
          </button>

          <button
            onClick={() => {
              SoundEngine.playClick();
              setMainTab('talents');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
              mainTab === 'talents'
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-4 h-4 text-amber-400" />
            神祇天赋树
            {player.divineSourcePoints && player.divineSourcePoints > 0 ? (
              <span className="ml-1 text-xs px-2 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black animate-bounce">
                +{player.divineSourcePoints}
              </span>
            ) : null}
          </button>
        </div>

        <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <Crown className="w-3.5 h-3.5" />
          当前神位：<span className="text-amber-300 font-bold">{player.godPosition || '未成就百级神位'}</span>
        </div>
      </div>

      {mainTab === 'talents' ? (
        <GodTalentTreeView
          player={player}
          onUpgradeTalent={onUpgradeGodTalent}
          onResetTalents={onResetGodTalents}
        />
      ) : (
        <>
          {/* GOD INHERITANCES SELECTOR TABS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 tracking-wider">选择神祇传承（至高神位）</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {ALL_GOD_INHERITANCES.map(god => {
                const isSelected = selectedGodId === god.id;
                const lvl = getGodTestLevel(god.id);
                const affinity = getGodAffinity(god.id);
                const isFinished = lvl >= 12;

                return (
                  <button
                    key={god.id}
                    onClick={() => {
                      SoundEngine.playClick();
                      setSelectedGodId(god.id);
                    }}
                    className={`p-3.5 rounded-2xl text-left border transition-all relative overflow-hidden ${
                      isSelected
                        ? `bg-slate-800 ${god.colorScheme.border} shadow-[0_0_20px_${god.colorScheme.glowColor}]`
                        : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {getGodIcon(god.id)}
                        <span className={`font-black text-xs ${isSelected ? god.colorScheme.accentText : 'text-slate-200'}`}>
                          {god.name}
                        </span>
                      </div>
                      {isFinished ? (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-500/50">
                          神王
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                          {lvl}/12考
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-2 truncate">
                      亲和: <strong className={god.colorScheme.accentText}>{affinity}%</strong>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${god.colorScheme.buttonBg}`}
                        style={{ width: `${(lvl / 12) * 100}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

      {/* GOD BANNER */}
      <div className={`bg-gradient-to-r ${currentInheritance.colorScheme.bannerBg} border ${currentInheritance.colorScheme.border} rounded-3xl p-6 relative overflow-hidden shadow-2xl transition-all`}>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              {getGodIcon(currentInheritance.id)}
              <h2 className="text-2xl font-black text-slate-100">{currentInheritance.name}</h2>
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${currentInheritance.colorScheme.badgeBg}`}>
                {currentInheritance.title}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {currentInheritance.description}
            </p>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl text-xs space-y-1.5 shrink-0 shadow-lg min-w-[220px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">考核进度:</span>
              <strong className={currentInheritance.colorScheme.accentText}>
                {isAllPassed ? '九考全通 · 已登临神位！' : `已完成第 ${currentTestLevel} / 9 考`}
              </strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">神祇亲和度:</span>
              <strong className="text-amber-300 font-bold">{currentAffinity}%</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">专属超神器:</span>
              <strong className="text-cyan-300">{currentInheritance.artifactName}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">神级领域:</span>
              <strong className="text-purple-300">{currentInheritance.domainName}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE CHALLENGE CARD (CURRENT STAGE) */}
      {!isAllPassed && (
        <div className="bg-slate-900/95 border-2 border-amber-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <h3 className="font-black text-lg text-slate-100">
                当前神考：【{activeTest.title}】 {activeTest.name}
              </h3>
            </div>
            <span className="text-xs px-3 py-1 bg-amber-950 text-amber-300 border border-amber-500/40 rounded-full font-bold">
              要求等级 Lv.{activeTest.requirementLevel}
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              {activeTest.description}
            </p>

            {/* Rewards Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                <span>通关奖励: <strong className="text-amber-300">{activeTest.rewardItemName}</strong></span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  亲和度提升: <strong className="text-cyan-300">+{activeTest.rewardAffinity}%</strong> · 魂力经验: <strong className="text-emerald-400">+{activeTest.rewardExp.toLocaleString()}</strong>
                </span>
              </div>
            </div>

            {/* Boss Info if applicable */}
            {activeTest.bossName && (
              <div className="bg-red-950/30 border border-red-500/40 p-3.5 rounded-xl text-xs space-y-1 text-slate-300">
                <div className="flex justify-between items-center text-red-300 font-bold">
                  <span>守关神兽/考核尊者: {activeTest.bossName} ({activeTest.bossTitle})</span>
                  <span>气血: {activeTest.bossHp?.toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  攻击: {activeTest.bossAtk} · 防御: {activeTest.bossDef} · 极高暴击与神力护盾
                </div>
              </div>
            )}

            {/* Challenge Action Button */}
            <div className="flex justify-end pt-2">
              <button
                disabled={isProcessingChallenge}
                onClick={() => handleStartChallenge(activeTest)}
                className={`px-8 py-3 rounded-xl font-black text-sm transition-all transform active:scale-95 flex items-center gap-2 shadow-xl ${
                  player.level >= activeTest.requirementLevel
                    ? `bg-gradient-to-r ${currentInheritance.colorScheme.buttonBg} shadow-[0_0_20px_${currentInheritance.colorScheme.glowColor}]`
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isProcessingChallenge ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    神力淬炼灌顶中...
                  </>
                ) : activeTest.specialChallengeType === 'boss' ? (
                  <>
                    <Swords className="w-4 h-4" />
                    挑战守关神尊！
                  </>
                ) : activeTest.specialChallengeType === 'godhood' ? (
                  <>
                    <Crown className="w-4 h-4" />
                    开启百级成神大典！
                  </>
                ) : activeTest.specialChallengeType === 'weapon' ? (
                  <>
                    <Swords className="w-4 h-4" />
                    拔出超神器【{currentInheritance.artifactName}】！
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    开始神考考核！
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NINE TESTS ROADMAP TIMELINE */}
      <div className="space-y-3">
        <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          {currentInheritance.name} · 九考全阶一览
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {currentInheritance.tests.map(test => {
            const isCompleted = test.level <= currentTestLevel;
            const isCurrent = test.level === currentTestLevel + 1;
            const isLocked = test.level > currentTestLevel + 1;

            return (
              <div
                key={test.level}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                    : isCurrent
                    ? `bg-slate-900 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]`
                    : 'bg-slate-950/70 border-slate-800 text-slate-500 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      isCompleted 
                        ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/40' 
                        : isCurrent
                        ? 'bg-amber-900/80 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}>
                      第 {test.level} 考
                    </span>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 已通关
                      </span>
                    ) : isCurrent ? (
                      <span className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" /> 当前考核
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-slate-600">
                        <Lock className="w-3.5 h-3.5" /> 未解锁
                      </span>
                    )}
                  </div>

                  <h4 className={`text-xs font-bold ${isCurrent ? 'text-amber-200' : isCompleted ? 'text-slate-200' : 'text-slate-400'}`}>
                    {test.name}
                  </h4>

                  <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">
                    {test.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] space-y-0.5">
                  <div className="text-slate-400">
                    等级要求: <strong className="text-slate-300">Lv.{test.requirementLevel}</strong>
                  </div>
                  <div className="text-amber-400/90 truncate font-semibold">
                    奖励: {test.rewardItemName}
                  </div>
                </div>

                {isCompleted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      SoundEngine.playClick();
                      setSelectedReplayTest(test);
                    }}
                    className="mt-2.5 w-full py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300 text-[11px] font-black flex items-center justify-center gap-1.5 transition-all shadow-md group active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
                    重播神光传承特效
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* HISTORICAL COMPLETED DIVINE TRIALS SCROLLABLE RECORDS GALLERY */}
      {(() => {
        const allCompletedRecords = ALL_GOD_INHERITANCES.flatMap(god => {
          const lvl = getGodTestLevel(god.id);
          return god.tests.filter(t => t.level <= lvl).map(test => ({ test, god }));
        });

        const filteredCompletedRecords = historyGodFilter === 'all'
          ? allCompletedRecords
          : allCompletedRecords.filter(r => r.god.id === historyGodFilter);

        return (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base text-slate-100">
                  历史神考通关典藏画卷
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold">
                  已通关 {allCompletedRecords.length} 项
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <button
                  onClick={() => { SoundEngine.playClick(); setHistoryGodFilter('all'); }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 ${
                    historyGodFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  全部 ({allCompletedRecords.length})
                </button>
                {ALL_GOD_INHERITANCES.map(god => {
                  const count = allCompletedRecords.filter(r => r.god.id === god.id).length;
                  return (
                    <button
                      key={god.id}
                      onClick={() => { SoundEngine.playClick(); setHistoryGodFilter(god.id); }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 border ${
                        historyGodFilter === god.id
                          ? `${god.colorScheme.badgeBg} border-amber-400/80 shadow-md`
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {god.name.slice(0, 3)} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Records Container */}
            {filteredCompletedRecords.length > 0 ? (
              <div className="max-h-80 overflow-y-auto pr-1.5 space-y-2.5 custom-scrollbar">
                {filteredCompletedRecords.map(({ test, god }) => (
                  <div
                    key={`${god.id}_${test.level}`}
                    onClick={() => {
                      SoundEngine.playClick();
                      setSelectedReplayTest(test);
                    }}
                    className={`p-4 rounded-2xl border bg-slate-950/80 border-slate-800/80 hover:${god.colorScheme.border} hover:bg-slate-900 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md relative overflow-hidden`}
                  >
                    <div className="flex items-start md:items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${god.colorScheme.badgeBg}`}>
                        {getGodIcon(god.id)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${god.colorScheme.badgeBg}`}>
                            {god.name} · 第 {test.level} 考
                          </span>
                          <h4 className="font-bold text-xs text-slate-200 group-hover:text-amber-300 transition-colors">
                            {test.title}
                          </h4>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          {test.name}
                        </p>

                        <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-3">
                          <span>获得奖励: <strong className="text-amber-400">{test.rewardItemName}</strong></span>
                          <span>亲和度: <strong className="text-cyan-400">+{test.rewardAffinity}%</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          SoundEngine.playClick();
                          setSelectedReplayTest(test);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all shadow-md group-hover:scale-105 bg-gradient-to-r ${god.colorScheme.buttonBg}`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        重播神效
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 space-y-3">
                <History className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  尚无符合筛选条件的历史已通关神考记录！
                </p>
                <p className="text-[11px] text-slate-500">
                  可以通过上方的神考考核进行挑战，或点击下方按钮演示预览海神第一考传承特效：
                </p>
                <button
                  onClick={() => {
                    SoundEngine.playClick();
                    setSelectedReplayTest(SEA_GOD_TESTS[0]);
                  }}
                  className="px-5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 text-xs font-bold inline-flex items-center gap-2 transition-all shadow-lg"
                >
                  <RotateCcw className="w-4 h-4 text-cyan-400" />
                  演示预览神考传承特效（海神第一考）
                </button>
              </div>
            )}
          </div>
        );
      })()}
      </>
      )}

      {/* GOD TRIAL REPLAY MODAL */}
      <GodTrialReplayModal
        test={selectedReplayTest}
        onClose={() => setSelectedReplayTest(null)}
      />

    </div>
  );
};
