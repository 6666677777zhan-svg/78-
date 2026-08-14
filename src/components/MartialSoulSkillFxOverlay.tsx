import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface ActiveSkillFxState {
  id: string;
  skillName: string;
  soulName: string; // e.g. '昊天锤' | '蓝银皇' | '七杀剑' | '六翼天使' | '邪眸白虎' | '幽冥灵猫' | '邪火凤凰' | '蓝电霸王龙' | '死亡蛛皇' | '九宝琉璃塔' | '九心海棠' | '海神' | '修罗神' | '唐门暗器' | '紫极魔瞳' | '至高龙神' | '情绪之神'
  colorTheme?: 'hammer' | 'grass' | 'sword' | 'tiger' | 'angel' | 'phoenix' | 'dragon' | 'spider' | 'pagoda' | 'begonia' | 'seagod' | 'asura' | 'tang' | 'purple' | 'gold' | 'red' | 'dragongod' | 'emotion';
  isCrit?: boolean;
  godPossessionTheme?: '海神' | '修罗神' | '天使神' | '罗刹神' | '情绪之神' | '至高龙神' | '海神 & 修罗双神' | string | null;
}

interface MartialSoulSkillFxOverlayProps {
  activeFx: ActiveSkillFxState | null;
  onAnimationComplete?: () => void;
}

