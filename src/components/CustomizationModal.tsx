import React, { useState } from 'react';
import { Check, Shield, Sparkles, X } from 'lucide-react';
import { FRAMES, PETS, PLATE_TYPES } from '../data/constants';
import { SFX, triggerHaptic } from '../services/sound';
import { Frame, Pet, PlateType } from '../types';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  currentType: string;
  currentFrame: string;
  currentPet: string;
  ownedFrames: string[];
  ownedPets: string[];
  onSelectType: (typeId: string) => void;
  onSelectFrame: (frameId: string) => void;
  onBuyFrame: (frame: Frame) => void;
  onSelectPet: (petId: string) => void;
  onBuyPet: (pet: Pet) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  balance,
  currentType,
  currentFrame,
  currentPet,
  ownedFrames,
  ownedPets,
  onSelectType,
  onSelectFrame,
  onBuyFrame,
  onSelectPet,
  onBuyPet,
}) => {
  const [activeTab, setActiveTab] = useState<'types' | 'frames' | 'pets'>('types');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl max-h-[88vh] bg-[#121522] border border-slate-700 rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#161a29]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Тюнинг, Рамки & Питомцы</h3>
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

        {/* Tab switchers */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#0e111b] border-b border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('types')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'types' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Типы знаков
          </button>
          <button
            onClick={() => setActiveTab('frames')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'frames' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Рамки для номера
          </button>
          <button
            onClick={() => setActiveTab('pets')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'pets' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Питомцы
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 text-xs">
          {activeTab === 'types' && (
            <div className="space-y-2">
              {PLATE_TYPES.map((t) => {
                const isSelected = currentType === t.id;
                return (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-[#181d2f] border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        {t.n}
                        {isSelected && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            АКТИВЕН
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400 text-xs mt-0.5">
                        {t.desc} · Множитель стоимости: <strong className="text-amber-400">×{t.mult}</strong>
                      </div>
                    </div>

                    <button
                      disabled={isSelected}
                      onClick={() => {
                        onSelectType(t.id);
                        SFX.click();
                      }}
                      className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition ${
                        isSelected
                          ? 'bg-slate-800 text-slate-500'
                          : 'bg-amber-500 hover:bg-amber-400 text-black'
                      }`}
                    >
                      {isSelected ? 'Выбран' : 'Выбрать'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'frames' && (
            <div className="space-y-2">
              {FRAMES.map((f) => {
                const isOwned = ownedFrames.includes(f.id);
                const isSelected = currentFrame === f.id;
                const canAfford = balance >= f.cost;

                return (
                  <div
                    key={f.id}
                    className="p-3 rounded-xl bg-[#181d2f] border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        {f.n}
                        {isSelected && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            НАДЕТА
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400 text-xs mt-0.5 italic">
                        Надпись на рамке: «{f.cap}»
                      </div>
                    </div>

                    {isOwned ? (
                      <button
                        disabled={isSelected}
                        onClick={() => {
                          onSelectFrame(f.id);
                          SFX.click();
                        }}
                        className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition ${
                          isSelected
                            ? 'bg-slate-800 text-slate-500'
                            : 'bg-purple-600 hover:bg-purple-500 text-white'
                        }`}
                      >
                        {isSelected ? 'Надета' : 'Надеть'}
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          onBuyFrame(f);
                          SFX.coin();
                        }}
                        className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-black'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {f.cost.toLocaleString('ru-RU')} ₽
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'pets' && (
            <div className="space-y-2">
              {PETS.map((pet) => {
                const isOwned = ownedPets.includes(pet.id);
                const isSelected = currentPet === pet.id;
                const cost = pet.cost || 0;
                const canAfford = balance >= cost;

                return (
                  <div
                    key={pet.id}
                    className="p-3 rounded-xl bg-[#181d2f] border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{pet.ic}</span>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          {pet.n}
                          {isSelected && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              АКТИВЕН
                            </span>
                          )}
                        </div>
                        <div className="text-slate-400 text-xs mt-0.5">{pet.d}</div>
                      </div>
                    </div>

                    {isOwned ? (
                      <button
                        disabled={isSelected}
                        onClick={() => {
                          onSelectPet(pet.id);
                          SFX.click();
                        }}
                        className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition ${
                          isSelected
                            ? 'bg-slate-800 text-slate-500'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {isSelected ? 'Активен' : 'Выбрать'}
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          onBuyPet(pet);
                          SFX.coin();
                        }}
                        className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-black'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {cost.toLocaleString('ru-RU')} ₽
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
