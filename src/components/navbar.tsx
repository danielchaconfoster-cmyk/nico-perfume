'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { ShoppingBag, Heart, Scale, Search, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenWishlist?: () => void;
}

export function Navbar({ onOpenWishlist }: NavbarProps) {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, wishlist, compareList, setIsCompareOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const leftLinks = [
    { label: 'Catálogo', href: '/catalogo' },
    { label: 'Fragancias Gemelas', href: '/fragancias-gemelas' },
    { label: 'Discovery Sets', href: '/decants' },
  ];

  const rightLinks = [
    { label: 'Asesor Clima', href: '/clima-olfativo' },
    { label: 'Sommelier Quiz', href: '/sommelier-quiz' },
    { label: 'Mayorista B2B', href: '/mayorista' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#060608]/95 backdrop-blur-xl border-b border-zinc-900 transition-all">
      {/* Top Ribbon */}
      <div className="bg-[#09090d] border-b border-zinc-900/80 py-1.5 px-4 text-center text-[10px] sm:text-[11px] text-zinc-400 font-light tracking-[0.25em] uppercase">
        <span>Alta Perfumería de Autor • Despacho Asegurado a Todo Chile</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-12 items-center h-20">
          
          {/* Left Navigation (Desktop - 4 cols) */}
          <nav className="hidden lg:flex items-center gap-6 lg:col-span-4">
            {leftLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] tracking-[0.2em] uppercase transition-all duration-200 py-1 relative ${
                    isActive
                      ? 'text-gold-300 font-medium'
                      : 'text-zinc-400 hover:text-zinc-100 font-normal'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gold-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Center Brand Identity / Logo (Desktop - 4 cols, Mobile - col 1) */}
          <div className="lg:col-span-4 flex lg:justify-center items-center">
            <Link href="/" className="flex flex-col items-start lg:items-center group py-2">
              <span className="font-serif text-xl sm:text-2xl tracking-[0.3em] font-light text-zinc-100 group-hover:text-gold-300 transition-colors duration-300">
                NICO PERFUME
              </span>
              <span className="text-[9px] tracking-[0.45em] text-zinc-400 uppercase font-sans font-light -mt-0.5">
                Maison de Haute Parfumerie
              </span>
            </Link>
          </div>

          {/* Right Navigation & Tools (Desktop - 4 cols, Mobile - col 2) */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 lg:col-span-4">
            
            {/* Additional Desktop Links */}
            <nav className="hidden xl:flex items-center gap-5 mr-2">
              {rightLinks.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[11px] tracking-[0.18em] uppercase transition-all duration-200 py-1 relative ${
                      isActive
                        ? 'text-gold-300 font-medium'
                        : 'text-zinc-400 hover:text-zinc-100 font-normal'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gold-400" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Search Quick Jump */}
            <Link
              href="/catalogo"
              className="p-2.5 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition"
              title="Buscar fragancias"
              aria-label="Buscar fragancias"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Compare Button */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="relative p-2.5 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition hidden sm:flex"
              title="Comparar notas"
              aria-label="Comparar fragancias"
            >
              <Scale className="w-4 h-4" />
              {compareList.length > 0 && (
                <span className="absolute top-1 right-1 bg-zinc-800 text-gold-300 border border-zinc-700 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-full text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition hidden sm:flex"
              title="Fragancias favoritas"
              aria-label="Fragancias favoritas"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag CTA Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-100 hover:bg-gold-400 text-black font-semibold text-xs tracking-wider uppercase transition shadow-md group"
              aria-label="Abrir bolsa de compra"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-black" />
              <span className="hidden sm:inline">Bolsa</span>
              <span className="bg-black text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition lg:hidden"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0e] border-b border-zinc-850 px-6 py-6 space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 gap-2.5">
            {[...leftLinks, ...rightLinks].map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl text-xs uppercase tracking-[0.18em] transition ${
                    isActive
                      ? 'bg-zinc-900 text-gold-300 font-semibold border border-zinc-800'
                      : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-zinc-900 flex items-center justify-around text-xs text-zinc-400">
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
