'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import {
  X,
  ShoppingBag,
  Heart,
  Scale,
  Star,
  Sparkles,
  ShieldCheck,
  Truck,
  Layers,
  MessageSquare,
  Clock,
  Wind
} from 'lucide-react';
import Image from 'next/image';

export function ProductModal() {
  const {
    quickViewPerfume,
    closeQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare
  } = useCart();

  const [quantity, setQuantity] = useState(1);

  if (!quickViewPerfume) return null;

  const p = quickViewPerfume;
  const inWishlist = isInWishlist(p.id);

  const discountPercent =
    p.originalPrice > p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    addToCart(p, quantity);
    closeQuickView();
  };

  const handleWhatsAppConsult = () => {
    const text = encodeURIComponent(
      `Hola Nico Perfume! Estoy interesado en *${p.brand} - ${p.name}* (${p.volume}ml - ${formatCLP(p.price)}). ¿Tienen stock disponible para envío inmediato?`
    );
    window.open(`https://wa.me/56912345678?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-gold-500/30 p-6 sm:p-8 shadow-2xl shadow-black">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition z-10"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Image & Badges */}
          <div className="flex flex-col">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-rose-950/90 border border-rose-500 text-rose-300 text-xs font-bold">
                  -{discountPercent}% OFF
                </span>
              )}
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-sm border border-zinc-700 text-gold-300 text-xs font-medium">
                {p.concentration}
              </span>
            </div>

            {/* Quick trust notes */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Original Sellado</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                <Truck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Despacho Express Chile</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Fragrance Pyramid */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Brand & Category */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
                  {p.brand}
                </span>
                <span className="text-xs text-zinc-400">
                  SKU: {p.sku}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-serif text-zinc-100 font-normal mt-1">
                {p.name}
              </h2>

              {/* Rating & Family */}
              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center text-gold-400">
                  <Star className="w-4 h-4 fill-gold-400 mr-1" />
                  <span className="font-semibold">{p.rating}</span>
                  <span className="text-zinc-500 ml-1">({p.reviews} reseñas)</span>
                </div>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-300 bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-800">
                  {p.family}
                </span>
                <span className="text-zinc-400">
                  {p.gender} • {p.volume}ml
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold font-serif text-zinc-100">
                  {formatCLP(p.price)}
                </span>
                {p.originalPrice > p.price && (
                  <span className="text-sm text-zinc-500 line-through">
                    {formatCLP(p.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-3 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                {p.description}
              </p>

              {/* Pirámide Olfativa (Fragrance Pyramid) */}
              <div className="mt-5 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Pirámide Olfativa
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-[11px] font-semibold text-zinc-400 w-16 shrink-0">Salida:</span>
                    <span className="text-zinc-200">{p.topNotes.join(' • ')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[11px] font-semibold text-zinc-400 w-16 shrink-0">Corazón:</span>
                    <span className="text-zinc-200">{p.heartNotes.join(' • ')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[11px] font-semibold text-zinc-400 w-16 shrink-0">Fondo:</span>
                    <span className="text-zinc-200">{p.baseNotes.join(' • ')}</span>
                  </div>
                </div>

                {/* Longevity & Sillage meters */}
                <div className="pt-2 border-t border-zinc-800 grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold-400" />
                    <span>Longevidad: <strong className="text-zinc-200">{p.longevity}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-gold-400" />
                    <span>Estela: <strong className="text-zinc-200">{p.sillage}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="mt-6 pt-4 border-t border-zinc-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-700 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-zinc-100">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800 text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:brightness-110 active:scale-95 text-black font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Agregar a Bolsa ({formatCLP(p.price * quantity)})</span>
                </button>

                {/* Wishlist Toggle */}
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className={`p-3 rounded-xl border transition ${
                    inWishlist
                      ? 'bg-rose-950 border-rose-500 text-rose-400'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-rose-400'
                  }`}
                  title="Favoritos"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>

                {/* Compare */}
                <button
                  onClick={() => {
                    addToCompare(p);
                    closeQuickView();
                  }}
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-gold-400 transition"
                  title="Comparar"
                >
                  <Scale className="w-4 h-4" />
                </button>
              </div>

              {/* Direct WhatsApp Consultation */}
              <button
                onClick={handleWhatsAppConsult}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Consultar Disponibilidad por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
