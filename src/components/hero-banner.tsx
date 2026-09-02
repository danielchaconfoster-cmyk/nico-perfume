'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#060608] border-b border-zinc-900 min-h-[580px] lg:min-h-[640px] flex items-center">
      {/* Subtle Ambient Light */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[350px] bg-amber-600/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 right-1/4 w-[400px] h-[300px] bg-zinc-800/20 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: 50% Editorial Luxury Typography */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-7 text-left z-10">
            
            {/* Small Refined Category Kicker */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span className="text-[11px] font-medium tracking-[0.3em] text-gold-400 uppercase font-sans">
                Haute Parfumerie • Santiago
              </span>
            </div>

            {/* Giant Elegant Editorial Serif Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-[62px] font-light text-zinc-100 leading-[1.12] tracking-tight">
              El Arte del Aroma, <br />
              <span className="italic text-gold-gradient font-normal">
                En su Máxima Expresión.
              </span>
            </h1>

            {/* 2-Line Refined Subtitle */}
            <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-lg">
              Extractos árabes de fijación 14h, perfumería de autor y nuestro laboratorio interactivo de fragancias gemelas para encontrar tu aroma ideal.
            </p>

            {/* Haute Couture Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/catalogo"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-zinc-100 hover:bg-gold-400 text-black font-medium text-xs tracking-[0.18em] uppercase transition duration-300 shadow-md group"
              >
                <span>Explorar Colección</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                href="/fragancias-gemelas"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium tracking-[0.15em] uppercase hover:border-gold-500/40 transition"
              >
                <span>Fragancias Gemelas</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
              </Link>
            </div>

            {/* Minimalist Brand Houses Strip */}
            <div className="pt-6 lg:pt-8 border-t border-zinc-900/90">
              <p className="text-[10px] tracking-[0.25em] uppercase text-zinc-500 font-medium mb-3">
                Casas Olfativas & Colecciones Oficiales
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-serif tracking-[0.15em] text-zinc-400 uppercase">
                <span className="hover:text-zinc-200 transition">Afnan</span>
                <span className="text-zinc-700">•</span>
                <span className="hover:text-zinc-200 transition">Al Haramain</span>
                <span className="text-zinc-700">•</span>
                <span className="hover:text-zinc-200 transition">Bharara</span>
                <span className="text-zinc-700">•</span>
                <span className="hover:text-zinc-200 transition">Lattafa</span>
                <span className="text-zinc-700">•</span>
                <span className="hover:text-zinc-200 transition">Creed</span>
              </div>
            </div>

          </div>

          {/* Right Column: 50% Full-Bleed Studio Photography Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[540px] rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-850 shadow-2xl group">
              
              {/* Main Studio Image */}
              <Image
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&auto=format&fit=crop&q=85"
                alt="Alta Perfumería de Autor Nico Perfume"
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 opacity-90"
              />

              {/* Atmospheric Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Floating Editorial Badge (Top Right) */}
              <div className="absolute top-5 right-5 px-3.5 py-1.5 rounded-full bg-[#050507]/80 backdrop-blur-md border border-zinc-800 text-zinc-300 text-[10px] tracking-[0.2em] uppercase font-medium">
                Batch Code Verificado
              </div>

              {/* Floating Curated Showcase (Bottom Left) */}
              <div className="absolute bottom-6 inset-x-6 p-5 rounded-2xl bg-[#08080c]/85 backdrop-blur-md border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-gold-400 uppercase tracking-[0.2em] block">
                    Extractos de Larga Fijación
                  </span>
                  <h3 className="font-serif text-base sm:text-lg text-zinc-100 font-normal mt-0.5">
                    Colección Árabe & Diseñador
                  </h3>
                  <p className="text-xs text-zinc-400 font-light mt-0.5">
                    12 a 14 horas de proyección en piel
                  </p>
                </div>

                <Link
                  href="/decants"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-gold-400 hover:text-black text-zinc-300 text-[11px] font-medium tracking-wider uppercase border border-zinc-800 transition shrink-0"
                >
                  <span>Probar Decant</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
