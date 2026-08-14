import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GodTest, GodInheritanceInfo, ALL_GOD_INHERITANCES } from '../data/godTrials';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Crown, Award, X, RotateCcw, Waves, Swords, Sun, Skull, Zap } from 'lucide-react';

interface GodTrialReplayModalProps {
  test: GodTest | null;
  onClose: () => void;
}

export const GodTrialReplayModal: React.FC<GodTrialReplayModalProps> = ({ test, onClose }) => {
  if (!test) return null;

  const godInfo = ALL_GOD_INHERITANCES.find(g => g.id === test.godType) || ALL_GOD_INHERITANCES[0];

  const isSeaGod = test.godType === 'seagod';
  const isAsura = test.godType === 'asura';
  const isAngel = test.godType === 'angel';
  const isRakshasa = test.godType === 'rakshasa';
  const isEmotion = test.godType === 'emotion';
  const isDragonGod = test.godType === 'dragongod';

  const triggerReplayEffects = () => {
    SoundEngine.playBreakthrough();
    SoundEngine.playSoulRingAura('gold');

    try {
      const colors = isSeaGod
        ? ['#06b6d4', '#3b82f6', '#60a5fa', '#ffffff']
        : isAsura
        ? ['#ef4444', '#b91c1c', '#fbbf24', '#dc2626']
        : isAngel
        ? ['#f59e0b', '#fbbf24', '#fde047', '#ffffff']
        : isRakshasa
        ? ['#a855f7', '#7e22ce', '#c084fc', '#e879f9']
        : isEmotion
        ? ['#38bdf8', '#14b8a6', '#6366f1', '#ffffff']
        : ['#f59e0b', '#facc15', '#10b981', '#38bdf8', '#ef4444'];

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors
      });
    } catch {}
  };

  useEffect(() => {
    triggerReplayEffects();
  }, [test]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-hidden"
      >
        {/* Background Radial Light Burst */}
        <div className={`absolute inset-0 bg-gradient-to-b ${godInfo.colorScheme.bannerBg} opacity-80 pointer-events-none`} />

        {/* Ambient Halo Pulsing Orbit */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[600px] h-[600px] rounded-full border border-dashed border-slate-700/50 pointer-events-none"
        />

        {/* Replay Container Card */}
        <motion.div
          initial={{ scale: 0.8, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className={`relative w-full max-w-2xl bg-slate-900/95 border-2 ${godInfo.colorScheme.border} rounded-3xl p-6 md:p-8 shadow-[0_0_50px_${godInfo.colorScheme.glowColor}] text-slate-100 overflow-hidden z-10 flex flex-col items-center text-center`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-all border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Divine Emblem Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6, ease: 'backOut' }}
            className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 ${godInfo.colorScheme.border} bg-slate-950/90 shadow-2xl mb-4 relative group`}
          >
            {isSeaGod && <Waves className="w-10 h-10 text-cyan-400 animate-pulse" />}
            {isAsura && <Swords className="w-10 h-10 text-red-500 animate-pulse" />}
            {isAngel && <Sun className="w-10 h-10 text-yellow-400 animate-pulse" />}
            {isRakshasa && <Skull className="w-10 h-10 text-purple-400 animate-pulse" />}

            <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 重播典藏
            </div>
          </motion.div>

          {/* God Title Announcement */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-1"
          >
            <span className={`text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full border ${godInfo.colorScheme.badgeBg}`}>
              【{godInfo.name} · 第 {test.level} 考传承】
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-wide text-slate-100 mt-2">
              {test.title}
            </h2>
            <p className={`text-sm font-bold ${godInfo.colorScheme.accentText}`}>
              {test.name}
            </p>
          </motion.div>

          {/* Dynamic SVG Path Special Effect Canvas Replay */}
          <div className="w-full h-48 my-4 relative flex items-center justify-center bg-slate-950/80 rounded-2xl border border-slate-800/80 overflow-hidden shadow-inner">
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute inset-0 bg-gradient-to-r ${godInfo.colorScheme.bannerBg} opacity-30`}
            />

            {/* SEA GOD TRIDENT SVG ANIMATION */}
            {isSeaGod && (
              <motion.svg viewBox="0 0 400 200" className="w-full h-full max-w-sm">
                <defs>
                  <linearGradient id="seaReplayGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
                {/* Ocean Trident Center Prongs */}
                <motion.path
                  d="M 200 30 L 200 170 M 160 50 L 160 100 Q 160 130 200 130 Q 240 130 240 100 L 240 50"
                  fill="none"
                  stroke="url(#seaReplayGrad)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
                {/* Trident Glowing Orb */}
                <motion.circle
                  cx="200"
                  cy="90"
                  r="18"
                  fill="#06b6d4"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0.9] }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                />
                {/* Radial Wave Shock Ring */}
                <motion.circle
                  cx="200"
                  cy="90"
                  r="65"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: [0.3, 1.3], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: 0.8 }}
                />
              </motion.svg>
            )}

            {/* ASURA GOD SWORD SVG ANIMATION */}
            {isAsura && (
              <motion.svg viewBox="0 0 400 200" className="w-full h-full max-w-sm">
                <defs>
                  <linearGradient id="asuraReplayGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#991b1b" />
                  </linearGradient>
                </defs>

                {/* Crimson Sword Cross Blade */}
                <motion.path
                  d="M 200 20 L 200 170 M 150 120 L 250 120 M 190 20 L 200 10 L 210 20 Z"
                  fill="none"
                  stroke="url(#asuraReplayGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, ease: 'easeInOut' }}
                />
                {/* Blood Slash Cross Trails */}
                <motion.path
                  d="M 80 40 L 320 160 M 320 40 L 80 160"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeDasharray="10 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                  transition={{ duration: 1.0, delay: 0.5, repeat: Infinity, repeatDelay: 0.5 }}
                />
              </motion.svg>
            )}

            {/* ANGEL GOD WINGS & SWORD SVG ANIMATION */}
            {isAngel && (
              <motion.svg viewBox="0 0 400 200" className="w-full h-full max-w-sm">
                <defs>
                  <linearGradient id="angelReplayGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="100%" stopColor="#ca8a04" />
                  </linearGradient>
                </defs>

                {/* Seraphim Wings Arcs */}
                <motion.path
                  d="M 200 100 C 140 30, 60 40, 30 90 C 80 110, 140 120, 200 100"
                  fill="none"
                  stroke="url(#angelReplayGrad)"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.0 }}
                />
                <motion.path
                  d="M 200 100 C 260 30, 340 40, 370 90 C 320 110, 260 120, 200 100"
                  fill="none"
                  stroke="url(#angelReplayGrad)"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.0 }}
                />
                {/* Golden Sword Blade Center */}
                <motion.path
                  d="M 200 25 L 200 175"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </motion.svg>
            )}

            {/* RAKSHASA GOD SCYTHE SVG ANIMATION */}
            {isRakshasa && (
              <motion.svg viewBox="0 0 400 200" className="w-full h-full max-w-sm">
                <defs>
                  <linearGradient id="rakshasaReplayGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#581c87" />
                  </linearGradient>
                </defs>

                {/* Scythe Arc Blade */}
                <motion.path
                  d="M 120 160 L 260 40 Q 340 30, 320 110 Q 280 80, 260 40"
                  fill="none"
                  stroke="url(#rakshasaReplayGrad)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
                {/* Purple Ghost Fire Circles */}
                <motion.circle
                  cx="310"
                  cy="70"
                  r="25"
                  fill="none"
                  stroke="#e879f9"
                  strokeWidth="3"
                  strokeDasharray="6 3"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [0.5, 1.4], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              </motion.svg>
            )}
          </div>

          {/* Description & Rewards Breakdown */}
          <div className="w-full space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-left text-xs">
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-amber-300">考核纪实：</strong> {test.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>典藏通关奖励：<strong className="text-amber-300">{test.rewardItemName}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Crown className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>神祇亲和度提升：<strong className="text-cyan-300">+{test.rewardAffinity}%</strong></span>
              </div>
            </div>
          </div>

          {/* Footer Action Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={triggerReplayEffects}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all active:scale-95 bg-slate-800 hover:bg-slate-700 text-slate-200 ${godInfo.colorScheme.border}`}
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              再次重播特效
            </button>

            <button
              onClick={onClose}
              className={`px-8 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 bg-gradient-to-r ${godInfo.colorScheme.buttonBg}`}
            >
              <Sparkles className="w-4 h-4" />
              领略完毕 · 返回神考
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
