/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Menu } from 'lucide-react';
import { AchievementsModal } from './components/AchievementsModal';
import { AssetCacheManagerModal } from './components/AssetCacheManagerModal';
import { AuctionModal } from './components/AuctionModal';
import { BankingModal } from './components/BankingModal';
import { CaseOpeningModal } from './components/CaseOpeningModal';
import { KotlinExportModal } from './components/KotlinExportModal';
import { CustomizationModal } from './components/CustomizationModal';
import { DealershipModal } from './components/DealershipModal';
import { DragRacing } from './components/DragRacing';
import { GenerationSettings } from './components/GenerationSettings';
import { GostPlate } from './components/GostPlate';
import { GostPlate3D } from './components/GostPlate3D';
import { AnimatedBalanceCounter } from './components/AnimatedBalanceCounter';
import { EventProgressBar } from './components/EventProgressBar';
import { InventoryModal } from './components/InventoryModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { MainMenu } from './components/MainMenu';
import { PhoneSimulatorFrame } from './components/PhoneSimulatorFrame';
import { PolicePatrolModal } from './components/PolicePatrolModal';
import { RarityCatalogModal } from './components/RarityCatalogModal';
import { RitualsModal } from './components/RitualsModal';
import { SettingsModal } from './components/SettingsModal';
import { SoundboardModal } from './components/SoundboardModal';
import { StatsModal } from './components/StatsModal';
import { TuningModal } from './components/TuningModal';
import { WheelOfFortune } from './components/WheelOfFortune';
import { CARS, COUNTRIES, PLATE_TYPES, RARITIES, REGIONS } from './data/constants';
import { usePWAInstall } from './hooks/usePWAInstall';
import { MegaAudio } from './services/megaSoundLibrary';
import { generatePlate } from './services/plateGenerator';
import { SFX, triggerHaptic } from './services/sound';
import { TactileAudio, triggerTactileHaptic } from './services/tactileAudio';
import { GameState, Plate } from './types';

const STORAGE_KEY = 'plates_tycoon_aksi_v10';

const INITIAL_STATE: GameState = {
  rub: 50900,
  bon: 0,
  rebTokens: 0,
  rebirths: 0,
  xp: 0,
  lvl: 1,
  energy: 50,
  maxEnergy: 50,
  inv: [],
  rec: 0,
  sp: 0,
  sold: 0,
  earn: 0,
  n: 0,
  country: 'ru',
  region: '197',
  plateType: 'civil',
  frame: 'std',
  pet: 'none',
  ownedFrames: ['std'],
  ownedPets: ['none'],
  garageCars: [1],
  carPlates: {},
  carTuning: {},
  stats: {
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
    mythic: 0,
    godlike: 0,
    sameDigits: 0,
    sameLetters: 0,
    mirrorDigits: 0,
    palindrome: 0,
    smallNum: 0,
    orderDigits: 0,
    blat: 0,
    matchReg: 0,
  },
  theme: 'dark',
  sound: true,
  haptic: true,
  loanActive: false,
  loanDebt: 0,
  loanDueTime: 0,
  bankDeposit: 0,
  last: {
    id: 1,
    l: ['В', 'К', 'Х'],
    d: [1, 7, 5],
    reg: '197',
    price: 345,
    i: 0,
    P: ['Обычный номер'],
    type: 'civil',
    country: 'ru',
  },
};

