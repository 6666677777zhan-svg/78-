import React, { useState } from 'react';
import { Player } from '../types/game';
import { GodType } from '../data/godTrials';
import { GOD_TALENT_TREES, GodTalentNode, GodTalentTree, getSpentPointsInGodTree } from '../data/godTalents';
import { SoundEngine } from '../utils/audio';
import { 
  Sparkles, Award, Shield, Zap, Flame, Crown, Lock, RotateCcw, 
  ChevronRight, CheckCircle2, ArrowUpCircle, Info, Sword
} from 'lucide-react';

interface GodTalentTreeViewProps {
  player: Player;
  onUpgradeTalent: (godType: GodType, talentId: string) => void;
  onResetTalents: (godType: GodType) => void;
  onClose?: () => void;
}

export const GodTalentTreeView: React.FC<GodTalentTreeViewProps> = ({
  player,
  onUpgradeTalent,
  onResetTalents,
  onClose
}) => {
  const [selectedGodType, setSelectedGodType] = useState<GodType>('seagod');
  const [selectedNodeDetail, setSelectedNodeDetail] = useState<GodTalentNode | null>(null);

  const availableSourcePoints = player.divineSourcePoints || 0;
  const currentTree = GOD_TALENT_TREES.find((t) => t.godType === selectedGodType) || GOD_TALENT_TREES[0];
  const playerGodTalents = player.divineTalents || {};
  const currentGodAllocated = playerGodTalents[selectedGodType] || {};

  const totalSpentInCurrentTree = getSpentPointsInGodTree(selectedGodType, playerGodTalents);

  const isNodeUnlocked = (node: GodTalentNode): { unlocked: boolean; reason?: string } => {
    // Check tree points
    if (node.reqTreePoints && totalSpentInCurrentTree < node.reqTreePoints) {
      return { unlocked: false, reason: `需在该神树投入 ${node.reqTreePoints} 点神源` };
    }
    // Check prerequisite
    if (node.prerequisiteId) {
      const prereqRank = currentGodAllocated[node.prerequisiteId] || 0;
      if (prereqRank <= 0) {
        const prereqNode = currentTree.nodes.find((n) => n.id === node.prerequisiteId);
        return { unlocked: false, reason: `需先点亮前置技能【${prereqNode?.name || '前置天赋'}】` };
      }
    }
    return { unlocked: true };
  };

  const handleUpgrade = (node: GodTalentNode) => {
    const currentRank = currentGodAllocated[node.id] || 0;
    const unlockStatus = isNodeUnlocked(node);

    if (currentRank >= node.maxRank) {
      SoundEngine.playClick();
      return;
    }

    if (!unlockStatus.unlocked) {
      SoundEngine.playClick();
      alert(unlockStatus.reason);
      return;
    }

    if (availableSourcePoints < node.costPerRank) {
      SoundEngine.playClick();
      alert(`神源点不足！升级【${node.name}】需要 ${node.costPerRank} 点神源。可在此神位神考中获得神源点！`);
      return;
    }

    SoundEngine.playBreakthrough();
    onUpgradeTalent(selectedGodType, node.id);
  };

  const handleReset = () => {
    if (totalSpentInCurrentTree <= 0) return;
    if (window.confirm(`确定要重置【${currentTree.godName}】的天赋树吗？已使用的 ${totalSpentInCurrentTree} 点神源将全额返还！`)) {
      SoundEngine.playClick();
      onResetTalents(selectedGodType);
    }
  };

  // Group nodes by Tier (1, 2, 3, 4)
  const tier1Nodes = currentTree.nodes.filter((n) => n.tier === 1);
  const tier2Nodes = currentTree.nodes.filter((n) => n.tier === 2);
  const tier3Nodes = currentTree.nodes.filter((n) => n.tier === 3);
  const tier4Nodes = currentTree.nodes.filter((n) => n.tier === 4);

  return (
    <div className="bg-slate-950/95 border border-amber-500/30 rounded-2xl p-4 md:p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-slate-100 max-w-6xl mx-auto backdrop-blur-xl relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-25 transition-all duration-700"
        style={{ backgroundColor: currentTree.themeColor.glow }}
      />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            <h2 className="text-2xl font-black tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
              至高神祇天赋树
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
              神威深耕
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            通过神考积累<span className="text-amber-300 font-bold">【神源点】</span>，点亮五大神位专属被动印记与至高法裁效果！
          </p>
        </div>

        {/* Source Points Counter & Reset */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-amber-500/30 rounded-xl px-4 py-2.5 shadow-inner">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-[0_0_12px_rgba(251,191,36,0.5)]">
              神
            </div>
            <div>
              <div className="text-[10px] text-amber-400 font-medium">可用神源点</div>
              <div className="text-lg font-black text-amber-300 tracking-wider">
                {availableSourcePoints} <span className="text-xs text-slate-400 font-normal">点</span>
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <button
            onClick={handleReset}
            disabled={totalSpentInCurrentTree <= 0}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              totalSpentInCurrentTree > 0
                ? 'bg-rose-950/50 border-rose-500/40 text-rose-300 hover:bg-rose-900/60 hover:border-rose-400 cursor-pointer'
                : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
            title="重置当前神树并返还所有神源点"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重置当前树 ({totalSpentInCurrentTree})
          </button>
        </div>
      </div>

      {/* God Tree Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
        {GOD_TALENT_TREES.map((tree) => {
          const isSelected = tree.godType === selectedGodType;
          const spentInTree = getSpentPointsInGodTree(tree.godType, playerGodTalents);

          return (
            <button
              key={tree.godType}
              onClick={() => {
                SoundEngine.playClick();
                setSelectedGodType(tree.godType);
              }}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                isSelected
                  ? `bg-gradient-to-b ${tree.themeColor.gradient} ${tree.themeColor.activeBorder} shadow-[0_0_20px_${tree.themeColor.glow}]`
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-black tracking-wide ${isSelected ? tree.themeColor.text : 'text-slate-200'}`}>
                  {tree.godName.split('·')[0]}
                </span>
                {spentInTree > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    +{spentInTree}
                  </span>
                )}
              </div>
              <div className="text-[11px] truncate opacity-75">
                {tree.godName.split('·')[1] || tree.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Tree Banner Info */}
      <div className={`p-4 rounded-xl border mb-6 bg-gradient-to-r ${currentTree.themeColor.gradient} ${currentTree.themeColor.border} flex flex-col md:flex-row md:items-center justify-between gap-3`}>
        <div>
          <div className="flex items-center gap-2">
            <Crown className={`w-5 h-5 ${currentTree.themeColor.text}`} />
            <h3 className={`text-lg font-black ${currentTree.themeColor.text}`}>
              {currentTree.godName} 神术印记
            </h3>
            <span className="text-xs text-slate-300 opacity-90">
              ({currentTree.subtitle})
            </span>
          </div>
          <div className="text-xs text-slate-300/80 mt-1">
            已投入该神树：<span className="text-amber-300 font-bold">{totalSpentInCurrentTree}</span> 点神源
          </div>
        </div>
      </div>

      {/* Talent Tree Diagram Grid */}
      <div className="space-y-6 relative">
        {[
          { tier: 1, title: '第一层 · 基础神术', nodes: tier1Nodes, req: 0 },
          { tier: 2, title: '第二层 · 进阶神威 (需投入3点神源)', nodes: tier2Nodes, req: 3 },
          { tier: 3, title: '第三层 · 核心神核 (需投入8点神源)', nodes: tier3Nodes, req: 8 },
          { tier: 4, title: '第四层 · 神王主宰终极法裁 (需投入12点神源)', nodes: tier4Nodes, req: 12 }
        ].map((tierGroup) => {
          const isTierUnlocked = totalSpentInCurrentTree >= tierGroup.req;

          return (
            <div key={`tier-group-${tierGroup.tier}`} className="relative">
              {/* Tier Header Label */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                  isTierUnlocked 
                    ? 'bg-slate-900 border-amber-500/40 text-amber-300' 
                    : 'bg-slate-900/50 border-slate-800 text-slate-500'
                }`}>
                  {tierGroup.title}
                </div>
                <div className="flex-1 h-px bg-slate-800/80" />
              </div>

              {/* Tier Nodes Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {tierGroup.nodes.map((node) => {
                  const currentRank = currentGodAllocated[node.id] || 0;
                  const isMax = currentRank >= node.maxRank;
                  const unlockInfo = isNodeUnlocked(node);
                  const canUpgrade = !isMax && unlockInfo.unlocked && availableSourcePoints >= node.costPerRank;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeDetail(node)}
                      className={`p-4 rounded-xl border transition-all relative overflow-hidden group cursor-pointer ${
                        currentRank > 0
                          ? `bg-slate-900/90 ${currentTree.themeColor.border} shadow-[0_0_15px_${currentTree.themeColor.glow}]`
                          : unlockInfo.unlocked
                          ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-950/80 border-slate-900/80 opacity-60'
                      }`}
                    >
                      {/* Top Bar: Icon, Name, Rank */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner border ${
                            currentRank > 0
                              ? 'bg-slate-800 border-amber-500/50'
                              : 'bg-slate-900 border-slate-800'
                          }`}>
                            {node.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                                {node.name}
                              </h4>
                              {isMax && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                                  极意MAX
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              消耗: {node.costPerRank} 神源/级
                            </div>
                          </div>
                        </div>

                        {/* Rank Badge */}
                        <div className={`text-xs font-black px-2.5 py-1 rounded-lg border ${
                          isMax
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : currentRank > 0
                            ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                            : 'bg-slate-800 border-slate-700 text-slate-500'
                        }`}>
                          {currentRank} / {node.maxRank}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                        {node.description}
                      </p>

                      {/* Dynamic Effect Preview */}
                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 mb-3 text-xs">
                        <div className="text-[10px] text-slate-400 mb-0.5">加成效果：</div>
                        <div className="text-amber-300 font-semibold">
                          {node.statEffectText(currentRank > 0 ? currentRank : 1)}
                        </div>
                      </div>

                      {/* Upgrade Action Button */}
                      <div className="flex items-center justify-between pt-1">
                        {!unlockInfo.unlocked ? (
                          <div className="flex items-center gap-1 text-[11px] text-rose-400/90 font-medium">
                            <Lock className="w-3.5 h-3.5" />
                            {unlockInfo.reason}
                          </div>
                        ) : isMax ? (
                          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            已点亮全阶法裁
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpgrade(node);
                            }}
                            disabled={!canUpgrade}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold border transition-all ${
                              canUpgrade
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-400 hover:from-amber-400 hover:to-yellow-400 shadow-[0_0_12px_rgba(251,191,36,0.4)] cursor-pointer'
                                : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <ArrowUpCircle className="w-3.5 h-3.5" />
                            点亮神术 (+1)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tooltip Detail View when Node Clicked */}
      {selectedNodeDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(251,191,36,0.3)] text-slate-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedNodeDetail(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 text-xl font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-amber-500/50 flex items-center justify-center text-2xl shadow-inner">
                {selectedNodeDetail.icon}
              </div>
              <div>
                <h3 className="text-lg font-black text-amber-300">
                  {selectedNodeDetail.name}
                </h3>
                <span className="text-xs text-slate-400">
                  {selectedNodeDetail.tier}阶神术印记
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-4 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {selectedNodeDetail.description}
            </p>

            <div className="space-y-2 mb-6">
              <div className="text-xs font-bold text-slate-400">各级提升面板：</div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {Array.from({ length: selectedNodeDetail.maxRank }).map((_, idx) => {
                  const rankNum = idx + 1;
                  const currentAlloc = currentGodAllocated[selectedNodeDetail.id] || 0;
                  const isCurrent = currentAlloc === rankNum;

                  return (
                    <div
                      key={`rank-preview-${rankNum}`}
                      className={`p-2 rounded-lg text-xs flex items-center justify-between border ${
                        isCurrent
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>等级 {rankNum}</span>
                      <span>{selectedNodeDetail.statEffectText(rankNum)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedNodeDetail(null)}
                className="px-4 py-2 text-xs rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
