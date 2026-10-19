import React, { useMemo, useState } from 'react';
import { Camera, Car as CarIcon, Check, Eye, Filter, Flame, Gauge, Search, Sparkles, Volume2, Wrench, X, Zap } from 'lucide-react';
import { CARS } from '../data/constants';
import { SFX, triggerHaptic } from '../services/sound';
import { Car, Plate } from '../types';
import { ShowroomInspectionBay } from './ShowroomInspectionBay';

interface DealershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  ownedCarIds: number[];
  inventory: Plate[];
  carPlates: Record<number, number>;
  onBuyCar: (car: Car) => void;
  onAssignPlate: (carId: number, plateId: number) => void;
  onOpenTuning?: () => void;
}

export const DealershipModal: React.FC<DealershipModalProps> = ({
  isOpen,
  onClose,
  balance,
  ownedCarIds,
  inventory,
  carPlates,
  onBuyCar,
  onAssignPlate,
  onOpenTuning,
}) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'garage'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedCar, setInspectedCar] = useState<Car | null>(null);
  const [selectedCarForPlate, setSelectedCarForPlate] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'Все автомобили' },
    { id: 'retro', label: 'Ретро СССР' },
    { id: 'city', label: 'Городские' },
    { id: 'jdm', label: 'JDM Легенды' },
    { id: 'prem', label: 'Премиум' },
    { id: 'super', label: 'Суперкары' },
    { id: 'hyper', label: 'Гиперкары' },
  ];

  const filteredCars = useMemo(() => {
    return CARS.filter((car) => {
      const matchesCat = selectedCategory === 'all' || car.cat === selectedCategory;
      const matchesSearch =
        car.n.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.cat.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-xl select-none animate-fade-in">
        <div className="w-full max-w-4xl max-h-[92vh] bg-[#0c0f18] border border-slate-700/80 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-[#121626]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <CarIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-white text-base sm:text-lg tracking-wide">
                    Автосалон «Синдикат Моторс»
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-black">
                    500 MB HD ФОТО
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Куплено: <span className="text-amber-400 font-bold">{ownedCarIds.length}</span> из {CARS.length} авто · Пассивный автопарк
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center px-3.5 py-1.5 rounded-2xl bg-[#080b12] border border-slate-800 font-mono text-xs font-bold text-amber-400">
                {balance.toLocaleString('ru-RU')} ₽
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
          </div>

          {/* Tab Switcher & Search Bar */}
          <div className="px-5 sm:px-6 py-2.5 bg-[#090c14] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('shop')}
                className={`px-4 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'shop'
                    ? 'bg-amber-500 text-black shadow-lg font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Каталог с реальными фото ({CARS.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('garage')}
                className={`px-4 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'garage'
                    ? 'bg-purple-600 text-white shadow-lg font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CarIcon className="w-3.5 h-3.5" />
                <span>Мой Гараж ({ownedCarIds.length})</span>
              </button>
            </div>

            {/* Quick Search Input */}
            <div className="relative flex-1 sm:max-w-xs min-w-[160px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск марки: ВАЗ, Supra, Гелик..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#141824] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Category Filter Chips (Shop tab) */}
          {activeTab === 'shop' && (
            <div className="px-5 sm:px-6 py-2 bg-[#0d101b] border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    SFX.click();
                  }}
                  className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all text-[11px] font-bold ${
                    selectedCategory === cat.id
                      ? 'bg-slate-200 text-black shadow'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Main Content Area */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            {activeTab === 'shop' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCars.map((car) => {
                  const isOwned = ownedCarIds.includes(car.id);
                  const canAfford = balance >= car.c;

                  return (
                    <div
                      key={car.id}
                      className="rounded-3xl bg-[#121624] border border-slate-800/80 hover:border-slate-700/80 p-3.5 flex flex-col justify-between gap-3 shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
                    >
                      {/* Real Photo Thumbnail */}
                      <div
                        onClick={() => {
                          setInspectedCar(car);
                          SFX.click();
                        }}
                        className="w-full h-44 rounded-2xl bg-black/60 overflow-hidden relative cursor-pointer group-hover:shadow-2xl transition border border-slate-700/50 flex items-center justify-center"
                      >
                        <img
                          src={car.photoUrl}
                          alt={car.n}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                          loading="lazy"
                        />

                        {/* Top Overlays */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-amber-400 text-[10px] font-mono font-black border border-white/10 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> 4K РЕАЛЬНОЕ ФОТО
                        </div>

                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition shadow-lg">
                          <Eye className="w-3 h-3 text-cyan-400" />
                          Осмотр 360°
                        </div>

                        {/* Sound preview button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            SFX.rev();
                            triggerHaptic(25);
                          }}
                          className="absolute bottom-2 left-2 p-1.5 rounded-xl bg-black/80 hover:bg-amber-500 hover:text-black text-amber-400 border border-white/10 transition shadow-md flex items-center gap-1 text-[10px] font-bold"
                          title="Послушать выхлоп"
                        >
                          <Volume2 className="w-3 h-3" />
                          Звук
                        </button>

                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-slate-300 text-[10px] font-semibold border border-white/10">
                          {car.pwr} л.с.
                        </div>
                      </div>

                      {/* Car Details */}
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-white text-sm tracking-wide">
                            {car.n}
                          </h4>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-800 text-amber-400 border border-slate-700">
                            {car.cat}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center justify-between text-xs">
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" />+{car.inc.toLocaleString('ru-RU')} ₽/сек
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {car.specs?.zeroHundred || '4.0 с'} до 100
                          </span>
                        </div>
                      </div>

                      {/* Buy Row */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="font-mono font-black text-amber-400 text-sm">
                          {car.c.toLocaleString('ru-RU')} ₽
                        </div>

                        {isOwned ? (
                          <span className="text-xs font-black text-emerald-400 flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                            <Check className="w-3.5 h-3.5" /> В гараже
                          </span>
                        ) : (
                          <button
                            disabled={!canAfford}
                            onClick={() => {
                              onBuyCar(car);
                              SFX.coin();
                              triggerHaptic(20);
                            }}
                            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 ${
                              canAfford
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-amber-500/20'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                            }`}
                          >
                            Купить
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* MY GARAGE TAB */}
            {activeTab === 'garage' && (
              <div className="space-y-4">
                {ownedCarIds.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 text-sm">
                    Ваш гараж пуст. Приобретите первый автомобиль в автосалоне!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ownedCarIds.map((carId) => {
                      const car = CARS.find((c) => c.id === carId);
                      if (!car) return null;
                      const assignedPlateId = carPlates[car.id];
                      const assignedPlate = inventory.find((p) => p.id === assignedPlateId);

                      return (
                        <div
                          key={car.id}
                          className="rounded-3xl bg-[#121624] border border-slate-800 p-4 space-y-3.5 shadow-xl overflow-hidden relative"
                        >
                          {/* Photo with Plate Preview */}
                          <div
                            onClick={() => {
                              setInspectedCar(car);
                              SFX.click();
                            }}
                            className="w-full h-48 rounded-2xl bg-black/60 relative overflow-hidden border border-slate-700/60 cursor-pointer group"
                          >
                            <img
                              src={car.photoUrl}
                              alt={car.n}
                              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                            />

                            {/* Equipped Plate mounted right onto the photo! */}
                            {assignedPlate ? (
                              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded bg-white text-black font-plate font-black text-xs border border-black shadow-[0_4px_12px_rgba(0,0,0,0.9)] flex items-center gap-1.5">
                                <span>{assignedPlate.l[0]}</span>
                                <span className="font-mono">{assignedPlate.d.join('')}</span>
                                <span>{assignedPlate.l[1]}{assignedPlate.l[2]}</span>
                                <span className="border-l border-black pl-1 text-[9px] font-sans font-bold">
                                  {assignedPlate.reg} RUS
                                </span>
                              </div>
                            ) : (
                              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-xl bg-black/75 text-amber-400 text-[11px] font-bold border border-amber-500/30">
                                ⚠️ Номер не установлен
                              </div>
                            )}

                            <div className="absolute top-2 right-2 px-2.5 py-1 rounded-xl bg-black/75 text-white text-[10px] font-bold border border-white/10 flex items-center gap-1">
                              <Eye className="w-3 h-3 text-cyan-400" />
                              Осмотр 360°
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-black text-white text-base">{car.n}</h4>
                              <div className="text-xs text-emerald-400 font-bold mt-0.5">
                                +{car.inc.toLocaleString('ru-RU')} ₽/сек доход
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setInspectedCar(car);
                                SFX.click();
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                            >
                              <Camera className="w-3.5 h-3.5 text-amber-400" />
                              Фото 4K
                            </button>
                          </div>

                          {/* Plate Assignment Picker */}
                          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                            <span className="text-xs text-slate-400">Установленный госномер:</span>

                            <select
                              value={assignedPlateId || ''}
                              onChange={(e) => {
                                const pId = Number(e.target.value);
                                if (pId) onAssignPlate(car.id, pId);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#090c14] border border-slate-700 text-white text-xs font-mono font-bold focus:outline-none focus:border-amber-400"
                            >
                              <option value="">(Выбрать номер)</option>
                              {inventory.map((plate) => (
                                <option key={plate.id} value={plate.id}>
                                  {plate.l[0]} {plate.d.join('')} {plate.l[1]}{plate.l[2]} {plate.reg} (
                                  {plate.price.toLocaleString()} ₽)
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Showroom 3D / Real Photo Inspection Modal */}
      {inspectedCar && (
        <ShowroomInspectionBay
          car={inspectedCar}
          isOpen={true}
          onClose={() => setInspectedCar(null)}
          isOwned={ownedCarIds.includes(inspectedCar.id)}
          canAfford={balance >= inspectedCar.c}
          equippedPlate={
            carPlates[inspectedCar.id]
              ? inventory.find((p) => p.id === carPlates[inspectedCar.id]) || null
              : null
          }
          onBuy={() => {
            onBuyCar(inspectedCar);
            SFX.coin();
          }}
          onTuningClick={() => {
            setInspectedCar(null);
            if (onOpenTuning) onOpenTuning();
          }}
        />
      )}
    </>
  );
};
