'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  PackageCheck,
  Copy,
  Sparkles
} from 'lucide-react';

export function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, cartTotal, clearCart } = useCart();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: 'Nicolás Morales',
    email: 'nicolas@ejemplo.cl',
    phone: '+56 9 8765 4321',
    rut: '18.345.678-9',
    address: 'Av. Las Condes 1234, Depto 502',
    city: 'Santiago (Las Condes)',
    region: 'Región Metropolitana',
    notes: 'Dejar en conserjería si no contesto',
    paymentMethod: 'webpay'
  });

  const [orderId, setOrderId] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `NICO-${Math.floor(100000 + Math.random() * 900000)}`;
    const generatedTracking = `CL-STK-${Math.floor(10000000 + Math.random() * 90000000)}`;

    setOrderId(generatedId);
    setTrackingNumber(generatedTracking);
    setStep('success');
    clearCart();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('form');
  };

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0c0c10] border border-gold-500/30 p-6 sm:p-8 shadow-2xl shadow-black">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition z-10"
          aria-label="Cerrar checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            <div className="mb-6 pb-4 border-b border-zinc-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Pasarela de Despacho & Pago Seguro
              </span>
              <h2 className="font-serif text-2xl text-zinc-100 font-light mt-1">
                Finalizar Compra
              </h2>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Personal Details */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
                  1. Datos Personales del Comprador
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">RUT o DNI *</label>
                    <input
                      type="text"
                      required
                      value={formData.rut}
                      onChange={e => setFormData({ ...formData, rut: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
                  2. Dirección de Envío (Chile)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1">Calle, Número y Depto/Casa *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Comuna / Ciudad *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Región *</label>
                    <input
                      type="text"
                      required
                      value={formData.region}
                      onChange={e => setFormData({ ...formData, region: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
                  3. Método de Pago
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.paymentMethod === 'webpay'
                        ? 'bg-gold-950/40 border-gold-500 text-gold-300'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="webpay"
                      checked={formData.paymentMethod === 'webpay'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'webpay' })}
                      className="text-gold-500 focus:ring-gold-500"
                    />
                    <CreditCard className="w-5 h-5 text-gold-400 shrink-0" />
                    <div className="text-xs">
                      <p className="font-semibold text-zinc-100">Webpay Plus / Tarjetas</p>
                      <p className="text-[11px] text-zinc-400">Débito, Crédito, Prepago</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.paymentMethod === 'transfer'
                        ? 'bg-gold-950/40 border-gold-500 text-gold-300'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="transfer"
                      checked={formData.paymentMethod === 'transfer'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'transfer' })}
                      className="text-gold-500 focus:ring-gold-500"
                    />
                    <Building2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div className="text-xs">
                      <p className="font-semibold text-zinc-100">Transferencia Bancaria</p>
                      <p className="text-[11px] text-emerald-400">5% OFF adicional</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Summary Line */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400">Total a Pagar ({cart.reduce((s, i) => s + i.quantity, 0)} productos):</span>
                  <p className="text-xl font-bold text-gold-300 font-serif">{formatCLP(cartTotal)}</p>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:brightness-110 active:scale-95 text-black font-semibold text-xs tracking-wider uppercase transition shadow-lg shadow-gold-500/20"
                >
                  Confirmar y Pagar
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success Receipt View */
          <div className="text-center py-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-950">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              ¡Orden Recibida con Éxito!
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-zinc-100 font-light mt-1">
              Gracias por tu compra, {formData.name}
            </h2>
            <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto">
              Hemos enviado el comprobante de compra detallado a <strong className="text-zinc-200">{formData.email}</strong>. Tu pedido está en preparación en nuestro centro de distribución.
            </p>

            {/* Receipt Summary Card */}
            <div className="my-6 p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-left text-xs space-y-3 max-w-lg mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
                <span className="text-zinc-400">Número de Orden:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-gold-400 text-sm">{orderId}</span>
                  <button
                    onClick={handleCopyOrder}
                    className="p-1 text-zinc-400 hover:text-gold-300"
                    title="Copiar código"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copied && <span className="text-[10px] text-emerald-400">Copiado</span>}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Número de Seguimiento (Starken/Blue):</span>
                <span className="font-mono text-zinc-200 font-semibold">{trackingNumber}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Dirección de Despacho:</span>
                <span className="text-zinc-200 text-right truncate max-w-[200px]">{formData.address}, {formData.city}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-850">
                <span className="text-zinc-400">Estado del Pedido:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                  En Preparación / Despacho Prioritario
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs tracking-wider uppercase transition"
              >
                Volver a la Tienda
              </button>
              <a
                href={`https://wa.me/56912345678?text=Hola%20Nico%20Perfume!%20Acabo%20de%20realizar%20el%20pedido%20${orderId}%20a%20nombre%20de%20${encodeURIComponent(formData.name)}.%20Quisiera%20confirmar%20el%20seguimiento.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
