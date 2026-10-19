import React, { useMemo, useState } from 'react';
import { Disc3, Filter, Play, Radio, Search, Sliders, Square, Volume2, VolumeX, X, Zap } from 'lucide-react';
import { ALL_SOUND_EFFECTS, MegaAudio, SoundMeta } from '../services/megaSoundLibrary';
import { SFX, triggerHaptic } from '../services/sound';

interface SoundboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoundboardModal: React.FC<SoundboardModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pitch, setPitch] = useState<number>(1.0);
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [radioPlaying, setRadioPlaying] = useState<boolean>(MegaAudio.isRadioPlaying);
  const [currentRadioName, setCurrentRadioName] = useState<string>(MegaAudio.currentRadioTrack || 'Выключено');

  const categories = [
    { id: 'all', label: `Все звуки (${ALL_SOUND_EFFECTS.length})`, icon: '🔊' },
    { id: 'engine', label: 'Двигатели (18)', icon: '🏎️' },
    { id: 'police', label: 'Полиция & ДПС (12)', icon: '🚨' },
    { id: 'casino', label: 'Казино & Дропы (16)', icon: '🎰' },
    { id: 'factory', label: 'Завод ГОСТ (14)', icon: '🏭' },
    { id: 'ui', label: 'Интерфейс & Haptic (16)', icon: '📱' },
    { id: 'vehicle', label: 'Кузов & Улица (19)', icon: '🚗' },
    { id: 'radio', label: 'Радиостанции (10)', icon: '📻' },
  ];

  const filteredSounds = useMemo(() => {
    return ALL_SOUND_EFFECTS.filter((snd) => {
      const matchCat = selectedCategory === 'all' || snd.category === selectedCategory;
      const matchQuery =
        snd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snd.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const handlePlaySound = (snd: SoundMeta) => {
    setActiveSoundId(snd.id);
    triggerHaptic(20);
    snd.play(pitch);

    if (snd.category === 'radio') {
      if (snd.id === 'radio_stop') {
        setRadioPlaying(false);
        setCurrentRadioName('Выключено');
      } else {
        setRadioPlaying(true);
        setCurrentRadioName(snd.name);
      }
    }

    setTimeout(() => {
      setActiveSoundId(null);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in select-none">
      <div className="w-full max-w-4xl max-h-[92vh] bg-[#0c0f18] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-[#121626]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base sm:text-lg tracking-wide">
                  Звуковая Лаборатория (105+ FX)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black">
                  WEB AUDIO 96kHZ
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Процедурный синтез выхлопа, сирен ДПС, джекпотов и завода номеров
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              SFX.click();
              onClose();
            }}
            className="w-9 h-9 rounded-2xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Radio Station Player Bar */}
        <div className="px-5 sm:px-6 py-2.5 bg-gradient-to-r from-[#17142b] via-[#101222] to-[#0c0f1a] border-b border-purple-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${radioPlaying ? 'bg-purple-600 text-white animate-spin' : 'bg-slate-800 text-slate-400'}`}>
              <Disc3 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-purple-400 flex items-center gap-1.5">
                <Radio className="w-3 h-3" />
                <span>Радио «Синдикат FM»</span>
                {radioPlaying && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
              </div>
              <div className="text-white font-bold truncate max-w-[220px] sm:max-w-md">
                {currentRadioName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Visualizer bars */}
            {radioPlaying && (
              <div className="hidden sm:flex items-center gap-0.5 h-4">
                {[12, 16, 8, 20, 14, 18, 10].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-purple-400 rounded-full animate-pulse"
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 120}ms`,
                    }}
                  />
                ))}
              </div>
            )}

            {radioPlaying ? (
              <button
                onClick={() => {
                  MegaAudio.stopRadio();
                  setRadioPlaying(false);
                  setCurrentRadioName('Выключено');
                  SFX.click();
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1 transition shadow"
              >
                <Square className="w-3 h-3" /> Выкл
              </button>
            ) : (
              <button
                onClick={() => {
                  MegaAudio.playRadioTrack('phonk');
                  setRadioPlaying(true);
                  setCurrentRadioName('Радио: Ночной Дрифт Фонк (808 Bass)');
                  SFX.click();
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center gap-1 transition shadow"
              >
                <Play className="w-3 h-3" /> Фонк Врубить
              </button>
            )}
          </div>
        </div>

        {/* Controls Ribbon: Category Chips & Search & Pitch Slider */}
        <div className="px-5 sm:px-6 py-2.5 bg-[#090c14] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs min-w-[160px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск звука: Гелик, Крякалка, Выхлоп..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#141824] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Pitch Control Slider */}
          <div className="flex items-center gap-2 bg-[#121624] px-3 py-1 rounded-xl border border-slate-800 text-[11px] font-bold text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Тональность:</span>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-20 accent-amber-400 cursor-pointer"
            />
            <span className="font-mono text-amber-400 w-8 text-right">{pitch.toFixed(2)}x</span>
            {pitch !== 1.0 && (
              <button
                onClick={() => setPitch(1.0)}
                className="text-[9px] text-slate-400 hover:text-white underline ml-1"
              >
                1x
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="px-5 sm:px-6 py-2 bg-[#0c0f1a] border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                SFX.click();
              }}
              className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all text-[11px] font-bold flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Sound Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filteredSounds.map((snd) => {
              const isActive = activeSoundId === snd.id;

              return (
                <div
                  key={snd.id}
                  onClick={() => handlePlaySound(snd)}
                  className={`p-3 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 shadow-sm select-none active:scale-95 ${
                    isActive
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-[1.02]'
                      : 'bg-[#121624] border-slate-800/80 hover:border-slate-700 hover:bg-[#161c2e] text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition ${
                      isActive ? 'bg-amber-500 text-black scale-110 shadow-md' : 'bg-slate-800/80'
                    }`}>
                      {snd.icon}
                    </div>

                    <div className="overflow-hidden">
                      <div className="font-bold text-xs truncate leading-tight text-white">
                        {snd.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {snd.description}
                      </div>
                    </div>
                  </div>

                  <button
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition ${
                      isActive
                        ? 'bg-amber-400 text-black'
                        : 'bg-slate-800 text-slate-400 group-hover:text-white'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {filteredSounds.length === 0 && (
            <div className="text-center py-16 text-slate-500 text-xs">
              Ничего не найдено по запросу «{searchQuery}». Попробуйте другое слово.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-[#090c14] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Всего в библиотеке: <b className="text-amber-400">{ALL_SOUND_EFFECTS.length}</b> звуков</span>
          <span className="text-[11px] font-mono text-purple-400">100% процедурный звук Web Audio (без скачивания)</span>
        </div>
      </div>
    </div>
  );
};
