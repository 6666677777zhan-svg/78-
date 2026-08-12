import React from 'react';
import { SoulRingColor } from '../types/game';

interface SoulRingInfo {
  years: number;
  color: SoulRingColor;
  name?: string;
}

interface SoulRingsDisplayProps {
  rings: SoulRingInfo[];
  size?: 'sm' | 'md' | 'lg';
  activeRingIndex?: number;
  showLabels?: boolean;
}

export const SoulRingsDisplay: React.FC<SoulRingsDisplayProps> = ({
  rings,
  size = 'md',
  activeRingIndex,
  showLabels = false
}) => {
  const getRingColorStyle = (color: SoulRingColor) => {
    switch (color) {
      case 'white':
        return {
          border: 'border-slate-200',
          shadow: 'shadow-[0_0_12px_rgba(255,255,255,0.7)]',
          bg: 'bg-slate-100/20',
          text: 'text-slate-200',
          label: '十年·白'
        };
      case 'yellow':
        return {
          border: 'border-amber-400',
          shadow: 'shadow-[0_0_16px_rgba(251,191,36,0.85)]',
          bg: 'bg-amber-400/25',
          text: 'text-amber-300',
          label: '百年·黄'
        };
      case 'purple':
        return {
          border: 'border-purple-500',
          shadow: 'shadow-[0_0_18px_rgba(168,85,247,0.9)]',
          bg: 'bg-purple-600/30',
          text: 'text-purple-300',
          label: '千年·紫'
        };
      case 'black':
        return {
          border: 'border-stone-900 border-2',
          shadow: 'shadow-[0_0_22px_rgba(120,50,180,0.8),inset_0_0_10px_rgba(0,0,0,0.9)]',
          bg: 'bg-neutral-900/60',
          text: 'text-neutral-200 font-bold',
          label: '万年·黑'
        };
      case 'red':
        return {
          border: 'border-red-500 border-2',
          shadow: 'shadow-[0_0_26px_rgba(239,68,68,0.95),inset_0_0_14px_rgba(220,38,38,0.6)]',
          bg: 'bg-red-600/40',
          text: 'text-rose-400 font-bold',
          label: '十万年·红'
        };
      case 'gold':
        return {
          border: 'border-yellow-300 border-2',
          shadow: 'shadow-[0_0_32px_rgba(250,204,21,1),inset_0_0_18px_rgba(253,224,71,0.8)]',
          bg: 'bg-amber-300/40',
          text: 'text-yellow-200 font-extrabold',
          label: '百万年·金'
        };
      default:
        return {
          border: 'border-yellow-400',
          shadow: 'shadow-[0_0_12px_rgba(250,204,21,0.8)]',
          bg: 'bg-yellow-400/20',
          text: 'text-yellow-300',
          label: '魂环'
        };
    }
  };

  const containerSizes = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  const ringBaseRadii = {
    sm: [28, 38, 48, 58, 68, 78, 88, 96, 104],
    md: [50, 65, 80, 95, 110, 125, 140, 155, 170],
    lg: [65, 85, 105, 125, 145, 165, 185, 205, 225]
  };

  return (
    <div className="flex flex-col items-center">
      {/* Dynamic 3D Floating Rings Container */}
      <div className={`relative flex items-center justify-center ${containerSizes[size]}`}>
        {rings.length === 0 && (
          <div className="text-xs text-slate-500 italic text-center p-2">暂无魂环<br/>(需击败魂兽吸收)</div>
        )}

        {rings.map((ring, idx) => {
          const style = getRingColorStyle(ring.color);
          const currentRadius = ringBaseRadii[size][idx] || (50 + idx * 14);
          const isActive = activeRingIndex === idx;

          return (
            <div
              key={idx}
              className={`absolute rounded-full pointer-events-none transition-all duration-700 animate-pulse ${style.border} ${style.shadow} ${style.bg} ${
                isActive ? 'scale-110 brightness-150 border-white' : ''
              }`}
              style={{
                width: `${currentRadius}px`,
                height: `${Math.floor(currentRadius * 0.45)}px`,
                transform: `rotateX(68deg) rotateZ(${idx * 12}deg) translateY(${-(idx * 6)}px)`,
                animationDuration: `${3 + (idx % 3) * 0.8}s`,
                zIndex: 10 + idx
              }}
            />
          );
        })}
      </div>

      {/* Horizontal Rings Badge Row */}
      {showLabels && rings.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mt-2 max-w-xs">
          {rings.map((ring, idx) => {
            const style = getRingColorStyle(ring.color);
            return (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded-full text-xs border ${style.border} ${style.bg} ${style.text} ${style.shadow}`}
                title={`第${idx + 1}魂环: ${ring.years}年`}
              >
                第{idx + 1}环: {ring.years >= 10000 ? `${(ring.years / 10000).toFixed(0)}万年` : `${ring.years}年`}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
