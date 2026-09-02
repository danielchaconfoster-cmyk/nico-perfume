'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Gift, Check, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#070709] border-b border-zinc-800/80 py-12 sm:py-16 lg:py-20">
      {/* Subtle Atmospheric Light (No overdone neon glows) */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-amber-600/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[250px] bg-zinc-800/20 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Human Editorial Typography */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              <span className="text-[11px] font-semibold tracking-[0.25em] text-gold-400 uppercase font-sans">
                Haute Parfumerie • Santiago de Chile
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-normal tracking-tight text-zinc-100 leading-[1.18]">
              Aromas que Conquistan. <br />
              <span className="italic font-light text-gold-gradient">
                Sin Pagar de Más.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-xl">
              Perfumería árabe de fijación extrema, extractos de autor y las casas de diseñador más buscadas. Encuentra tu próxima firma olfativa a través de nuestro recomendador inteligente o prueba nuestros sets de decants sin comprar a ciegas.
            </p>

            {/* Direct Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="#recomendador"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-black font-semibold text-xs tracking-wider uppercase shadow-lg shadow-gold-500/20 hover:brightness-110 active:scale-95 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Fragancias Gemelas</span>
              </Link>
              <Link
                href="#catalogo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-medium text-xs tracking-wider uppercase hover:border-gold-500/40 transition group"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Subtle Editorial Trust Points (Clean, without fake big AI counter cards) */}
            <div className="pt-4 border-t border-zinc-850 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-400 font-normal">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Perfumes 100% Originales con Batch Code</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Despacho a todo Chile (Starken / Blue)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Asesoría personalizada por WhatsApp</span>
              </span>
            </div>
          </div>

          {/* Right Column: Visual Editorial Showcase (3 Luxury Photographic Cards) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: Main Arabic / Niche Visual (Span 2 cols on mobile, tall hero card) */}
            <div className="sm:col-span-2 relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-zinc-800 group bg-zinc-950 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1000&auto=format&fit=crop&q=80"
                alt="Alta Perfumería y Extractos Árabes"
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex items-end justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded bg-gold-950/80 border border-gold-500/40 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                    Joya Destacada
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl text-zinc-100 font-normal mt-2">
                    Colección Árabe & Extrait de Parfum
                  </h3>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    Fijación extrema de 12 a 14 horas con estela magnética
                  </p>
                </div>
                <Link
                  href="#catalogo"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-gold-300 hover:text-white transition"
                >
                  <span>Ver Todos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Discovery Sets / Decants Visual */}
            <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden border border-zinc-800 group bg-zinc-950 shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80"
                alt="Discovery Sets y Muestras de 5ml"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              <div className="absolute bottom-0 inset-x-0 p-4">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Gift className="w-3 h-3" /> Discovery Sets
                </span>
                <h4 className="font-serif text-sm text-zinc-100 mt-1">
                  Packs de Decants (5ml)
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  100% Reembolsable al comprar tu botella
                </p>
                <Link
                  href="#decants"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-300 mt-2 hover:underline"
                >
                  <span>Ver Kits</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Card 3: Interactive Recommender Teaser */}
            <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden border border-gold-500/30 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-4 flex flex-col justify-between group shadow-xl">
              <div>
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Sistema Exclusivo
                </span>
                <h4 className="font-serif text-sm text-zinc-100 mt-1">
                  Matchmaker Olfativo
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  ¿Usas Sauvage, Ultra Male o Baccarat? Encuentra su gemelo exacto ahorrando hasta un 80%.
                </p>
              </div>

              <Link
                href="#recomendador"
                className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-gold-500 hover:text-black text-gold-300 text-[11px] font-semibold text-center border border-zinc-700 transition flex items-center justify-center gap-1.5"
              >
                <span>Probar Recomendador</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
