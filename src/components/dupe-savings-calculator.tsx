'use client';

import React, { useState } from 'react';
import { Perfume } from '@/types/perfume';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import { DollarSign, Sparkles, ShoppingBag, ArrowRight, TrendingDown } from 'lucide-react';
import Image from 'next/image';

interface DupeSavingsCalculatorProps {
  perfumes: Perfume[];
}

export function DupeSavingsCalculator({ perfumes }: DupeSavingsCalculatorProps) {
  const { addToCart, openQuickView } = useCart();

  const comparisons = [
    {
      designerName: 'Jean Paul Gaultier Ultra Male',
      designerPrice: 185000,
      arabicBrand: 'Afnan',
      arabicName: 'Afnan 9 PM EDP 100ml (Black)',
      perfumeLookup: '9 PM',
      notes: 'Manzana silvestre, Canela cálida y Vainilla seductora',
      durability: '10-12 hrs en piel (Superior al original)'
    },
    {
      designerName: 'Maison Francis Kurkdjian Baccarat Rouge 540',
      designerPrice: 320000,
      arabicBrand: 'Armaf',
      arabicName: 'Club de Nuit Untold Sterling Parfum',
      perfumeLookup: 'Untold',
      notes: 'Azafrán, Jazmín blanco, Ámbar gris y Cedro cristalino',
      durability: '14+ hrs en piel (Proyección masiva)'
    },
    {
      designerName: 'Xerjoff Erba Pura / Kirke',
      designerPrice: 280000,
      arabicBrand: 'Al Haramain',
      arabicName: 'Amber Oud Aqua Dubai Extrait',
      perfumeLookup: 'Aqua Dubai',
      notes: 'Frutas tropicales, Bergamota, Almizcle blanco y Ámbar',
      durability: '12+ hrs en piel (Extrait de Parfum)'
    },
    {
      designerName: 'Creed Aventus / Roja Elysium',
      designerPrice: 380000,
      arabicBrand: 'Bharara',
      arabicName: 'Bharara King EDP 150ml',
      perfumeLookup: 'King',
      notes: 'Naranja dulce, Frutas exóticas, Vainilla de Madagascar',
      durability: '14+ hrs (Bomba de cumplidos)'
    }
  ];

  return (
    <section id="calculadora-ahorro" className="py-20 bg-[#08080a] border-t border-zinc-800/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wider uppercase mb-4">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span>El Bóveda de Ahorro Inteligente</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-light text-zinc-100">
            Mismo ADN Olfativo de Lujo, <br />
            <span className="italic text-gold-gradient font-normal">Ahorrando hasta un 85%.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Las casas árabes y de autor utilizan concentraciones de aceites naturales superiores a muchas marcas de retail a una fracción de su costo de marketing.
          </p>
        </div>

        {/* Comparisons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {comparisons.map((item, idx) => {
            const perfumeMatch = perfumes.find(p =>
              p.name.toLowerCase().includes(item.perfumeLookup.toLowerCase())
            ) || perfumes[idx];

            const savings = item.designerPrice - perfumeMatch.price;
            const savingsPercent = Math.round((savings / item.designerPrice) * 100);

            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-gold-500/40 transition flex flex-col justify-between group shadow-xl"
              >
                <div>
                  {/* Versus Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-850">
                    <div className="text-left">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Perfume de Diseñador</span>
                      <p className="text-xs font-medium text-zinc-300 truncate max-w-[170px]">{item.designerName}</p>
                      <p className="text-sm font-bold text-zinc-400 line-through mt-0.5">{formatCLP(item.designerPrice)}</p>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-[10px] font-bold text-gold-400">
                      VS
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-gold-400 uppercase">Alternativa Nico Perfume</span>
                      <p className="text-xs font-medium text-zinc-100 truncate max-w-[170px]">{perfumeMatch.name}</p>
                      <p className="text-sm font-bold text-emerald-400 font-serif mt-0.5">{formatCLP(perfumeMatch.price)}</p>
                    </div>
                  </div>

                  {/* Savings Pill */}
                  <div className="my-4 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-300">¡Tu Ahorro Real!</span>
                      <p className="text-lg font-bold text-emerald-400 font-serif">{formatCLP(savings)} CLP</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-black font-extrabold text-xs">
                      -{savingsPercent}% MENOS
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400">
                    <strong className="text-zinc-200">Acordes:</strong> {item.notes}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    <strong className="text-gold-400">Fijación:</strong> {item.durability}
                  </p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-zinc-850">
                  <button
                    onClick={() => openQuickView(perfumeMatch)}
                    className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold text-center transition"
                  >
                    Ver Ficha
                  </button>
                  <button
                    onClick={() => addToCart(perfumeMatch)}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-gold-500 to-emerald-400 hover:brightness-110 active:scale-95 text-black text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Llevar Joya</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
