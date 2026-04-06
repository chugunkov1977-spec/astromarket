'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PsychicData {
  slug: string;
  name: string;
  bio: string;
  shortBio: string;
  specialization: string[];
  style: string;
  rating: number;
  totalOrders: number;
}

interface PsychicCarouselProps {
  psychics: PsychicData[];
}

const specLabels: Record<string, string> = {
  tarot: 'Таро',
  astrology: 'Астрология',
  numerology: 'Нумерология',
  runes: 'Руны',
};

export default function PsychicCarousel({ psychics }: PsychicCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = window.innerWidth < 640 ? 320 : 384;
    const gap = window.innerWidth < 640 ? 16 : 20;
    const distance = cardWidth + gap;
    el.scrollBy({ left: direction === 'left' ? -distance : distance, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex flex-row gap-4 md:gap-5 overflow-x-auto pb-4 px-4 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {psychics.map((psychic, index) => (
          <motion.div
            key={psychic.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
            whileHover={{
              rotateX: 2,
              rotateY: 2,
              rotate: index % 2 === 0 ? 1.5 : -1.5,
              scale: 1.02,
              transition: { duration: 0.3 },
            }}
            style={{ perspective: 800 }}
            className="shrink-0"
          >
            <div
              className={cn(
                'w-[320px] md:w-[384px] h-[500px] md:h-[540px]',
                'flex flex-col items-center',
                'rounded-3xl overflow-hidden',
                'bg-gradient-to-b from-night-950/80 to-mystic-950/60 backdrop-blur-md',
                'border border-mystic-700/30',
                'p-6 md:p-8',
                'relative',
              )}
            >
              {/* Subtle top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-mystic-500/40 to-transparent" />

              {/* Avatar */}
              <div className="relative mt-2 mb-5">
                <div className="w-[90px] h-[90px] md:w-[130px] md:h-[130px] rounded-full p-[3px] bg-gradient-to-br from-mystic-500 to-gold-400">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-mystic-600/30 to-cosmic-600/30 flex items-center justify-center">
                    <span className="text-3xl md:text-5xl text-mystic-300/70">✧</span>
                  </div>
                </div>
              </div>

              {/* Name */}
              <h3 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1">
                {psychic.name}
              </h3>

              {/* Style */}
              <p className="text-sm text-mystic-400 italic text-center mb-4">
                {psychic.style}
              </p>

              {/* Specialization tags */}
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                {psychic.specialization.map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 rounded-full bg-mystic-500/15 border border-mystic-500/25 text-xs text-mystic-300"
                  >
                    {specLabels[spec] || spec}
                  </span>
                ))}
              </div>

              {/* Bio with quote icon */}
              <div className="flex-1 flex flex-col items-center min-h-0">
                <Quote className="w-5 h-5 text-mystic-500/40 mb-2 shrink-0" />
                <p className="text-sm text-mystic-300/80 text-center line-clamp-3 leading-relaxed">
                  {psychic.bio}
                </p>
              </div>

              {/* Bottom section */}
              <div className="w-full mt-auto pt-5 space-y-4">
                {/* Stats row */}
                <div className="flex items-center justify-between w-full px-2">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                    <span className="text-sm font-semibold text-gold-400">
                      {psychic.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-mystic-500">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="text-xs">
                      {psychic.totalOrders.toLocaleString('ru-RU')} заказов
                    </span>
                  </div>
                </div>

                {/* Link */}
                <Link
                  href={`/psychic/${psychic.slug}`}
                  className="block text-center text-sm text-gold-400 hover:text-gold-300 transition-colors font-medium"
                >
                  Смотреть услуги →
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation arrows */}
      <div className="flex items-center gap-2 justify-end mt-2 pr-4 md:pr-0">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
            canScrollLeft
              ? 'bg-mystic-800/60 hover:bg-mystic-700/60 text-mystic-300'
              : 'bg-mystic-800/25 text-mystic-700 cursor-not-allowed',
          )}
          aria-label="Прокрутить влево"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
            canScrollRight
              ? 'bg-mystic-800/60 hover:bg-mystic-700/60 text-mystic-300'
              : 'bg-mystic-800/25 text-mystic-700 cursor-not-allowed',
          )}
          aria-label="Прокрутить вправо"
        >
          <ArrowRight className="w-4.5 h-4.5" />
        </motion.button>
      </div>
    </div>
  );
}
