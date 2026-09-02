'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { ShoppingBag, Heart, Scale, Sparkles, Compass, Menu, X, PhoneCall } from 'lucide-react';

interface NavbarProps {
  onOpenWishlist?: () => void;
}

export function Navbar({ onOpenWishlist }: NavbarProps) {
  const { cartCount, setIsCartOpen, wishlist, compareList, setIsCompareOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08080a]/90 backdrop-blur-md border-b border-gold-500/15 transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-noir-900 via-emerald-950 to-noir-900 border-b border-gold-500/20 py-1.5 px-4 text-center text-xs text-gold-300 font-medium tracking-wide">
        <span>✨ 100% Perfumes Originales & Garantizados | Envío Gratis en compras sobre $60.000 a todo Chile 🇨🇱</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col group">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-semibold text-gold-gradient group-hover:opacity-90 transition">
              NICO PERFUME
            </span>
            <span className="text-[10px] tracking-[0.35em] text-zinc-400 uppercase font-light -mt-1">
              Haute Parfumerie
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link
              href="#catalogo"
              className="text-zinc-300 hover:text-gold-400 transition tracking-wider uppercase text-[11px]"
            >
              Catálogo
            </Link>
            <Link
              href="#recomendador"
              className="flex items-center gap-1 text-gold-400 hover:text-gold-300 transition tracking-wider uppercase text-[11px] group"
            >
              <Sparkles className="w-3 h-3 text-gold-400 group-hover:rotate-12 transition-transform" />
              <span>Fragancias Gemelas</span>
            </Link>
            <Link
              href="#decants"
              className="text-amber-400 hover:text-amber-300 transition tracking-wider uppercase text-[11px] font-semibold"
            >
              🎁 Decants
            </Link>
            <Link
              href="#mayorista"
              className="text-emerald-400 hover:text-emerald-300 transition tracking-wider uppercase text-[11px] font-semibold"
            >
              💼 Mayorista B2B
            </Link>
            <Link
              href="#clima-olfativo"
              className="text-blue-400 hover:text-blue-300 transition tracking-wider uppercase text-[11px]"
            >
              🌤️ Clima & Sprays
            </Link>
            <Link
              href="#sommelier-quiz"
              className="flex items-center gap-1 text-zinc-300 hover:text-gold-400 transition tracking-wider uppercase text-[11px]"
            >
              <Compass className="w-3 h-3 text-emerald-400" />
              <span>Quiz</span>
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Compare Button */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="relative p-2.5 rounded-full text-zinc-300 hover:text-gold-400 hover:bg-zinc-900/80 transition"
              title="Comparar fragancias"
              aria-label="Comparar fragancias"
            >
              <Scale className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-800 text-gold-400 border border-gold-500/50 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-full text-zinc-300 hover:text-gold-400 hover:bg-zinc-900/80 transition"
              title="Fragancias favoritas"
              aria-label="Fragancias favoritas"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-900 text-rose-200 border border-rose-500/50 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-gold-600 to-gold-500 text-black font-semibold text-xs tracking-wider shadow-lg shadow-gold-500/20 hover:brightness-110 active:scale-95 transition"
              aria-label="Abrir Carrito"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">BOLSA</span>
              <span className="bg-black text-gold-300 text-[11px] font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-zinc-300 hover:text-gold-400 focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 border-b border-gold-500/20 px-6 py-5 space-y-4">
          <Link
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-200 hover:text-gold-400 text-sm font-medium"
          >
            Catálogo Completo
          </Link>
          <Link
            href="#recomendador"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Fragancias Gemelas (Recomendador)</span>
          </Link>
          <Link
            href="#sommelier-quiz"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-zinc-200 hover:text-gold-400 text-sm font-medium"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Quiz Sommelier</span>
          </Link>
          <Link
            href="#bestsellers"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-200 hover:text-gold-400 text-sm font-medium"
          >
            Más Vendidos
          </Link>
          <div className="pt-2 border-t border-zinc-800">
            <a
              href="https://wa.me/56912345678?text=Hola%20Nico%20Perfume!%20Quiero%20asesoria%20para%20mi%20pedido"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contactar Sommelier por WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
