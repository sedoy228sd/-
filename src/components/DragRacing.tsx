import React, { useEffect, useRef, useState } from 'react';
import { Flag, Gauge, Trophy, X, Zap } from 'lucide-react';
import { SFX, triggerHaptic } from '../services/sound';

interface DragRacingProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onWinReward: (amount: number) => void;
  onDeductBet: (amount: number) => boolean;
}

export const DragRacing: React.FC<DragRacingProps> = ({
  isOpen,
  onClose,
  balance,
  onWinReward,
  onDeductBet,
}) => {
  const [selectedBet, setSelectedBet] = useState(100000);
  const [gameState, setGameState] = useState<'idle' | 'staging' | 'racing' | 'finished'>('idle');
  const [treeStep, setTreeStep] = useState(0); // 0: off, 1: amber1, 2: amber2, 3: green
  const [playerProgress, setPlayerProgress] = useState(0);
  const [rivalProgress, setRivalProgress] = useState(0);
  const [raceResult, setRaceResult] = useState<'win' | 'lose' | null>(null);
  const [rpm, setRpm] = useState(1000);
  const [nitroAvailable, setNitroAvailable] = useState(true);
  const [nitroActive, setNitroActive] = useState(false);
  const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);

  const greenTimestampRef = useRef<number>(0);
  const raceIntervalRef = useRef<any>(null);

  if (!isOpen) return null;

  const startRace = () => {
    if (!onDeductBet(selectedBet)) return;

    setGameState('staging');
    setPlayerProgress(0);
    setRivalProgress(0);
    setRaceResult(null);
    setTreeStep(0);
    setRpm(3500);
    setNitroAvailable(true);
    setNitroActive(false);
    setReactionTimeMs(null);

    SFX.rev();
    triggerHaptic(20);

    // Staging sequence
    setTimeout(() => {
      setTreeStep(1);
      SFX.click();
    }, 600);

    setTimeout(() => {
      setTreeStep(2);
      SFX.click();
    }, 1200);

    setTimeout(() => {
      setTreeStep(3); // GREEN!
      greenTimestampRef.current = performance.now();
      SFX.horn();
      triggerHaptic(40);
      setGameState('racing');

      const reaction = Math.round(Math.random() * 120 + 130);
      setReactionTimeMs(reaction);

      // Race loop
      const startTime = performance.now();
      let pSpeed = 0.88 + Math.random() * 0.25;
      const rSpeed = 0.94;

      raceIntervalRef.current = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        setRpm(Math.min(8500, Math.round(3500 + elapsed * 1200)));

        setPlayerProgress((prev) => {
          const next = Math.min(100, prev + pSpeed * 2.2);
          return next;
        });

        setRivalProgress((prev) => {
          const next = Math.min(100, prev + rSpeed * 2.1);
          return next;
        });
      }, 40);
    }, 1800);
  };

  // Monitor race finish
  useEffect(() => {
    if (gameState === 'racing') {
      if (playerProgress >= 100 || rivalProgress >= 100) {
        clearInterval(raceIntervalRef.current);
        setGameState('finished');
        const isWin = playerProgress >= rivalProgress;
        setRaceResult(isWin ? 'win' : 'lose');

        if (isWin) {
          const prize = Math.round(selectedBet * 2.5);
          onWinReward(prize);
          SFX.tierUp(4);
          triggerHaptic(50);
        } else {
          SFX.error();
          triggerHaptic(30);
        }
      }
    }
  }, [playerProgress, rivalProgress, gameState, selectedBet, onWinReward]);

  const handleNitro = () => {
    if (!nitroAvailable || gameState !== 'racing') return;
    setNitroAvailable(false);
    setNitroActive(true);
    SFX.nitro();
    triggerHaptic(35);

    // Boost progress surge
    setPlayerProgress((prev) => Math.min(100, prev + 12));
    setRpm(8800);

    setTimeout(() => {
      setNitroActive(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#121522] border border-slate-700 rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#161a29]">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">Драг-Рейсинг (402 метра)</h3>
              <div className="text-[11px] text-slate-400">Светофор, закись азота NOS и множитель ×2.5</div>
            </div>
          </div>
          <button
            onClick={() => {
              if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
              SFX.click();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Christmas Tree & Tachometer Strip */}
          <div className="flex items-center justify-between p-3 bg-black/50 rounded-2xl border border-slate-800">
            {/* Christmas Tree */}
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  treeStep >= 1 ? 'bg-amber-400 border-amber-300 shadow-[0_0_15px_#f59e0b]' : 'bg-neutral-800 border-neutral-700'
                }`}
              />
              <div
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  treeStep >= 2 ? 'bg-amber-400 border-amber-300 shadow-[0_0_15px_#f59e0b]' : 'bg-neutral-800 border-neutral-700'
                }`}
              />
              <div
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  treeStep >= 3 ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_20px_#10b981]' : 'bg-neutral-800 border-neutral-700'
                }`}
              />
            </div>

            {/* Tachometer RPM Display */}
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-amber-400" />
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Обороты мотора</div>
                <div className="font-mono-num font-black text-amber-400 text-sm">{rpm} RPM</div>
              </div>
            </div>
          </div>

          {/* Track Lanes with Real Car Photos */}
          <div className="p-3 bg-[#0a0c14] border border-slate-800 rounded-2xl space-y-3 relative overflow-hidden">
            {/* Finish Line */}
            <div className="absolute right-6 top-0 bottom-0 w-3 bg-[repeating-linear-gradient(180deg,#fff,#fff_6px,#000_6px,#000_12px)] opacity-70 z-0 shadow-lg" />

            {/* Player Lane */}
            <div className="h-16 bg-slate-900/80 rounded-xl relative flex items-center px-2 border-b border-dashed border-slate-700/50 overflow-hidden">
              <div
                className="absolute flex items-center gap-2 transition-all duration-75"
                style={{ left: `${Math.min(82, playerProgress)}%` }}
              >
                <div className="relative w-16 h-10 rounded-lg overflow-hidden border-2 border-amber-400 shadow-md bg-black">
                  <img
                    src="https://images.unsplash.com/photo-1607603750909-40c592822940?auto=format&fit=crop&w=400&q=80"
                    alt="Ты"
                    className="w-full h-full object-cover"
                  />
                  {nitroActive && (
                    <div className="absolute inset-0 bg-cyan-400/30 mix-blend-screen animate-pulse" />
                  )}
                </div>
                {nitroActive && <span className="text-xl animate-bounce">🔥</span>}
                <div className="flex flex-col">
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500 text-black">ТЫ</span>
                  <span className="text-[8px] text-amber-300 font-mono">STAGE 2</span>
                </div>
              </div>
            </div>

            {/* Rival Lane */}
            <div className="h-16 bg-slate-900/80 rounded-xl relative flex items-center px-2 overflow-hidden">
              <div
                className="absolute flex items-center gap-2 transition-all duration-75"
                style={{ left: `${Math.min(82, rivalProgress)}%` }}
              >
                <div className="relative w-16 h-10 rounded-lg overflow-hidden border-2 border-purple-500 shadow-md bg-black">
                  <img
                    src="https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=400&q=80"
                    alt="Соперник"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-purple-600 text-white">СОПЕРНИК</span>
                  <span className="text-[8px] text-purple-300 font-mono">AMG V8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reaction time info */}
          {reactionTimeMs && (
            <div className="text-center text-xs font-bold text-slate-300">
              Время реакции со старта: <span className="text-emerald-400 font-mono-num">{reactionTimeMs} мс</span>
            </div>
          )}

          {/* Result Banner */}
          {gameState === 'finished' && (
            <div
              className={`p-3.5 rounded-xl text-center font-black text-sm border shadow-lg ${
                raceResult === 'win'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500 text-rose-300'
              }`}
            >
              {raceResult === 'win'
                ? `🏆 ПОБЕДА НА ФИНИШЕ! Выигрыш: +${(selectedBet * 2.5).toLocaleString('ru-RU')} ₽`
                : '❌ Уступили полкорпуса! Попробуйте с закисью азота'}
            </div>
          )}

          {/* Bet Selector */}
          <div>
            <div className="text-xs text-slate-400 font-semibold mb-2">Ставка на заезд:</div>
            <div className="grid grid-cols-4 gap-2">
              {[100000, 500000, 2500000, 10000000].map((bet) => (
                <button
                  key={bet}
                  disabled={gameState === 'staging' || gameState === 'racing'}
                  onClick={() => {
                    setSelectedBet(bet);
                    SFX.click();
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition ${
                    selectedBet === bet
                      ? 'bg-amber-500 border-amber-400 text-black shadow-md'
                      : 'bg-[#181d2f] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {(bet / 1000).toLocaleString()}k ₽
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons: NOS & Start */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              disabled={!nitroAvailable || gameState !== 'racing'}
              onClick={handleNitro}
              className={`py-3.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
                nitroAvailable && gameState === 'racing'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white shadow-lg animate-pulse'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4" />
              NOS АЗОТ
            </button>

            <button
              disabled={gameState === 'staging' || gameState === 'racing' || balance < selectedBet}
              onClick={startRace}
              className={`col-span-2 py-3.5 rounded-xl font-black text-sm transition shadow-xl flex items-center justify-center gap-2 ${
                balance >= selectedBet && gameState !== 'staging' && gameState !== 'racing'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {gameState === 'racing'
                ? 'ГОНКА ИДЕТ...'
                : gameState === 'staging'
                ? 'ПРОГРЕВ РЕЗИНЫ...'
                : 'СТАРТ ЗАЕЗДА (402 М)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
