'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Compass, Sparkles, ArrowRight, ChevronUp, ChevronDown, MousePointer } from 'lucide-react';

export interface GenderItem {
  id: 'Hombre' | 'Mujer' | 'Unisex';
  label: string;
  subtitle: string;
  count: string;
  badge: string;
  href: string;
}

const GENDERS: GenderItem[] = [
  {
    id: 'Hombre',
    label: 'HOMBRE',
    subtitle: 'Maderas nobles, cuero, especias y proyección seductora',
    count: '+650 fragancias',
    badge: 'Seducción & Poder',
    href: '/catalogo?genero=Hombre',
  },
  {
    id: 'Mujer',
    label: 'MUJER',
    subtitle: 'Vainilla gourmand, orquídeas blancas y estela viral',
    count: '+500 fragancias',
    badge: 'Dulzura & Glamour',
    href: '/catalogo?genero=Mujer',
  },
  {
    id: 'Unisex',
    label: 'UNISEX',
    subtitle: 'Extractos puros de ámbar, bergamota y maderas de nicho',
    count: '+180 extractos',
    badge: 'Alta Costura & Nicho',
    href: '/catalogo?genero=Unisex',
  },
];

interface OlfactiveWheelSliderProps {
  currentGender?: 'Hombre' | 'Mujer' | 'Unisex';
  onGenderChange?: (gender: 'Hombre' | 'Mujer' | 'Unisex') => void;
  className?: string;
}

