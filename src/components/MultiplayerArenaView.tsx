import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../types/game';
import {
  OnlinePlayerProfile,
  ChatMessage,
  PvpRoomState,
  DirectDuelChallenge,
  CoopRoomState,
  GlobalLeaderboardData,
  PvpSkillState
} from '../types/multiplayer';
import { multiplayerClient } from '../utils/multiplayerClient';
import { SoundEngine } from '../utils/audio';
import { getSoulRingColorHex } from '../data/martialSouls';
import confetti from 'canvas-confetti';
import {
  Swords, Users, Trophy, MessageSquare, Shield, Zap, Sparkles,
  Flame, Crown, Radio, Send, Play, X, UserPlus,
  RefreshCw, Award, Heart, Skull, AlertCircle, CheckCircle2,
  ChevronRight, Swords as DuelIcon, Activity
} from 'lucide-react';

interface MultiplayerArenaViewProps {
  player: Player;
  onUpdatePlayer: (updater: (prev: Player) => Player) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'gold') => void;
}

type TabType = 'lobby' | 'pvp' | 'coop' | 'leaderboard';

export const MultiplayerArenaView: React.FC<MultiplayerArenaViewProps> = ({
  player,
  onUpdatePlayer,
  onShowToast
}) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('pvp');

  // Socket state
  const [isConnected, setIsConnected] = useState(multiplayerClient.getIsConnected());
  const [latency, setLatency] = useState(multiplayerClient.getLatency());
  const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayerProfile[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatChannel, setChatChannel] = useState<'world' | 'pvp' | 'team'>('world');

  // PVP Battle State
  const [activePvpRoom, setActivePvpRoom] = useState<PvpRoomState | null>(null);
  const [isQueueing, setIsQueueing] = useState(false);
  const [queueMessage, setQueueMessage] = useState('正在全服匹配旗鼓相当的魂师对手...');
  const [queueTimer, setQueueTimer] = useState(0);

  // Incoming Challenge Modal
  const [incomingChallenge, setIncomingChallenge] = useState<DirectDuelChallenge | null>(null);

  // Inspect Player Modal
  const [inspectedPlayer, setInspectedPlayer] = useState<OnlinePlayerProfile | null>(null);

  // Co-op Raid State
  const [activeCoopRoom, setActiveCoopRoom] = useState<CoopRoomState | null>(null);
  const [selectedBossId, setSelectedBossId] = useState<string>('deep_sea_whale');

  // Leaderboard State
  const [leaderboardData, setLeaderboardData] = useState<GlobalLeaderboardData | null>(null);
  const [leaderboardTab, setLeaderboardTab] = useState<'pvp' | 'power' | 'raid'>('pvp');

  // Floating damage animation
  const [floatingEffects, setFloatingEffects] = useState<{ id: string; text: string; isCrit?: boolean; isHeal?: boolean; isPlayerTarget?: boolean }[]>([]);

  // Battle victory modal
  const [battleResultModal, setBattleResultModal] = useState<{ isWinner: boolean; winnerName: string; rewards?: any } | null>(null);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const battleLogsRef = useRef<HTMLDivElement>(null);

  // 1. Initialize & Sync Player
  useEffect(() => {
    multiplayerClient.syncPlayer(player);
    // Fallback initial leaderboard fetch
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data && (data.topPvp || data.topPower)) {
          setLeaderboardData(data);
        }
      })
      .catch(() => {});
  }, [player]);

  // 2. Register Socket Event Handlers
  useEffect(() => {
    const unsubOnline = multiplayerClient.onOnlinePlayers(players => {
      setOnlinePlayers(players || []);
      setIsConnected(true);
      setLatency(multiplayerClient.getLatency());
    });

    const unsubChatHist = multiplayerClient.onChatHistory(history => {
      setChatMessages(history || []);
    });

    const unsubChat = multiplayerClient.onChatMessage(msg => {
      setChatMessages(prev => [...prev.slice(-60), msg]);
      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      }, 50);
    });

    const unsubChallenge = multiplayerClient.onChallenge(chal => {
      SoundEngine.playSoulRingAura('red');
      setIncomingChallenge(chal);
    });

    const unsubPvpStart = multiplayerClient.onPvpStart(room => {
      SoundEngine.playSoulRingAura('gold');
      setActivePvpRoom(room);
      setIsQueueing(false);
      setActiveTab('pvp');
      onShowToast(`⚔️ 与【${room.hostId === player.name ? room.guestFighter?.name : room.hostFighter.name}】的实时斗魂切磋正式开启！`, 'gold');
    });

    const unsubPvpUpdate = multiplayerClient.onPvpUpdate(room => {
      setActivePvpRoom(room);
      setTimeout(() => {
        if (battleLogsRef.current) {
          battleLogsRef.current.scrollTop = 0;
        }
      }, 50);
    });

    const unsubPvpEnd = multiplayerClient.onPvpEnd(result => {
      const isWinner = result.winnerId === player.name;
      if (isWinner) {
        SoundEngine.playVictory();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        // Award Player
        onUpdatePlayer(prev => ({
          ...prev,
          arenaPoints: Math.max(1000, (prev.arenaPoints || 1200) + (result.rewards?.pointsChange || 25)),
          arenaWins: (prev.arenaWins || 0) + 1,
          championMedals: (prev.championMedals || 0) + (result.rewards?.arenaMedals || 50),
          gold: prev.gold + (result.rewards?.gold || 5000),
          currentExp: prev.currentExp + (result.rewards?.exp || 8000)
        }));
      } else {
        SoundEngine.playDefeat();
        onUpdatePlayer(prev => ({
          ...prev,
          arenaPoints: Math.max(1000, (prev.arenaPoints || 1200) - 15),
          arenaLosses: (prev.arenaLosses || 0) + 1,
          championMedals: (prev.championMedals || 0) + 10,
          gold: prev.gold + 1000
        }));
      }

      setBattleResultModal({
        isWinner,
        winnerName: result.winnerName,
        rewards: result.rewards
      });
    });

    const unsubCoop = multiplayerClient.onCoopUpdate(coop => {
      setActiveCoopRoom(coop);
      if (coop.status === 'victory' && coop.rewards) {
        SoundEngine.playVictory();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        onUpdatePlayer(prev => ({
          ...prev,
          gold: prev.gold + (coop.rewards?.gold || 30000),
          championMedals: (prev.championMedals || 0) + (coop.rewards?.championMedals || 100),
          soulBoneEssence: (prev.soulBoneEssence || 0) + (coop.rewards?.soulBoneEssence || 200),
          divineMetals: {
            ...(prev.divineMetals || {}),
            '天锻神金': ((prev.divineMetals || {})['天锻神金'] || (prev.divineMetals || {})['Heavenly Divine Gold'] || 0) + 5,
            '至高神核原石': ((prev.divineMetals || {})['至高神核原石'] || (prev.divineMetals || {})['Supreme God Origin Stone'] || 0) + 2
          }
        }));
        onShowToast(`🎉 成功击溃讨伐凶兽【${coop.boss.name}】！天锻神金与神祇宝藏已入库！`, 'gold');
      }
    });

    const unsubLeaderboard = multiplayerClient.onLeaderboard(data => {
      setLeaderboardData(data);
    });

    const unsubQueue = multiplayerClient.onQueueStatus(st => {
      setIsQueueing(st.inQueue);
      if (st.message) setQueueMessage(st.message);
    });

    const unsubToast = multiplayerClient.onToast(t => {
      onShowToast(t.message, t.type);
    });

    // Heartbeat ping interval
    const pingInterval = setInterval(() => {
      setIsConnected(multiplayerClient.getIsConnected());
      setLatency(multiplayerClient.getLatency());
    }, 3000);

    return () => {
      unsubOnline();
      unsubChatHist();
      unsubChat();
      unsubChallenge();
      unsubPvpStart();
      unsubPvpUpdate();
      unsubPvpEnd();
      unsubCoop();
      unsubLeaderboard();
      unsubQueue();
      unsubToast();
      clearInterval(pingInterval);
    };
  }, [player, onShowToast, onUpdatePlayer]);

  // Queue timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isQueueing) {
      setQueueTimer(0);
      interval = setInterval(() => {
        setQueueTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQueueing]);

  // Floating damage effect trigger
  const triggerFloat = (text: string, isCrit = false, isHeal = false, isPlayerTarget = false) => {
    const id = `f_${Date.now()}_${Math.random()}`;
    setFloatingEffects(prev => [...prev, { id, text, isCrit, isHeal, isPlayerTarget }]);
    setTimeout(() => {
      setFloatingEffects(prev => prev.filter(f => f.id !== id));
    }, 1200);
  };

  // Handle Send Chat
  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    SoundEngine.playClick();
    multiplayerClient.sendChatMessage(chatChannel, chatInput);
    setChatInput('');
  };

  // Handle Quick Chat Preset
  const handleSendQuickChat = (text: string, tag: string) => {
    SoundEngine.playClick();
    multiplayerClient.sendChatMessage('world', text, tag);
  };

  // Handle Challenge Player
  const handleChallengePlayer = (target: OnlinePlayerProfile, mode: 'friendly' | 'ranked' = 'friendly') => {
    SoundEngine.playClick();
    if (target.id === player.name) {
      onShowToast('不可挑战自己！', 'info');
      return;
    }
    multiplayerClient.sendChallenge(target.id, mode);
    setInspectedPlayer(null);
  };

  // Handle Accept/Decline Challenge
  const handleRespondChallenge = (accepted: boolean) => {
    if (!incomingChallenge) return;
    SoundEngine.playClick();
    multiplayerClient.respondChallenge(incomingChallenge.challengeId, accepted);
    setIncomingChallenge(null);
  };

  // Handle Matchmaking
  const handleToggleMatchmaking = () => {
    SoundEngine.playClick();
    if (isQueueing) {
      multiplayerClient.cancelMatchmaking();
      setIsQueueing(false);
    } else {
      multiplayerClient.queueMatchmaking();
    }
  };

  // PVP In-Battle Actions
  const handlePvpAction = (actionType: any, skillId?: string, weaponId?: string) => {
    if (!activePvpRoom) return;
    const isMyTurn = activePvpRoom.currentTurnPlayerId === player.name;
    if (!isMyTurn) {
      onShowToast('尚未轮到您的行动回合！', 'info');
      return;
    }

    if (actionType === 'normal_attack') {
      SoundEngine.playSlash();
      triggerFloat('普通近战重击', false, false, false);
    } else if (actionType === 'cast_skill') {
      SoundEngine.playSmash();
      triggerFloat('武魂魂技轰击💥', true, false, false);
    } else if (actionType === 'activate_avatar') {
      SoundEngine.playSoulRingAura('gold');
      triggerFloat('武魂真身降临✨', false, true, true);
    } else if (actionType === 'activate_domain') {
      SoundEngine.playSoulRingAura('red');
      triggerFloat('神级领域展开🌀', false, false, true);
    } else if (actionType === 'activate_battle_armor') {
      SoundEngine.playThunder();
      triggerFloat('五字斗铠·神御引爆👑', true, false, true);
    } else if (actionType === 'use_hidden_weapon') {
      SoundEngine.playSlash();
      triggerFloat('唐门绝顶暗器齐射🎯', true, false, false);
    }

    multiplayerClient.sendPvpAction(activePvpRoom.id, actionType, skillId, weaponId);
  };

  // Start Co-op Raid
  const handleStartCoop = (bossId: string) => {
    SoundEngine.playSoulRingAura('red');
    multiplayerClient.createCoopRoom(bossId);
    setActiveTab('coop');
  };

  // Co-op Raid Attack
  const handleCoopAttack = (skillMult = 2.8) => {
    if (!activeCoopRoom || activeCoopRoom.status !== 'fighting') return;
    SoundEngine.playSmash();
    multiplayerClient.sendCoopAction(activeCoopRoom.id, '合力神技突袭', skillMult);
  };

  // Current battle fighters
  const isHost = activePvpRoom?.hostFighter.id === player.name;
  const myFighter = isHost ? activePvpRoom?.hostFighter : activePvpRoom?.guestFighter;
  const enemyFighter = isHost ? activePvpRoom?.guestFighter : activePvpRoom?.hostFighter;
  const isMyTurn = activePvpRoom?.currentTurnPlayerId === player.name;

  // Safe leaderboard list getter to prevent undefined errors
  const currentLeaderboardList = ((leaderboardTab === 'pvp' ? leaderboardData?.topPvp : leaderboardData?.topPower) || []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 pb-12">
      {/* 1. TOP STATUS & NAVIGATION HEADER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Title & Live Status */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Radio className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-rose-400">
                  全大陆跨服实时大斗魂场
                </h2>
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  全服在线: {onlinePlayers.length} 位强者
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                实时 1v1 天梯排位 · 跨服魂师切磋广场 · 组队讨伐百万年凶兽 · 传音切磋
              </p>
            </div>
          </div>

          {/* Player PVP Rating Badge */}
          <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 px-4 py-2 rounded-xl w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <div className="text-xs text-slate-400">天梯徽章 / 积分</div>
              <div className="text-sm font-black text-amber-300 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                {player.arenaPoints || 1200} 分 · {player.arenaBadge || '铁斗魂'}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-xs">
              <div className="text-slate-400">天梯战绩</div>
              <div className="font-bold text-emerald-400">
                {player.arenaWins || 0}胜 <span className="text-slate-500">/</span> <span className="text-rose-400">{player.arenaLosses || 0}负</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Primary Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800/80">
          <button
            onClick={() => {
              SoundEngine.playClick();
              setActiveTab('pvp');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'pvp'
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-600/30 scale-[1.02]'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4" />
            实时 1v1 天梯排位
            {activePvpRoom && activePvpRoom.status === 'in_battle' && (
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => {
              SoundEngine.playClick();
              setActiveTab('lobby');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'lobby'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            魂师广场 & 切磋传音
          </button>

          <button
            onClick={() => {
              SoundEngine.playClick();
              setActiveTab('coop');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'coop'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 scale-[1.02]'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            跨服组队·凶兽副本
          </button>

          <button
            onClick={() => {
              SoundEngine.playClick();
              setActiveTab('leaderboard');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg shadow-amber-600/30 scale-[1.02]'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            全大陆封神荣誉榜
          </button>
        </div>
      </div>

      {/* ================= TAB 1: REAL-TIME 1V1 PVP ARENA ================= */}
      {activeTab === 'pvp' && (
        <div className="space-y-4">
          {!activePvpRoom || activePvpRoom.status === 'ended' ? (
            /* PVP MATCHMAKING & LOBBY VIEW */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Left Column: Quick Matchmaking & Ranked Banner */}
              <div className="lg:col-span-2 space-y-4">
                <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-b from-slate-900 via-rose-950/20 to-slate-950 p-6 shadow-2xl">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black tracking-widest text-rose-400 uppercase bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                          S1 赛季 · 全大陆斗魂巅峰天梯赛
                        </span>
                        <h3 className="text-2xl font-black text-white mt-2 flex items-center gap-2">
                          <Swords className="w-7 h-7 text-rose-400" />
                          跨服 1v1 实时天梯匹配
                        </h3>
                        <p className="text-sm text-slate-400 mt-1 max-w-xl">
                          秒级匹配全服在线顶尖魂师！支持九大魂技、武魂真身、神级领域、五字斗铠与唐门暗器实时博弈对决！
                        </p>
                      </div>
                    </div>

                    {/* Matchmaking CTA Radar Box */}
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 text-center space-y-4">
                      {isQueueing ? (
                        <div className="space-y-4 py-6">
                          <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 rounded-full border-4 border-rose-500/20 animate-ping" />
                            <div className="absolute inset-2 rounded-full border-2 border-dashed border-rose-400 animate-spin" />
                            <div className="w-full h-full rounded-full bg-rose-950/50 flex items-center justify-center">
                              <Swords className="w-10 h-10 text-rose-400 animate-bounce" />
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-black text-white">{queueMessage}</div>
                            <div className="text-xs text-rose-400 font-mono mt-1">匹配耗时: {queueTimer}秒</div>
                          </div>
                          <button
                            onClick={handleToggleMatchmaking}
                            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors"
                          >
                            取消匹配
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4 py-4">
                          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 获胜: +25 天梯积分
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 奖励 50 冠军勋章
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 15秒 回合倒计时
                            </div>
                          </div>

                          <button
                            onClick={handleToggleMatchmaking}
                            className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 text-white font-black text-lg shadow-xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all"
                          >
                            <Play className="w-6 h-6 fill-current group-hover:rotate-12 transition-transform" />
                            开始排位匹配
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Quick Challenge Recommendations */}
                    <div>
                      <div className="text-xs font-bold text-slate-400 mb-3 flex items-center justify-between">
                        <span>🏛️ 在线封号斗罗与各路豪杰（点击直接切磋）:</span>
                        <span className="text-slate-500">实时天梯同步</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {onlinePlayers.slice(0, 4).map(p => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-rose-500/40 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={p.avatarUrl}
                                alt={p.name}
                                className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                              />
                              <div>
                                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                                  {p.name}
                                  {p.isAi && (
                                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded">名宿</span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-400">
                                  Lv.{p.level} · {p.martialSoulName}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleChallengePlayer(p, 'ranked')}
                              className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold transition-all border border-rose-500/30"
                            >
                              下战书切磋
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Player PVP Stats & Recent Arena Champions */}
              <div className="space-y-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    我的大斗魂场战阶
                  </h4>

                  <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">斗魂徽章段位</span>
                      <span className="text-xs font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        {player.arenaBadge || '铁斗魂'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">天梯斗魂积分</span>
                      <span className="text-sm font-black text-white">{player.arenaPoints || 1200} 分</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">天梯胜率</span>
                      <span className="text-xs font-bold text-emerald-400">
                        {player.arenaWins || 0}胜 / {player.arenaLosses || 0}负 (
                        {Math.round(
                          ((player.arenaWins || 0) / Math.max(1, (player.arenaWins || 0) + (player.arenaLosses || 0))) * 100
                        )}
                        %)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">累积冠军勋章</span>
                      <span className="text-xs font-bold text-yellow-400">{player.championMedals || 0} 枚</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-200/90 space-y-1">
                    <div className="font-bold">💡 斗魂赛制与奖励说明:</div>
                    <p>• 击败更高段位的封号斗罗可赢取更多天梯积分与冠军勋章。</p>
                    <p>• 冠军勋章可前往唐门与魂骨圣殿兑换稀有神金与高阶魂骨原石！</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= LIVE ACTIVE 1V1 PVP BATTLE STAGE ================= */
            <div className="space-y-4">
              {/* Battle Header */}
              <div className="bg-slate-900/95 border border-rose-500/40 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black animate-pulse">
                      🔥 实时斗魂对决 (第 {activePvpRoom.turnCount} 回合)
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline">{activePvpRoom.roomName}</span>
                  </div>

                  {/* Turn Indicator & Countdown */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">行动倒计时</div>
                      <div className={`text-base font-black ${isMyTurn ? 'text-emerald-400 animate-bounce' : 'text-rose-400'}`}>
                        {activePvpRoom.turnTimeRemaining || 15}秒
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-xl font-black text-sm shadow-md ${
                      isMyTurn
                        ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                        : 'bg-rose-950 text-rose-300 border border-rose-800/50'
                    }`}>
                      {isMyTurn ? '🟢 轮到您的行动回合' : '🔴 对手正在沉思施法...'}
                    </div>
                  </div>
                </div>

                {/* 2-Column Duel Stage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  
                  {/* LEFT: MY FIGHTER */}
                  {myFighter && (
                    <div className={`p-4 rounded-2xl border transition-all ${
                      isMyTurn ? 'bg-slate-950/90 border-emerald-500/60 shadow-lg shadow-emerald-500/10' : 'bg-slate-950/60 border-slate-800'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={myFighter.avatarUrl}
                              alt={myFighter.name}
                              className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-md"
                            />
                            {myFighter.isAvatarActive && (
                              <span className="absolute -top-1 -right-1 text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                                真身
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="text-base font-black text-white flex items-center gap-2">
                              {myFighter.name} (您)
                              {myFighter.battleArmorRank && myFighter.battleArmorRank !== 'none' && (
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                                  {myFighter.battleArmorCustomName || '神级斗铠'}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-emerald-400 font-semibold">
                              Lv.{myFighter.level} · {myFighter.martialSoulName}
                            </div>
                          </div>
                        </div>

                        <div className="text-right text-xs">
                          <div className="text-slate-400">攻击 / 防御</div>
                          <div className="font-mono font-bold text-slate-200">
                            {myFighter.atk} / {myFighter.def}
                          </div>
                        </div>
                      </div>

                      {/* HP Bar */}
                      <div className="space-y-1 mb-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-400">生命值 (HP)</span>
                          <span className="text-emerald-400">
                            {myFighter.hp} / {myFighter.maxHp}
                            {myFighter.shield > 0 && <span className="text-cyan-300 ml-1">+{myFighter.shield} 护盾</span>}
                          </span>
                        </div>
                        <div className="h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(0, (myFighter.hp / myFighter.maxHp) * 100))}%` }}
                          />
                        </div>
                      </div>

                      {/* Soul Power Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-400">魂力值 (MP)</span>
                          <span className="text-cyan-400">{myFighter.soulPower} / {myFighter.maxSoulPower}</span>
                        </div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden p-0.2 border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(0, (myFighter.soulPower / myFighter.maxSoulPower) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* RIGHT: OPPONENT FIGHTER */}
                  {enemyFighter && (
                    <div className={`p-4 rounded-2xl border transition-all ${
                      !isMyTurn ? 'bg-slate-950/90 border-rose-500/60 shadow-lg shadow-rose-500/10' : 'bg-slate-950/60 border-slate-800'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={enemyFighter.avatarUrl}
                              alt={enemyFighter.name}
                              className="w-14 h-14 rounded-full object-cover border-2 border-rose-400 shadow-md"
                            />
                            {enemyFighter.isAvatarActive && (
                              <span className="absolute -top-1 -right-1 text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded-full">
                                真身
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="text-base font-black text-white flex items-center gap-2">
                              {enemyFighter.name} (对手)
                              {enemyFighter.battleArmorRank && enemyFighter.battleArmorRank !== 'none' && (
                                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded">
                                  {enemyFighter.battleArmorCustomName || '神级斗铠'}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-rose-400 font-semibold">
                              Lv.{enemyFighter.level} · {enemyFighter.martialSoulName}
                            </div>
                          </div>
                        </div>

                        <div className="text-right text-xs">
                          <div className="text-slate-400">攻击 / 防御</div>
                          <div className="font-mono font-bold text-slate-200">
                            {enemyFighter.atk} / {enemyFighter.def}
                          </div>
                        </div>
                      </div>

                      {/* HP Bar */}
                      <div className="space-y-1 mb-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-400">生命值 (HP)</span>
                          <span className="text-rose-400">
                            {enemyFighter.hp} / {enemyFighter.maxHp}
                            {enemyFighter.shield > 0 && <span className="text-cyan-300 ml-1">+{enemyFighter.shield} 护盾</span>}
                          </span>
                        </div>
                        <div className="h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(0, (enemyFighter.hp / enemyFighter.maxHp) * 100))}%` }}
                          />
                        </div>
                      </div>

                      {/* Soul Power Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-400">魂力值 (MP)</span>
                          <span className="text-cyan-400">{enemyFighter.soulPower} / {enemyFighter.maxSoulPower}</span>
                        </div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden p-0.2 border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(0, (enemyFighter.soulPower / enemyFighter.maxSoulPower) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Player Combat Action Tray */}
              {myFighter && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      战术战法行动控制台:
                    </h4>
                    <div className="text-xs text-slate-400">
                      当前剩余魂力: <span className="text-cyan-400 font-bold">{myFighter.soulPower}</span> 点
                    </div>
                  </div>

                  {/* Special Stances & Powers */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      disabled={!isMyTurn}
                      onClick={() => handlePvpAction('normal_attack')}
                      className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all disabled:opacity-40"
                    >
                      <Swords className="w-4 h-4 text-amber-400" />
                      近身普攻 (+15 魂力)
                    </button>

                    <button
                      disabled={!isMyTurn || myFighter.isAvatarActive || myFighter.soulPower < 30}
                      onClick={() => handlePvpAction('activate_avatar')}
                      className={`p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-40 ${
                        myFighter.isAvatarActive
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white hover:scale-105'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      {myFighter.isAvatarActive ? '武魂真身显化中' : '释放武魂真身 (-30 魂力)'}
                    </button>

                    <button
                      disabled={!isMyTurn || myFighter.isDomainActive || myFighter.soulPower < 25}
                      onClick={() => handlePvpAction('activate_domain')}
                      className={`p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-40 ${
                        myFighter.isDomainActive
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:scale-105'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      {myFighter.isDomainActive ? '神级领域生效中' : '展开神级领域 (-25 魂力)'}
                    </button>

                    <button
                      disabled={!isMyTurn || !myFighter.battleArmorSkillAvailable}
                      onClick={() => handlePvpAction('activate_battle_armor')}
                      className={`p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-40 ${
                        myFighter.battleArmorSkillAvailable
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105'
                          : 'bg-slate-800/40 text-slate-500 border border-slate-800'
                      }`}
                    >
                      <Crown className="w-4 h-4 text-amber-400" />
                      斗铠神御充能 (护盾+光炮)
                    </button>
                  </div>

                  {/* 9 Soul Skills Palette */}
                  <div>
                    <div className="text-xs text-slate-400 mb-2 font-bold">九大魂环魂技连招池:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {myFighter.skills.map((skill, sIdx) => {
                        const canCast = isMyTurn && myFighter.soulPower >= skill.soulPowerCost && skill.currentCooldown === 0;
                        const ringColor = getSoulRingColorHex(skill.ringYears);

                        return (
                          <button
                            key={skill.id || sIdx}
                            disabled={!canCast}
                            onClick={() => handlePvpAction('cast_skill', skill.id)}
                            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                              canCast
                                ? 'bg-slate-950 hover:bg-slate-850 hover:border-amber-400/50 hover:scale-[1.02] cursor-pointer'
                                : 'bg-slate-950/40 opacity-50 cursor-not-allowed'
                            } border-slate-800`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                                <span
                                  className="w-2.5 h-2.5 rounded-full inline-block"
                                  style={{ backgroundColor: ringColor }}
                                />
                                {skill.name}
                              </div>
                              <span className="text-[10px] text-cyan-300 font-mono">
                                消耗 {skill.soulPowerCost} 魂力
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-400 line-clamp-2">{skill.description}</p>

                            {skill.currentCooldown > 0 && (
                              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center font-bold text-xs text-amber-400">
                                冷却中 ({skill.currentCooldown} 回合)
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tang Sect Weapons & Surrender */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">唐门绝顶暗器:</span>
                      {myFighter.hiddenWeapons.map(hw => (
                        <button
                          key={hw.id}
                          disabled={!isMyTurn || hw.count <= 0}
                          onClick={() => handlePvpAction('use_hidden_weapon', undefined, hw.id)}
                          className="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all disabled:opacity-40"
                        >
                          {hw.name} (余 {hw.count} 次)
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePvpAction('surrender')}
                      className="text-xs text-slate-500 hover:text-rose-400 font-semibold transition-colors"
                    >
                      认输投降
                    </button>
                  </div>
                </div>
              )}

              {/* Real-time Combat Log Feed */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  实时斗魂战况日志:
                </div>
                <div
                  ref={battleLogsRef}
                  className="max-h-36 overflow-y-auto space-y-1.5 text-xs font-mono pr-2"
                >
                  {activePvpRoom.battleLogs.map(log => (
                    <div
                      key={log.id}
                      className={`p-1.5 rounded bg-slate-950/70 border ${
                        log.type === 'system'
                          ? 'border-indigo-500/30 text-indigo-200'
                          : log.type === 'skill'
                          ? 'border-amber-500/30 text-amber-200'
                          : log.type === 'avatar' || log.type === 'domain' || log.type === 'armor'
                          ? 'border-rose-500/30 text-rose-200 font-bold'
                          : 'border-slate-800 text-slate-300'
                      }`}
                    >
                      {log.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: ONLINE LOBBY & WORLD CHAT ================= */}
      {activeTab === 'lobby' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Left 2 Cols: Online Players Roster */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    全大陆在线魂师切磋广场
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    实时检索全服在线强者、检视武魂斗铠配置、下战书切磋或组队共赴凶兽副本
                  </p>
                </div>

                <button
                  onClick={() => {
                    SoundEngine.playClick();
                    multiplayerClient.syncPlayer(player);
                    onShowToast('已刷新在线魂师列表', 'info');
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Player Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {onlinePlayers.map(p => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatarUrl}
                          alt={p.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/40 group-hover:border-amber-400 transition-colors"
                        />
                        <div>
                          <div className="font-bold text-sm text-white flex items-center gap-1.5">
                            {p.name}
                            {p.id === player.name && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded">我</span>
                            )}
                            {p.isAi && (
                              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded">名宿</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">{p.title}</div>
                          <div className="text-[11px] text-amber-300 font-mono mt-0.5">
                            综合战力: {p.battlePower?.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {p.status === 'in_pvp' ? '⚔️ 斗魂切磋中' : p.status === 'in_coop' ? '🐉 凶兽讨伐中' : '🟢 空闲静修'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/80">
                      <button
                        onClick={() => setInspectedPlayer(p)}
                        className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        检视配置
                      </button>

                      {p.id !== player.name && (
                        <button
                          onClick={() => handleChallengePlayer(p, 'ranked')}
                          className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 hover:scale-102 text-white text-xs font-bold transition-all"
                        >
                          下战书切磋
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Cross-Server Chat Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col h-[560px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                千里传音传讯阁
              </h3>
              
              <div className="flex gap-1 text-[11px]">
                {(['world', 'pvp', 'team'] as const).map(ch => (
                  <button
                    key={ch}
                    onClick={() => setChatChannel(ch)}
                    className={`px-2 py-0.5 rounded ${
                      chatChannel === ch ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ch === 'world' ? '世界' : ch === 'pvp' ? '斗魂' : '战队'}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages List */}
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1 text-xs"
            >
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl border space-y-1 ${
                    msg.isSystem
                      ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'
                      : msg.senderId === player.name
                      ? 'bg-slate-950 border-cyan-500/30'
                      : 'bg-slate-950/70 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-amber-300">{msg.senderName}</span>
                      {msg.tag && (
                        <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                          {msg.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-slate-500 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Quick Shout-out Presets */}
            <div className="flex gap-1.5 overflow-x-auto py-2 border-t border-slate-800/80 text-[11px]">
              <button
                onClick={() => handleSendQuickChat('【斗魂切磋】在下刚领悟神级魂技，可有道友在大斗魂场一战？', '【天梯约战】')}
                className="whitespace-nowrap px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                ⚔️ 约战传音
              </button>
              <button
                onClick={() => handleSendQuickChat('【凶兽招募】深海魔鲸王副本缺强攻与控制，速速进队！', '【凶兽讨伐】')}
                className="whitespace-nowrap px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                🐉 招募战友
              </button>
              <button
                onClick={() => handleSendQuickChat('【斗铠交流】求教五字天锻斗铠的神御融合心得！', '【宗门论道】')}
                className="whitespace-nowrap px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                👑 斗铠研讨
              </button>
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="发送跨服千里传音 (回车发送)..."
                maxLength={100}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= TAB 3: MULTIPLAYER CO-OP RAIDS ================= */}
      {activeTab === 'coop' && (
        <div className="space-y-4">
          {!activeCoopRoom ? (
            /* RAID DUNGEON SELECTION & LOBBY */
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <span className="text-xs font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  跨服组队 · 百万年凶兽与深红主宰讨伐战
                </span>
                <h3 className="text-2xl font-black text-white mt-2 flex items-center gap-2">
                  <Flame className="w-7 h-7 text-emerald-400" />
                  集结 2~4 位魂师合力弑神屠龙
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  组建弑神先锋小队！合体施展武魂融合技与斗铠重炮，共享十万年魂骨原石与天锻神金掉落！
                </p>
              </div>

              {/* Bosses Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Boss 1 */}
                <div
                  onClick={() => setSelectedBossId('deep_sea_whale')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedBossId === 'deep_sea_whale'
                      ? 'bg-slate-950 border-cyan-500 shadow-xl shadow-cyan-500/10 scale-102'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&auto=format&fit=crop&q=80"
                      alt="深海魔鲸王"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-xs font-black text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                      百万年海魂兽霸主
                    </span>
                  </div>
                  <h4 className="font-black text-base text-white">深海魔鲸王</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    生命: 500,000 · 产出天锻神金、十万年魂骨原石与神祇勋章
                  </p>
                </div>

                {/* Boss 2 */}
                <div
                  onClick={() => setSelectedBossId('evil_eye_tyrant')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedBossId === 'evil_eye_tyrant'
                      ? 'bg-slate-950 border-purple-500 shadow-xl shadow-purple-500/10 scale-102'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80"
                      alt="邪眼暴君主宰"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-xs font-black text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                      七十九万年精神系灾厄
                    </span>
                  </div>
                  <h4 className="font-black text-base text-white">邪眼暴君主宰</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    生命: 420,000 · 产出毁灭魂核与至高神核原石
                  </p>
                </div>

                {/* Boss 3 */}
                <div
                  onClick={() => setSelectedBossId('crimson_mother')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedBossId === 'crimson_mother'
                      ? 'bg-slate-950 border-rose-500 shadow-xl shadow-rose-500/10 scale-102'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80"
                      alt="深红之母"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-xs font-black text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
                      深红神王级位面位阶
                    </span>
                  </div>
                  <h4 className="font-black text-base text-white">深红之母</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    生命: 880,000 · 产出专属弑神先锋称号与大量神界珍宝
                  </p>
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center pt-4">
                <button
                  onClick={() => handleStartCoop(selectedBossId)}
                  className="px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white font-black text-base shadow-xl shadow-emerald-600/30 hover:scale-105 transition-all inline-flex items-center gap-3"
                >
                  <Flame className="w-5 h-5" />
                  开启弑神讨伐战队
                </button>
              </div>
            </div>
          ) : (
            /* ================= LIVE CO-OP RAID BATTLE STAGE ================= */
            <div className="space-y-4">
              <div className="bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-6 space-y-6 shadow-2xl">
                
                {/* Boss Health Bar & Stage */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>⚔️ 讨伐战队: {activeCoopRoom.roomName}</span>
                    <span className="text-amber-400 font-bold">第 {activeCoopRoom.currentTurn} 回合</span>
                  </div>

                  <div className="relative max-w-2xl mx-auto space-y-1">
                    <div className="flex justify-between text-sm font-black">
                      <span className="text-rose-400 flex items-center gap-1.5">
                        <Skull className="w-4 h-4" />
                        {activeCoopRoom.boss.name}
                      </span>
                      <span className="text-white font-mono">
                        {activeCoopRoom.boss.hp.toLocaleString()} / {activeCoopRoom.boss.maxHp.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-rose-500/40">
                      <div
                        className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.max(0, (activeCoopRoom.boss.hp / activeCoopRoom.boss.maxHp) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Team Members Grid & DPS Meters */}
                <div>
                  <div className="text-xs font-bold text-slate-400 mb-3">小队成员状态与实时伤害输出贡献:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {activeCoopRoom.members.map(member => (
                      <div
                        key={member.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover border border-emerald-400"
                          />
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1">
                              {member.name}
                              {member.id === player.name && (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded">我</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">Lv.{member.level} · {member.martialSoulName}</div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">生命值</span>
                            <span className="text-emerald-400 font-mono">{member.hp} / {member.maxHp}</span>
                          </div>
                          <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500"
                              style={{ width: `${Math.min(100, Math.max(0, (member.hp / member.maxHp) * 100))}%` }}
                            />
                          </div>
                        </div>

                        <div className="text-[11px] text-amber-300 font-mono">
                          累积输出伤害: {member.totalDamageDealt?.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Combat Controls */}
                {activeCoopRoom.status === 'fighting' ? (
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => handleCoopAttack(1.8)}
                      className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                    >
                      标准突击
                    </button>
                    <button
                      onClick={() => handleCoopAttack(3.5)}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:scale-105 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all"
                    >
                      ⚡ 万年绝学齐射
                    </button>
                    <button
                      onClick={() => handleCoopAttack(6.0)}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:scale-105 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all"
                    >
                      👑 神铠合体·武魂融合神技
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-3">
                    <div className="text-xl font-black text-amber-300">🎉 凶兽已被成功剿灭！小队大获全胜！</div>
                    <button
                      onClick={() => setActiveCoopRoom(null)}
                      className="px-8 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm"
                    >
                      返回讨伐大厅
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: GLOBAL LEADERBOARD & HALL OF FAME ================= */}
      {activeTab === 'leaderboard' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <Crown className="w-7 h-7 text-amber-400" />
                全大陆封神荣誉名人堂
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                实时跨服天梯排位百强、绝世斗罗神级战力榜与凶兽弑神竞速纪录
              </p>
            </div>

            {/* Sub Tabs */}
            <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setLeaderboardTab('pvp')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  leaderboardTab === 'pvp' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                天梯斗魂榜
              </button>
              <button
                onClick={() => setLeaderboardTab('power')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  leaderboardTab === 'power' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                综合战力榜
              </button>
              <button
                onClick={() => setLeaderboardTab('raid')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  leaderboardTab === 'raid' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                弑神竞速榜
              </button>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            {leaderboardTab === 'raid' ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">排名</th>
                    <th className="py-3 px-4">战队名号</th>
                    <th className="py-3 px-4">讨伐凶兽</th>
                    <th className="py-3 px-4">先锋队长</th>
                    <th className="py-3 px-4">总输出伤害</th>
                    <th className="py-3 px-4 text-right">通关时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(leaderboardData?.topRaid || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        暂无弑神讨伐纪录，快成为全大陆首支通关战队！
                      </td>
                    </tr>
                  ) : (
                    (leaderboardData?.topRaid || []).map((raid, idx) => (
                      <tr key={raid.rank || idx} className="hover:bg-slate-950/60 transition-colors">
                        <td className="py-3.5 px-4 font-black">
                          {idx === 0 ? (
                            <span className="text-amber-300 font-bold text-base flex items-center gap-1">🥇 1</span>
                          ) : idx === 1 ? (
                            <span className="text-slate-300 font-bold text-base flex items-center gap-1">🥈 2</span>
                          ) : idx === 2 ? (
                            <span className="text-amber-600 font-bold text-base flex items-center gap-1">🥉 3</span>
                          ) : (
                            <span className="text-slate-400">{idx + 1}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">{raid.teamName}</td>
                        <td className="py-3.5 px-4 text-emerald-400 font-semibold">{raid.bossName}</td>
                        <td className="py-3.5 px-4 text-amber-300">{raid.leaderName}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-rose-400">
                          {raid.totalDamage?.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-400 font-mono">{raid.clearedAt}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">排名</th>
                    <th className="py-3 px-4">封号斗罗</th>
                    <th className="py-3 px-4">主修武魂</th>
                    <th className="py-3 px-4">魂力等级</th>
                    <th className="py-3 px-4">
                      {leaderboardTab === 'pvp' ? '天梯积分 / 胜率' : '综合战力'}
                    </th>
                    <th className="py-3 px-4 text-right">切磋</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentLeaderboardList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        正在同步全服名人堂数据...
                      </td>
                    </tr>
                  ) : (
                    currentLeaderboardList.map((user, idx) => (
                      <tr key={user.id} className="hover:bg-slate-950/60 transition-colors">
                        <td className="py-3.5 px-4 font-black">
                          {idx === 0 ? (
                            <span className="text-amber-300 font-bold text-base flex items-center gap-1">🥇 1</span>
                          ) : idx === 1 ? (
                            <span className="text-slate-300 font-bold text-base flex items-center gap-1">🥈 2</span>
                          ) : idx === 2 ? (
                            <span className="text-amber-600 font-bold text-base flex items-center gap-1">🥉 3</span>
                          ) : (
                            <span className="text-slate-400">{idx + 1}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover border border-amber-400/40"
                            />
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                {user.name}
                                {user.id === player.name && (
                                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded">我</span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400">{user.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-semibold">{user.martialSoulName}</td>
                        <td className="py-3.5 px-4 text-amber-300 font-bold">Lv.{user.level}</td>
                        <td className="py-3.5 px-4">
                          {leaderboardTab === 'pvp' ? (
                            <div>
                              <span className="font-black text-amber-400">{user.pvpPoints} 分</span>
                              <span className="text-slate-500 ml-1.5">({user.winRate}% 胜率)</span>
                            </div>
                          ) : (
                            <span className="font-mono font-bold text-rose-400">{user.battlePower?.toLocaleString()}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {user.id !== player.name && (
                            <button
                              onClick={() => handleChallengePlayer(user, 'ranked')}
                              className="px-3 py-1 rounded bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold transition-all border border-rose-500/30"
                            >
                              切磋
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ================= INCOMING DUEL CHALLENGE MODAL ================= */}
      {incomingChallenge && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center mx-auto">
                <Swords className="w-7 h-7 text-rose-400 animate-bounce" />
              </div>
              <h3 className="text-xl font-black text-white">收到实时斗魂切磋战书！</h3>
              <p className="text-xs text-slate-400">
                有魂师向您发起 1v1 大斗魂场实时切磋挑战！
              </p>
            </div>

            {/* Challenger Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <img
                src={incomingChallenge.challenger.avatarUrl}
                alt={incomingChallenge.challenger.name}
                className="w-12 h-12 rounded-full object-cover border border-amber-400"
              />
              <div>
                <div className="font-bold text-sm text-white">{incomingChallenge.challenger.name}</div>
                <div className="text-xs text-slate-400">
                  Lv.{incomingChallenge.challenger.level} · {incomingChallenge.challenger.martialSoulName}
                </div>
                <div className="text-[11px] text-amber-300 font-mono">
                  综合战力: {incomingChallenge.challenger.battlePower?.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleRespondChallenge(false)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                谢绝切磋
              </button>
              <button
                onClick={() => handleRespondChallenge(true)}
                className="py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30 hover:scale-102 transition-all"
              >
                🔥 应战对决
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= INSPECT PLAYER BUILD MODAL ================= */}
      {inspectedPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                魂师造诣与配置详情
              </h3>
              <button
                onClick={() => setInspectedPlayer(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={inspectedPlayer.avatarUrl}
                alt={inspectedPlayer.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400"
              />
              <div>
                <div className="text-lg font-black text-white">{inspectedPlayer.name}</div>
                <div className="text-xs text-slate-400">{inspectedPlayer.title}</div>
                <div className="text-xs text-amber-300 font-mono mt-1">
                  综合战力: {inspectedPlayer.battlePower?.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">主修武魂</span>
                <div className="font-bold text-white mt-0.5">{inspectedPlayer.martialSoulName}</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">神级斗铠</span>
                <div className="font-bold text-amber-300 mt-0.5">{inspectedPlayer.battleArmorName || '尚未打造'}</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">天梯积分</span>
                <div className="font-bold text-white mt-0.5">{inspectedPlayer.pvpPoints} 分</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">神祇神位</span>
                <div className="font-bold text-rose-300 mt-0.5">{inspectedPlayer.godPosition || '凡俗修行'}</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleChallengePlayer(inspectedPlayer, 'ranked')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 hover:scale-102 transition-all"
              >
                ⚔️ 发起排位斗魂对决
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= BATTLE VICTORY / DEFEAT RESULT MODAL ================= */}
      {battleResultModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400/80 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-amber-500/20 border-2 border-amber-400 shadow-lg">
              {battleResultModal.isWinner ? (
                <Trophy className="w-8 h-8 text-amber-300 animate-bounce" />
              ) : (
                <Skull className="w-8 h-8 text-rose-400" />
              )}
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">
                {battleResultModal.isWinner ? '🏆 斗魂大获全胜！' : '⚔️ 遗憾惜败'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {battleResultModal.isWinner
                  ? `您展现了无双的神级技艺与领域神威，击败了【${battleResultModal.winnerName}】！`
                  : '胜败乃修行常事，继续淬炼高年份魂环与五字斗铠，来日再战！'}
              </p>
            </div>

            {/* Rewards Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-300">斗魂战果结算:</div>
              <div className="flex justify-between text-slate-400">
                <span>天梯积分变动</span>
                <span className={battleResultModal.isWinner ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                  {battleResultModal.isWinner ? '+25 积分' : '-15 积分'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>获得冠军勋章</span>
                <span className="text-yellow-400 font-bold">
                  +{battleResultModal.isWinner ? 50 : 10} 枚
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setBattleResultModal(null);
                setActivePvpRoom(null);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-black text-sm shadow-lg shadow-amber-600/30 hover:scale-102 transition-all"
            >
              返回斗魂大厅
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
