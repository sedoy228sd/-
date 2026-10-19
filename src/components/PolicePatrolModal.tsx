import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { AlertTriangle, Award, Check, ChevronRight, FileCheck, Flame, Shield, ShieldAlert, Siren, Volume2, X, Zap } from 'lucide-react';
import { MegaAudio } from '../services/megaSoundLibrary';
import { SFX, triggerHaptic } from '../services/sound';
import { Plate } from '../types';

interface PolicePatrolModalProps {
  isOpen: boolean;
  onClose: () => void;
  plate: Plate;
  carName: string;
  balance: number;
  onPayFine: (amount: number) => void;
  onRewardBonus: (amount: number) => void;
}

export const PolicePatrolModal: React.FC<PolicePatrolModalProps> = ({
  isOpen,
  onClose,
  plate,
  carName,
  balance,
  onPayFine,
  onRewardBonus,
}) => {
  const [outcome, setOutcome] = useState<'inspecting' | 'vip' | 'fine' | 'escaped' | 'cleared'>('inspecting');
  const [outcomeText, setOutcomeText] = useState('');

  if (!isOpen) return null;

  // Check if plate has elite prestige series
  const fullLetters = plate.l.join('');
  const digitsStr = plate.d.join('');
  const isBlat =
    ['ЕКХ', 'АМР', 'ВОР', 'ХАМ', 'САС', 'ООО', 'ААА'].includes(fullLetters) ||
    digitsStr === '777' ||
    digitsStr === '001' ||
    digitsStr === '999' ||
    plate.i >= 3;

  const handleInspect = () => {
    MegaAudio.inspectorWhistle();
    triggerHaptic(30);

    setTimeout(() => {
      if (isBlat) {
        MegaAudio.fsbClearance();
        confetti({ particleCount: 50, spread: 70 });
        setOutcome('vip');
        setOutcomeText(
          `Инспектор ДПС увидел номер ${fullLetters} ${digitsStr} ${plate.reg}: «Товарищ Полковник, честь имею! Вопросов нет, зелёная улица до самого Кремля!»`
        );
        onRewardBonus(250000);
      } else {
        const pass = Math.random() > 0.4;
        if (pass) {
          MegaAudio.inspectionBeep();
          setOutcome('cleared');
          setOutcomeText('Проверка по базе ГИБДД завершена: розыска нет, страховка в порядке. Счастливого пути!');
        } else {
          MegaAudio.finePenalty();
          setOutcome('fine');
          setOutcomeText('Инспектор обнаружил тонировку 5% не по ГОСТу и превышение шума выхлопа. Выписан штраф 1 000 ₽.');
          onPayFine(1000);
        }
      }
    }, 600);
  };

  const handleEscape = () => {
    MegaAudio.tireScreech();
    MegaAudio.policeYelp();
    triggerHaptic(40);

    setTimeout(() => {
      const escaped = Math.random() > 0.35;
      if (escaped) {
        MegaAudio.blowOffStututu();
        confetti({ particleCount: 60, spread: 80 });
        setOutcome('escaped');
        setOutcomeText('Успешный уход от погони по набережной на скорости 220 км/ч! Экипаж ДПС отстал на 3 километра. Респект Синдиката +50 000 ₽!');
        onRewardBonus(50000);
      } else {
        MegaAudio.finePenalty();
        setOutcome('fine');
        setOutcomeText('Перехват экипажем на следующем посту! Пришлось оплатить административный штраф 15 000 ₽.');
        onPayFine(15000);
      }
    }, 800);
  };

  const handleShowId = () => {
    MegaAudio.fsbClearance();
    triggerHaptic(25);
    setOutcome('vip');
    setOutcomeText('Вы показали служебное удостоверение специального ведомства. Инспектор козырнул и пожелал удачной дороги!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-fade-in select-none">
      <div className="w-full max-w-lg bg-[#0e111a] border border-blue-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-blue-500/30 bg-gradient-to-r from-[#172038] to-[#0f1422]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
              <Siren className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-white text-base tracking-wide flex items-center gap-2">
                Патруль 1-го полка ДПС
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                  СПЕЦРЕЙД
                </span>
              </h3>
              <div className="text-[11px] text-slate-400">
                Остановка транспортного средства на спецтрассе
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              SFX.click();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vehicle & Plate Card */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#141824] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Автомобиль: <b className="text-white">{carName}</b></span>
              <button
                onClick={() => MegaAudio.kryakalka()}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold text-[11px]"
              >
                <Volume2 className="w-3.5 h-3.5" /> Крякнуть ФСО
              </button>
            </div>

            {/* License plate visual */}
            <div className="w-full max-w-[320px] mx-auto aspect-[4.8/1] rounded-lg bg-white text-black border-2 border-black p-1 flex items-stretch font-plate font-black shadow-lg">
              <div className="flex-1 flex items-center justify-center text-2xl font-black">
                <span>{plate.l[0]}</span>
                <span className="font-mono mx-1.5">{digitsStr}</span>
                <span>{plate.l[1]}{plate.l[2]}</span>
              </div>
              <div className="w-[24%] border-l-2 border-black flex flex-col items-center justify-center text-xs leading-none">
                <span className="font-bold">{plate.reg}</span>
                <span className="text-[7px]">RUS 🇷🇺</span>
              </div>
            </div>

            {isBlat && (
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-center font-bold text-[11px] flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Блатная спецсерия активна! Инспектор в замешательстве.
              </div>
            )}
          </div>

          {/* Outcome Result Box */}
          {outcome !== 'inspecting' ? (
            <div
              className={`p-4 rounded-2xl border space-y-3 animate-fade-in ${
                outcome === 'vip' || outcome === 'cleared' || outcome === 'escaped'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="font-black text-sm flex items-center gap-2">
                {outcome === 'vip' && '👑 НЕПРИКОСНОВЕННЫЙ СТАТУС'}
                {outcome === 'cleared' && '✅ ПРОВЕРКА ПРОЙДЕНА'}
                {outcome === 'escaped' && '🏎️ УСПЕШНЫЙ ОТРЫВ ОТ ПОГОНИ'}
                {outcome === 'fine' && '🧾 ВЫПИСАН ШТРАФ'}
              </div>
              <div className="text-xs leading-relaxed">{outcomeText}</div>
              <button
                onClick={() => {
                  SFX.click();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs transition"
              >
                Продолжить путь
              </button>
            </div>
          ) : (
            /* Action Choices */
            <div className="space-y-2">
              <button
                onClick={handleInspect}
                className="w-full p-3 rounded-xl bg-[#141824] hover:bg-[#1a2030] border border-slate-800 hover:border-slate-700 text-left flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-bold text-white text-xs">Предъявить документы для проверки</div>
                    <div className="text-[10px] text-slate-400">Шанс отпустить сразу, если номер блатного типа</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
              </button>

              <button
                onClick={handleShowId}
                className="w-full p-3 rounded-xl bg-[#141824] hover:bg-[#1a2030] border border-amber-500/30 hover:border-amber-400 text-left flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-bold text-amber-300 text-xs">Показать корочку спецслужб</div>
                    <div className="text-[10px] text-slate-400">Гарантированный пропуск без досмотра</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
              </button>

              <button
                onClick={handleEscape}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-rose-950/40 to-[#141824] hover:border-rose-500 border border-slate-800 text-left flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <div>
                    <div className="font-bold text-rose-300 text-xs">Дать по газам и уйти в занос (220 км/ч)</div>
                    <div className="text-[10px] text-slate-400">Рискованно, но даёт куш +50 000 ₽ при отрыве</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
