import React from 'react';
import { ArrowLeft, Crown, Medal } from 'lucide-react';
import { SFX } from '../services/sound';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerBalance: number;
}

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Олигарх_Москва_77', balance: 4850000000, bestPlate: 'А 777 АА 77' },
  { rank: 2, name: 'Синдикат_ФСО', balance: 2140000000, bestPlate: 'Е 001 КХ 99' },
  { rank: 3, name: 'Sheikh_Mansoor_DXB', balance: 1890000000, bestPlate: '1 DUBAI' },
  { rank: 4, name: 'St_Petersburg_Boss', balance: 840000000, bestPlate: 'О 001 ОО 78' },
  { rank: 5, name: 'Krasnodar_King', balance: 350000000, bestPlate: 'В 777 ОР 23' },
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  playerBalance,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080a10] text-white animate-fade-in select-none">
      <header className="px-4 py-3.5 flex items-center gap-4 border-b border-slate-800 bg-[#080a10]/95 backdrop-blur-md sticky top-0 z-10">
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
          Рейтинг игроков
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-8">
        {/* Top 3 Podium Cards */}
        <div className="space-y-2">
          {LEADERBOARD_DATA.map((player) => (
            <div
              key={player.rank}
              className="p-3.5 rounded-2xl bg-[#121522] border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    player.rank === 1
                      ? 'bg-amber-500 text-black shadow-md'
                      : player.rank === 2
                      ? 'bg-slate-300 text-black'
                      : 'bg-amber-700 text-white'
                  }`}
                >
                  {player.rank}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{player.name}</div>
                  <div className="text-[11px] text-slate-400 font-plate mt-0.5">
                    Лучший знак: <span className="font-bold text-slate-200">{player.bestPlate}</span>
                  </div>
                </div>
              </div>

              <div className="font-mono-num font-black text-amber-400 text-sm">
                {player.balance.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          ))}
        </div>

        {/* Player's Rank Card */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/50 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
              ТЫ
            </div>
            <div>
              <div className="text-sm font-bold text-white">Твой баланс</div>
              <div className="text-[11px] text-purple-300">Место в рейтинге: ~6</div>
            </div>
          </div>
          <div className="font-mono-num font-black text-amber-400 text-sm">
            {playerBalance.toLocaleString('ru-RU')} ₽
          </div>
        </div>
      </div>
    </div>
  );
};
