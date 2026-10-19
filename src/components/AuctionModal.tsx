import React, { useState } from 'react';
import { BadgeDollarSign, Check, Coins, Gavel, HelpCircle, UserCheck, X } from 'lucide-react';
import { RARITIES } from '../data/constants';
import { SFX, triggerHaptic } from '../services/sound';
import { Plate } from '../types';

interface AuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Plate[];
  onSellPlateAtAuction: (plateId: number, finalPrice: number) => void;
}

interface BuyerOffer {
  id: string;
  buyerName: string;
  avatar: string;
  role: string;
  plateId: number;
  initialOffer: number;
  currentOffer: number;
  status: 'pending' | 'haggled' | 'accepted' | 'declined';
}

export const AuctionModal: React.FC<AuctionModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onSellPlateAtAuction,
}) => {
  const [offers, setOffers] = useState<BuyerOffer[]>(() => {
    // Generate initial offers if inventory has plates
    const buyers = [
      { name: 'Михаил «Депутат»', avatar: '🎩', role: 'Госдума РФ', mult: 1.8 },
      { name: 'Шейх Мансур', avatar: '👳‍♂️', role: 'Коллекционер из Дубая', mult: 2.5 },
      { name: 'Артем «Drift King»', avatar: '🏎️', role: 'Уличные гонки', mult: 1.4 },
      { name: 'Виктор «Синдикат»', avatar: '🕶️', role: 'Теневой автодилер', mult: 2.0 },
    ];

    if (!inventory.length) return [];

    return buyers.slice(0, Math.min(buyers.length, inventory.length)).map((b, idx) => {
      const targetPlate = inventory[idx % inventory.length];
      const offerPrice = Math.round(targetPlate.price * b.mult);
      return {
        id: `offer-${idx}`,
        buyerName: b.name,
        avatar: b.avatar,
        role: b.role,
        plateId: targetPlate.id,
        initialOffer: offerPrice,
        currentOffer: offerPrice,
        status: 'pending',
      };
    });
  });

  if (!isOpen) return null;

  const handleAccept = (offer: BuyerOffer) => {
    onSellPlateAtAuction(offer.plateId, offer.currentOffer);
    setOffers((prev) => prev.filter((o) => o.id !== offer.id));
    SFX.coin();
    triggerHaptic(30);
  };

  const handleHaggle = (offer: BuyerOffer) => {
    const success = Math.random() < 0.65;
    if (success) {
      const increased = Math.round(offer.currentOffer * 1.25);
      setOffers((prev) =>
        prev.map((o) => (o.id === offer.id ? { ...o, currentOffer: increased, status: 'haggled' } : o))
      );
      SFX.tierUp(2);
      triggerHaptic(20);
    } else {
      // Buyer walked away!
      setOffers((prev) => prev.filter((o) => o.id !== offer.id));
      SFX.error();
      triggerHaptic(40);
    }
  };

  const handleDecline = (offerId: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
    SFX.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl max-h-[88vh] bg-[#121522] border border-slate-700 rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#161a29]">
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">Аукцион & VIP-Покупатели</h3>
              <div className="text-[11px] text-slate-400">
                Олигархи и коллекционеры скупают редкие знаки по завышенным ценам
              </div>
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

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          {offers.length > 0 ? (
            offers.map((offer) => {
              const plate = inventory.find((p) => p.id === offer.plateId);
              if (!plate) return null;
              const rarity = RARITIES[plate.i] || RARITIES[0];

              return (
                <div
                  key={offer.id}
                  className="p-4 rounded-xl bg-[#181d2f] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{offer.avatar}</span>
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        {offer.buyerName}
                        <span className="text-[10px] text-slate-400 font-normal">({offer.role})</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                        Хочет номер:
                        <span className="font-plate font-bold px-1.5 py-0.2 rounded bg-white text-black text-xs">
                          {plate.l[0]}{plate.d.join('')}{plate.l[1]}{plate.l[2]} {plate.reg}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end w-full sm:w-auto">
                    <div className="text-[11px] text-slate-400">Предлагает за номер:</div>
                    <div className="font-mono-num font-black text-amber-400 text-base">
                      {offer.currentOffer.toLocaleString('ru-RU')} ₽
                    </div>

                    <div className="flex items-center gap-1.5 mt-2">
                      <button
                        onClick={() => handleAccept(offer)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition shadow-sm"
                      >
                        Принять
                      </button>

                      <button
                        disabled={offer.status === 'haggled'}
                        onClick={() => handleHaggle(offer)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                          offer.status === 'haggled'
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {offer.status === 'haggled' ? 'Торговались' : 'Торг (+25%)'}
                      </button>

                      <button
                        onClick={() => handleDecline(offer.id)}
                        className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 space-y-2">
              <div className="text-3xl">📭</div>
              <div className="text-sm font-bold text-white">Новых предложений пока нет</div>
              <div className="text-xs text-slate-400 max-w-sm mx-auto">
                Покрутите рулетку или откройте кейс, чтобы выбить редкие номера — тогда VIP-покупатели сразу сделают предложения!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
