import React, { useState } from 'react';
import { Player, SoulBone, SoulBoneSlot, MartialSoul } from '../types/game';
import { SoulRingsDisplay } from './SoulRingsDisplay';
import { SoulRingFusionModal } from './SoulRingFusionModal';
import { GodAuraSection, GodAuraAvatarRing } from './GodAuraSection';
import { MartialSoulSkillFxOverlay, ActiveSkillFxState } from './MartialSoulSkillFxOverlay';
import { getSoulRankTitle, ALL_MARTIAL_SOULS } from '../data/martialSouls';
import { calculatePlayerStats } from '../utils/saveManager';
import { SoundEngine } from '../utils/audio';
import { ANIME_AVATARS, DEFAULT_AVATAR_URL } from '../data/avatars';
import { 
  User, Shield, Heart, Zap, Swords, Sparkles, Award, 
  Crown, Flame, ArrowRightLeft, ShieldAlert, Crosshair,
  Sun, Moon, Skull, PlusCircle, Check, Camera, Image, BookOpen, Layers, Dices
} from 'lucide-react';

interface CharacterPanelProps {
  player: Player;
  onSwitchMartialSoul?: (index: number) => void;
  onAddOrChangeSecondSoul?: (soulId: string) => void;
  onUnequipBone?: (slot: SoulBoneSlot) => void;
  onUpdateAvatar?: (avatarUrl: string) => void;
  onNavigateToGuide?: () => void;
  onNavigateToTrials?: () => void;
  onUpdatePlayer?: (updater: (prev: Player) => Player) => void;
  onOpenMeditation?: () => void;
  onOpenAwakening?: () => void;
  showToast?: (msg: string, type?: 'success' | 'info' | 'gold') => void;
}

