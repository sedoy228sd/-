import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { RUSSIAN_LETTERS } from '../data/constants';
import { generatePlate, pickRandom } from '../services/plateGenerator';
import { SFX, triggerHaptic } from '../services/sound';
import { Plate } from '../types';

interface RitualsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlateGenerated: (p: Plate) => void;
  currentRegion: string;
}

export const RitualsModal: React.FC<RitualsModalProps> = ({
  isOpen,
  onClose,
  onPlateGenerated,
  currentRegion,
}) => {
  const [inputName, setInputName] = useState('МИХАИЛ');
  const [inputDate, setInputDate] = useState('2000-07-07');

  if (!isOpen) return null;

  const handleRitual = (type: string) => {
    SFX.coin();
    triggerHaptic(25);
    let p: Plate;

    if (type === 'name') {
      const clean = (inputName || 'АВТО').toUpperCase();
      let sum = 0;
      for (let i = 0; i < clean.length; i++) sum += clean.charCodeAt(i);
      const d1 = (sum % 9) + 1;
      const d2 = (sum * 3) % 10;
      const d3 = (sum * 7) % 10;
      p = generatePlate('ru', currentRegion, 'civil', {
        l: [pickRandom(RUSSIAN_LETTERS), pickRandom(RUSSIAN_LETTERS), pickRandom(RUSSIAN_LETTERS)],
        d: [d1, d2, d3],
      });
      p.P.unshift(`Нумерология имени: «${clean}»`);
    } else if (type === 'bday') {
      const parts = (inputDate || '2000-07-07').split('-');
      const d = parts[2] ? parseInt(parts[2], 10) % 10 : 7;
      const m = parts[1] ? parseInt(parts[1], 10) % 10 : 7;
      const y = parts[0] ? parseInt(parts[0].slice(-1), 10) : 7;
      p = generatePlate('ru', parts[0] ? parts[0].slice(-2) : '77', 'civil', {
        l: ['С', 'У', 'Д'],
        d: [d, m, y],
      });
      p.P.unshift('Код судьбы по дате рождения');
    } else if (type === 'dice') {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const d3 = Math.floor(Math.random() * 6) + 1;
      p = generatePlate('ru', currentRegion, 'civil', {
        l: ['К', 'У', 'Б'],
        d: [d1, d2, d3],
      });
      p.P.unshift(`Бросок игральных костей: [${d1}][${d2}][${d3}]`);
    } else if (type === 'coin') {
      const flip = Math.random() < 0.5 ? 'ОРЕЛ' : 'РЕШКА';
      const digits: [number, number, number] = flip === 'ОРЕЛ' ? [7, 7, 7] : [1, 0, 1];
      p = generatePlate('ru', currentRegion, 'civil', {
        l: ['О', 'Р', 'Л'],
        d: digits,
      });
      p.P.unshift(`Монетка судьбы: ${flip}`);
    } else if (type === 'taro') {
      const cards = ['Маг (001)', 'Колесо Фортуны (777)', 'Император (100)', 'Солнце (999)'];
      const c = pickRandom(cards);
      p = generatePlate('ru', currentRegion, 'civil', {
        l: ['Т', 'А', 'Р'],
        d: [Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1],
      });
      p.P.unshift(`Карта Таро: ${c}`);
    } else {
      p = generatePlate('ru', '77', 'civil', {
        l: ['В', 'И', 'Н'],
        d: [Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
      });
      p.P.unshift(`VIN-шифр WDB${Math.floor(Math.random() * 899999) + 100000}`);
    }

    onPlateGenerated(p);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl max-h-[85vh] bg-[#121522] border border-slate-700 rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Ритуалы & Особая Генерация</h3>
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

        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 text-xs">
          {/* Name ritual */}
          <div className="p-3.5 rounded-xl bg-[#181d2f] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1 w-full">
              <div className="font-bold text-white text-sm">Номер по имени / слову</div>
              <div className="text-slate-400 text-[11px] mb-2">Каббалистический расчет цифр через сумму букв</div>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-slate-700 text-white font-bold"
                placeholder="Введи имя (например: МАКСИМ)"
              />
            </div>
            <button
              onClick={() => handleRitual('name')}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold transition shadow-md"
            >
              Сгенерировать
            </button>
          </div>

          {/* Birthday */}
          <div className="p-3.5 rounded-xl bg-[#181d2f] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1 w-full">
              <div className="font-bold text-white text-sm">Номер по дате рождения</div>
              <div className="text-slate-400 text-[11px] mb-2">Генерация кода судьбы и региона</div>
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-slate-700 text-white font-bold"
              />
            </div>
            <button
              onClick={() => handleRitual('bday')}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold transition shadow-md"
            >
              По дате
            </button>
          </div>

          {/* 3d6 Dice */}
          <div className="p-3.5 rounded-xl bg-[#181d2f] border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-white text-sm">🎲 Бросок костей (3d6)</div>
              <div className="text-slate-400 text-[11px]">Три кости определяют цифровой триплет</div>
            </div>
            <button
              onClick={() => handleRitual('dice')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold transition"
            >
              Бросить
            </button>
          </div>

          {/* Coin flip */}
          <div className="p-3.5 rounded-xl bg-[#181d2f] border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-white text-sm">🪙 Орел или Решка</div>
              <div className="text-slate-400 text-[11px]">Бинарный выбор фортуны: [777] или [101]</div>
            </div>
            <button
              onClick={() => handleRitual('coin')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold transition"
            >
              Подбросить
            </button>
          </div>

          {/* Tarot */}
          <div className="p-3.5 rounded-xl bg-[#181d2f] border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-white text-sm">🃏 Карты Таро</div>
              <div className="text-slate-400 text-[11px]">Знак судьбы от старших арканов</div>
            </div>
            <button
              onClick={() => handleRitual('taro')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold transition"
            >
              Вытянуть карту
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
