import React, { useState, useMemo, useEffect } from 'react';
import { Player } from '../types/game';
import { GameView } from './Navbar';
import { getSoulRankTitle } from '../data/martialSouls';
import { SoundEngine } from '../utils/audio';
import { 
  GUIDE_SYSTEMS_I18N, 
  PROGRESSION_STAGES_I18N, 
  COMBAT_GUIDES_I18N, 
  FAQ_I18N, 
  UI_LABELS_I18N,
  GuideLanguage,
  LocalizedText,
  LocalizedSystemGuide
} from '../data/gameGuideI18n';
import { 
  BookOpen, Compass, Sparkles, User, TreePine, Trophy, 
  Hammer, Droplets, Skull, Crown, Rocket, 
  Zap, Search, ArrowRight, CheckCircle2, Flame, 
  HelpCircle, Swords, Award, Cpu, Languages, Globe,
  Layers, Check
} from 'lucide-react';

interface GameGuideViewProps {
  player: Player;
  onNavigateToView: (view: GameView) => void;
}

type GuideCategory = 'all' | 'core' | 'battle' | 'sect_tech' | 'interstellar' | 'godhood';

const SYSTEM_ICONS: Record<string, { icon: React.ReactNode; bgGradient: string; borderClass: string }> = {
  character: {
    icon: <User className="w-5 h-5 text-blue-400" />,
    bgGradient: 'from-blue-950/40 to-slate-900/90',
    borderClass: 'border-blue-500/30'
  },
  multiplayer: {
    icon: <Swords className="w-5 h-5 text-rose-400" />,
    bgGradient: 'from-rose-950/40 to-slate-900/90',
    borderClass: 'border-rose-500/30'
  },
  spiritpagoda: {
    icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
    bgGradient: 'from-emerald-950/40 to-slate-900/90',
    borderClass: 'border-emerald-500/30'
  },
  interstellar: {
    icon: <Rocket className="w-5 h-5 text-cyan-400" />,
    bgGradient: 'from-cyan-950/40 to-slate-900/90',
    borderClass: 'border-cyan-500/30'
  },
  battlearmor: {
    icon: <Crown className="w-5 h-5 text-amber-400" />,
    bgGradient: 'from-amber-950/40 to-slate-900/90',
    borderClass: 'border-amber-500/30'
  },
  gathering: {
    icon: <Hammer className="w-5 h-5 text-amber-300" />,
    bgGradient: 'from-amber-950/40 to-slate-900/90',
    borderClass: 'border-amber-400/30'
  },
  companions: {
    icon: <Sparkles className="w-5 h-5 text-sky-400" />,
    bgGradient: 'from-sky-950/40 to-slate-900/90',
    borderClass: 'border-sky-500/30'
  },
  tournament: {
    icon: <Trophy className="w-5 h-5 text-yellow-400" />,
    bgGradient: 'from-yellow-950/40 to-slate-900/90',
    borderClass: 'border-yellow-500/30'
  },
  soulbones: {
    icon: <Skull className="w-5 h-5 text-rose-400" />,
    bgGradient: 'from-rose-950/40 to-slate-900/90',
    borderClass: 'border-rose-500/30'
  },
  forest: {
    icon: <TreePine className="w-5 h-5 text-emerald-400" />,
    bgGradient: 'from-emerald-950/40 to-slate-900/90',
    borderClass: 'border-emerald-500/30'
  },
  arena: {
    icon: <Trophy className="w-5 h-5 text-amber-400" />,
    bgGradient: 'from-amber-950/40 to-slate-900/90',
    borderClass: 'border-amber-500/30'
  },
  tangsect: {
    icon: <Hammer className="w-5 h-5 text-amber-500" />,
    bgGradient: 'from-amber-950/40 to-slate-900/90',
    borderClass: 'border-amber-600/30'
  },
  icefire: {
    icon: <Droplets className="w-5 h-5 text-cyan-400" />,
    bgGradient: 'from-cyan-950/40 to-slate-900/90',
    borderClass: 'border-cyan-500/30'
  },
  slaughter: {
    icon: <Skull className="w-5 h-5 text-rose-500" />,
    bgGradient: 'from-rose-950/40 to-slate-900/90',
    borderClass: 'border-rose-600/30'
  },
  seagod: {
    icon: <Crown className="w-5 h-5 text-amber-300" />,
    bgGradient: 'from-amber-950/40 to-slate-900/90',
    borderClass: 'border-amber-500/30'
  },
  academy: {
    icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
    bgGradient: 'from-indigo-950/40 to-slate-900/90',
    borderClass: 'border-indigo-500/30'
  }
};

