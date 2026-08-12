import React, { useState } from 'react';
import { Player, TournamentStage, SoulBone } from '../types/game';
import { TOURNAMENT_STAGES } from '../data/tournamentData';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Trophy, Swords, Shield, Zap, Sparkles, Crown, 
  Flame, Award, CheckCircle2, ChevronRight, Play, RefreshCw, UserCheck
} from 'lucide-react';

interface ContinentalTournamentViewProps {
  player: Player;
  onUpdatePlayer: (updater: (prev: Player) => Player) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
}

export const ContinentalTournamentView: React.FC<ContinentalTournamentViewProps> = ({
  player,
  onUpdatePlayer,
  showToast
}) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(
    Math.min(TOURNAMENT_STAGES.length - 1, player.tournamentProgress?.currentStageIndex || 0)
  );
  const [isBattling, setIsBattling] = useState(false);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | null>(null);

  const currentStage = TOURNAMENT_STAGES[selectedStageIndex] || TOURNAMENT_STAGES[0];
  const squad = (player.douluo4Companions || []).filter(c => c.isRecruited && c.isInSquad);
  const isCleared = (player.tournamentProgress?.currentStageIndex || 0) > selectedStageIndex;

  // Start tournament match against the team
  const handleStartMatch = (stage: TournamentStage) => {
    setIsBattling(true);
    setBattleResult(null);
    setBattleLogs([]);

    SoundEngine.playBattle();

    const logs: string[] = [];
    logs.push(`🏆 【${stage.groupName}】 阶段巅峰对决正式打响！`);
    logs.push(`⚔️ 我方战队 VS 【${stage.teamName}】（队长：${stage.captainName}）`);
    logs.push(`💥 敌方战队阵型光环激活：${stage.teamBuff}`);

    // Douluo 4 Companions aura
    squad.forEach(c => {
      logs.push(`✨ 伙伴【${c.name}】激活全队光环：【${c.passiveAura.name}】，战队全员属性暴涨！`);
    });

    let playerHp = player.level * 2200 + 15000;
    let enemyHp = stage.level * 2600 + 12000;
    let round = 1;

    const interval = setInterval(() => {
      if (round > 6 || playerHp <= 0 || enemyHp <= 0) {
        clearInterval(interval);
        const didWin = playerHp > 0 && enemyHp <= 0;
        setIsBattling(false);
        setBattleResult(didWin ? 'win' : 'lose');

        if (didWin) {
          SoundEngine.playVictory();
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
          logs.push(`🎉 荣获大捷！我方战队强势击溃【${stage.teamName}】，震撼全大陆精英魂师赛场！`);
          setBattleLogs([...logs]);

          // Reward calculation
          onUpdatePlayer(prev => {
            const nextIdx = Math.max(
              prev.tournamentProgress?.currentStageIndex || 0,
              selectedStageIndex + 1
            );
            const historyTitles = [...(prev.tournamentProgress?.historyTitles || [])];
            if (!historyTitles.includes(stage.name)) {
              historyTitles.push(stage.name);
            }

            // Check if soul bone drops
            const newBones = { ...(prev.soulBones || {}) };
            if (stage.rewardSoulBoneName && (Math.random() < stage.rewardSoulBoneChance || stage.rewardSoulBoneChance >= 1)) {
              const boneSlot = selectedStageIndex % 2 === 0 ? 'torso' : 'rightArm';
              newBones[boneSlot] = {
                id: `tb_${stage.id}`,
                name: stage.rewardSoulBoneName,
                slot: boneSlot,
                years: stage.level * 1200 + 20000,
                color: stage.level >= 70 ? 'red' : 'black',
                sourceBeast: stage.teamName,
                description: `全大陆精英魂师大赛【${stage.name}】冠军至尊奖励！`,
                atkBonus: stage.level * 15,
                defBonus: stage.level * 12,
                hpBonus: stage.level * 120,
                speedBonus: stage.level * 2,
                critBonus: 12,
                skillName: `${stage.captainName}·魂骨神威`,
                skillDesc: `引动大赛冠军神威，对敌造成破甲暴击巨量伤害！`,
                skillCooldown: 4,
                equipped: true
              };
            }

            return {
              ...prev,
              gold: prev.gold + stage.rewardGold,
              championMedals: (prev.championMedals || 0) + stage.rewardMedals,
              soulBones: newBones,
              tournamentProgress: {
                currentStageIndex: nextIdx,
                championshipCount: (prev.tournamentProgress?.championshipCount || 0) + (selectedStageIndex === TOURNAMENT_STAGES.length - 1 ? 1 : 0),
                championMedals: (prev.tournamentProgress?.championMedals || 0) + stage.rewardMedals,
                historyTitles
              }
            };
          });

          showToast(`成功击败【${stage.teamName}】！获得金魂币+${stage.rewardGold}，冠军勋章+${stage.rewardMedals}！`, 'success');
        } else {
          SoundEngine.playDefeat();
          logs.push(`💥 比赛失利！【${stage.teamName}】展现出极为强悍的战术协同，请强化斗铠与魂骨后再来挑战！`);
          setBattleLogs([...logs]);
          showToast('对决失利！请提升战力后再行挑战。', 'error');
        }
        return;
      }

      // Player & Active Soul
      const activeSoul = player.martialSouls[player.activeSoulIndex] || player.martialSouls[0];
      const playerDmg = Math.floor(player.level * 400 + Math.random() * 600);
      enemyHp -= playerDmg;
      logs.push(`第${round}回合：我方战队施展【${activeSoul.name}】终极杀招，对敌方造成 ${playerDmg} 点暴击伤害！（敌方剩余气血: ${Math.max(0, enemyHp)}）`);

      // Douluo 4 squad joint strike
      if (squad.length > 0) {
        const c = squad[round % squad.length];
        const companionSkill = c.skills[0];
        const cDmg = Math.floor(c.baseAtk * 2.2);
        enemyHp -= cDmg;
        logs.push(`⚡ 战友【${c.name}】紧密协同释放【${companionSkill.name}】，追加造成 ${cDmg} 点联合打击！`);
      }

      // Enemy team member counter
      if (enemyHp > 0) {
        const member = stage.members[round % stage.members.length];
        const enemyDmg = Math.floor(stage.level * 180 + Math.random() * 250);
        playerHp -= enemyDmg;
        logs.push(`🛡️ 敌方【${member.name}】（${member.martialSoul}）展开猛烈反击，对我方造成 ${enemyDmg} 点反震伤害！`);
      }

      round++;
      setBattleLogs([...logs]);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/70 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-900/60 border border-amber-400/40 rounded-2xl text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-rose-300">
                全大陆高级魂师学院精英大赛
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                从天斗预选赛、星罗晋级赛，到武魂城教皇殿总决赛及联邦巅峰对决，横扫五大元素学院与武魂殿黄金一代，问鼎大陆之巅！
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-amber-500/30">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">冠军勋章总数:</span>
              <span className="font-black text-amber-300 font-mono text-sm">{player.championMedals || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOURNAMENT STAGES TIMELINE (8 Classic Stages) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TOURNAMENT_STAGES.map((stg, idx) => {
          const isSelected = selectedStageIndex === idx;
          const isPassed = (player.tournamentProgress?.currentStageIndex || 0) > idx;
          return (
            <button
              key={stg.id}
              onClick={() => {
                SoundEngine.playClick();
                setSelectedStageIndex(idx);
              }}
              className={`p-3 rounded-2xl border text-left transition-all relative ${
                isSelected
                  ? 'border-amber-400 bg-amber-950/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase">第 {idx + 1} 场</span>
                {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <h4 className="font-black text-slate-100 text-xs mb-1 truncate">{stg.teamName}</h4>
              <span className="text-[10px] text-slate-400 block font-mono">
                推荐 Lv.{stg.level} | 奖金: {stg.rewardGold} 金币
              </span>
            </button>
          );
        })}
      </div>

      {/* MAIN MATCH & TEAM SHOWCASE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: Opponent Team Detail & Members */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold">
                {currentStage.groupName}
              </span>
              <span className="text-xs font-mono text-slate-400">
                段位：<strong>{currentStage.badge}</strong>
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-100">{currentStage.teamName}</h3>
              <p className="text-xs text-amber-300 font-medium">队长：{currentStage.captainName}</p>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentStage.teamDesc}</p>
            </div>

            {/* Team Buff */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px]">战队阵型光环特性：</span>
              <strong className="text-rose-400">{currentStage.teamBuff}</strong>
            </div>

            {/* Roster members */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-slate-400 block">战队首发主力阵容：</span>
              {currentStage.members.map((m, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] flex items-center justify-center border border-amber-500/30">
                      {m.avatarText}
                    </span>
                    <span className="font-bold text-slate-200">{m.name}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    {m.martialSoul} · <strong className="text-sky-300">{m.role}</strong>
                  </span>
                </div>
              ))}
            </div>

            {/* Stage Rewards */}
            <div className="bg-gradient-to-r from-amber-950/40 to-slate-950 p-3 rounded-xl border border-amber-500/30 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">通关金魂币：</span>
                <strong className="text-amber-300 font-mono">+{currentStage.rewardGold}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">冠军勋章：</span>
                <strong className="text-amber-400 font-mono">+{currentStage.rewardMedals}</strong>
              </div>
              {currentStage.rewardSoulBoneName && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-purple-300">
                  <span>概率掉落魂骨：</span>
                  <strong>{currentStage.rewardSoulBoneName}</strong>
                </div>
              )}
            </div>

            <button
              onClick={() => handleStartMatch(currentStage)}
              disabled={isBattling}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Swords className="w-4 h-4" />
              <span>{isCleared ? '再次切磋' : '登台决战'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT 2 COLS: Live Battle Arena Screen & Live Logs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            
            {/* Squad line-up preview */}
            <div className="pb-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-slate-300">我方主力首发出战阵容：</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300">{player.name}（队长）</span>
                {squad.map(c => (
                  <span key={c.id} className="text-xs text-sky-300 font-medium">
                    + {c.name}
                  </span>
                ))}
                {squad.length === 0 && (
                  <span className="text-xs text-slate-500">（暂无伙伴上阵协同）</span>
                )}
              </div>
            </div>

            {/* Live Battle Arena Screen / Logs */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 min-h-[260px] max-h-[320px] overflow-y-auto space-y-2 font-mono text-xs text-slate-300 my-4">
              {battleLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-16 space-y-2">
                  <Trophy className="w-12 h-12 text-slate-700" />
                  <p>点击左侧【登台决战】开始全大陆精英魂师大赛对决！</p>
                </div>
              ) : (
                battleLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed animate-fade-in">
                    {log}
                  </div>
                ))
              )}
            </div>

            {/* Match Result Banner */}
            {battleResult && (
              <div className={`p-3 rounded-xl border text-center font-black text-sm flex items-center justify-center gap-2 ${
                battleResult === 'win'
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
              }`}>
                {battleResult === 'win' ? (
                  <>
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span>大获全胜！成功晋级并斩获大赛丰厚荣誉奖赏！</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 text-rose-400" />
                    <span>惜败于阵！请强化魂骨与斗铠装备后再行挑战！</span>
                  </>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
