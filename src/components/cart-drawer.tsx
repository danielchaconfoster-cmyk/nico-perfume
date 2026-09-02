'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { formatCLP, generateWhatsAppOrderUrl } from '@/lib/utils';
import {
  X,
  ShoppingBag,
  Trash2,
  Truck,
  Tag,
  MessageCircle,
  CreditCard,
  ShieldCheck,
  MapPin,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
    setIsCheckoutOpen,
    shippingInfo,
    setShippingInfo
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [showShippingForm, setShowShippingForm] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const code = couponCode.trim().toUpperCase();
    if (code === 'NICOPRO10' || code === 'PERFUME10') {
      const discount = Math.round(cartTotal * 0.10);
      setDiscountAmount(discount);
      setCouponSuccess('Cupón del 10% de descuento aplicado');
    } else if (code === 'ENVIOFREE') {
      setCouponSuccess('Cupón de Envío Bonificado activo');
    } else {
      setCouponError('Código de cupón no válido');
    }
  };

  const finalTotal = Math.max(0, cartTotal - discountAmount);

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
      finalTotal,
      shippingInfo.name || undefined,
      shippingInfo.address || undefined,
      shippingInfo.comuna || undefined
    );
    window.open(url, '_blank');
  };

  const handleOnlineCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const totalItemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        {/* Spacious, luxury Drawer container (540px on desktop) */}
        <div className="w-screen max-w-md sm:max-w-lg lg:max-w-xl bg-[#08080c] border-l border-zinc-800 shadow-2xl flex flex-col h-full text-zinc-100">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-850 bg-[#060609] shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gold-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-serif font-normal tracking-wide text-zinc-100">
                  Bolsa de Fragancias
                </h2>
                <p className="text-[11px] text-zinc-400 font-sans">
                  {totalItemCount} {totalItemCount === 1 ? 'fragancia seleccionada' : 'fragancias seleccionadas'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              aria-label="Cerrar bolsa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Bar Indicator */}
          {cart.length > 0 && (
            <div className="px-6 py-3 bg-[#0a0a0f] border-b border-zinc-850 shrink-0">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-zinc-300 text-[11px]">
                  <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {freeShippingRemaining === 0 ? (
                    <span className="text-emerald-400 font-medium">¡Calificas para Despacho Gratis a todo Chile!</span>
                  ) : (
                    <span>
                      Faltan <strong className="text-gold-300 font-serif font-normal">{formatCLP(freeShippingRemaining)}</strong> para envío gratis
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-500 to-amber-400 transition-all duration-300 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Scrollable Body: High Visibility Product List */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-24 px-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-600">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-serif text-zinc-200">Tu bolsa está vacía</h3>
                <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto font-light leading-relaxed">
                  Descubre extractos árabes de alta concentración, sets de descubrimiento de 5ml o consulta nuestro recomendador de fragancias gemelas.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5 justify-center mt-6">
                  <Link
                    href="/catalogo"
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-3 rounded-xl bg-zinc-100 hover:bg-gold-400 text-black text-xs font-semibold uppercase tracking-wider transition"
                  >
                    Ver Catálogo Completo
                  </Link>
                  <Link
                    href="/fragancias-gemelas"
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium uppercase tracking-wider transition"
                  >
                    Fragancias Gemelas
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* List of Products (Spacious, Clear & Beautiful) */}
                <div className="space-y-3">
                  {cart.map(item => (
                    <div
                      key={item.perfume.id}
                      className="p-4 rounded-2xl bg-[#0c0c10] border border-zinc-800/90 hover:border-zinc-700 transition flex gap-4 items-center group"
                    >
                      {/* Product Thumbnail (Generous 80x96px) */}
                      <div className="relative w-20 h-24 sm:w-22 sm:h-26 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                        <Image
                          src={item.perfume.image}
                          alt={item.perfume.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {item.formatType === 'decant' && (
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/85 border border-zinc-700 text-gold-300 text-[8px] font-bold uppercase tracking-wider">
                            Decant {item.decantSize || '5ml'}
                          </span>
                        )}
                      </div>

                      {/* Info & Pricing */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] uppercase font-semibold tracking-[0.2em] text-gold-400 truncate">
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

                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            {item.perfume.concentration} • {item.formatType === 'decant' ? (item.decantSize || '5ml') : `${item.perfume.volume}ml`}
                          </p>
                        </div>

                        {/* Controls + Price */}
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-900">
                          {/* Stepper */}
                          <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-800 p-0.5">
                            <button
                              onClick={() => updateQuantity(item.perfume.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white rounded-lg text-sm font-bold transition hover:bg-zinc-800"
                              aria-label="Disminuir cantidad"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-zinc-100">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.perfume.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white rounded-lg text-sm font-bold transition hover:bg-zinc-800"
                              aria-label="Aumentar cantidad"
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <span className="text-sm sm:text-base font-serif font-medium text-zinc-100">
                              {formatCLP(item.perfume.price * item.quantity)}
                            </span>
                            {item.quantity > 1 && (
                              <p className="text-[10px] text-zinc-500 font-sans">
                                {formatCLP(item.perfume.price)} c/u
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Optional Fast Delivery Data Accordion (Unified, NOT hiding products) */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowShippingForm(!showShippingForm)}
                    className="w-full p-3.5 rounded-xl bg-[#0c0c10] border border-zinc-800/80 hover:border-zinc-700 flex items-center justify-between text-xs text-zinc-300 transition"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gold-400" />
                      <span>{shippingInfo.name ? `Despacho para: ${shippingInfo.name}` : 'Agregar datos de despacho (Opcional)'}</span>
                    </span>
                    {showShippingForm ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>

                  {showShippingForm && (
                    <div className="mt-2.5 p-4 rounded-2xl bg-[#0a0a0e] border border-zinc-800 space-y-3 text-xs animate-fadeIn">
                      <div>
                        <label className="block text-zinc-400 text-[11px] mb-1">Nombre y Apellido Receptor *</label>
                        <input
                          type="text"
                          placeholder="Ej: Nicolás Morales"
                          value={shippingInfo.name}
                          onChange={e => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-zinc-400 text-[11px] mb-1">RUT o DNI *</label>
                          <input
                            type="text"
                            placeholder="Ej: 19.876.543-2"
                            value={shippingInfo.rut}
                            onChange={e => setShippingInfo({ ...shippingInfo, rut: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-400 text-[11px] mb-1">Teléfono / WhatsApp *</label>
                          <input
                            type="tel"
                            placeholder="+56 9 1234 5678"
                            value={shippingInfo.phone}
                            onChange={e => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-zinc-400 text-[11px] mb-1">Región *</label>
                          <select
                            value={shippingInfo.region}
                            onChange={e => setShippingInfo({ ...shippingInfo, region: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                          >
                            <option value="Región Metropolitana">Región Metropolitana</option>
                            <option value="Valparaíso">Valparaíso</option>
                            <option value="Biobío">Biobío</option>
                            <option value="Antofagasta">Antofagasta</option>
                            <option value="Coquimbo">Coquimbo</option>
                            <option value="Otras Regiones">Otras Regiones</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-zinc-400 text-[11px] mb-1">Comuna / Ciudad *</label>
                          <input
                            type="text"
                            placeholder="Ej: Las Condes / Viña"
                            value={shippingInfo.comuna}
                            onChange={e => setShippingInfo({ ...shippingInfo, comuna: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-zinc-400 text-[11px] mb-1">Dirección Completa (Calle, Número, Depto) *</label>
                        <input
                          type="text"
                          placeholder="Ej: Av. Apoquindo 4500, Depto 804"
                          value={shippingInfo.address}
                          onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Fixed Footer: Financial Summary & Clear Direct Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-850 bg-[#060609] shrink-0 space-y-4">
              
              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Código de descuento (ej: NICOPRO10)..."
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-gold-500/60 font-mono uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-medium tracking-wider uppercase transition"
                >
                  Aplicar
                </button>
              </form>

              {couponError && <p className="text-[11px] text-rose-400 font-sans">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-400 font-sans">{couponSuccess}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-900 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-serif">{formatCLP(cartTotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Descuento Cupón (10%)</span>
                    <span className="font-serif">-{formatCLP(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>Despacho a Domicilio</span>
                  <span>{freeShippingRemaining === 0 ? <strong className="text-emerald-400 font-medium">GRATIS</strong> : '$3.990 (Santiago) / Regiones'}</span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-zinc-850 text-base">
                  <span className="font-serif text-zinc-200">Total a Pagar</span>
                  <span className="font-serif text-xl font-normal text-gold-300">
                    {formatCLP(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={handleOnlineCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-zinc-100 hover:bg-gold-400 text-black font-semibold text-xs tracking-[0.15em] uppercase transition flex items-center justify-center gap-2 shadow-xl shadow-white/5 active:scale-[0.99]"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Finalizar Compra Online</span>
                </button>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 text-emerald-400 border border-emerald-500/30 font-medium text-xs tracking-wider uppercase transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir por WhatsApp Directo</span>
                </button>
              </div>

              {/* Trust Subtext */}
              <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-gold-400" /> Webpay Seguro 256-bit
                </span>
                <span>•</span>
                <span>Batch Code Verificado</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
