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
  User,
  Phone,
  FileText,
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
      setCouponSuccess('¡Cupón del 10% de descuento aplicado con éxito!');
    } else if (code === 'ENVIOFREE') {
      setCouponSuccess('¡Cupón de Envío Bonificado activo!');
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
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-lg bg-[#0a0a0e] border-l border-gold-500/30 shadow-2xl shadow-black flex flex-col justify-between">
          
          {/* Top Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-800/80 bg-zinc-950/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gold-950/60 border border-gold-500/30 text-gold-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-serif font-medium text-zinc-100">
                    Bolsa de Fragancias
                  </h2>
                  <p className="text-[11px] text-zinc-400">
                    {cart.reduce((s, i) => s + i.quantity, 0)} productos seleccionados
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700/60 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                aria-label="Cerrar bolsa"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs (Bolsa vs Datos de Envío) */}
            {cart.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('items')}
                  className={`py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 ${
                    activeTab === 'items'
                      ? 'bg-gold-500 text-black shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>1. Productos ({cart.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 ${
                    activeTab === 'shipping'
                      ? 'bg-gold-500 text-black shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>2. Datos de Envío 🇨🇱</span>
                </button>
              </div>
            )}
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 sm:px-6 py-3 bg-zinc-950 border-b border-zinc-850">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                {freeShippingRemaining === 0 ? (
                  <span className="text-emerald-400 font-semibold">¡Felicidades! Tienes Envío Gratis a todo Chile</span>
                ) : (
                  <span>
                    Faltan <strong className="text-gold-300 font-bold">{formatCLP(freeShippingRemaining)}</strong> para envío gratis
                  </span>
                )}
              </span>
              <span className="text-[11px] text-zinc-400 font-bold">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Body Content Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-serif text-zinc-200">Tu bolsa está vacía</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                  Agrega fragancias de autor, sets de decants o utiliza nuestro recomendador gemelo.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-3 rounded-xl bg-gold-500 text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 transition shadow-lg shadow-gold-500/20"
                >
                  Explorar Perfumes
                </button>
              </div>
            ) : activeTab === 'items' ? (
              /* TAB 1: SPACIOUS PRODUCTS LIST */
              <div className="space-y-4">
                {cart.map(item => (
                  <div
                    key={item.perfume.id}
                    className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 hover:border-gold-500/40 transition flex gap-4 items-center group"
                  >
                    {/* Large High-Res Thumbnail */}
                    <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                      <Image
                        src={item.perfume.image}
                        alt={item.perfume.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.formatType === 'decant' && (
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-amber-950/90 border border-amber-500/50 text-amber-300 text-[9px] font-bold">
                          DECANT
                        </span>
                      )}
                    </div>

                    {/* Product Details & Stepper */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-[11px] uppercase font-bold text-gold-400 truncate">
                            {item.perfume.brand}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.perfume.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-900 rounded-lg transition"
                            title="Eliminar de la bolsa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-sm font-semibold text-zinc-100 line-clamp-2 mt-0.5">
                          {item.perfume.name}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-1">
                          {item.perfume.concentration} • {item.formatType === 'decant' ? (item.decantSize || '5ml') : `${item.perfume.volume}ml`}
                        </p>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-900">
                        <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-700/80 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.perfume.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg text-sm font-bold transition"
                            aria-label="Disminuir cantidad"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-zinc-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.perfume.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg text-sm font-bold transition"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-base font-bold text-zinc-100 font-serif">
                          {formatCLP(item.perfume.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setActiveTab('shipping')}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-gold-300 border border-gold-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <span>Continuar a Datos de Envío</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* TAB 2: SHIPPING INFORMATION FORM */
              <div className="p-4 rounded-2xl bg-zinc-950 border border-gold-500/20 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100">
                      Datos de Despacho & Receptor
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('items')}
                    className="text-xs text-zinc-400 hover:text-gold-300 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Volver
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1 font-medium">Nombre y Apellido Receptor *</label>
                    <input
                      type="text"
                      placeholder="Ej: Nicolás Morales"
                      value={shippingInfo.name}
                      onChange={e => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">RUT o DNI *</label>
                    <input
                      type="text"
                      placeholder="Ej: 19.876.543-2"
                      value={shippingInfo.rut}
                      onChange={e => setShippingInfo({ ...shippingInfo, rut: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      value={shippingInfo.phone}
                      onChange={e => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Región *</label>
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
                    <label className="block text-zinc-400 mb-1 font-medium">Comuna / Ciudad *</label>
                    <input
                      type="text"
                      placeholder="Ej: Las Condes, Providencia, Viña..."
                      value={shippingInfo.comuna}
                      onChange={e => setShippingInfo({ ...shippingInfo, comuna: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1 font-medium">Dirección Completa (Calle, Número, Depto/Casa) *</label>
                    <input
                      type="text"
                      placeholder="Ej: Av. Apoquindo 4500, Depto 804"
                      value={shippingInfo.address}
                      onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1 font-medium">Indicaciones de Entrega (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej: Dejar en conserjería, llamar antes de llegar..."
                      value={shippingInfo.notes}
                      onChange={e => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  Tus datos quedarán guardados para compras futuras y se adjuntarán a tu pedido.
                </p>
              </div>
            )}
          </div>

          {/* Footer Calculations & Dual Checkout */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-zinc-800/90 bg-zinc-950/95 space-y-4">
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

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-zinc-850">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-200 font-medium">{formatCLP(cartTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Descuento Cupón</span>
                    <span>-{formatCLP(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Despacho</span>
                  <span>{freeShippingRemaining === 0 ? 'GRATIS a todo Chile' : '$3.990 (Santiago) / Por pagar regiones'}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-100 pt-2 border-t border-zinc-800">
                  <span>Total Final</span>
                  <span className="text-gold-300 font-serif text-xl">{formatCLP(finalTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* 1. WhatsApp Checkout */}
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 active:scale-95 text-white font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Comprar por WhatsApp con mis datos</span>
                </button>

                {/* 2. Webpay / Online Checkout */}
                <button
                  onClick={handleOnlineCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:brightness-110 active:scale-95 text-black font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
                >
                  <CreditCard className="w-4 h-4 text-black" />
                  <span>Finalizar Compra Online</span>
                </button>
              </div>

              <p className="text-[10px] text-zinc-500 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Compra 100% garantizada • Perfumes sellados con batch code
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
