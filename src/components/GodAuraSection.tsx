import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player } from '../types/game';
import { Crown, Sparkles, Shield, Swords, Heart, Zap, Flame, Waves, Sun, Skull, ArrowRight, Award } from 'lucide-react';
import { SoundEngine } from '../utils/audio';

export type GodPositionType = '海神' | '修罗神' | '天使神' | '罗刹神' | '情绪之神' | '至高龙神' | '海神 & 修罗双神';

export interface GodAuraConfig {
  id: GodPositionType;
  title: string;
  subtitle: string;
  element: string;
  primaryColor: string; // CSS gradient class
  borderColor: string;
  glowShadow: string;
  badgeBg: string;
  gradientText: string;
  icon: React.ReactNode;
  lore: string;
  percentBoosts: {
    atkPct: number;
    hpPct: number;
    defPct: number;
    speedPct?: number;
    critRateBonus?: number;
    critDmgBonus?: number;
    penetrationBonus?: number;
  };
  specialEffectName: string;
  specialEffectDesc: string;
  particles: {
    colors: string[];
    count: number;
    glowColor: string;
  };
  auraDiffusionColor: string;
  auraBgGradient: string;
}

export const GOD_AURA_CONFIGS: Record<GodPositionType, GodAuraConfig> = {
  '海神': {
    id: '海神',
    title: '海神 · 瀚海至尊',
    subtitle: '主宰无垠汪洋 · 掌控海神三叉戟',
    element: '海洋神力',
    primaryColor: 'from-cyan-500 via-blue-600 to-teal-400',
    borderColor: 'border-cyan-400/60',
    glowShadow: 'shadow-[0_0_30px_rgba(6,182,212,0.6)]',
    badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50',
    gradientText: 'from-cyan-300 via-blue-200 to-teal-200',
    icon: <Waves className="w-5 h-5 text-cyan-300" />,
    lore: '承载海神大能，十万八千斤海神三叉戟重逾千钧。巨浪怒号，万兽臣服。',
    percentBoosts: {
      atkPct: 80,
      hpPct: 80,
      defPct: 80,
      speedPct: 30,
      critRateBonus: 20
    },
    specialEffectName: '瀚海护体与神辉波纹',
    specialEffectDesc: '受到伤害时触发瀚海护罩减伤30%，且每回合恢复15%最大生命',
    particles: {
      colors: ['bg-cyan-300', 'bg-blue-500', 'bg-teal-300', 'bg-sky-400', 'bg-amber-300', 'bg-cyan-200'],
      count: 18,
      glowColor: 'rgba(6,182,212,0.85)'
    },
    auraDiffusionColor: 'rgba(6,182,212,0.5)',
    auraBgGradient: 'from-cyan-950/40 via-blue-950/25 to-slate-950/90'
  },
  '修罗神': {
    id: '修罗神',
    title: '修罗神 · 杀戮执法者',
    subtitle: '掌控至高杀戮秩序 · 挥舞修罗血魔剑',
    element: '杀戮神威',
    primaryColor: 'from-rose-600 via-red-600 to-amber-600',
    borderColor: 'border-rose-500/60',
    glowShadow: 'shadow-[0_0_30px_rgba(225,29,72,0.6)]',
    badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
    gradientText: 'from-rose-300 via-red-200 to-amber-200',
    icon: <Swords className="w-5 h-5 text-rose-300" />,
    lore: '神界五大至高神王之一，杀罚无双，剑指苍穹，凌驾万界规则之上。',
    percentBoosts: {
      atkPct: 100,
      hpPct: 50,
      defPct: 50,
      critRateBonus: 35,
      critDmgBonus: 50,
      penetrationBonus: 40
    },
    specialEffectName: '修罗杀意无双真伤',
    specialEffectDesc: '攻击必定附加30%无视所有防御的神性真实伤害，暴击伤害极大幅提升',
    particles: {
      colors: ['bg-rose-500', 'bg-red-600', 'bg-purple-500', 'bg-amber-500', 'bg-rose-400', 'bg-fuchsia-600'],
      count: 18,
      glowColor: 'rgba(225,29,72,0.85)'
    },
    auraDiffusionColor: 'rgba(225,29,72,0.5)',
    auraBgGradient: 'from-rose-950/40 via-red-950/25 to-slate-950/90'
  },
  '天使神': {
    id: '天使神',
    title: '天使神 · 炽黄光明',
    subtitle: '信仰之光 · 太阳真火与天使圣剑',
    element: '光明神圣',
    primaryColor: 'from-amber-400 via-yellow-500 to-orange-400',
    borderColor: 'border-amber-400/60',
    glowShadow: 'shadow-[0_0_30px_rgba(251,191,36,0.6)]',
    badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
    gradientText: 'from-amber-200 via-yellow-100 to-amber-300',
    icon: <Sun className="w-5 h-5 text-amber-300" />,
    lore: '集苍生信仰而成的光明主神，六翼翱翔，太阳真火净化一切邪煞与阴霾。',
    percentBoosts: {
      atkPct: 85,
      hpPct: 60,
      defPct: 70,
      speedPct: 50,
      critRateBonus: 25
    },
    specialEffectName: '太阳真火与神圣净化',
    specialEffectDesc: '免疫负面控制效果，全回合附带40%光明净化伤害，对邪恶目标伤害加倍',
    particles: {
      colors: ['bg-amber-300', 'bg-yellow-200', 'bg-amber-400', 'bg-yellow-100', 'bg-white', 'bg-orange-300'],
      count: 18,
      glowColor: 'rgba(251,191,36,0.85)'
    },
    auraDiffusionColor: 'rgba(251,191,36,0.5)',
    auraBgGradient: 'from-amber-950/40 via-yellow-950/25 to-slate-950/90'
  },
  '罗刹神': {
    id: '罗刹神',
    title: '罗刹神 · 幽冥噬魂',
    subtitle: '掌控邪煞阴毒 · 罗刹魔镰断阴阳',
    element: '幽冥邪煞',
    primaryColor: 'from-purple-600 via-fuchsia-600 to-indigo-600',
    borderColor: 'border-purple-400/60',
    glowShadow: 'shadow-[0_0_30px_rgba(168,85,247,0.6)]',
    badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-500/50',
    gradientText: 'from-purple-300 via-fuchsia-200 to-indigo-200',
    icon: <Skull className="w-5 h-5 text-purple-300" />,
    lore: '主宰死亡与邪煞的尊贵主神，九首蛛皇幽冥魔毒，吞噬世间一切怨念生灵。',
    percentBoosts: {
      atkPct: 90,
      hpPct: 60,
      defPct: 60,
      critDmgBonus: 45
    },
    specialEffectName: '噬魂蛛毒与生命吸取',
    specialEffectDesc: '造成的伤害转化为25%生命恢复，并使目标陷入剧毒削弱防御',
    particles: {
      colors: ['bg-purple-500', 'bg-fuchsia-500', 'bg-emerald-400', 'bg-indigo-400', 'bg-violet-300', 'bg-teal-400'],
      count: 18,
      glowColor: 'rgba(168,85,247,0.85)'
    },
    auraDiffusionColor: 'rgba(168,85,247,0.5)',
    auraBgGradient: 'from-purple-950/40 via-fuchsia-950/25 to-slate-950/90'
  },
  '海神 & 修罗双神': {
    id: '海神 & 修罗双神',
    title: '双神一体 · 至高神王法相',
    subtitle: '海神瀚海防御 + 修罗无双斩杀双重共存',
    element: '海面与杀戮兼备',
    primaryColor: 'from-cyan-400 via-purple-600 to-rose-600',
    borderColor: 'border-amber-300/80',
    glowShadow: 'shadow-[0_0_40px_rgba(245,158,11,0.8)]',
    badgeBg: 'bg-gradient-to-r from-cyan-950 to-rose-950 text-amber-200 border-amber-400/60',
    gradientText: 'from-cyan-300 via-amber-200 to-rose-300',
    icon: <Crown className="w-5 h-5 text-amber-300" />,
    lore: '双生武魂极限共鸣，一人承接双神位格！瀚海之力护体，修罗魔剑斩神灭魔！',
    percentBoosts: {
      atkPct: 150,
      hpPct: 120,
      defPct: 120,
      speedPct: 60,
      critRateBonus: 45,
      critDmgBonus: 80,
      penetrationBonus: 50
    },
    specialEffectName: '双神一体共鸣增幅',
    specialEffectDesc: '全战斗终极伤害提升100%，具备海神无敌护罩与修罗无双斩手双重神威',
    particles: {
      colors: ['bg-cyan-300', 'bg-rose-500', 'bg-amber-300', 'bg-blue-500', 'bg-red-600', 'bg-purple-400', 'bg-teal-300'],
      count: 22,
      glowColor: 'rgba(245,158,11,0.9)'
    },
    auraDiffusionColor: 'rgba(245,158,11,0.6)',
    auraBgGradient: 'from-cyan-950/40 via-purple-950/35 to-rose-950/40'
  },
  '情绪之神': {
    id: '情绪之神',
    title: '情绪之神 · 灵眸浩冬',
    subtitle: '掌控七情六欲 · 掌控永恒之眼与浩冬神光',
    element: '情绪精神',
    primaryColor: 'from-sky-500 via-teal-500 to-indigo-500',
    borderColor: 'border-sky-400/60',
    glowShadow: 'shadow-[0_0_30px_rgba(56,189,248,0.6)]',
    badgeBg: 'bg-sky-950/80 text-sky-300 border-sky-500/50',
    gradientText: 'from-sky-300 via-teal-200 to-indigo-200',
    icon: <Sparkles className="w-5 h-5 text-sky-300" />,
    lore: '融念冰神位传承，掌控人间七情六欲，浩冬冰爆与死灵法术降临。',
    percentBoosts: {
      atkPct: 95,
      hpPct: 70,
      defPct: 70,
      speedPct: 40,
      critRateBonus: 30,
      critDmgBonus: 40
    },
    specialEffectName: '浩冬冰爆与情绪震慑',
    specialEffectDesc: '全技能附带冰冻控制与情绪威压，降低敌方全伤害25%',
    particles: {
      colors: ['bg-sky-300', 'bg-teal-300', 'bg-indigo-300', 'bg-cyan-200', 'bg-white'],
      count: 18,
      glowColor: 'rgba(56,189,248,0.85)'
    },
    auraDiffusionColor: 'rgba(56,189,248,0.5)',
    auraBgGradient: 'from-sky-950/40 via-teal-950/25 to-slate-950/90'
  },
  '至高龙神': {
    id: '至高龙神',
    title: '至高龙神 · 万龙至尊',
    subtitle: '融合金银龙王 · 执掌超神器龙神枪与九彩元素',
    element: '宇宙创生与毁灭',
    primaryColor: 'from-amber-400 via-yellow-500 to-emerald-400',
    borderColor: 'border-amber-300/80',
    glowShadow: 'shadow-[0_0_40px_rgba(245,158,11,0.8)]',
    badgeBg: 'bg-amber-950/90 text-amber-200 border-amber-400/60',
    gradientText: 'from-amber-200 via-yellow-100 to-emerald-200',
    icon: <Crown className="w-5 h-5 text-amber-300" />,
    lore: '斗罗宇宙第一至高神王！万龙之祖，执掌龙神枪与九彩龙神核，统御诸天浩瀚龙界。',
    percentBoosts: {
      atkPct: 180,
      hpPct: 150,
      defPct: 150,
      speedPct: 80,
      critRateBonus: 50,
      critDmgBonus: 100,
      penetrationBonus: 60
    },
    specialEffectName: '龙神九彩灭世风暴',
    specialEffectDesc: '攻击必定破防，造成双倍九彩元素湮灭伤害，暴击率与全抗性极致增幅',
    particles: {
      colors: ['bg-amber-300', 'bg-yellow-200', 'bg-emerald-300', 'bg-cyan-300', 'bg-rose-400', 'bg-purple-300'],
      count: 24,
      glowColor: 'rgba(245,158,11,0.9)'
    },
    auraDiffusionColor: 'rgba(245,158,11,0.6)',
    auraBgGradient: 'from-amber-950/50 via-yellow-950/35 to-emerald-950/90'
  }
};

