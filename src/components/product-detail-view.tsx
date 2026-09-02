'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Perfume } from '@/types/perfume';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import { getPerfumeSlug, getRelatedPerfumes } from '@/lib/perfumes';
import { ProductCard } from '@/components/product-card';
import {
  ShoppingBag,
  Heart,
  Scale,
  Star,
  ShieldCheck,
  Truck,
  Sparkles,
  Layers,
  Clock,
  Wind,
  CheckCircle2,
  Share2,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  Package,
  CreditCard,
  Building2,
  Lock,
  Tag,
  HelpCircle,
  Flame,
  Award
} from 'lucide-react';

interface ProductDetailViewProps {
  perfume: Perfume;
}

export function ProductDetailView({ perfume }: ProductDetailViewProps) {
  const { addToCart, setIsCartOpen, toggleWishlist, isInWishlist, addToCompare } = useCart();
  const inWishlist = isInWishlist(perfume.id);

  const [quantity, setQuantity] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState<'bottle' | 'decant5' | 'decant10'>('bottle');
  const [activeTab, setActiveTab] = useState<'notes' | 'performance' | 'reviews' | 'shipping'>('notes');
  const [copiedLink, setCopiedLink] = useState(false);

  const discountPercent =
    perfume.originalPrice > perfume.price
      ? Math.round(((perfume.originalPrice - perfume.price) / perfume.originalPrice) * 100)
      : 0;

  const savingsAmount = perfume.originalPrice > perfume.price ? perfume.originalPrice - perfume.price : 0;
  const relatedPerfumes = getRelatedPerfumes(perfume, 4);

  // Price calculations based on format
  const currentPrice =
    selectedFormat === 'bottle'
      ? perfume.price
      : selectedFormat === 'decant5'
      ? Math.round(perfume.price * 0.22 + 4990)
      : Math.round(perfume.price * 0.38 + 7990);

  const handleAddToCart = () => {
    addToCart(perfume, quantity);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(perfume, quantity);
    window.location.href = '/checkout';
  };

  const handleWhatsAppConsult = () => {
    const message = `Hola Nico Perfume! 👋 Estoy viendo el perfume *${perfume.brand} - ${perfume.name}* (SKU: ${perfume.sku}) por ${formatCLP(currentPrice)}. ¿Tienen stock disponible para despacho inmediato a mi comuna?`;
    window.open(`https://wa.me/56912345678?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#060609] text-zinc-100 pb-24">
      
      {/* 1. BREADCRUMBS BAR */}
      <nav aria-label="Migas de pan" className="border-b border-zinc-800/80 bg-[#0a0a0f]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-xs text-zinc-400 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-gold-300 transition flex items-center gap-1">
            Inicio
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
          <Link href="/catalogo" className="hover:text-gold-300 transition">
            Catálogo
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
          <Link href={`/catalogo?marca=${encodeURIComponent(perfume.brand)}`} className="hover:text-gold-300 transition text-zinc-300 font-medium">
            {perfume.brand}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
          <span className="text-gold-400 font-medium truncate max-w-[200px] sm:max-w-none">
            {perfume.name}
          </span>
        </div>
      </nav>

      {/* 2. MAIN HERO PRODUCT SHOWCASE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: IMAGE DISPLAY & TRUST BADGES (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-zinc-900 to-[#0c0c12] border border-gold-500/20 shadow-2xl shadow-black/80 group">
              
              <Image
                src={perfume.image}
                alt={perfume.fullName || `${perfume.brand} ${perfume.name}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Top Discount Tag */}
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                  <span className="px-3 py-1 rounded-xl bg-rose-950/90 border border-rose-500/60 text-rose-300 text-xs font-bold tracking-wider shadow-lg">
                    -{discountPercent}% DCTO
                  </span>
                  {perfume.isBestSeller && (
                    <span className="px-3 py-1 rounded-xl bg-gold-950/90 border border-gold-500/60 text-gold-300 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-lg">
                      <Flame className="w-3 h-3 text-gold-400" /> Top Ventas
                    </span>
                  )}
                </div>
              )}

              {/* Bottom Concentration Pill & Original Seal Badge */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-zinc-700 text-gold-300 text-xs font-semibold tracking-wider uppercase">
                  {perfume.concentration}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-zinc-700 text-zinc-300 text-xs font-medium">
                  {perfume.volume} ml
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Original Sellado</span>
                </span>
              </div>

              {/* Share & Wishlist Floating Buttons */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button
                  onClick={() => toggleWishlist(perfume.id)}
                  className={`p-3 rounded-2xl backdrop-blur-md border transition shadow-lg ${
                    inWishlist
                      ? 'bg-rose-950/90 border-rose-500 text-rose-400'
                      : 'bg-black/60 border-zinc-700 text-zinc-300 hover:text-rose-400 hover:bg-black/90'
                  }`}
                  title="Añadir a favoritos"
                  aria-label="Añadir a favoritos"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
                <button
                  onClick={() => addToCompare(perfume)}
                  className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-zinc-700 text-zinc-300 hover:text-gold-400 hover:bg-black/90 transition shadow-lg"
                  title="Comparar pirámide"
                  aria-label="Comparar notas"
                >
                  <Scale className="w-4 h-4" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-zinc-700 text-zinc-300 hover:text-white hover:bg-black/90 transition shadow-lg"
                  title="Copiar enlace"
                  aria-label="Compartir perfume"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {copiedLink && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 bg-black/90 border border-gold-500/50 text-gold-300 px-4 py-2.5 rounded-2xl text-center text-xs font-medium shadow-2xl animate-fadeIn">
                  ✓ Enlace copiado al portapapeles
                </div>
              )}
            </div>

            {/* Quality & Batch Code Assurance */}
            <div className="p-4 rounded-2xl bg-[#0b0b10] border border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-gold-400" /> Garantía de Autenticidad
                </span>
                <span className="text-emerald-400 font-mono font-medium text-[11px] bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  Batch Code Verificado
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                Producto 100% original en su caja sellada con celofán de origen. Código de lote verificable en bases de datos internacionales de cosmética.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: PRODUCT INFO, PRICE, BUY ACTIONS (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Brand & Classification */}
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Link
                  href={`/catalogo?marca=${encodeURIComponent(perfume.brand)}`}
                  className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400 hover:text-gold-300 transition"
                >
                  CASA OLFATIVA: {perfume.brand}
                </Link>
                <span className="text-xs font-mono text-zinc-400">
                  SKU: {perfume.sku} {perfume.ean ? `• EAN: ${perfume.ean}` : ''}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl text-zinc-100 font-light leading-tight">
                {perfume.name}
              </h1>

              {/* Rating & Review Counter */}
              <div className="flex items-center gap-3 pt-1 text-xs">
                <div className="flex items-center text-gold-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(perfume.rating)
                          ? 'fill-gold-400 text-gold-400'
                          : 'fill-zinc-700 text-zinc-700'
                      }`}
                    />
                  ))}
                  <span className="font-bold ml-1.5 text-zinc-100">{perfume.rating}</span>
                </div>
                <span className="text-zinc-600">•</span>
                <a href="#reviews" className="text-zinc-400 hover:text-gold-300 underline underline-offset-4 transition">
                  {perfume.reviews} opiniones verificadas
                </a>
                <span className="text-zinc-600">•</span>
                <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-medium">
                  {perfume.gender}
                </span>
                <span className="text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[11px]">
                  {perfume.family}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0b0b12] to-[#0f0f18] border border-gold-500/20 shadow-xl space-y-3">
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="font-serif text-3xl sm:text-4xl font-semibold text-zinc-100 tracking-tight">
                  {formatCLP(currentPrice)}
                </span>
                {perfume.originalPrice > currentPrice && (
                  <span className="text-base sm:text-lg text-zinc-400 line-through">
                    {formatCLP(perfume.originalPrice)}
                  </span>
                )}
                {savingsAmount > 0 && selectedFormat === 'bottle' && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                    Ahorras {formatCLP(savingsAmount)} ({discountPercent}% OFF)
                  </span>
                )}
              </div>

              {/* Wholesale banner highlight */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-gold-400" />
                  ¿Compras por mayor?
                </span>
                <Link href="/mayorista" className="text-gold-400 hover:text-gold-300 font-medium underline underline-offset-4">
                  Desde {formatCLP(perfume.wholesalePrice)} (+6 unids) →
                </Link>
              </div>
            </div>

            {/* Format Selector: Full Bottle vs Decants */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Selecciona Formato & Presentación:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedFormat('bottle')}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    selectedFormat === 'bottle'
                      ? 'bg-gold-950/40 border-gold-500 text-zinc-100 shadow-md shadow-gold-950/50'
                      : 'bg-[#0a0a0f] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-xs text-zinc-100">Botella Completa</span>
                    <span className="text-[10px] text-gold-400 font-mono font-bold">{perfume.volume}ml</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Caja sellada de fábrica</p>
                  <p className="text-xs font-bold text-gold-300 mt-2">{formatCLP(perfume.price)}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormat('decant10')}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    selectedFormat === 'decant10'
                      ? 'bg-gold-950/40 border-gold-500 text-zinc-100 shadow-md shadow-gold-950/50'
                      : 'bg-[#0a0a0f] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-xs text-zinc-100">Decant Premium</span>
                    <span className="text-[10px] text-zinc-300 font-mono">10ml (~120 sprays)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Atomizador de vidrio</p>
                  <p className="text-xs font-bold text-gold-300 mt-2">{formatCLP(Math.round(perfume.price * 0.38 + 7990))}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormat('decant5')}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    selectedFormat === 'decant5'
                      ? 'bg-gold-950/40 border-gold-500 text-zinc-100 shadow-md shadow-gold-950/50'
                      : 'bg-[#0a0a0f] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-xs text-zinc-100">Muestra / Decant</span>
                    <span className="text-[10px] text-zinc-300 font-mono">5ml (~60 sprays)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Ideal para probar</p>
                  <p className="text-xs font-bold text-gold-300 mt-2">{formatCLP(Math.round(perfume.price * 0.22 + 4990))}</p>
                </button>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center rounded-2xl bg-[#0c0c12] border border-zinc-800 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-zinc-300 hover:text-white rounded-xl hover:bg-zinc-800 text-base font-bold transition"
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono text-sm font-bold text-zinc-100">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-zinc-300 hover:text-white rounded-xl hover:bg-zinc-800 text-base font-bold transition"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>

                {/* Main Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:brightness-110 active:scale-[0.98] text-black font-semibold text-xs tracking-[0.2em] uppercase transition shadow-xl shadow-gold-500/20 flex items-center justify-center gap-2.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Agregar a la Bolsa ({formatCLP(currentPrice * quantity)})</span>
                </button>
              </div>

              {/* Direct Buy Now & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 rounded-2xl bg-zinc-100 hover:bg-white text-black font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 active:scale-95 shadow-md"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Comprar Ahora (Checkout)</span>
                </button>

                <button
                  onClick={handleWhatsAppConsult}
                  className="py-3.5 px-4 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Pedir Asesoría por WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Quick Guarantees Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-zinc-800/80 text-xs text-zinc-400">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#09090e] border border-zinc-850">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-200">Envíos a Todo Chile</p>
                  <p className="text-[11px] text-zinc-400">Starken y Blue Express. Gratis desde $60.000.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#09090e] border border-zinc-850">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-200">Garantía Legal SERNAC</p>
                  <p className="text-[11px] text-zinc-400">6 meses de garantía y cambios garantizados.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 3. INTERACTIVE PRODUCT TABS (Olfactory Pyramid, Performance, Reviews, Shipping) */}
        <div className="mt-16 pt-10 border-t border-zinc-800">
          {/* Tab buttons */}
          <div className="flex items-center gap-2 sm:gap-4 border-b border-zinc-800 pb-4 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 ${
                activeTab === 'notes'
                  ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pirámide Olfativa</span>
            </button>

            <button
              onClick={() => setActiveTab('performance')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 ${
                activeTab === 'performance'
                  ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Rendimiento & Estela</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              id="reviews"
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Reseñas ({perfume.reviews})</span>
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 ${
                activeTab === 'shipping'
                  ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Despacho & Garantía</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            
            {/* TAB 1: OLFACTORY PYRAMID */}
            {activeTab === 'notes' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Top Notes */}
                  <div className="p-6 rounded-3xl bg-[#09090f] border border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">1. Salida (Top Notes)</span>
                      <span className="text-[10px] text-zinc-400">0 - 20 mins</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-light">La primera impresión al aplicar el perfume:</p>
                    <div className="flex flex-wrap gap-2">
                      {perfume.topNotes.map((note, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 font-medium">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Heart Notes */}
                  <div className="p-6 rounded-3xl bg-[#09090f] border border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">2. Corazón (Heart Notes)</span>
                      <span className="text-[10px] text-zinc-400">20 mins - 4 hrs</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-light">El carácter central y firma olfativa:</p>
                    <div className="flex flex-wrap gap-2">
                      {perfume.heartNotes.map((note, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 font-medium">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Base Notes */}
                  <div className="p-6 rounded-3xl bg-[#09090f] border border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">3. Fondo (Base Notes)</span>
                      <span className="text-[10px] text-zinc-400">4 - 12+ hrs</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-light">La base profunda que fija en la piel y ropa:</p>
                    <div className="flex flex-wrap gap-2">
                      {perfume.baseNotes.map((note, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 font-medium">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Editorial Description */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0b12] border border-zinc-800/80 space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-400" /> Reseña Editorial del Sommelier
                  </h3>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">
                    {perfume.description}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: PERFORMANCE & OCCASIONS */}
            {activeTab === 'performance' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="p-6 rounded-3xl bg-[#09090f] border border-zinc-800 space-y-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Métricas de Fijación & Estela
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-zinc-400">Duración en Piel (Longevidad)</span>
                        <span className="font-bold text-zinc-100">{perfume.longevity}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                        <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full w-[90%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-zinc-400">Proyección y Ráfaga (Sillage)</span>
                        <span className="font-bold text-zinc-100">{perfume.sillage}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                        <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full w-[85%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#09090f] border border-zinc-800 space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Vibra & Ocasiones Recomendadas
                  </h3>

                  <div>
                    <span className="text-xs text-zinc-400 block mb-2 font-medium">Ocasiones de Uso:</span>
                    <div className="flex flex-wrap gap-2">
                      {perfume.occasions.map((occ, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-xl bg-gold-950/40 border border-gold-500/30 text-gold-300 text-xs">
                          {occ}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-xs text-zinc-400 block mb-2 font-medium">Estilo y Sensación:</span>
                    <p className="text-xs text-zinc-300 italic bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                      "{perfume.vibe}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-[#09090f] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-100">Matías R. (Las Condes)</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Comprador Verificado</span>
                    </div>
                    <div className="flex text-gold-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold-400" />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      "Increíble duración. Me lo apliqué a las 8 am y a las 8 pm aún se sentía en piel y ropa. 100% original, el despacho por Starken llegó en 24 horas."
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#09090f] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-100">Camila V. (Viña del Mar)</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Compradora Verificada</span>
                    </div>
                    <div className="flex text-gold-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold-400" />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      "Excelente aroma y presentación. La atención por WhatsApp fue muy amable y me ayudaron a elegir según mis gustos. Volveré a comprar sin duda."
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#09090f] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-100">Sebastián P. (Concepción)</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Comprador Verificado</span>
                    </div>
                    <div className="flex text-gold-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold-400" />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      "Proyección monstruosa, genera cumplidos de inmediato. Comprobé el batch code en CheckFresh y coincidió todo perfecto."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SHIPPING & WARRANTY */}
            {activeTab === 'shipping' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeIn text-xs text-zinc-300 leading-relaxed">
                <div className="p-6 rounded-3xl bg-[#09090f] border border-zinc-800 space-y-3">
                  <h4 className="font-semibold text-gold-400 uppercase tracking-wider flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Tiempos y Métodos de Entrega
                  </h4>
                  <ul className="space-y-2 text-zinc-400">
                    <li>• <strong>Región Metropolitana:</strong> Entrega en 24 a 48 horas hábiles vía Blue Express o Courier Prioritario.</li>
                    <li>• <strong>Regiones (Norte y Sur):</strong> Entrega en 2 a 4 días hábiles vía Starken a domicilio o sucursal.</li>
                    <li>• <strong>Envío Gratis:</strong> En compras superiores a $60.000 a todo el territorio continental de Chile.</li>
                  </ul>
                </div>

                <div className="p-6 rounded-3xl bg-[#09090f] border border-zinc-800 space-y-3">
                  <h4 className="font-semibold text-gold-400 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Garantía y Devoluciones
                  </h4>
                  <ul className="space-y-2 text-zinc-400">
                    <li>• <strong>Garantía de Originalidad:</strong> Si no es 100% original sellado, te devolvemos el 100% de tu dinero.</li>
                    <li>• <strong>Ley SERNAC:</strong> Cuentas con 6 meses de garantía legal ante cualquier defecto o falla de fabricación.</li>
                    <li>• <strong>Atención al Cliente:</strong> Soporte directo los 7 días de la semana por WhatsApp.</li>
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* 4. RELATED PERFUMES CAROUSEL */}
        {relatedPerfumes.length > 0 && (
          <div className="mt-16 pt-12 border-t border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-gold-400 text-xs font-semibold uppercase tracking-wider">
                  Recomendados para ti
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-zinc-100 font-light mt-1">
                  Otras Fragancias que te Encantarán
                </h2>
              </div>
              <Link
                href={`/catalogo?marca=${encodeURIComponent(perfume.brand)}`}
                className="text-xs text-zinc-400 hover:text-gold-300 uppercase tracking-wider flex items-center gap-1.5 transition"
              >
                <span>Ver más de {perfume.brand}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedPerfumes.map(rel => (
                <ProductCard key={rel.id} perfume={rel} />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* 5. STICKY MOBILE ADD-TO-CART BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#08080d]/95 backdrop-blur-md border-t border-zinc-800 p-3 sm:hidden shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-gold-400 font-bold uppercase truncate">{perfume.brand}</p>
          <p className="text-xs font-semibold text-zinc-100 truncate">{perfume.name}</p>
          <p className="text-xs font-bold text-zinc-200">{formatCLP(currentPrice)}</p>
        </div>

        <button
          onClick={handleAddToCart}
          className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 active:scale-95 text-black font-semibold text-xs tracking-wider uppercase transition shrink-0 flex items-center gap-1.5 shadow-lg shadow-gold-500/20"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Agregar</span>
        </button>
      </div>

    </div>
  );
}
