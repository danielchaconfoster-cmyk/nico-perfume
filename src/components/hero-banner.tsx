'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles, Flame, Compass, ShieldCheck } from 'lucide-react';
import { PixelDissolveBackground, SceneItem, CINEMATIC_SCENES } from './pixel-dissolve-background';
import { ShinyText } from '@/components/react-bits/shiny-text';
import { Magnet } from '@/components/react-bits/magnet';
import { SpotlightCard } from '@/components/react-bits/spotlight-card';

const DEFAULT_SCENE: SceneItem = {
  id: 'p1-perfume',
  type: 'perfume',
  pairIndex: 0,
  gender: 'Mujer',
  title: 'Lattafa Yara Rosa (Extrait)',
  subtitle: 'Extracto dulce de vainilla, orquídea y malvavisco',
  imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1400&auto=format&fit=crop&q=80',
};

export function HeroBanner() {
  const [activeScene, setActiveScene] = useState<SceneItem>(CINEMATIC_SCENES?.[0] || DEFAULT_SCENE);
  const [manualGenderFilter, setManualGenderFilter] = useState<'Hombre' | 'Mujer' | 'Unisex' | null>(null);

  const currentScene = activeScene || DEFAULT_SCENE;
  const displayedGender = manualGenderFilter || currentScene?.gender || 'Mujer';

  const handleSceneChange = useCallback((scene: SceneItem) => {
    if (scene && scene.gender) {
      setActiveScene(scene);
    }
  }, []);

  const genderList: Array<{ label: 'HOMBRE' | 'MUJER' | 'UNISEX'; value: 'Hombre' | 'Mujer' | 'Unisex'; count: string }> = [
    { label: 'HOMBRE', value: 'Hombre', count: '+650 fragancias' },
    { label: 'MUJER', value: 'Mujer', count: '+500 fragancias' },
    { label: 'UNISEX', value: 'Unisex', count: '+180 extractos' },
  ];

  return (
    <section className="relative min-h-[90vh] lg:min-h-[94vh] flex items-center overflow-hidden border-b border-zinc-800 py-16 sm:py-24">
      
      {/* 1. CINEMATIC PIXEL DISSOLVE BACKGROUND ENGINE (Full Bleed Edge-to-Edge) */}
      <PixelDissolveBackground onSceneChange={handleSceneChange} />

      {/* 2. FOREGROUND CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: BRANDING, HEADLINE & ACTIONS (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Live Synchronized Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-gold-500/30 text-xs shadow-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <ShinyText text="Alta Perfumería 100% Original en Chile" speed={3.5} className="text-xs font-semibold text-gold-300" />
            </div>

            {/* Main Luxury Headline */}
            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-zinc-100 font-light leading-[1.12] tracking-tight">
                Encuentra tu <br />
                <span className="text-gold-gradient font-normal italic">fragancia firma,</span> <br />
                al mejor precio de Chile.
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-xl bg-black/30 backdrop-blur-sm p-3.5 rounded-2xl border border-white/5">
              Más de 1.300 perfumes originales sellados de diseñador, joyas árabes virales y extractos puros con asesoría personalizada y despacho rápido a todo el país.
            </p>

            {/* Action Buttons with Magnet Effect */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Magnet padding={25} magnetStrength={0.16}>
                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:brightness-110 text-black font-bold text-xs tracking-[0.2em] uppercase transition shadow-2xl shadow-gold-500/30 active:scale-95"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Magnet>

              <Magnet padding={25} magnetStrength={0.14}>
                <Link
                  href="/fragancias-gemelas"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-black/70 hover:bg-zinc-900 text-zinc-200 border border-zinc-700/80 hover:border-gold-500/40 text-xs font-medium tracking-wider uppercase backdrop-blur-md transition shadow-lg"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span>Perfumes Similares (Clones)</span>
                </Link>
              </Magnet>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>100% Original Sellado</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Batch Code Verificable</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Envíos Starken & Blue</span>
              </span>
            </div>

          </div>

          {/* RIGHT COLUMN: INTERACTIVE GENDER SCROLL RAIL & LIVE CINEMATIC CARD (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Glass Container for the Category Rail & Scene Indicator */}
            <div className="p-6 sm:p-7 rounded-3xl bg-black/65 backdrop-blur-xl border border-gold-500/30 shadow-2xl shadow-black space-y-6">
              
              {/* Category Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-gold-400" /> Navegación Olfativa
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase">
                  {currentScene?.type === 'perfume' ? '• Frasco de Colección' : '• Modelo en Aplicación'}
                </span>
              </div>

              {/* 1. SCROLL & CLICK GENDER RAIL (HOMBRE / MUJER / UNISEX) */}
              <div className="space-y-2.5">
                {genderList.map((g) => {
                  const isActive = displayedGender === g.value;
                  return (
                    <Link
                      key={g.value}
                      href={`/catalogo?genero=${encodeURIComponent(g.value)}`}
                      onMouseEnter={() => setManualGenderFilter(g.value)}
                      onMouseLeave={() => setManualGenderFilter(null)}
                      className={`group w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-gold-950/70 to-zinc-900/80 border-gold-500/80 text-zinc-100 shadow-lg shadow-gold-950/60 scale-[1.02]'
                          : 'bg-zinc-950/60 border-zinc-850 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2.5 h-2.5 rounded-full transition ${
                            isActive ? 'bg-gold-400 shadow-glow' : 'bg-zinc-700'
                          }`}
                        />
                        <span className="font-serif tracking-[0.2em] text-sm sm:text-base font-medium">
                          {g.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-zinc-400 font-mono group-hover:text-zinc-300 transition">
                          {g.count}
                        </span>
                        <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-1 text-gold-400' : 'text-zinc-600'}`} />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* 2. LIVE ROTATION SCENE SPOTLIGHT */}
              <SpotlightCard className="!p-4 !rounded-2xl !bg-zinc-950/80 !border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-gold-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    En Pantalla: {currentScene?.gender || 'Fragancia'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Transición Activa
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-zinc-100 line-clamp-1">
                  {currentScene?.title || 'Fragancia Destacada'}
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-snug">
                  {currentScene?.subtitle || 'Extracto puro de alta proyección'}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-zinc-850/80 text-xs">
                  <Link
                    href="/sommelier-quiz"
                    className="text-[11px] text-gold-400 hover:text-gold-300 font-medium underline underline-offset-4"
                  >
                    ¿Cuál va contigo? Hacer Test →
                  </Link>
                  <Link
                    href="/catalogo"
                    className="px-3 py-1 rounded-xl bg-zinc-800 hover:bg-gold-500 hover:text-black text-zinc-200 text-[11px] font-semibold transition"
                  >
                    Ver Catálogo
                  </Link>
                </div>
              </SpotlightCard>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
