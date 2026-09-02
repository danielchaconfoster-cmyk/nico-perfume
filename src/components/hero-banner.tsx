'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#07070b] border-b border-zinc-800 py-12 lg:py-16">
      {/* Subtle Warm Ambient Glow */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-zinc-700/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Clear, Friendly & Customer-Centric */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Direct Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-gold-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Perfumería 100% Original en Chile</span>
            </div>

            {/* Clear, Balanced Headline (Not Overstated) */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-100 font-normal leading-[1.2]">
              Encuentra tu perfume ideal, <br />
              <span className="text-gold-gradient font-light">al mejor precio.</span>
            </h1>

            {/* Natural Description */}
            <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
              Más de 1.300 perfumes originales, fragancias árabes virales y alternativas idénticas para oler increíble todos los días sin pagar de más.
            </p>

            {/* Single Clear Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/catalogo"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-zinc-100 hover:bg-gold-400 text-black font-semibold text-xs tracking-wider uppercase transition shadow-lg shadow-white/5 active:scale-95"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/fragancias-gemelas"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium tracking-wider uppercase transition"
              >
                <span>Perfumes Similares</span>
              </Link>
            </div>

            {/* Simple Trust Points */}
            <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Perfumes 100% Originales</span>
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Envíos a todo Chile</span>
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Compra protegida</span>
              </span>
            </div>

          </div>

          {/* Right Column: Dynamic Human Lifestyle Collage (People applying perfume, diversity, spray mist) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              
              {/* Photo 1: Woman applying perfume on neck */}
              <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80"
                  alt="Mujer disfrutando fragancia"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[11px] font-medium text-zinc-200">
                  Aromas para Mujer
                </span>
              </div>

              {/* Photo 2: Elegant Man applying fresh scent */}
              <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
                  alt="Hombre aplicando perfume"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[11px] font-medium text-zinc-200">
                  Aromas para Hombre
                </span>
              </div>

              {/* Photo 3: Spray mist & luxury bottle details (Span 2 on mobile) */}
              <div className="col-span-2 sm:col-span-1 relative h-48 sm:h-72 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80"
                  alt="Frasco y rocío de perfume"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[11px] font-medium text-gold-300">
                  Joyas Árabes
                </span>
              </div>

            </div>

            {/* Bottom mini showcase banner */}
            <div className="mt-3.5 p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-100">
                  ¿Buscas un perfume en específico?
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Revisa nuestro buscador o usa el test rápido en 30 segundos.
                </p>
              </div>

              <Link
                href="/sommelier-quiz"
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition shrink-0"
              >
                Hacer Test
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
