import { io, Socket } from 'socket.io-client';
import { Player } from '../types/game';
import {
  OnlinePlayerProfile,
  ChatMessage,
  PvpRoomState,
  PvpActionRequest,
  DirectDuelChallenge,
  CoopRoomState,
  GlobalLeaderboardData
} from '../types/multiplayer';
import { getSoulRankTitle } from '../data/martialSouls';

class MultiplayerClient {
  private socket: Socket | null = null;
  private isConnected = false;
  private latency = 0;
  private lastPingTime = 0;

  // Cached state for late subscribers
  private cachedOnlinePlayers: OnlinePlayerProfile[] = [];
  private cachedChatHistory: ChatMessage[] = [];
  private cachedLeaderboard: GlobalLeaderboardData | null = null;

  // Listeners
  private onlinePlayersListeners: ((players: OnlinePlayerProfile[]) => void)[] = [];
  private chatListeners: ((msg: ChatMessage) => void)[] = [];
  private chatHistoryListeners: ((history: ChatMessage[]) => void)[] = [];
  private challengeListeners: ((challenge: DirectDuelChallenge) => void)[] = [];
  private pvpStartListeners: ((room: PvpRoomState) => void)[] = [];
  private pvpUpdateListeners: ((room: PvpRoomState) => void)[] = [];
  private pvpEndListeners: ((result: any) => void)[] = [];
  private coopUpdateListeners: ((coop: CoopRoomState) => void)[] = [];
  private leaderboardListeners: ((data: GlobalLeaderboardData) => void)[] = [];
  private queueListeners: ((status: { inQueue: boolean; message?: string }) => void)[] = [];
  private toastListeners: ((toast: { message: string; type: 'info' | 'warning' | 'success' | 'gold' }) => void)[] = [];

  constructor() {
    this.initSocket();
  }

  private initSocket() {
    try {
      this.socket = io({
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 10000
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('[MultiplayerClient] Connected to server, socket ID:', this.socket?.id);
        this.measureLatency();
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('[MultiplayerClient] Disconnected from server');
      });

      this.socket.on('server:online_players', (players: OnlinePlayerProfile[]) => {
        this.cachedOnlinePlayers = players || [];
        this.onlinePlayersListeners.forEach(fn => fn(this.cachedOnlinePlayers));
      });

      this.socket.on('server:chat_history', (history: ChatMessage[]) => {
        this.cachedChatHistory = history || [];
        this.chatHistoryListeners.forEach(fn => fn(this.cachedChatHistory));
      });

      this.socket.on('server:chat_message', (msg: ChatMessage) => {
        if (this.cachedChatHistory) {
          this.cachedChatHistory = [...this.cachedChatHistory.slice(-99), msg];
        }
        this.chatListeners.forEach(fn => fn(msg));
      });

      this.socket.on('challenge:received', (challenge: DirectDuelChallenge) => {
        this.challengeListeners.forEach(fn => fn(challenge));
      });

      this.socket.on('pvp:match_start', (room: PvpRoomState) => {
        this.pvpStartListeners.forEach(fn => fn(room));
      });

      this.socket.on('pvp:battle_update', (room: PvpRoomState) => {
        this.pvpUpdateListeners.forEach(fn => fn(room));
      });

      this.socket.on('pvp:battle_end', (result: any) => {
        this.pvpEndListeners.forEach(fn => fn(result));
      });

      this.socket.on('coop:room_update', (coop: CoopRoomState) => {
        this.coopUpdateListeners.forEach(fn => fn(coop));
      });

      this.socket.on('server:leaderboard', (data: GlobalLeaderboardData) => {
        this.cachedLeaderboard = data;
        this.leaderboardListeners.forEach(fn => fn(data));
      });

      this.socket.on('pvp:queue_status', (status: { inQueue: boolean; message?: string }) => {
        this.queueListeners.forEach(fn => fn(status));
      });

      this.socket.on('server:toast', (toast: { message: string; type: any }) => {
        this.toastListeners.forEach(fn => fn(toast));
      });
    } catch (e) {
      console.error('[MultiplayerClient] Failed to initialize socket:', e);
    }
  }

  private measureLatency() {
    this.lastPingTime = Date.now();
    this.socket?.emit('ping', () => {
      this.latency = Date.now() - this.lastPingTime;
    });
  }

