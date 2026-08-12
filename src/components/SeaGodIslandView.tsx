import React, { useState } from 'react';
import { Player, CombatEntity } from '../types/game';
import { SEA_GOD_TESTS, SeaGodTest } from '../data/seaGodTrials';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Anchor, Sparkles, Award, Shield, Swords, Crown, Waves } from 'lucide-react';

interface SeaGodIslandViewProps {
  player: Player;
  onInitiateSeaGodBossCombat: (test: SeaGodTest, entity: CombatEntity) => void;
  onCompleteTestDirectly: (test: SeaGodTest) => void;
}

export const SeaGodIslandView: React.FC<SeaGodIslandViewProps> = ({
  player,
  onInitiateSeaGodBossCombat,
  onCompleteTestDirectly
}) => {
  const currentTestLvl = player.seaGodTestLevel || 0; // 0 means not started, 1 to 9
  const affinity = player.seaGodAffinity || 0;

  const currentTest = SEA_GOD_TESTS.find(t => t.level === currentTestLvl + 1) || SEA_GOD_TESTS[SEA_GOD_TESTS.length - 1];

  const handleStartChallenge = (test: SeaGodTest) => {
    SoundEngine.playClick();

    if (
      test.specialChallengeType === 'steps' ||
      test.specialChallengeType === 'tide' ||
      test.specialChallengeType === 'weapon' ||
      test.specialChallengeType === 'meditation'
    ) {
      // Direct trials with willpower & soul power check
      SoundEngine.playSoulRingAura('gold');
      setTimeout(() => {
        onCompleteTestDirectly(test);
        SoundEngine.playBreakthrough();
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch {}
      }, 1200);
      return;
    }

    if (test.specialChallengeType === 'boss' || test.specialChallengeType === 'godhood') {
      const bossEntity: CombatEntity = {
        id: `seagod_boss_${test.level}`,
        name: test.bossName || '海神岛守护神灵',
        isPlayer: true,
        avatarIcon: 'Crown',
        level: test.requirementLevel,
        hp: test.bossHp || 50000,
        maxHp: test.bossHp || 50000,
        soulPower: 200,
        maxSoulPower: 200,
        atk: test.bossAtk || 1200,
        def: test.bossDef || 700,
        speed: 90,
        critRate: 25,
        shield: 5000,
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
            id: 'sea_skill_1',
            name: '海神之光·神怒倾天',
            ringOrder: 1,
            ringYears: 100000,
            ringColor: 'red',
            soulPowerCost: 40,
            cooldown: 2,
            description: '引动九霄汪洋狂涛，对全场造成浩瀚神威冲击！',
            damageMultiplier: 2.8
          },
          {
            id: 'sea_skill_2',
            name: '瀚海镇魂破',
            ringOrder: 2,
            ringYears: 100000,
            ringColor: 'red',
            soulPowerCost: 60,
            cooldown: 3,
            description: '凝聚绝对水之重力压垮敌人经脉！',
            damageMultiplier: 3.5
          }
        ]
      };

      onInitiateSeaGodBossCombat(test, bossEntity);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* BANNER */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-500/50 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-full bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Waves className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-black text-slate-100">神界圣地·海神岛与海神九考</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              海神的传承圣地！历经穿越海神之光、怒涛潮汐炼体、拔起十万八千斤海神三叉戟，直面海神斗罗波塞西，最终百级成神，君临神界！
            </p>
          </div>

          <div className="bg-slate-950/90 border border-blue-900/60 p-3 rounded-2xl text-xs space-y-1">
            <div>海神九考进度：<strong className="text-cyan-400 font-bold">{currentTestLvl} / 9 考</strong></div>
            <div>海神亲和度：<strong className="text-amber-400 font-bold">{affinity}%</strong></div>
          </div>
        </div>
      </div>

      {/* NINE TRIALS PROGRESS TIMELINE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SEA_GOD_TESTS.map((test) => {
          const isCompleted = currentTestLvl >= test.level;
          const isCurrent = currentTestLvl + 1 === test.level;
          const isLocked = currentTestLvl + 1 < test.level;

          return (
            <div
              key={test.level}
              className={`border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                isCompleted
                  ? 'bg-slate-900/70 border-blue-500/40 opacity-85'
                  : isCurrent
                  ? 'bg-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-blue-950 text-cyan-300 border border-blue-700">
                      {test.title}
                    </span>
                  </div>

                  <span className={`text-xs font-bold ${
                    isCompleted ? 'text-emerald-400' : isCurrent ? 'text-amber-400' : 'text-slate-500'
                  }`}>
                    {isCompleted ? '✓ 已通关' : isCurrent ? '★ 当前考验' : '🔒 未解锁'}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-100 mt-2">
                  {test.name}
                </h3>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {test.description}
                </p>

                <div className="mt-3 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-[11px] text-cyan-300 space-y-0.5">
                  <div><strong>神赐奖励：</strong>{test.rewardItemName}</div>
                  <div>亲和度提升: <strong className="text-amber-400">+{test.rewardAffinity}%</strong></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  等级需求: <strong className="text-slate-200">Lv.{test.requirementLevel}</strong>
                </span>

                {isCurrent && (
                  <button
                    onClick={() => handleStartChallenge(test)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition-transform active:scale-95 shadow-md"
                  >
                    开启神之考核！
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
