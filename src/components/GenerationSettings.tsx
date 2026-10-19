import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Sparkles } from 'lucide-react';
import { COUNTRIES, PLATE_TYPES, REGIONS } from '../data/constants';
import { SFX, triggerHaptic } from '../services/sound';
import { PlateType } from '../types';

interface GenerationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentType: string;
  onSelectType: (typeId: string) => void;
  currentCountry: string;
  onSelectCountry: (countryId: string) => void;
  currentRegion: string;
  onSelectRegion: (regId: string) => void;
  spinCost: number;
}

export const GenerationSettings: React.FC<GenerationSettingsProps> = ({
  isOpen,
  onClose,
  currentType,
  onSelectType,
  currentCountry,
  onSelectCountry,
  currentRegion,
  onSelectRegion,
  spinCost,
}) => {
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);

  if (!isOpen) return null;

  const currentCountryObj = COUNTRIES.find((c) => c.id === currentCountry) || COUNTRIES[0];
  const regionList = REGIONS[currentCountry] || REGIONS.ru;
  const currentRegionObj = regionList.find((r) => r.id === currentRegion);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0c0d14] text-white animate-fade-in select-none">
      {/* Top Header */}
      <header className="px-4 py-3.5 flex items-center gap-4 border-b border-slate-800/80 bg-[#0c0d14]/90 backdrop-blur-md">
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
        <h1 className="text-lg font-bold tracking-tight text-slate-100">
          Настройка генерации
        </h1>
      </header>

      {/* Main Settings Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Country Banner Card */}
        <div
          onClick={() => setShowCountryModal(true)}
          className="w-full h-14 rounded-2xl border border-slate-800 p-3 flex items-center justify-between cursor-pointer hover:border-slate-700 transition relative overflow-hidden shadow-md"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(0,57,166,0.3) 25%, rgba(213,43,30,0.3) 50%, rgba(18,21,34,0.9) 75%)',
          }}
        >
          <div className="flex items-center gap-3 z-10">
            <span className="text-2xl">{currentCountryObj.flag}</span>
            <span className="text-base font-bold text-white tracking-wide">
              {currentCountryObj.n}
            </span>
          </div>

          <div className="text-xs font-bold text-slate-400 z-10 font-mono">
            {COUNTRIES.findIndex((c) => c.id === currentCountry) + 1} / {COUNTRIES.length}
          </div>
        </div>

        {/* Section: Типы номеров */}
        <div>
          <div className="text-xs font-bold text-slate-400 tracking-wider mb-2.5">
            Типы номеров
          </div>

          <div className="space-y-2.5">
            {/* 1. Гражданский */}
            <div
              onClick={() => {
                onSelectType('civil');
                SFX.click();
              }}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                currentType === 'civil'
                  ? 'bg-[#181d2f] border-slate-600 shadow-md'
                  : 'bg-[#121522] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Mini White Plate */}
              <div className="w-36 h-9 rounded-md bg-white border-2 border-black flex items-center justify-between px-2 text-black font-plate font-black text-sm">
                <span>А 001 АА</span>
                <div className="flex flex-col items-center justify-center border-l-2 border-black pl-1 text-[10px] leading-none">
                  <span>01</span>
                  <span className="text-[7px]">RUS 🇷🇺</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-white">Гражданский</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {currentType === 'civil' ? (
                    <span className="text-emerald-400 font-bold">100,0%</span>
                  ) : (
                    'Выбрать'
                  )}
                </div>
              </div>
            </div>

            {/* 2. Такси */}
            <div
              onClick={() => {
                onSelectType('taxi');
                SFX.click();
              }}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                currentType === 'taxi'
                  ? 'bg-[#181d2f] border-amber-500/60 shadow-md'
                  : 'bg-[#121522] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Mini Yellow Plate */}
              <div className="w-36 h-9 rounded-md bg-[#facc15] border-2 border-black flex items-center justify-between px-2 text-black font-plate font-black text-sm">
                <span>АА 001</span>
                <div className="flex flex-col items-center justify-center border-l-2 border-black pl-1 text-[10px] leading-none">
                  <span>01</span>
                  <span className="text-[7px]">RUS</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-white">Такси</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {currentType === 'taxi' ? (
                    <span className="text-amber-400 font-bold">Активен (×1.6)</span>
                  ) : (
                    'Выбрать (×1.6)'
                  )}
                </div>
              </div>
            </div>

            {/* 3. Полиция */}
            <div
              onClick={() => {
                onSelectType('police');
                SFX.click();
              }}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                currentType === 'police'
                  ? 'bg-[#181d2f] border-blue-500/60 shadow-md'
                  : 'bg-[#121522] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Mini Blue Plate */}
              <div className="w-36 h-9 rounded-md bg-[#1e3a8a] border-2 border-white flex items-center justify-between px-2 text-white font-plate font-black text-sm">
                <span>А 0001</span>
                <div className="flex flex-col items-center justify-center border-l-2 border-white pl-1 text-[10px] leading-none">
                  <span>01</span>
                  <span className="text-[7px]">RUS</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-white">Полиция</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {currentType === 'police' ? (
                    <span className="text-blue-400 font-bold">Активен (×2.5)</span>
                  ) : (
                    'Выбрать (×2.5)'
                  )}
                </div>
              </div>
            </div>

            {/* 4. Военный */}
            <div
              onClick={() => {
                onSelectType('military');
                SFX.click();
              }}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                currentType === 'military'
                  ? 'bg-[#181d2f] border-slate-600 shadow-md'
                  : 'bg-[#121522] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Mini Black Plate */}
              <div className="w-36 h-9 rounded-md bg-[#171717] border-2 border-neutral-600 flex items-center justify-between px-2 text-white font-plate font-black text-sm">
                <span>0001 АА</span>
                <div className="flex flex-col items-center justify-center border-l-2 border-neutral-600 pl-1 text-[10px] leading-none">
                  <span>09</span>
                  <span className="text-[7px]">RUS</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-white">Военный</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {currentType === 'military' ? (
                    <span className="text-slate-300 font-bold">Активен (×3.0)</span>
                  ) : (
                    'Выбрать (×3.0)'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Panel matching Screenshot 2 */}
      <div className="p-4 bg-[#121522] border-t border-slate-800/80 space-y-3">
        {/* Cost Row */}
        <div className="p-3.5 rounded-2xl bg-[#181d2f] border border-slate-800 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Стоимость генерации</span>
          <span className="text-base font-black font-mono-num text-white">
            {spinCost.toLocaleString('ru-RU')} ₽
          </span>
        </div>

        {/* Buttons Row */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowCountryModal(true)}
            className="py-3 px-4 rounded-2xl bg-[#181d2f] hover:bg-slate-800 border border-slate-800 text-sm font-bold text-slate-200 transition text-center"
          >
            Выбрать страну
          </button>

          <button
            onClick={() => setShowRegionModal(true)}
            className="py-3 px-4 rounded-2xl bg-[#181d2f] hover:bg-slate-800 border border-slate-800 text-sm font-bold text-slate-200 transition flex items-center justify-center gap-1.5"
          >
            <span>{currentRegionObj ? currentRegionObj.n : 'Все регионы'}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Country Selection Modal */}
      {showCountryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#121522] border border-slate-700 rounded-3xl p-5 space-y-3 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Выберите страну:</h3>
            <div className="space-y-2">
              {COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCountry(c.id);
                    setShowCountryModal(false);
                    SFX.click();
                  }}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition ${
                    currentCountry === c.id
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-[#181d2f] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{c.flag}</span>
                    <span>{c.n}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{c.code}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCountryModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs mt-2"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Region Selection Modal */}
      {showRegionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm max-h-[80vh] bg-[#121522] border border-slate-700 rounded-3xl p-5 flex flex-col shadow-2xl overflow-hidden">
            <h3 className="text-base font-bold text-white mb-2">Выберите регион:</h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {regionList.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    onSelectRegion(r.id);
                    setShowRegionModal(false);
                    SFX.click();
                  }}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition ${
                    currentRegion === r.id
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-[#181d2f] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{r.n}</span>
                  <span className="text-xs font-mono text-amber-400 font-bold">×{r.m}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowRegionModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs mt-3"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
