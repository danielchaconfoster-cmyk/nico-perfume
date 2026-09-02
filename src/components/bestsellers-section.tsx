'use client';

import React from 'react';
import { Perfume } from '@/types/perfume';
import { ProductCard } from './product-card';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ScrollFloat } from '@/components/react-bits/scroll-float';

interface BestsellersSectionProps {
  perfumes: Perfume[];
}

export function BestsellersSection({ perfumes }: BestsellersSectionProps) {
  const bestSellers = perfumes
    .filter(p => p.isBestSeller)
    .slice(0, 8);

  return (
    <section id="bestsellers" className="py-16 sm:py-20 bg-gradient-to-b from-[#07070b] via-[#0a0a0f] to-[#07070b] border-t border-zinc-800/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Los Favoritos de la Comunidad</span>
            </div>
            
            {/* ScrollFloat Title from ReactBits */}
            <h2 className="font-serif text-2xl sm:text-4xl text-zinc-100 font-normal">
              <ScrollFloat className="text-zinc-100">
                Los Perfumes Más Pedidos en Chile
              </ScrollFloat>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-light">
              Las opciones más buscadas por su duración, proyección y cumplidos.
            </p>
          </div>

          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-gold-300 text-xs font-medium uppercase tracking-wider group transition"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
