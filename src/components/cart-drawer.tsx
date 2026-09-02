'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { formatCLP, generateWhatsAppOrderUrl } from '@/lib/utils';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Truck,
  Sparkles,
  Tag,
  MessageCircle,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    freeShippingProgress,
    freeShippingRemaining,
    setIsCheckoutOpen
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const code = couponCode.trim().toUpperCase();
    if (code === 'NICOPRO10' || code === 'PERFUME10') {
      const discount = Math.round(cartTotal * 0.10);
      setDiscountAmount(discount);
      setCouponSuccess('¡Cupón del 10% de descuento aplicado!');
    } else if (code === 'ENVIOFREE') {
      setCouponSuccess('¡Cupón de Envío Bonificado activo!');
    } else {
      setCouponError('Código de cupón no válido');
    }
  };

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const handleWhatsAppCheckout = () => {
    const items = cart.map(item => ({
      name: item.perfume.name,
      brand: item.perfume.brand,
      quantity: item.quantity,
      price: item.perfume.price,
      sku: item.perfume.sku
    }));

    const url = generateWhatsAppOrderUrl(items, finalTotal);
    window.open(url, '_blank');
  };

  const handleOnlineCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0c0c10] border-l border-gold-500/20 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <h2 className="text-base font-serif font-medium text-zinc-100">
                Tu Bolsa de Fragancias ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              aria-label="Cerrar bolsa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-6 py-3.5 bg-zinc-950 border-b border-zinc-850">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Truck className="w-4 h-4 text-emerald-400" />
                {freeShippingRemaining === 0 ? (
                  <span className="text-emerald-400 font-semibold">¡Felicidades! Tienes Envío Gratis 🇨🇱</span>
                ) : (
                  <span>
                    Te faltan <strong className="text-gold-300">{formatCLP(freeShippingRemaining)}</strong> para envío gratis
                  </span>
                )}
              </span>
              <span className="text-[10px] text-zinc-400 font-bold">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-zinc-900">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-300 font-medium">Tu bolsa está vacía</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                  Agrega fragancias exclusivas desde nuestro catálogo o recomendador gemelo.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-gold-500 text-black text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition"
                >
                  Explorar Perfumes
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.perfume.id} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                    <Image
                      src={item.perfume.image}
                      alt={item.perfume.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] uppercase font-bold text-gold-400 truncate">
                          {item.perfume.brand}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.perfume.id)}
                          className="text-zinc-500 hover:text-rose-400 transition p-1 -mr-1"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-medium text-zinc-200 line-clamp-1">
                        {item.perfume.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {item.perfume.concentration} • {item.perfume.volume}ml
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-lg bg-zinc-950 border border-zinc-800">
                        <button
                          onClick={() => updateQuantity(item.perfume.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-zinc-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.perfume.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-bold text-zinc-100 font-serif">
                        {formatCLP(item.perfume.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-800 bg-zinc-950/80 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Cupón (ej: NICOPRO10)..."
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-gold-400 text-xs font-semibold border border-zinc-700/80 transition"
                >
                  Aplicar
                </button>
              </form>

              {couponSuccess && (
                <p className="text-[11px] text-emerald-400 font-medium">{couponSuccess}</p>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-400 font-medium">{couponError}</p>
              )}

              {/* Summary Calculations */}
              <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-zinc-850">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-200">{formatCLP(cartTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Descuento Cupón</span>
                    <span>-{formatCLP(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío estimado</span>
                  <span>{freeShippingRemaining === 0 ? 'GRATIS' : '$3.990 (Santiago)'}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-100 pt-2 border-t border-zinc-800">
                  <span>Total Final</span>
                  <span className="text-gold-300 font-serif text-lg">{formatCLP(finalTotal)}</span>
                </div>
              </div>

              {/* Dual Checkout Buttons */}
              <div className="space-y-2 pt-2">
                {/* 1. Direct WhatsApp Checkout */}
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 active:scale-95 text-white font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Comprar Directo por WhatsApp</span>
                </button>

                {/* 2. Simulated Online Webpay / Card Checkout */}
                <button
                  onClick={handleOnlineCheckout}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:brightness-110 active:scale-95 text-black font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
                >
                  <CreditCard className="w-4 h-4 text-black" />
                  <span>Finalizar Compra Online</span>
                </button>
              </div>

              <p className="text-[10px] text-zinc-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Compra 100% segura y encriptada • Garantía Nico Perfume
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
