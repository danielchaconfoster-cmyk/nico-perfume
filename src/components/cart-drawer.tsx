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
  ChevronRight,
  ArrowLeft
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
    setIsCheckoutOpen,
    shippingInfo,
    setShippingInfo
  } = useCart();

  const [activeTab, setActiveTab] = useState<'items' | 'shipping'>('items');
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md sm:max-w-lg bg-[#07070a] border-l border-zinc-800 shadow-2xl flex flex-col h-full">
          
          {/* Header */}
          <div className="p-5 border-b border-zinc-800/80 bg-[#050508] shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-gold-400" />
                <h2 className="text-base font-serif font-normal text-zinc-100 tracking-wide">
                  Bolsa de Fragancias
                </h2>
                <span className="text-xs text-zinc-400 font-sans">
                  ({cart.reduce((s, i) => s + i.quantity, 0)})
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                aria-label="Cerrar bolsa"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs (Items vs Shipping) */}
            {cart.length > 0 && (
              <div className="grid grid-cols-2 gap-1.5 mt-3 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs">
                <button
                  onClick={() => setActiveTab('items')}
                  className={`py-1.5 px-3 rounded-lg text-[11px] uppercase tracking-wider font-medium transition ${
                    activeTab === 'items'
                      ? 'bg-zinc-100 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  1. Productos ({cart.length})
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`py-1.5 px-3 rounded-lg text-[11px] uppercase tracking-wider font-medium transition ${
                    activeTab === 'shipping'
                      ? 'bg-zinc-100 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  2. Datos de Envío
                </button>
              </div>
            )}
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-2.5 bg-zinc-950 border-b border-zinc-900 shrink-0">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1.5 text-zinc-300 text-[11px]">
                <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {freeShippingRemaining === 0 ? (
                  <span className="text-emerald-400 font-medium">Envío Gratis Desbloqueado</span>
                ) : (
                  <span>
                    Faltan <strong className="text-gold-300 font-serif font-normal">{formatCLP(freeShippingRemaining)}</strong> para despacho gratis
                  </span>
                )}
              </span>
              <span className="text-[10px] text-zinc-400">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-400 transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-500">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-base font-serif text-zinc-200">Tu bolsa está vacía</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto font-light">
                  Explora nuestra colección de extractos árabes, sets de decants o utiliza el recomendador olfativo.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 px-6 py-2.5 rounded-xl bg-zinc-100 text-black text-xs font-medium uppercase tracking-wider hover:bg-gold-400 transition"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : activeTab === 'items' ? (
              /* TAB 1: SPACIOUS PRODUCT CARDS */
              <div className="space-y-3">
                {cart.map(item => (
                  <div
                    key={item.perfume.id}
                    className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-850 flex gap-3.5 items-center group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                      <Image
                        src={item.perfume.image}
                        alt={item.perfume.name}
                        fill
                        className="object-cover"
                      />
                      {item.formatType === 'decant' && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 border border-zinc-700 text-gold-300 text-[8px] font-bold uppercase tracking-wider">
                          Decant
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-[10px] uppercase font-semibold tracking-wider text-gold-400 truncate">
                            {item.perfume.brand}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.perfume.id)}
                            className="p-1 text-zinc-500 hover:text-rose-400 transition"
                            title="Eliminar"
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

                      {/* Stepper + Subtotal */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-900">
                        <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.perfume.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded text-xs font-bold transition"
                            aria-label="Disminuir cantidad"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-zinc-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.perfume.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded text-xs font-bold transition"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-medium text-zinc-100 font-serif">
                          {formatCLP(item.perfume.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setActiveTab('shipping')}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 text-xs font-medium tracking-wider uppercase flex items-center justify-center gap-1.5 transition mt-2"
                >
                  <span>Continuar a Datos de Envío</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                </button>
              </div>
            ) : (
              /* TAB 2: SHIPPING FORM */
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-3.5 animate-fadeIn">
                <div className="flex items-center justify-between pb-2.5 border-b border-zinc-900">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold-400" />
                    <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-200">
                      Datos de Despacho en Chile
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('items')}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Volver a Productos
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1 text-[11px]">Nombre y Apellido Receptor *</label>
                    <input
                      type="text"
                      placeholder="Ej: Nicolás Morales"
                      value={shippingInfo.name}
                      onChange={e => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 text-[11px]">RUT o DNI *</label>
                    <input
                      type="text"
                      placeholder="Ej: 19.876.543-2"
                      value={shippingInfo.rut}
                      onChange={e => setShippingInfo({ ...shippingInfo, rut: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 text-[11px]">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      value={shippingInfo.phone}
                      onChange={e => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 text-[11px]">Región *</label>
                    <select
                      value={shippingInfo.region}
                      onChange={e => setShippingInfo({ ...shippingInfo, region: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-gold-500"
                    >
                      <option value="Región Metropolitana">Región Metropolitana</option>
                      <option value="Valparaíso / Viña">Valparaíso / Viña del Mar</option>
                      <option value="Biobío (Concepción)">Biobío (Concepción)</option>
                      <option value="Antofagasta">Antofagasta</option>
                      <option value="Coquimbo / La Serena">Coquimbo / La Serena</option>
                      <option value="Otras Regiones">Otras Regiones de Chile</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 text-[11px]">Comuna / Ciudad *</label>
                    <input
                      type="text"
                      placeholder="Ej: Las Condes, Providencia, Viña..."
                      value={shippingInfo.comuna}
                      onChange={e => setShippingInfo({ ...shippingInfo, comuna: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1 text-[11px]">Dirección Completa (Calle, Número, Depto/Casa) *</label>
                    <input
                      type="text"
                      placeholder="Ej: Av. Apoquindo 4500, Depto 804"
                      value={shippingInfo.address}
                      onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1 text-[11px]">Indicaciones de Entrega (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej: Dejar en conserjería, llamar antes..."
                      value={shippingInfo.notes}
                      onChange={e => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-zinc-400 flex items-center gap-1 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Los datos quedarán guardados y se adjuntarán a tu orden automáticamente.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Sticky Checkout Area */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-zinc-800/90 bg-[#050508] space-y-3 shrink-0">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Código de descuento (ej: NICOPRO10)..."
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-gold-300 text-xs font-medium border border-zinc-800 transition"
                >
                  Aplicar
                </button>
              </form>

              {couponSuccess && <p className="text-[10px] text-emerald-400">{couponSuccess}</p>}
              {couponError && <p className="text-[10px] text-rose-400">{couponError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs text-zinc-400 pt-2 border-t border-zinc-900">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-200 font-serif font-medium">{formatCLP(cartTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Descuento Cupón</span>
                    <span className="font-serif">-{formatCLP(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Despacho</span>
                  <span>{freeShippingRemaining === 0 ? 'GRATIS a todo Chile' : '$3.990 (Santiago) / Regiones'}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-zinc-100 pt-1.5 border-t border-zinc-900">
                  <span>Total a Pagar</span>
                  <span className="text-gold-300 font-serif text-lg font-normal">{formatCLP(finalTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {/* 1. Online Checkout */}
                <button
                  onClick={handleOnlineCheckout}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-100 hover:bg-gold-400 text-black font-medium text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Finalizar Compra Online</span>
                </button>

                {/* 2. WhatsApp Checkout */}
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-emerald-400 border border-emerald-500/30 text-xs font-medium tracking-wider uppercase transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Pedir por WhatsApp</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
