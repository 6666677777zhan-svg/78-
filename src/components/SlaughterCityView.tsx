import React, { useState } from 'react';
import { Player, CombatEntity } from '../types/game';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Skull, Swords, Flame, Sparkles, Award, ShieldAlert } from 'lucide-react';

interface SlaughterCityViewProps {
  player: Player;
  onInitiateSlaughterCombat: (enemy: CombatEntity, isBoss: boolean) => void;
  onAcquireKillingDomain: () => void;
}

export const SlaughterCityView: React.FC<SlaughterCityViewProps> = ({
  player,
  onInitiateSlaughterCombat,
  onAcquireKillingDomain
}) => {
  const [activeTab, setActiveTab] = useState<'arena' | 'hellroad'>('arena');

  const streak = player.slaughterStreak || 0;
  const hasDomain = player.hasKillingGodDomain;

  const handleFightArena = () => {
    SoundEngine.playClick();

    // Slaughter arena gladiator
    const lvl = Math.min(85, 30 + streak * 2);
    const gladiator: CombatEntity = {
      id: `slaughter_gladiator_${streak + 1}`,
      name: `地狱死士·杀戮者 (第${streak + 1}战)`,
      isPlayer: false,
      avatarIcon: 'Skull',
      level: lvl,
      hp: 2500 + streak * 400,
      maxHp: 2500 + streak * 400,
      soulPower: 0, // Sealed!
      maxSoulPower: 0,
      atk: 150 + streak * 25,
      def: 80 + streak * 15,
      speed: 40 + streak * 3,
      critRate: 20,
      shield: 0,
      actionGauge: 0,
      buffs: [],
      debuffs: [],
      soulRings: [],
      skills: [
        {
          id: 'slash_blood',
          name: '嗜血血刃斩',
          ringOrder: 1,
          ringYears: 1000,
          ringColor: 'yellow',
          soulPowerCost: 0,
          cooldown: 2,
          description: '以纯粹肉体力量挥出沾满剧毒鲜血的刀芒！',
          damageMultiplier: 1.6
        }
      ]
    };

    onInitiateSlaughterCombat(gladiator, false);
  };

  const handleFightTenHeadedSerpent = () => {
    SoundEngine.playClick();

    const serpentBoss: CombatEntity = {
      id: 'ten_headed_serpent',
      name: '洪荒异兽·十首烈阳蛇',
      isPlayer: false,
      avatarIcon: 'Skull',
      level: 88,
      hp: 48000,
      maxHp: 48000,
      soulPower: 100,
      maxSoulPower: 100,
      atk: 1250,
      def: 720,
      speed: 85,
      critRate: 25,
      shield: 0,
      actionGauge: 0,
      buffs: [],
      debuffs: [],
      soulRings: [{ years: 70000, color: 'black' }],
      skills: [
        {
          id: 'serpent_fire',
          name: '十首烈阳真火',
          ringOrder: 1,
          ringYears: 70000,
          ringColor: 'black',
          soulPowerCost: 0,
          cooldown: 2,
          description: '喷吐焚尽经脉与灵魂的至阳烈火！',
          damageMultiplier: 2.8
        },
        {
          id: 'serpent_smash',
          name: '洪荒巨蟒扫尾',
          ringOrder: 2,
          ringYears: 70000,
          ringColor: 'black',
          soulPowerCost: 0,
          cooldown: 3,
          description: '千钧蛇躯轰碎地狱路血池！',
          damageMultiplier: 3.5
        }
      ]
    };

    onInitiateSlaughterCombat(serpentBoss, true);
  };

  return (
    <div className="space-y-6">
      
      {/* BANNER */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border border-red-500/50 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Skull className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-black text-slate-100">罪恶之都·杀戮之都 & 地狱路</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              修罗神留下的神之试炼场！此处【一切魂技皆被法则封印】，唯有唐门暗器与玄天功绝学方能大显神威。斩获百胜并闯过地狱路，即可凝聚终极【杀神领域】！
            </p>
          </div>

          <div className="bg-slate-950/90 border border-red-900/60 p-3 rounded-2xl text-xs space-y-1">
            <div>杀戮场连胜：<strong className="text-red-400 font-bold">{streak} / 100 场</strong></div>
            <div>领域状态：<strong className={hasDomain ? 'text-amber-400 font-bold' : 'text-slate-500'}>
              {hasDomain ? '已觉醒【杀神领域】' : '尚未获得'}
            </strong></div>
          </div>
        </div>
      </div>

      {/* CONTENT TABS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT: SLAUGHTER ARENA (100 WINS) */}
        <div className="bg-slate-900/90 border border-red-900/40 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Swords className="w-5 h-5 text-red-400" />
              <h3 className="font-bold text-base text-slate-100">地狱杀戮场·生死决斗</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              十人一组入场，仅有一人能够活着走出血腥擂台！每获胜一场，杀戮值与血煞之气都会大幅累积。魂技封印状态下，极其考验你的肉身防御与暗器手法！
            </p>

            <div className="mt-4 bg-slate-950/80 p-3 rounded-xl border border-red-950 text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>当前百胜进度：</span>
                <span className="text-red-400 font-bold">{streak}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-600 to-rose-400 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, streak)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800">
            <button
              onClick={handleFightArena}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold rounded-xl text-xs transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg"
            >
              <Skull className="w-4 h-4" />
              踏入擂台·决战生死！
            </button>
          </div>
        </div>

        {/* RIGHT: HELL ROAD BOSS TRIAL */}
        <div className="bg-slate-900/90 border border-red-900/40 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-slate-100">地狱路·十首烈阳蛇守关</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              百胜达成后方可开启的通往人间之狭窄血路！下方是无尽滚烫血池，暗金三头蝙蝠王与洪荒异兽【十首烈阳蛇】阻拦在前。将其击毙不仅可获得神兽内丹，更能淬炼杀气凝聚【杀神领域】！
            </p>

            <div className="mt-4 bg-slate-950/80 p-3 rounded-xl border border-red-950 text-xs text-amber-300 space-y-1">
              <div><strong>杀神领域威能：</strong>降低敌方全属性20%，我方攻击力暴增25%，杀意如狂！</div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800">
            <button
              onClick={handleFightTenHeadedSerpent}
              disabled={hasDomain}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center justify-center gap-2 ${
                hasDomain
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-slate-950 font-black shadow-lg'
              }`}
            >
              {hasDomain ? '已获杀神领域·地狱路已通' : '勇闯地狱路·斩杀十首烈阳蛇！'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