export const MartialSoulSkillFxOverlay: React.FC<MartialSoulSkillFxOverlayProps> = ({
  activeFx,
  onAnimationComplete
}) => {
  if (!activeFx) return null;

  const { skillName, soulName, colorTheme, isCrit, godPossessionTheme } = activeFx;

  // Category Detection
  const isDragonGod = colorTheme === 'dragongod' || soulName.includes('龙神') || skillName.includes('龙神') || skillName.includes('九彩');
  const isEmotion = colorTheme === 'emotion' || soulName.includes('情绪') || skillName.includes('浩冬') || skillName.includes('灵眸') || skillName.includes('冰爆');
  const isHammer = !isDragonGod && (colorTheme === 'hammer' || soulName.includes('锤') || skillName.includes('锤') || skillName.includes('重击') || skillName.includes('碎星'));
  const isGrass = colorTheme === 'grass' || soulName.includes('草') || soulName.includes('皇') || skillName.includes('缠绕') || skillName.includes('突刺') || skillName.includes('囚笼');
  const isSword = colorTheme === 'sword' || soulName.includes('剑') || skillName.includes('剑') || skillName.includes('斩') || skillName.includes('破刺');
  const isTiger = colorTheme === 'tiger' || soulName.includes('虎') || skillName.includes('狮') || skillName.includes('爪') || skillName.includes('烈光波');
  const isAngel = colorTheme === 'angel' || soulName.includes('天使') || skillName.includes('神光') || skillName.includes('净化') || skillName.includes('日光');
  const isPhoenix = colorTheme === 'phoenix' || soulName.includes('风') || soulName.includes('凰') || skillName.includes('火') || skillName.includes('炎') || skillName.includes('焚');
  const isDragon = !isDragonGod && (colorTheme === 'dragon' || soulName.includes('龙') || skillName.includes('雷') || skillName.includes('电') || skillName.includes('霹雳'));
  const isSpider = colorTheme === 'spider' || soulName.includes('蛛') || skillName.includes('毒') || skillName.includes('噬魂') || skillName.includes('蛛网');
  const isPagoda = colorTheme === 'pagoda' || soulName.includes('塔') || soulName.includes('琉璃') || skillName.includes('增幅') || skillName.includes('护罩');
  const isBegonia = colorTheme === 'begonia' || soulName.includes('棠') || skillName.includes('治愈') || skillName.includes('恢复') || skillName.includes('海棠');
  const isSeaGod = colorTheme === 'seagod' || soulName.includes('海') || skillName.includes('三叉戟') || skillName.includes('无定风波');
  const isAsura = colorTheme === 'asura' || soulName.includes('修罗') || skillName.includes('杀神') || skillName.includes('血');
  const isTang = colorTheme === 'tang' || soulName.includes('暗器') || skillName.includes('唐莲') || skillName.includes('梨花') || skillName.includes('机括');
  const isPurple = colorTheme === 'purple' || skillName.includes('紫极') || skillName.includes('魔瞳') || skillName.includes('鬼影');

  // Particle color palette generation
  const particleColors = useMemo(() => {
    if (isDragonGod) return ['#f59e0b', '#facc15', '#10b981', '#38bdf8', '#ef4444', '#a855f7', '#ffffff'];
    if (isEmotion) return ['#38bdf8', '#14b8a6', '#818cf8', '#c084fc', '#ffffff'];
    if (isHammer) return ['#fbbf24', '#f59e0b', '#b45309', '#fef08a', '#ffffff'];
    if (isGrass) return ['#34d399', '#10b981', '#064e3b', '#a7f3d0', '#fef08a'];
    if (isSword) return ['#38bdf8', '#0284c7', '#bae6fd', '#ffffff', '#a5f3fc'];
    if (isTiger) return ['#fb923c', '#ea580c', '#fef08a', '#ffffff'];
    if (isAngel) return ['#fde047', '#f59e0b', '#ffffff', '#fef9c3'];
    if (isPhoenix) return ['#f43f5e', '#be123c', '#fb923c', '#fef08a'];
    if (isDragon) return ['#60a5fa', '#2563eb', '#93c5fd', '#ffffff', '#38bdf8'];
    if (isSpider) return ['#c084fc', '#9333ea', '#e879f9', '#ffffff'];
    if (isPagoda) return ['#38bdf8', '#0284c7', '#fef08a', '#a5f3fc'];
    if (isBegonia) return ['#f472b6', '#db2777', '#fbcfe8', '#ffffff'];
    if (isSeaGod) return ['#22d3ee', '#0284c7', '#38bdf8', '#fef08a'];
    if (isAsura) return ['#ef4444', '#b91c1c', '#fca5a5', '#fef08a'];
    if (isTang) return ['#facc15', '#ca8a04', '#fef08a', '#ffffff'];
    if (isPurple) return ['#c084fc', '#7e22ce', '#e879f9', '#ffffff'];
    return ['#fb7185', '#f43f5e', '#fef08a', '#ffffff'];
  }, [isDragonGod, isEmotion, isHammer, isGrass, isSword, isTiger, isAngel, isPhoenix, isDragon, isSpider, isPagoda, isBegonia, isSeaGod, isAsura, isTang, isPurple]);

  // Generate 42 radial explosion particles
  const radialParticles = useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => {
      const angle = (i * (360 / 42)) * (Math.PI / 180);
      const distance = 80 + Math.random() * 180;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = 4 + Math.random() * 8;
      const color = particleColors[i % particleColors.length];
      const delay = Math.random() * 0.15;
      return { id: i, x, y, size, color, delay };
    });
  }, [particleColors]);

  // God Possession Banner styling
  const getBannerStyle = () => {
    if (godPossessionTheme === '海神') return 'bg-cyan-950/95 border-cyan-300 text-cyan-100 shadow-[0_0_50px_rgba(6,182,212,1)]';
    if (godPossessionTheme === '修罗神') return 'bg-red-950/95 border-rose-500 text-rose-100 shadow-[0_0_50px_rgba(225,29,72,1)]';
    if (godPossessionTheme === '天使神') return 'bg-amber-950/95 border-yellow-300 text-yellow-100 shadow-[0_0_50px_rgba(251,191,36,1)]';
    if (godPossessionTheme === '罗刹神') return 'bg-purple-950/95 border-fuchsia-400 text-purple-100 shadow-[0_0_50px_rgba(168,85,247,1)]';
    if (godPossessionTheme === '情绪之神') return 'bg-teal-950/95 border-emerald-300 text-teal-100 shadow-[0_0_50px_rgba(20,184,166,1)]';
    if (godPossessionTheme === '至高龙神') return 'bg-gradient-to-r from-amber-950 via-yellow-900 to-emerald-950 border-amber-300 text-amber-100 shadow-[0_0_60px_rgba(245,158,11,1)]';
    if (godPossessionTheme === '海神 & 修罗双神') return 'bg-gradient-to-r from-cyan-950 via-purple-950 to-rose-950 border-amber-300 text-amber-100 shadow-[0_0_60px_rgba(245,158,11,1)]';

    if (isDragonGod) return 'bg-gradient-to-r from-amber-950 via-yellow-950 to-emerald-950 border-amber-300 text-amber-100 shadow-[0_0_45px_rgba(245,158,11,1)]';
    if (isEmotion) return 'bg-sky-950/95 border-teal-300 text-sky-100 shadow-[0_0_40px_rgba(56,189,248,1)]';
    if (isHammer) return 'bg-amber-950/90 border-amber-400 text-amber-200 shadow-[0_0_35px_rgba(251,191,36,0.95)]';
    if (isGrass) return 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_35px_rgba(52,211,153,0.95)]';
    if (isSword) return 'bg-cyan-950/90 border-cyan-300 text-cyan-100 shadow-[0_0_35px_rgba(103,232,249,0.95)]';
    if (isTiger) return 'bg-orange-950/90 border-orange-400 text-amber-100 shadow-[0_0_35px_rgba(251,146,60,0.95)]';
    if (isAngel) return 'bg-yellow-950/90 border-yellow-300 text-yellow-100 shadow-[0_0_35px_rgba(253,224,71,0.95)]';
    if (isPhoenix) return 'bg-red-950/90 border-rose-500 text-rose-100 shadow-[0_0_35px_rgba(244,63,94,0.95)]';
    if (isDragon) return 'bg-blue-950/90 border-blue-400 text-blue-100 shadow-[0_0_35px_rgba(96,165,250,0.95)]';
    if (isSpider) return 'bg-purple-950/90 border-purple-400 text-purple-200 shadow-[0_0_35px_rgba(192,132,252,0.95)]';
    if (isPagoda) return 'bg-sky-950/90 border-sky-300 text-sky-100 shadow-[0_0_35px_rgba(56,189,248,0.95)]';
    if (isBegonia) return 'bg-pink-950/90 border-pink-400 text-pink-100 shadow-[0_0_35px_rgba(244,114,182,0.95)]';
    if (isSeaGod) return 'bg-blue-950/90 border-cyan-400 text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.95)]';
    if (isAsura) return 'bg-red-950/90 border-red-500 text-red-100 shadow-[0_0_35px_rgba(239,68,68,0.95)]';
    if (isTang) return 'bg-amber-950/90 border-yellow-400 text-yellow-100 shadow-[0_0_35px_rgba(250,204,21,0.95)]';
    if (isPurple) return 'bg-indigo-950/90 border-purple-400 text-purple-100 shadow-[0_0_35px_rgba(168,85,247,0.95)]';
    return 'bg-rose-950/90 border-rose-400 text-rose-200 shadow-[0_0_35px_rgba(251,113,133,0.95)]';
  };

  // God Possession SVG Filter
  const getGodPossessionFilter = () => {
    if (!godPossessionTheme) return '';
    switch (godPossessionTheme) {
      case '海神':
        return 'drop-shadow(0 0 35px #06b6d4) hue-rotate(180deg) saturate(250%) brightness(125%)';
      case '修罗神':
        return 'drop-shadow(0 0 35px #ef4444) hue-rotate(325deg) saturate(280%) contrast(140%)';
      case '天使神':
        return 'drop-shadow(0 0 35px #f59e0b) hue-rotate(40deg) saturate(230%) brightness(130%)';
      case '罗刹神':
        return 'drop-shadow(0 0 35px #a855f7) hue-rotate(270deg) saturate(240%)';
      case '情绪之神':
        return 'drop-shadow(0 0 35px #14b8a6) hue-rotate(150deg) saturate(230%)';
      case '至高龙神':
        return 'drop-shadow(0 0 45px #f59e0b) saturate(300%) brightness(140%)';
      case '海神 & 修罗双神':
        return 'drop-shadow(0 0 40px #f59e0b) hue-rotate(210deg) saturate(270%) brightness(140%)';
      default:
        return 'drop-shadow(0 0 30px #f59e0b)';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key={activeFx.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onAnimationComplete={onAnimationComplete}
        style={{ filter: getGodPossessionFilter() }}
        className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center overflow-hidden transition-all duration-500"
      >
        {/* Fullscreen Radial Screen Flash Aura */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.3, 1.5] }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 bg-radial from-amber-500/20 via-rose-500/10 to-transparent mix-blend-screen pointer-events-none"
        />

        {/* Rotating Concentric Magic Array / Soul Ring Halo in Center */}
        <motion.div
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{ scale: [0, 1.1, 1], rotate: 180, opacity: [0, 0.85, 0] }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="absolute w-80 h-80 md:w-96 md:h-96 rounded-full border-2 border-dashed border-amber-300/60 shadow-[0_0_50px_rgba(245,158,11,0.5)] flex items-center justify-center pointer-events-none"
        >
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-sky-400/50 animate-spin" />
          <div className="w-48 h-48 md:w-60 md:h-60 rounded-full border-2 border-dashed border-rose-500/50 animate-ping" />
        </motion.div>

        {/* Exploding Radial Particle System */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {radialParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{
                x: p.x * 1.5,
                y: p.y * 1.5,
                scale: [0, 1.8, 0],
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: 1.0,
                delay: p.delay,
                ease: 'easeOut'
              }}
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: '50%',
                boxShadow: `0 0 12px ${p.color}`
              }}
              className="absolute"
            />
          ))}
        </div>

        {/* Dynamic Skill Announcement Banner */}
        <motion.div
          initial={{ y: -50, scale: 0.5, opacity: 0 }}
          animate={{ y: [-50, 0, 0, -20], scale: [0.5, 1.2, 1, 0.9], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1], ease: 'easeOut' }}
          className="absolute top-6 z-50 flex flex-col items-center justify-center"
        >
          <div className={`px-8 py-3 rounded-2xl border-2 backdrop-blur-lg shadow-2xl flex items-center gap-3.5 ${getBannerStyle()}`}>
            {godPossessionTheme && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black animate-pulse shadow-md">
                ⚡ {godPossessionTheme}神力压制
              </span>
            )}
            <span className="text-xs uppercase tracking-widest font-black opacity-85 text-amber-200">【{soulName || '武魂奥义'}】</span>
            <span className="text-xl md:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-yellow-300 drop-shadow">
              {skillName}
            </span>
            {isCrit && (
              <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-rose-500 text-white font-black animate-bounce shadow-lg flex items-center gap-1">
                💥 暴击撕裂
              </span>
            )}
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* 0. DRAGON GOD NINE-COLOR SPEAR (至高龙神/龙神枪) */}
        {/* ========================================================= */}
        {isDragonGod && (
          <motion.svg viewBox="0 0 500 500" className="w-full h-full max-w-lg max-h-lg">
            <defs>
              <linearGradient id="dragonGodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="75%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <filter id="glowNineColor" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Nine Color Rainbow Halo */}
            <motion.circle
              cx="250"
              cy="250"
              r="170"
              fill="none"
              stroke="url(#dragonGodGrad)"
              strokeWidth="8"
              strokeDasharray="15 8"
              filter="url(#glowNineColor)"
              initial={{ scale: 0.2, rotate: 0 }}
              animate={{ scale: [0.2, 1.25, 1.4], rotate: 360, opacity: [0, 1, 0] }}
              transition={{ duration: 1.3, ease: 'easeOut' }}
            />
            {/* Dragon Spear Vertical Shaft */}
            <motion.path
              d="M 250 20 L 250 480 M 230 100 L 250 20 L 270 100 M 210 200 L 290 200"
              fill="none"
              stroke="url(#dragonGodGrad)"
              strokeWidth="9"
              strokeLinecap="round"
              filter="url(#glowNineColor)"
              initial={{ pathLength: 0, y: -60 }}
              animate={{ pathLength: 1, y: 0, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
            {/* Dragon Wings Spread */}
            <motion.path
              d="M 250 200 Q 120 80 20 180 Q 150 240 250 220 Q 350 240 480 180 Q 380 80 250 200 Z"
              fill="none"
              stroke="#fef08a"
              strokeWidth="6"
              filter="url(#glowNineColor)"
              initial={{ pathLength: 0, scale: 0.6 }}
              animate={{ pathLength: 1, scale: [0.6, 1.1, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 1.0, delay: 0.2 }}
            />
          </motion.svg>
        )}

        {/* ========================================================= */}
        {/* 0.5 EMOTION GOD ICE EXPLOSION (情绪之神/浩冬冰爆) */}
        {/* ========================================================= */}
        {isEmotion && (
          <motion.svg viewBox="0 0 500 500" className="w-full h-full max-w-lg max-h-lg">
            <defs>
              <linearGradient id="emotionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
              <filter id="glowIce" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Frost Crystal Snowflake Starburst */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x2 = 250 + Math.cos(rad) * 180;
              const y2 = 250 + Math.sin(rad) * 180;
              return (
                <motion.line
                  key={i}
                  x1="250"
                  y1="250"
                  x2={x2}
                  y2={y2}
                  stroke="url(#emotionGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter="url(#glowIce)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.03 }}
                />
              );
            })}
            {/* Spirit Eye Contour */}
            <motion.ellipse
              cx="250"
              cy="250"
              rx="160"
              ry="90"
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="5"
              filter="url(#glowIce)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 0.9, delay: 0.2 }}
            />
          </motion.svg>
        )}

        {/* ========================================================= */}
        {/* 1. CLEAR SKY HAMMER SVG PATH (昊天锤/大须弥锤/碎星击) */}
        {/* ========================================================= */}
        {isHammer && (
          <motion.svg viewBox="0 0 500 500" className="w-full h-full max-w-lg max-h-lg">
            <defs>
              <linearGradient id="hammerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#9a3412" />
              </linearGradient>
              <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Giant Hammer Head Silhouette */}
            <motion.path
              d="M 170 100 L 330 100 L 350 180 L 150 180 Z"
              fill="none"
              stroke="url(#hammerGrad)"
              strokeWidth="8"
              filter="url(#glowGold)"
              initial={{ pathLength: 0, scale: 0.7, y: -50 }}
              animate={{ pathLength: 1, scale: [0.7, 1.1, 1], y: [-50, 0, 0] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            {/* Hammer Shaft */}
            <motion.path
              d="M 250 180 L 250 380"
              fill="none"
              stroke="url(#hammerGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              filter="url(#glowGold)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            />
            {/* Ground Fissure Crack Lines */}
            <motion.path
              d="M 250 380 L 120 460 M 250 380 L 380 460 M 250 380 L 250 480 M 250 380 L 80 390 M 250 380 L 420 390"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="4"
              filter="url(#glowGold)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 0.9, delay: 0.3 }}
            />
            {/* Impact Lightning Bolts */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x2 = 250 + Math.cos(rad) * 170;
              const y2 = 250 + Math.sin(rad) * 170;
              return (
                <motion.line
                  key={i}
                  x1="250"
                  y1="250"
                  x2={x2}
                  y2={y2}
                  stroke="#fef08a"
                  strokeWidth="3.5"
                  strokeDasharray="10 5"
                  filter="url(#glowGold)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.04 }}
                />
              );
            })}
            {/* Expanding Impact Shock Ring */}
            <motion.circle
              cx="250"
              cy="250"
              r="150"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="5"
              filter="url(#glowGold)"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.2, 1.3, 1.6], opacity: [0, 1, 0] }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          </motion.svg>
        )}

        {/* ========================================================= */}
        {/* 2. BLUE SILVER EMPEROR / VINES SVG PATH (蓝银皇/缠绕/突刺) */}
        {/* ========================================================= */}
        {isGrass && (
          <motion.svg viewBox="0 0 500 500" className="w-full h-full max-w-lg max-h-lg">
            <defs>
              <linearGradient id="grassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <filter id="glowGreen" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Intertwining Spiraling Vines */}
            <motion.path
              d="M 50 450 Q 200 350 150 250 T 350 150 Q 400 80 450 50"
              fill="none"
              stroke="url(#grassGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              filter="url(#glowGreen)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 450 450 Q 300 350 350 250 T 150 150 Q 100 80 50 50"
              fill="none"
              stroke="url(#grassGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              filter="url(#glowGreen)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.1, delay: 0.15, ease: 'easeInOut' }}
            />
            {/* Hexagonal Vine Cage Matrix */}
            <motion.polygon
              points="250,100 380,175 380,325 250,400 120,325 120,175"
              fill="none"
              stroke="#34d399"
              strokeWidth="4"
              strokeDasharray="12 6"
              filter="url(#glowGreen)"
              initial={{ pathLength: 0, scale: 0.8 }}
              animate={{ pathLength: 1, scale: [0.8, 1, 1.05], opacity: [0, 1, 0] }}
              transition={{ duration: 1.0, delay: 0.3 }}
            />
          </motion.svg>
        )}

        {/* ========================================================= */}
        {/* 3. SEVEN KILL SWORD / SWORD RAIN SVG PATH (七杀剑/万剑归宗) */}
        {/* ========================================================= */}
        {isSword && (
          <motion.svg viewBox="0 0 500 500" className="w-full h-full max-w-lg max-h-lg">
            <defs>
              <linearGradient id="swordGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <filter id="glowCyan" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Main Giant Sword Blade Vertical Path */}
            <motion.path
              d="M 250 40 L 250 420 M 230 100 L 250 40 L 270 100 M 210 380 L 290 380"
              fill="none"
              stroke="url(#swordGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              filter="url(#glowCyan)"
              initial={{ pathLength: 0, y: -40 }}
              animate={{ pathLength: 1, y: 0, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            {/* 7 Star Formation Flying Sword Trails */}
            {[0, 51, 102, 153, 204, 255, 306].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 250 + Math.cos(rad) * 180;
              const y1 = 250 + Math.sin(rad) * 180;
              return (
                <motion.line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2="250"
                  y2="250"
                  stroke="#7dd3fc"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#glowCyan)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.05 }}
                />
              );
            })}
            {/* Razor Diagonal Slash Cross Trails */}
            <motion.path
              d="M 80 100 L 420 400 M 420 100 L 80 400"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="5"
              filter="url(#glowCyan)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
          </motion.svg>
        )}

        {/* ========================================================= */}
        {/* 4. EVIL EYE WHITE TIGER / BEAST CLAW SVG PATH (邪眸白虎/爪击) */}
        {/* ========================================================= */}
        {isTiger && (
          <motion.svg viewBox="0 0 500 500" className="w-full h-full max-w-lg max-h-lg">
            <defs>
              <linearGradient id="tigerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffedd5" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <filter id="glowOrange" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 3 Heavy Claw Slash Diagonal Paths */}
            <motion.path
              d="M 100 80 L 400 420"
              fill="none"
              stroke="url(#tigerGrad)"
              strokeWidth="9"
              strokeLinecap="round"
              filter="url(#glowOrange)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.path
              d="M 150 60 L 450 400"
              fill="none"
              stroke="url(#tigerGrad)"
              strokeWidth="11"
              strokeLinecap="round"
              filter="url(#glowOrange)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            />
            <motion.path
              d="M 50 100 L 350 440"
              fill="none"
              stroke="url(#tigerGrad)"
              strokeWidth="9"
              strokeLinecap="round"
              filter="url(#glowOrange)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            />
          </motion.svg>
        )}

        {/* ========================================================= */}
        {/* 5. SERAPHIM / HOLY SUN WINGS SVG PATH (六翼天使/天使神光) */}
        {/* ========================================================= */}
        {isAngel && (
          <motion.svg viewBox="0 0 500 500" className="w-full h-full max-w-lg max-h-lg">
            <defs>
              <linearGradient id="angelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#a16207" />
              </linearGradient>
              <filter id="glowYellow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Left Wing Layers */}
            <motion.path
              d="M 250 250 C 180 130, 60 100, 30 180 C 80 230, 180 260, 250 250"
              fill="none"
              stroke="url(#angelGrad)"
              strokeWidth="6"
              filter="url(#glowYellow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
            />
            {/* Right Wing Layers */}
            <motion.path
              d="M 250 250 C 320 130, 440 100, 470 180 C 420 230, 320 260, 250 250"
              fill="none"
              stroke="url(#angelGrad)"
              strokeWidth="6"
              filter="url(#glowYellow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
            />
            {/* Central Vertical Holy Beam */}
            <motion.path
              d="M 250 30 L 250 470"
              fill="none"
              stroke="#fde047"
              strokeWidth="8"
              filter="url(#glowYellow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.svg>
        )}

        {/* ========================================================= */}
        {/* 6. EVIL FIRE PHOENIX SVG PATH (邪火凤凰/涅槃火) */}
        {/* ========================================================= */}
        {isPhoenix && (
          <motion.svg viewBox="0 0 500 500" className="w-full h-full max-w-lg max-h-lg">
            <defs>
              <linearGradient id="phoenixGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fecdd3" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
              <filter id="glowRed" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Soaring Phoenix Wing Outlines */}
            <motion.path
              d="M 250 350 Q 150 200 50 100 Q 180 180 250 220 Q 320 180 450 100 Q 350 200 250 350 Z"
              fill="none"
              stroke="url(#phoenixGrad)"
              strokeWidth="6"
              filter="url(#glowRed)"
              initial={{ pathLength: 0, scale: 0.6 }}
              animate={{ pathLength: 1, scale: [0.6, 1.1, 1], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          </motion.svg>
        )}

        {/* ========================================================= */}
        {/* 7. BLUE LIGHTNING DRAGON SVG PATH (蓝电霸王龙/雷霆破) */}
        {/* ========================================================= */}
        {isDragon && (
          <motion.svg viewBox="0 0 500 500" className="w-full h-full max-w-lg max-h-lg">
            <defs>
              <linearGradient id="dragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dbeafe" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
              <filter id="glowBlue" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Jagged Lightning Bolts from Sky */}
            <motion.path
              d="M 80 20 L 150 160 L 120 220 L 250 480 M 420 20 L 350 160 L 380 220 L 250 480"
              fill="none"
              stroke="url(#dragonGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#glowBlue)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          </motion.svg>
        )}

        {/* ========================================================= */}
        {/* 11. SEA GOD TRIDENT / OCEAN STORM SVG PATH (海神三叉戟/无定风波) */}
        {/* ========================================================= */}
        {isSeaGod && (
          <motion.svg viewBox="0 0 500 500" className="w-full h-full max-w-lg max-h-lg">
            <defs>
              <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cff4fc" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <filter id="glowCyanSea" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Trident Prongs Path */}
            <motion.path
              d="M 250 60 L 250 420 M 180 120 L 180 220 Q 180 280 250 280 Q 320 280 320 220 L 320 120"
              fill="none"
              stroke="url(#seaGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              filter="url(#glowCyanSea)"
              initial={{ pathLength: 0, y: -30 }}
              animate={{ pathLength: 1, y: 0, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
            />
          </motion.svg>
        )}

        {/* ========================================================= */}
        {/* 12. ASURA GOD SWORD / BLOOD DOMAIN SVG PATH (修罗神剑/杀气) */}
        {/* ========================================================= */}
        {isAsura && (
          <motion.svg viewBox="0 0 500 500" className="w-full h-full max-w-lg max-h-lg">
            <defs>
              <linearGradient id="asuraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
              <filter id="glowAsura" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="9" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Asura Crimson Sword Slash */}
            <motion.path
              d="M 250 30 L 250 450 M 150 280 L 350 280"
              fill="none"
              stroke="url(#asuraGrad)"
              strokeWidth="9"
              strokeLinecap="round"
              filter="url(#glowAsura)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </motion.svg>
        )}

        {/* Fallback General Burst */}
        {!isDragonGod && !isEmotion && !isHammer && !isGrass && !isSword && !isTiger && !isAngel && !isPhoenix && !isDragon && !isSeaGod && !isAsura && (
          <motion.svg viewBox="0 0 500 500" className="w-full h-full max-w-lg max-h-lg">
            <defs>
              <linearGradient id="genGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fecdd3" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#9f1239" />
              </linearGradient>
              <filter id="glowGeneral" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Cross Blade Slashes */}
            <motion.path
              d="M 100 100 L 400 400 M 400 100 L 100 400"
              fill="none"
              stroke="url(#genGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#glowGeneral)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            {/* Concentric Burst Shock Ring */}
            <motion.circle
              cx="250"
              cy="250"
              r="135"
              fill="none"
              stroke="#fb7185"
              strokeWidth="5"
              strokeDasharray="12 6"
              filter="url(#glowGeneral)"
              initial={{ scale: 0.3 }}
              animate={{ scale: [0.3, 1.35], opacity: [0, 1, 0] }}
              transition={{ duration: 1.0, delay: 0.2 }}
            />
          </motion.svg>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
