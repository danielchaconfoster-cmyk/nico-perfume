'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface BrandsMarqueeProps {
  variant?: 'hero' | 'footer';
  className?: string;
}

const LUXURY_BRANDS = [
  { name: 'GIORGIO ARMANI', origin: 'MILANO', category: 'DISEÑADOR' },
  { name: 'TOM FORD', origin: 'NEW YORK', category: 'PRIVATE BLEND' },
  { name: 'CALVIN KLEIN', origin: 'NEW YORK', category: 'ICONIC' },
  { name: 'AZZARO', origin: 'PARIS', category: 'POUR HOMME' },
  { name: 'CHANEL', origin: 'PARIS', category: 'ALTA PERFUMERÍA' },
  { name: 'DIOR', origin: 'PARIS', category: 'HAUTE PARFUMERIE' },
  { name: 'CREED', origin: 'PARIS 1760', category: 'NICHO ROYAL' },
  { name: 'AFNAN', origin: 'DUBAI', category: 'ORIENTAL VIRAL' },
  { name: 'LATTAFA', origin: 'DUBAI', category: 'EXTRAIT DE PARFUM' },
  { name: 'AL HARAMAIN', origin: 'EMIRATOS', category: 'GOLD COLLECTION' },
  { name: 'BHARARA', origin: 'PARIS / USA', category: 'EDICIÓN REY' },
  { name: 'JEAN PAUL GAULTIER', origin: 'PARIS', category: 'LE MALE' },
  { name: 'CAROLINA HERRERA', origin: 'NEW YORK', category: 'GOOD GIRL' },
  { name: 'PACO RABANNE', origin: 'PARIS', category: '1 MILLION' },
  { name: 'VERSACE', origin: 'MILANO', category: 'EROS & DYLAN' },
  { name: 'YVES SAINT LAURENT', origin: 'PARIS', category: 'Y & BLACK OPIUM' },
  { name: 'NARCISO RODRIGUEZ', origin: 'NEW YORK', category: 'MUSC FOR HER' },
  { name: 'MONTBLANC', origin: 'GERMANY', category: 'LEGEND & EXPLORER' },
];

export function BrandsMarquee({ variant = 'hero', className = '' }: BrandsMarqueeProps) {
  // Duplicated list to create the seamless infinite 100% loop
  const duplicatedBrands = [...LUXURY_BRANDS, ...LUXURY_BRANDS];

  if (variant === 'footer') {
    return (
      <div className={`w-full bg-[#040406] border-y border-zinc-850/80 py-5 overflow-hidden relative ${className}`}>
        {/* Gradient Mask on edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#040406] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#040406] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-10 sm:gap-14">
          {duplicatedBrands.map((brand, idx) => (
            <Link
              key={idx}
              href={`/catalogo?marca=${encodeURIComponent(brand.name)}`}
              className="flex items-center gap-3 shrink-0 group transition"
            >
              <span className="font-serif tracking-[0.25em] text-xs sm:text-sm font-light text-zinc-400 group-hover:text-gold-300 transition-colors uppercase whitespace-nowrap">
                {brand.name}
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-600 uppercase">
                {brand.origin}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500/40 group-hover:bg-gold-400 group-hover:scale-125 transition ml-4 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-gradient-to-b from-[#08080c] via-[#0b0b12] to-[#08080c] border-b border-zinc-800/80 py-6 sm:py-8 overflow-hidden relative ${className}`}>
      
      {/* Header text */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.25em] text-gold-400">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>Casas Olfativas & Diseñadores Globales</span>
        </div>
        <Link
          href="/catalogo"
          className="text-[11px] text-zinc-400 hover:text-gold-300 uppercase tracking-wider font-light transition hidden sm:inline-block"
        >
          Ver todas las marcas (+50) →
        </Link>
      </div>

      {/* Gradient Vignette Mask on edges */}
      <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#08080c] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#08080c] to-transparent z-10 pointer-events-none" />

      {/* Infinite Scrolling Ticker Track */}
      <div className="animate-marquee flex items-center gap-6 sm:gap-8 py-1">
        {duplicatedBrands.map((brand, idx) => (
          <Link
            key={idx}
            href={`/catalogo?marca=${encodeURIComponent(brand.name)}`}
            className="flex items-center gap-3.5 px-4 py-2 rounded-2xl bg-zinc-900/40 hover:bg-zinc-850/80 border border-zinc-800 hover:border-gold-500/40 shrink-0 group transition duration-300 shadow-sm"
          >
            <div className="flex flex-col text-left">
              <span className="font-serif tracking-[0.18em] text-xs sm:text-sm font-normal text-zinc-300 group-hover:text-gold-300 transition-colors uppercase whitespace-nowrap">
                {brand.name}
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 group-hover:text-zinc-300 uppercase -mt-0.5">
                {brand.origin} • {brand.category}
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-gold-500/30 group-hover:bg-gold-400 group-hover:scale-125 transition shrink-0 ml-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
