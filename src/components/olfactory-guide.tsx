'use client';

import React, { useState } from 'react';
import { BookOpen, Sparkles, Droplets, Compass } from 'lucide-react';

export function OlfactoryGuide() {
  const families = [
    {
      title: 'Oriental / Ámbar',
      icon: '🏺',
      desc: 'Cálidas, sensuales y misteriosas. Destacan por notas de vainilla de Madagascar, ámbar resinoso, haba tonka y especias exóticas.',
      vibe: 'Ideal para la noche, eventos elegantes y climas fríos.',
      examples: 'Afnan 9 PM, Amber Oud, Khamrah'
    },
    {
      title: 'Amaderada',
      icon: '🌲',
      desc: 'Estructuradas, sobrias y duraderas. Con acordes de cedro del Atlas, sándalo cremoso, vetiver de Haití y maderas de roble.',
      vibe: 'Perfectas para proyectar autoridad, madurez y presencia.',
      examples: 'Club de Nuit Intense, Terre d’Hermes, Cartier Pasha'
    },
    {
      title: 'Cítrica / Fresca',
      icon: '🍋',
      desc: 'Energizantes y revitalizantes. Notas de bergamota italiana, limón siciliano, mandarina y notas marinas transparentes.',
      vibe: 'Imprescindibles para el verano, deportes y uso diario.',
      examples: 'CK One, Light Blue, Acqua Di Gio'
    },
    {
      title: 'Gourmand / Dulce',
      icon: '🍫',
      desc: 'Apetitosas e irresistibles. Aromas que evocan chocolate, café tostado, caramelo salado, praliné y frutos rojos confitados.',
      vibe: 'Generan cumplidos inmediatos y calidez acogedora.',
      examples: 'Yara, Khamrah Qahwa, Red Carpet'
    },
    {
      title: 'Cuero / Especiada',
      icon: '🔥',
      desc: 'Audaces, intensas y magnéticas. Con canela, azafrán, pimienta negra, tabaco cubano y cuero envejecido.',
      vibe: 'Para personalidades con fuerte carácter e impacto nocturno.',
      examples: 'Wanted by Night, Ombré Leather, Spicebomb'
    },
    {
      title: 'Aromática / Fougère',
      icon: '🌿',
      desc: 'Clásicas, limpias y masculinas. Destacan la lavanda silvestre, salvia esclarea, menta piperita y musgo de roble.',
      vibe: 'El comodín infalible para oficina y cualquier ocasión.',
      examples: 'Sauvage, Eros, Dylan Blue'
    }
  ];

  return (
    <section className="py-20 bg-zinc-950 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-950/80 border border-gold-500/40 text-gold-300 text-xs font-semibold tracking-wider uppercase mb-3">
            <BookOpen className="w-3.5 h-3.5 text-gold-400" />
            <span>Academia Olfativa</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-zinc-100 font-light">
            Guía de <span className="italic text-gold-gradient font-normal">Familias Olfativas</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Comprende los matices y la arquitectura de cada acorde para elegir tu firma aromática con conocimiento de experto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {families.map((f, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-gold-500/40 transition duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{f.icon}</span>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 group-hover:text-gold-400 transition">
                    Familia #{idx + 1}
                  </span>
                </div>
                <h3 className="text-base font-serif font-medium text-zinc-100 group-hover:text-gold-300 transition">
                  {f.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-zinc-850/80 space-y-1 text-xs">
                <p className="text-[11px] text-zinc-300">
                  <strong className="text-gold-400/90 font-medium">Uso:</strong> {f.vibe}
                </p>
                <p className="text-[11px] text-zinc-500">
                  <strong>Referentes:</strong> {f.examples}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
