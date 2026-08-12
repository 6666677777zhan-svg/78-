import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../types/game';
import { ChatMessage, OnlinePlayerProfile } from '../types/multiplayer';
import { multiplayerClient } from '../utils/multiplayerClient';
import { SoundEngine } from '../utils/audio';
import { getSoulRankTitle } from '../data/martialSouls';
import {
  MessageSquare,
  Send,
  Radio,
  X,
  Sparkles,
  Swords,
  Users,
  ShieldAlert,
  Flame,
  Award,
  Crown,
  Share2,
  Bell
} from 'lucide-react';

interface GlobalChatDrawerProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
}

type ChatChannel = 'all' | 'world' | 'god' | 'team' | 'sect' | 'system';

export const GlobalChatDrawer: React.FC<GlobalChatDrawerProps> = ({
  player,
  isOpen,
  onClose
}) => {
  const [activeChannel, setActiveChannel] = useState<ChatChannel>('all');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [onlineCount, setOnlineCount] = useState(1);
  const [hasNewUnread, setHasNewUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSoul = player.martialSouls[player.activeSoulIndex] || player.martialSouls[0];
  const rankInfo = getSoulRankTitle(player.level);

  // Approximate Battle Power
  const approxPower = Math.floor(
    (player.level * 500) +
    (activeSoul.baseAtk * 12) +
    (activeSoul.skills.reduce((sum, s) => sum + s.ringYears, 0) / 10) +
    (player.arenaPoints || 1000) * 5
  );

  useEffect(() => {
    const unsubHistory = multiplayerClient.onChatHistory((history) => {
      setMessages(history || []);
    });

    const unsubChat = multiplayerClient.onChatMessage((msg) => {
      setMessages((prev) => [...prev, msg]);
      if (!isOpen) {
        setHasNewUnread(true);
      }
    });

    const unsubPlayers = multiplayerClient.onOnlinePlayers((players) => {
      setOnlineCount(players.length || 1);
    });

    return () => {
      unsubHistory();
      unsubChat();
      unsubPlayers();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasNewUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    SoundEngine.playClick();
    const targetChannel = activeChannel === 'all' ? 'world' : activeChannel;
    multiplayerClient.sendChatMessage(targetChannel, inputText.trim());
    setInputText('');
  };

  const handleQuickBroadcast = (type: 'power' | 'difficulty' | 'team' | 'breakthrough') => {
    SoundEngine.playBreakthrough();
    let broadcastContent = '';
    let tag = '全服传音';
    const diffTitle = player.worldDifficulty === 'godlike' ? '深红极难 ⚡' : player.worldDifficulty === 'nightmare' ? '修罗地狱 🔥' : '凡俗之路';

    switch (type) {
      case 'power':
        broadcastContent = `【魂师威仪】在下【${player.name}】（Lv.${player.level} ${rankInfo.title}），执掌神级武魂【${activeSoul.name}】，综合战力已破 ${approxPower.toLocaleString()}！诚邀大陆各路封号斗罗切磋赐教！`;
        tag = '战力通榜';
        break;
      case 'difficulty':
        broadcastContent = `【纪元试炼】我已踏足【${diffTitle}】纪元！猎杀万年魂兽如探囊取物，诸位道友速速跟上！`;
        tag = '难度纪元';
        break;
      case 'team':
        broadcastContent = `【跨服招募】【Lv.${player.level} ${player.name}】诚邀各路神级强者组队讨伐生命之湖与凶兽神魔！速速进队！`;
        tag = '战队招募';
        break;
      case 'breakthrough':
        broadcastContent = `【天地异象】【${player.name}】已成功融合 ${activeSoul.skills.length} 枚至尊魂环，神光冲霄，引动神界震颤！`;
        tag = '境界突破';
        break;
    }

    multiplayerClient.sendChatMessage('world', broadcastContent, tag);
  };

  const filteredMessages = messages.filter((m) => {
    if (activeChannel === 'all') return true;
    return m.channel === activeChannel || m.channel === 'system';
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-lg bg-slate-900 border-l border-purple-500/30 flex flex-col h-full shadow-2xl text-slate-100 relative animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-slate-100">跨服千里传音阁</h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-bold text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  在线强者: {onlineCount} 人
                </span>
              </div>
              <p className="text-[11px] text-slate-400">实时接收全服道友修行动态、弑神讨伐战报与传音通告</p>
            </div>
          </div>
          <button
            onClick={() => {
              SoundEngine.playClick();
              onClose();
            }}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Selector Tabs */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-800/80 bg-slate-900/90 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'all', label: '综合', icon: MessageSquare },
            { id: 'world', label: '世界', icon: Radio },
            { id: 'god', label: '神界', icon: Crown },
            { id: 'team', label: '副本战队', icon: Users },
            { id: 'sect', label: '宗门堂口', icon: Swords },
            { id: 'system', label: '天道神谕', icon: Bell }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeChannel === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  SoundEngine.playClick();
                  setActiveChannel(tab.id as ChatChannel);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shrink-0 transition-all border ${
                  isSelected
                    ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Broadcast Shortcuts Toolbar */}
        <div className="px-3 py-2 bg-purple-950/20 border-b border-purple-900/30 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-purple-300 font-bold shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" /> 一键通报:
          </span>
          <button
            onClick={() => handleQuickBroadcast('power')}
            className="px-2 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 font-semibold hover:brightness-125 transition-all shrink-0 flex items-center gap-1"
          >
            <Crown className="w-3 h-3" /> 亮出战力
          </button>
          <button
            onClick={() => handleQuickBroadcast('difficulty')}
            className="px-2 py-1 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 font-semibold hover:brightness-125 transition-all shrink-0 flex items-center gap-1"
          >
            <Flame className="w-3 h-3" /> 难度宣告
          </button>
          <button
            onClick={() => handleQuickBroadcast('team')}
            className="px-2 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-semibold hover:brightness-125 transition-all shrink-0 flex items-center gap-1"
          >
            <Users className="w-3 h-3" /> 组队招募
          </button>
          <button
            onClick={() => handleQuickBroadcast('breakthrough')}
            className="px-2 py-1 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300 font-semibold hover:brightness-125 transition-all shrink-0 flex items-center gap-1"
          >
            <Award className="w-3 h-3" /> 境界天象
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
              <Radio className="w-12 h-12 stroke-[1.2] text-slate-700 mb-2 animate-pulse" />
              <p className="text-xs">当前频道暂无传音讯息</p>
              <p className="text-[11px] text-slate-600 mt-1">点击上方一键通报或在下方输入文字即可全服传音！</p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isMe = msg.senderName === player.name || msg.senderId === player.name;
              const isSys = msg.senderName === 'Heaven Dao' || msg.senderName === '天道神谕' || msg.channel === 'system';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  {/* Sender metadata info */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    {msg.tag && (
                      <span className="px-1.5 py-0.2 rounded bg-purple-900/60 border border-purple-500/40 text-purple-300 font-semibold">
                        {msg.tag}
                      </span>
                    )}
                    {msg.senderTitle && (
                      <span className="text-amber-400 font-semibold">[{msg.senderTitle}]</span>
                    )}
                    <span className={`font-bold ${isMe ? 'text-cyan-300' : isSys ? 'text-yellow-400' : 'text-slate-200'}`}>
                      {msg.senderName}
                    </span>
                    <span className="text-slate-600">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      isSys
                        ? 'bg-gradient-to-r from-amber-950/80 to-yellow-950/80 border border-amber-500/50 text-amber-200 shadow-md font-medium'
                        : isMe
                        ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-br-none shadow-md'
                        : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`向【${activeChannel === 'all' ? '世界' : activeChannel === 'god' ? '神界' : activeChannel === 'team' ? '副本战队' : activeChannel === 'sect' ? '宗门' : '世界'}】发送千里传音...`}
              maxLength={120}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shrink-0 active:scale-95 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>发送</span>
          </button>
        </form>

      </div>
    </div>
  );
};
