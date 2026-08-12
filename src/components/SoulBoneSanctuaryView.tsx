import React, { useState } from 'react';
import { Player, SoulBone, SoulBoneSanctuaryTrial, SoulBoneAuctionItem, SoulBoneSlot } from '../types/game';
import { SOUL_BONE_TRIALS, INITIAL_AUCTION_ITEMS } from '../data/soulBoneSanctuary';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Skull, Sparkles, Swords, Shield, Zap, Flame, 
  Crown, Award, ShoppingBag, ArrowUpCircle, RefreshCw, CheckCircle2
} from 'lucide-react';

interface SoulBoneSanctuaryViewProps {
  player: Player;
  onUpdatePlayer: (updater: (prev: Player) => Player) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
}

export const SoulBoneSanctuaryView: React.FC<SoulBoneSanctuaryViewProps> = ({
  player,
  onUpdatePlayer,
  showToast
}) => {
  const [subTab, setSubTab] = useState<'trials' | 'auction' | 'upgrade'>('trials');
  const [trials, setTrials] = useState<SoulBoneSanctuaryTrial[]>(SOUL_BONE_TRIALS);
  const [auctionItems, setAuctionItems] = useState<SoulBoneAuctionItem[]>(INITIAL_AUCTION_ITEMS);
  const [isChallenging, setIsChallenging] = useState(false);
  const [selectedBoneSlot, setSelectedBoneSlot] = useState<SoulBoneSlot>('head');

  // Challenge secret realm trial for guaranteed soul bone
  const handleChallengeTrial = (trial: SoulBoneSanctuaryTrial) => {
    if (player.level < trial.recommendedLevel) {
      showToast(`等级不足！建议达到 Lv.${trial.recommendedLevel} 再来挑战！`, 'warning');
      return;
    }

    setIsChallenging(true);
    SoundEngine.playBattle();

    setTimeout(() => {
      setIsChallenging(false);

      const isWin = player.level >= trial.recommendedLevel - 5;
      if (isWin) {
        SoundEngine.playVictory();
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

        const newBone: SoulBone = {
          id: `bone_${trial.id}`,
          name: trial.rewardBoneName,
          slot: trial.slot,
          years: trial.rewardBoneYears,
          color: trial.rewardBoneYears >= 1000000 ? 'gold' : trial.rewardBoneYears >= 100000 ? 'red' : 'black',
          sourceBeast: trial.guardianName,
          description: trial.rewardBoneDesc,
          atkBonus: Math.floor(trial.rewardBoneYears / 200),
          defBonus: Math.floor(trial.rewardBoneYears / 250),
          hpBonus: Math.floor(trial.rewardBoneYears / 25),
          speedBonus: Math.floor(trial.rewardBoneYears / 1500),
          critBonus: Math.min(30, Math.floor(trial.rewardBoneYears / 10000)),
          skillName: `${trial.rewardBoneName}·至尊神技`,
          skillDesc: `引动${trial.guardianName}之神威，对敌造成毁灭打击！`,
          skillCooldown: 4,
          equipped: true
        };

        onUpdatePlayer(prev => {
          const currentBones = { ...(prev.soulBones || {}) };
          currentBones[trial.slot] = newBone;

          return {
            ...prev,
            soulBones: currentBones,
            soulBoneEssence: (prev.soulBoneEssence || 200) + 150,
            gold: prev.gold + 5000
          };
        });

        setTrials(prev => prev.map(t => t.id === trial.id ? { ...t, cleared: true } : t));
        showToast(`恭喜斩获【${trial.rewardBoneName}】并已自动装备！获得魂骨精华+150！`, 'success');
      } else {
        SoundEngine.playDefeat();
        showToast(`挑战【${trial.guardianName}】失利！请提升战力后再战！`, 'error');
      }
    }, 1200);
  };

  // Buy auction soul bone
  const handleBuyAuctionItem = (item: SoulBoneAuctionItem) => {
    if (player.gold < item.buyoutPrice) {
      showToast(`金魂币不足！一口价需 ${item.buyoutPrice} 金魂币`, 'warning');
      return;
    }

    SoundEngine.playLevelUp();

    onUpdatePlayer(prev => {
      const currentBones = { ...(prev.soulBones || {}) };
      currentBones[item.bone.slot] = { ...item.bone, equipped: true };

      return {
        ...prev,
        gold: prev.gold - item.buyoutPrice,
        soulBones: currentBones
      };
    });

    setAuctionItems(prev => prev.map(a => a.id === item.id ? { ...a, sold: true } : a));
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    showToast(`拍卖竞得【${item.bone.name}】并已直接装配上身！`, 'success');
  };

  // Upgrade / evolve equipped soul bone years using Soul Bone Essence
  const handleUpgradeSoulBoneYears = (slot: SoulBoneSlot) => {
    const bone = player.soulBones?.[slot];
    if (!bone) {
      showToast('该部位尚未装备魂骨！请先通过秘境或拍卖获取', 'warning');
      return;
    }

    const essenceCost = Math.floor(bone.years / 1000) + 50;
    const currentEssence = player.soulBoneEssence || 0;

    if (currentEssence < essenceCost) {
      showToast(`魂骨精华不足！需要 ${essenceCost} 点精华，当前拥有 ${currentEssence} 点`, 'warning');
      return;
    }

    SoundEngine.playForge();

    const addedYears = 20000;
    const newYears = bone.years + addedYears;
    const newColor = newYears >= 1000000 ? 'gold' : newYears >= 100000 ? 'red' : 'black';

    onUpdatePlayer(prev => {
      const currentBones = { ...(prev.soulBones || {}) };
      if (currentBones[slot]) {
        currentBones[slot] = {
          ...currentBones[slot]!,
          years: newYears,
          color: newColor,
          atkBonus: Math.floor(currentBones[slot]!.atkBonus * 1.2),
          defBonus: Math.floor(currentBones[slot]!.defBonus * 1.2),
          hpBonus: Math.floor(currentBones[slot]!.hpBonus * 1.2),
          critBonus: Math.min(40, (currentBones[slot]!.critBonus || 5) + 3)
        };
      }

      return {
        ...prev,
        soulBoneEssence: currentEssence - essenceCost,
        soulBones: currentBones
      };
    });

    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    showToast(`【${bone.name}】年份淬炼暴涨至 ${(newYears / 10000).toFixed(1)}万年！`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/70 to-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-900/60 border border-rose-400/40 rounded-2xl text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.5)]">
              <Skull className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-amber-300">
                万古魂骨秘境 · 拍卖珍宝行
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                探索暗金恐爪熊巢穴、山龙王圣冢与百万年深海魔窟！斩获外附魂骨与十万年至尊神骨，淬炼神化之威。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => { SoundEngine.playClick(); setSubTab('trials'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                subTab === 'trials'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>秘境试炼</span>
            </button>
            <button
              onClick={() => { SoundEngine.playClick(); setSubTab('auction'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                subTab === 'auction'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>黑市拍卖</span>
            </button>
            <button
              onClick={() => { SoundEngine.playClick(); setSubTab('upgrade'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                subTab === 'upgrade'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpCircle className="w-3.5 h-3.5" />
              <span>年份淬炼</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. SECRET REALMS TRIALS */}
      {subTab === 'trials' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trials.map(trial => (
              <div
                key={trial.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  trial.cleared
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-slate-800 bg-slate-900/90 shadow-lg'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded-full font-bold border border-rose-500/30">
                        推荐 Lv.{trial.recommendedLevel}
                      </span>
                      <h4 className="text-base font-black text-slate-100 mt-1">{trial.name}</h4>
                    </div>

                    {trial.cleared && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>已通关</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {trial.desc}
                  </p>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>守关巨兽:</span>
                      <strong className="text-rose-400">{trial.guardianName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>必得神骨:</span>
                      <strong className="text-amber-300">{trial.rewardBoneName}</strong>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {trial.rewardBoneDesc}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleChallengeTrial(trial)}
                  disabled={isChallenging}
                  className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:brightness-110 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Swords className="w-4 h-4" />
                  <span>{trial.cleared ? '再次挑战试炼' : '开启秘境对决'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. AUCTION HOUSE */}
      {subTab === 'auction' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {auctionItems.map(item => (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full font-bold">
                      {(item.bone.years / 10000).toFixed(0)}万年极品
                    </span>
                    <span className="text-[10px] text-slate-400">{item.seller}</span>
                  </div>

                  <h4 className="text-base font-black text-amber-300 mb-1">{item.bone.name}</h4>
                  <p className="text-xs text-slate-300 mb-3">{item.bone.description}</p>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1 mb-4">
                    <div className="text-cyan-300 font-mono">
                      攻+{item.bone.atkBonus} 防+{item.bone.defBonus} 命+{item.bone.hpBonus}
                    </div>
                    <div className="text-amber-400 font-medium">
                      附带技能: {item.bone.skillName}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-right text-xs mb-2">
                    <span className="text-slate-400">一口价: </span>
                    <strong className="text-amber-400 font-mono text-sm">{item.buyoutPrice} 金魂币</strong>
                  </div>

                  <button
                    onClick={() => handleBuyAuctionItem(item)}
                    disabled={item.sold}
                    className={`w-full py-2 rounded-xl text-xs font-black transition-all ${
                      item.sold
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 shadow-md'
                    }`}
                  >
                    {item.sold ? '已拍下' : '一口价竞购'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SOUL BONE YEARS UPGRADE */}
      {subTab === 'upgrade' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-black text-slate-100 text-base flex items-center gap-2">
                <ArrowUpCircle className="w-5 h-5 text-purple-400" />
                <span>魂骨年份淬炼与神化突破</span>
              </h3>
              <p className="text-xs text-slate-400">
                消耗魂骨精华，将已装备的魂骨年份向十万年、百万年神级突破，大幅强化属性并提升神骨技能威能！
              </p>
            </div>

            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-purple-500/30 text-xs">
              <span className="text-slate-400">拥有魂骨精华: </span>
              <strong className="text-purple-300 font-mono text-sm">{player.soulBoneEssence || 0}</strong>
            </div>
          </div>

          {/* 6 SLOTS LIST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { slot: 'head' as SoulBoneSlot, name: '头部魂骨' },
              { slot: 'torso' as SoulBoneSlot, name: '躯干魂骨' },
              { slot: 'leftArm' as SoulBoneSlot, name: '左臂魂骨' },
              { slot: 'rightArm' as SoulBoneSlot, name: '右臂魂骨' },
              { slot: 'leftLeg' as SoulBoneSlot, name: '左腿魂骨' },
              { slot: 'rightLeg' as SoulBoneSlot, name: '右腿魂骨' },
              { slot: 'external' as SoulBoneSlot, name: '外附魂骨' }
            ].map(s => {
              const bone = player.soulBones?.[s.slot];
              return (
                <div
                  key={s.slot}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300">{s.name}</span>
                      {bone && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          bone.years >= 1000000 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' :
                          bone.years >= 100000 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                          'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        }`}>
                          {(bone.years / 10000).toFixed(1)}万年
                        </span>
                      )}
                    </div>

                    {bone ? (
                      <div>
                        <h4 className="text-xs font-black text-amber-300">{bone.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{bone.description}</p>
                        <div className="text-[10px] text-cyan-300 font-mono mt-2">
                          攻+{bone.atkBonus} 防+{bone.defBonus} 命+{bone.hpBonus}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 py-3 text-center">
                        未装备该部位魂骨
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleUpgradeSoulBoneYears(s.slot)}
                      disabled={!bone}
                      className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                        bone
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow'
                          : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      年份淬炼 (+2万年)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
