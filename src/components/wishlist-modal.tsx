'use client';

import React from 'react';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import { allPerfumes } from '@/lib/perfumes';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistModal({ isOpen, onClose }: WishlistModalProps) {
  const { wishlist, toggleWishlist, addToCart, openQuickView } = useCart();

  if (!isOpen) return null;

  const favoritePerfumes = allPerfumes.filter(p => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#0c0c10] border border-gold-500/30 p-6 sm:p-8 shadow-2xl shadow-black">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-current" />
            <h2 className="font-serif text-xl sm:text-2xl text-zinc-100 font-light">
              Tus Fragancias Favoritas ({favoritePerfumes.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition"
            aria-label="Cerrar favoritos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {favoritePerfumes.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-300 font-medium">Aún no has guardado favoritos</p>
            <p className="text-xs text-zinc-400 mt-1">
              Guarda tus perfumes soñados haciendo clic en el corazón de cualquier tarjeta.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4 divide-y divide-zinc-850">
            {favoritePerfumes.map(p => (
              <div key={p.id} className="pt-4 first:pt-0 flex items-center gap-4">
                <div
                  onClick={() => {
                    openQuickView(p);
                    onClose();
                  }}
                  className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0 cursor-pointer"
                >
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider">
                    {p.brand}
                  </span>
                  <h4
                    onClick={() => {
                      openQuickView(p);
                      onClose();
                    }}
                    className="text-xs font-medium text-zinc-100 truncate cursor-pointer hover:text-gold-300 transition"
                  >
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400">{p.family} • {p.volume}ml</p>
                  <p className="text-sm font-bold text-zinc-100 font-serif mt-0.5">{formatCLP(p.price)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      addToCart(p);
                      onClose();
                    }}
                    className="py-2 px-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Comprar</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 transition"
                    title="Eliminar de favoritos"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
