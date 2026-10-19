import React from 'react';
import { AlertTriangle, Landmark, ShieldCheck, X } from 'lucide-react';
import { LOAN_TIERS } from '../data/constants';
import { SFX, triggerHaptic } from '../services/sound';
import { LoanTier } from '../types';

interface BankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  loanActive: boolean;
  loanDebt: number;
  loanDueTime: number;
  onTakeLoan: (tier: LoanTier) => void;
  onRepayLoan: () => void;
}

export const BankingModal: React.FC<BankingModalProps> = ({
  isOpen,
  onClose,
  balance,
  loanActive,
  loanDebt,
  loanDueTime,
  onTakeLoan,
  onRepayLoan,
}) => {
  if (!isOpen) return null;

  const secondsLeft = Math.max(0, Math.floor((loanDueTime - Date.now()) / 1000));
  const canRepay = balance >= loanDebt;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#121522] border border-slate-700 rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#161a29]">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Банк & Кредитование</h3>
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
        <div className="p-4 sm:p-5 space-y-3 text-xs">
          {loanActive ? (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-3">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                АКТИВНЫЙ КРЕДИТ В СИНДИКАТЕ
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Сумма к возврату:</span>
                <span className="font-mono-num font-black text-rose-400 text-sm">
                  {loanDebt.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Осталось времени:</span>
                <span className="font-mono-num font-bold text-amber-400">
                  {Math.floor(secondsLeft / 60)} мин {String(secondsLeft % 60).padStart(2, '0')} сек
                </span>
              </div>

              <button
                disabled={!canRepay}
                onClick={onRepayLoan}
                className={`w-full py-2.5 rounded-xl font-black transition ${
                  canRepay
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {canRepay ? 'ПОГАСИТЬ ДОЛГ ПОЛНОСТЬЮ' : 'Недостаточно денег для погашения'}
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="text-slate-400 mb-1">
                Выберите кредитный пакет для быстрого старта или покупки редких автомобилей:
              </div>
              {LOAN_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className="p-3.5 rounded-xl bg-[#181d2f] border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{tier.n}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{tier.d}</div>
                  </div>
                  <button
                    onClick={() => onTakeLoan(tier)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition shadow-md"
                  >
                    Взять
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
