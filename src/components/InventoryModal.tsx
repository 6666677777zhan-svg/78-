import React from 'react';
import { Player, Item } from '../types/game';
import { SoundEngine } from '../utils/audio';
import { Package, Heart, Shield, Hammer, Sparkles, X, Coins } from 'lucide-react';

interface InventoryModalProps {
  player: Player;
  onClose: () => void;
  onUseItem?: (item: Item) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  player,
  onClose,
  onUseItem
}) => {
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'consumable': return <Heart className="w-5 h-5 text-rose-400" />;
      case 'ore':
      case 'material': return <Hammer className="w-5 h-5 text-amber-400" />;
      case 'herb': return <Sparkles className="w-5 h-5 text-emerald-400" />;
      default: return <Package className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-lg text-slate-100">魂导储物囊 (背包)</h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-bold bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>{player.gold} 金魂币</span>
            </div>
            <button
              onClick={() => { SoundEngine.playClick(); onClose(); }}
              className="text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Item List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 max-h-96 overflow-y-auto pr-1">
          {player.inventory.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700/80">
                  {getItemIcon(item.type)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-bold text-amber-400 block">x{item.quantity}</span>
                {item.type === 'consumable' && onUseItem && (
                  <button
                    onClick={() => { SoundEngine.playClick(); onUseItem(item); }}
                    className="mt-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-lg text-[10px] font-bold"
                  >
                    使用
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => { SoundEngine.playClick(); onClose(); }}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
          >
            关闭储物囊
          </button>
        </div>

      </div>
    </div>
  );
};
