import React, { useState } from 'react';
import { Player, ImmortalHerb } from '../types/game';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Flower2, Heart, Shield, Flame, Check, Droplets } from 'lucide-react';

interface IceFireWellViewProps {
  player: Player;
  onConsumeHerb: (herb: ImmortalHerb) => void;
}

export const IceFireWellView: React.FC<IceFireWellViewProps> = ({
  player,
  onConsumeHerb
}) => {
  const [selectedHerb, setSelectedHerb] = useState<ImmortalHerb | null>(null);
  const [refiningHerb, setRefiningHerb] = useState<ImmortalHerb | null>(null);
  const [refineMsg, setRefineMsg] = useState<string | null>(null);

  const handleRefineHerb = (herb: ImmortalHerb) => {
    if (herb.consumed) return;
    setRefiningHerb(herb);
    SoundEngine.playSoulRingAura('gold');

    setTimeout(() => {
      onConsumeHerb(herb);
      setRefiningHerb(null);
      SoundEngine.playBreakthrough();
      setRefineMsg(`🎉 仙品入腹，经脉脱胎换骨！成功炼化【${herb.name}】！`);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* BANNER */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-slate-900 border border-teal-500/40 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Droplets className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-black text-slate-100">落日森林·冰火两仪眼</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              得天独厚的三大聚宝盆之一！极寒极热泉水汇聚，千万年灵气孕育绝品仙草。服用仙品草药可淬炼肉身至金刚不坏，大幅提升魂力等级，甚至促成武魂顶级神级进化！
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-xs space-y-1">
            <div>毒斗罗药圃仙草：<strong className="text-teal-400">{player.immortalHerbs.length} 株</strong></div>
            <div>已炼化仙品：<strong className="text-amber-400">{player.immortalHerbs.filter(h => h.consumed).length} 株</strong></div>
          </div>
        </div>

        {refineMsg && (
          <div className="mt-3 p-2.5 bg-slate-800/90 border border-teal-500/40 rounded-xl text-xs text-teal-300 font-semibold flex items-center justify-between">
            <span>{refineMsg}</span>
            <button onClick={() => setRefineMsg(null)} className="text-slate-400 hover:text-slate-200">✕</button>
          </div>
        )}
      </div>

      {/* HERBS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {player.immortalHerbs.map((herb) => {
          const isConsumed = herb.consumed;

          return (
            <div
              key={herb.id}
              className={`border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                isConsumed
                  ? 'bg-slate-900/60 border-slate-800/80 opacity-75'
                  : 'bg-slate-900/90 border-teal-500/30 hover:border-teal-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.2)]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-teal-950/60 border border-teal-500/40">
                      <Flower2 className="w-5 h-5 text-teal-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-100">{herb.chineseName}</h3>
                      <span className="text-xs text-slate-400">{herb.name}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                    herb.rarity === 'divine' ? 'border-amber-400 bg-amber-950 text-amber-300' :
                    'border-teal-500 bg-teal-950 text-teal-300'
                  }`}>
                    {herb.rarity === 'divine' ? '神品至宝' : '极品仙草'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {herb.description}
                </p>

                {/* Herb Effect Description */}
                <div className="mt-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-emerald-300 leading-relaxed">
                  <strong className="text-amber-400">仙品功效：</strong>
                  {herb.effectDesc}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {isConsumed ? '已完成药力炼化' : '纯净灵气未吸收'}
                </span>

                <button
                  onClick={() => handleRefineHerb(herb)}
                  disabled={isConsumed || refiningHerb !== null}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center gap-1.5 ${
                    isConsumed
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-md'
                  }`}
                >
                  {isConsumed ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      已炼化服食
                    </>
                  ) : refiningHerb?.id === herb.id ? (
                    '药力灌注炼化中...'
                  ) : (
                    '玄玉手采摘·炼化仙草！'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