export interface ClickRippleData {
  id: number;
  x: number;
  y: number;
  color: string;
  glowColor: string;
  tag: string;
  godPosition?: GodPositionType | null;
}

/**
 * Divine God Statue Silhouette Vector SVG Component (神像法相虚影)
 * Renders majestic glowing silhouettes for Sea God, Asura, Angel, Rakshasa, and Dual Gods
 */
export const GodStatuePhantomSVG: React.FC<{
  godPosition?: GodPositionType | null;
  className?: string;
  glowColor?: string;
}> = ({ godPosition, className = "w-20 h-28" }) => {
  const god = godPosition || '海神';

  if (god === '海神') {
    return (
      <svg viewBox="0 0 100 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="seaGodGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Divine Aura Sun Ring behind */}
        <circle cx="50" cy="40" r="28" stroke="url(#seaGrad)" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" filter="url(#seaGodGlow)" />
        <circle cx="50" cy="40" r="34" stroke="#38bdf8" strokeWidth="1" opacity="0.5" />
        {/* Crown & Head */}
        <path d="M42 22 L50 12 L58 22 L55 26 L45 26 Z" fill="#67e8f9" opacity="0.9" />
        <circle cx="50" cy="30" r="7" fill="#38bdf8" />
        {/* Body Silhouette */}
        <path d="M40 38 Q50 35 60 38 L68 75 Q50 82 32 75 Z" fill="url(#seaGrad)" opacity="0.85" />
        <path d="M35 75 L28 120 L72 120 L65 75 Z" fill="url(#seaGrad)" opacity="0.6" />
        {/* Trident Central Pole & Blades */}
        <path d="M50 8 L50 132" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" filter="url(#seaGodGlow)" />
        <path d="M36 22 C36 40 40 46 50 46 C60 46 64 40 64 22" stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M36 18 L36 25 M64 18 L64 25 M50 5 L50 14" stroke="#a5f3fc" strokeWidth="3" strokeLinecap="round" />
        {/* Sea Waves wings */}
        <path d="M22 45 Q10 35 5 55 Q20 62 38 52" fill="#0284c7" opacity="0.5" />
        <path d="M78 45 Q90 35 95 55 Q80 62 62 52" fill="#0284c7" opacity="0.5" />
      </svg>
    );
  }

  if (god === '修罗神') {
    return (
      <svg viewBox="0 0 100 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="asuraGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="asuraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#dc2626" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#881337" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Killing Spiked Halo */}
        <path d="M50 10 L54 28 L68 18 L62 34 L78 36 L66 48 L80 58 L63 62 L70 78 L54 70 L50 88 L46 70 L30 78 L37 62 L20 58 L34 48 L22 36 L38 34 L32 18 L46 28 Z" fill="#9f1239" opacity="0.35" />
        {/* Head with Asura Horns */}
        <path d="M38 20 L50 12 L62 20 L58 32 L42 32 Z" fill="#fda4af" opacity="0.9" />
        <path d="M34 18 Q25 8 20 18 Q30 22 37 24 Z" fill="#f43f5e" />
        <path d="M66 18 Q75 8 80 18 Q70 22 63 24 Z" fill="#f43f5e" />
        {/* Body Armor */}
        <path d="M35 34 Q50 30 65 34 L72 75 Q50 82 28 75 Z" fill="url(#asuraGrad)" opacity="0.85" />
        <path d="M30 75 L22 122 L78 122 L70 75 Z" fill="url(#asuraGrad)" opacity="0.6" />
        {/* Dual Asura Blood Blades */}
        <path d="M22 10 L30 85 M78 10 L70 85" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" filter="url(#asuraGlow)" />
        <path d="M22 10 L18 25 M78 10 L82 25" stroke="#ffe4e6" strokeWidth="2.5" />
      </svg>
    );
  }

  if (god === '天使神') {
    return (
      <svg viewBox="0 0 100 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="angelGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="angelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Sun Wheel Halo */}
        <circle cx="50" cy="38" r="28" stroke="#fde047" strokeWidth="2" strokeDasharray="4 2" opacity="0.8" filter="url(#angelGlow)" />
        {/* 6 Seraph Wings */}
        <path d="M48 35 C30 15 10 10 2 25 C18 35 35 40 46 42 Z" fill="#fef08a" opacity="0.85" />
        <path d="M52 35 C70 15 90 10 98 25 C82 35 65 40 54 42 Z" fill="#fef08a" opacity="0.85" />
        <path d="M46 42 C25 35 5 45 2 65 C20 62 38 52 46 48 Z" fill="#fde047" opacity="0.75" />
        <path d="M54 42 C75 35 95 45 98 65 C80 62 62 52 54 48 Z" fill="#fde047" opacity="0.75" />
        <path d="M46 48 C30 55 12 75 18 95 C30 80 40 65 48 55 Z" fill="#f59e0b" opacity="0.65" />
        <path d="M54 48 C70 55 88 75 82 95 C70 80 60 65 52 55 Z" fill="#f59e0b" opacity="0.65" />
        {/* Head & Crown */}
        <circle cx="50" cy="28" r="7" fill="#fef08a" />
        <path d="M44 20 L50 10 L56 20 Z" fill="#ffffff" />
        {/* Body & Sacred Sword */}
        <path d="M42 36 L58 36 L64 80 L36 80 Z" fill="url(#angelGrad)" opacity="0.8" />
        <path d="M50 15 L50 125" stroke="#ffffff" strokeWidth="2.5" filter="url(#angelGlow)" />
        <path d="M40 45 L60 45" stroke="#fef08a" strokeWidth="2" />
      </svg>
    );
  }

  if (god === '罗刹神') {
    return (
      <svg viewBox="0 0 100 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="rakshasaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="rakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#9333ea" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* 8 Spider Spikes */}
        <path d="M45 40 Q20 15 5 30 Q22 42 42 48" stroke="#a855f7" strokeWidth="2.5" fill="none" />
        <path d="M55 40 Q80 15 95 30 Q78 42 58 48" stroke="#a855f7" strokeWidth="2.5" fill="none" />
        <path d="M45 50 Q15 35 2 60 Q25 58 43 55" stroke="#34d399" strokeWidth="2" fill="none" />
        <path d="M55 50 Q85 35 98 60 Q75 58 57 55" stroke="#34d399" strokeWidth="2" fill="none" />
        {/* Rakshasa Scythe Curve */}
        <path d="M20 15 C40 0 70 5 85 25 C70 20 45 20 30 35 Z" fill="#e879f9" opacity="0.85" filter="url(#rakshasaGlow)" />
        <path d="M25 20 L25 125" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
        {/* Goddess Body */}
        <circle cx="50" cy="30" r="7" fill="#e879f9" />
        <path d="M40 38 L60 38 L66 82 L34 82 Z" fill="url(#rakGrad)" opacity="0.8" />
      </svg>
    );
  }

  if (god === '至高龙神') {
    return (
      <svg viewBox="0 0 100 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="dragonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="dragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#facc15" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* Nine-Color Nine-Ring Dragon Aura Halo */}
        <circle cx="50" cy="40" r="32" stroke="url(#dragonGrad)" strokeWidth="3" strokeDasharray="5 2" opacity="0.9" filter="url(#dragonGlow)" />
        <circle cx="50" cy="40" r="38" stroke="#fef08a" strokeWidth="1.5" opacity="0.6" />
        {/* Majestic Dragon Wings/Horns */}
        <path d="M48 28 Q20 5 2 22 Q25 32 45 36 Z" fill="#fde047" opacity="0.9" filter="url(#dragonGlow)" />
        <path d="M52 28 Q80 5 98 22 Q75 32 55 36 Z" fill="#fde047" opacity="0.9" filter="url(#dragonGlow)" />
        <path d="M46 38 Q15 35 5 58 Q28 55 45 46 Z" fill="#34d399" opacity="0.8" />
        <path d="M54 38 Q85 35 95 58 Q72 55 55 46 Z" fill="#38bdf8" opacity="0.8" />
        {/* Dragon Spear Central Artifact */}
        <path d="M50 4 L50 134" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" filter="url(#dragonGlow)" />
        <path d="M42 22 L50 4 L58 22 L50 28 Z" fill="#f59e0b" filter="url(#dragonGlow)" />
        {/* Dragon King Body Silhouette */}
        <circle cx="50" cy="28" r="8" fill="#fef08a" />
        <path d="M40 38 Q50 34 60 38 L68 85 Q50 92 32 85 Z" fill="url(#dragonGrad)" opacity="0.9" />
      </svg>
    );
  }

  // Dual Gods or Default
  return (
    <svg viewBox="0 0 100 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="dualGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="dualGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* Supreme Cosmic Ring */}
      <circle cx="50" cy="40" r="32" stroke="url(#dualGrad)" strokeWidth="2.5" strokeDasharray="6 3" opacity="0.9" filter="url(#dualGlow)" />
      {/* Trident Left, Sword Right */}
      <path d="M30 10 L30 125" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 20 C22 32 25 36 30 36 C35 36 38 32 38 20" stroke="#67e8f9" strokeWidth="2" fill="none" />
      <path d="M70 10 L70 125" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 40 L80 40" stroke="#fda4af" strokeWidth="2" />
      {/* Crown & Supreme Body */}
      <path d="M40 20 L50 10 L60 20 L55 25 L45 25 Z" fill="#fef08a" />
      <circle cx="50" cy="30" r="8" fill="#fbbf24" />
      <path d="M36 38 Q50 34 64 38 L70 85 Q50 92 30 85 Z" fill="url(#dualGrad)" opacity="0.85" />
    </svg>
  );
};

/**
 * Concentric Halo Diffusion Wave Rings
 * Creates continuous radiating light waves expanding outward
 */
export const HaloDiffusionRipples: React.FC<{
  borderColor: string;
  glowColor: string;
}> = ({ borderColor, glowColor }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.7, opacity: 0.8 }}
          animate={{
            scale: [0.7, 1.6, 2.5],
            opacity: [0.8, 0.4, 0]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            delay: i * 1.1,
            ease: 'easeOut'
          }}
          style={{
            boxShadow: `0 0 30px ${glowColor}`
          }}
          className={`absolute w-32 h-32 rounded-full border-2 ${borderColor}`}
        />
      ))}
    </div>
  );
};

