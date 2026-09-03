'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { formatCLP, generateWhatsAppOrderUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Tag,
  MessageCircle,
  Copy,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, shippingInfo, setShippingInfo } = useCart();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'webpay' | 'transfer' | 'whatsapp'>('webpay');

  const [orderId, setOrderId] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const code = couponCode.trim().toUpperCase();
    if (code === 'NICOPRO10' || code === 'PERFUME10') {
      const discount = Math.round(cartTotal * 0.10);
      setDiscountAmount(discount);
      setCouponSuccess('Cupón del 10% de descuento aplicado con éxito');
    } else if (code === 'ENVIOFREE') {
      setCouponSuccess('Cupón de Envío Bonificado activo');
    } else {
      setCouponError('Código de cupón no válido');
    }
  };

  const isFreeShipping = cartTotal >= 60000;
  const shippingCost = isFreeShipping ? 0 : 3990;
  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingCost);

  const handleSubmitOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const hp = (formData.get('website_url') as string) || honeypot;

    // Silent discard for automated bot submissions
    if (hp && hp.trim() !== '') {
      console.warn('Bot submission blocked via honeypot');
      return;
    }

    const generatedId = `NICO-${Math.floor(100000 + Math.random() * 900000)}`;
    const generatedTracking = `CL-STK-${Math.floor(10000000 + Math.random() * 90000000)}`;

    setOrderId(generatedId);
    setTrackingNumber(generatedTracking);
    setStep('success');
    clearCart();

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  };

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppDirect = () => {
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

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#050508] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-[#0a0a0f] border border-gold-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-semibold tracking-[0.25em] text-gold-400 uppercase">
              Compra Confirmada
            </span>
            <h1 className="font-serif text-3xl text-zinc-100 font-light mt-1">
              ¡Orden Recibida con Éxito!
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-light mt-2 max-w-md mx-auto">
              Hemos emitido tu comprobante de compra. Nuestro equipo preparará tu pedido sellado con despacho asegurado.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-left space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Número de Orden:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-gold-300">{orderId}</span>
                <button
                  onClick={handleCopyOrder}
                  className="p-1 text-zinc-500 hover:text-zinc-200 transition"
                  title="Copiar número"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Número de Seguimiento (Starken/Blue):</span>
              <span className="font-mono text-zinc-300">{trackingNumber}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Estado:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[10px] font-medium">
                Pago Procesado & Preparando Embalaje
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/catalogo"
              className="flex-1 py-3 px-4 rounded-xl bg-zinc-100 hover:bg-gold-400 text-black font-semibold text-xs tracking-wider uppercase transition text-center"
            >
              Volver a la Tienda
            </Link>

            <a
              href={`https://wa.me/56912345678?text=${encodeURIComponent(`Hola Nico Perfume, he realizado el pedido ${orderId}. ¿Podrían confirmar mi despacho?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/30 text-xs font-medium tracking-wider uppercase flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Notificar por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#050508] py-20 px-4 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h1 className="font-serif text-2xl text-zinc-100">No tienes productos en el carrito</h1>
          <p className="text-xs text-zinc-400">Agrega tus fragancias favoritas antes de proceder al checkout.</p>
          <Link
            href="/catalogo"
            className="inline-block mt-4 px-6 py-3 rounded-xl bg-zinc-100 text-black text-xs font-semibold uppercase tracking-wider hover:bg-gold-400 transition"
          >
            Explorar Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060609] py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-8">
          <Link href="/catalogo" className="hover:text-zinc-200 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al Catálogo
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-gold-300 font-medium">Checkout Seguro</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN (60%): CUSTOMER INFO, DELIVERY & PAYMENT */}
          <div className="lg:col-span-7 space-y-8">
            
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-400">
                Paso Final
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-light text-zinc-100 mt-1">
                Datos de Despacho & Pago
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-light">
                Completa tus datos para emitir la boleta/factura electrónica y coordinar el envío con Starken o Blue Express.
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Invisible Honeypot Anti-Bot Field */}
              <div className="hidden" aria-hidden="true" tabIndex={-1}>
                <label htmlFor="website_url">No completar este campo</label>
                <input
                  type="text"
                  id="website_url"
                  name="website_url"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* 1. Contact Info */}
              <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-zinc-850 space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-gold-400 flex items-center justify-center text-[10px]">1</span>
                  Información de Contacto
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1 text-[11px]">Email de Confirmación *</label>
                    <input
                      type="email"
                      required
                      placeholder="nicolas@ejemplo.cl"
                      defaultValue="nicolas@ejemplo.cl"
                      className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-gold-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 text-[11px]">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 1234 5678"
                      value={shippingInfo.phone || '+56 9 8765 4321'}
                      onChange={e => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-gold-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Shipping Address in Chile */}
              <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-zinc-850 space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-gold-400 flex items-center justify-center text-[10px]">2</span>
                  Dirección de Entrega en Chile
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1 text-[11px]">Nombre y Apellido Receptor *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Nicolás Morales"
                      value={shippingInfo.name || 'Nicolás Morales'}
                      onChange={e => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                      className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-gold-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 text-[11px]">RUT o DNI (para boleta/factura) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: 18.345.678-9"
                      value={shippingInfo.rut || '18.345.678-9'}
                      onChange={e => setShippingInfo({ ...shippingInfo, rut: e.target.value })}
                      className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-gold-500 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 text-[11px]">Región *</label>
                    <select
                      value={shippingInfo.region || 'Región Metropolitana'}
                      onChange={e => setShippingInfo({ ...shippingInfo, region: e.target.value })}
                      className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-gold-500 text-xs"
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
                    <label className="block text-zinc-400 mb-1 text-[11px]">Comuna / Ciudad *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Las Condes / Santiago"
                      value={shippingInfo.comuna || 'Santiago (Las Condes)'}
                      onChange={e => setShippingInfo({ ...shippingInfo, comuna: e.target.value })}
                      className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-gold-500 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1 text-[11px]">Dirección Completa (Calle, Número, Depto) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Av. Las Condes 1234, Depto 502"
                      value={shippingInfo.address || 'Av. Las Condes 1234, Depto 502'}
                      onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-gold-500 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1 text-[11px]">Indicaciones de Entrega (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej: Dejar en conserjería si no contesto"
                      defaultValue="Dejar en conserjería si no contesto"
                      className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-gold-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Methods */}
              <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-zinc-850 space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-gold-400 flex items-center justify-center text-[10px]">3</span>
                  Método de Pago
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    onClick={() => setPaymentMethod('webpay')}
                    className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition ${
                      paymentMethod === 'webpay'
                        ? 'bg-zinc-900/90 border-gold-500/80 text-zinc-100'
                        : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-gold-400 mb-2" />
                    <div>
                      <p className="text-xs font-semibold">Webpay Plus</p>
                      <p className="text-[10px] text-zinc-400">Débito / Crédito 1-12 cuotas</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition ${
                      paymentMethod === 'transfer'
                        ? 'bg-zinc-900/90 border-gold-500/80 text-zinc-100'
                        : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-blue-400 mb-2" />
                    <div>
                      <p className="text-xs font-semibold">Transferencia</p>
                      <p className="text-[10px] text-zinc-400">Banco de Chile / Santander</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('whatsapp')}
                    className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition ${
                      paymentMethod === 'whatsapp'
                        ? 'bg-zinc-900/90 border-emerald-500/80 text-zinc-100'
                        : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <MessageCircle className="w-5 h-5 text-emerald-400 mb-2" />
                    <div>
                      <p className="text-xs font-semibold">WhatsApp Directo</p>
                      <p className="text-[10px] text-zinc-400">Atención con Sommelier</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-zinc-100 hover:bg-gold-400 text-black font-semibold text-xs tracking-[0.2em] uppercase transition flex items-center justify-center gap-2 shadow-2xl active:scale-[0.99]"
                >
                  <Lock className="w-4 h-4" />
                  <span>Confirmar y Pagar ({formatCLP(finalTotal)})</span>
                </button>

                <p className="text-center text-[10.5px] text-zinc-400 font-light flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                  <span>Transacción encriptada con certificado SSL de 256 bits</span>
                </p>
              </div>

            </form>
          </div>

          {/* RIGHT COLUMN (40% - STICKY ORDER SUMMARY) */}
          <div className="lg:col-span-5 sticky top-24 space-y-5">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0a0a0f] border border-zinc-850 space-y-5 shadow-2xl">
              
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-200 pb-3 border-b border-zinc-850">
                Resumen del Pedido ({cart.reduce((s, i) => s + i.quantity, 0)} items)
              </h3>

              {/* Products List */}
              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.perfume.id} className="flex items-center gap-3.5">
                    <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                      <Image src={item.perfume.image} alt={item.perfume.name} fill className="object-cover" />
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white font-mono text-[9px] px-1 rounded">
                        x{item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] uppercase font-semibold text-gold-400 truncate">{item.perfume.brand}</p>
                      <h4 className="text-xs font-medium text-zinc-100 line-clamp-1">{item.perfume.name}</h4>
                      <p className="text-[10px] text-zinc-400">{item.formatType === 'decant' ? `Decant ${item.decantSize || '5ml'}` : `${item.perfume.volume}ml`}</p>
                    </div>

                    <span className="text-xs font-serif font-medium text-zinc-200">
                      {formatCLP(item.perfume.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-3 border-t border-zinc-850 flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Cupón (ej: NICOPRO10)..."
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-gold-500 font-mono uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium tracking-wider uppercase transition"
                >
                  Aplicar
                </button>
              </form>

              {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-400">{couponSuccess}</p>}

              {/* Price Breakdown */}
              <div className="space-y-2 pt-3 border-t border-zinc-850 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-serif">{formatCLP(cartTotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Descuento Cupón</span>
                    <span className="font-serif">-{formatCLP(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>Despacho a Domicilio</span>
                  <span>{isFreeShipping ? <strong className="text-emerald-400 font-medium">GRATIS</strong> : formatCLP(shippingCost)}</span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-zinc-800 text-base">
                  <span className="font-serif text-zinc-100">Total a Pagar</span>
                  <span className="font-serif text-2xl font-normal text-gold-300">
                    {formatCLP(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-3 border-t border-zinc-850/80 space-y-2 text-[11px] text-zinc-400">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Despacho prioritario con Starken o Blue Express</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                  <span>Perfumes 100% Originales con Batch Code Verificable</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
