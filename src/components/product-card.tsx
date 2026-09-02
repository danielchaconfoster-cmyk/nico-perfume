'use client';

import React from 'react';
import { Perfume } from '@/types/perfume';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import { Heart, Scale, ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  perfume: Perfume;
}

export function ProductCard({ perfume }: ProductCardProps) {
  const { addToCart, openQuickView, toggleWishlist, isInWishlist, addToCompare } = useCart();
  const inWishlist = isInWishlist(perfume.id);

  const discountPercent = perfume.originalPrice > perfume.price
    ? Math.round(((perfume.originalPrice - perfume.price) / perfume.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-gold-500/40 p-4 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1">
      {/* Top Image Container */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-950/80 mb-3.5 border border-zinc-850">
        <Image
          src={perfume.image}
          alt={perfume.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-rose-950/90 border border-rose-500/40 text-rose-300 text-[10px] font-bold tracking-wider">
            -{discountPercent}%
          </span>
        )}

        {/* Concentration Pill */}
        <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-zinc-700 text-zinc-300 text-[9px] font-semibold uppercase tracking-wider">
          {perfume.concentration}
        </span>

        {/* Quick Action Floating Icons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => toggleWishlist(perfume.id)}
            className={`p-2 rounded-full backdrop-blur-md border transition ${
              inWishlist
                ? 'bg-rose-950/90 border-rose-500 text-rose-400'
                : 'bg-black/60 border-zinc-700 text-zinc-300 hover:text-rose-400 hover:bg-black/90'
            }`}
            title="Añadir a favoritos"
            aria-label="Añadir a favoritos"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
          </button>
          <button
            onClick={() => addToCompare(perfume)}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-zinc-700 text-zinc-300 hover:text-gold-400 hover:bg-black/90 transition"
            title="Comparar notas"
            aria-label="Comparar notas"
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openQuickView(perfume)}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-zinc-700 text-zinc-300 hover:text-gold-400 hover:bg-black/90 transition"
            title="Vista rápida"
            aria-label="Vista rápida"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Gender */}
          <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
            <span className="font-bold text-gold-400 uppercase tracking-wider truncate">
              {perfume.brand}
            </span>
            <span className="text-zinc-400 font-light text-[10px] shrink-0">
              {perfume.gender} • {perfume.volume}ml
            </span>
          </div>

          {/* Perfume Name */}
          <h3
            onClick={() => openQuickView(perfume)}
            className="text-sm font-medium text-zinc-100 group-hover:text-gold-300 transition line-clamp-2 cursor-pointer leading-snug"
          >
            {perfume.name}
          </h3>

          {/* Olfactory Family Pill */}
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-zinc-950 text-[10px] text-zinc-300 border border-zinc-800">
              {perfume.family}
            </span>
            <div className="flex items-center text-[11px] text-gold-400/90 ml-auto">
              <Star className="w-3 h-3 fill-gold-400 text-gold-400 mr-0.5" />
              <span>{perfume.rating}</span>
            </div>
          </div>

          {/* Top Notes Preview */}
          <p className="text-[11px] text-zinc-400 mt-2 line-clamp-1 italic font-light">
            {perfume.topNotes.join(', ')}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-base sm:text-lg font-bold text-zinc-100 font-serif tracking-tight">
                {formatCLP(perfume.price)}
              </span>
              {perfume.originalPrice > perfume.price && (
                <span className="block text-[11px] text-zinc-400 line-through">
                  {formatCLP(perfume.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-500/20 px-1.5 py-0.5 rounded">
              En Stock
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(perfume)}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-750 hover:from-gold-600 hover:to-gold-500 hover:text-black text-zinc-200 border border-zinc-700 hover:border-gold-400 text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 shadow"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Agregar a Bolsa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