/**
 * Click-triggered Expanding Ripple Wave Overlay & Surrounding God Statue Phantoms (神像虚影 · 神位威压)
 * Renders outward expanding multi-layered concentric rings, 3D atmospheric distortion, sparkle bursts, and temporary Fade-out God Statue Phantoms
 */
export const ClickRippleOverlay: React.FC<{
  ripples: ClickRippleData[];
}> = ({ ripples }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <AnimatePresence>
        {ripples.map((r) => (
          <React.Fragment key={r.id}>
            {/* 1. Flash Core Spot - High-intensity radial burst focus */}
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{
                left: `${r.x}px`,
                top: `${r.y}px`,
                background: `radial-gradient(circle, #ffffff 0%, ${r.glowColor} 45%, transparent 75%)`,
                boxShadow: `0 0 40px ${r.glowColor}`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full blur-[1px]"
            />

            {/* 2. Primary Concentric Shockwave Ring 1 */}
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 4.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              style={{
                left: `${r.x}px`,
                top: `${r.y}px`,
                boxShadow: `0 0 35px ${r.glowColor}, inset 0 0 25px ${r.glowColor}`,
                borderColor: r.glowColor
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2"
            />

            {/* 3. Secondary High-Speed Dashed Spinning Wave Ring 2 */}
            <motion.div
              initial={{ scale: 0.1, rotate: 0, opacity: 0.9 }}
              animate={{ scale: 3.2, rotate: 120, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              style={{
                left: `${r.x}px`,
                top: `${r.y}px`,
                boxShadow: `0 0 20px ${r.glowColor}`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-dashed border-white"
            />

            {/* 4. Tertiary Soft Atmospheric Distortion Blur Ring 3 */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0.7 }}
              animate={{ scale: 6.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              style={{
                left: `${r.x}px`,
                top: `${r.y}px`,
                boxShadow: `0 0 50px ${r.glowColor}`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-amber-300/40 backdrop-blur-sm blur-[2px]"
            />

            {/* 5. 8 Directional Sparkle Particles Burst */}
            {Array.from({ length: 8 }).map((_, sparkIdx) => {
              const angle = (sparkIdx * 360) / 8;
              const rad = (angle * Math.PI) / 180;
              const distance = 55 + (sparkIdx % 3) * 25;
              const sparkX = Math.cos(rad) * distance;
              const sparkY = Math.sin(rad) * distance;

              return (
                <motion.div
                  key={`spark-${sparkIdx}`}
                  initial={{ x: r.x, y: r.y, scale: 0.4, opacity: 1, rotate: 0 }}
                  animate={{
                    x: r.x + sparkX,
                    y: r.y + sparkY,
                    scale: [0.4, 1.6, 0],
                    opacity: [1, 0.9, 0],
                    rotate: 180
                  }}
                  transition={{ duration: 0.75, ease: 'easeOut' }}
                  style={{
                    boxShadow: `0 0 12px ${r.glowColor}`
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
                </motion.div>
              );
            })}

            {/* 6. Floating Divine Rune Text Tag */}
            <motion.div
              initial={{ scale: 0.5, y: 0, opacity: 1 }}
              animate={{ scale: 1.15, y: -48, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              style={{ left: `${r.x}px`, top: `${r.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-black text-amber-200 bg-slate-950/95 border border-amber-400/80 px-3 py-1 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.9)] flex items-center gap-1.5 pointer-events-none z-40"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>{r.tag}</span>
            </motion.div>

            {/* 7. Surrounding Short-Lived Fade-Out God Statue Phantoms (神像虚影 · 神位威压) */}
            {[
              { dx: -75, dy: -55, rotate: -15, delay: 0 },
              { dx: 0, dy: -90, rotate: 0, delay: 0.05 },
              { dx: 75, dy: -55, rotate: 15, delay: 0.1 }
            ].map((p, pIdx) => (
              <motion.div
                key={`god-phantom-${r.id}-${pIdx}`}
                initial={{
                  x: r.x + p.dx * 0.2,
                  y: r.y + p.dy * 0.2,
                  scale: 0.3,
                  opacity: 0,
                  rotate: p.rotate * 0.5,
                  filter: 'blur(6px)'
                }}
                animate={{
                  x: r.x + p.dx,
                  y: r.y + p.dy - 12,
                  scale: [0.3, 1.2, 1.45, 1.5],
                  opacity: [0, 0.95, 0.75, 0],
                  rotate: p.rotate,
                  filter: ['blur(6px)', 'blur(0px)', 'blur(1px)', 'blur(8px)']
                }}
                transition={{
                  duration: 1.35,
                  delay: p.delay,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 flex flex-col items-center"
              >
                {/* Backlight Ethereal Radial Glow behind Phantom */}
                <div 
                  style={{
                    background: `radial-gradient(circle, ${r.glowColor} 0%, transparent 75%)`,
                    boxShadow: `0 0 35px ${r.glowColor}`
                  }}
                  className="absolute w-24 h-24 rounded-full blur-md opacity-60 -z-10"
                />

                {/* God Statue Silhouette SVG */}
                <GodStatuePhantomSVG
                  godPosition={r.godPosition}
                  glowColor={r.glowColor}
                  className="w-20 h-28 drop-shadow-[0_0_15px_rgba(255,255,255,0.85)]"
                />

                {/* Divine Majesty Pressure Tag */}
                <div className="mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest text-amber-100 bg-slate-950/90 border border-amber-400/70 shadow-[0_0_12px_rgba(251,191,36,0.7)] whitespace-nowrap">
                  神位威压
                </div>
              </motion.div>
            ))}
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * Dynamic Element Particles Background Component
 * Generates floating, swirling, and twinkling particles tailored to each God Position
 * Now smoothly morphs particle color schemes on godPosition state switch with interactive click wave triggers
 */
export const GodParticleBackground: React.FC<{
  config: GodAuraConfig;
  onParticleClick?: (x: number, y: number) => void;
}> = ({ config, onParticleClick }) => {
  const { colors, count, glowColor } = config.particles;

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Background Soft Glow Diffusion Area - Smoothly morphs background gradient */}
      <motion.div
        animate={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          opacity: [0.35, 0.65, 0.35]
        }}
        transition={{
          background: { duration: 0.8, ease: 'easeInOut' },
          opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }}
        className="absolute inset-0 blur-2xl pointer-events-none"
      />

      {/* Floating Sparkle Particles with smooth color theme morphing */}
      {Array.from({ length: Math.max(count, 18) }).map((_, i) => {
        const colorClass = colors[i % colors.length];
        const size = (i % 4) * 2.5 + 4; // 4px to 11.5px
        const startLeft = (i * 100) / Math.max(count, 18) + (i % 7);
        const duration = 3.5 + (i % 5) * 1.0;
        const delay = (i % 6) * 0.25;

        return (
          <motion.div
            key={`god-particle-${i}`}
            initial={{
              x: 0,
              y: '100%',
              opacity: 0,
              scale: 0.5
            }}
            animate={{
              y: ['105%', '-15%'],
              x: [
                0,
                (i % 2 === 0 ? 1 : -1) * (18 + (i % 4) * 12),
                (i % 2 === 0 ? -1 : 1) * (12 + (i % 3) * 10),
                0
              ],
              opacity: [0, 0.95, 1, 0.5, 0],
              scale: [0.4, 1.4, 0.9, 1.6, 0.3]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: 'easeInOut'
            }}
            style={{
              left: `${startLeft}%`,
              width: `${size}px`,
              height: `${size}px`,
              boxShadow: `0 0 16px ${glowColor}`,
              transition: 'box-shadow 0.8s ease, background-color 0.8s ease'
            }}
            whileHover={{ scale: 2.2 }}
            whileTap={{ scale: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.parentElement?.getBoundingClientRect();
              if (rect) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                onParticleClick?.(x, y);
              }
            }}
            className={`absolute bottom-0 rounded-full ${colorClass} blur-[0.2px] cursor-pointer pointer-events-auto hover:brightness-150 transition-all duration-700`}
          />
        );
      })}
    </div>
  );
};

/**
 * Avatar Divine Halo Ring Component
 * Rendered directly around the player's avatar image with dynamic aura & glow diffusion
 */
export const GodAuraAvatarRing: React.FC<{
  godPosition?: GodPositionType | null;
  affinity?: number;
  onGodHaloClick?: () => void;
  children: React.ReactNode;
}> = ({ godPosition, affinity = 0, onGodHaloClick, children }) => {
  const activeConfig = godPosition ? GOD_AURA_CONFIGS[godPosition] : null;
  const [clickRipples, setClickRipples] = useState<ClickRippleData[]>([]);

  const handleAvatarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (godPosition) {
      SoundEngine.playDivineDeclaration(godPosition);
    } else {
      SoundEngine.playSoulRingAura('gold');
    }

    if (onGodHaloClick) {
      onGodHaloClick();
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const godTags: Record<string, string> = {
      '海神': '🌊 瀚海神威',
      '修罗神': '🗡️ 修罗杀意',
      '天使神': '☀️ 太阳金辉',
      '罗刹神': '💀 幽冥魔毒',
      '情绪之神': '❄️ 浩冬精神',
      '至高龙神': '🐉 万龙朝圣',
      '海神 & 修罗双神': '👑 至高神威'
    };

    const newRipple: ClickRippleData = {
      id: Date.now() + Math.random(),
      x,
      y,
      color: activeConfig ? activeConfig.borderColor : 'border-amber-400',
      glowColor: activeConfig ? activeConfig.particles.glowColor : 'rgba(251,191,36,0.85)',
      tag: godPosition ? (godTags[godPosition] || '✨ 魂力爆发') : '✨ 魂力爆发',
      godPosition: godPosition || '海神'
    };

    setClickRipples((prev) => [...prev.slice(-3), newRipple]);
  };

  const safeAffinity = Math.min(100, Math.max(0, affinity));
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * safeAffinity) / 100;

  // Gauge Gradient Colors based on God Attribute
  const gaugeGradient = godPosition === '海神'
    ? { from: '#06b6d4', to: '#3b82f6', glow: 'rgba(6,182,212,0.8)' }
    : godPosition === '修罗神'
    ? { from: '#ef4444', to: '#b91c1c', glow: 'rgba(239,68,68,0.8)' }
    : godPosition === '天使神'
    ? { from: '#f59e0b', to: '#eab308', glow: 'rgba(245,158,11,0.8)' }
    : godPosition === '罗刹神'
    ? { from: '#a855f7', to: '#7e22ce', glow: 'rgba(168,85,247,0.8)' }
    : godPosition === '情绪之神'
    ? { from: '#38bdf8', to: '#14b8a6', glow: 'rgba(56,189,248,0.8)' }
    : godPosition === '至高龙神'
    ? { from: '#f59e0b', to: '#10b981', glow: 'rgba(245,158,11,0.9)' }
    : { from: '#f59e0b', to: '#06b6d4', glow: 'rgba(251,191,36,0.8)' };

  if (!activeConfig) {
    // Normal soul aura without active god position
    return (
      <div 
        onClick={handleAvatarClick}
        className="relative flex items-center justify-center group cursor-pointer"
      >
        <ClickRippleOverlay ripples={clickRipples} />
        
        {/* Energy Gauge Circle SVG */}
        <svg className="absolute -inset-2.5 w-[100px] h-[100px] -rotate-90 pointer-events-none z-10 overflow-visible">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-800/80"
            strokeWidth="3.5"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={`url(#affinityGradientNormal)`}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
              filter: `drop-shadow(0 0 6px ${gaugeGradient.glow})`
            }}
          />
          <defs>
            <linearGradient id="affinityGradientNormal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gaugeGradient.from} />
              <stop offset="100%" stopColor={gaugeGradient.to} />
            </linearGradient>
          </defs>
        </svg>

        <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-rose-500 to-cyan-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] group-hover:shadow-[0_0_30px_rgba(244,114,182,0.8)] transition-all">
          {children}
        </div>
      </div>
    );
  }

  const isDual = activeConfig.id === '海神 & 修罗双神';

  return (
    <div 
      onClick={handleAvatarClick}
      className="relative flex items-center justify-center group cursor-pointer"
    >
      {/* Click Interactive Concentric Ripples & Surrounding God Statue Phantoms */}
      <ClickRippleOverlay ripples={clickRipples} />

      {/* Surrounding Dynamic Energy Gauge Ring for God Affinity */}
      <svg className="absolute -inset-3.5 w-[108px] h-[108px] -rotate-90 pointer-events-none z-20 overflow-visible">
        {/* Track */}
        <circle
          cx="54"
          cy="54"
          r="48"
          className="stroke-slate-900/90"
          strokeWidth="4"
          fill="transparent"
        />
        {/* Filled Energy Bar */}
        <motion.circle
          cx="54"
          cy="54"
          r="48"
          stroke={`url(#affinityGradient_${godPosition})`}
          strokeWidth="5"
          strokeDasharray={2 * Math.PI * 48}
          animate={{
            strokeDashoffset: (2 * Math.PI * 48) - ((2 * Math.PI * 48) * safeAffinity) / 100
          }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="transparent"
          style={{
            filter: `drop-shadow(0 0 8px ${gaugeGradient.glow})`
          }}
        />
        <defs>
          <linearGradient id={`affinityGradient_${godPosition}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gaugeGradient.from} />
            <stop offset="100%" stopColor={gaugeGradient.to} />
          </linearGradient>
        </defs>
      </svg>

      {/* Dynamic Expanding Halo Pulse Diffusion Waves */}
      {[0, 1].map((i) => (
        <motion.div
          key={`avatar-halo-wave-${i}`}
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{
            scale: [0.9, 1.4, 1.9],
            opacity: [0.8, 0.35, 0]
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            delay: i * 1.4,
            ease: 'easeOut'
          }}
          style={{
            boxShadow: `0 0 20px ${activeConfig.auraDiffusionColor}`
          }}
          className={`absolute -inset-1 rounded-full border ${activeConfig.borderColor} pointer-events-none`}
        />
      ))}

      {/* Outer Pulsing Glowing Core Base */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -inset-2 rounded-full bg-gradient-to-tr ${activeConfig.primaryColor} blur-md opacity-80 pointer-events-none`}
      />

      {/* Orbiting Rotating Halo Ring 1 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className={`absolute -inset-1.5 rounded-full border-2 border-dashed ${activeConfig.borderColor} opacity-90 pointer-events-none`}
      />

      {/* Orbiting Rotating Halo Ring 2 (Counter Clockwise for Dual Gods) */}
      {isDual && (
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-3 rounded-full border-2 border-dotted border-cyan-400/80 opacity-80 pointer-events-none"
        />
      )}

      {/* Orbiting Particles around Avatar */}
      <div className="absolute -inset-4 pointer-events-none overflow-hidden rounded-full">
        {Array.from({ length: isDual ? 8 : 6 }).map((_, i) => {
          const angle = (i * 360) / (isDual ? 8 : 6);
          const pColor = activeConfig.particles.colors[i % activeConfig.particles.colors.length];
          return (
            <motion.div
              key={i}
              animate={{
                rotate: [angle, angle + 360],
                scale: [0.8, 1.3, 0.8],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                rotate: { duration: 5 + i, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="absolute w-full h-full"
            >
              <div
                className={`w-2 h-2 rounded-full ${pColor} shadow-[0_0_8px_currentColor] absolute top-0 left-1/2 -translate-x-1/2`}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Inner Avatar Container */}
      <div className={`w-20 h-20 rounded-full p-1 bg-gradient-to-tr ${activeConfig.primaryColor} ${activeConfig.glowShadow} transition-all relative z-10 group-hover:scale-105`}>
        {children}
      </div>

      {/* God Crown Badge Top Right */}
      <motion.div
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-3.5 -right-2 z-20 pointer-events-none"
      >
        <div className="p-1 rounded-full bg-slate-950 border border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]">
          <Crown className="w-4 h-4 text-amber-300" />
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Main Divine God Aura Section UI Component
 * Rendered inside CharacterPanel as a dedicated section
 */
export const GodAuraSection: React.FC<{
  player: Player;
  onNavigateToTrials?: () => void;
  onGodHaloClick?: () => void;
}> = ({ player, onNavigateToTrials, onGodHaloClick }) => {
  // Current active or selected preview god
  const currentInheritedGod = player.godPosition || null;
  const [selectedGodTab, setSelectedGodTab] = useState<GodPositionType>(
    currentInheritedGod || '海神'
  );
  const [clickRipples, setClickRipples] = useState<ClickRippleData[]>([]);

  const activeConfig = GOD_AURA_CONFIGS[selectedGodTab];
  const isInherited = currentInheritedGod === selectedGodTab;

  const godTabs: GodPositionType[] = ['海神', '修罗神', '天使神', '罗刹神', '情绪之神', '至高龙神', '海神 & 修罗双神'];

  const triggerAuraRipple = (x: number, y: number) => {
    const godTags: Record<GodPositionType, string> = {
      '海神': '🌊 瀚海神威荡漾',
      '修罗神': '🗡️ 修罗杀意无双',
      '天使神': '☀️ 太阳金辉净化',
      '罗刹神': '💀 幽冥魔毒噬魂',
      '情绪之神': '❄️ 浩冬精神震撼',
      '至高龙神': '🐉 万龙朝圣爆裂',
      '海神 & 修罗双神': '👑 双神一体绝煞'
    };

    SoundEngine.playDivineDeclaration(selectedGodTab);

    if (onGodHaloClick) {
      onGodHaloClick();
    }

    const newRipple: ClickRippleData = {
      id: Date.now() + Math.random(),
      x,
      y,
      color: activeConfig.borderColor,
      glowColor: activeConfig.particles.glowColor,
      tag: godTags[selectedGodTab] || '✨ 神威荡漾',
      godPosition: selectedGodTab
    };

    setClickRipples((prev) => [...prev.slice(-6), newRipple]);
  };

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    triggerAuraRipple(x, y);
  };

  return (
    <div 
      onClick={handleStageClick}
      className="bg-slate-900/90 border border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-6 cursor-pointer group/stage selection:bg-none"
    >
      
      {/* CLICK EXPANDING RIPPLE OVERLAY */}
      <ClickRippleOverlay ripples={clickRipples} />

      {/* DYNAMIC COLORFUL PARTICLE BACKGROUND ACCORDING TO GOD POSITION */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {/* Base Color Glow Overlay with smooth gradient morphing */}
        <div className={`absolute inset-0 bg-gradient-to-br ${activeConfig.auraBgGradient} opacity-60 pointer-events-none transition-all duration-700`} />
        
        {/* Colorful Particle Canvas */}
        <GodParticleBackground 
          config={activeConfig} 
          onParticleClick={(x, y) => triggerAuraRipple(x, y)}
        />
      </div>

      {/* HEADER TITLE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/90 pb-4 relative z-10 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-500/40 shadow-lg relative">
            <Crown className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-100">神祇至尊光环 · 百分比神威阵</h3>
              {currentInheritedGod ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.6)]">
                  已位列神班【{currentInheritedGod}】
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800/90 border border-slate-700 text-amber-300/80">
                  未传承神位 (可选择预览)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>九考突破觉醒至高神位，激活环绕周身的粒子神气光环</span>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40 animate-pulse">
                ✨ 点击触发神威涟漪
              </span>
            </p>
          </div>
        </div>

        {onNavigateToTrials && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              SoundEngine.playClick();
              onNavigateToTrials();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg hover:brightness-110 transition-all flex items-center gap-1.5 self-end sm:self-auto"
          >
            <Sparkles className="w-4 h-4" /> 前往【神位试炼】九考
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* GOD TABS SELECTOR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none relative z-10 pointer-events-auto">
        {godTabs.map((godName) => {
          const cfg = GOD_AURA_CONFIGS[godName];
          const isSelected = selectedGodTab === godName;
          const isCurrentPlayerGod = currentInheritedGod === godName;

          return (
            <button
              key={godName}
              onClick={(e) => {
                e.stopPropagation();
                SoundEngine.playClick();
                setSelectedGodTab(godName);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border relative ${
                isSelected
                  ? `bg-gradient-to-r ${cfg.primaryColor} text-white ${cfg.borderColor} ${cfg.glowShadow} scale-[1.02]`
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cfg.icon}
              <span>{godName}</span>
              {isCurrentPlayerGod && (
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* ACTIVE GOD AURA DISPLAY PANEL */}
      <div className={`p-5 rounded-3xl bg-slate-950/85 border ${activeConfig.borderColor} relative overflow-hidden transition-all shadow-xl group-hover/stage:border-amber-400/80`}>
        
        {/* Glow ambient background */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr ${activeConfig.primaryColor} opacity-20 blur-3xl pointer-events-none`} />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* LEFT: ANIMATED HOLOGRAPHIC GOD HALO & PARTICLE STAGE */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-900/90 border border-slate-800 rounded-2xl relative overflow-hidden min-h-[240px]">
            
            {/* DYNAMIC HALO DIFFUSION RIPPLE EXPANSION EFFECT */}
            <HaloDiffusionRipples
              borderColor={activeConfig.borderColor}
              glowColor={activeConfig.particles.glowColor}
            />

            {/* Central Animated Halo Stage */}
            <div className="relative flex items-center justify-center my-4 z-10">
              
              {/* Outer halo spin */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className={`w-36 h-36 rounded-full border-2 border-dashed ${activeConfig.borderColor} opacity-80`}
              />

              {/* Inner halo spin counter-clockwise */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className={`absolute w-28 h-28 rounded-full border border-dotted ${activeConfig.borderColor} opacity-90`}
              />

              {/* Glowing Pulsing Core */}
              <motion.div
                animate={{
                  scale: [0.95, 1.1, 0.95],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  boxShadow: `0 0 35px ${activeConfig.particles.glowColor}`
                }}
                className={`absolute w-20 h-20 rounded-full bg-gradient-to-tr ${activeConfig.primaryColor} flex items-center justify-center text-white`}
              >
                <div className="p-2 rounded-full bg-slate-950/70 border border-amber-300/40">
                  {activeConfig.icon}
                </div>
              </motion.div>
            </div>

            {/* Title & Badge */}
            <div className="text-center mt-2 relative z-10 space-y-1">
              <h4 className={`text-base font-black bg-gradient-to-r ${activeConfig.gradientText} bg-clip-text text-transparent`}>
                【{activeConfig.title}】
              </h4>
              <p className="text-[11px] text-slate-400 font-semibold">{activeConfig.subtitle}</p>
              
              {isInherited ? (
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-md mt-1">
                  <Award className="w-3 h-3" /> 当前继承加成生效中
                </span>
              ) : (
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] text-slate-400 bg-slate-800/80 border border-slate-700 mt-1">
                  神考试炼可获得
                </span>
              )}
            </div>

          </div>

          {/* RIGHT: PERCENTAGE STATS & SPECIAL EFFECT BREAKDOWN */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Lore Quote */}
            <p className="text-xs text-slate-300 italic bg-slate-900/70 p-3 rounded-xl border border-slate-800 leading-relaxed">
              "{activeConfig.lore}"
            </p>

            {/* Percentage Attributes Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 神级百分比属性暴涨:
                </span>
                <span className="text-[10px] text-slate-400">基于魂师基础与魂环魂骨总和</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                
                {/* Atk */}
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Swords className="w-3 h-3 text-amber-400" /> 攻击力增幅
                  </span>
                  <strong className="text-sm font-black text-amber-400 mt-0.5">
                    +{activeConfig.percentBoosts.atkPct}%
                  </strong>
                </div>

                {/* HP */}
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" /> 生命上限增幅
                  </span>
                  <strong className="text-sm font-black text-rose-400 mt-0.5">
                    +{activeConfig.percentBoosts.hpPct}%
                  </strong>
                </div>

                {/* Def */}
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-cyan-400" /> 护体防御增幅
                  </span>
                  <strong className="text-sm font-black text-cyan-400 mt-0.5">
                    +{activeConfig.percentBoosts.defPct}%
                  </strong>
                </div>

                {/* Speed */}
                {activeConfig.percentBoosts.speedPct && (
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-400" /> 敏捷速度增幅
                    </span>
                    <strong className="text-sm font-black text-emerald-400 mt-0.5">
                      +{activeConfig.percentBoosts.speedPct}%
                    </strong>
                  </div>
                )}

                {/* Crit Rate */}
                {activeConfig.percentBoosts.critRateBonus && (
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" /> 暴击率提升
                    </span>
                    <strong className="text-sm font-black text-purple-400 mt-0.5">
                      +{activeConfig.percentBoosts.critRateBonus}%
                    </strong>
                  </div>
                )}

                {/* Crit Dmg or Penetration */}
                {activeConfig.percentBoosts.critDmgBonus ? (
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-300" /> 暴击伤害倍率
                    </span>
                    <strong className="text-sm font-black text-amber-300 mt-0.5">
                      +{activeConfig.percentBoosts.critDmgBonus}%
                    </strong>
                  </div>
                ) : activeConfig.percentBoosts.penetrationBonus ? (
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Swords className="w-3 h-3 text-sky-300" /> 神性穿透
                    </span>
                    <strong className="text-sm font-black text-sky-300 mt-0.5">
                      +{activeConfig.percentBoosts.penetrationBonus}%
                    </strong>
                  </div>
                ) : null}

              </div>
            </div>

            {/* Special God Domain Passive */}
            <div className="p-3 bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 rounded-2xl border border-amber-500/30 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-yellow-400" /> 神威特技: {activeConfig.specialEffectName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/40">
                  至高神威
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                {activeConfig.specialEffectDesc}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