const COMBAT_ICONS: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Cpu: <Cpu className="w-4 h-4" />,
  Hammer: <Hammer className="w-4 h-4" />,
  Flame: <Flame className="w-4 h-4" />,
  Skull: <Skull className="w-4 h-4" />
};

export const GameGuideView: React.FC<GameGuideViewProps> = ({
  player,
  onNavigateToView
}) => {
  const [lang, setLang] = useState<GuideLanguage>(() => {
    const saved = localStorage.getItem('douluo_guide_lang');
    return (saved === 'en' || saved === 'bilingual' || saved === 'zh') ? saved : 'bilingual';
  });

  const [activeTab, setActiveTab] = useState<'systems' | 'roadmap' | 'combat' | 'faq'>('systems');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory>('all');
  const rankInfo = getSoulRankTitle(player.level);

  const handleLanguageChange = (newLang: GuideLanguage) => {
    SoundEngine.playClick();
    setLang(newLang);
    localStorage.setItem('douluo_guide_lang', newLang);
  };

  // Helper text resolver
  const t = (item: LocalizedText): string => {
    if (lang === 'zh') return item.zh;
    if (lang === 'en') return item.en;
    return `${item.zh} · ${item.en}`;
  };

  const tBlock = (item: LocalizedText, className?: string) => {
    if (lang === 'zh') return <span className={className}>{item.zh}</span>;
    if (lang === 'en') return <span className={className}>{item.en}</span>;
    return (
      <span className={`block space-y-0.5 ${className || ''}`}>
        <span className="block font-medium">{item.zh}</span>
        <span className="block text-[0.88em] opacity-80 font-normal leading-relaxed">{item.en}</span>
      </span>
    );
  };

  const filteredGuides = useMemo(() => {
    return GUIDE_SYSTEMS_I18N.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchZh = item.title.zh.toLowerCase().includes(q) ||
        item.subtitle.zh.toLowerCase().includes(q) ||
        item.summary.zh.toLowerCase().includes(q) ||
        item.coreFunctions.zh.some(f => f.toLowerCase().includes(q)) ||
        item.keyRewards.zh.some(r => r.toLowerCase().includes(q));

      const matchEn = item.title.en.toLowerCase().includes(q) ||
        item.subtitle.en.toLowerCase().includes(q) ||
        item.summary.en.toLowerCase().includes(q) ||
        item.coreFunctions.en.some(f => f.toLowerCase().includes(q)) ||
        item.keyRewards.en.some(r => r.toLowerCase().includes(q));

      return matchZh || matchEn;
    });
  }, [selectedCategory, searchQuery]);

  const handleJump = (view: GameView) => {
    SoundEngine.playClick();
    onNavigateToView(view);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* HERO BANNER & LORE INTRODUCTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          
          {/* Header Row: Badge & Language Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 border border-indigo-400/40 rounded-full text-xs font-semibold text-indigo-300 w-fit">
              <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
              <span>{t(UI_LABELS_I18N.headerBadge)}</span>
            </div>

            {/* Language Selector Pills */}
            <div className="flex items-center gap-1.5 bg-slate-950/90 border border-indigo-500/40 p-1 rounded-2xl shadow-lg w-fit">
              <div className="px-2 py-1 flex items-center gap-1 text-[11px] font-bold text-indigo-300">
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Language / 语言:</span>
              </div>

              <button
                onClick={() => handleLanguageChange('bilingual')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  lang === 'bilingual'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md scale-105'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title="中英双语对照模式 (Bilingual Chinese & English)"
              >
                <Languages className="w-3 h-3" />
                <span>中英双语 (Bilingual)</span>
              </button>

              <button
                onClick={() => handleLanguageChange('zh')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  lang === 'zh'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title="纯中文模式"
              >
                中文 (ZH)
              </button>

              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  lang === 'en'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title="English Only"
              >
                English (EN)
              </button>
            </div>
          </div>

          {/* Title and Intro */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div className="space-y-1.5 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 tracking-wide leading-snug">
                {lang === 'bilingual' ? (
                  <>
                    <span>《斗罗大陆：魂师觉醒与万代修神录》全书大成</span>
                    <span className="block text-sm md:text-base font-bold text-amber-200/90 mt-0.5 tracking-normal">
                      Douluo Dalu: Soul Master Awakening & Immortal Godhood Encyclopedia
                    </span>
                  </>
                ) : (
                  t(UI_LABELS_I18N.heroTitle)
                )}
              </h2>
              <div className="text-slate-300 text-sm md:text-base leading-relaxed">
                {tBlock(UI_LABELS_I18N.heroDesc)}
              </div>
            </div>

            {/* Current Player Mini Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 shrink-0 flex items-center gap-3 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-md">
                <img 
                  src={player.avatarUrl} 
                  alt={player.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-100">{player.name}</span>
                  {player.godPosition && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <span className={`text-xs font-semibold block ${rankInfo.colorClass}`}>
                  {rankInfo.title} (Lv.{player.level})
                </span>
                <span className="text-[11px] text-amber-400 font-mono">
                  💰 {player.gold.toLocaleString()} {lang === 'en' ? 'Gold Coins' : '金魂币'}
                </span>
              </div>
            </div>
          </div>

          {/* Core System Stats Overview Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {lang === 'en' ? 'Active Martial Soul' : lang === 'bilingual' ? '主修武魂 Martial Soul' : '主修武魂'}
                </span>
                <strong className="text-xs text-slate-200 truncate block max-w-[120px]">
                  {player.martialSouls[player.activeSoulIndex]?.name || (lang === 'en' ? 'None' : '未觉醒')}
                </strong>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {lang === 'en' ? 'Active Spirit Souls' : lang === 'bilingual' ? '出战魂灵 Spirit Souls' : '出战魂灵'}
                </span>
                <strong className="text-xs text-emerald-300">
                  {(player.spiritPagoda?.spiritSouls || []).filter(s => s.isContracted && (player.spiritPagoda?.activeBattlingSoulIds || []).includes(s.id)).length} / 2 {lang === 'en' ? 'Deployed' : '尊'}
                </strong>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {lang === 'en' ? 'Battle Armor Tier' : lang === 'bilingual' ? '斗铠阶位 Battle Armor' : '斗铠阶位'}
                </span>
                <strong className="text-xs text-amber-300">
                  {player.battleArmor?.name || (lang === 'en' ? 'None' : '未着斗铠')}
                </strong>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
                <Rocket className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {lang === 'en' ? 'Primary Starship' : lang === 'bilingual' ? '主力战舰 Starship' : '主力战舰'}
                </span>
                <strong className="text-xs text-cyan-300">
                  {(player.interstellar?.starships || []).find(s => s.isUnlocked)?.name || (lang === 'en' ? 'Unbuilt' : '未研发')}
                </strong>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* TOP NAVIGATION TABS */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
          <button
            onClick={() => {
              SoundEngine.playClick();
              setActiveTab('systems');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'systems'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>
              {lang === 'zh' ? `十五大功能殿堂详解 (${GUIDE_SYSTEMS_I18N.length})` :
               lang === 'en' ? `15 Great System Halls (${GUIDE_SYSTEMS_I18N.length})` :
               `十五大功能殿堂 · 15 System Halls (${GUIDE_SYSTEMS_I18N.length})`}
            </span>
          </button>

          <button
            onClick={() => {
              SoundEngine.playClick();
              setActiveTab('roadmap');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'roadmap'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>
              {lang === 'zh' ? '修神升级路线图 (1~100级)' :
               lang === 'en' ? 'Cultivation Roadmap (Lv.1~100)' :
               '升级路线图 · Roadmap (1~100)'}
            </span>
          </button>

          <button
            onClick={() => {
              SoundEngine.playClick();
              setActiveTab('combat');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'combat'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>
              {lang === 'zh' ? '即时微操与融合技秘籍' :
               lang === 'en' ? 'Real-Time Combat & Fusion Guide' :
               '即时微操与融合技 · Combat Guide'}
            </span>
          </button>

          <button
            onClick={() => {
              SoundEngine.playClick();
              setActiveTab('faq');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'faq'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>
              {lang === 'zh' ? '高玩技巧与疑难问答' :
               lang === 'en' ? 'Pro Tips & FAQs' :
               '技巧与问答 · Tips & FAQs'}
            </span>
          </button>
        </div>

        {activeTab === 'systems' && (
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder={lang === 'zh' ? '搜索殿堂、技能、神材、功能...' : lang === 'en' ? 'Search halls, skills, divine ores...' : '搜索殿堂 / Search halls, skills...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* TAB 1: ALL SYSTEMS MANUAL */}
      {activeTab === 'systems' && (
        <div className="space-y-6">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', labelZh: '全部殿堂', labelEn: 'All Halls' },
              { id: 'core', labelZh: '🎴 核心养成', labelEn: '🎴 Core Progression' },
              { id: 'battle', labelZh: '⚔️ 副本竞技', labelEn: '⚔️ Battle & PVP' },
              { id: 'sect_tech', labelZh: '🏛️ 宗门与科技', labelEn: '🏛️ Sect & Tech' },
              { id: 'interstellar', labelZh: '🚀 星际战舰', labelEn: '🚀 Interstellar' },
              { id: 'godhood', labelZh: '👑 百级神考', labelEn: '👑 God Trials' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  SoundEngine.playClick();
                  setSelectedCategory(cat.id as GuideCategory);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'zh' ? cat.labelZh : lang === 'en' ? cat.labelEn : `${cat.labelZh} / ${cat.labelEn}`}
              </button>
            ))}
          </div>

          {/* System Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map(item => {
              const meta = SYSTEM_ICONS[item.id] || {
                icon: <BookOpen className="w-5 h-5 text-amber-400" />,
                bgGradient: 'from-slate-950/40 to-slate-900/90',
                borderClass: 'border-slate-700/40'
              };

              return (
                <div 
                  key={item.id}
                  className={`bg-gradient-to-b ${meta.bgGradient} border ${meta.borderClass} rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-600 transition-all hover:scale-[1.01] group`}
                >
                  <div className="space-y-3.5">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner group-hover:scale-110 transition-transform shrink-0 mt-0.5">
                          {meta.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-base text-slate-100 leading-tight">
                              {lang === 'zh' ? item.title.zh : lang === 'en' ? item.title.en : (
                                <span>
                                  <span className="block">{item.title.zh}</span>
                                  <span className="block text-xs font-semibold text-slate-300 opacity-90">{item.title.en}</span>
                                </span>
                              )}
                            </h3>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono shrink-0">
                              {lang === 'zh' ? item.badge.zh : lang === 'en' ? item.badge.en : `${item.badge.zh} · ${item.badge.en}`}
                            </span>
                          </div>
                          
                          <span className="text-[11px] text-slate-400 block mt-1">
                            {lang === 'zh' ? item.douluoSeries.zh : lang === 'en' ? item.douluoSeries.en : `${item.douluoSeries.zh} (${item.douluoSeries.en})`}
                          </span>

                          <span className="text-[10px] text-amber-400/80 block mt-0.5">
                            {lang === 'zh' ? item.subtitle.zh : lang === 'en' ? item.subtitle.en : `${item.subtitle.zh} · ${item.subtitle.en}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                      {tBlock(item.summary)}
                    </div>

                    {/* Core Features */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{t(UI_LABELS_I18N.coreFeaturesLabel)}</span>
                      </span>
                      <ul className="space-y-1.5 pl-1">
                        {item.coreFunctions.zh.map((featZh, idx) => {
                          const featEn = item.coreFunctions.en[idx] || '';
                          return (
                            <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-snug">
                              <span className="text-slate-500 font-mono shrink-0">·</span>
                              <div>
                                {lang === 'zh' ? featZh : lang === 'en' ? featEn : (
                                  <div>
                                    <span className="block">{featZh}</span>
                                    <span className="block text-[10px] text-slate-400 leading-tight">{featEn}</span>
                                  </div>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Rewards */}
                    <div className="pt-1">
                      <span className="text-[11px] font-bold text-amber-400/90 flex items-center gap-1 mb-1.5">
                        <Award className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{t(UI_LABELS_I18N.keyRewardsLabel)}</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.keyRewards.zh.map((rewZh, idx) => {
                          const rewEn = item.keyRewards.en[idx] || '';
                          return (
                            <span key={idx} className="text-[10px] bg-amber-950/40 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md">
                              {lang === 'zh' ? rewZh : lang === 'en' ? rewEn : `${rewZh} · ${rewEn}`}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pro Tip */}
                    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-400 flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0">{t(UI_LABELS_I18N.proTipPrefix)}</span>
                      <div>{tBlock(item.proTips)}</div>
                    </div>
                  </div>

                  {/* Jump Button */}
                  <div className="pt-4 border-t border-slate-800/80 mt-4">
                    <button
                      onClick={() => handleJump(item.id)}
                      className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/60 rounded-xl text-xs font-bold text-slate-200 hover:text-amber-300 transition-all flex items-center justify-center gap-1.5 group-hover:shadow-md"
                    >
                      <span>
                        {lang === 'zh' ? `立即前往【${item.title.zh}】` :
                         lang === 'en' ? `Go to [${item.title.en}]` :
                         `前往【${item.title.zh}】/ Enter [${item.title.en}]`}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-400" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {filteredGuides.length === 0 && (
            <div className="py-16 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">{t(UI_LABELS_I18N.emptySearch)}</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROGRESSION ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-100 mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>{t(UI_LABELS_I18N.roadmapHeader)}</span>
            </h3>
            <div className="text-xs text-slate-400 mb-6 leading-relaxed">
              {tBlock(UI_LABELS_I18N.roadmapDesc)}
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-800">
              {PROGRESSION_STAGES_I18N.map((stg, idx) => (
                <div key={idx} className="relative pl-12 space-y-3">
                  <div className="absolute left-2.5 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-xs shadow-md">
                    <span className="text-[10px]">{stg.icon}</span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-2.5">
                      <div>
                        <h4 className="font-bold text-sm text-amber-300">
                          {lang === 'zh' ? stg.stage.zh : lang === 'en' ? stg.stage.en : (
                            <span>
                              <span className="block">{stg.stage.zh}</span>
                              <span className="block text-xs font-normal text-amber-200/80">{stg.stage.en}</span>
                            </span>
                          )}
                        </h4>
                        <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                          {t(stg.levelRange)}
                        </span>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 border border-amber-400/30 text-amber-300 rounded-full w-fit mt-1 sm:mt-0">
                        {lang === 'zh' ? `目标：${stg.targetTitle.zh}` :
                         lang === 'en' ? `Goal: ${stg.targetTitle.en}` :
                         `目标: ${stg.targetTitle.zh} · ${stg.targetTitle.en}`}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-400">
                        {lang === 'zh' ? '本阶段核心修炼任务：' : lang === 'en' ? 'Core Cultivation Tasks for this Stage:' : '本阶段核心修炼任务 / Core Cultivation Tasks:'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {stg.tasks.zh.map((taskZh, tidx) => {
                          const taskEn = stg.tasks.en[tidx] || '';
                          return (
                            <div key={tidx} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60 text-xs text-slate-300 flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                {lang === 'zh' ? taskZh : lang === 'en' ? taskEn : (
                                  <div>
                                    <span className="block">{taskZh}</span>
                                    <span className="block text-[10px] text-slate-400 leading-tight mt-0.5">{taskEn}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMBAT MECHANICS GUIDE */}
      {activeTab === 'combat' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Swords className="w-5 h-5 text-rose-400" />
                <span>{t(UI_LABELS_I18N.combatHeader)}</span>
              </h3>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                {tBlock(UI_LABELS_I18N.combatDesc)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMBAT_GUIDES_I18N.map(item => (
                <div key={item.id} className={`bg-slate-950/80 border ${item.borderColor} rounded-xl p-4 space-y-2`}>
                  <div className={`flex items-center gap-2 ${item.themeColor} font-bold text-sm`}>
                    {COMBAT_ICONS[item.iconName] || <Zap className="w-4 h-4" />}
                    <h4>
                      {lang === 'zh' ? `${item.num}. ${item.title.zh}` :
                       lang === 'en' ? `${item.num}. ${item.title.en}` :
                       `${item.num}. ${item.title.zh} · ${item.title.en}`}
                    </h4>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    {tBlock(item.desc)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRO TIPS & FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>{t(UI_LABELS_I18N.faqHeader)}</span>
            </h3>

            <div className="space-y-3">
              {FAQ_I18N.map((faq, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-2">
                  <strong className="text-sm text-amber-300 block">
                    {tBlock(faq.q)}
                  </strong>
                  <div className="text-xs text-slate-300 leading-relaxed pl-2.5 border-l-2 border-amber-500/30">
                    {tBlock(faq.a)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QUICK FOOTER NAVIGATION */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <h4 className="font-bold text-sm text-slate-200">
          {t(UI_LABELS_I18N.footerTitle)}
        </h4>
        <div className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
          {tBlock(UI_LABELS_I18N.footerDesc)}
        </div>
        <div className="flex items-center justify-center gap-3 pt-1 flex-wrap">
          <button
            onClick={() => handleJump('character')}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <User className="w-4 h-4" />
            <span>{t(UI_LABELS_I18N.btnCharacter)}</span>
          </button>
          <button
            onClick={() => handleJump('spiritpagoda')}
            className="px-5 py-2 bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-xs hover:bg-slate-800 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t(UI_LABELS_I18N.btnSpiritPagoda)}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
