'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { ShoppingBag, Heart, Scale, Search, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenWishlist?: () => void;
}

export function Navbar({ onOpenWishlist }: NavbarProps) {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, wishlist, compareList, setIsCompareOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Clean, Simple, 100% Spanish Navigation Links
  const navLinks = [
    { label: 'Catálogo', href: '/catalogo' },
    { label: 'Perfumes Similares', href: '/fragancias-gemelas' },
    { label: 'Test de Perfume', href: '/sommelier-quiz' },
    { label: 'Mayorista', href: '/mayorista' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08080c]/95 backdrop-blur-md border-b border-zinc-800 transition-all">
      {/* Top Banner */}
      <div className="bg-[#0f0f14] border-b border-zinc-800/80 py-1.5 px-4 text-center text-xs text-zinc-300 font-normal">
        <span>Perfumería 100% Original • Envíos a todo Chile por Starken y Blue Express</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
          
          {/* Brand Identity / Logo */}
          <Link href="/" className="flex flex-col shrink-0 py-1 group">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.15em] font-medium text-zinc-100 group-hover:text-gold-300 transition-colors">
              NICO PERFUME
            </span>
            <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-sans -mt-0.5">
              Perfumes Originales
            </span>
          </Link>

          {/* Desktop Navigation Links (Clean, spaced, 0 clutter) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-wider transition-colors py-1 relative ${
                    isActive
                      ? 'text-gold-300 font-semibold'
                      : 'text-zinc-300 hover:text-white font-medium'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Tools & Shopping Bag */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search */}
            <Link
              href="/catalogo"
              className="p-2 sm:p-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              title="Buscar perfumes"
              aria-label="Buscar perfumes"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Compare (Hidden on small mobile) */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition hidden sm:flex"
              title="Comparar perfumes"
              aria-label="Comparar perfumes"
            >
              <Scale className="w-4 h-4" />
              {compareList.length > 0 && (
                <span className="absolute top-1 right-1 bg-zinc-800 text-gold-300 border border-zinc-700 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist (Hidden on small mobile) */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 sm:p-2.5 rounded-xl text-zinc-300 hover:text-rose-400 hover:bg-zinc-800 transition hidden sm:flex"
              title="Perfumes favoritos"
              aria-label="Perfumes favoritos"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-zinc-100 hover:bg-gold-400 text-black font-semibold text-xs tracking-wider uppercase transition shadow-md"
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-black" />
              <span className="hidden xs:inline">Carrito</span>
              <span className="bg-black text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition md:hidden"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0c12] border-b border-zinc-800 px-5 py-5 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-1 gap-2">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider transition ${
                    isActive
                      ? 'bg-zinc-800 text-gold-300 font-semibold'
                      : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-around text-xs text-zinc-300">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCompareOpen(true);
              }}
              className="flex items-center gap-1.5 hover:text-white"
            >
              <Scale className="w-4 h-4 text-gold-400" />
              <span>Comparar ({compareList.length})</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWishlist?.();
              }}
              className="flex items-center gap-1.5 hover:text-rose-400"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Favoritos ({wishlist.length})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