  public getLatency(): number {
    return this.latency;
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  // Register or sync current player profile
  public syncPlayer(player: Player) {
    if (!this.socket) return;
    const activeSoul = player.martialSouls[player.activeSoulIndex] || player.martialSouls[0];
    const rankTitle = getSoulRankTitle(player.level);

    // Approximate Battle Power (战力)
    const stats = player.stats;
    const hpPart = (stats?.maxHp || player.level * 400) / 2;
    const atkPart = (stats?.atk || player.level * 30) * 10;
    const defPart = (stats?.def || player.level * 20) * 8;
    const powerScore = Math.floor(hpPart + atkPart + defPart + (player.arenaPoints || 1000) * 5);

    const profile: OnlinePlayerProfile = {
      id: player.name || 'player_me',
      name: player.name || 'Nameless Spirit Master',
      level: player.level,
      title: rankTitle.title,
      avatarUrl: player.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      martialSoulName: activeSoul?.chineseName || activeSoul?.name || 'Clear Sky Hammer',
      martialSoulType: activeSoul?.type || 'tool',
      battlePower: powerScore,
      arenaBadge: player.arenaBadge || 'Bronze Spirit Master',
      pvpPoints: player.arenaPoints || 1200,
      pvpWins: player.arenaWins || 0,
      pvpLosses: player.arenaLosses || 0,
      battleArmorRank: player.battleArmor?.rank || 'none',
      battleArmorName: player.battleArmor?.customName || undefined,
      godPosition: player.godPosition || null,
      status: 'idle',
      lastActive: Date.now()
    };

    this.socket.emit('player:register', profile);
  }

  public sendChatMessage(channel: string, text: string, tag?: string) {
    this.socket?.emit('chat:send', { channel, text, tag });
  }

  public sendChallenge(targetId: string, mode: 'friendly' | 'ranked' = 'friendly') {
    this.socket?.emit('challenge:send', { targetId, mode });
  }

  public respondChallenge(challengeId: string, accepted: boolean) {
    this.socket?.emit('challenge:respond', { challengeId, accepted });
  }

  public queueMatchmaking() {
    this.socket?.emit('pvp:queue_match');
  }

  public cancelMatchmaking() {
    this.socket?.emit('pvp:cancel_queue');
  }

  public sendPvpAction(roomId: string, actionType: PvpActionRequest['actionType'], skillId?: string, weaponId?: string) {
    this.socket?.emit('pvp:action', { roomId, actionType, skillId, weaponId });
  }

  public createCoopRoom(bossId: string) {
    this.socket?.emit('coop:create_room', { bossId });
  }

  public sendCoopAction(roomId: string, actionType: string, skillMultiplier = 2.5) {
    this.socket?.emit('coop:action', { roomId, actionType, skillMultiplier });
  }

  // Event Subscription Helpers
  public onOnlinePlayers(callback: (players: OnlinePlayerProfile[]) => void) {
    this.onlinePlayersListeners.push(callback);
    if (this.cachedOnlinePlayers.length > 0) {
      try {
        callback(this.cachedOnlinePlayers);
      } catch (e) {
        console.error(e);
      }
    }
    return () => {
      this.onlinePlayersListeners = this.onlinePlayersListeners.filter(fn => fn !== callback);
    };
  }

  public onChatMessage(callback: (msg: ChatMessage) => void) {
    this.chatListeners.push(callback);
    return () => {
      this.chatListeners = this.chatListeners.filter(fn => fn !== callback);
    };
  }

  public onChatHistory(callback: (history: ChatMessage[]) => void) {
    this.chatHistoryListeners.push(callback);
    if (this.cachedChatHistory.length > 0) {
      try {
        callback(this.cachedChatHistory);
      } catch (e) {
        console.error(e);
      }
    }
    return () => {
      this.chatHistoryListeners = this.chatHistoryListeners.filter(fn => fn !== callback);
    };
  }

  public onChallenge(callback: (challenge: DirectDuelChallenge) => void) {
    this.challengeListeners.push(callback);
    return () => {
      this.challengeListeners = this.challengeListeners.filter(fn => fn !== callback);
    };
  }

  public onPvpStart(callback: (room: PvpRoomState) => void) {
    this.pvpStartListeners.push(callback);
    return () => {
      this.pvpStartListeners = this.pvpStartListeners.filter(fn => fn !== callback);
    };
  }

  public onPvpUpdate(callback: (room: PvpRoomState) => void) {
    this.pvpUpdateListeners.push(callback);
    return () => {
      this.pvpUpdateListeners = this.pvpUpdateListeners.filter(fn => fn !== callback);
    };
  }

  public onPvpEnd(callback: (result: any) => void) {
    this.pvpEndListeners.push(callback);
    return () => {
      this.pvpEndListeners = this.pvpEndListeners.filter(fn => fn !== callback);
    };
  }

  public onCoopUpdate(callback: (coop: CoopRoomState) => void) {
    this.coopUpdateListeners.push(callback);
    return () => {
      this.coopUpdateListeners = this.coopUpdateListeners.filter(fn => fn !== callback);
    };
  }

  public onLeaderboard(callback: (data: GlobalLeaderboardData) => void) {
    this.leaderboardListeners.push(callback);
    if (this.cachedLeaderboard) {
      try {
        callback(this.cachedLeaderboard);
      } catch (e) {
        console.error(e);
      }
    }
    return () => {
      this.leaderboardListeners = this.leaderboardListeners.filter(fn => fn !== callback);
    };
  }

  public onQueueStatus(callback: (status: { inQueue: boolean; message?: string }) => void) {
    this.queueListeners.push(callback);
    return () => {
      this.queueListeners = this.queueListeners.filter(fn => fn !== callback);
    };
  }

  public onToast(callback: (toast: { message: string; type: any }) => void) {
    this.toastListeners.push(callback);
    return () => {
      this.toastListeners = this.toastListeners.filter(fn => fn !== callback);
    };
  }
}

export const multiplayerClient = new MultiplayerClient();
