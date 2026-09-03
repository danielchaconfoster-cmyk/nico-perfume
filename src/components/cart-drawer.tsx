'use client';

import React from 'react';
import { useCart } from '@/lib/cart-context';
import { formatCLP, generateWhatsAppOrderUrl } from '@/lib/utils';
import {
  X,
  ShoppingBag,
  Trash2,
  Truck,
  MessageCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    freeShippingProgress,
    freeShippingRemaining,
    shippingInfo
  } = useCart();

  if (!isCartOpen) return null;

  const totalItemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const handleWhatsAppCheckout = () => {
    const items = cart.map(item => ({
      name: item.formatType === 'decant' ? `${item.perfume.name} [Decant ${item.decantSize || '5ml'}]` : item.perfume.name,
      brand: item.perfume.brand,
      quantity: item.quantity,
      price: item.perfume.price,
      sku: item.perfume.sku
    }));

    const url = generateWhatsAppOrderUrl(
      items,
      cartTotal,
      shippingInfo.name || undefined,
      shippingInfo.address || undefined,
      shippingInfo.comuna || undefined
    );
    window.open(url, '_blank');
  };

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        {/* Generous Width Drawer (up to 560px on desktop) */}
        <div className="w-screen max-w-md sm:max-w-lg lg:max-w-xl bg-[#09090d] border-l border-zinc-800 shadow-2xl flex flex-col h-full text-zinc-100">
          
          {/* 1. Header (Compact & Elegant) */}
          <div className="px-6 py-4 border-b border-zinc-850 bg-[#060609] shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gold-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-serif font-normal tracking-wide text-zinc-100">
                  Bolsa de Fragancias
                </h2>
                <p className="text-[11px] text-zinc-400 font-sans">
                  {totalItemCount} {totalItemCount === 1 ? 'producto' : 'productos'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition"
              aria-label="Cerrar bolsa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Free Shipping Micro-Bar */}
          {cart.length > 0 && (
            <div className="px-6 py-2 bg-[#0c0c12] border-b border-zinc-850 shrink-0">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {freeShippingRemaining === 0 ? (
                    <span className="text-emerald-400 font-medium">¡Despacho Gratis a todo Chile incluido!</span>
                  ) : (
                    <span>
                      Faltan <strong className="text-gold-300 font-serif font-normal">{formatCLP(freeShippingRemaining)}</strong> para envío gratis
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-500 to-amber-400 transition-all duration-300 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* 3. Product List Area (MAXIMIZED HEIGHT: ~80% of drawer) */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-3.5 min-h-0">
            {cart.length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-base font-serif text-zinc-200">Tu bolsa está vacía</h3>
                <p className="text-xs text-zinc-400 mt-1.5 max-w-xs mx-auto font-light leading-relaxed">
                  Explora extractos árabes de alta fijación, kits de decants o utiliza el recomendador interactivo.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center mt-5">
                  <Link
                    href="/catalogo"
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-gold-400 text-black text-xs font-semibold uppercase tracking-wider transition"
                  >
                    Ver Catálogo
                  </Link>
                  <Link
                    href="/fragancias-gemelas"
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium uppercase tracking-wider transition"
                  >
                    Fragancias Gemelas
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div
                    key={item.perfume.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[#0c0c12] border border-zinc-850 hover:border-zinc-750 transition flex gap-3.5 sm:gap-4 items-center group shadow-sm"
                  >
                    {/* Bottle Thumbnail */}
                    <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                      <Image
                        src={item.perfume.image}
                        alt={item.perfume.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.formatType === 'decant' && (
                        <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/85 border border-zinc-700 text-gold-300 text-[7.5px] font-bold uppercase tracking-wider">
                          {item.decantSize || '5ml'}
                        </span>
                      )}
                    </div>

                    {/* Info & Quantity / Price */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                      <div>
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="text-[9.5px] uppercase font-semibold tracking-[0.2em] text-gold-400 truncate">
                            {item.perfume.brand}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.perfume.id)}
                            className="p-1 text-zinc-500 hover:text-rose-400 transition"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="text-xs sm:text-sm font-medium text-zinc-100 line-clamp-1 mt-0.5">
                          {item.perfume.name}
                        </h4>

                        <p className="text-[10.5px] text-zinc-400 mt-0.5">
                          {item.perfume.concentration} • {item.formatType === 'decant' ? `Decant ${item.decantSize || '5ml'}` : `${item.perfume.volume}ml`}
                        </p>
                      </div>

                      {/* Stepper & Total for Item */}
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-900/80 mt-2">
                        <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.perfume.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded text-xs font-bold transition hover:bg-zinc-800"
                            aria-label="Disminuir cantidad"
                          >
                            -
                          </button>
                          <span className="w-7 text-center text-xs font-semibold text-zinc-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.perfume.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded text-xs font-bold transition hover:bg-zinc-800"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs sm:text-sm font-serif font-medium text-zinc-100">
                            {formatCLP(item.perfume.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Compact, High-Conversion Footer (~130px height, NEVER crushed) */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-zinc-850 bg-[#060609] shrink-0 space-y-3">
              {/* Subtotal Line */}
              <div className="flex justify-between items-baseline text-sm sm:text-base">
                <span className="font-serif text-zinc-300">Total Estimado</span>
                <span className="font-serif text-lg sm:text-xl font-normal text-gold-300">
                  {formatCLP(cartTotal)}
                </span>
              </div>

              <p className="text-[10.5px] text-zinc-400 font-light">
                Despacho y cupones de descuento aplicables en el siguiente paso.
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 px-4 rounded-xl bg-zinc-100 hover:bg-gold-400 text-black font-semibold text-xs tracking-[0.15em] uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-[0.99]"
                >
                  <span>Ir al Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-emerald-400 border border-emerald-500/30 font-medium text-xs tracking-wider uppercase transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Pedir por WhatsApp</span>
                </button>
              </div>

              {/* Trust Subtext */}
              <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-gold-400" /> Webpay Seguro 256-bit
                </span>
                <span>•</span>
                <span>Batch Code Verificado</span>
                <span>•</span>
                <span>Starken / Blue Express</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
