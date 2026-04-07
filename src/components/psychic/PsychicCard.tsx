import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag } from 'lucide-react';

interface PsychicCardProps {
  psychic: {
    id: string;
    slug: string;
    name: string;
    avatarUrl?: string | null;
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

export default function PsychicCard({ psychic }: PsychicCardProps) {
  return (
    <Link
      href={`/psychic/${psychic.slug}`}
      className="group relative w-[260px] min-w-[260px] h-[380px] rounded-2xl overflow-hidden border border-mystic-700/20 hover:border-mystic-500/30 hover:scale-[1.02] hover:shadow-xl hover:shadow-mystic-500/15 transition-all duration-500"
    >
      {/* Full background image */}
      {psychic.avatarUrl ? (
        <Image
          src={psychic.avatarUrl}
          alt={psychic.name}
          fill
          sizes="260px"
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-mystic-800 to-cosmic-900 flex items-center justify-center text-6xl text-mystic-300/30">
          ✧
        </div>
      )}

      {/* Dark gradient overlay — covers bottom 70%, smooth fade */}
      <div className="absolute inset-x-0 bottom-0 h-[70%] z-[1] bg-gradient-to-t from-black/95 via-black/70 via-[40%] to-transparent" />

      {/* Top-left: specialization tags */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
        {psychic.specialization.slice(0, 2).map((spec) => (
          <span
            key={spec}
            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold backdrop-blur-md bg-black/40 border border-white/10 text-white/90"
          >
            {specLabels[spec] || spec}
          </span>
        ))}
      </div>

      {/* Top-right: rating */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg backdrop-blur-md bg-black/40 border border-white/10">
        <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
        <span className="text-xs font-bold text-gold-400">{psychic.rating.toFixed(1)}</span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="font-display text-lg font-bold text-white drop-shadow-lg">
          {psychic.name}
        </h3>
        <p className="text-xs text-white/60 italic mt-0.5">{psychic.style}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <ShoppingBag className="w-3 h-3 text-white/50" />
            <span className="text-xs text-white/50">{psychic.totalOrders.toLocaleString('ru-RU')} заказов</span>
          </div>
        </div>

        {/* CTA */}
        <p className="text-xs text-gold-400/80 group-hover:text-gold-300 mt-2 transition-colors">
          Смотреть услуги →
        </p>
      </div>
    </Link>
  );
}
