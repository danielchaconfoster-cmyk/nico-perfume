'use client';

import React from 'react';
import { ShieldCheck, Truck, CreditCard, MessageCircle } from 'lucide-react';

export function MarketingBanner() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Perfumes Originales',
      desc: 'Frascos sellados con garantía total de autenticidad.'
    },
    {
      icon: Truck,
      title: 'Envío Gratis sobre $60.000',
      desc: 'Despacho rápido a todo Chile con Starken y Blue Express.'
    },
    {
      icon: CreditCard,
      title: 'Pago Rápido & Seguro',
      desc: 'Webpay Plus, Tarjetas de Débito, Crédito y Transferencia.'
    },
    {
      icon: MessageCircle,
      title: 'Atención por WhatsApp',
      desc: 'Te asesoramos directamente para elegir tu fragancia perfecta.'
    }
  ];

  return (
    <section className="border-y border-zinc-800/80 bg-zinc-950/80 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-[#0c0c12] border border-zinc-850 hover:border-zinc-700 transition group"
              >
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-gold-400 group-hover:scale-105 transition-transform shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-zinc-100">
                    {p.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-light">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
