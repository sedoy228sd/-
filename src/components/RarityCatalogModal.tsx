import React from 'react';
import { ArrowLeft, Sparkles, X } from 'lucide-react';
import { RARITIES } from '../data/constants';
import { SFX } from '../services/sound';

interface RarityCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RarityCatalogModal: React.FC<RarityCatalogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080a10] text-white animate-fade-in select-none">
      <header className="px-4 py-3.5 flex items-center gap-4 border-b border-slate-800 bg-[#080a10]/95 backdrop-blur-md sticky top-0 z-10">
        <button
          onClick={() => {
            SFX.click();
            onClose();
          }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white transition"
          aria-label="Назад"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-slate-100">
          Каталог редкостей
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-8">
        {RARITIES.map((rarity, idx) => (
          <div
            key={rarity.key}
            className="p-4 rounded-2xl bg-[#121522] border border-slate-800 shadow-md flex items-center justify-between"
            style={{ borderLeft: `5px solid ${rarity.color}` }}
          >
            <div>
              <div
                className="text-base font-black uppercase tracking-wider"
                style={{ color: rarity.color }}
              >
                {rarity.name}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Минимальная цена: <strong className="text-white">{rarity.minPrice.toLocaleString('ru-RU')} ₽</strong>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Бонус токенов: +{rarity.bonusTokens} ◆
              </div>
            </div>

            <div className="w-28 h-8 rounded-md bg-white border border-black flex items-center justify-between px-2 text-black font-plate font-black text-xs shadow-sm">
              <span>{idx === 6 ? 'Х 777 ХХ' : idx === 4 ? 'Е 777 КХ' : 'А 123 АА'}</span>
              <span className="border-l border-black pl-1 text-[9px]">77</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
