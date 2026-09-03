'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { LogoLoop, LogoItem } from '@/components/react-bits/logo-loop';

interface BrandsMarqueeProps {
  variant?: 'hero' | 'footer';
  className?: string;
}

const LUXURY_BRANDS: LogoItem[] = [
  { title: 'GIORGIO ARMANI', origin: 'MILANO', category: 'DISEÑADOR', href: '/catalogo?marca=GIORGIO%20ARMANI' },
  { title: 'TOM FORD', origin: 'NEW YORK', category: 'PRIVATE BLEND', href: '/catalogo?marca=TOM%20FORD' },
  { title: 'CALVIN KLEIN', origin: 'NEW YORK', category: 'ICONIC', href: '/catalogo?marca=CALVIN%20KLEIN' },
  { title: 'AZZARO', origin: 'PARIS', category: 'POUR HOMME', href: '/catalogo?marca=AZZARO' },
  { title: 'CHANEL', origin: 'PARIS', category: 'ALTA PERFUMERÍA', href: '/catalogo?marca=CHANEL' },
  { title: 'DIOR', origin: 'PARIS', category: 'HAUTE PARFUMERIE', href: '/catalogo?marca=DIOR' },
  { title: 'CREED', origin: 'PARIS 1760', category: 'NICHO ROYAL', href: '/catalogo?marca=CREED' },
  { title: 'AFNAN', origin: 'DUBAI', category: 'ORIENTAL VIRAL', href: '/catalogo?marca=AFNAN' },
  { title: 'LATTAFA', origin: 'DUBAI', category: 'EXTRAIT DE PARFUM', href: '/catalogo?marca=LATTAFA' },
  { title: 'AL HARAMAIN', origin: 'EMIRATOS', category: 'GOLD COLLECTION', href: '/catalogo?marca=AL%20HARAMAIN' },
  { title: 'BHARARA', origin: 'PARIS / USA', category: 'EDICIÓN REY', href: '/catalogo?marca=BHARARA' },
  { title: 'JEAN PAUL GAULTIER', origin: 'PARIS', category: 'LE MALE', href: '/catalogo?marca=JEAN%20PAUL%20GAULTIER' },
  { title: 'CAROLINA HERRERA', origin: 'NEW YORK', category: 'GOOD GIRL', href: '/catalogo?marca=CAROLINA%20HERRERA' },
  { title: 'PACO RABANNE', origin: 'PARIS', category: '1 MILLION', href: '/catalogo?marca=PACO%20RABANNE' },
  { title: 'VERSACE', origin: 'MILANO', category: 'EROS & DYLAN', href: '/catalogo?marca=VERSACE' },
  { title: 'YVES SAINT LAURENT', origin: 'PARIS', category: 'Y & BLACK OPIUM', href: '/catalogo?marca=YVES%20SAINT%20LAURENT' },
  { title: 'NARCISO RODRIGUEZ', origin: 'NEW YORK', category: 'MUSC FOR HER', href: '/catalogo?marca=NARCISO%20RODRIGUEZ' },
  { title: 'MONTBLANC', origin: 'GERMANY', category: 'LEGEND & EXPLORER', href: '/catalogo?marca=MONTBLANC' },
];

export function BrandsMarquee({ variant = 'hero', className = '' }: BrandsMarqueeProps) {
  if (variant === 'footer') {
    return (
      <div className={`w-full bg-[#040406] border-y border-zinc-850/80 py-4 overflow-hidden relative ${className}`}>
        <LogoLoop
          logos={LUXURY_BRANDS}
          speed={35}
          direction="left"
          logoHeight={40}
          gap={48}
          hoverSpeed={0}
          scaleOnHover={true}
          fadeOut={true}
          fadeOutColor="#040406"
          ariaLabel="Casas de Perfumería - Footer"
        />
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

      {/* Infinite LogoLoop Marquee */}
      <LogoLoop
        logos={LUXURY_BRANDS}
        speed={45}
        direction="left"
        logoHeight={48}
        gap={32}
        hoverSpeed={0}
        scaleOnHover={true}
        fadeOut={true}
        fadeOutColor="#08080c"
        ariaLabel="Casas Olfativas y Diseñadores Globales"
      />
    </div>
  );
}

export default BrandsMarquee;
