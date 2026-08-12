import React, { useState, useEffect, useRef } from 'react';
import { SoulBeast, SoulRingColor, SoulSkill, SoulBone } from '../types/game';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Shield, AlertTriangle, CheckCircle, Zap, Eye, Flame, ShieldAlert, Heart } from 'lucide-react';

interface SoulRingAbsorbModalProps {
  beast: SoulBeast;
  currentRingsCount: number;
  playerLevel: number;
  onAbsorbSuccess: (newSkill: SoulSkill, droppedBone?: SoulBone) => void;
  onCancel: () => void;
}

export const SoulRingAbsorbModal: React.FC<SoulRingAbsorbModalProps> = ({
  beast,
  currentRingsCount,
  playerLevel,
  onAbsorbSuccess,
  onCancel
}) => {
  const [absorbing, setAbsorbing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mentalPressure, setMentalPressure] = useState(30);
  const [isSuccess, setIsSuccess] = useState(false);
  const [backlashWarning, setBacklashWarning] = useState(false);
  const [generatedSkill, setGeneratedSkill] = useState<SoulSkill | null>(null);
  const [droppedBone, setDroppedBone] = useState<SoulBone | null>(null);
  const [zijiActive, setZijiActive] = useState(false);

  const ringOrder = currentRingsCount + 1;

  // Master's max safe limits per ring
  const safeLimits = [423, 764, 1760, 5000, 12000, 25000, 50000, 100000, 1000000];
  const currentSafeLimit = safeLimits[currentRingsCount] || 1000000;
  const isOverLimit = beast.years > currentSafeLimit;
  const overRatio = beast.years / currentSafeLimit;

  // Determine ring color
  let ringColor: SoulRingColor = 'yellow';
  if (beast.years >= 900000) ringColor = 'gold';
  else if (beast.years >= 100000) ringColor = 'red';
  else if (beast.years >= 10000) ringColor = 'black';
  else if (beast.years >= 1000) ringColor = 'purple';
  else if (beast.years >= 100) ringColor = 'yellow';
  else ringColor = 'white';

  const startAbsorb = () => {
    setAbsorbing(true);
    SoundEngine.playSoulRingAura(ringColor);

    let currentProg = 0;
    const interval = setInterval(() => {
      currentProg += 8;
      setProgress(currentProg);

      // Random spiritual pressure surge depending on beast year and over-limit ratio
      const pressureSurge = isOverLimit ? Math.random() * 26 - 8 : Math.random() * 16 - 8;
      setMentalPressure(prev => {
        const next = Math.min(100, Math.max(10, prev + pressureSurge));
        if (next >= 85) {
          setBacklashWarning(true);
          SoundEngine.playThunder();
        } else {
          setBacklashWarning(false);
        }
        return next;
      });

      if (currentProg >= 100) {
        clearInterval(interval);
        finishAbsorb();
      }
    }, 280);
  };

  const stabilizeXuantian = () => {
    SoundEngine.playClick();
    setMentalPressure(prev => Math.max(10, prev - 25));
  };

  const stabilizeZiji = () => {
    SoundEngine.playSkill();
    setZijiActive(true);
    setMentalPressure(prev => Math.max(5, prev - 45));
    setTimeout(() => setZijiActive(false), 1500);
  };

  const stabilizeHerbs = () => {
    SoundEngine.playBreakthrough();
    setMentalPressure(prev => Math.max(5, prev - 55));
  };

  const finishAbsorb = () => {
    // Generate Soul Skill
    const isAvatar = ringOrder === 7;
    const skillMultiplier = (beast.dropRing.multiplier * (1 + ringOrder * 0.2)).toFixed(1);
    
    const skillName = isAvatar
      ? `第七魂技·武魂真身`
      : `第${ringOrder}魂技·${beast.dropRing.skillNameTemplate}`;

    const skillDesc = isAvatar
      ? `化身本命武魂之真身！全属性暴涨100%，全部魂技威力提升50%，魂力消耗减半！持续4回合。`
      : beast.dropRing.skillDescTemplate.replace('{dmg}', `${Math.floor(parseFloat(skillMultiplier) * 100)}`);

    const newSkill: SoulSkill = {
      id: `skill_${Date.now()}`,
      name: skillName,
      ringOrder,
      ringYears: beast.years,
      ringColor,
      soulPowerCost: 20 + ringOrder * 15,
      cooldown: isAvatar ? 5 : Math.max(1, Math.min(4, Math.floor(ringOrder / 2))),
      description: skillDesc,
      damageMultiplier: parseFloat(skillMultiplier),
      isAvatar,
      animationType: isAvatar ? 'domain' : (beast.element === 'thunder' ? 'lightning' : beast.element === 'fire' ? 'fire' : beast.element === 'poison' ? 'poison' : 'smash')
    };

    // Check Bone Drop
    let foundBone: SoulBone | null = null;
    if (beast.possibleBone && Math.random() <= beast.possibleBone.dropRate) {
      foundBone = {
        id: `bone_${Date.now()}`,
        name: beast.possibleBone.name,
        slot: beast.possibleBone.slot,
        years: beast.years,
        color: ringColor,
        sourceBeast: beast.chineseName,
        description: `击败【${beast.chineseName}】极其罕见脱落的极品魂骨！`,
        atkBonus: Math.floor(beast.atk * 0.35),
        defBonus: Math.floor(beast.def * 0.35),
        hpBonus: Math.floor(beast.hp * 0.25),
        speedBonus: Math.floor(beast.speed * 0.3),
        critBonus: 10 + ringOrder,
        skillName: `${beast.chineseName}·魂骨神技`,
        skillDesc: `释放魂骨神威，造成300%无视防御爆发神伤！`,
        skillCooldown: 4,
        equipped: false
      };
      setDroppedBone(foundBone);
    }

    setGeneratedSkill(newSkill);
    setIsSuccess(true);
    setAbsorbing(false);
    SoundEngine.playBreakthrough();

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/40 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-[0_0_40px_rgba(168,85,247,0.3)] relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-slate-100">魂环吸收仪式</h3>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-600/40 font-semibold">
            第 {ringOrder} 魂环
          </span>
        </div>

        {/* Beast & Ring Details */}
        {!isSuccess && !absorbing && (
          <div className="space-y-4 my-4">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-center text-xs p-1 shadow-lg ${
                ringColor === 'red' ? 'border-red-500 bg-red-950 text-red-300' :
                ringColor === 'black' ? 'border-neutral-900 bg-black text-neutral-200' :
                ringColor === 'purple' ? 'border-purple-500 bg-purple-950 text-purple-300' :
                'border-yellow-400 bg-amber-950 text-yellow-300'
              }`}>
                {beast.years >= 10000 ? `${(beast.years / 10000).toFixed(0)}万年` : `${beast.years}年`}
                <br/>
                {ringColor === 'red' ? '十万年' : ringColor === 'black' ? '万年' : ringColor === 'purple' ? '千年' : '百年'}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-base text-amber-300">{beast.chineseName}</h4>
                <p className="text-xs text-slate-400 mt-0.5">属性: {beast.element} | 年限: {beast.years}年</p>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{beast.description}</p>
              </div>
            </div>

            {/* Master Safe Limit Warning */}
            <div className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
              isOverLimit ? 'bg-rose-950/60 border border-rose-700/60 text-rose-200' : 'bg-slate-800 border border-slate-700 text-slate-300'
            }`}>
              {isOverLimit ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold">{isOverLimit ? '【越级吸收高难考验】' : '【大师理论·安全承受年限】'}</span>
                当前魂位理论安全上限为 <span className="font-bold text-amber-400">{currentSafeLimit}年</span>。
                {isOverLimit ? ' 强行吸收将引发狂暴的灵魂震荡考验，需配合玄天功与紫极魔瞳稳固心神！' : ' 经脉完全处于安全承受范围。'}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
              >
                放弃吸收
              </button>
              <button
                onClick={startAbsorb}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 text-xs"
              >
                盘膝凝神·开始吸收魂环！
              </button>
            </div>
          </div>
        )}

        {/* ABSORBING MINIGAME / PROGRESS */}
        {absorbing && (
          <div className="py-6 space-y-5 text-center">
            <div className="relative flex justify-center items-center">
              <div className={`w-24 h-24 rounded-full border-4 animate-spin ${
                ringColor === 'red' ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)]' :
                ringColor === 'black' ? 'border-neutral-900 shadow-[0_0_25px_rgba(120,50,180,0.8)]' :
                'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]'
              }`} style={{ animationDuration: '3s' }} />
              <span className="absolute font-black text-xl text-amber-300">{progress}%</span>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-200">
                {beast.chineseName}的残存狂暴魂力正疯狂涌入四肢百骸...
              </p>
              <div className="w-full bg-slate-800 rounded-full h-2.5 mt-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Willpower Stability Gauge */}
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1">
                  <ShieldAlert className={`w-4 h-4 ${mentalPressure > 70 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
                  经脉与神识承受压力：
                </span>
                <span className={`font-black ${mentalPressure > 70 ? 'text-rose-400 text-sm animate-bounce' : 'text-emerald-400'}`}>
                  {Math.floor(mentalPressure)}% {mentalPressure > 80 && '(危险警告!)'}
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-200 ${
                    mentalPressure > 80 ? 'bg-red-500 animate-pulse' :
                    mentalPressure > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${mentalPressure}%` }}
                />
              </div>

              {/* Willpower Interactive Action Buttons */}
              <div className="pt-2 grid grid-cols-3 gap-2">
                <button
                  onClick={stabilizeXuantian}
                  className="px-2 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-xs transition-transform active:scale-95 shadow"
                >
                  运转玄天功 (-25%)
                </button>
                <button
                  onClick={stabilizeZiji}
                  className="px-2 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg text-xs transition-transform active:scale-95 shadow flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3" /> 紫极定神 (-45%)
                </button>
                <button
                  onClick={stabilizeHerbs}
                  className="px-2 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold rounded-lg text-xs transition-transform active:scale-95 shadow flex items-center justify-center gap-1"
                >
                  <Flame className="w-3 h-3 text-slate-950" /> 冰火护体 (-55%)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS RESULT */}
        {isSuccess && generatedSkill && (
          <div className="space-y-4 my-3 text-center">
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl">
              <span className="text-xs text-emerald-400 font-bold tracking-wider">🎉 魂环吸收大圆满！</span>
              <h4 className="text-lg font-black text-amber-300 mt-1">{generatedSkill.name}</h4>
              <p className="text-xs text-slate-300 mt-2 bg-slate-900/60 p-2.5 rounded-lg text-left leading-relaxed">
                {generatedSkill.description}
              </p>
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
                <span>魂力消耗: <strong className="text-cyan-400">{generatedSkill.soulPowerCost}点</strong></span>
                <span>冷却时间: <strong className="text-yellow-400">{generatedSkill.cooldown}回合</strong></span>
                <span>威力倍率: <strong className="text-rose-400">{generatedSkill.damageMultiplier}x</strong></span>
              </div>
            </div>

            {/* Dropped Soul Bone Notification */}
            {droppedBone && (
              <div className="p-3 bg-amber-950/60 border border-amber-500/60 rounded-xl text-left flex items-center gap-3 animate-bounce">
                <Sparkles className="w-6 h-6 text-amber-300 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-amber-300">【极度罕见·绝世魂骨现世！】</div>
                  <div className="text-xs text-slate-200 font-semibold">{droppedBone.name}</div>
                  <div className="text-[10px] text-slate-400">{droppedBone.description}</div>
                </div>
              </div>
            )}

            <button
              onClick={() => onAbsorbSuccess(generatedSkill, droppedBone || undefined)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl shadow-lg transition-transform active:scale-95 text-sm"
            >
              融合魂技·实力大增！
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
