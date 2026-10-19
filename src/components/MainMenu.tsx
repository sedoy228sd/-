import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { SFX } from '../services/sound';
import { TiltCard } from './TiltCard';

interface MainMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (
    screen:
      | 'generator'
      | 'collection'
      | 'safe'
      | 'garage'
      | 'autosell'
      | 'upgrades'
      | 'catalog'
      | 'stats'
      | 'theme'
      | 'achievements'
      | 'leaderboard'
      | 'settings'
      | 'csharp'
      | 'cache500mb'
      | 'racing'
      | 'wheel'
      | 'rituals'
      | 'soundboard'
      | 'police'
      | 'cases'
      | 'customization'
      | 'auction'
  ) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[radial-gradient(ellipse_at_50%_0%,#18203c_0%,#0c1022_45%,#060812_100%)] text-white animate-fade-in select-none">
      {/* Top Header */}
      <header className="px-4 py-3.5 flex items-center gap-4 border-b border-white/10 bg-[#090d1c]/80 backdrop-blur-2xl sticky top-0 z-20">
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
          Меню
        </h1>
      </header>

      {/* Scrollable Menu Items matching Screenshot 1 & 3 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 pb-8">
        {/* Section title */}
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
          ГЕНЕРАТОР
        </div>

        {/* 1. Big Card: ГЕНЕРАТОР */}
        <div
          onClick={() => {
            SFX.click();
            onNavigate('generator');
          }}
          className="w-full rounded-2xl bg-gradient-to-b from-[#17223b] via-[#0f172a] to-[#0b0f1d] border border-blue-500/40 p-4 pb-0 overflow-hidden cursor-pointer hover:border-blue-400 transition shadow-lg group"
        >
          {/* Plate Artwork */}
          <div className="w-full max-w-[280px] mx-auto my-3 aspect-[4.8/1] rounded-lg bg-white border-2 border-black p-1 flex items-stretch text-black font-plate font-black shadow-xl group-hover:scale-105 transition-transform duration-200">
            <div className="flex-1 flex items-center justify-center text-2xl font-black tracking-tight">
              <span>А 777 АА</span>
            </div>
            <div className="w-[24%] border-l-2 border-black flex flex-col items-center justify-center text-xs leading-none">
              <span className="font-bold">777</span>
              <span className="text-[7px]">RUS 🇷🇺</span>
            </div>
          </div>

          <div className="w-full py-2.5 text-center text-xs font-black tracking-wider text-slate-300 uppercase border-t border-slate-800/80 bg-black/30 -mx-4 px-4 mt-2">
            ГЕНЕРАТОР
          </div>
        </div>

        {/* 2. Big Card: СОБЫТИЕ «НЕДЕЛЯ АВТОМОБИЛИСТА» */}
        <TiltCard
          onClick={() => onNavigate('garage')}
          className="w-full rounded-2xl bg-gradient-to-b from-[#131b2e] via-[#0a0f1d] to-[#060810] border border-cyan-500/30 overflow-hidden shadow-lg relative group hover:border-cyan-400 transition"
        >
          {/* Top Pill Timer */}
          <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5">
            Старт через 0 д 4 ч
          </div>

          {/* Car under cloth silhouette graphic */}
          <div className="h-28 w-full flex items-end justify-center relative px-6 pb-2">
            <svg viewBox="0 0 320 80" className="w-64 h-16 opacity-90 drop-shadow-md">
              <path
                d="M10 60 C30 58 60 55 90 40 C110 30 140 20 180 20 C230 20 260 38 290 52 C305 60 315 62 315 62 L5 62 Z"
                fill="#1e293b"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <circle cx="65" cy="62" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              <circle cx="255" cy="62" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            </svg>
          </div>

          <div className="w-full py-2.5 text-center text-xs font-black tracking-wider text-slate-300 uppercase border-t border-slate-800/80 bg-black/40">
            СОБЫТИЕ «НЕДЕЛЯ АВТОМОБИЛИСТА»
          </div>
        </TiltCard>

        {/* 3. Big Card: ЕЖЕДНЕВНЫЕ ЗАДАНИЯ */}
        <TiltCard
          onClick={() => onNavigate('achievements')}
          className="w-full rounded-2xl bg-gradient-to-b from-[#182035] via-[#101626] to-[#080d18] border border-blue-500/30 overflow-hidden shadow-lg group hover:border-blue-400 transition"
        >
          {/* Notepad Graphic */}
          <div className="h-28 w-full flex items-center justify-center p-3">
            <div className="w-56 h-20 rounded-lg bg-white/95 text-slate-800 p-2 font-mono text-xs shadow-lg flex flex-col justify-center transform -rotate-1 group-hover:rotate-0 transition-transform">
              <div className="flex items-center gap-2 font-bold text-blue-900 border-b border-slate-200 pb-1">
                <span>☑</span>
                <span>A***AA (Собрано)</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-700 pt-1">
                <span>☐</span>
                <span>*777** (В процессе)</span>
              </div>
            </div>
          </div>

          <div className="w-full py-2.5 text-center text-xs font-black tracking-wider text-slate-300 uppercase border-t border-slate-800/80 bg-black/40">
            ЕЖЕДНЕВНЫЕ ЗАДАНИЯ
          </div>
        </TiltCard>

        {/* 4. Big Card: HD КЭШ ИГРЫ (500 МБ) */}
        <TiltCard
          onClick={() => onNavigate('cache500mb')}
          className="w-full rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-slate-900 border border-purple-500/50 p-3.5 flex items-center justify-between shadow-lg group hover:border-purple-400 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              💾
            </div>
            <div>
              <div className="text-sm font-extrabold text-white flex items-center gap-2">
                HD КЭШ ИГРЫ
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500 text-black">
                  500 МБ
                </span>
              </div>
              <div className="text-[11px] text-purple-300">
                4K текстуры ГОСТ, 3D автопарк и HD выхлоп
              </div>
            </div>
          </div>

          <div className="text-xs font-bold text-purple-400 group-hover:text-white transition">
            Управлять →
          </div>
        </TiltCard>

        {/* 5. Big Card: ЗВУКОВАЯ ЛАБОРАТОРИЯ (105+ ЗВУКОВ) */}
        <TiltCard
          onClick={() => onNavigate('soundboard')}
          className="w-full rounded-2xl bg-gradient-to-r from-amber-950/60 via-orange-950/60 to-slate-900 border border-amber-500/50 p-3.5 flex items-center justify-between shadow-lg group hover:border-amber-400 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/30 border border-amber-500/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform text-amber-400">
              🔊
            </div>
            <div>
              <div className="text-sm font-black text-white flex items-center gap-2">
                САУНДБОРД & ЛАБОРАТОРИЯ
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-black">
                  105+ ЗВУКОВ
                </span>
              </div>
              <div className="text-[11px] text-amber-300">
                Выхлоп V8/2JZ, крякалка ФСО, сирены ДПС и радио «Синдикат FM»
              </div>
            </div>
          </div>

          <div className="text-xs font-bold text-amber-400 group-hover:text-white transition">
            Слушать →
          </div>
        </TiltCard>

        {/* 2-Column Grid of 16 Themed Tile Cards */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* КЕЙСЫ С НОМЕРАМИ */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('cases');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#2a1b14] to-[#120b08] border border-amber-600/40 hover:border-amber-400 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">📦</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-amber-300 uppercase border-t border-amber-900/40 bg-black/40 truncate">
              КЕЙСЫ С НОМЕРАМИ
            </div>
          </div>

          {/* ПОСТ ДПС & РЕЙД */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('police');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#141d2e] to-[#080d18] border border-blue-600/40 hover:border-blue-400 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">👮</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-blue-300 uppercase border-t border-blue-900/40 bg-black/40 truncate">
              РЕЙД ДПС
            </div>
          </div>

          {/* РАМКИ & ПИТОМЦЫ */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('customization');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#1b142a] to-[#0d0916] border border-purple-500/40 hover:border-purple-400 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">🛡️</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-purple-300 uppercase border-t border-purple-900/40 bg-black/40 truncate">
              РАМКИ & ПИТОМЦЫ
            </div>
          </div>

          {/* РИТУАЛЫ & НУМЕРОЛОГИЯ */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('rituals');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#14262a] to-[#081216] border border-cyan-500/40 hover:border-cyan-400 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">🔮</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-cyan-300 uppercase border-t border-cyan-900/40 bg-black/40 truncate">
              РИТУАЛЫ УДАЧИ
            </div>
          </div>

          {/* 1. КОЛЛЕКЦИЯ */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('collection');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#141b2c] to-[#0b101c] border border-slate-800 hover:border-blue-500/60 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">🏷️</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-slate-300 uppercase border-t border-slate-800/80 bg-black/40 truncate">
              КОЛЛЕКЦИЯ
            </div>
          </div>

          {/* 2. СЕЙФ */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('safe');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#141b2c] to-[#0b101c] border border-slate-800 hover:border-blue-500/60 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">🗄️</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-slate-300 uppercase border-t border-slate-800/80 bg-black/40 truncate">
              СЕЙФ
            </div>
          </div>

          {/* 3. ГАРАЖ & АВТОСАЛОН 4K */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('garage');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#141b2c] to-[#0b101c] border border-amber-500/40 hover:border-amber-400 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">🏎️</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-amber-300 uppercase border-t border-amber-900/40 bg-black/40 truncate">
              АВТОСАЛОН 4K
            </div>
          </div>

          {/* 4. ДРЭГ-РЕЙСИНГ 402М */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('racing');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#2a1318] to-[#12070a] border border-rose-500/40 hover:border-rose-400 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">🏁</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-rose-300 uppercase border-t border-rose-900/40 bg-black/40 truncate">
              ДРЭГ-РЕЙСИНГ 402М
            </div>
          </div>

          {/* 5. КОЛЕСО ФОРТУНЫ */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('wheel');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#1a2618] to-[#0a1209] border border-emerald-500/40 hover:border-emerald-400 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">🎡</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-emerald-300 uppercase border-t border-emerald-900/40 bg-black/40 truncate">
              КОЛЕСО ФОРТУНЫ
            </div>
          </div>

          {/* 6. АВТОПРОДАЖА */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('autosell');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#141b2c] to-[#0b101c] border border-slate-800 hover:border-blue-500/60 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">💵</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-slate-300 uppercase border-t border-slate-800/80 bg-black/40 truncate">
              АВТОПРОДАЖА
            </div>
          </div>

          {/* 5. УЛУЧШЕНИЯ */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('upgrades');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#141b2c] to-[#0b101c] border border-slate-800 hover:border-blue-500/60 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">🛠️</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-slate-300 uppercase border-t border-slate-800/80 bg-black/40 truncate">
              УЛУЧШЕНИЯ
            </div>
          </div>

          {/* 6. КАТАЛОГ РЕДКОСТЕЙ */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('catalog');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#141b2c] to-[#0b101c] border border-slate-800 hover:border-blue-500/60 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">✨</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-slate-300 uppercase border-t border-slate-800/80 bg-black/40 truncate">
              КАТАЛОГ РЕДКОСТЕЙ
            </div>
          </div>

          {/* 7. СТАТИСТИКА */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('stats');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#141b2c] to-[#0b101c] border border-slate-800 hover:border-blue-500/60 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">📊</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-slate-300 uppercase border-t border-slate-800/80 bg-black/40 truncate">
              СТАТИСТИКА
            </div>
          </div>

          {/* 8. ТЕМА */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('theme');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#141b2c] to-[#0b101c] border border-slate-800 hover:border-blue-500/60 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">🎨</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-slate-300 uppercase border-t border-slate-800/80 bg-black/40 truncate">
              ТЕМА
            </div>
          </div>

          {/* 9. ДОСТИЖЕНИЯ */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('achievements');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#141b2c] to-[#0b101c] border border-slate-800 hover:border-blue-500/60 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">🏆</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-slate-300 uppercase border-t border-slate-800/80 bg-black/40 truncate">
              ДОСТИЖЕНИЯ
            </div>
          </div>

          {/* 10. РЕЙТИНГ ИГРОКОВ */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('leaderboard');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#141b2c] to-[#0b101c] border border-slate-800 hover:border-blue-500/60 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">🥇</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-slate-300 uppercase border-t border-slate-800/80 bg-black/40 truncate">
              РЕЙТИНГ ИГРОКОВ
            </div>
          </div>

          {/* 11. НАСТРОЙКИ */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('settings');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#141b2c] to-[#0b101c] border border-slate-800 hover:border-blue-500/60 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <span className="text-4xl group-hover:scale-110 transition-transform">⚙️</span>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-slate-300 uppercase border-t border-slate-800/80 bg-black/40 truncate">
              НАСТРОЙКИ
            </div>
          </div>

          {/* 12. KOTLIN & ANDROID APK (ПРОЕКТ И СБОРКА) */}
          <div
            onClick={() => {
              SFX.click();
              onNavigate('csharp');
            }}
            className="rounded-2xl bg-gradient-to-b from-[#26153b] to-[#120a21] border border-purple-500/50 hover:border-purple-400 overflow-hidden cursor-pointer transition shadow-md group flex flex-col justify-between"
          >
            <div className="h-24 flex items-center justify-center p-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7F52FF] to-[#E052A0] shadow-lg flex items-center justify-center font-mono font-black text-white text-lg group-hover:scale-110 transition-transform">
                Kt
              </div>
            </div>
            <div className="py-2 px-2 text-center text-[11px] font-black tracking-wider text-purple-300 uppercase border-t border-purple-900/50 bg-black/40 truncate">
              KOTLIN & ANDROID APK
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
