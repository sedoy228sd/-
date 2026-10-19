import React, { useState } from 'react';
import { Coins, Filter, Package, Search, Trash2, X } from 'lucide-react';
import { RARITIES } from '../data/constants';
import { SFX, triggerHaptic } from '../services/sound';
import { Plate } from '../types';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Plate[];
  maxCapacity: number;
  onSellPlates: (plateIds: number[]) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  maxCapacity,
  onSellPlates,
}) => {
  const [filterRarity, setFilterRarity] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = inventory.filter((p) => {
    if (filterRarity !== 'all' && p.i !== filterRarity) return false;
    if (searchQuery) {
      const fullText = `${p.l[0]}${p.d.join('')}${p.l[1]}${p.l[2]}${p.reg}`.toLowerCase();
      if (!fullText.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[88vh] bg-[#121522] border border-slate-700 rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#161a29]">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">Инвентарь Номеров</h3>
              <div className="text-[11px] text-slate-400">
                Занято: {inventory.length} / {maxCapacity} слотов
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              SFX.click();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action buttons & search */}
        <div className="p-4 bg-[#0e111b] border-b border-slate-800 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                onSellPlates(inventory.map((p) => p.id));
              }}
              disabled={inventory.length === 0}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center gap-1.5 shadow-md transition disabled:opacity-40"
            >
              <Coins className="w-3.5 h-3.5" />
              Продать все ({inventory.length} шт)
            </button>

            <button
              onClick={() => {
                const commonIds = inventory.filter((p) => p.i === 0).map((p) => p.id);
                onSellPlates(commonIds);
              }}
              disabled={!inventory.some((p) => p.i === 0)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition disabled:opacity-40"
            >
              Продать только Обычные
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по серии (например ЕКХ, 777)..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/40 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Plates Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((p) => {
                const rarity = RARITIES[p.i] || RARITIES[0];

                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-[#181d2f] border border-slate-800 flex flex-col justify-between gap-2 relative overflow-hidden"
                    style={{ borderTop: `3px solid ${rarity.color}` }}
                  >
                    {/* Mini Plate Display */}
                    <div className="p-2 rounded bg-neutral-200 border border-neutral-600 text-neutral-900 font-plate font-black text-center text-sm tracking-tight flex items-center justify-between">
                      <span>{p.l[0]}</span>
                      <span className="font-extrabold">{p.d.join('')}</span>
                      <span>{p.l[1]}{p.l[2]}</span>
                      <span className="text-xs border-l border-neutral-700 pl-1">{p.reg}</span>
                    </div>

                    <div className="text-center">
                      <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: rarity.color }}>
                        {rarity.name}
                      </div>
                      <div className="text-xs font-black font-mono-num text-amber-400 mt-0.5">
                        {p.price.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSellPlates([p.id]);
                        SFX.coin();
                        triggerHaptic(15);
                      }}
                      className="w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition"
                    >
                      Продать
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              В инвентаре пока нет номеров. Крутите рулетку на главном экране!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
