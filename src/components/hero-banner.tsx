'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Award } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0e0e13] via-[#08080a] to-[#08080a] border-b border-gold-500/10 py-16 sm:py-24 lg:py-28">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gold-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-emerald-700/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-950/60 border border-gold-500/30 text-gold-300 text-xs sm:text-sm font-medium tracking-wide mb-8">
          <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
          <span>Colección 2026 & Perfumería Árabe de Lujo</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-zinc-100 max-w-4xl mx-auto leading-[1.15]">
          Tu Firma Olfativa, <br />
          <span className="font-normal italic text-gold-gradient">
            Elevada al Arte.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
          Explora más de <span className="text-zinc-200 font-medium">1.370 fragancias auténticas</span> de diseñador, joyas árabes y perfumería nicho. Usa nuestro recomendador inteligente para descubrir tu aroma ideal a partir de los perfumes que ya amas.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href="#recomendador"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-black font-semibold text-sm tracking-wider uppercase shadow-xl shadow-gold-500/20 hover:brightness-110 active:scale-95 transition group"
          >
            <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
            <span>Fragancias Gemelas</span>
          </Link>
          <Link
            href="#catalogo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-gold-500/25 font-medium text-sm tracking-wider uppercase hover:border-gold-400/50 transition group"
          >
            <span>Ver Catálogo</span>
            <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Highlight Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-zinc-800/80">
          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
            <p className="text-2xl sm:text-3xl font-serif text-gold-300 font-bold">1.370+</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Perfumes en Stock</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
            <p className="text-2xl sm:text-3xl font-serif text-gold-300 font-bold">110+</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Casas Internacionales</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
            <p className="text-2xl sm:text-3xl font-serif text-gold-300 font-bold">100%</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Originales & Sellados</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
            <p className="text-2xl sm:text-3xl font-serif text-gold-300 font-bold">4.9 ★</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Satisfacción Clientes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
