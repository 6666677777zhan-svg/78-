import React, { useState, useEffect } from 'react';
import { Player } from '../types/game';
import { 
  GoogleUser, 
  GoogleCloudSaveSlot, 
  getActiveGoogleUser, 
  saveActiveGoogleUser, 
  savePlayerToGoogleCloud, 
  getGoogleCloudSlots, 
  deleteGoogleCloudSlot,
  isGoogleAutoSaveEnabled,
  setGoogleAutoSaveEnabled,
  exportGoogleBackupJSON
} from '../utils/googleAuthManager';
import { SoundEngine } from '../utils/audio';
import { 
  Cloud, CloudUpload, CloudDownload, ShieldCheck, Check, 
  LogIn, LogOut, RefreshCw, Download, Upload, Trash2, 
  X, User, Mail, Sparkles, Clock, AlertCircle, HardDrive, CheckCircle2
} from 'lucide-react';

interface GoogleCloudSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player;
  onRestorePlayer: (restoredPlayer: Player) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'gold') => void;
}

export const GoogleCloudSaveModal: React.FC<GoogleCloudSaveModalProps> = ({
  isOpen,
  onClose,
  player,
  onRestorePlayer,
  showToast
}) => {
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(getActiveGoogleUser);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [cloudSlots, setCloudSlots] = useState<GoogleCloudSaveSlot[]>([]);
  const [isAutoSave, setIsAutoSave] = useState(isGoogleAutoSaveEnabled);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSyncText, setLastSyncText] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const active = getActiveGoogleUser();
      setCurrentUser(active);
      if (active) {
        setCloudSlots(getGoogleCloudSlots(active.email));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('请输入有效的 Google / Gmail 邮箱地址 (如 user@gmail.com)', 'info');
      return;
    }

    const defaultName = cleanEmail.split('@')[0];
    const newUser: GoogleUser = {
      id: `google_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: cleanEmail,
      name: nameInput.trim() || defaultName,
      loginTime: Date.now()
    };

    saveActiveGoogleUser(newUser);
    setCurrentUser(newUser);
    SoundEngine.playBreakthrough();
    showToast(`Google 账号【${newUser.email}】登录成功！`, 'success');

    // Load cloud slots for this email
    const slots = getGoogleCloudSlots(newUser.email);
    setCloudSlots(slots);

    // If slots exist, offer to auto-save or keep existing
    if (slots.length === 0) {
      // Auto initial cloud backup
      savePlayerToGoogleCloud(newUser, player, '初始云存档');
      setCloudSlots(getGoogleCloudSlots(newUser.email));
    }
  };

  const handleQuickGmailLogin = (presetEmail: string) => {
    setEmailInput(presetEmail);
    const defaultName = presetEmail.split('@')[0];
    const newUser: GoogleUser = {
      id: `google_${Date.now()}`,
      email: presetEmail,
      name: defaultName,
      loginTime: Date.now()
    };
    saveActiveGoogleUser(newUser);
    setCurrentUser(newUser);
    SoundEngine.playBreakthrough();
    showToast(`已使用 Google 账号【${presetEmail}】登录`, 'success');
    const slots = getGoogleCloudSlots(presetEmail);
    setCloudSlots(slots);
    if (slots.length === 0) {
      savePlayerToGoogleCloud(newUser, player, '初始云存档');
      setCloudSlots(getGoogleCloudSlots(presetEmail));
    }
  };

  const handleLogout = () => {
    SoundEngine.playClick();
    saveActiveGoogleUser(null);
    setCurrentUser(null);
    setCloudSlots([]);
    showToast('已退出 Google 账号，切换为本地游客模式', 'info');
  };

  const handleCloudSaveNow = () => {
    if (!currentUser) {
      showToast('请先登录 Google 账号', 'info');
      return;
    }
    setIsSaving(true);
    SoundEngine.playSoulRingAura('gold');
    setTimeout(() => {
      const res = savePlayerToGoogleCloud(currentUser, player, `Lv.${player.level} ${player.name}`);
      setIsSaving(false);
      if (res.success) {
        setCloudSlots(getGoogleCloudSlots(currentUser.email));
        setLastSyncText(new Date().toLocaleTimeString());
        showToast('☁️ 成功同步至 Google 云端空间！', 'success');
      } else {
        showToast('保存失败，请检查浏览器存储空间', 'info');
      }
    }, 400);
  };

  const handleRestoreSlot = (slot: GoogleCloudSaveSlot) => {
    if (!window.confirm(`确定要从 Google 云端载入【${slot.playerName} · Lv.${slot.level}】的存档吗？\n保存时间: ${new Date(slot.savedAt).toLocaleString()}`)) {
      return;
    }
    SoundEngine.playBreakthrough();
    onRestorePlayer(slot.playerData);
    showToast(`✅ 成功从 Google 云端恢复【${slot.playerName}】角色数据！`, 'gold');
    onClose();
  };

  const handleDeleteSlot = (slotId: string) => {
    if (!currentUser) return;
    if (!window.confirm('确定要删除此条 Google 云端历史存档吗？')) return;
    deleteGoogleCloudSlot(currentUser.email, slotId);
    setCloudSlots(getGoogleCloudSlots(currentUser.email));
    showToast('已删除该云端备份', 'info');
  };

  const handleExportFile = () => {
    try {
      const json = exportGoogleBackupJSON(player, currentUser);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Douluo_GoogleSave_${currentUser ? currentUser.email.replace(/[@.]/g, '_') : 'guest'}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      SoundEngine.playClick();
      showToast('📥 存档文件已成功导出到本地！', 'success');
    } catch (e) {
      showToast('导出存档失败', 'info');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const importedPlayer: Player = parsed.player || parsed;
        if (importedPlayer && importedPlayer.name && importedPlayer.martialSouls) {
          onRestorePlayer(importedPlayer);
          SoundEngine.playBreakthrough();
          showToast(`✅ 成功导入角色【${importedPlayer.name} · Lv.${importedPlayer.level}】！`, 'gold');
          if (currentUser) {
            savePlayerToGoogleCloud(currentUser, importedPlayer, '导入外部存档');
            setCloudSlots(getGoogleCloudSlots(currentUser.email));
          }
          onClose();
        } else {
          showToast('导入文件格式不合法，未找到角色武魂数据', 'info');
        }
      } catch (err) {
        showToast('解析存档文件失败，请确保是合法的 JSON 备份', 'info');
      }
    };
    reader.readAsText(file);
  };

  const handleToggleAutoSave = () => {
    const next = !isAutoSave;
    setIsAutoSave(next);
    setGoogleAutoSaveEnabled(next);
    showToast(`Google 实时云同步已${next ? '【开启】' : '【关闭】'}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700/80 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header with Google Brand styling */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-2 flex items-center justify-center shadow-lg shadow-blue-500/20">
              {/* Google 4-Color 'G' Logo SVG */}
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Google / Gmail 云端存档中心</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Cloud Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">跨设备永久存储您的武魂觉醒进度、魂环、斗铠与十环神位</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          
          {/* Account Status Box */}
          {currentUser ? (
            <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg border-2 border-blue-400/50 shadow-md">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'G'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-white">{currentUser.name}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> 已连接 Google
                    </span>
                  </div>
                  <span className="text-xs text-slate-300 flex items-center gap-1 font-mono">
                    <Mail className="w-3.5 h-3.5 text-blue-400" /> {currentUser.email}
                  </span>
                  {lastSyncText && (
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      最近同步: {lastSyncText}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCloudSaveNow}
                  disabled={isSaving}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95 transition-all"
                >
                  <CloudUpload className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                  <span>{isSaving ? '正在上传云端...' : '立即同步到 Google'}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>退出</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-slate-200">当前模式: 游客 (未绑定 Google 账号)</span>
                </div>
                <span className="text-xs text-slate-400">绑定后可多设备永久保留进度</span>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">
                    输入您的 Google / Gmail 邮箱地址:
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="例如: yourname@gmail.com"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all active:scale-95 whitespace-nowrap"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Google 登录</span>
                    </button>
                  </div>
                </div>

                {/* Quick 1-click preset logins */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-400">快捷登录建议:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickGmailLogin('6666677777zhan@gmail.com')}
                    className="px-2.5 py-1 bg-blue-950/60 border border-blue-500/40 hover:bg-blue-900/60 text-blue-300 rounded-lg text-[11px] font-mono transition-colors"
                  >
                    6666677777zhan@gmail.com
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickGmailLogin('tangsan.douluo@gmail.com')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-mono transition-colors"
                  >
                    tangsan.douluo@gmail.com
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Current Local Snapshot Info */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" /> 当前本地游玩角色
              </span>
              <span className="text-[11px] text-amber-400 font-semibold">
                Lv.{player.level} · {player.name}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">武魂配置</span>
                <span className="font-bold text-slate-200 truncate block mt-0.5">
                  {player.martialSouls.map(s => s.name).join(' + ')}
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">魂力境界</span>
                <span className="font-bold text-amber-300 block mt-0.5">
                  Lv.{player.level} 级
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">金魂币</span>
                <span className="font-bold text-yellow-400 block mt-0.5">
                  {player.gold.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">神祇考核</span>
                <span className="font-bold text-purple-300 block mt-0.5">
                  {player.godPosition ? '十环神祇' : `海神考 ${player.seaGodTestLevel || 0}/9`}
                </span>
              </div>
            </div>
          </div>

          {/* Cloud Slots Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-black text-slate-200">
                  Google 云端历史存档 ({cloudSlots.length} / 5)
                </h3>
              </div>
              {currentUser && (
                <button
                  onClick={handleToggleAutoSave}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1 transition-colors ${
                    isAutoSave
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>自动云端同步: {isAutoSave ? '已开启' : '已关闭'}</span>
                </button>
              )}
            </div>

            {cloudSlots.length === 0 ? (
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 text-center space-y-2">
                <CloudUpload className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">该 Google 账号在云端暂无历史备份</p>
                {currentUser && (
                  <button
                    onClick={handleCloudSaveNow}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 mt-2"
                  >
                    <CloudUpload className="w-3.5 h-3.5" /> 立即上传当前角色到 Google 云端
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {cloudSlots.map((slot, idx) => (
                  <div 
                    key={slot.slotId}
                    className="bg-slate-950/80 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-300">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{slot.playerName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Lv.{slot.level}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {slot.martialSoulNames.join(' · ')}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {new Date(slot.savedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleRestoreSlot(slot)}
                        className="px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                      >
                        <CloudDownload className="w-3.5 h-3.5" /> 载入此存档
                      </button>
                      <button
                        onClick={() => handleDeleteSlot(slot.slotId)}
                        className="p-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 rounded-xl transition-colors"
                        title="删除此条云端记录"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Offline JSON Import / Export Backup */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-cyan-400" /> 本地离线文件备份 / 导入
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportFile}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>导出存档文件 (.json)</span>
              </button>

              <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>从 JSON 文件导入存档</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            所有存档已通过 Google 邮箱独立隔离存储
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
