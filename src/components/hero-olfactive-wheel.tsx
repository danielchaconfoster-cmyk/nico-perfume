'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';
import { OptionWheel } from '@/components/react-bits/option-wheel';

export type SelectorMode = 'genero' | 'marcas' | 'ocasion';

interface ModeOption {
  id: SelectorMode;
  label: string;
  items: string[];
  getHref: (item: string) => string;
  getSubtitle: (item: string) => string;
}

const MODES: ModeOption[] = [
  {
    id: 'genero',
    label: 'GÉNERO',
    items: ['HOMBRE', 'MUJER', 'UNISEX', 'DECANTS', 'CLONES DUPES'],
    getHref: (item: string) => {
      if (item === 'DECANTS') return '/decants';
      if (item === 'CLONES DUPES') return '/fragancias-gemelas';
      return `/catalogo?genero=${encodeURIComponent(item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())}`;
    },
    getSubtitle: (item: string) => {
      switch (item) {
        case 'HOMBRE':
          return '+650 fragancias masculinas con batch code verificado';
        case 'MUJER':
          return '+500 fragancias dulces, florales y virales';
        case 'UNISEX':
          return '+180 extractos nicho para compartir';
        case 'DECANTS':
          return 'Muestras de 3ml, 5ml y 10ml para probar antes de comprar';
        case 'CLONES DUPES':
          return 'Inspiraciones árabes idénticas a perfumes de $300.000';
        default:
          return 'Colección sellada 100% original';
      }
    },
  },
  {
    id: 'marcas',
    label: 'MARCAS TOP',
    items: [
      'LATTAFA',
      'AFNAN',
      'AL HARAMAIN',
      'BHARARA',
      'TOM FORD',
      'CHANEL',
      'DIOR',
      'JEAN PAUL GAULTIER',
      'CREED',
      'GIORGIO ARMANI',
      'VERSACE',
      'CAROLINA HERRERA',
    ],
    getHref: (item: string) => `/catalogo?marca=${encodeURIComponent(item)}`,
    getSubtitle: (item: string) => `Colección oficial de ${item} con entrega rápida a todo Chile`,
  },
  {
    id: 'ocasion',
    label: 'OCASIÓN',
    items: ['CITA & SEDUCCIÓN', 'OFICINA & DIARIO', 'FIESTA & CLUB', 'VERANO FRESCO', 'INVIERNO CÁLIDO'],
    getHref: (item: string) => `/catalogo?ocasion=${encodeURIComponent(item)}`,
    getSubtitle: (item: string) => `Selección recomendada por Sommelier para ${item}`,
  },
];

interface HeroOlfactiveWheelProps {
  currentGender?: 'Hombre' | 'Mujer' | 'Unisex';
  onGenderChange?: (gender: 'Hombre' | 'Mujer' | 'Unisex') => void;
  className?: string;
}

export function HeroOlfactiveWheel({
  currentGender = 'Mujer',
  onGenderChange,
  className = '',
}: HeroOlfactiveWheelProps) {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<SelectorMode>('genero');

  const currentModeConfig = MODES.find((m) => m.id === activeMode) || MODES[0];

  // Map initial gender to index
  const genderIdx = currentModeConfig.items.findIndex(
    (i) => i.toLowerCase() === currentGender.toLowerCase()
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(
    genderIdx !== -1 ? genderIdx : 1
  );

  const selectedItemText = currentModeConfig.items[selectedIndex] || currentModeConfig.items[0];

  const handleItemChange = useCallback(
    (index: number, item: string) => {
      setSelectedIndex(index);
      if (activeMode === 'genero') {
        if (item === 'HOMBRE' || item === 'MUJER' || item === 'UNISEX') {
          const cap = (item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()) as
            | 'Hombre'
            | 'Mujer'
            | 'Unisex';
          onGenderChange?.(cap);
        }
      }
    },
    [activeMode, onGenderChange]
  );

  // DIRECT CLICK NAVIGATION: Clicking any item opens the catalog filtered directly!
  const handleItemSelect = useCallback(
    (_index: number, item: string) => {
      const href = currentModeConfig.getHref(item);
      router.push(href);
    },
    [currentModeConfig, router]
  );

  const activeHref = currentModeConfig.getHref(selectedItemText);
  const activeSubtitle = currentModeConfig.getSubtitle(selectedItemText);

  return (
    <div className={`relative flex flex-col items-center lg:items-end text-center lg:text-right w-full ${className}`}>
      
      {/* 1. MINIMAL MODE TOGGLE (Género | Marcas Top | Ocasión) */}
      <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-full bg-black/60 backdrop-blur-lg border border-gold-500/30 mb-2 sm:mb-2.5 shadow-xl">
        {MODES.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => {
                setActiveMode(mode.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[9.5px] sm:text-[10.5px] font-semibold tracking-wider uppercase transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black shadow-md shadow-gold-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {mode.label}
            </button>
          );
        })}
      </div>

      {/* QUICK TAP CHIPS (100% Clickable, horizontally scrollable on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 mb-1 px-1 scrollbar-none">
        {currentModeConfig.items.map((item, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={item}
              type="button"
              onClick={() => handleItemChange(idx, item)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-[9.5px] sm:text-[10.5px] font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-400/50 shadow-sm'
                  : 'bg-black/50 text-zinc-400 hover:text-zinc-200 border border-white/10'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* 2. OPTION WHEEL (Silky smooth, responsive font sizes, click-to-select) */}
      <div className="w-full relative py-1">
        <OptionWheel
          items={currentModeConfig.items}
          defaultSelected={selectedIndex}
          textColor="#71717a"
          activeColor="#ffffff"
          side="right"
          loop={true}
          draggable={true}
          soundVolume={0.2}
          onChange={handleItemChange}
          onSelect={handleItemSelect}
          className="w-full"
        />
      </div>

      {/* 3. DYNAMIC EXPLORE ACTION PILL */}
      <div className="mt-1 sm:mt-2 flex flex-col items-center lg:items-end gap-1 sm:gap-1.5 z-20 w-full max-w-xs sm:max-w-sm">
        <Link
          href={activeHref}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-black/80 hover:bg-gold-500/20 text-gold-300 hover:text-gold-200 border border-gold-500/40 backdrop-blur-md text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition shadow-xl hover:shadow-gold-500/20 active:scale-95 group/btn max-w-full"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-400 group-hover/btn:rotate-12 transition shrink-0" />
          <span className="truncate max-w-[200px] sm:max-w-xs">
            Explorar {selectedItemText}
          </span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform shrink-0" />
        </Link>

        <p className="text-[10px] sm:text-[11px] text-zinc-300 font-light text-center lg:text-right drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-2">
          {activeSubtitle}
        </p>
      </div>

    </div>
  );
}

export default HeroOlfactiveWheel;
