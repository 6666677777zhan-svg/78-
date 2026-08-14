import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ALL_MARTIAL_SOULS } from '../data/martialSouls';
import { Player } from '../types/game';
import { createDefaultPlayer, RANDOM_CHARACTER_NAMES } from '../utils/saveManager';
import { SoundEngine } from '../utils/audio';
import { ANIME_AVATARS, DEFAULT_AVATAR_URL } from '../data/avatars';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Shield, Flame, Zap, Sun, Hammer, Moon, 
  Sprout, Sword, Skull, Heart, Snowflake, Crown, Layers, 
  ArrowRight, CheckCircle, RefreshCw, Wand2, Eye, Award,
  Check, Image, Volume2, Dices, Shuffle
} from 'lucide-react';

interface AwakeningModalProps {
  onAwakenPlayer: (player: Player) => void;
  isOpen: boolean;
  onClose?: () => void;
  initialSoulId?: string;
}

/* ================= AWAKENING RITUAL PARTICLE CANVAS ================= */
interface AwakeningParticleCanvasProps {
  step: 'hall' | 'select' | 'awakening' | 'result';
  stoneProgress: number;
  crystalEnergy: number;
}

const AwakeningParticleCanvas: React.FC<AwakeningParticleCanvasProps> = ({
  step,
  stoneProgress,
  crystalEnergy
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 800);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 800;
      height = canvas.height = canvas.offsetHeight || 600;
    };

    window.addEventListener('resize', handleResize);

    const colors = ['#f59e0b', '#fde047', '#38bdf8', '#c084fc', '#f43f5e', '#67e8f9', '#a855f7'];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      maxAlpha: number;
      decay: number;
      angle: number;
      orbitRadius: number;
      angularSpeed: number;
    }

    const particles: Particle[] = [];
    const count = step === 'awakening' ? 140 : step === 'result' ? 110 : 60;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.min(width, height) * 0.45;
      particles.push({
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.8) * 1.8,
        size: Math.random() * 3.8 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random(),
        maxAlpha: Math.random() * 0.8 + 0.2,
        decay: Math.random() * 0.015 + 0.005,
        angle,
        orbitRadius: radius,
        angularSpeed: (Math.random() * 0.035 + 0.01) * (Math.random() < 0.5 ? 1 : -1)
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw subtle glowing background aura gradient
      const auraGradient = ctx.createRadialGradient(
        centerX, centerY, 10,
        centerX, centerY, Math.min(width, height) * 0.65
      );
      if (step === 'awakening') {
        const intensity = 0.2 + (crystalEnergy / 100) * 0.4 + (stoneProgress / 6) * 0.2;
        auraGradient.addColorStop(0, `rgba(245, 158, 11, ${intensity})`);
        auraGradient.addColorStop(0.4, `rgba(168, 85, 247, ${intensity * 0.5})`);
        auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else if (step === 'result') {
        auraGradient.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
        auraGradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.18)');
        auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        auraGradient.addColorStop(0, 'rgba(245, 158, 11, 0.14)');
        auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = auraGradient;
      ctx.fillRect(0, 0, width, height);

      // Render & Update Particles
      particles.forEach(p => {
        if (step === 'awakening') {
          // Vortex spiral inwards toward crystal center
          const speedMultiplier = 1 + (crystalEnergy / 100) * 2.2;
          p.angle += p.angularSpeed * speedMultiplier;
          p.orbitRadius -= (0.5 + (stoneProgress / 6) * 0.9) * speedMultiplier;

          if (p.orbitRadius < 15) {
            p.orbitRadius = Math.min(width, height) * (0.38 + Math.random() * 0.15);
            p.angle = Math.random() * Math.PI * 2;
          }

          p.x = centerX + Math.cos(p.angle) * p.orbitRadius;
          p.y = centerY + Math.sin(p.angle) * p.orbitRadius;
          p.alpha = Math.min(p.maxAlpha, (p.orbitRadius / (width * 0.3)) * p.maxAlpha + 0.25);
        } else if (step === 'result') {
          // Radiating explosion outward + gentle floating
          p.x += p.vx * 1.5;
          p.y += p.vy * 1.5;
          p.alpha -= p.decay * 0.5;

          if (p.alpha <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
            const burstAngle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 90;
            p.x = centerX + Math.cos(burstAngle) * dist;
            p.y = centerY + Math.sin(burstAngle) * dist;
            p.vx = Math.cos(burstAngle) * (Math.random() * 3.5 + 1);
            p.vy = Math.sin(burstAngle) * (Math.random() * 3.5 + 1);
            p.alpha = p.maxAlpha;
          }
        } else {
          // Gentle upward float
          p.y += p.vy * 0.8;
          p.x += Math.sin(frame * 0.02 + p.angle) * 0.5;
          p.alpha += (Math.random() - 0.5) * 0.05;
          if (p.alpha < 0.1) p.alpha = 0.1;
          if (p.alpha > p.maxAlpha) p.alpha = p.maxAlpha;

          if (p.y < -20) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
        }

        // Draw Particle
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * (step === 'awakening' ? 5 : 2.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Special Light Rays on 'result' step
      if (step === 'result') {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(frame * 0.003);
        const rays = 8;
        for (let r = 0; r < rays; r++) {
          const rayAngle = (r / rays) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, Math.max(width, height), rayAngle - 0.08, rayAngle + 0.08);
          ctx.fillStyle = r % 2 === 0 ? 'rgba(245, 158, 11, 0.035)' : 'rgba(56, 189, 248, 0.025)';
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [step, stoneProgress, crystalEnergy]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 rounded-3xl"
    />
  );
};

export const AwakeningModal: React.FC<AwakeningModalProps> = ({ 
  onAwakenPlayer,
  isOpen, 
  onClose,
  initialSoulId
}) => {
  const [step, setStep] = useState<'hall' | 'select' | 'awakening' | 'result'>('hall');
  const [playerName, setPlayerName] = useState(() => {
    return RANDOM_CHARACTER_NAMES[Math.floor(Math.random() * RANDOM_CHARACTER_NAMES.length)] || '唐三';
  });
  const [playerGender, setPlayerGender] = useState<'male' | 'female'>('male');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(DEFAULT_AVATAR_URL);
  
  // Initialize with a random soul pair
  const [selectedPrimarySoulId, setSelectedPrimarySoulId] = useState(() => {
    if (initialSoulId) return initialSoulId;
    const randomIdx = Math.floor(Math.random() * ALL_MARTIAL_SOULS.length);
    return ALL_MARTIAL_SOULS[randomIdx]?.id || 'haotian_hammer';
  });
  
  const [selectedSecondSoulId, setSelectedSecondSoulId] = useState(() => {
    const otherSouls = ALL_MARTIAL_SOULS.filter(s => s.id !== initialSoulId);
    const randomIdx = Math.floor(Math.random() * otherSouls.length);
    return otherSouls[randomIdx]?.id || 'blue_silver_emperor';
  });
  
  const [isTwinSouls, setIsTwinSouls] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'attack' | 'agility' | 'control' | 'support' | 'god'>('all');
  
  // Animation state
  const [stoneProgress, setStoneProgress] = useState(0);
  const [crystalEnergy, setCrystalEnergy] = useState(0);
  const [awakeningText, setAwakeningText] = useState('正在汇聚天地纯净灵力...');

  // Roll random martial souls and identity
  const handleRandomRoll = useCallback((autoTriggerCeremony = false) => {
    SoundEngine.playSoulRingAura('gold');
    const randPrimary = ALL_MARTIAL_SOULS[Math.floor(Math.random() * ALL_MARTIAL_SOULS.length)] || ALL_MARTIAL_SOULS[0];
    const otherSouls = ALL_MARTIAL_SOULS.filter(s => s.id !== randPrimary.id);
    const randSecondary = otherSouls[Math.floor(Math.random() * otherSouls.length)] || ALL_MARTIAL_SOULS[1];
    const randAvatar = ANIME_AVATARS[Math.floor(Math.random() * ANIME_AVATARS.length)];
    const randName = RANDOM_CHARACTER_NAMES[Math.floor(Math.random() * RANDOM_CHARACTER_NAMES.length)] || '唐三';

    setSelectedPrimarySoulId(randPrimary.id);
    setSelectedSecondSoulId(randSecondary.id);
    if (randAvatar) setSelectedAvatarUrl(randAvatar.url);
    setPlayerName(randName);
    setIsTwinSouls(true);

    if (autoTriggerCeremony) {
      setTimeout(() => {
        handleStartAwakeningCeremony();
      }, 50);
    }
  }, []);

  // Start BGM on modal open & auto randomize on opening
  useEffect(() => {
    if (isOpen) {
      SoundEngine.startAwakeningBgm();
      // Auto roll random souls when opened if no initialSoulId passed
      if (!initialSoulId) {
        handleRandomRoll(false);
      }
    }
    return () => {
      SoundEngine.stopAwakeningBgm();
    };
  }, [isOpen, initialSoulId, handleRandomRoll]);

  if (!isOpen) return null;

  const primarySoul = ALL_MARTIAL_SOULS.find(s => s.id === selectedPrimarySoulId) || ALL_MARTIAL_SOULS[0];
  const secondSoul = ALL_MARTIAL_SOULS.find(s => s.id === selectedSecondSoulId) || ALL_MARTIAL_SOULS[1];

  const getSoulIcon = (iconName: string) => {
    switch (iconName) {
      case 'Hammer': return <Hammer className="w-6 h-6 text-amber-400" />;
      case 'Sprout': return <Sprout className="w-6 h-6 text-cyan-400" />;
      case 'Sword': return <Sword className="w-6 h-6 text-yellow-300" />;
      case 'ShieldAlert': return <Shield className="w-6 h-6 text-orange-400" />;
      case 'Sun': return <Sun className="w-6 h-6 text-amber-300" />;
      case 'Flame': return <Flame className="w-6 h-6 text-rose-500" />;
      case 'Zap': return <Zap className="w-6 h-6 text-blue-400" />;
      case 'Moon': return <Moon className="w-6 h-6 text-purple-400" />;
      case 'Skull': return <Skull className="w-6 h-6 text-emerald-400" />;
      case 'Heart': return <Heart className="w-6 h-6 text-pink-400" />;
      case 'Snowflake': return <Snowflake className="w-6 h-6 text-cyan-300" />;
      case 'Crown': return <Crown className="w-6 h-6 text-amber-400" />;
      default: return <Sparkles className="w-6 h-6 text-amber-400" />;
    }
  };

  const handleStartAwakeningCeremony = () => {
    setStep('awakening');
    setStoneProgress(0);
    setCrystalEnergy(0);
    setAwakeningText('六颗黑曜石法阵激活，天地灵力疯狂灌注...');
    
    // Elevate BGM to intense ceremony audio!
    SoundEngine.setAwakeningCeremonyMusicIntense();
    SoundEngine.playSoulRingAura('gold');

    // Step 1: 6 Stones lighting up
    let stones = 0;
    const stoneInterval = setInterval(() => {
      stones += 1;
      setStoneProgress(stones);
      SoundEngine.playClick();
      if (stones === 6) {
        clearInterval(stoneInterval);
        setAwakeningText('伸出右手，测试水晶球先天魂力...');
        
        // Step 2: Crystal Ball power surge to 100%
        let power = 0;
        const crystalInterval = setInterval(() => {
          power += 10;
          setCrystalEnergy(power);
          if (power >= 100) {
            clearInterval(crystalInterval);
            setAwakeningText('天生异象！神级绝世武魂 · 先天满魂力！');
            
            // Grand Awakening Fanfare BGM & Jingle
            SoundEngine.playAwakeningFanfare();
            
            try {
              confetti({
                particleCount: 180,
                spread: 100,
                origin: { y: 0.5 }
              });
            } catch {}

            setTimeout(() => {
              setStep('result');
            }, 800);
          }
        }, 120);
      }
    }, 280);
  };

  const handleConfirmAndEnterGame = () => {
    SoundEngine.stopAwakeningBgm();
    SoundEngine.playSoulRingAura('red');

    const freshPlayer = createDefaultPlayer(
      playerName || (playerGender === 'male' ? '唐三' : '小舞'),
      primarySoul.id,
      isTwinSouls,
      isTwinSouls ? secondSoul.id : undefined
    );
    freshPlayer.avatarUrl = selectedAvatarUrl;
    onAwakenPlayer(freshPlayer);
  };

  const filteredSouls = ALL_MARTIAL_SOULS.filter(soul => {
    if (categoryFilter === 'all') return true;
    return soul.category === categoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-3 md:p-6 overflow-y-auto select-none">
      <div className="bg-slate-900/90 border-2 border-amber-500/50 rounded-3xl max-w-4xl w-full p-6 md:p-8 text-slate-100 shadow-[0_0_80px_rgba(245,158,11,0.25)] relative overflow-hidden flex flex-col my-auto">
        
        {/* Dynamic Canvas Particle Overlay for Ritual Atmosphere */}
        <AwakeningParticleCanvas
          step={step}
          stoneProgress={stoneProgress}
          crystalEnergy={crystalEnergy}
        />

        {/* Dynamic Music Indicator Badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 bg-amber-950/80 border border-amber-500/40 rounded-full text-[10px] text-amber-300 font-bold backdrop-blur-md">
          <Volume2 className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>{step === 'awakening' ? '神乐仪式: 灵力灌注' : step === 'result' ? '神乐仪式: 神威降临' : '神乐仪式: 圣魂殿堂'}</span>
        </div>

        {/* Divine Background Elements */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button if opened from in-game navbar */}
        {onClose && (
          <button 
            onClick={() => {
              SoundEngine.stopAwakeningBgm();
              onClose();
            }}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition-colors z-20"
          >
            ✕
          </button>
        )}

        {/* ================= STAGE 1: HALL INTRO & BASIC INFO ================= */}
        {step === 'hall' && (
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border-2 border-amber-500/40 rounded-full mb-1 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
              <Sparkles className="w-10 h-10 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full font-bold">
                圣魂村 · 武魂殿觉醒分殿
              </span>
              <h2 className="text-2xl md:text-4xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 mt-2">
                斗罗大陆 · 本命武魂觉醒大典
              </h2>
              <p className="text-slate-300 text-sm md:text-base mt-2 max-w-xl mx-auto leading-relaxed">
                “六颗黑曜石法阵已布下，伸出你的右手，测试你的本命武魂、双生武魂与先天魂力！”
              </p>
            </div>

            {/* Basic Info input */}
            <div className="max-w-md mx-auto bg-slate-800/80 border border-slate-700 p-5 rounded-2xl space-y-4 text-left shadow-lg">
              <div>
                <label className="text-xs font-bold text-amber-300 mb-1.5 block">魂师尊号 / 姓名:</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={15}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-amber-300 font-black text-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
                  placeholder="例如: 唐三"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">选择魂师形象立绘:</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {ANIME_AVATARS.map(avatar => {
                    const isSelected = selectedAvatarUrl === avatar.url;
                    return (
                      <div
                        key={avatar.id}
                        onClick={() => {
                          SoundEngine.playClick();
                          setSelectedAvatarUrl(avatar.url);
                        }}
                        className={`cursor-pointer rounded-xl p-2 border transition-all flex flex-col items-center text-center relative ${
                          isSelected
                            ? 'border-pink-400 bg-pink-950/50 shadow-[0_0_12px_rgba(244,114,182,0.4)]'
                            : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-pink-500 text-slate-950 rounded-full p-0.5">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                        <div className="w-12 h-12 rounded-full p-0.5 mb-1 overflow-hidden" style={{ borderColor: avatar.themeColor, borderWidth: 1.5 }}>
                          <img
                            src={avatar.url}
                            alt={avatar.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-200 truncate w-full">{avatar.name}</span>
                        <span className="text-[9px] text-pink-300 font-medium truncate w-full">{avatar.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  handleRandomRoll(true);
                }}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all hover:scale-105 active:scale-95 text-base flex items-center justify-center gap-2"
              >
                <Dices className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
                <span>🎲 随机天赐武魂 · 一键觉醒</span>
              </button>

              <button
                onClick={() => {
                  SoundEngine.playClick();
                  setStep('select');
                }}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all hover:scale-105 active:scale-95 text-base flex items-center justify-center gap-2"
              >
                <span>殿堂挑选武魂</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STAGE 2: SELECT MARTIAL SOULS ================= */}
        {step === 'select' && (
          <div className="space-y-4 flex flex-col h-full max-h-[80vh]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-amber-400 flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  <span>选择您的本命武魂</span>
                </h3>
                <p className="text-xs text-slate-400">
                  支持单武魂觉醒或旷世双生武魂自由搭配（器武魂、兽武魂、植物系及神级武魂）
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRandomRoll(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-purple-500/50 bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-black flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] active:scale-95"
                >
                  <Dices className="w-4 h-4 text-amber-300" />
                  <span>🎲 随机换一批</span>
                </button>

                {/* Twin Souls Toggle */}
                <button
                  onClick={() => {
                    SoundEngine.playClick();
                    setIsTwinSouls(!isTwinSouls);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-black flex items-center gap-2 transition-all ${
                    isTwinSouls
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>双生武魂: {isTwinSouls ? '【开启】' : '【关闭】'}</span>
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              {[
                { key: 'all', label: '全部武魂' },
                { key: 'attack', label: '强攻系' },
                { key: 'agility', label: '敏攻系' },
                { key: 'control', label: '控制系' },
                { key: 'support', label: '辅助/防御系' },
                { key: 'god', label: '神级/双生' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { SoundEngine.playClick(); setCategoryFilter(tab.key as any); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    categoryFilter === tab.key
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Martial Souls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 overflow-y-auto max-h-[360px] pr-1">
              {filteredSouls.map(soul => {
                const isSelectedPrimary = selectedPrimarySoulId === soul.id;
                const isSelectedSecond = isTwinSouls && selectedSecondSoulId === soul.id;

                return (
                  <div
                    key={soul.id}
                    onClick={() => {
                      SoundEngine.playClick();
                      if (isTwinSouls && selectedPrimarySoulId === soul.id) {
                        // toggle secondary
                      } else {
                        setSelectedPrimarySoulId(soul.id);
                        if (soul.id === selectedSecondSoulId) {
                          const fallback = ALL_MARTIAL_SOULS.find(s => s.id !== soul.id);
                          if (fallback) setSelectedSecondSoulId(fallback.id);
                        }
                      }
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                      isSelectedPrimary
                        ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                        : isSelectedSecond
                        ? 'bg-blue-950/40 border-blue-400 ring-1 ring-blue-400/30'
                        : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-700">
                            {getSoulIcon(soul.iconName)}
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-100 flex items-center gap-1">
                              <span>{soul.name}</span>
                              {soul.type === 'god' && (
                                <span className="text-[10px] px-1 bg-amber-500 text-slate-950 font-bold rounded">神级</span>
                              )}
                            </div>
                            <div className="text-[10px] text-amber-300/80">
                              {soul.category === 'attack' ? '强攻系' : soul.category === 'control' ? '控制系' : soul.category === 'agility' ? '敏攻系' : soul.category === 'support' ? '辅助系' : '神级武魂'}
                            </div>
                          </div>
                        </div>

                        {isSelectedPrimary && (
                          <span className="text-[10px] px-2 py-0.5 bg-amber-500 text-slate-950 font-black rounded-full">
                            第一武魂
                          </span>
                        )}
                        {isSelectedSecond && (
                          <span className="text-[10px] px-2 py-0.5 bg-blue-500 text-white font-black rounded-full">
                            第二武魂
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {soul.description}
                      </p>
                    </div>

                    {/* Secondary Soul Selector Button if Twin Mode */}
                    {isTwinSouls && !isSelectedPrimary && (
                      <div className="mt-2 pt-2 border-t border-slate-700/60 flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            SoundEngine.playClick();
                            setSelectedSecondSoulId(soul.id);
                          }}
                          className={`text-[10px] px-2 py-1 rounded-md font-bold transition-all ${
                            isSelectedSecond
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-blue-600 hover:text-white'
                          }`}
                        >
                          {isSelectedSecond ? '✓ 已设为第二武魂' : '设为第二武魂'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Soul Summary Footer */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
              <div className="flex items-center gap-3 text-left">
                <div className="text-xs">
                  <div className="text-slate-400">已选本命武魂:</div>
                  <div className="text-sm font-black text-amber-400 flex items-center gap-2">
                    <span>{primarySoul.name}</span>
                    {isTwinSouls && (
                      <>
                        <span className="text-slate-500">+</span>
                        <span className="text-blue-400">{secondSoul.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setStep('hall')}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl"
                >
                  返回
                </button>
                <button
                  onClick={() => handleRandomRoll(false)}
                  className="px-3.5 py-2 bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-500/40 text-xs font-black rounded-xl flex items-center gap-1 transition-all active:scale-95"
                >
                  <Dices className="w-3.5 h-3.5 text-amber-300" />
                  <span>随机搭配</span>
                </button>
                <button
                  onClick={handleStartAwakeningCeremony}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>开启觉醒大典</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STAGE 3: AWAKENING CEREMONY ANIMATION ================= */}
        {step === 'awakening' && (
          <div className="py-12 px-4 text-center space-y-8 flex flex-col items-center justify-center">
            {/* Hexagram 6 Obsidian Stones Animation */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Central Soul Crystal Ball */}
              <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-700 p-1 shadow-[0_0_60px_rgba(245,158,11,0.8)] animate-pulse flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-amber-300 p-2 relative overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-amber-500/40 transition-all duration-300"
                    style={{ height: `${crystalEnergy}%`, bottom: 0, top: 'auto' }}
                  />
                  <Sparkles className="w-8 h-8 text-amber-400 relative z-10 animate-spin" style={{ animationDuration: '6s' }} />
                  <div className="text-xs font-black relative z-10 mt-1">
                    {crystalEnergy}%
                  </div>
                </div>
              </div>

              {/* 6 Revolving Obsidian Stones */}
              {[0, 1, 2, 3, 4, 5].map(idx => {
                const angle = (idx / 6) * Math.PI * 2;
                const isLit = idx < stoneProgress;
                const radius = 100;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <div
                    key={idx}
                    className={`absolute w-8 h-8 rounded-lg border-2 transition-all duration-500 flex items-center justify-center ${
                      isLit
                        ? 'bg-amber-500 border-amber-200 text-slate-950 scale-125 shadow-[0_0_20px_rgba(245,158,11,0.9)]'
                        : 'bg-slate-800 border-slate-600 text-slate-500 scale-90'
                    }`}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    <span className="text-[10px] font-black">{idx + 1}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-xl md:text-2xl font-black text-amber-400 animate-pulse">
                {awakeningText}
              </h3>
              <p className="text-xs text-slate-400">
                觉醒法阵引动天地灵气，正在评估武魂品质与先天魂力品阶...
              </p>
            </div>
          </div>
        )}

        {/* ================= STAGE 4: AWAKENING RESULT & ENTER ARENA ================= */}
        {step === 'result' && (
          <div className="space-y-6 text-center py-4">
            <div className="inline-flex items-center justify-center p-3 bg-amber-500/20 border-2 border-amber-400 rounded-full shadow-[0_0_40px_rgba(245,158,11,0.6)]">
              <Crown className="w-10 h-10 text-amber-400" />
            </div>

            <div>
              <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider">
                ★ 绝世旷古 · 先天满魂力 30 级 ★
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 mt-2">
                恭喜魂师【{playerName}】成功觉醒！
              </h2>
            </div>

            {/* Martial Soul Cards Result */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
              <div className="bg-slate-800/90 border-2 border-amber-500/70 p-4 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/40">
                    {getSoulIcon(primarySoul.iconName)}
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold">第一本命武魂</span>
                    <div className="text-base font-black text-slate-100">{primarySoul.name}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">{primarySoul.description}</p>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-amber-300">
                  <span className="px-2 py-0.5 bg-slate-900 rounded">攻击成长: {primarySoul.growthAtk}</span>
                  <span className="px-2 py-0.5 bg-slate-900 rounded">速度成长: {primarySoul.growthSpeed}</span>
                </div>
              </div>

              {isTwinSouls && (
                <div className="bg-slate-800/90 border-2 border-blue-500/70 p-4 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/40">
                      {getSoulIcon(secondSoul.iconName)}
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-400 font-bold">第二神级武魂</span>
                      <div className="text-base font-black text-slate-100">{secondSoul.name}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">{secondSoul.description}</p>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-blue-300">
                    <span className="px-2 py-0.5 bg-slate-900 rounded">生命成长: {secondSoul.growthHp}</span>
                    <span className="px-2 py-0.5 bg-slate-900 rounded">防御成长: {secondSoul.growthDef}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Inherited Divine Equipment & Soul Rings */}
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl max-w-lg mx-auto flex items-center justify-around text-xs text-slate-300">
              <div className="text-center">
                <div className="text-amber-400 font-black text-sm">九大本命魂环</div>
                <div className="text-[10px] text-slate-400">红金神环共鸣</div>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div className="text-center">
                <div className="text-cyan-400 font-black text-sm">四字/五字斗铠</div>
                <div className="text-[10px] text-slate-400">神级套装加持</div>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div className="text-center">
                <div className="text-rose-400 font-black text-sm">唐门绝世暗器</div>
                <div className="text-[10px] text-slate-400">神祇底蕴已备</div>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={handleConfirmAndEnterGame}
                className="px-10 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all hover:scale-105 active:scale-95 text-base flex items-center gap-2"
              >
                <span>降临斗罗大陆 · 开启无双传说！</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
