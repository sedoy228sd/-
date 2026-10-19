import React, { useState } from 'react';
import { Award, Camera, Check, ChevronLeft, ChevronRight, Eye, Gauge, Maximize2, ShieldAlert, Sparkles, Volume2, Wrench, X, Zap } from 'lucide-react';
import { getCarIllustration } from '../data/carVisuals';
import { SFX, triggerHaptic } from '../services/sound';
import { Car, Plate } from '../types';

interface ShowroomInspectionBayProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
  isOwned: boolean;
  onBuy?: () => void;
  canAfford?: boolean;
  equippedPlate?: Plate | null;
  onTuningClick?: () => void;
}

export const ShowroomInspectionBay: React.FC<ShowroomInspectionBayProps> = ({
  car,
  isOpen,
  onClose,
  isOwned,
  onBuy,
  canAfford = true,
  equippedPlate,
  onTuningClick,
}) => {
  const [viewMode, setViewMode] = useState<'photo' | 'render'>('photo');
  const [photoIndex, setPhotoIndex] = useState(0);
  const [headlightsOn, setHeadlightsOn] = useState(false);
  const [underglowOn, setUnderglowOn] = useState(false);
  const [isEngineRevving, setIsEngineRevving] = useState(false);
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!isOpen) return null;

  const photos = car.galleryUrls && car.galleryUrls.length > 0 
    ? car.galleryUrls 
    : [car.photoUrl || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=85'];

  const currentPhoto = photos[photoIndex % photos.length];

  const handleRevEngine = () => {
    setIsEngineRevving(true);
    triggerHaptic(40);

    // Play specific sound based on vehicle engine type
    switch (car.soundType) {
      case '2jz':
      case '1jz':
        SFX.turbo();
        setTimeout(() => SFX.rev(), 180);
        break;
      case 'v10':
      case 'w16':
        SFX.rev();
        setTimeout(() => SFX.tierUp(4), 220);
        break;
      case 'v8amg':
        SFX.slam();
        setTimeout(() => SFX.rev(), 120);
        break;
      case 'vaz':
      default:
        SFX.rev();
        break;
    }

    setTimeout(() => setIsEngineRevving(false), 950);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'retro':
        return { label: 'Классика СССР', color: 'from-amber-600 to-yellow-600', text: 'text-amber-300' };
      case 'city':
        return { label: 'Городской Стрит', color: 'from-emerald-600 to-teal-600', text: 'text-emerald-300' };
      case 'jdm':
        return { label: 'JDM Легенда', color: 'from-red-600 to-rose-600', text: 'text-rose-300' };
      case 'prem':
        return { label: 'Бизнес & Премиум', color: 'from-blue-600 to-indigo-600', text: 'text-blue-300' };
      case 'super':
        return { label: 'Суперкар 700+ л.с.', color: 'from-purple-600 to-pink-600', text: 'text-purple-300' };
      case 'hyper':
        return { label: 'Гиперкар Синдиката', color: 'from-amber-400 to-cyan-400', text: 'text-cyan-300' };
      default:
        return { label: 'Автомобиль', color: 'from-slate-700 to-slate-800', text: 'text-slate-300' };
    }
  };

  const catBadge = getCategoryBadge(car.cat);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in select-none">
      <div className="w-full max-w-3xl max-h-[94vh] bg-[#0c0f17] border border-slate-700/80 rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800/80 bg-[#121624]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xl shadow-inner">
              {car.icon || '🚘'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                  {car.n}
                </h2>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r ${catBadge.color} text-white shadow-sm`}>
                  {catBadge.label}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{car.pwr} л.с.</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">+{car.inc.toLocaleString('ru-RU')} ₽/сек</span>
                <span>•</span>
                <span className="text-slate-400">Пакет 500 МБ HD</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
        </div>

        {/* View Mode & Gallery Selector */}
        <div className="px-4 sm:px-6 py-2 bg-[#080b12] border-b border-slate-800 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setViewMode('photo');
                SFX.click();
              }}
              className={`px-3 py-1 rounded-xl transition flex items-center gap-1.5 ${
                viewMode === 'photo'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Реальное фото HD</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-black/30 font-mono">4K</span>
            </button>

            <button
              onClick={() => {
                setViewMode('render');
                SFX.click();
              }}
              className={`px-3 py-1 rounded-xl transition flex items-center gap-1.5 ${
                viewMode === 'render'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>3D Вектор</span>
            </button>
          </div>

          {photos.length > 1 && viewMode === 'photo' && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <span>Ракурс: {photoIndex + 1} / {photos.length}</span>
              <button
                onClick={() => {
                  setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
                  SFX.click();
                }}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-300"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setPhotoIndex((prev) => (prev + 1) % photos.length);
                  SFX.click();
                }}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-300"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Stage / Showroom Turntable */}
        <div className="relative w-full h-64 sm:h-80 bg-gradient-to-b from-[#141b2c] via-[#0d121f] to-[#070910] flex items-center justify-center p-3 sm:p-5 overflow-hidden border-b border-slate-800">
          {/* Ambient Lighting & Studio Reflections */}
          <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.2)_0%,transparent_70%)]" />

          {/* Underglow Neon (if enabled) */}
          {underglowOn && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-12 rounded-full bg-cyan-400/35 blur-xl pointer-events-none animate-pulse" />
          )}

          {/* Turntable Floor Ring */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-[560px] h-20 rounded-[50%] border border-slate-700/50 shadow-[0_0_40px_rgba(56,189,248,0.2)] bg-radial from-slate-900/90 to-transparent pointer-events-none" />

          {/* REAL PHOTO MODE */}
          {viewMode === 'photo' ? (
            <div className={`relative z-10 w-full max-w-lg h-full flex items-center justify-center transition-all duration-300 ${isEngineRevving ? 'scale-105' : 'scale-100'}`}>
              <div className="relative w-full h-full max-h-[260px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group cursor-pointer bg-black/60 flex items-center justify-center">
                {/* Real High-Resolution Photo */}
                <img
                  src={currentPhoto}
                  alt={car.n}
                  onLoad={() => setImageLoaded(true)}
                  onClick={() => setIsPhotoZoomed(true)}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  } group-hover:scale-105`}
                  loading="eager"
                />

                {/* Headlights High-Beam Simulation Overlay */}
                {headlightsOn && (
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-cyan-400/15 via-transparent to-amber-200/20 mix-blend-screen" />
                )}

                {/* Fullscreen Zoom Hint */}
                <button
                  onClick={() => setIsPhotoZoomed(true)}
                  className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-xl bg-black/75 hover:bg-black text-white text-[11px] font-bold border border-white/20 backdrop-blur-md flex items-center gap-1.5 opacity-90 transition shadow-lg"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  Увеличить 4K
                </button>

                {/* 500 MB HD Asset Watermark */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-black/75 text-cyan-400 text-[10px] font-mono font-black border border-cyan-500/30 backdrop-blur-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  500 MB ULTRA HD PHOTO
                </div>

                {/* MOUNTED LICENSE PLATE OVERLAY ON FRONT BUMPER */}
                {equippedPlate && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded bg-white text-black font-plate font-black text-xs sm:text-sm border-2 border-black shadow-[0_8px_16px_rgba(0,0,0,0.9)] flex items-center gap-1.5">
                    <span>{equippedPlate.l[0]}</span>
                    <span className="font-mono">{equippedPlate.d.join('')}</span>
                    <span>{equippedPlate.l[1]}{equippedPlate.l[2]}</span>
                    <span className="border-l border-black pl-1.5 ml-1 text-[10px] font-sans font-bold flex flex-col items-center leading-none">
                      <span>{equippedPlate.reg}</span>
                      <span className="text-[7px]">RUS 🇷🇺</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* 3D VECTOR RENDER MODE */
            <div className={`w-full max-w-lg z-10 transition-transform duration-300 ${isEngineRevving ? 'scale-105' : 'scale-100'}`}>
              {getCarIllustration(car.id, headlightsOn)}

              {/* Mounted Number Plate on Render */}
              {equippedPlate && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded bg-white text-black font-plate font-black text-xs border border-black shadow-lg">
                  {equippedPlate.l[0]} {equippedPlate.d.join('')} {equippedPlate.l[1]}{equippedPlate.l[2]} {equippedPlate.reg}
                </div>
              )}
            </div>
          )}

          {/* Interactive Controls Overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
            <button
              onClick={() => {
                setHeadlightsOn(!headlightsOn);
                SFX.click();
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 shadow-md backdrop-blur-md ${
                headlightsOn
                  ? 'bg-amber-400 text-black border-amber-300 font-black'
                  : 'bg-black/60 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              💡 {headlightsOn ? 'Ксенон ВКЛ' : 'Ксенон'}
            </button>

            <button
              onClick={() => {
                setUnderglowOn(!underglowOn);
                SFX.click();
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 shadow-md backdrop-blur-md ${
                underglowOn
                  ? 'bg-cyan-500 text-black border-cyan-400 font-black'
                  : 'bg-black/60 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              ✨ {underglowOn ? 'Неон ВКЛ' : 'Неон'}
            </button>

            <button
              onClick={handleRevEngine}
              disabled={isEngineRevving}
              className={`px-3 py-1.5 rounded-xl border text-xs font-black transition flex items-center gap-1.5 shadow-md backdrop-blur-md ${
                isEngineRevving
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-amber-500/90 hover:bg-amber-400 text-black border-amber-400'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              {isEngineRevving ? 'ГАЗ В ПОЛ...' : 'ГАЗНУТЬ ЗВУК'}
            </button>
          </div>
        </div>

        {/* Specifications & Real Technical Data */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#131724] border border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Мощность</div>
              <div className="text-base font-black font-mono-num text-white mt-0.5">{car.pwr} л.с.</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{car.specs?.engine || 'ДВС Тюнинг'}</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#131724] border border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Разгон 0-100</div>
              <div className="text-base font-black font-mono-num text-cyan-400 mt-0.5">
                {car.specs?.zeroHundred || '4.2 с'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Макс: {car.specs?.topSpeed || '260 км/ч'}</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#131724] border border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Пассивный доход</div>
              <div className="text-base font-black font-mono-num text-emerald-400 mt-0.5">
                +{car.inc.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-[10px] text-emerald-500/80 mt-0.5">Каждые 2.5 сек</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#131724] border border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Стоимость</div>
              <div className="text-base font-black font-mono-num text-amber-400 mt-0.5">
                {car.c.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Год: {car.specs?.year || 2020}</div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-2 pt-1">
            {isOwned ? (
              <div className="flex-1 flex gap-2">
                <div className="flex-1 py-3 px-4 rounded-2xl bg-emerald-950/40 text-emerald-400 font-extrabold text-xs flex items-center justify-center gap-2 border border-emerald-500/30">
                  <Check className="w-4 h-4" /> Автомобиль находится в вашем гараже
                </div>
                {onTuningClick && (
                  <button
                    onClick={() => {
                      SFX.click();
                      onTuningClick();
                    }}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs shadow-lg transition flex items-center gap-1.5 active:scale-95"
                  >
                    <Wrench className="w-4 h-4" /> Тюнинг & Stage
                  </button>
                )}
              </div>
            ) : (
              <button
                disabled={!canAfford}
                onClick={onBuy}
                className={`w-full py-3.5 rounded-2xl font-black text-sm transition shadow-xl flex items-center justify-center gap-2 active:scale-95 ${
                  canAfford
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-black shadow-amber-500/25'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                КУПИТЬ В АВТОСАЛОНЕ ({car.c.toLocaleString('ru-RU')} ₽)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
      {isPhotoZoomed && (
        <div 
          onClick={() => setIsPhotoZoomed(false)}
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-2xl animate-fade-in"
        >
          <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={currentPhoto}
              alt={car.n}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-slate-700 shadow-2xl"
            />
            <button
              onClick={() => setIsPhotoZoomed(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-6 text-white bg-black/75 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
              <div className="text-sm font-black">{car.n}</div>
              <div className="text-xs text-amber-400 font-mono">Оригинальное 4K фото из пакета 512 МБ</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
