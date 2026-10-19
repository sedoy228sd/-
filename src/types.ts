export type RarityKey = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'godlike';

export interface RarityTier {
  name: string;
  key: RarityKey;
  minPrice: number;
  bonusTokens: number;
  color: string;
  glow: string;
}

export interface Plate {
  id: number;
  l: [string, string, string];
  d: [number, number, number];
  reg: string;
  price: number;
  i: number; // rarity index
  P: string[]; // reasons/criteria
  type: string;
  country: string;
  timestamp?: number;
}

export interface Car {
  id: number;
  cat: 'retro' | 'city' | 'jdm' | 'prem' | 'super' | 'hyper';
  n: string;
  c: number;
  inc: number;
  pwr: number;
  icon?: string;
  photoUrl?: string;
  galleryUrls?: string[];
  specs?: {
    engine: string;
    topSpeed: string;
    zeroHundred: string;
    year: number;
    weight: string;
  };
  soundType?: 'vaz' | 'inline4' | '1jz' | '2jz' | 'v10' | 'v8amg' | 'v12' | 'w16';
}

export interface Frame {
  id: string;
  n: string;
  cls: string;
  cap: string;
  cost: number;
}

export interface PlateType {
  id: string;
  n: string;
  cls: string;
  mult: number;
  desc: string;
  badge: string;
}

export interface Pet {
  id: string;
  n: string;
  ic: string;
  d: string;
  cost?: number;
}

export interface LoanTier {
  id: number;
  n: string;
  get: number;
  debt: number;
  timeSec: number;
  d: string;
}

export interface GameStats {
  common: number;
  uncommon: number;
  rare: number;
  epic: number;
  legendary: number;
  mythic: number;
  godlike: number;
  sameDigits: number;
  sameLetters: number;
  mirrorDigits: number;
  palindrome: number;
  smallNum: number;
  orderDigits: number;
  blat: number;
  matchReg: number;
}

export interface GameState {
  rub: number;
  bon: number;
  rebTokens: number;
  rebirths: number;
  xp: number;
  lvl: number;
  energy: number;
  maxEnergy: number;
  inv: Plate[];
  rec: number;
  sp: number;
  sold: number;
  earn: number;
  n: number;
  country: string;
  region: string;
  plateType: string;
  frame: string;
  pet: string;
  ownedFrames: string[];
  ownedPets: string[];
  garageCars: number[];
  carPlates: Record<number, number>; // carId -> plateId
  carTuning: Record<number, string[]>; // carId -> upgradeIds
  stats: GameStats;
  theme: 'dark' | 'light' | 'cyber' | 'luxury' | 'retro80';
  sound: boolean;
  haptic: boolean;
  loanActive: boolean;
  loanDebt: number;
  loanDueTime: number;
  bankDeposit: number;
  last: Plate | null;
}
