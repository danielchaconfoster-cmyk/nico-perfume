import React from 'react';
import Link from 'next/link';
import { Compass, ShoppingBag, Sparkles, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#08080a] text-zinc-100 flex items-center justify-center p-6 selection:bg-gold-500 selection:text-black">
      <div className="max-w-lg w-full text-center space-y-8">
        
        {/* Luxury Icon & 404 Badge */}
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-3xl bg-zinc-900/90 border border-gold-500/30 flex items-center justify-center mx-auto shadow-2xl shadow-gold-500/10">
            <Compass className="w-12 h-12 text-gold-400 animate-pulse" />
          </div>
          <span className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-gold-500 text-black font-mono font-bold text-xs tracking-wider shadow-lg">
            404
          </span>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl text-zinc-100 font-light tracking-wide">
            Fragancia No Encontrada
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-md mx-auto">
            La nota olfativa que buscas parece haberse evaporado o la página ha cambiado de locación. Explora nuestro catálogo de más de 1.300 creaciones originales o déjate guiar por nuestro Sommelier interactivo.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-zinc-400" />
            <span>Inicio</span>
          </Link>

          <Link
            href="/catalogo"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ver Catálogo (1.371)</span>
          </Link>

          <Link
            href="/sommelier-quiz"
            className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-gold-300 border border-gold-500/30 text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Test Sommelier</span>
          </Link>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-zinc-850 text-xs text-zinc-500 flex items-center justify-center gap-2">
          <span>Nico Perfume</span>
          <span>•</span>
          <span>Perfumería 100% Original Sellada</span>
        </div>

      </div>
    </main>
  );
}