export const CharacterPanel: React.FC<CharacterPanelProps> = ({
  player,
  onSwitchMartialSoul,
  onAddOrChangeSecondSoul,
  onUnequipBone,
  onUpdateAvatar,
  onNavigateToGuide,
  onNavigateToTrials,
  onUpdatePlayer,
  onOpenMeditation,
  onOpenAwakening,
  showToast
}) => {
  const [showSoulInheritModal, setShowSoulInheritModal] = useState(false);
  const [selectedInheritSoulId, setSelectedInheritSoulId] = useState<string>('seven_kill_sword');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showSoulRingFusionModal, setShowSoulRingFusionModal] = useState(false);
  const [activeSkillFx, setActiveSkillFx] = useState<ActiveSkillFxState | null>(null);

  const stats = calculatePlayerStats(player);
  const rankInfo = getSoulRankTitle(player.level);
  const activeSoul = player.martialSouls[player.activeSoulIndex] || player.martialSouls[0];
  const avatarImage = player.avatarUrl || DEFAULT_AVATAR_URL;

  const isGodPossessionActive = (player.godPossessionUntil || 0) > Date.now();

  const handleGodHaloClick = () => {
    const godPos = player.godPosition || '海神';
    const godColorNames: Record<string, string> = {
      '海神': '湛蓝波浪色',
      '修罗神': '暗红裂痕色',
      '天使神': '金阳日辉色',
      '罗刹神': '幽冥暗紫色',
      '情绪之神': '七彩星光色',
      '海神 & 修罗双神': '至高金红变异色'
    };

    onUpdatePlayer?.((prev) => ({
      ...prev,
      godPossessionUntil: Date.now() + 5000
    }));

    SoundEngine.playDivineDeclaration(godPos);

    setActiveSkillFx({
      id: `fx_god_${Date.now()}`,
      skillName: `【${godPos}】神力附体`,
      soulName: godPos,
      colorTheme: godPos === '修罗神' ? 'asura' : godPos === '天使神' ? 'angel' : 'seagod',
      godPossessionTheme: godPos
    });

    showToast?.(`⚡【神力附体】激发！主角全技能释放特效发生【${godColorNames[godPos] || '神威变异色'}】变异（持续5秒）！`, 'gold');
  };

  const boneSlots: { slot: SoulBoneSlot; name: string }[] = [
    { slot: 'head', name: '头部魂骨' },
    { slot: 'torso', name: '躯干魂骨' },
    { slot: 'leftArm', name: '左臂魂骨' },
    { slot: 'rightArm', name: '右臂魂骨' },
    { slot: 'leftLeg', name: '左腿魂骨' },
    { slot: 'rightLeg', name: '右腿魂骨' },
    { slot: 'external', name: '外附魂骨 (八蛛矛)' }
  ];

  const currentAffinity = player.godPosition === '海神' ? (player.seaGodAffinity || 0)
    : player.godPosition === '修罗神' ? (player.asuraGodAffinity || 0)
    : player.godPosition === '天使神' ? (player.angelGodAffinity || 0)
    : player.godPosition === '罗刹神' ? (player.rakshasaGodAffinity || 0)
    : player.godPosition === '情绪之神' ? (player.emotionGodAffinity || 0)
    : player.godPosition === '至高龙神' ? (player.dragonGodAffinity || 0)
    : Math.max(player.seaGodAffinity || 0, player.asuraGodAffinity || 0, player.angelGodAffinity || 0, player.rakshasaGodAffinity || 0, player.emotionGodAffinity || 0, player.dragonGodAffinity || 0);

  return (
    <div className="space-y-6 relative">
      {/* Active Skill Effect Overlay */}
      <MartialSoulSkillFxOverlay
        activeFx={activeSkillFx}
        onAnimationComplete={() => setActiveSkillFx(null)}
      />

      {/* HEADER STATUS CARD */}
      <div className="bg-slate-900/90 border border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Avatar & Title */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => {
                SoundEngine.playClick();
                setShowAvatarModal(true);
              }}
              className="relative flex items-center justify-center cursor-pointer group"
              title="点击更换角色立绘头像"
            >
              {/* Soul & Divine God Aura Ring */}
              <GodAuraAvatarRing
                godPosition={player.godPosition}
                affinity={currentAffinity}
                onGodHaloClick={handleGodHaloClick}
              >
                <img 
                  src={avatarImage} 
                  alt={player.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full border-2 border-slate-950 group-hover:scale-105 transition-transform"
                />

                {/* Hover Badge */}
                <div className="absolute inset-0 bg-slate-950/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-amber-300" />
                  <span className="text-[9px] text-amber-200 font-bold">更换头像</span>
                </div>
              </GodAuraAvatarRing>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-black text-slate-100">{player.name}</h2>
                <button
                  onClick={() => {
                    SoundEngine.playClick();
                    setShowAvatarModal(true);
                  }}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-pink-950/80 border border-pink-500/50 text-pink-300 hover:bg-pink-900 transition-all flex items-center gap-1"
                >
                  <Image className="w-3 h-3" /> 头像
                </button>
                {onOpenMeditation && (
                  <button
                    onClick={() => {
                      SoundEngine.playClick();
                      onOpenMeditation();
                    }}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-950/80 border border-indigo-500/60 text-amber-300 hover:bg-indigo-900 transition-all flex items-center gap-1 shadow-md animate-pulse"
                  >
                    <Moon className="w-3 h-3 text-amber-300" /> 静心冥想
                  </button>
                )}
                {onNavigateToGuide && (
                  <button
                    onClick={() => {
                      SoundEngine.playClick();
                      onNavigateToGuide();
                    }}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-950/80 border border-amber-500/50 text-amber-300 hover:bg-amber-900 transition-all flex items-center gap-1 shadow-sm"
                  >
                    <BookOpen className="w-3 h-3" /> 玩法指南
                  </button>
                )}
                {onNavigateToTrials && (
                  <button
                    onClick={() => {
                      SoundEngine.playClick();
                      onNavigateToTrials();
                    }}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Crown className="w-3 h-3 text-cyan-400" /> 神考与天赋树
                  </button>
                )}
                <span className={`px-3 py-0.5 rounded-full text-xs border border-amber-500/40 bg-amber-950/60 ${rankInfo.colorClass}`}>
                  {rankInfo.title}
                </span>
                {player.godPosition && (
                  <span className="px-3 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.7)] flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" /> 【{player.godPosition}】
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                魂师等级: <strong className="text-amber-400 font-bold">Lv.{player.level}</strong> / 100 · 金魂币: <strong className="text-yellow-400">{player.gold.toLocaleString()}</strong> · 神源点: <strong className="text-amber-300 font-bold">{player.divineSourcePoints || 0}</strong>
              </p>

              {/* Exp Bar */}
              <div className="w-56 bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full"
                  style={{ width: `${Math.min(100, (player.currentExp / player.expNeeded) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Twin Martial Souls Switcher & Awakening Button */}
          <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold">当前出战武魂:</span>
            <div className="flex flex-wrap items-center gap-2">
              {player.martialSouls.map((soul, idx) => (
                <button
                  key={soul.id + idx}
                  onClick={() => {
                    SoundEngine.playClick();
                    onSwitchMartialSoul?.(idx);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    player.activeSoulIndex === idx
                      ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {soul.chineseName || soul.name}
                </button>
              ))}

              {player.martialSouls.length < 2 && (
                <button
                  onClick={() => {
                    SoundEngine.playClick();
                    setShowSoulInheritModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-950 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 transition-all flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> 觉醒第二武魂
                </button>
              )}

              {onOpenAwakening && (
                <button
                  onClick={() => {
                    SoundEngine.playClick();
                    onOpenAwakening();
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-950/80 border border-purple-500/50 text-purple-300 hover:bg-purple-900 transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(168,85,247,0.3)] ml-auto"
                  title="重新进行武魂觉醒大典或随机摇号"
                >
                  <Dices className="w-3.5 h-3.5 text-amber-300" /> 重新觉醒/随机选武魂
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* DIVINE GOD AURA SECTION */}
      <GodAuraSection 
        player={player} 
        onNavigateToTrials={onNavigateToTrials} 
        onGodHaloClick={handleGodHaloClick}
      />

      {/* DUAL COLUMN: SOUL RINGS & CORE ATTRIBUTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT: MARTIAL SOUL & SOUL RINGS DISPLAY */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-amber-300">
                {activeSoul.chineseName || activeSoul.name} · 魂环光环
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {activeSoul.type === 'tool' ? '器武魂' : activeSoul.type === 'beast' ? '兽武魂' : activeSoul.type === 'plant' ? '植物系' : '神级武魂'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                已吸收魂环: {activeSoul.skills.length} / {rankInfo.maxRings}
              </span>
              <button
                onClick={() => {
                  SoundEngine.playClick();
                  setShowSoulRingFusionModal(true);
                }}
                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white text-[11px] font-bold shadow-md transition-transform active:scale-95 flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5 text-amber-300" />
                <span>魂环融合</span>
              </button>
            </div>
          </div>

          <div className="my-4">
            <SoulRingsDisplay
              rings={activeSoul.skills.map(s => ({ years: s.ringYears, color: s.ringColor, name: s.name }))}
              size="lg"
              showLabels={true}
            />
          </div>

          {/* Soul Skills List */}
          <div className="w-full text-left space-y-2 mt-4 pt-3 border-t border-slate-800">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-300">已附带魂技:</h4>
              {player.godPosition && (
                <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40">
                  <Crown className="w-3 h-3 text-amber-400 animate-pulse" /> 神技宣言模式
                </span>
              )}
            </div>
            {activeSoul.skills.length === 0 ? (
              <p className="text-xs text-slate-500 italic">暂未吸收魂环。前往星斗大森林猎杀魂兽！</p>
            ) : (
              activeSoul.skills.map((skill, idx) => (
                <div key={skill.id} className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs space-y-1.5 hover:border-amber-500/40 transition-all">
                  <div className="flex justify-between items-center">
                    <strong className="text-amber-300">第{idx + 1}魂技 · {skill.name}</strong>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-cyan-400 font-semibold">{skill.soulPowerCost} 魂力</span>
                      <button
                        onClick={() => {
                          const isPossessed = (player.godPossessionUntil || 0) > Date.now();
                          const godPos = player.godPosition || '海神';
                          if (isPossessed || player.godPosition) {
                            SoundEngine.playDivineDeclaration(player.godPosition || '海神', skill.name);
                          } else {
                            SoundEngine.playSoulRingAura(skill.ringColor);
                          }
                          setActiveSkillFx({
                            id: `fx_${Date.now()}_${idx}`,
                            skillName: skill.name,
                            soulName: activeSoul.chineseName || activeSoul.name,
                            colorTheme: skill.ringColor === 'red' ? 'phoenix' : skill.ringColor === 'purple' ? 'spider' : 'gold',
                            godPossessionTheme: isPossessed ? godPos : (player.godPosition ? godPos : null)
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-[10px] shadow-md transition-transform active:scale-95 flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3 fill-slate-950" />
                        <span>{player.godPosition ? '释放神技' : '演练魂技'}</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px]">{skill.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: ATTRIBUTES & STATS BREAKDOWN */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-100">魂师核心属性面板</h3>
              <span className="text-xs text-emerald-400 font-semibold">综合战力</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-500" /> 生命上限</span>
                <strong className="text-base text-rose-400 mt-1 block">{stats.maxHp.toLocaleString()}</strong>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-cyan-400" /> 魂力上限</span>
                <strong className="text-base text-cyan-400 mt-1 block">{stats.maxSoulPower}</strong>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5"><Swords className="w-3.5 h-3.5 text-amber-400" /> 物理/魂力攻击</span>
                <strong className="text-base text-amber-400 mt-1 block">{stats.atk.toLocaleString()}</strong>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-blue-400" /> 护体防御</span>
                <strong className="text-base text-blue-400 mt-1 block">{stats.def.toLocaleString()}</strong>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> 暴击概率</span>
                <strong className="text-base text-purple-400 mt-1 block">{stats.critRate}%</strong>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> 敏捷速度</span>
                <strong className="text-base text-emerald-400 mt-1 block">{stats.speed}</strong>
              </div>
            </div>

            {/* Domains & Special Passives */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs space-y-2">
              <span className="text-slate-400 font-bold block">已觉醒至尊领域:</span>
              <div className="flex flex-wrap gap-1.5">
                {player.hasKillingGodDomain && (
                  <span className="px-2.5 py-1 bg-red-950 border border-red-500/50 text-red-300 rounded-lg font-semibold">
                    杀神领域 (攻击+20% / 敌方削弱20%)
                  </span>
                )}
                {player.hasBlueSilverDomain && (
                  <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/50 text-emerald-300 rounded-lg font-semibold">
                    蓝银领域 (生命+25% / 生生不息自愈)
                  </span>
                )}
                {player.hasSeaGodDomain && (
                  <span className="px-2.5 py-1 bg-blue-950 border border-blue-500/50 text-cyan-300 rounded-lg font-semibold">
                    海神领域 (全属性提升+20% / 瀚海护体)
                  </span>
                )}
                {player.hasAngelDomain && (
                  <span className="px-2.5 py-1 bg-amber-950 border border-yellow-500/50 text-yellow-300 rounded-lg font-semibold">
                    天使领域 (神圣攻击+20% / 太阳真火净化)
                  </span>
                )}
                {player.hasRakshasaDomain && (
                  <span className="px-2.5 py-1 bg-purple-950 border border-purple-500/50 text-purple-300 rounded-lg font-semibold">
                    罗刹领域 (幽冥剧毒+22% / 噬魂蛛网)
                  </span>
                )}
                {!player.hasKillingGodDomain && !player.hasBlueSilverDomain && !player.hasSeaGodDomain && !player.hasAngelDomain && !player.hasRakshasaDomain && (
                  <span className="text-slate-500 italic">暂未觉醒神级领域 (通关神祇试炼或杀戮之都解锁)</span>
                )}
              </div>
            </div>

            {/* Divine Artifacts */}
            <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-1.5">
              <span className="text-slate-400 font-bold block">掌控超神器:</span>
              <div className="flex flex-wrap gap-1.5">
                {player.divineArtifacts && player.divineArtifacts.length > 0 ? (
                  player.divineArtifacts.map((artifact) => (
                    <span key={artifact} className="px-2.5 py-1 bg-gradient-to-r from-amber-950 to-yellow-950 border border-amber-500/60 text-amber-300 rounded-lg font-bold flex items-center gap-1 shadow-md">
                      <Crown className="w-3.5 h-3.5 text-yellow-400" /> {artifact}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">暂未拔出超神器 (完成神祇第七考解锁)</span>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 6 SOUL BONES + 8 SPIDER LANCES EXTERNAL BONE SLOTS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base text-slate-100">六大魂骨位与外附魂骨</h3>
          </div>
          <span className="text-xs text-slate-400">已镶嵌魂骨: {Object.values(player.soulBones || {}).filter(Boolean).length} / 7</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {boneSlots.map(({ slot, name }) => {
            const bone = player.soulBones[slot];

            return (
              <div
                key={slot}
                className={`p-3.5 rounded-xl border flex flex-col justify-between text-xs ${
                  bone
                    ? 'bg-purple-950/40 border-purple-500/50 text-slate-200 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-300">{name}</span>
                    {bone && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-300 border border-purple-600/40">
                        {bone.years >= 10000 ? `${(bone.years / 10000).toFixed(0)}万年` : `${bone.years}年`}
                      </span>
                    )}
                  </div>

                  {bone ? (
                    <div className="space-y-1 mt-2">
                      <div className="font-bold text-amber-300">{bone.name}</div>
                      <p className="text-[10px] text-slate-400 line-clamp-2">{bone.description}</p>
                      {bone.skillName && (
                        <div className="text-[11px] text-purple-300 font-semibold pt-1">
                          附带技能: {bone.skillName}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-4 text-center italic text-slate-600">空置槽位</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NEW SYSTEMS OVERVIEW: BATTLE ARMOR & DOULUO 4 COMPANIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* BATTLE ARMOR & SOUL TOOLS PREVIEW */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base text-slate-100">斗铠锻造与定制魂导器</h3>
            </div>
            {player.battleArmor?.isActive ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold animate-pulse">
                斗铠生效中
              </span>
            ) : (
              <span className="text-xs text-slate-500">整备待命</span>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">斗铠命名字号与品阶:</span>
                <strong className="text-amber-300 text-sm">
                  【{player.battleArmor?.customName || '龙皇'}】
                  {player.battleArmor?.rankTitle ? ` · ${player.battleArmor.rankTitle}` : ' (未锻造)'}
                </strong>
              </div>
              <span className="text-xs text-amber-400 font-mono">
                已锻造铠件: {Object.values(player.battleArmor?.pieces || {}).filter(Boolean).length} / 7
              </span>
            </div>

            {player.equippedSoulTool && (
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">已装备定装魂导器:</span>
                  <strong className="text-sky-300 font-bold">{player.equippedSoulTool.name}</strong>
                  <span className="text-[10px] text-slate-400 ml-2 font-mono">
                    ({player.equippedSoulTool.tierLevel}级 · {player.equippedSoulTool.category === 'tactical' ? '战术突击' : player.equippedSoulTool.category === 'defense' ? '无敌护罩' : '战略重武'})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DOULUO 4 COMPANIONS SQUAD PREVIEW */}
        <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <h3 className="font-bold text-base text-slate-100">终极斗罗伙伴战队</h3>
            </div>
            <span className="text-xs text-sky-400 font-mono">
              出战编队: {(player.douluo4Companions || []).filter(c => c.isRecruited && c.isInSquad).length} / 3
            </span>
          </div>

          <div className="space-y-2">
            {(player.douluo4Companions || []).filter(c => c.isRecruited && c.isInSquad).length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 italic bg-slate-950/50 rounded-xl border border-slate-800">
                暂未派遣伙伴出战。前往【终极伙伴】招募蓝轩宇、白秀秀等伙伴！
              </div>
            ) : (
              (player.douluo4Companions || []).filter(c => c.isRecruited && c.isInSquad).map(c => (
                <div key={c.id} className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 font-bold text-xs flex items-center justify-center border border-sky-500/40">
                      {c.name.slice(0, 1)}
                    </span>
                    <div>
                      <strong className="text-slate-200 block">{c.name}</strong>
                      <span className="text-[10px] text-sky-400 font-mono">
                        {c.starLevel}星 · 好感度 Lv.{c.affinityLevel}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-amber-300 font-semibold block">{c.passiveAura.name}</span>
                    <span className="text-[9px] text-slate-400">{c.role}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* SPIRIT PAGODA & TANG SECT OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SPIRIT PAGODA & SPIRIT SOULS PREVIEW */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base text-slate-100">传灵塔 · 契约魂灵</h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono">
              出战魂灵: {(player.spiritPagoda?.spiritSouls || []).filter(s => s.isContracted && (player.spiritPagoda?.activeBattlingSoulIds || []).includes(s.id)).length} / 2
            </span>
          </div>

          <div className="space-y-2">
            {(player.spiritPagoda?.spiritSouls || []).filter(s => s.isContracted && (player.spiritPagoda?.activeBattlingSoulIds || []).includes(s.id)).length === 0 ? (
              <div className="py-5 text-center text-xs text-slate-500 italic bg-slate-950/50 rounded-xl border border-slate-800">
                暂未召唤契约魂灵。前往【传灵塔】契约百万年天梦冰蚕、雪帝等魂灵！
              </div>
            ) : (
              (player.spiritPagoda?.spiritSouls || []).filter(s => s.isContracted && (player.spiritPagoda?.activeBattlingSoulIds || []).includes(s.id)).map(soul => (
                <div key={soul.id} className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{soul.icon}</span>
                    <div>
                      <strong className="text-emerald-300 block">{soul.name} (Lv.{soul.level})</strong>
                      <span className="text-[10px] text-slate-400">
                        {soul.years >= 1000000 ? '百万年魂灵' : `${Math.floor(soul.years / 10000)}万年`} · {soul.element}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-cyan-300 font-semibold block">{soul.spiritSkill.name}</span>
                    <span className="text-[9px] text-slate-400">技能伤害 x{soul.spiritSkill.damageMultiplier}</span>
                  </div>
                </div>
              ))
            )}

            {/* Active Mecha preview */}
            {player.spiritPagoda?.activeMechaId && (() => {
              const mecha = player.spiritPagoda.craftedMechas?.find(m => m.id === player.spiritPagoda?.activeMechaId && m.isCrafted);
              if (!mecha) return null;
              return (
                <div className="p-2.5 bg-gradient-to-r from-purple-950/70 to-indigo-950/70 rounded-xl border border-purple-500/40 flex items-center justify-between text-xs mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🤖</span>
                    <div>
                      <strong className="text-purple-300 block">驾驶机甲: {mecha.name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {mecha.tier === 'black' ? '黑级机甲' : mecha.tier === 'red' ? '红级神级机甲' : '神级裁决'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-amber-300 font-bold block">{mecha.mechaWeapon.name}</span>
                    <span className="text-[9px] text-slate-400">重武伤害 x{mecha.mechaWeapon.dmgMultiplier}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* TANG SECT OVERVIEW */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base text-slate-100">唐门绝技与机括暗器</h3>
            </div>
            <span className="text-xs text-amber-400 font-mono">
              唐门宗师
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">玄天功</span>
                <strong className="text-amber-300">Lv.{player.tangSectSkills?.xuantian?.level || 1}</strong>
              </div>
              <div className="p-2 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">紫极魔瞳</span>
                <strong className="text-purple-300">Lv.{player.tangSectSkills?.ziji?.level || 1}</strong>
              </div>
              <div className="p-2 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">鬼影迷踪</span>
                <strong className="text-sky-300">Lv.{player.tangSectSkills?.guiying?.level || 1}</strong>
              </div>
              <div className="p-2 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">控鹤擒龙</span>
                <strong className="text-emerald-300">Lv.{player.tangSectSkills?.konghe?.level || 1}</strong>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">已制造顶级暗器:</span>
              <span className="text-amber-300 font-mono font-bold">
                {(player.hiddenWeapons || []).filter(w => w.quantity > 0).length} 种已入库
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: AWAKEN SECOND MARTIAL SOUL */}
      {showSoulInheritModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-xl w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> 觉醒第二武魂 (双生武魂)
              </h3>
              <button
                onClick={() => setShowSoulInheritModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              天纵奇才，神级血脉！觉醒第二本命武魂，可独立附加九枚全新魂环，战力指数级飙升！
            </p>

            <div className="grid grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {ALL_MARTIAL_SOULS.filter(s => !player.martialSouls.some(ms => ms.id === s.id)).map(soul => (
                <button
                  key={soul.id}
                  onClick={() => {
                    SoundEngine.playClick();
                    setSelectedInheritSoulId(soul.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedInheritSoulId === soul.id
                      ? 'border-amber-400 bg-amber-500/20 shadow-md'
                      : 'border-slate-800 bg-slate-800/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-xs text-amber-200">{soul.chineseName || soul.name}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-2 mt-1">{soul.description}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSoulInheritModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
              >
                取消
              </button>
              <button
                onClick={() => {
                  SoundEngine.playClick();
                  onAddOrChangeSecondSoul?.(selectedInheritSoulId);
                  setShowSoulInheritModal(false);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg"
              >
                确认觉醒第二武魂
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AVATAR SELECTOR MODAL */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-pink-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <h3 className="font-bold text-base text-pink-200">
                  选择魂师专属角色头像
                </h3>
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              选择你心仪的斗罗大陆经典角色头像，展现独一无二的封号斗罗尊荣：
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ANIME_AVATARS.map(avatar => {
                const isSelected = avatarImage === avatar.url;
                return (
                  <div
                    key={avatar.id}
                    onClick={() => {
                      SoundEngine.playClick();
                      onUpdateAvatar?.(avatar.url);
                    }}
                    className={`cursor-pointer rounded-2xl p-3 border transition-all flex flex-col items-center text-center relative ${
                      isSelected
                        ? 'border-pink-400 bg-pink-950/40 shadow-[0_0_15px_rgba(244,114,182,0.4)] scale-[1.02]'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-pink-500 text-slate-950 rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <div className="w-20 h-20 rounded-full p-0.5 mb-2 relative overflow-hidden" style={{ borderColor: avatar.themeColor, borderWidth: 2 }}>
                      <img
                        src={avatar.url}
                        alt={avatar.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="font-bold text-xs text-slate-100">{avatar.name}</div>
                    <div className="text-[10px] text-pink-300 font-semibold mt-0.5">{avatar.title}</div>
                    <div className="text-[9px] text-slate-400 mt-1 leading-tight">{avatar.description}</div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg hover:brightness-110"
              >
                确认选择头像
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOUL RING FUSION MODAL */}
      {showSoulRingFusionModal && (
        <SoulRingFusionModal 
          player={player}
          onUpdatePlayer={onUpdatePlayer || (() => {})}
          onClose={() => setShowSoulRingFusionModal(false)}
          showToast={showToast}
        />
      )}

    </div>
  );
};
