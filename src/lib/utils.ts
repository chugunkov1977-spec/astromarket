import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInKopecks: number): string {
  const rubles = priceInKopecks / 100;
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rubles);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function pluralize(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  
  if (mod100 >= 11 && mod100 <= 14) return `${count} ${many}`;
  if (mod10 === 1) return `${count} ${one}`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} ${few}`;
  return `${count} ${many}`;
}

export function getDeliveryTimeText(minutes: number): string {
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  return `${hours} ч`;
}

export const categoryLabels: Record<string, string> = {
  TAROT: 'Таро',
  ASTROLOGY: 'Астрология',
  NUMEROLOGY: 'Нумерология',
  RUNES: 'Руны',
  MEDITATION: 'Медитация',
  COURSE: 'Курс',
};

export const themeLabels: Record<string, string> = {
  LOVE: 'Любовь',
  CAREER: 'Карьера',
  SELF_KNOWLEDGE: 'Самопознание',
  GENERAL: 'Общее',
  HEALTH: 'Здоровье',
  FINANCE: 'Финансы',
};

export function generateSlug(text: string): string {
  const translitMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  };
  
  return text
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
