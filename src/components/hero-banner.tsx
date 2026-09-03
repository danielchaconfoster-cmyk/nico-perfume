'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles, ShieldCheck, Flame } from 'lucide-react';
import { PixelDissolveBackground, SceneItem, CINEMATIC_SCENES } from './pixel-dissolve-background';
import { OlfactiveWheelSlider } from './olfactive-wheel-slider';
import { ShinyText } from '@/components/react-bits/shiny-text';
import { Magnet } from '@/components/react-bits/magnet';

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
  const [selectedGender, setSelectedGender] = useState<'Hombre' | 'Mujer' | 'Unisex'>('Mujer');

  const handleSceneChange = useCallback((scene: SceneItem) => {
    if (scene && scene.gender) {
      setActiveScene(scene);
      setSelectedGender(scene.gender);
    }
  }, []);

  const handleGenderSelect = useCallback((gender: 'Hombre' | 'Mujer' | 'Unisex') => {
    setSelectedGender(gender);
  }, []);

  const currentScene = activeScene || DEFAULT_SCENE;

  return (
    <section className="relative min-h-[90vh] lg:min-h-[94vh] flex items-center overflow-hidden border-b border-zinc-800 py-6 sm:py-14 lg:py-20">
      
      {/* 1. CINEMATIC PIXEL DISSOLVE BACKGROUND ENGINE (Smart mobile portrait focal framing) */}
      <PixelDissolveBackground
        onSceneChange={handleSceneChange}
        targetGender={selectedGender}
      />

      {/* 2. FOREGROUND CONTENT GRID (100% Transparent Overlays) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: BRANDING, HEADLINE & ACTIONS (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            
            {/* Live Synchronized Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-gold-500/30 text-xs shadow-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <ShinyText text="Alta Perfumería 100% Original en Chile" speed={3.5} className="text-[10.5px] sm:text-xs font-semibold text-gold-300" />
            </div>

            {/* Main Luxury Headline */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="font-serif text-2xl sm:text-5xl lg:text-6xl text-zinc-100 font-light leading-[1.12] tracking-tight">
                Encuentra tu <br />
                <span className="text-gold-gradient font-normal italic">fragancia firma,</span> <br />
                al mejor precio de Chile.
              </h1>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm lg:text-base text-zinc-300 font-light leading-relaxed max-w-xl bg-black/35 backdrop-blur-sm p-2.5 sm:p-3.5 rounded-2xl border border-white/5">
              Más de 1.300 perfumes originales sellados de diseñador, joyas árabes virales y extractos puros con asesoría personalizada y despacho rápido a todo el país.
            </p>

            {/* Action Buttons with Magnet Effect */}
            <div className="pt-0.5 sm:pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <Magnet padding={25} magnetStrength={0.16}>
                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:brightness-110 text-black font-bold text-xs tracking-[0.2em] uppercase transition shadow-2xl shadow-gold-500/30 active:scale-95 text-center"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Magnet>

              <Magnet padding={25} magnetStrength={0.14}>
                <Link
                  href="/fragancias-gemelas"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-4 rounded-2xl bg-black/70 hover:bg-zinc-900 text-zinc-200 border border-zinc-700/80 hover:border-gold-500/40 text-xs font-medium tracking-wider uppercase backdrop-blur-md transition shadow-lg text-center"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span>Perfumes Similares (Clones)</span>
                </Link>
              </Magnet>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 sm:pt-3 border-t border-zinc-800/80 flex flex-wrap items-center gap-y-1.5 gap-x-4 sm:gap-x-5 text-[11px] sm:text-xs text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span>100% Original Sellado</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400" />
                <span>Batch Code Verificable</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span>Envíos Starken & Blue</span>
              </span>
            </div>

          </div>

          {/* RIGHT COLUMN: FLOATING CIRCULAR 3D TEXT WHEEL SLIDER (5 Cols - No Solid Box) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-2 sm:space-y-3">
            
            {/* 1. Transparent 3D Dial Olfactive Wheel */}
            <OlfactiveWheelSlider
              currentGender={selectedGender}
              onGenderChange={handleGenderSelect}
            />

            {/* 2. Floating Minimalist Scene Spotlight (Non-Intrusive Glass Capsule) */}
            <div className="w-full max-w-xs sm:max-w-sm px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/10 flex items-center justify-between gap-2.5 text-xs shadow-xl">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10px] uppercase font-bold text-gold-400 tracking-wider">
                  <Flame className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">
                    En Escena: {currentScene?.title || 'Colección Exclusiva'}
                  </span>
                </div>
                <p className="text-[10.5px] sm:text-[11px] text-zinc-400 truncate font-light">
                  {currentScene?.subtitle || 'Alta fijación y proyección'}
                </p>
              </div>

              <Link
                href="/sommelier-quiz"
                className="shrink-0 px-2.5 py-1 rounded-lg bg-gold-500/20 hover:bg-gold-500 text-gold-300 hover:text-black border border-gold-500/30 text-[10px] sm:text-[10.5px] font-semibold transition tracking-wide"
              >
                Test Olfativo
              </Link>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
