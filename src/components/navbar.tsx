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

  const navLinks = [
    { label: 'Colección', href: '/catalogo' },
    { label: 'Fragancias Gemelas', href: '/fragancias-gemelas' },
    { label: 'Discovery Sets', href: '/decants' },
    { label: 'Asesor de Clima', href: '/clima-olfativo' },
    { label: 'Sommelier Quiz', href: '/sommelier-quiz' },
    { label: 'Venta Mayorista', href: '/mayorista' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050507]/95 backdrop-blur-xl border-b border-zinc-900 transition-all">
      {/* Top Editorial Ribbon */}
      <div className="bg-[#09090d] border-b border-zinc-900/80 py-1.5 px-4 text-center text-[11px] text-zinc-400 font-light tracking-[0.25em] uppercase">
        <span>Alta Perfumería de Autor • Despacho Asegurado a Todo Chile</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity / Logo */}
          <Link href="/" className="flex flex-col group py-2">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.3em] font-light text-zinc-100 group-hover:text-gold-300 transition-colors duration-300">
              NICO PERFUME
            </span>
            <span className="text-[9px] tracking-[0.45em] text-zinc-300 uppercase font-sans font-light -mt-0.5">
              Maison de Haute Parfumerie
            </span>
          </Link>

          {/* Desktop Navigation Links (Minimalist & Clean) */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map(link => {
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
                    <span className="absolute bottom-0 inset-x-0 h-[1px] bg-gold-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Luxury Actions: Search, Compare, Wishlist & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Quick Jump */}
            <Link
              href="/catalogo"
              className="p-2.5 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 transition"
              title="Buscar fragancias"
              aria-label="Buscar fragancias"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Compare Button */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="relative p-2.5 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 transition"
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
              className="relative p-2.5 rounded-full text-zinc-400 hover:text-rose-400 hover:bg-zinc-900/60 transition"
              title="Fragancias favoritas"
              aria-label="Fragancias favoritas"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-950 text-rose-300 border border-rose-800 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button (Editorial Haute Parfumerie Bag) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-100 hover:bg-gold-400 text-black font-sans font-medium text-[11px] tracking-[0.18em] uppercase transition-all duration-300 shadow-sm"
              aria-label="Abrir Carrito"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bolsa</span>
              <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden text-zinc-400 hover:text-zinc-100 focus:outline-none ml-1"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Editorial Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#07070a] border-b border-zinc-900 px-6 py-6 space-y-4 animate-fadeIn">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-xs uppercase tracking-[0.2em] text-zinc-300 hover:text-gold-300 border-b border-zinc-900/60"
            >
              <span>{link.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600" />
            </Link>
          ))}
          <div className="pt-2">
            <a
              href="https://wa.me/56912345678"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 text-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs tracking-[0.15em] uppercase font-medium hover:bg-zinc-800 transition"
            >
              Asesoría Privada por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
