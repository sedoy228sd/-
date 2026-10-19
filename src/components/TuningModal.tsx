import React, { useState } from 'react';
import { Gauge, Shield, Sparkles, Wrench, X, Zap } from 'lucide-react';
import { CARS } from '../data/constants';
import { SFX, triggerHaptic } from '../services/sound';
import { Car } from '../types';

interface TuningModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  garageCarIds: number[];
  carTuning: Record<number, string[]>; // carId -> upgradeIds
  onApplyUpgrade: (carId: number, upgradeId: string, cost: number) => void;
}

interface UpgradeOption {
  id: string;
  name: string;
  cost: number;
  hpBonus: number;
  incBonusPercent: number;
  desc: string;
  icon: string;
}

const UPGRADES: UpgradeOption[] = [
  {
    id: 'stage1',
    name: 'Stage 1 Прошивка ECU',
    cost: 75000,
    hpBonus: 35,
    incBonusPercent: 25,
    desc: 'Оптимизация наддува и угла зажигания',
    icon: '⚡',
  },
  {
    id: 'stage2',
    name: 'Stage 2 Турбо-Кит & Интеркулер',
    cost: 350000,
    hpBonus: 95,
    incBonusPercent: 65,
    desc: 'Холодный впуск и увеличенная турбина Garrett',
    icon: '🔥',
  },
  {
    id: 'tint',
    name: 'Тонировка в круг 5% (Lumar)',
    cost: 25000,
    hpBonus: 0,
    incBonusPercent: 15,
    desc: 'Полный бункерный стиль',
    icon: '🕶️',
  },
  {
    id: 'air',
    name: 'Пневмоподвеска 4-контурная (БПАН)',
    cost: 140000,
    hpBonus: 0,
    incBonusPercent: 30,
    desc: 'Ложится на пороги по нажатию кнопки',
    icon: '🛠️',
  },
  {
    id: 'exhaust',
    name: 'Титановый выхлоп Akrapovič',
    cost: 220000,
    hpBonus: 25,
    incBonusPercent: 40,
    desc: 'Басовитый отстрел и попкорн при сбросе газа',
    icon: '🔊',
  },
];

export const TuningModal: React.FC<TuningModalProps> = ({
  isOpen,
  onClose,
  balance,
  garageCarIds,
  carTuning,
  onApplyUpgrade,
}) => {
  const [selectedCarId, setSelectedCarId] = useState<number>(garageCarIds[0] || 1);

  if (!isOpen) return null;

  const currentCar = CARS.find((c) => c.id === selectedCarId) || CARS[0];
  const appliedUpgrades = carTuning[selectedCarId] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl max-h-[88vh] bg-[#121522] border border-slate-700 rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#161a29]">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">Тюнинг-Ателье & Доработки</h3>
              <div className="text-[11px] text-slate-400">Форсирование мотора, Stage-прошивки и стайлинг</div>
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

        {/* Car selector tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#0e111b] border-b border-slate-800 overflow-x-auto text-xs font-bold">
          {garageCarIds.map((cId) => {
            const car = CARS.find((c) => c.id === cId);
            if (!car) return null;
            const isSelected = selectedCarId === car.id;
            return (
              <button
                key={car.id}
                onClick={() => {
                  setSelectedCarId(car.id);
                  SFX.click();
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-[#181d2f] text-slate-400 hover:text-white'
                }`}
              >
                <span>{car.icon || '🏎️'}</span>
                <span>{car.n}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          {/* Selected Car Specs Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#181d2f] to-[#121624] border border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentCar.icon || '🏎️'}</span>
              <div>
                <div className="text-base font-extrabold text-white">{currentCar.n}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Базовая мощность: <strong className="text-white">{currentCar.pwr} л.с.</strong> · Базовый доход: <strong className="text-emerald-400">+{currentCar.inc} ₽/с</strong>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase">Установлено тюнинга:</div>
              <div className="text-xs font-bold text-amber-400">{appliedUpgrades.length} / {UPGRADES.length}</div>
            </div>
          </div>

          {/* Upgrades List */}
          <div className="space-y-2">
            {UPGRADES.map((upg) => {
              const isInstalled = appliedUpgrades.includes(upg.id);
              const canAfford = balance >= upg.cost;

              return (
                <div
                  key={upg.id}
                  className="p-3.5 rounded-xl bg-[#181d2f] border border-slate-800 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{upg.icon}</span>
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        {upg.name}
                        {isInstalled && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            УСТАНОВЛЕНО
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {upg.desc} · <span className="text-emerald-400 font-semibold">+{upg.incBonusPercent}% к доходу</span>
                        {upg.hpBonus > 0 && <span> · <strong className="text-amber-400">+{upg.hpBonus} л.с.</strong></span>}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isInstalled ? (
                      <span className="text-xs font-bold text-slate-500 px-3 py-1.5">Активно</span>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          onApplyUpgrade(selectedCarId, upg.id, upg.cost);
                          SFX.rev();
                          triggerHaptic(25);
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition shadow-sm ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-black'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {upg.cost.toLocaleString('ru-RU')} ₽
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
