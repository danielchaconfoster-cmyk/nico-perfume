'use client';

import React from 'react';
import { Perfume } from '@/types/perfume';
import { ProductCard } from './product-card';
import { Flame, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface BestsellersSectionProps {
  perfumes: Perfume[];
}

export function BestsellersSection({ perfumes }: BestsellersSectionProps) {
  const bestSellers = perfumes
    .filter(p => p.isBestSeller)
    .slice(0, 8);

  return (
    <section id="bestsellers" className="py-20 bg-gradient-to-b from-[#08080a] via-zinc-950 to-[#08080a] border-t border-zinc-800/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-gold-400" />
              <span>Tendencia & Mayor Demanda</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-zinc-100 font-light">
              Fragancias <span className="italic text-gold-gradient font-normal">Más Vendidas</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Las obras maestras más elogiadas por la comunidad de coleccionistas en Chile.
            </p>
          </div>

          <Link
            href="#catalogo"
            className="inline-flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-xs font-semibold uppercase tracking-wider group"
          >
            <span>Ver Todas</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map(p => (
            <ProductCard key={p.id} perfume={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
