import { COUNTRIES, PLATE_TYPES, RARITIES, REGIONS, RUSSIAN_LETTERS } from '../data/constants';
import { Plate } from '../types';

export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generatePlate(
  countryId: string = 'ru',
  regionCode: string = '77',
  plateTypeId: string = 'civil',
  override?: { l?: [string, string, string]; d?: [number, number, number]; reg?: string },
  luckMult: number = 1.0,
  petId: string = 'none'
): Plate {
  const regCode = override?.reg || regionCode;
  let l: [string, string, string] = override?.l
    ? [...override.l]
    : [pickRandom(RUSSIAN_LETTERS), pickRandom(RUSSIAN_LETTERS), pickRandom(RUSSIAN_LETTERS)];

  let d: [number, number, number] = override?.d
    ? [...override.d]
    : [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];

  const petLuck = petId === 'dog' ? 1.3 : 1.0;
  const baseLuck = 0.04 * luckMult * petLuck;

  if (!override && Math.random() < baseLuck) {
    const roll = Math.floor(Math.random() * 6);
    const x = Math.floor(Math.random() * 9) + 1;
    if (roll === 0) {
      d = [x, x, x];
    } else if (roll === 1) {
      const y = pickRandom(RUSSIAN_LETTERS);
      l = [y, y, y];
    } else if (roll === 2) {
      d = [x, Math.floor(Math.random() * 10), x];
    } else if (roll === 3) {
      d = [0, 0, Math.floor(Math.random() * 9) + 1];
    } else {
      const blatSeries = pickRandom(['ЕКХ', 'АМР', 'ВОР', 'ХАМ', 'ССС', 'ООО']);
      l = [blatSeries[0], blatSeries[1], blatSeries[2]];
    }
  }

  if (d[0] === 0 && d[1] === 0 && d[2] === 0) {
    d[2] = 1;
  }

  const ds = d.join('');
  const ls = l.join('');
  const criteria: string[] = [];
  let mult = 1.0;

  const sameDigits = d[0] === d[1] && d[1] === d[2];
  const sameLetters = l[0] === l[1] && l[1] === l[2];
  const isPal = d[0] === d[2] && d[0] !== d[1];

  if (sameDigits) {
    mult *= 40;
    criteria.push('3 одинаковые цифры');
  } else if (d[0] === d[1] || d[1] === d[2] || d[0] === d[2]) {
    mult *= 1.8;
    criteria.push('2 одинаковые цифры');
  }

  if (sameLetters) {
    mult *= 35;
    criteria.push('3 одинаковые буквы');
  }

  if (sameDigits && sameLetters) {
    mult *= 25;
    criteria.push('Фуллблат: все цифры и буквы совпадают!');
  }

  if (ls === 'ЕКХ') {
    mult *= 70;
    criteria.push('Серия ЕКХ (Еду Как Хочу / ФСО)');
  } else if (ls === 'АМР') {
    mult *= 50;
    criteria.push('Серия АМР (Правительственная)');
  } else if (ls === 'ВОР') {
    mult *= 40;
    criteria.push('Серия ВОР (Блатная классика)');
  } else if (ls === 'ХАМ') {
    mult *= 30;
    criteria.push('Серия ХАМ');
  }

  if (ds === '777') {
    mult *= 80;
    criteria.push('Три топора 777 (Джекпот)');
  } else if (d[0] === 0 && d[1] === 0) {
    mult *= 25;
    criteria.push('Первая десятка (001-009)');
  }

  if (isPal) {
    mult *= 10;
    criteria.push('Зеркальные цифры (Палиндром)');
  }

  if (Math.abs(d[1] - d[0]) === 1 && d[2] - d[1] === d[1] - d[0]) {
    mult *= 20;
    criteria.push('Цифры по порядку');
  }

  if (regCode.length > 1 && ds.includes(regCode)) {
    mult *= 25;
    criteria.push(`Цифры совпадают с регионом (${regCode})`);
  }

  const pTypeObj = PLATE_TYPES.find((t) => t.id === plateTypeId) || PLATE_TYPES[0];
  mult *= pTypeObj.mult;
  if (pTypeObj.id !== 'civil') {
    criteria.push(`Спец-формат: ${pTypeObj.n}`);
  }

  const basePrice = 35 + Math.floor(Math.random() * 50);
  const regionList = REGIONS[countryId] || REGIONS.ru;
  const regObj = regionList.find((r) => r.id === regCode);
  const regM = regObj ? regObj.m : 1.0;

  const price = Math.round(basePrice * mult * regM);

  let rarityIndex = 0;
  RARITIES.forEach((r, idx) => {
    if (price >= r.minPrice) rarityIndex = idx;
  });

  return {
    id: Date.now() + Math.floor(Math.random() * 100000),
    l,
    d,
    reg: regCode,
    price,
    i: rarityIndex,
    P: criteria,
    type: plateTypeId,
    country: countryId,
    timestamp: Date.now(),
  };
}
