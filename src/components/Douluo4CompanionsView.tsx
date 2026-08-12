import React, { useState } from 'react';
import { Player, Douluo4Companion } from '../types/game';
import { INITIAL_DOULUO4_COMPANIONS } from '../data/douluo4Companions';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Users, Heart, Star, Sparkles, Swords, Shield, 
  Zap, Flame, Check, Plus, Crown, ChevronRight, Award
} from 'lucide-react';

interface Douluo4CompanionsViewProps {
  player: Player;
  onUpdatePlayer: (updater: (prev: Player) => Player) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
}

export const Douluo4CompanionsView: React.FC<Douluo4CompanionsViewProps> = ({
  player,
  onUpdatePlayer,
  showToast
}) => {
  const companions = player.douluo4Companions || INITIAL_DOULUO4_COMPANIONS;
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>(companions[0].id);

  const selectedCompanion = companions.find(c => c.id === selectedCompanionId) || companions[0];
  const squadCompanions = companions.filter(c => c.isRecruited && c.isInSquad);

  // Recruit companion
  const handleRecruitCompanion = (companion: Douluo4Companion) => {
    const recruitCost = 5000;
    if (player.gold < recruitCost) {
      showToast(`金魂币不足！结交招募需要 ${recruitCost} 金魂币`, 'warning');
      return;
    }

    SoundEngine.playLevelUp();

    onUpdatePlayer(prev => {
      const updated = (prev.douluo4Companions || INITIAL_DOULUO4_COMPANIONS).map(c => {
        if (c.id === companion.id) {
          return { ...c, isRecruited: true, affinity: 50 };
        }
        return c;
      });

      return {
        ...prev,
        gold: prev.gold - recruitCost,
        douluo4Companions: updated
      };
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    showToast(`成功与【${companion.name}】(${companion.title}) 结下深厚羁绊，入驻战队！`, 'success');
  };

  // Give gift / increase affinity & star up
  const handleGiftCompanion = (companionId: string) => {
    const giftCost = 2500;
    if (player.gold < giftCost) {
      showToast(`金魂币不足！赠礼培养需要 ${giftCost} 金魂币`, 'warning');
      return;
    }

    SoundEngine.playClick();

    onUpdatePlayer(prev => {
      const updated = (prev.douluo4Companions || INITIAL_DOULUO4_COMPANIONS).map(c => {
        if (c.id === companionId) {
          const nextAff = c.affinity + 25;
          let nextStar = c.star;
          if (nextAff >= 100 && c.star < 5) {
            nextStar = c.star + 1;
          }
          return {
            ...c,
            affinity: nextAff >= 100 ? nextAff % 100 : nextAff,
            star: nextStar,
            level: Math.min(100, c.level + 5),
            baseAtk: Math.floor(c.baseAtk * 1.15),
            baseDef: Math.floor(c.baseDef * 1.15),
            baseHp: Math.floor(c.baseHp * 1.15)
          };
        }
        return c;
      });

      return {
        ...prev,
        gold: prev.gold - giftCost,
        douluo4Companions: updated
      };
    });

    showToast(`好感度提升！【${selectedCompanion.name}】实力暴涨，羁绊加深！`, 'success');
  };

  // Toggle squad status (max 3 squad members)
  const handleToggleSquad = (companionId: string) => {
    SoundEngine.playClick();

    const target = companions.find(c => c.id === companionId);
    if (!target) return;

    if (!target.isInSquad && squadCompanions.length >= 3) {
      showToast('主力战队最多同时出战 3 位伙伴！请先将其他伙伴下阵', 'warning');
      return;
    }

    onUpdatePlayer(prev => {
      const updated = (prev.douluo4Companions || INITIAL_DOULUO4_COMPANIONS).map(c => {
        if (c.id === companionId) {
          return { ...c, isInSquad: !c.isInSquad };
        }
        return c;
      });
      return { ...prev, douluo4Companions: updated };
    });

    if (!target.isInSquad) {
      showToast(`【${target.name}】已加入主力出战战队！`, 'success');
    } else {
      showToast(`【${target.name}】已从出战战队下阵休息。`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/80 to-slate-900 border border-sky-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-900/60 border border-sky-400/40 rounded-2xl text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.5)]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300">
                终极斗罗 · 史莱克天团伙伴
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                史莱克学院三十三班当代天骄！蓝轩宇、白秀秀、唐雨格等伙伴与您并肩作战，激活武魂融合技与战队全员光环加成。
              </p>
            </div>
          </div>

          {/* Squad summary counter */}
          <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-sky-500/30 flex items-center gap-3">
            <div className="text-xs">
              <span className="text-slate-400 block">战队出战席位:</span>
              <strong className="text-sky-300 font-mono text-sm">{squadCompanions.length} / 3</strong>
            </div>
            <div className="flex -space-x-2 overflow-hidden">
              {squadCompanions.map(c => (
                <img
                  key={c.id}
                  src={c.avatarUrl}
                  alt={c.name}
                  referrerPolicy="no-referrer"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-sky-500 object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: Companion List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-bold text-slate-400 mb-1">伙伴名册 (点击查看详情):</div>
          
          <div className="space-y-2.5">
            {companions.map(companion => {
              const isSelected = selectedCompanionId === companion.id;
              return (
                <div
                  key={companion.id}
                  onClick={() => {
                    SoundEngine.playClick();
                    setSelectedCompanionId(companion.id);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-sky-400 bg-sky-950/50 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full p-0.5 overflow-hidden border-2" style={{ borderColor: companion.themeColor }}>
                        <img
                          src={companion.avatarUrl}
                          alt={companion.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      {companion.isInSquad && (
                        <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-amber-500 text-slate-950 rounded-full text-[9px] font-black shadow">
                          战
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-slate-100 text-sm">{companion.name}</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: companion.star }).map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[11px] text-sky-300 font-medium block truncate max-w-[140px]">
                        {companion.title}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-300 block">
                      Lv.{companion.level}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block mt-1 ${
                      companion.isRecruited
                        ? companion.isInSquad
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-slate-800 text-slate-400'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {companion.isRecruited ? (companion.isInSquad ? '出战中' : '已招募') : '未招募'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT 2 COLS: Selected Companion Detail, Skills, Aura & Squad Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            
            {/* Top Detail Card */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 pb-5 border-b border-slate-800">
              <div className="w-24 h-24 rounded-2xl p-1 bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 shadow-[0_0_20px_rgba(56,189,248,0.4)] overflow-hidden shrink-0">
                <img
                  src={selectedCompanion.avatarUrl}
                  alt={selectedCompanion.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="flex-1 text-center md:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h3 className="text-xl font-black text-slate-100">{selectedCompanion.name}</h3>
                  <span className="text-xs px-2.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-full font-bold">
                    {selectedCompanion.title}
                  </span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: selectedCompanion.star }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="text-xs text-amber-300 font-medium">
                  本命武魂: <strong className="text-slate-200">{selectedCompanion.martialSoul}</strong>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {selectedCompanion.description}
                </p>

                {/* Base Stats Row */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                  <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">攻击 (ATK)</span>
                    <span className="text-rose-400 font-mono font-bold">{selectedCompanion.baseAtk}</span>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">防御 (DEF)</span>
                    <span className="text-blue-400 font-mono font-bold">{selectedCompanion.baseDef}</span>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">生命 (HP)</span>
                    <span className="text-emerald-400 font-mono font-bold">{selectedCompanion.baseHp}</span>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">速度 (SPD)</span>
                    <span className="text-amber-400 font-mono font-bold">{selectedCompanion.baseSpeed}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Passive Squad Aura */}
            <div className="py-4 border-b border-slate-800">
              <div className="flex items-center gap-2 mb-1 text-sky-300 font-bold text-xs">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>战队被动光环: 【{selectedCompanion.passiveAura.name}】</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                {selectedCompanion.passiveAura.desc}
              </p>
            </div>

            {/* Companion Active Combat Skills & Fusions */}
            <div className="py-4 space-y-2.5">
              <div className="text-xs font-bold text-slate-400">专属魂技与武魂融合技:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCompanion.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border ${
                      skill.isFusion
                        ? 'border-purple-500/50 bg-purple-950/30'
                        : 'border-slate-800 bg-slate-950/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-amber-300">{skill.name}</span>
                      {skill.isFusion && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-purple-500/30 text-purple-300 border border-purple-500/50 rounded font-bold">
                          武魂融合技
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {skill.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions: Recruit / Squad / Gift */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                当前好感度: <strong className="text-pink-400 font-mono">{selectedCompanion.affinity}%</strong>
              </div>

              <div className="flex items-center gap-2">
                {selectedCompanion.isRecruited ? (
                  <>
                    <button
                      onClick={() => handleGiftCompanion(selectedCompanion.id)}
                      className="px-4 py-2 bg-pink-900/40 hover:bg-pink-800/60 text-pink-300 border border-pink-500/40 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                      <span>赠礼培养 (2,500 金魂币)</span>
                    </button>

                    <button
                      onClick={() => handleToggleSquad(selectedCompanion.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCompanion.isInSquad
                          ? 'bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-slate-700'
                          : 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md hover:brightness-110'
                      }`}
                    >
                      {selectedCompanion.isInSquad ? '下阵休息' : '编入主力出战'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleRecruitCompanion(selectedCompanion)}
                    className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black rounded-xl text-xs shadow-lg flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>结交招募 (5,000 金魂币)</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
