import React, { useState, useMemo } from 'react';
import { Player, SoulBeast, CombatEntity, SoulRingColor } from '../types/game';
import { SOUL_BEASTS_DB } from '../data/soulBeasts';
import { getSoulRankTitle } from '../data/martialSouls';
import { SoulRingFusionModal } from './SoulRingFusionModal';
import {
  Compass,
  Sparkles,
  Swords,
  TreePine,
  Award,
  Search,
  Flame,
  Zap,
  Skull,
  Snowflake,
  Sun,
  ShieldAlert,
  CheckCircle2,
  Filter,
  Hammer,
  Layers
} from 'lucide-react';
import { SoundEngine } from '../utils/audio';

interface ForestHuntingViewProps {
  player: Player;
  onInitiateCombat: (beast: SoulBeast, entity: CombatEntity) => void;
  onUpdatePlayer?: (updater: (prev: Player) => Player) => void;
  showToast?: (msg: string, type?: 'success' | 'info' | 'gold') => void;
}

type HabitatZoneId = 'outer' | 'middle' | 'core' | 'lake' | 'north' | 'sunset' | 'sea';

export const ForestHuntingView: React.FC<ForestHuntingViewProps> = ({
  player,
  onInitiateCombat,
  onUpdatePlayer,
  showToast
}) => {
  const [selectedZone, setSelectedZone] = useState<HabitatZoneId>('outer');
  const [selectedColorFilter, setSelectedColorFilter] = useState<'all' | SoulRingColor>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFusionModal, setShowFusionModal] = useState<boolean>(false);
  const [explorationLog, setExplorationLog] = useState<string>(
    '微风拂过星斗大森林的万古古木，远方隐隐传来魂兽的低沉咆哮与飞鸟振翅声...'
  );

  const activeSoul = player.martialSouls[player.activeSoulIndex] || player.martialSouls[0];
  const currentRingsCount = activeSoul.skills.length;
  const rankInfo = getSoulRankTitle(player.level);

  // 大师武魂界限理论
  const safeLimits = [423, 764, 1760, 5000, 12000, 25000, 50000, 100000, 1000000];
  const currentSafeLimit = safeLimits[currentRingsCount] || 1000000;

  const zoneConfigs: { id: HabitatZoneId; name: string; subtitle: string; desc: string; bannerBg: string; badgeColor: string }[] = [
    {
      id: 'outer',
      name: '星斗大森林 · 外围区',
      subtitle: '百年 / 初阶千年',
      desc: '100 ~ 2,000 年。温和且中低阶魂兽出没，适合猎取第1~3魂环。',
      bannerBg: 'from-emerald-950/90 via-slate-900 to-slate-900 border-emerald-500/40',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/50'
    },
    {
      id: 'middle',
      name: '星斗大森林 · 混合区',
      subtitle: '千年 / 万年霸主',
      desc: '2,000 ~ 25,000 年。剧毒蛛类与凶猛恶兽横行，适合猎取第4~5魂环。',
      bannerBg: 'from-purple-950/90 via-slate-900 to-slate-900 border-purple-500/40',
      badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-500/50'
    },
    {
      id: 'core',
      name: '星斗大森林 · 核心区',
      subtitle: '五万~九万年 灾厄凶兽',
      desc: '50,000 ~ 90,000 年。暗魔邪神虎与暗金恐爪熊栖息于此，适合猎取第7~8魂环。',
      bannerBg: 'from-amber-950/90 via-slate-900 to-slate-900 border-amber-500/40',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/50'
    },
    {
      id: 'lake',
      name: '生命之湖 · 极境圣地',
      subtitle: '十万~八十九万年 兽神领地',
      desc: '泰坦巨猿、天青牛蟒与兽神帝天隐居圣地。必爆十万年红色神环与至尊魂骨！',
      bannerBg: 'from-rose-950/90 via-slate-900 to-slate-900 border-rose-500/40',
      badgeColor: 'text-rose-400 bg-red-950/60 border-red-500/50'
    },
    {
      id: 'north',
      name: '极北之地 · 冰封雪原',
      subtitle: '极北三大天王 / 百万年天梦',
      desc: '绝对零度极寒之地！冰碧帝皇蝎、冰天雪女与百万年天梦冰蚕长眠之所。',
      bannerBg: 'from-cyan-950/90 via-slate-900 to-slate-900 border-cyan-500/40',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/50'
    },
    {
      id: 'sunset',
      name: '落日森林 · 毒瘴幽谷',
      subtitle: '冰火两仪眼 / 碧磷毒谷',
      desc: '环绕冰火两仪眼天然宝地。万毒弥漫，碧磷蛇皇与珍奇仙品魂兽繁衍之地。',
      bannerBg: 'from-lime-950/90 via-slate-900 to-slate-900 border-lime-500/40',
      badgeColor: 'text-lime-400 bg-lime-950/60 border-lime-500/50'
    },
    {
      id: 'sea',
      name: '无尽海域 · 瀚海狂澜',
      subtitle: '深海魔鲸王 / 海神领地',
      desc: '狂风暴雨的无垠深海！九十九万年深海魔鲸王与魔魂大白鲨统御波涛。',
      bannerBg: 'from-blue-950/90 via-slate-900 to-slate-900 border-blue-500/40',
      badgeColor: 'text-blue-400 bg-blue-950/60 border-blue-500/50'
    }
  ];

  const currentZoneConfig = zoneConfigs.find(z => z.id === selectedZone) || zoneConfigs[0];

  const filteredBeasts = useMemo(() => {
    return SOUL_BEASTS_DB.filter(beast => {
      if (beast.habitat !== selectedZone) return false;
      if (selectedColorFilter !== 'all' && beast.color !== selectedColorFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = beast.chineseName.toLowerCase().includes(query);
        const matchEnName = beast.name.toLowerCase().includes(query);
        const matchElement = beast.element.toLowerCase().includes(query);
        const matchDesc = beast.description.toLowerCase().includes(query);
        if (!matchName && !matchEnName && !matchElement && !matchDesc) return false;
      }
      return true;
    });
  }, [selectedZone, selectedColorFilter, searchQuery]);

  const handlePatrolForest = () => {
    SoundEngine.playClick();
    const zoneLogs: Record<HabitatZoneId, string[]> = {
      outer: [
        '在灌木丛后发现了百年幽冥狼留下的新鲜爪印，隐隐散发着微弱的暗影气息。',
        '惊起了一群在树冠间荡漾的风狒狒，拾得一颗百年古松果，调和了自身魂力。',
        '偶遇一株在溪边随风微摆的孤竹，凝神静气，神识略感清明。',
        '察觉到一条四百余年的曼陀罗蛇正悄无声息地滑过枯叶，口中吐出淡淡毒雾！'
      ],
      middle: [
        '在千年古树躯干上发现了人面魔蛛织就的坚韧腐蚀蛛网，毒气森然！',
        '目睹万年暗夜黑豹与疾风双头魔狼激战，狂暴的气劲震断了数棵合抱大树！',
        '大地之王赤炎地龙蝎在裂谷深处喷射滚烫熔岩，炽热气浪扑面而来！',
        '采得一株吸收了万年阴气的地灵芝，服下后魂力微微上涨！'
      ],
      core: [
        '感受到暗魔邪神虎生死竞技场的压迫黑芒掠过，周围百兽战栗噤声！',
        '暗金恐爪熊挥爪撕裂虚空留下的残余金芒久久不散，令人触目惊心！',
        '遇见帝皇瑞兽三眼金猊在黄金树下小憩，周身沐浴神圣命运之光！',
        '三头赤魔獒的一声低吼震落了核心区万年古树的漫天落叶！'
      ],
      lake: [
        '浩瀚的生命之湖畔，泰坦巨猿二明正矗立在山巅俯瞰莽荒，一拳震碎万斤巨石！',
        '天青牛蟒大明自湖心缓缓升起，雷电与水光交织的龙鳞映亮了半边天穹！',
        '翡翠天鹅碧姬扇动翠绿羽翼掠过湖面，洒下漫天生生不息的生命光辉！',
        '兽神帝天散发黑龙威压，星斗大森林万兽齐齐向生命之湖低头膜拜！'
      ],
      north: [
        '极北之地暴风雪呼啸，隐隐传来冰天雪女极冰神剑划破长空的凛冽剑意！',
        '冰碧帝皇蝎冰帝在钻石般的冰原上折射出耀眼的碧绿华光！',
        '自万丈玄冰深处感受到了百万年天梦冰蚕沉睡时的浩瀚精神波动！',
        '泰坦雪魔王以百米之躯轰碎冰川，引发了连绵万里的滚滚雪崩！'
      ],
      sunset: [
        '落日森林峡谷中弥漫着浓郁的碧磷蛇皇毒雾，五彩斑斓却步步杀机！',
        '赤炎地龙蜥在地热裂隙中喷吐地火，与周围的寒泉形成激烈的水火冲撞！',
        '九节翡翠如一道绿色闪电划过绝壁，瞬息洞穿飞鸟！',
        '圣光天马划过谷底天际，洁白双翼洒下神圣光辉净化了大片毒瘴！'
      ],
      sea: [
        '深海狂涛怒号，海面下浮现出深海魔鲸王堪比大陆般的巍峨暗影！',
        '小白率领魔魂大白鲨族群跃出千重巨浪，掀起直插云霄的水龙卷！',
        '邪魔虎鲸王正带领凶残的族群在大洋深处围猎，海水泛起暗红浪花！',
        '海风中隐隐传来海神之光的无上神威，令人心驰神往，气血澎湃！'
      ]
    };

    const logs = zoneLogs[selectedZone] || zoneLogs.outer;
    setExplorationLog(logs[Math.floor(Math.random() * logs.length)]);
  };

  const handleStartHunt = (beast: SoulBeast) => {
    SoundEngine.playClick();

    // Map SoulBeast to CombatEntity
    const enemyEntity: CombatEntity = {
      id: beast.id,
      name: `${beast.chineseName} (${beast.years >= 10000 ? `${(beast.years / 10000).toFixed(0)}万年` : `${beast.years}年`})`,
      isPlayer: false,
      avatarIcon: 'Skull',
      level: beast.level,
      hp: beast.hp,
      maxHp: beast.maxHp,
      soulPower: 100,
      maxSoulPower: 100,
      atk: beast.atk,
      def: beast.def,
      speed: beast.speed,
      critRate: 15,
      shield: 0,
      actionGauge: 0,
      buffs: [],
      debuffs: [],
      soulRings: [{ years: beast.years, color: beast.color }],
      skills: beast.skills.map((s, idx) => ({
        id: `beast_skill_${idx}`,
        name: s.name,
        ringOrder: 1,
        ringYears: beast.years,
        ringColor: beast.color,
        soulPowerCost: 25,
        cooldown: 2,
        description: s.description,
        damageMultiplier: s.damageMultiplier
      }))
    };

    onInitiateCombat(beast, enemyEntity);
  };

  const getElementBadge = (element: string) => {
    switch (element) {
      case 'fire':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-950/80 border border-red-500/40 text-red-300">
            <Flame className="w-3 h-3 text-red-400" /> 火属性
          </span>
        );
      case 'thunder':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-950/80 border border-amber-500/40 text-amber-300">
            <Zap className="w-3 h-3 text-amber-400" /> 雷属性
          </span>
        );
      case 'poison':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
            <Skull className="w-3 h-3 text-emerald-400" /> 剧毒系
          </span>
        );
      case 'ice':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
            <Snowflake className="w-3 h-3 text-cyan-400" /> 极致之冰
          </span>
        );
      case 'light':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-yellow-950/80 border border-yellow-500/40 text-yellow-300">
            <Sun className="w-3 h-3 text-yellow-400" /> 神圣光明
          </span>
        );
      case 'dark':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-950/80 border border-purple-500/40 text-purple-300">
            <Skull className="w-3 h-3 text-purple-400" /> 幽冥暗黑
          </span>
        );
      case 'plant':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-lime-950/80 border border-lime-500/40 text-lime-300">
            <TreePine className="w-3 h-3 text-lime-400" /> 植物生灵
          </span>
        );
      case 'divine':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-950/90 border border-yellow-400 text-yellow-200 shadow-sm">
            <Sparkles className="w-3 h-3 text-yellow-300" /> 神级本源
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 border border-slate-700 text-slate-300">
            物理强攻
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Forest Header Banner */}
      <div
        className={`bg-gradient-to-r ${currentZoneConfig.bannerBg} border rounded-3xl p-6 relative overflow-hidden shadow-xl transition-all`}
      >
        <div className="absolute top-0 right-0 w-96 h-full bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TreePine className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-black text-slate-100">{currentZoneConfig.name}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentZoneConfig.badgeColor}`}>
                {currentZoneConfig.subtitle}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {currentZoneConfig.desc}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-700 px-4 py-2.5 rounded-2xl text-xs space-y-1 shrink-0 shadow-lg flex flex-col justify-between">
            <div>
              当前境界: <strong className={rankInfo.colorClass}>{rankInfo.title} (Lv.{player.level})</strong>
            </div>
            <div>
              已配魂环: <strong className="text-amber-400">{currentRingsCount} / {rankInfo.maxRings} 环</strong>
            </div>
            <div>
              大师安全上限: <strong className="text-cyan-400">{currentSafeLimit.toLocaleString()} 年</strong>
            </div>
            <button
              onClick={() => {
                SoundEngine.playClick();
                setShowFusionModal(true);
              }}
              className="mt-1 px-3 py-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold rounded-xl text-[11px] shadow transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <Layers className="w-3 h-3 text-amber-300" />
              <span>开启魂环融合大阵</span>
            </button>
          </div>
        </div>

        {/* Patrol Quick Action & Log */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-200 italic flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{explorationLog}</span>
          </div>
          <button
            onClick={handlePatrolForest}
            className="px-4 py-1.5 bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-500/50 text-emerald-200 text-xs font-semibold rounded-xl transition-all shrink-0 hover:scale-105 active:scale-95"
          >
            巡查周边动向
          </button>
        </div>
      </div>

      {/* ZONE SELECTOR TABS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 tracking-wider">选择猎杀区域（七大生态猎场）</span>
          <span className="text-xs text-slate-400">
            已收录魂兽: <strong className="text-emerald-400">{SOUL_BEASTS_DB.length} 种</strong>
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {zoneConfigs.map(zone => {
            const isSelected = selectedZone === zone.id;
            const zoneBeastCount = SOUL_BEASTS_DB.filter(b => b.habitat === zone.id).length;
            return (
              <button
                key={zone.id}
                onClick={() => {
                  SoundEngine.playClick();
                  setSelectedZone(zone.id);
                }}
                className={`p-3 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-xs ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                    {zone.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                    {zoneBeastCount}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">{zone.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTERS & SEARCH BAR */}
      <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Color / Tier Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> 魂环年限:
          </span>
          {[
            { id: 'all', label: '全部' },
            { id: 'yellow', label: '百年 (黄)' },
            { id: 'purple', label: '千年 (紫)' },
            { id: 'black', label: '万年 (黑)' },
            { id: 'red', label: '十万年 (红)' },
            { id: 'gold', label: '百万年 (金)' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                SoundEngine.playClick();
                setSelectedColorFilter(f.id as any);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedColorFilter === f.id
                  ? 'bg-slate-700 text-amber-300 border border-amber-500/50 shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索魂兽名称 / 属性 / 魂技..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {/* SOUL BEASTS GRID */}
      {filteredBeasts.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <TreePine className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <p className="text-sm font-semibold">未找到符合条件的魂兽</p>
          <p className="text-xs text-slate-500">请尝试清除筛选条件或更换搜索关键词</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBeasts.map(beast => {
            const isSafe = beast.years <= currentSafeLimit;
            const isBoss = beast.years >= 100000;

            return (
              <div
                key={beast.id}
                className={`bg-slate-900/95 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] group relative overflow-hidden ${
                  isBoss
                    ? 'border-red-500/50 hover:border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                    : 'border-slate-800 hover:border-emerald-500/60'
                }`}
              >
                {/* Background glow for high tier */}
                {isBoss && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
                )}

                <div>
                  {/* Top Beast Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-slate-100 group-hover:text-emerald-300 transition-colors">
                          {beast.chineseName}
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-400">{beast.name}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-black border tracking-wide ${
                          beast.color === 'gold'
                            ? 'border-yellow-400 bg-yellow-950/80 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.4)]'
                            : beast.color === 'red'
                            ? 'border-red-500 bg-red-950/80 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                            : beast.color === 'black'
                            ? 'border-neutral-700 bg-neutral-950 text-neutral-200'
                            : beast.color === 'purple'
                            ? 'border-purple-500 bg-purple-950/80 text-purple-300'
                            : 'border-amber-400 bg-amber-950/80 text-amber-300'
                        }`}
                      >
                        {beast.years >= 10000 ? `${(beast.years / 10000).toFixed(0)}万年` : `${beast.years}年`}
                      </span>

                      {/* Element Badge */}
                      {getElementBadge(beast.element)}
                    </div>
                  </div>

                  {/* Lore Description */}
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed line-clamp-3">
                    {beast.description}
                  </p>

                  {/* Beast Attributes Summary */}
                  <div className="grid grid-cols-4 gap-2 bg-slate-950/80 p-2.5 rounded-xl text-[11px] text-slate-400 mt-3 border border-slate-800">
                    <div>
                      等级: <span className="text-slate-200 font-semibold">{beast.level}</span>
                    </div>
                    <div>
                      生命: <span className="text-rose-400 font-semibold">{beast.hp.toLocaleString()}</span>
                    </div>
                    <div>
                      攻击: <span className="text-amber-400 font-semibold">{beast.atk}</span>
                    </div>
                    <div>
                      防御: <span className="text-blue-400 font-semibold">{beast.def}</span>
                    </div>
                  </div>

                  {/* Beast Signature Skills Preview */}
                  <div className="mt-3 space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-400">魂兽核心技能:</div>
                    <div className="space-y-1">
                      {beast.skills.map((sk, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950/50 p-1.5 rounded-lg text-[11px] flex items-start justify-between gap-2 border border-slate-800/80"
                        >
                          <span className="font-semibold text-slate-200">{sk.name}</span>
                          <span className="text-slate-400 truncate text-[10px] text-right max-w-[150px]">
                            {sk.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Possible Drops */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-1.5 text-xs">
                    <div className="text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">
                        产出魂技: <strong className="text-amber-300">{beast.dropRing.skillNameTemplate}</strong>
                      </span>
                    </div>

                    {beast.possibleBone && (
                      <div className="text-purple-300 flex items-center gap-1.5 font-semibold">
                        <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="truncate">
                          概率掉落魂骨: {beast.possibleBone.name}
                          <span className="text-[10px] text-purple-400 ml-1 font-normal">
                            ({Math.floor(beast.possibleBone.dropRate * 100)}%)
                          </span>
                        </span>
                      </div>
                    )}

                    {beast.dropItems && beast.dropItems.length > 0 && (
                      <div className="text-amber-300/90 flex items-center gap-1.5 flex-wrap text-[11px] font-medium pt-1">
                        <Hammer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>材料掉落:</span>
                        {beast.dropItems.map((drop, dIdx) => (
                          <span key={dIdx} className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-[10px]">
                            {drop.name} ({Math.floor(drop.dropRate * 100)}%)
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Safety advice indicator */}
                  <div className="mt-2.5">
                    {isSafe ? (
                      <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span>可安全吸收 · 处于大师理论界限内</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                        <ShieldAlert className="w-3 h-3 shrink-0 text-amber-400" />
                        <span>越级吸收 · 需承受狂暴灵魂震荡</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hunt Button */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => handleStartHunt(beast)}
                    className={`w-full py-2.5 font-black rounded-xl text-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 shadow-md ${
                      isBoss
                        ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950'
                    }`}
                  >
                    <Swords className="w-4 h-4" />
                    {isBoss ? '挑战十万年凶兽 · 夺取红环！' : '猎杀魂兽 · 吸收魂环！'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SOUL RING FUSION MODAL */}
      {showFusionModal && (
        <SoulRingFusionModal 
          player={player}
          onUpdatePlayer={onUpdatePlayer || (() => {})}
          onClose={() => setShowFusionModal(false)}
          showToast={showToast}
        />
      )}
    </div>
  );
};
