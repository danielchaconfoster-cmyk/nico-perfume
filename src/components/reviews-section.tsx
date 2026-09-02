'use client';

import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

export function ReviewsSection() {
  const reviews = [
    {
      name: 'Matías Silva R.',
      city: 'Las Condes, Santiago',
      perfume: 'Afnan 9 PM EDP 100ml',
      rating: 5,
      date: 'Hace 3 días',
      comment: 'Excelente servicio. El recomendador me sugirió el 9 PM porque me gustaba Ultra Male y la verdad es idéntico pero dura incluso más. Llegó sellado en 24 horas.'
    },
    {
      name: 'Camila Valenzuela',
      city: 'Viña del Mar',
      perfume: 'Al Haramain Amber Oud Aqua Dubai',
      rating: 5,
      date: 'Hace 5 días',
      comment: 'Una joya total. La presentación de lujo y la fijación en piel es de más de 12 horas. Compré por WhatsApp y la atención fue muy rápida y amable.'
    },
    {
      name: 'Ignacio Fuentes',
      city: 'Concepción',
      perfume: 'Bharara King EDP 150ml',
      rating: 5,
      date: 'Hace 1 semana',
      comment: '100% original con su batch code verificado. Es una bomba de cumplidos en la oficina y fiestas. Totalmente recomendados.'
    }
  ];

  return (
    <section className="py-20 bg-[#08080a] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
            <span>Opiniones Reales de Clientes</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-zinc-100 font-light">
            Lo que dicen nuestros <span className="italic text-gold-gradient font-normal">Coleccionistas</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Más de 4.800 pedidos despachados con 4.9 estrellas de satisfacción en Chile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-gold-500/30 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-gold-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-500">{r.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 font-light italic leading-relaxed">
                  "{r.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-850 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-100 flex items-center gap-1">
                    <span>{r.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-[10px] text-zinc-400">{r.city}</p>
                </div>
                <span className="text-[10px] text-gold-400/90 font-medium bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 max-w-[130px] truncate">
                  {r.perfume}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
