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
          return '+650 fragancias masculinas de alta proyección';
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
    getSubtitle: (item: string) => `Colección oficial de ${item} con batch code verificable`,
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
      <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-full bg-black/60 backdrop-blur-lg border border-gold-500/30 mb-2 sm:mb-3 shadow-xl">
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

      {/* 2. OPTION WHEEL (Right Curved 3D Cylinder) */}
      <div className="w-full relative py-1 sm:py-2">
        <OptionWheel
          items={currentModeConfig.items}
          defaultSelected={selectedIndex}
          textColor="#71717a"
          activeColor="#ffffff"
          side="right"
          fontSize={2.3}
          spacing={1.3}
          curve={1}
          tilt={6}
          blur={2.5}
          fade={0.3}
          smoothing={220}
          inset={0}
          loop={true}
          draggable={true}
          soundVolume={0.25}
          onChange={handleItemChange}
          onSelect={handleItemSelect}
          className="w-full"
        />
      </div>

      {/* 3. DYNAMIC EXPLORE ACTION PILL */}
      <div className="mt-1 sm:mt-2 flex flex-col items-center lg:items-end gap-1 sm:gap-1.5 z-20">
        <Link
          href={activeHref}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-black/70 hover:bg-gold-500/20 text-gold-300 hover:text-gold-200 border border-gold-500/40 backdrop-blur-md text-[10.5px] sm:text-xs font-medium tracking-wider uppercase transition shadow-xl hover:shadow-gold-500/20 group/btn"
        >
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-400 group-hover/btn:rotate-12 transition" />
          <span>Ver {selectedItemText} en Catálogo</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>

        <p className="text-[10px] sm:text-[11px] text-zinc-300 font-light max-w-xs text-center lg:text-right drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {activeSubtitle}
        </p>
      </div>

    </div>
  );
}

export default HeroOlfactiveWheel;
