import React, { useState } from 'react';
import { Player, SoulSkill, SoulRingColor, MartialSoul } from '../types/game';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Flame, Zap, ArrowRight, Shield, CheckCircle2, RotateCcw, AlertTriangle, Coins, Award, Layers, X, RefreshCw } from 'lucide-react';

interface SoulRingFusionModalProps {
  player: Player;
  onUpdatePlayer: (updater: (prev: Player) => Player) => void;
  onClose: () => void;
  showToast?: (message: string, type?: 'success' | 'info' | 'gold') => void;
}

export function getRingColorByYears(years: number): SoulRingColor {
  if (years >= 1000000) return 'gold';
  if (years >= 100000) return 'red';
  if (years >= 10000) return 'black';
  if (years >= 1000) return 'purple';
  if (years >= 100) return 'yellow';
  return 'white';
}

export function getRingColorName(color: SoulRingColor): string {
  switch (color) {
    case 'gold': return '百万年神级金环';
    case 'red': return '十万年绝世红环';
    case 'black': return '万年深邃黑环';
    case 'purple': return '千年高阶紫环';
    case 'yellow': return '百年精锐黄环';
    default: return '十年基础白环';
  }
}

export const SoulRingFusionModal: React.FC<SoulRingFusionModalProps> = ({
  player,
  onUpdatePlayer,
  onClose,
  showToast
}) => {
  const [selectedSoulIndex, setSelectedSoulIndex] = useState<number>(player.activeSoulIndex || 0);
  const [primarySkillId, setPrimarySkillId] = useState<string | null>(null);
  const [secondarySkillId, setSecondarySkillId] = useState<string | null>(null);

  const [isFusing, setIsFusing] = useState<boolean>(false);
  const [fusionProgress, setFusionProgress] = useState<number>(0);
  const [fusionSuccessData, setFusionSuccessData] = useState<{
    skillName: string;
    oldYears: number;
    newYears: number;
    oldColor: SoulRingColor;
    newColor: SoulRingColor;
    oldMultiplier: number;
    newMultiplier: number;
    goldCost: number;
  } | null>(null);

  const currentSoul: MartialSoul = player.martialSouls[selectedSoulIndex] || player.martialSouls[0];
  const skillsList = currentSoul?.skills || [];

  const primarySkill = skillsList.find(s => s.id === primarySkillId) || null;
  const secondarySkill = skillsList.find(s => s.id === secondarySkillId) || null;

  // Calculate Fusion preview values if both skills selected
  let isAttributeMatch = false;
  let fusedYears = 0;
  let goldCost = 0;
  let oldColor: SoulRingColor = 'yellow';
  let newColor: SoulRingColor = 'yellow';
  let newDmgMultiplier = 1.0;
  let newSoulCost = 20;

  if (primarySkill && secondarySkill) {
    // Check match: either both are avatar, or ringOrder close, or both same color/tier
    isAttributeMatch = primarySkill.ringColor === secondarySkill.ringColor || primarySkill.animationType === secondarySkill.animationType;
    const bonusMultiplier = isAttributeMatch ? 1.25 : 1.1;

    fusedYears = Math.floor((primarySkill.ringYears + secondarySkill.ringYears) * bonusMultiplier);
    goldCost = Math.max(800, Math.floor((primarySkill.ringYears + secondarySkill.ringYears) * 1.5));

    oldColor = primarySkill.ringColor;
    newColor = getRingColorByYears(fusedYears);

    const baseMult1 = primarySkill.damageMultiplier || 1.5;
    const baseMult2 = secondarySkill.damageMultiplier || 1.2;
    newDmgMultiplier = parseFloat((baseMult1 + baseMult2 * 0.55 + (isAttributeMatch ? 0.4 : 0.2)).toFixed(1));
    newSoulCost = Math.max(10, Math.floor((primarySkill.soulPowerCost + secondarySkill.soulPowerCost) * 0.65));
  }

  const handleStartFusion = () => {
    if (!primarySkill || !secondarySkill) return;

    if (player.gold < goldCost) {
      SoundEngine.playClick();
      showToast?.(`金魂币不足！融合需要 ${goldCost.toLocaleString()} 金魂币`, 'info');
      return;
    }

    setIsFusing(true);
    setFusionProgress(0);
    SoundEngine.playSoulRingAura(newColor);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 12;
      setFusionProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        executeFusion();
      }
    }, 220);
  };

  const executeFusion = () => {
    if (!primarySkill || !secondarySkill) return;

    const oldYears = primarySkill.ringYears;
    const oldMult = primarySkill.damageMultiplier || 1.5;

    // Update Player state
    onUpdatePlayer(prev => {
      const updatedSouls = [...prev.martialSouls];
      const soulToUpdate = { ...updatedSouls[selectedSoulIndex] };
      const currentSkills = [...soulToUpdate.skills];

      // Index of primary & secondary
      const pIdx = currentSkills.findIndex(s => s.id === primarySkill.id);
      const sIdx = currentSkills.findIndex(s => s.id === secondarySkill.id);

      if (pIdx === -1 || sIdx === -1) return prev;

      // Updated Primary Skill
      const updatedPrimary: SoulSkill = {
        ...currentSkills[pIdx],
        ringYears: fusedYears,
        ringColor: newColor,
        damageMultiplier: newDmgMultiplier,
        soulPowerCost: newSoulCost,
        description: `【双环熔炼突破】${currentSkills[pIdx].description.replace(/(\d+年|\d+万年)/, `${fusedYears >= 10000 ? (fusedYears/10000).toFixed(0) + '万' : fusedYears}年`)} (爆发倍率 ${newDmgMultiplier}x)`
      };

      currentSkills[pIdx] = updatedPrimary;

      // Remove Secondary Skill to free up ring order
      currentSkills.splice(sIdx, 1);

      // Re-index ring orders if needed
      soulToUpdate.skills = currentSkills.map((s, idx) => ({
        ...s,
        ringOrder: idx + 1
      }));

      updatedSouls[selectedSoulIndex] = soulToUpdate;

      return {
        ...prev,
        gold: Math.max(0, prev.gold - goldCost),
        martialSouls: updatedSouls
      };
    });

    setIsFusing(false);
    SoundEngine.playBreakthrough();

    setFusionSuccessData({
      skillName: primarySkill.name,
      oldYears,
      newYears: fusedYears,
      oldColor: primarySkill.ringColor,
      newColor,
      oldMultiplier: oldMult,
      newMultiplier: newDmgMultiplier,
      goldCost
    });

    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch {}

    showToast?.(`🎉 魂环融合成功！【${primarySkill.name}】蜕变为 ${fusedYears.toLocaleString()}年 ${getRingColorName(newColor)}！`, 'success');
  };

  const handleResetSelection = () => {
    SoundEngine.playClick();
    setPrimarySkillId(null);
    setSecondarySkillId(null);
    setFusionSuccessData(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950/80 to-slate-950 border border-purple-500/50 rounded-3xl max-w-2xl w-full p-6 text-slate-100 shadow-[0_0_50px_rgba(168,85,247,0.35)] relative overflow-hidden space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-full bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-100 flex items-center gap-2">
                <span>魂环熔炼真阵</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40">
                  双环合一 · 年限蜕变
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                将两个已吸收的同武魂魂环融合，融合后保留主魂环并大幅提升年限与威力，同时腾出被融合槽位！
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

        {/* Martial Soul Selector if Twin 武魂 */}
        {player.martialSouls.length > 1 && !fusionSuccessData && (
          <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-slate-800 relative z-10">
            <span className="text-xs font-bold text-slate-400">选择融合武魂:</span>
            <div className="flex items-center gap-2">
              {player.martialSouls.map((soul, idx) => (
                <button
                  key={soul.id + idx}
                  onClick={() => {
                    SoundEngine.playClick();
                    setSelectedSoulIndex(idx);
                    setPrimarySkillId(null);
                    setSecondarySkillId(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSoulIndex === idx
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {soul.chineseName || soul.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SUCCESS RESULT SCREEN */}
        {fusionSuccessData ? (
          <div className="p-6 bg-slate-950/90 border border-emerald-500/50 rounded-2xl text-center space-y-4 animate-fade-in relative z-10">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center mx-auto text-2xl animate-bounce">
              🎉
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 tracking-wider">【魂环神合 · 蜕变成功】</span>
              <h4 className="text-xl font-black text-amber-300 mt-1">{fusionSuccessData.skillName}</h4>
            </div>

            {/* Old vs New Comparison Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1 text-left">
                <span className="text-slate-400 text-[10px] block font-semibold">融合前年限:</span>
                <div className="font-mono font-bold text-slate-300 text-sm">
                  {fusionSuccessData.oldYears.toLocaleString()} 年
                </div>
                <div className="text-[10px] text-purple-400">
                  {getRingColorName(fusionSuccessData.oldColor)}
                </div>
                <div className="text-[10px] text-slate-400">
                  威力: {fusionSuccessData.oldMultiplier}x
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-950/60 to-slate-900 p-3 rounded-xl border border-purple-500/50 space-y-1 text-left shadow-lg">
                <span className="text-amber-400 text-[10px] block font-bold">融合后突破年限:</span>
                <div className="font-mono font-black text-amber-300 text-base">
                  {fusionSuccessData.newYears.toLocaleString()} 年
                </div>
                <div className="text-[10px] font-bold text-emerald-400">
                  {getRingColorName(fusionSuccessData.newColor)}
                </div>
                <div className="text-[10px] font-bold text-rose-400">
                  全新威力: {fusionSuccessData.newMultiplier}x (大幅提升!)
                </div>
              </div>
            </div>

            <button
              onClick={handleResetSelection}
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold rounded-2xl shadow-lg transition-transform active:scale-95 text-xs flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>继续融合其他魂环</span>
            </button>
          </div>
        ) : (
          /* FUSION INTERACTIVE WORKBENCH */
          <div className="space-y-4 relative z-10">
            
            {/* Top 2 Slots: Primary Ring + Secondary Ring */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* Slot 1: Primary Ring */}
              <div className={`p-4 rounded-2xl border text-left transition-all ${
                primarySkill
                  ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                  : 'bg-slate-950/80 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-purple-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> 选定【主魂环】(保留并提升)
                  </span>
                  {primarySkill && (
                    <button
                      onClick={() => setPrimarySkillId(null)}
                      className="text-[10px] text-slate-400 hover:text-slate-200 underline"
                    >
                      重新选择
                    </button>
                  )}
                </div>

                {primarySkill ? (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-sm font-bold text-amber-300">{primarySkill.name}</strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/80 text-purple-200 font-mono font-bold">
                        第{primarySkill.ringOrder}环
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-mono font-bold">
                      年限: {primarySkill.ringYears.toLocaleString()}年 ({getRingColorName(primarySkill.ringColor)})
                    </div>
                    <div className="text-[11px] text-slate-400">
                      基础技能倍率: {primarySkill.damageMultiplier || 1.5}x
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500 italic">
                    点击下方列表选择主魂环
                  </div>
                )}
              </div>

              {/* Slot 2: Secondary Ring */}
              <div className={`p-4 rounded-2xl border text-left transition-all ${
                secondarySkill
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                  : 'bg-slate-950/80 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-indigo-300 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> 选定【副魂环】(融合并消耗)
                  </span>
                  {secondarySkill && (
                    <button
                      onClick={() => setSecondarySkillId(null)}
                      className="text-[10px] text-slate-400 hover:text-slate-200 underline"
                    >
                      重新选择
                    </button>
                  )}
                </div>

                {secondarySkill ? (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-sm font-bold text-amber-300">{secondarySkill.name}</strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-900/80 text-indigo-200 font-mono font-bold">
                        第{secondarySkill.ringOrder}环
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-mono font-bold">
                      年限: {secondarySkill.ringYears.toLocaleString()}年 ({getRingColorName(secondarySkill.ringColor)})
                    </div>
                    <div className="text-[11px] text-slate-400">
                      提供熔炼本源: +{(secondarySkill.ringYears * 1.1).toFixed(0)}年
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500 italic">
                    点击下方列表选择副材料魂环
                  </div>
                )}
              </div>

            </div>

            {/* FUSION PREVIEW SUMMARY CARD */}
            {primarySkill && secondarySkill && (
              <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-4 space-y-3 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-200">融合预估产出:</span>
                  </div>
                  {isAttributeMatch && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold">
                      ✨ 同阶属性共鸣 (+25% 额外年限!)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">目标突破年限</span>
                    <strong className="text-amber-300 text-sm font-mono block mt-0.5">
                      {fusedYears.toLocaleString()}年
                    </strong>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">蜕变魂环品阶</span>
                    <strong className="text-emerald-400 text-xs block mt-1">
                      {getRingColorName(newColor)}
                    </strong>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">新技能威力倍率</span>
                    <strong className="text-rose-400 text-sm font-mono block mt-0.5">
                      {newDmgMultiplier}x
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-yellow-400" />
                    需要消耗金魂币:
                  </span>
                  <span className={`font-mono font-bold ${player.gold >= goldCost ? 'text-yellow-300' : 'text-rose-400'}`}>
                    {goldCost.toLocaleString()} / {player.gold.toLocaleString()} 金魂币
                  </span>
                </div>
              </div>
            )}

            {/* FUSING PROGRESS BAR */}
            {isFusing && (
              <div className="py-4 space-y-2 text-center bg-slate-950/90 rounded-2xl p-4 border border-purple-500/40">
                <p className="text-xs font-bold text-purple-300 animate-pulse">
                  正在凝聚两枚魂环的灵魂本源，经脉魂力融合中...
                </p>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 h-full transition-all duration-200"
                    style={{ width: `${fusionProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* ACTION BUTTON */}
            {primarySkill && secondarySkill && !isFusing && (
              <button
                onClick={handleStartFusion}
                disabled={player.gold < goldCost}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:brightness-110 text-white font-black text-sm rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>开启魂环融合大阵</span>
              </button>
            )}

            {/* SKILLS SELECTOR LIST */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  当前武魂已吸收魂环列表 ({skillsList.length} 枚):
                </span>
                <span className="text-[10px] text-slate-500">
                  依次点击选定主魂环与副魂环
                </span>
              </div>

              {skillsList.length < 2 ? (
                <div className="py-6 text-center text-xs text-slate-500 italic bg-slate-950/60 rounded-xl border border-slate-800">
                  当前武魂最少需要吸收2枚魂环才可开启融合功能。请先前往【星斗大森林】猎杀魂兽吸收魂环！
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {skillsList.map(skill => {
                    const isPrimary = primarySkillId === skill.id;
                    const isSecondary = secondarySkillId === skill.id;

                    return (
                      <button
                        key={skill.id}
                        onClick={() => {
                          SoundEngine.playClick();
                          if (isPrimary) {
                            setPrimarySkillId(null);
                          } else if (isSecondary) {
                            setSecondarySkillId(null);
                          } else if (!primarySkillId) {
                            setPrimarySkillId(skill.id);
                          } else if (!secondarySkillId) {
                            setSecondarySkillId(skill.id);
                          } else {
                            setPrimarySkillId(skill.id);
                            setSecondarySkillId(null);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all relative ${
                          isPrimary
                            ? 'bg-purple-950/80 border-purple-500 text-purple-200 ring-1 ring-purple-500'
                            : isSecondary
                            ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500'
                            : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-100">{skill.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            isPrimary ? 'bg-purple-500 text-slate-950' :
                            isSecondary ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isPrimary ? '主魂环' : isSecondary ? '副材料' : `第${skill.ringOrder}环`}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 font-mono mt-1">
                          {skill.ringYears.toLocaleString()}年 · {getRingColorName(skill.ringColor)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