export function OlfactiveWheelSlider({
  currentGender = 'Mujer',
  onGenderChange,
  className = '',
}: OlfactiveWheelSliderProps) {
  const initialIdx = Math.max(
    0,
    GENDERS.findIndex((g) => g.id.toLowerCase() === (currentGender || '').toLowerCase())
  );
  const [activeIndex, setActiveIndex] = useState<number>(initialIdx !== -1 ? initialIdx : 1);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef<number | null>(null);
  const lastWheelTime = useRef<number>(0);

  // Synchronize when external currentGender changes (e.g. from background auto-rotation)
  useEffect(() => {
    if (!isHovered && currentGender) {
      const idx = GENDERS.findIndex((g) => g.id.toLowerCase() === currentGender.toLowerCase());
      if (idx !== -1 && idx !== activeIndex) {
        setActiveIndex(idx);
      }
    }
  }, [currentGender, isHovered, activeIndex]);

  const selectIndex = useCallback(
    (newIdx: number) => {
      const normalizedIdx = ((newIdx % GENDERS.length) + GENDERS.length) % GENDERS.length;
      setActiveIndex(normalizedIdx);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 350);

      const target = GENDERS[normalizedIdx];
      if (target && onGenderChange) {
        onGenderChange(target.id);
      }
    },
    [onGenderChange]
  );

  const handleNext = useCallback(() => {
    selectIndex(activeIndex + 1);
  }, [activeIndex, selectIndex]);

  const handlePrev = useCallback(() => {
    selectIndex(activeIndex - 1);
  }, [activeIndex, selectIndex]);

  // Wheel scroll event handler with smooth debounce
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastWheelTime.current < 260) return;
      lastWheelTime.current = now;

      if (e.deltaY > 15 || e.deltaX > 15) {
        handleNext();
      } else if (e.deltaY < -15 || e.deltaX < -15) {
        handlePrev();
      }
    },
    [handleNext, handlePrev]
  );

  // Mobile Touch handling for vertical swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 20) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartY.current = null;
  };

  const activeItem = GENDERS[activeIndex];
  const prevIdx = (activeIndex - 1 + GENDERS.length) % GENDERS.length;
  const nextIdx = (activeIndex + 1) % GENDERS.length;
  const prevItem = GENDERS[prevIdx];
  const nextItem = GENDERS[nextIdx];

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative select-none flex flex-col items-center justify-center p-1 sm:p-3 text-center group ${className}`}
      style={{ touchAction: 'pan-x' }}
    >
      {/* 1. TOP MINIMAL BADGE: Compass & Section Indicator (No heavy boxes) */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-0.5 sm:py-1 rounded-full bg-black/40 backdrop-blur-md border border-gold-500/25 mb-1.5 sm:mb-3 shadow-lg shadow-black/40">
        <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-400 animate-[spin_12s_linear_infinite]" />
        <span className="text-[9.5px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-300">
          Navegación Olfativa
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-gold-400/80 animate-ping" />
      </div>

      {/* 2. CIRCULAR 3D CYLINDRICAL WHEEL TEXT AREA */}
      <div className="relative w-full max-w-xs sm:max-w-sm py-1 sm:py-3 flex flex-col items-center justify-center">
        
        {/* Subtle Decorative Golden Orbit Dial Ring (Transparent Background) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500">
          <svg className="w-44 h-44 sm:w-60 sm:h-60 animate-[spin_40s_linear_infinite]" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="#c5a880"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
            <circle
              cx="100"
              cy="100"
              r="76"
              fill="none"
              stroke="#c5a880"
              strokeWidth="0.5"
              strokeDasharray="1 5"
            />
            <circle cx="100" cy="12" r="2.5" fill="#fcebc2" />
            <circle cx="188" cy="100" r="2.5" fill="#fcebc2" />
            <circle cx="100" cy="188" r="2.5" fill="#fcebc2" />
            <circle cx="12" cy="100" r="2.5" fill="#fcebc2" />
          </svg>
        </div>

        {/* Vertical Up Arrow Control */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Género anterior"
          className="relative z-20 p-0.5 sm:p-1 rounded-full text-zinc-500 hover:text-gold-300 hover:bg-black/40 transition active:scale-90"
        >
          <ChevronUp className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>

        {/* PREVIOUS WORD (Top Arc - Faded & Translucent) */}
        <button
          type="button"
          onClick={handlePrev}
          className="relative z-10 py-0.5 text-xs sm:text-base font-serif font-light tracking-[0.22em] text-zinc-400/50 hover:text-gold-400/80 transition-all duration-300 transform -translate-y-0.5 scale-90 blur-[0.2px]"
        >
          {prevItem.label}
        </button>

        {/* ACTIVE MAIN WORD (Center Focus - Large Luxury Typography & Clean Text Shadow) */}
        <div className="relative z-20 my-0.5 sm:my-1.5 flex flex-col items-center">
          <Link
            href={activeItem.href}
            className="group/word block transition-transform duration-300 active:scale-95"
            title={`Explorar perfumes para ${activeItem.label}`}
          >
            <h2
              className={`font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#fff3db] via-gold-300 to-[#d4af37] transition-all duration-300 ${
                isAnimating ? 'scale-105 filter brightness-125' : 'scale-100'
              }`}
              style={{
                textShadow: '0 0 35px rgba(212, 175, 55, 0.45), 0 4px 15px rgba(0, 0, 0, 0.8)',
              }}
            >
              {activeItem.label}
            </h2>
          </Link>

          {/* Glowing Underline Accent */}
          <div className="w-14 sm:w-24 h-[1.5px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-0.5 sm:mt-1 shadow-[0_0_10px_#d4af37]" />
        </div>

        {/* NEXT WORD (Bottom Arc - Faded & Translucent) */}
        <button
          type="button"
          onClick={handleNext}
          className="relative z-10 py-0.5 text-xs sm:text-base font-serif font-light tracking-[0.22em] text-zinc-400/50 hover:text-gold-400/80 transition-all duration-300 transform translate-y-0.5 scale-90 blur-[0.2px]"
        >
          {nextItem.label}
        </button>

        {/* Vertical Down Arrow Control */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Siguiente género"
          className="relative z-20 p-0.5 sm:p-1 rounded-full text-zinc-500 hover:text-gold-300 hover:bg-black/40 transition active:scale-90"
        >
          <ChevronDown className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* 3. SLEEK FLOATING ACTION PILL (Direct Link to Catalog) */}
      <div className="relative z-20 mt-1 sm:mt-2 flex flex-col items-center gap-1.5 sm:gap-2">
        <Link
          href={activeItem.href}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-black/60 hover:bg-gold-500/20 text-gold-300 hover:text-gold-200 border border-gold-500/40 backdrop-blur-md text-[10.5px] sm:text-xs font-medium tracking-wider uppercase transition shadow-xl hover:shadow-gold-500/20 group/btn"
        >
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-400 group-hover/btn:rotate-12 transition" />
          <span>{activeItem.count} • Explorar</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>

        {/* Subtitle / Note */}
        <p className="text-[10px] sm:text-xs text-zinc-300 font-light max-w-[260px] sm:max-w-xs text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-1 sm:line-clamp-none">
          {activeItem.subtitle}
        </p>

        {/* Micro Interaction Helper Hint */}
        <div className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-zinc-400/70 font-mono tracking-wider pt-0.5">
          <MousePointer className="w-3 h-3 text-gold-400/70 animate-bounce" />
          <span>Gira la rueda o haz scroll sobre el texto</span>
        </div>
      </div>
    </div>
  );
}
