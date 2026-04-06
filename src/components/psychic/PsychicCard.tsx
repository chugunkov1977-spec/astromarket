import Link from 'next/link';
import { Star } from 'lucide-react';

interface PsychicCardProps {
  psychic: {
    id: string;
    slug: string;
    name: string;
    shortBio: string;
    style: string;
    specialization: string[];
    rating: number;
    totalOrders: number;
    isActive: boolean;
  };
  index?: number;
}

const specLabels: Record<string, string> = {
  tarot: 'Таро',
  astrology: 'Астрология',
  numerology: 'Нумерология',
  runes: 'Руны',
};

export default function PsychicCard({ psychic, index = 0 }: PsychicCardProps) {
  return (
    <Link
      href={`/psychic/${psychic.slug}`}
      className="group relative rounded-2xl overflow-hidden border border-mystic-800/20 bg-night-950/60 backdrop-blur-sm card-hover animate-card-appear text-center p-5"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Аватар */}
      <div className="w-20 h-20 mx-auto rounded-xl bg-gradient-to-br from-mystic-500/30 to-cosmic-600/30 border border-mystic-500/20 flex items-center justify-center text-3xl mb-3 group-hover:scale-105 transition-transform duration-300">
        ✧
      </div>

      {/* Имя */}
      <h3 className="font-display text-sm font-semibold text-white mb-1 group-hover:text-mystic-200 transition-colors">
        {psychic.name}
      </h3>

      {/* Стиль */}
      <p className="text-[10px] text-mystic-500 mb-2">{psychic.style}</p>

      {/* Рейтинг */}
      <div className="flex items-center justify-center gap-1 mb-2">
        <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
        <span className="text-xs font-semibold text-gold-400">{psychic.rating.toFixed(1)}</span>
        <span className="text-[10px] text-mystic-600 ml-1">{psychic.totalOrders} заказов</span>
      </div>

      {/* Специализации */}
      <div className="flex flex-wrap justify-center gap-1">
        {psychic.specialization.slice(0, 2).map((spec) => (
          <span
            key={spec}
            className="px-2 py-0.5 rounded text-[10px] font-medium bg-mystic-500/10 text-mystic-400 border border-mystic-500/15"
          >
            {specLabels[spec] || spec}
          </span>
        ))}
      </div>
    </Link>
  );
}
