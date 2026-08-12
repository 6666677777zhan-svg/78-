import React from 'react';
import { Player, ArenaOpponent, CombatEntity, ArenaBadge } from '../types/game';
import { ARENA_OPPONENTS } from '../data/arenaOpponents';
import { SoundEngine } from '../utils/audio';
import { Trophy, Swords, Shield, Award, Sparkles, Flame, UserCheck } from 'lucide-react';

interface GreatSoulArenaViewProps {
  player: Player;
  onChallengeOpponent: (opponent: ArenaOpponent, entity: CombatEntity) => void;
}

export const GreatSoulArenaView: React.FC<GreatSoulArenaViewProps> = ({
  player,
  onChallengeOpponent
}) => {
  const getBadgeStyle = (badge: ArenaBadge) => {
    switch (badge) {
      case '铁斗魂': return 'bg-slate-700 text-slate-200 border-slate-500';
      case '铜斗魂': return 'bg-amber-900/60 text-amber-300 border-amber-600';
      case '银斗魂': return 'bg-slate-300 text-slate-900 border-slate-100 font-bold';
      case '金斗魂': return 'bg-yellow-500/30 text-yellow-300 border-yellow-400 font-bold shadow-[0_0_12px_rgba(250,204,21,0.5)]';
      case '紫金斗魂': return 'bg-purple-900/60 text-purple-300 border-purple-400 font-bold shadow-[0_0_15px_rgba(192,132,252,0.6)]';
      case '蓝宝石': return 'bg-blue-900/60 text-blue-300 border-blue-400 font-bold shadow-[0_0_18px_rgba(96,165,250,0.7)]';
      case '红宝石': return 'bg-rose-900/60 text-rose-300 border-rose-400 font-bold shadow-[0_0_20px_rgba(251,113,133,0.8)]';
      case '钻石斗魂': return 'bg-cyan-900/70 text-cyan-200 border-cyan-300 font-extrabold shadow-[0_0_25px_rgba(103,232,249,0.9)]';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleStartDuel = (opp: ArenaOpponent) => {
    SoundEngine.playClick();

    const entity: CombatEntity = {
      id: opp.id,
      name: `${opp.name}`,
      isPlayer: true,
      avatarIcon: 'UserCheck',
      level: opp.level,
      hp: opp.hp,
      maxHp: opp.hp,
      soulPower: 100 + opp.level * 20,
      maxSoulPower: 100 + opp.level * 20,
      atk: opp.atk,
      def: opp.def,
      speed: opp.speed,
      critRate: 20,
      shield: 0,
      actionGauge: 0,
      buffs: [],
      debuffs: [],
      soulRings: opp.soulRings,
      skills: opp.skills.map((s, idx) => ({
        id: `opp_skill_${idx}`,
        name: s.name,
        ringOrder: idx + 1,
        ringYears: opp.soulRings[idx]?.years || 1000,
        ringColor: opp.soulRings[idx]?.color || 'yellow',
        soulPowerCost: s.soulCost,
        cooldown: s.cd,
        description: s.desc,
        damageMultiplier: s.multiplier
      }))
    };

    onChallengeOpponent(opp, entity);
  };

  return (
    <div className="space-y-6">
      
      {/* ARENA BANNER */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/40 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-black text-slate-100">索托大斗魂场·天下天骄榜</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              斗罗大陆魂师扬名立万的圣地！从铁斗魂一步步晋级至钻石斗魂，甚至与名震大陆的史莱克七怪与封号斗罗巅峰对决！
            </p>
          </div>

          {/* Player Badge and Stats summary */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 p-3 rounded-2xl">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block mb-1">当前徽章</span>
              <span className={`px-3 py-1 rounded-full text-xs border ${getBadgeStyle(player.arenaBadge)}`}>
                {player.arenaBadge}
              </span>
            </div>
            <div className="border-l border-slate-800 pl-4 text-xs space-y-1">
              <div>斗魂积分：<strong className="text-amber-400">{player.arenaPoints} 分</strong></div>
              <div>战绩：<span className="text-emerald-400 font-bold">{player.arenaWins} 胜</span> / <span className="text-rose-400 font-bold">{player.arenaLosses} 负</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ARENA OPPONENTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ARENA_OPPONENTS.map((opp) => {
          return (
            <div
              key={opp.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-100 group-hover:text-amber-400 transition-colors">
                      {opp.name}
                    </h3>
                    <span className="text-xs text-slate-400">{opp.title}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[11px] border ${getBadgeStyle(opp.badge)}`}>
                    {opp.badge}
                  </span>
                </div>

                <div className="mt-2 text-xs text-amber-300 font-medium">
                  武魂：{opp.martialSoulName} (Lv.{opp.level})
                </div>

                {/* Opponent Combat Stats */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl text-[11px] text-slate-400 mt-3 border border-slate-800">
                  <div>生命: <span className="text-rose-400 font-semibold">{opp.hp}</span></div>
                  <div>攻击: <span className="text-amber-400 font-semibold">{opp.atk}</span></div>
                  <div>防御: <span className="text-blue-400 font-semibold">{opp.def}</span></div>
                </div>

                {/* Opponent Skills Showcase */}
                <div className="mt-3 space-y-1 text-xs">
                  <div className="text-slate-400 text-[11px] font-semibold">成名绝技：</div>
                  {opp.skills.slice(0, 2).map((s, idx) => (
                    <div key={idx} className="text-slate-300 text-[11px] truncate">
                      • <strong className="text-amber-400">{s.name}</strong>: {s.desc}
                    </div>
                  ))}
                </div>
              </div>

              {/* Match Rewards & Challenge Button */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  奖励: <strong className="text-yellow-400">{opp.rewardGold}金</strong> | <strong className="text-amber-400">+{opp.rewardPoints}分</strong>
                </div>

                <button
                  onClick={() => handleStartDuel(opp)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl text-xs transition-transform active:scale-95 flex items-center gap-1.5 shadow"
                >
                  <Swords className="w-3.5 h-3.5" />
                  上台斗魂！
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