export default function App() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_STATE, ...JSON.parse(saved) };
      }
    } catch {}
    return INITIAL_STATE;
  });

  const [currentPlate, setCurrentPlate] = useState<Plate>(() => state.last || INITIAL_STATE.last!);
  const [displayedPrice, setDisplayedPrice] = useState<number>(() => currentPlate.price);
  const [currentTierIndex, setCurrentTierIndex] = useState<number>(() => currentPlate.i);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [activeScreen, setActiveScreen] = useState<
    | 'main'
    | 'menu'
    | 'settings_gen'
    | 'collection'
    | 'safe'
    | 'garage'
    | 'autosell'
    | 'upgrades'
    | 'catalog'
    | 'stats'
    | 'theme'
    | 'achievements'
    | 'leaderboard'
    | 'settings'
    | 'csharp'
    | 'cache500mb'
    | 'racing'
    | 'wheel'
    | 'rituals'
    | 'soundboard'
    | 'police'
    | 'cases'
    | 'customization'
    | 'auction'
  >('main');

  const [isHdPackInstalled, setIsHdPackInstalled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('plates_hd_pack_500mb') === 'true';
    } catch {
      return false;
    }
  });

  const { isInstallable, install } = usePWAInstall();
  const evaluationAbortRef = useRef<boolean>(false);

  // Synchronize state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
    document.documentElement.dataset.theme = state.theme;
    SFX.enabled = state.sound;
  }, [state]);

  // Passive income ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => {
        let passiveIncome = 0;
        prev.garageCars.forEach((cId) => {
          const car = CARS.find((c) => c.id === cId);
          if (car) {
            let carInc = car.inc;
            const upgrades = prev.carTuning[car.id] || [];
            if (upgrades.includes('stage1')) carInc *= 1.25;
            if (upgrades.includes('stage2')) carInc *= 1.65;
            passiveIncome += Math.round(carInc);
          }
        });

        return {
          ...prev,
          rub: prev.rub + passiveIncome,
          earn: prev.earn + passiveIncome,
        };
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const spinCost = Math.max(345, Math.round(300 + state.rub * 0.0015));

  // Run Step-by-Step price reveal with MegaAudio
  const runEvaluation = async (plate: Plate) => {
    evaluationAbortRef.current = false;
    setCurrentPlate(plate);

    if (plate.i >= 2) {
      MegaAudio.hydraulicStamp();
      triggerHaptic(40);
    } else {
      SFX.slam();
    }

    if (plate.i >= 4) {
      MegaAudio.legendaryShimmer();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
      });
    }

    const steps = 14;
    const startPrice = Math.max(80, Math.round(plate.price / 3.5));
    setCurrentTierIndex(0);

    for (let s = 1; s <= steps; s++) {
      if (evaluationAbortRef.current) break;
      const current = Math.round(startPrice + (plate.price - startPrice) * (s / steps));
      setDisplayedPrice(current);
      if (s % 3 === 0) MegaAudio.reelTick();
      await new Promise((r) => setTimeout(r, 22));
    }

    setDisplayedPrice(plate.price);
    setCurrentTierIndex(plate.i);

    if (plate.i >= 5) {
      MegaAudio.jackpotBrass();
    } else if (plate.i >= 3) {
      MegaAudio.majorWinChord();
    } else {
      SFX.tierUp(plate.i + 1);
    }
  };

  // Main Spin Generation
  const handleSpin = () => {
    if (isSpinning) {
      return;
    }

    if (state.rub < spinCost) {
      SFX.error();
      triggerTactileHaptic('click');
      return;
    }

    TactileAudio.tactileClick();
    triggerTactileHaptic('click');

    setState((prev) => ({
      ...prev,
      rub: prev.rub - spinCost,
      sp: prev.sp + 1,
    }));

    const finalPlate = generatePlate(state.country, state.region, state.plateType);
    setCurrentPlate(finalPlate);
    setIsSpinning(true);
  };

  // Called when 3D plate finishes its slot-machine lock sequence
  const handleSpinEnd = (finalPlate: Plate) => {
    setIsSpinning(false);

    setState((prev) => {
      const stats = { ...prev.stats };
      const rKey = RARITIES[finalPlate.i].key;
      stats[rKey] = (stats[rKey] || 0) + 1;
      const newInv = [finalPlate, ...prev.inv];
      const newRec = Math.max(prev.rec, finalPlate.price);

      return {
        ...prev,
        stats,
        inv: newInv,
        rec: newRec,
        last: finalPlate,
      };
    });

    runEvaluation(finalPlate);
  };

  // Keyboard Spacebar to spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && activeScreen === 'main' && e.target === document.body) {
        e.preventDefault();
        handleSpin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeScreen, isSpinning, state.rub]);

  const currentRarity = RARITIES[currentTierIndex] || RARITIES[0];
  const currentCountryObj = COUNTRIES.find((c) => c.id === state.country) || COUNTRIES[0];
  const activeCar = CARS.find((c) => c.id === state.garageCars[0]) || CARS[0];

  useEffect(() => {
    const unlockAudio = () => {
      MegaAudio.getContext();
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    return () => window.removeEventListener('pointerdown', unlockAudio);
  }, []);

  return (
    <PhoneSimulatorFrame isPhoneFrame={isPhoneFrame}>
      {/* ================= EXACT MAIN SCREEN WITH 3D MOTION & GAME FEEL ================= */}
      {activeScreen === 'main' && (
        <div className="flex-1 flex flex-col justify-between p-3 sm:p-5 bg-[radial-gradient(ellipse_at_50%_25%,#161b34_0%,#0c0e1a_50%,#06070c_100%)] text-white relative select-none overflow-hidden">
          {/* Subtle Ambient Spotlight behind plate */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full pointer-events-none blur-3xl opacity-35 transition-colors duration-700"
            style={{ backgroundColor: currentRarity.color }}
          />

          {/* Top Bar: [ ☰ ] on left, [ 512 MB HD ] [ 🔊 105+ FX ], [ Animated Balance ] on right */}
          <header className="flex items-center justify-between z-10 gap-1.5 sm:gap-2">
            {/* Hamburger Burger Menu Button */}
            <button
              onClick={() => {
                TactileAudio.tactileClick();
                setActiveScreen('menu');
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#141622]/95 border border-slate-800/80 hover:border-slate-700 flex flex-col items-center justify-center gap-1.5 text-slate-300 shadow-md active:scale-95 transition flex-shrink-0"
              aria-label="Меню"
            >
              <span className="w-5 h-0.5 bg-slate-300 rounded-full" />
              <span className="w-5 h-0.5 bg-slate-300 rounded-full" />
              <span className="w-5 h-0.5 bg-slate-300 rounded-full" />
            </button>

            {/* 105+ Soundboard Lab Button */}
            <button
              onClick={() => {
                TactileAudio.tactileClick();
                setActiveScreen('soundboard');
              }}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-[#141622]/95 border border-amber-500/40 hover:border-amber-400 text-xs font-bold shadow-md flex items-center gap-1.5 active:scale-95 transition text-amber-400"
              title="Саундборд 105+ звуков"
            >
              <span className="text-sm">🔊</span>
              <span className="font-mono text-[10px] sm:text-[11px] font-black">105+ FX</span>
            </button>

            {/* 500 MB HD Cache Pack Indicator Badge */}
            <button
              onClick={() => {
                TactileAudio.tactileClick();
                setActiveScreen('cache500mb');
              }}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-[#141622]/95 border border-purple-500/40 hover:border-purple-400 text-xs font-bold shadow-md flex items-center gap-1.5 sm:gap-2 active:scale-95 transition"
            >
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <div className="flex flex-col text-left">
                <span className="font-mono text-purple-300 text-[10px] sm:text-[11px] font-black leading-tight">512 МБ</span>
                <span className="text-[8px] sm:text-[9px] text-slate-400 leading-tight">Ultra 4K</span>
              </div>
            </button>

            {/* Dynamic Animated Balance Counter */}
            <div className="flex items-center gap-1 sm:gap-2 font-mono text-xs font-bold">
              <div className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl bg-[#141622]/95 border border-slate-800/80 shadow-md flex items-center">
                <AnimatedBalanceCounter value={state.rub} />
              </div>
              <div className="hidden xs:flex px-2.5 py-1.5 sm:py-2 rounded-2xl bg-[#141622]/95 border border-slate-800/80 text-slate-400 shadow-md">
                0 $
              </div>
            </div>
          </header>

          {/* Center Stage: Event Bar + Rarity Capsule + 3D Plate Generator */}
          <div className="flex-1 flex flex-col items-center justify-center my-auto w-full z-10 py-2">
            {/* Event Progress Bar ("Неделя автомобилиста" with shimmer & spark) */}
            <div className="w-full max-w-[440px] mb-2">
              <EventProgressBar currentSpins={state.sp} />
            </div>

            {/* Rarity & Price Floating Card */}
            <div className="w-full max-w-[440px] mb-2 px-4 py-2.5 rounded-2xl bg-[#141622]/95 border border-slate-800/80 shadow-xl flex items-center justify-between">
              <div>
                <div
                  className="text-xs font-black tracking-wide uppercase transition-colors"
                  style={{ color: currentRarity.color }}
                >
                  {currentRarity.name}
                </div>
                {/* 5-Dash Indicator lights */}
                <div className="flex items-center gap-1 mt-1">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <span
                      key={idx}
                      className="w-4 h-0.5 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          idx <= currentTierIndex ? currentRarity.color : 'rgba(255,255,255,0.15)',
                        boxShadow:
                          idx <= currentTierIndex ? `0 0 6px ${currentRarity.color}` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="text-xl font-bold font-mono text-slate-100">
                {displayedPrice.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            {/* Hyper-Realistic Russian License Plate with 3D Arc Fling & Slot Machine Roulette */}
            <div className="w-full py-1">
              <GostPlate3D
                plate={currentPlate}
                frameId={state.frame}
                isSpinning={isSpinning}
                onSpinEnd={handleSpinEnd}
                onClick={handleSpin}
              />
            </div>

            {/* Tactile 3D "СГЕНЕРИРОВАТЬ" Button */}
            <div className="flex flex-col items-center gap-1.5 mt-3">
              <button
                onClick={handleSpin}
                onPointerDown={() => {
                  if (state.rub >= spinCost && !isSpinning) {
                    TactileAudio.tactileClick();
                  }
                }}
                onPointerUp={() => {
                  if (!isSpinning) {
                    TactileAudio.tactileRelease();
                  }
                }}
                disabled={isSpinning || state.rub < spinCost}
                className={`relative group px-10 py-3 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition-all duration-150 flex items-center justify-center gap-2 overflow-hidden select-none ${
                  isSpinning
                    ? 'bg-amber-600/90 text-black cursor-wait scale-[0.98]'
                    : state.rub >= spinCost
                    ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-yellow-600 hover:brightness-110 active:translate-y-1 active:scale-[0.96] text-black shadow-[0_12px_28px_rgba(245,158,11,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-3px_4px_rgba(0,0,0,0.3)]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                {/* Tactile button inner gloss shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-150%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />

                <span>{isSpinning ? 'КРУТИМ РУЛЕТКУ...' : 'СГЕНЕРИРОВАТЬ'}</span>
                <span className="font-mono text-xs opacity-90 font-bold">
                  ({spinCost.toLocaleString('ru-RU')} ₽)
                </span>
              </button>

              <span className="text-[10px] text-slate-400 font-medium">
                Кликните по номеру или нажмите Пробел
              </span>
            </div>
          </div>

          {/* Bottom Area: Country Capsule + Expanded Quick Action Dock Bar */}
          <div className="flex flex-col items-center gap-2.5 z-10 pb-1">
            {/* Country & Type Selector Pill */}
            <button
              onClick={() => {
                SFX.click();
                setActiveScreen('settings_gen');
              }}
              className="px-5 py-1.5 rounded-full bg-[#141622]/95 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold shadow-md flex items-center gap-2 active:scale-95 transition"
            >
              <span>{currentCountryObj.flag}</span>
              <span>{currentCountryObj.n}</span>
              <span className="text-slate-500 font-normal">
                {state.plateType === 'civil'
                  ? '1 тип'
                  : state.plateType === 'taxi'
                  ? 'Такси'
                  : state.plateType === 'police'
                  ? 'МВД'
                  : 'Военный'}
              </span>
            </button>

            {/* Glassmorphism Quick Action Dock Bar with Spring Bounce */}
            <nav className="w-full max-w-[500px] px-2 py-2 rounded-2xl bg-[#090d1c]/80 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.12)] flex items-center justify-around text-[9px] font-bold text-slate-400 backdrop-blur-2xl relative select-none">
              <button
                onClick={() => {
                  TactileAudio.tactileClick();
                  triggerTactileHaptic('light');
                  setActiveScreen('main');
                }}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 active:scale-85 text-amber-400 bg-amber-500/15 font-black shadow-[0_0_14px_rgba(245,158,11,0.3)]"
              >
                <span className="text-base leading-none transition-transform duration-200 group-hover:scale-110">🎰</span>
                <span>Номер</span>
              </button>

              <button
                onClick={() => {
                  TactileAudio.tactileClick();
                  triggerTactileHaptic('light');
                  setActiveScreen('garage');
                }}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 active:scale-85 relative hover:text-white"
              >
                <span className="text-base leading-none">🚘</span>
                <span>Авто 4K</span>
                <span className="absolute -top-1 -right-0.5 text-[6px] px-1 rounded-full bg-cyan-400 text-black font-black">4K</span>
              </button>

              <button
                onClick={() => {
                  TactileAudio.tactileClick();
                  triggerTactileHaptic('light');
                  setActiveScreen('soundboard');
                }}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 active:scale-85 hover:text-amber-300 text-amber-400/90"
              >
                <span className="text-base leading-none">🔊</span>
                <span>105+ FX</span>
              </button>

              <button
                onClick={() => {
                  TactileAudio.tactileClick();
                  triggerTactileHaptic('light');
                  setActiveScreen('cases');
                }}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 active:scale-85 hover:text-white"
              >
                <span className="text-base leading-none">📦</span>
                <span>Кейсы</span>
              </button>

              <button
                onClick={() => {
                  TactileAudio.tactileClick();
                  triggerTactileHaptic('light');
                  setActiveScreen('police');
                }}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 active:scale-85 hover:text-blue-300 text-blue-400/90"
              >
                <span className="text-base leading-none">🚨</span>
                <span>ДПС</span>
              </button>

              <button
                onClick={() => {
                  TactileAudio.tactileClick();
                  triggerTactileHaptic('light');
                  setActiveScreen('racing');
                }}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 active:scale-85 hover:text-white"
              >
                <span className="text-base leading-none">🏁</span>
                <span>Гонки</span>
              </button>

              <button
                onClick={() => {
                  TactileAudio.tactileClick();
                  triggerTactileHaptic('light');
                  setActiveScreen('wheel');
                }}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 active:scale-85 hover:text-white"
              >
                <span className="text-base leading-none">🎡</span>
                <span>Фортуна</span>
              </button>

              <button
                onClick={() => {
                  TactileAudio.tactileClick();
                  triggerTactileHaptic('light');
                  setActiveScreen('csharp');
                }}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 active:scale-85 text-purple-300 hover:text-white"
              >
                <span className="text-base leading-none">📱</span>
                <span className="font-extrabold">Kotlin APK</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* ================= EXACT "МЕНЮ" SCREEN (SCREENSHOT 1 & 3) ================= */}
      <MainMenu
        isOpen={activeScreen === 'menu'}
        onClose={() => setActiveScreen('main')}
        onNavigate={(screen) => {
          if (screen === 'generator') setActiveScreen('main');
          else setActiveScreen(screen);
        }}
      />

      {/* ================= EXACT "НАСТРОЙКА ГЕНЕРАЦИИ" (SCREENSHOT 2) ================= */}
      <GenerationSettings
        isOpen={activeScreen === 'settings_gen'}
        onClose={() => setActiveScreen('main')}
        currentType={state.plateType}
        onSelectType={(typeId) => setState((prev) => ({ ...prev, plateType: typeId }))}
        currentCountry={state.country}
        onSelectCountry={(countryId) => setState((prev) => ({ ...prev, country: countryId }))}
        currentRegion={state.region}
        onSelectRegion={(regId) => setState((prev) => ({ ...prev, region: regId }))}
        spinCost={spinCost}
      />

      {/* Feature Modals routed seamlessly from Menu Tiles */}
      <InventoryModal
        isOpen={activeScreen === 'collection'}
        onClose={() => setActiveScreen('menu')}
        inventory={state.inv}
        maxCapacity={25}
        onSellPlates={(ids) => {
          const items = state.inv.filter((p) => ids.includes(p.id));
          const sum = items.reduce((a, b) => a + b.price, 0);
          setState((prev) => ({
            ...prev,
            rub: prev.rub + sum,
            earn: prev.earn + sum,
            sold: prev.sold + ids.length,
            inv: prev.inv.filter((p) => !ids.includes(p.id)),
          }));
          SFX.coin();
        }}
      />

      <BankingModal
        isOpen={activeScreen === 'safe'}
        onClose={() => setActiveScreen('menu')}
        balance={state.rub}
        loanActive={state.loanActive}
        loanDebt={state.loanDebt}
        loanDueTime={state.loanDueTime}
        onTakeLoan={(tier) => {
          setState((prev) => ({
            ...prev,
            rub: prev.rub + tier.get,
            loanActive: true,
            loanDebt: tier.debt,
            loanDueTime: Date.now() + tier.timeSec * 1000,
          }));
          SFX.coin();
        }}
        onRepayLoan={() => {
          setState((prev) => ({
            ...prev,
            rub: prev.rub - prev.loanDebt,
            loanActive: false,
            loanDebt: 0,
          }));
          SFX.coin();
        }}
      />

      <DealershipModal
        isOpen={activeScreen === 'garage'}
        onClose={() => setActiveScreen('menu')}
        balance={state.rub}
        ownedCarIds={state.garageCars}
        inventory={state.inv}
        carPlates={state.carPlates}
        onBuyCar={(car) => {
          setState((prev) => ({
            ...prev,
            rub: prev.rub - car.c,
            garageCars: [...prev.garageCars, car.id],
          }));
        }}
        onAssignPlate={(carId, plateId) => {
          setState((prev) => ({
            ...prev,
            carPlates: { ...prev.carPlates, [carId]: plateId },
          }));
        }}
        onOpenTuning={() => setActiveScreen('upgrades')}
      />

      <AuctionModal
        isOpen={activeScreen === 'autosell'}
        onClose={() => setActiveScreen('menu')}
        inventory={state.inv}
        onSellPlateAtAuction={(plateId, price) => {
          setState((prev) => ({
            ...prev,
            rub: prev.rub + price,
            earn: prev.earn + price,
            sold: prev.sold + 1,
            inv: prev.inv.filter((p) => p.id !== plateId),
          }));
        }}
      />

      <TuningModal
        isOpen={activeScreen === 'upgrades'}
        onClose={() => setActiveScreen('menu')}
        balance={state.rub}
        garageCarIds={state.garageCars}
        carTuning={state.carTuning}
        onApplyUpgrade={(carId, upgId, cost) => {
          setState((prev) => {
            const currentUpgs = prev.carTuning[carId] || [];
            if (currentUpgs.includes(upgId)) return prev;
            return {
              ...prev,
              rub: prev.rub - cost,
              carTuning: {
                ...prev.carTuning,
                [carId]: [...currentUpgs, upgId],
              },
            };
          });
        }}
      />

      <RarityCatalogModal
        isOpen={activeScreen === 'catalog'}
        onClose={() => setActiveScreen('menu')}
      />

      <StatsModal
        isOpen={activeScreen === 'stats'}
        onClose={() => setActiveScreen('menu')}
        stats={state.stats}
        level={state.lvl}
        xp={state.xp}
        nextLevelXp={500}
        totalSpins={state.sp}
        recordPrice={state.rec}
      />

      <AchievementsModal
        isOpen={activeScreen === 'achievements'}
        onClose={() => setActiveScreen('menu')}
        state={state}
        onClaimReward={(rew) => {
          setState((prev) => ({ ...prev, rub: prev.rub + rew }));
        }}
      />

      <LeaderboardModal
        isOpen={activeScreen === 'leaderboard'}
        onClose={() => setActiveScreen('menu')}
        playerBalance={state.rub}
      />

      <SettingsModal
        isOpen={activeScreen === 'settings' || activeScreen === 'theme'}
        onClose={() => setActiveScreen('menu')}
        theme={state.theme}
        sound={state.sound}
        haptic={state.haptic}
        onThemeChange={(theme) => setState((prev) => ({ ...prev, theme }))}
        onToggleSound={() => setState((prev) => ({ ...prev, sound: !prev.sound }))}
        onToggleHaptic={() => setState((prev) => ({ ...prev, haptic: !prev.haptic }))}
        onResetGame={() => {
          localStorage.removeItem(STORAGE_KEY);
          setState(INITIAL_STATE);
          setCurrentPlate(INITIAL_STATE.last!);
          setActiveScreen('main');
        }}
      />

      {/* Kotlin Android (Jetpack Compose) & APK Exporter Modal */}
      <KotlinExportModal
        isOpen={activeScreen === 'csharp'}
        onClose={() => setActiveScreen('menu')}
        isInstallable={isInstallable}
        onInstallPwa={install}
      />

      {/* 500 MB HD Game Cache Pack Manager */}
      <AssetCacheManagerModal
        isOpen={activeScreen === 'cache500mb'}
        onClose={() => setActiveScreen('main')}
        isHdPackInstalled={isHdPackInstalled}
        onInstallHdPack={() => {
          setIsHdPackInstalled(true);
          try {
            localStorage.setItem('plates_hd_pack_500mb', 'true');
          } catch {}
        }}
      />

      {/* 402m Drag Racing with Real Cars & Opponents */}
      <DragRacing
        isOpen={activeScreen === 'racing'}
        onClose={() => setActiveScreen('main')}
        balance={state.rub}
        onWinReward={(amount) => {
          setState((prev) => ({
            ...prev,
            rub: prev.rub + amount,
            earn: prev.earn + amount,
          }));
          SFX.coin();
        }}
        onDeductBet={(amount) => {
          if (state.rub < amount) {
            SFX.error();
            return false;
          }
          setState((prev) => ({
            ...prev,
            rub: prev.rub - amount,
          }));
          return true;
        }}
      />

      {/* Wheel of Fortune with Real Physics */}
      <WheelOfFortune
        isOpen={activeScreen === 'wheel'}
        onClose={() => setActiveScreen('main')}
        onReward={(type, amount) => {
          if (type === 'rub') {
            setState((prev) => ({ ...prev, rub: prev.rub + amount, earn: prev.earn + amount }));
            SFX.coin();
          } else if (type === 'bon') {
            setState((prev) => ({ ...prev, bon: prev.bon + amount }));
            SFX.tierUp(3);
          } else if (type === 'reb') {
            setState((prev) => ({ ...prev, rebTokens: prev.rebTokens + amount }));
            SFX.tierUp(4);
          } else if (type === 'energy') {
            setState((prev) => ({ ...prev, energy: prev.maxEnergy }));
            SFX.tierUp(2);
          }
        }}
      />

      {/* Plate Rituals & Numerology */}
      <RitualsModal
        isOpen={activeScreen === 'rituals'}
        onClose={() => setActiveScreen('main')}
        currentRegion={state.region}
        onPlateGenerated={(plate) => {
          setCurrentPlate(plate);
          setState((prev) => ({
            ...prev,
            inv: [plate, ...prev.inv],
            rec: Math.max(prev.rec, plate.price),
            last: plate,
          }));
          runEvaluation(plate);
          setActiveScreen('main');
        }}
      />

      {/* 105+ Sound Effects & Synthesizer Lab */}
      <SoundboardModal
        isOpen={activeScreen === 'soundboard'}
        onClose={() => setActiveScreen('main')}
      />

      {/* Police DPS Patrol & Raid */}
      <PolicePatrolModal
        isOpen={activeScreen === 'police'}
        onClose={() => setActiveScreen('menu')}
        plate={currentPlate}
        carName={activeCar.n}
        balance={state.rub}
        onPayFine={(amount) => {
          setState((prev) => ({
            ...prev,
            rub: Math.max(0, prev.rub - amount),
          }));
        }}
        onRewardBonus={(amount) => {
          setState((prev) => ({
            ...prev,
            rub: prev.rub + amount,
            earn: prev.earn + amount,
          }));
        }}
      />

      {/* Mystery Loot Cases */}
      <CaseOpeningModal
        isOpen={activeScreen === 'cases'}
        onClose={() => setActiveScreen('menu')}
        balance={state.rub}
        onDeductFunds={(amount) => {
          if (state.rub < amount) {
            SFX.error();
            return false;
          }
          setState((prev) => ({ ...prev, rub: prev.rub - amount }));
          return true;
        }}
        onAddPlateToInventory={(plate) => {
          setState((prev) => ({
            ...prev,
            inv: [plate, ...prev.inv],
            rec: Math.max(prev.rec, plate.price),
            last: plate,
          }));
          setCurrentPlate(plate);
          runEvaluation(plate);
        }}
      />

      {/* License Plate Frames & Lucky Mascot Pets */}
      <CustomizationModal
        isOpen={activeScreen === 'customization'}
        onClose={() => setActiveScreen('menu')}
        balance={state.rub}
        currentType={state.plateType}
        currentFrame={state.frame}
        currentPet={state.pet}
        ownedFrames={state.ownedFrames}
        ownedPets={state.ownedPets}
        onSelectType={(typeId) => setState((prev) => ({ ...prev, plateType: typeId }))}
        onSelectFrame={(frameId) => setState((prev) => ({ ...prev, frame: frameId }))}
        onBuyFrame={(frame) => {
          setState((prev) => ({
            ...prev,
            rub: prev.rub - frame.cost,
            ownedFrames: [...prev.ownedFrames, frame.id],
            frame: frame.id,
          }));
        }}
        onSelectPet={(petId) => setState((prev) => ({ ...prev, pet: petId }))}
        onBuyPet={(pet) => {
          setState((prev) => ({
            ...prev,
            rub: prev.rub - (pet.cost || 0),
            ownedPets: [...prev.ownedPets, pet.id],
            pet: pet.id,
          }));
        }}
      />
    </PhoneSimulatorFrame>
  );
}
