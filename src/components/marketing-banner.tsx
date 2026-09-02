'use client';

import React from 'react';
import { ShieldCheck, Truck, CreditCard, MessageSquare } from 'lucide-react';

export function MarketingBanner() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Originales & Sellados',
      desc: 'Batch codes verificables y garantía total de autenticidad en cada botella.'
    },
    {
      icon: Truck,
      title: 'Envío Gratis desde $60.000',
      desc: 'Despacho prioritario y seguro a todo Chile con número de seguimiento.'
    },
    {
      icon: CreditCard,
      title: 'Pago Rápido & Seguro',
      desc: 'Webpay Plus, Tarjetas de Débito/Crédito y Transferencia Bancaria Directa.'
    },
    {
      icon: MessageSquare,
      title: 'Asesoría con Sommelier',
      desc: 'Atención personalizada 1 a 1 por WhatsApp para encontrar tu fragancia ideal.'
    }
  ];

  return (
    <section className="border-y border-zinc-800/80 bg-zinc-950/60 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/40 hover:border-gold-500/30 transition group"
              >
                <div className="p-3 rounded-xl bg-gold-950/50 border border-gold-500/20 text-gold-400 group-hover:scale-110 transition-transform shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-gold-300 transition">
                    {p.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
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
