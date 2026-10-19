import React from 'react';
import { RotateCcw, Settings, Volume2, VolumeX, Vibrate, X } from 'lucide-react';
import { SFX, triggerHaptic } from '../services/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  sound: boolean;
  haptic: boolean;
  onThemeChange: (theme: 'dark' | 'light' | 'cyber' | 'luxury' | 'retro80') => void;
  onToggleSound: () => void;
  onToggleHaptic: () => void;
  onResetGame: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  sound,
  haptic,
  onThemeChange,
  onToggleSound,
  onToggleHaptic,
  onResetGame,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#121522] border border-slate-700 rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#161a29]">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Настройки Игры</h3>
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

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Themes */}
          <div>
            <div className="font-bold text-slate-300 uppercase tracking-wider mb-2">Цветовая тема:</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'dark', label: '🌙 Ночная (Dark)' },
                { id: 'cyber', label: '⚡ Cyber City' },
                { id: 'luxury', label: '👑 Олигарх Золото' },
                { id: 'retro80', label: '🕹️ Retro 80s Synth' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onThemeChange(t.id as any);
                    SFX.click();
                  }}
                  className={`p-2.5 rounded-xl border font-bold text-left transition ${
                    theme === t.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-[#181d2f] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Haptics */}
          <div className="space-y-2">
            <div className="font-bold text-slate-300 uppercase tracking-wider mb-1">Звук и вибрация:</div>
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#181d2f] border border-slate-800">
              <span className="font-semibold text-slate-200">Звуковые эффекты (Web Audio)</span>
              <button
                onClick={onToggleSound}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  sound ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {sound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                {sound ? 'ВКЛ' : 'ВЫКЛ'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#181d2f] border border-slate-800">
              <span className="font-semibold text-slate-200">Тактильная виброотдача (Haptics)</span>
              <button
                onClick={onToggleHaptic}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  haptic ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Vibrate className="w-3.5 h-3.5" />
                {haptic ? 'ВКЛ' : 'ВЫКЛ'}
              </button>
            </div>
          </div>

          {/* Reset Save Data */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (window.confirm('Сбросить весь прогресс и начать игру заново?')) {
                  onResetGame();
                }
              }}
              className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Сбросить сохранение
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
