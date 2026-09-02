'use client';

import React from 'react';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import { Perfume } from '@/types/perfume';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface DupeSavingsCalculatorProps {
  perfumes: Perfume[];
}

export function DupeSavingsCalculator({ perfumes }: DupeSavingsCalculatorProps) {
  const { addToCart } = useCart();

  const comparisons = [
    {
      designerName: 'Jean Paul Gaultier Ultra Male',
      designerPrice: 185000,
      designerImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80',
      dupeSku: 'AFNAN-9PM',
      dupeName: 'Afnan 9 PM Eau de Parfum (100ml)',
      dupePrice: 38990,
      dupeImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80',
      similarity: '98% Similitud Olfativa',
      notesShared: 'Vainilla negra, Canela especiada, Manzana silvestre, Lavanda, Ámbar gris'
    },
    {
      designerName: 'Creed Aventus',
      designerPrice: 380000,
      designerImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
      dupeSku: 'AL-HARAMAIN-AMBER-OUD',
      dupeName: 'Al Haramain Amber Oud Gold Edition (120ml)',
      dupePrice: 62990,
      dupeImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80',
      similarity: '96% Similitud Olfativa',
      notesShared: 'Piña ahumada, Bergamota de Calabria, Ámbar, Melón, Almizcle blanco'
    },
    {
      designerName: 'Dolce & Gabbana K Eau de Parfum',
      designerPrice: 155000,
      designerImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80',
      dupeSku: 'BHARARA-KING',
      dupeName: 'Bharara King Parfum (100ml + Decant)',
      dupePrice: 54990,
      dupeImage: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80',
      similarity: '99% Similitud Olfativa',
      notesShared: 'Naranja sanguina, Bayas de enebro, Cedro de Virginia, Vainilla real'
    }
  ];

  const handleBuyDupe = (sku: string) => {
    const item = perfumes.find((p: Perfume) => p.sku === sku);
    if (item) {
      addToCart(item);
    }
  };

  return (
    <section id="calculadora-ahorro" className="py-20 bg-[#07070a] border-t border-zinc-900 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[11px] font-medium tracking-[0.3em] text-zinc-400 uppercase mb-3">
            Análisis Comparativo de Mercado
          </p>

          <h2 className="font-serif text-3xl sm:text-5xl font-light text-zinc-100 leading-[1.2]">
            La Bóveda de Ahorro Inteligente <br />
            <span className="italic text-gold-gradient font-normal">Extractos Equivalentes vs Retail.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            La perfumería árabe utiliza concentraciones de aceites esenciales idénticas o superiores a las casas de diseñador por una fracción del valor de marca y marketing de retail.
          </p>
        </div>

        {/* Comparison Vault Cards */}
        <div className="space-y-6">
          {comparisons.map((c, idx) => {
            const savings = c.designerPrice - c.dupePrice;
            const savingsPercent = Math.round((savings / c.designerPrice) * 100);

            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-850 hover:border-zinc-750 transition shadow-2xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Designer (Left) */}
                  <div className="lg:col-span-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-900 flex items-center gap-4">
                    <div className="w-16 h-20 relative rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                      <Image src={c.designerImage} alt={c.designerName} fill className="object-cover opacity-60 grayscale" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Diseñador Retail</span>
                      <h4 className="text-xs font-semibold text-zinc-300 mt-0.5">{c.designerName}</h4>
                      <p className="text-sm font-serif text-zinc-500 line-through mt-1">{formatCLP(c.designerPrice)}</p>
                    </div>
                  </div>

                  {/* Similarity Badge (Center) */}
                  <div className="lg:col-span-4 text-center space-y-1">
                    <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                      {c.similarity}
                    </span>
                    <p className="text-[11px] text-zinc-400 pt-1 leading-snug">
                      Notas compartidas: <span className="text-zinc-300">{c.notesShared}</span>
                    </p>
                    <div className="pt-1">
                      <span className="text-xs font-semibold text-emerald-400">
                        Ahorro Real de {formatCLP(savings)} ({savingsPercent}% MENOS)
                      </span>
                    </div>
                  </div>

                  {/* Dupe Alternative (Right) */}
                  <div className="lg:col-span-4 p-4 rounded-xl bg-zinc-900/80 border border-gold-500/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-16 h-20 relative rounded-lg overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                        <Image src={c.dupeImage} alt={c.dupeName} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] uppercase font-bold text-gold-400 tracking-wider">Joya de Autor</span>
                        <h4 className="text-xs font-semibold text-zinc-100 truncate mt-0.5">{c.dupeName}</h4>
                        <p className="text-base font-serif font-bold text-gold-300 mt-1">{formatCLP(c.dupePrice)}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyDupe(c.dupeSku)}
                      className="p-3 rounded-xl bg-zinc-100 hover:bg-gold-400 text-black shrink-0 transition"
                      title="Llevar fragancia"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
