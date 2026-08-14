import React, { useState } from 'react';
import { Player, WorldDifficulty } from '../types/game';
import { getSoulRankTitle } from '../data/martialSouls';
import { SoundEngine, isSoundEnabled, toggleSound } from '../utils/audio';
import { DEFAULT_AVATAR_URL } from '../data/avatars';
import { getActiveGoogleUser } from '../utils/googleAuthManager';
import { 
  TreePine, Trophy, Hammer, Droplets, Skull, Waves, 
  BookOpen, User, Volume2, VolumeX, Package, RotateCcw, 
  Coins, Sparkles, Crown, Rocket, Swords, MessageSquare,
  Flame, Zap, ShieldAlert, ChevronDown, Moon, Cloud, CheckCircle
} from 'lucide-react';

export type GameView = 
  | 'character'
  | 'multiplayer'
  | 'guide'
  | 'spiritpagoda'
  | 'interstellar'
  | 'battlearmor'
  | 'gathering'
  | 'companions'
  | 'tournament'
  | 'soulbones'
  | 'forest'
  | 'arena'
  | 'tangsect'
  | 'icefire'
  | 'slaughter'
  | 'seagod'
  | 'academy';

interface NavbarProps {
  player: Player;
  currentView: GameView;
  onSelectView: (view: GameView) => void;
  onOpenInventory: () => void;
  onResetGame: () => void;
  onOpenChat: () => void;
  onOpenMeditation: () => void;
  onChangeDifficulty: (difficulty: WorldDifficulty) => void;
  onOpenGoogleCloud?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  player,
  currentView,
  onSelectView,
  onOpenInventory,
  onResetGame,
  onOpenChat,
  onOpenMeditation,
  onChangeDifficulty,
  onOpenGoogleCloud
}) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [showDiffMenu, setShowDiffMenu] = useState(false);
  const activeGoogleUser = getActiveGoogleUser();
  const rankInfo = getSoulRankTitle(player.level);

  const handleToggleAudio = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) SoundEngine.playClick();
  };

  const navItems: { id: GameView; label: string; icon: React.ReactNode; isNew?: boolean }[] = [
    { id: 'character', label: '角色属性', icon: <User className="w-4 h-4" /> },
    { id: 'multiplayer', label: '跨服对决', icon: <Swords className="w-4 h-4 text-rose-400 animate-pulse" />, isNew: true },
    { id: 'guide', label: '全书指南', icon: <BookOpen className="w-4 h-4 text-amber-300" />, isNew: true },
    { id: 'spiritpagoda', label: '传灵塔', icon: <Sparkles className="w-4 h-4 text-emerald-400" />, isNew: true },
    { id: 'interstellar', label: '星际战舰', icon: <Rocket className="w-4 h-4 text-cyan-400" />, isNew: true },
    { id: 'battlearmor', label: '神匠斗铠', icon: <Crown className="w-4 h-4 text-amber-400" /> },
    { id: 'gathering', label: '神金采集', icon: <Hammer className="w-4 h-4 text-amber-300" />, isNew: true },
    { id: 'companions', label: '终极伙伴', icon: <Sparkles className="w-4 h-4 text-sky-400" /> },
    { id: 'tournament', label: '全大陆精英赛', icon: <Trophy className="w-4 h-4 text-yellow-400" /> },
    { id: 'soulbones', label: '魂骨圣殿', icon: <Skull className="w-4 h-4 text-rose-400" /> },
    { id: 'forest', label: '星斗猎兽', icon: <TreePine className="w-4 h-4" /> },
    { id: 'arena', label: '大斗魂场', icon: <Trophy className="w-4 h-4" /> },
    { id: 'tangsect', label: '唐门暗器', icon: <Hammer className="w-4 h-4" /> },
    { id: 'icefire', label: '冰火两仪眼', icon: <Droplets className="w-4 h-4" /> },
    { id: 'slaughter', label: '杀戮之都', icon: <Skull className="w-4 h-4" /> },
    { id: 'seagod', label: '神祇九考', icon: <Crown className="w-4 h-4 text-amber-400" /> },
    { id: 'academy', label: '拟态修炼', icon: <Sparkles className="w-4 h-4 text-indigo-400" /> },
  ];

  const currentDiff = player.worldDifficulty || 'normal';
  const diffConfigs = {
    normal: { label: '凡人历练 (普通)', icon: Swords, color: 'text-slate-300', bg: 'bg-slate-800 border-slate-700' },
    nightmare: { label: '修罗地狱 (噩梦) 🔥', icon: Flame, color: 'text-rose-400', bg: 'bg-rose-950/80 border-rose-500/50' },
    godlike: { label: '神明深渊 (极难) ⚡', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-950/80 border-amber-500/60' }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* LOGO & TITLE */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div 
            onClick={() => {
              SoundEngine.playClick();
              onSelectView('character');
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-pink-500 to-cyan-400 shadow-[0_0_15px_rgba(251,191,36,0.6)] group-hover:scale-105 transition-transform overflow-hidden">
                <img 
                  src={player.avatarUrl || DEFAULT_AVATAR_URL} 
                  alt={player.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              {player.godPosition && (
                <Crown className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 drop-shadow-md" />
              )}
            </div>
            <div>
              <h1 className="font-black text-lg md:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
                斗罗大陆·武魂觉醒
              </h1>
              <span className="text-[10px] text-slate-400 font-medium block">
                {player.name} · <strong className={rankInfo.colorClass}>{rankInfo.title} (Lv.{player.level})</strong>
              </span>
            </div>
          </div>

          {/* Quick Info & Action Controls on Mobile */}
          <div className="flex md:hidden items-center gap-1.5">
            {onOpenGoogleCloud && (
              <button
                onClick={onOpenGoogleCloud}
                className={`p-2 rounded-xl border flex items-center justify-center ${
                  activeGoogleUser
                    ? 'bg-blue-950/80 border-blue-500/50 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
                title="Google 云端存档"
              >
                <Cloud className="w-4 h-4 text-blue-400" />
              </button>
            )}
            <button
              onClick={onOpenMeditation}
              className="p-2 bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-500/50 rounded-xl text-amber-300 shadow-md"
              title="静心冥想挂机"
            >
              <Moon className="w-4 h-4 text-amber-300 animate-pulse" />
            </button>
            <button
              onClick={onOpenChat}
              className="p-2 bg-purple-950/70 border border-purple-500/50 rounded-xl text-purple-300"
              title="世界频道"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenInventory}
              className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-amber-400"
              title="储物魂导器"
            >
              <Package className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleAudio}
              className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* NAVIGATION BUTTONS */}
        <nav className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1 px-1 scrollbar-none">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                SoundEngine.playClick();
                onSelectView(item.id);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                currentView === item.id
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* DESKTOP CONTROLS */}
        <div className="hidden md:flex items-center gap-2.5">
          
          {/* Difficulty Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDiffMenu(prev => !prev)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${diffConfigs[currentDiff].bg} ${diffConfigs[currentDiff].color}`}
              title="切换世界难度"
            >
              <span>{diffConfigs[currentDiff].label}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showDiffMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[11px] font-bold text-slate-400 border-b border-slate-800">
                  选择世界历练难度
                </div>
                
                <button
                  onClick={() => {
                    onChangeDifficulty('normal');
                    setShowDiffMenu(false);
                    SoundEngine.playClick();
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs flex flex-col gap-0.5 transition-colors ${
                    currentDiff === 'normal' ? 'bg-slate-800 text-slate-100 font-bold border border-slate-600' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="font-bold flex items-center gap-1">
                    <Swords className="w-3.5 h-3.5 text-slate-400" /> 凡人历练 (普通)
                  </span>
                  <span className="text-[10px] text-slate-400">标准魂兽与对手强度，适合沉浸式探索</span>
                </button>

                <button
                  onClick={() => {
                    onChangeDifficulty('nightmare');
                    setShowDiffMenu(false);
                    SoundEngine.playThunder();
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs flex flex-col gap-0.5 transition-colors ${
                    currentDiff === 'nightmare' ? 'bg-rose-950/80 text-rose-300 font-bold border border-rose-500/60' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="font-bold flex items-center gap-1 text-rose-400">
                    <Flame className="w-3.5 h-3.5 text-rose-400" /> 修罗地狱 (噩梦) 🔥
                  </span>
                  <span className="text-[10px] text-rose-300/70">敌方生命+80%、攻击+50%，附带流血，奖励 x2.0！</span>
                </button>

                <button
                  onClick={() => {
                    onChangeDifficulty('godlike');
                    setShowDiffMenu(false);
                    SoundEngine.playBreakthrough();
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs flex flex-col gap-0.5 transition-colors ${
                    currentDiff === 'godlike' ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-500/60' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="font-bold flex items-center gap-1 text-amber-400">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> 神明深渊 (极难) ⚡
                  </span>
                  <span className="text-[10px] text-amber-300/70">敌方生命+180%、狂暴护盾与极致压迫，奖励 x3.5！</span>
                </button>
              </div>
            )}
          </div>

          {/* Meditation AFK Income Button */}
          <button
            onClick={onOpenMeditation}
            className="px-3 py-1.5 bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 hover:brightness-110 border border-indigo-500/60 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(99,102,241,0.4)] active:scale-95"
            title="开启静心冥想挂机"
          >
            <Moon className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>静心冥想</span>
          </button>

          {/* Global Chat Room Button */}
          <button
            onClick={onOpenChat}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800/80 hover:to-indigo-800/80 border border-purple-500/40 text-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            title="打开世界频道"
          >
            <MessageSquare className="w-4 h-4 text-purple-300 animate-pulse" />
            <span>世界频道</span>
          </button>

          {/* Google Cloud Save Button */}
          {onOpenGoogleCloud && (
            <button
              onClick={onOpenGoogleCloud}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border ${
                activeGoogleUser
                  ? 'bg-blue-950/80 hover:bg-blue-900 border-blue-500/50 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
              title="Google / Gmail 云端存档"
            >
              <Cloud className={`w-4 h-4 ${activeGoogleUser ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="max-w-[120px] truncate">
                {activeGoogleUser ? activeGoogleUser.email.split('@')[0] : 'Google云存档'}
              </span>
              {activeGoogleUser && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <Coins className="w-4 h-4" />
            <span>{player.gold}</span>
          </div>

          <button
            onClick={onOpenInventory}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>储物袋</span>
          </button>

          <button
            onClick={handleToggleAudio}
            title={soundOn ? '静音' : '开启音效'}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-colors"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={onResetGame}
            title="重置并重新觉醒"
            className="p-2 bg-slate-900 hover:bg-rose-950/60 border border-slate-800 text-slate-400 hover:text-rose-400 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
