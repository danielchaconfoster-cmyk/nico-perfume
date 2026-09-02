'use client';

import React, { useState } from 'react';
import { Perfume } from '@/types/perfume';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import {
  Compass,
  MapPin,
  CheckCircle2,
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';
import Image from 'next/image';

interface SillageWeatherAppProps {
  perfumes: Perfume[];
}

export function SillageWeatherApp({ perfumes }: SillageWeatherAppProps) {
  const { addToCart, openQuickView } = useCart();

  const [selectedCity, setSelectedCity] = useState('Santiago (RM)');
  const [selectedTemp, setSelectedTemp] = useState('moderado'); // 'calor' | 'moderado' | 'fresco' | 'frio'
  const [selectedContext, setSelectedContext] = useState('oficina'); // 'oficina' | 'cita' | 'fiesta' | 'aire-libre'

  // Calculations
  const sprayAdvice = {
    calor: {
      sprays: '3 - 4 Atomizaciones',
      advice: 'En altas temperaturas los aceites se evaporan rápidamente y proyectan con más intensidad. Aplica menos sprays para no fatigar el olfato.',
      points: 'Base del cuello, parte posterior de los codos y pecho.',
      bestFamily: 'Cítrica / Fresca'
    },
    moderado: {
      sprays: '4 - 5 Atomizaciones',
      advice: 'Clima templado donde casi cualquier fragancia se desempeña en su punto óptimo de fijación y estela.',
      points: 'Lados del cuello, detrás de las orejas y muñecas.',
      bestFamily: 'Aromática / Fougère'
    },
    fresco: {
      sprays: '5 - 6 Atomizaciones',
      advice: 'Las temperaturas frescas ralentizan la evaporación, permitiendo que las notas amaderadas y ambaradas brillen durante más de 12 horas.',
      points: 'Cuello, clavículas, muñecas y una atomización sobre la ropa.',
      bestFamily: 'Amaderada'
    },
    frio: {
      sprays: '6 - 7 Atomizaciones',
      advice: 'El frío comprime las moléculas aromáticas. Momento idóneo para usar extractos de vainilla, oud, especias y cuero.',
      points: 'Cuello, nuca, muñecas, pecho y hombros sobre la ropa.',
      bestFamily: 'Oriental / Ámbar'
    }
  }[selectedTemp as 'calor' | 'moderado' | 'fresco' | 'frio'];

  const weatherPerfumes = perfumes
    .filter(p => {
      if (selectedTemp === 'calor') return p.family === 'Cítrica / Fresca' || p.vibe.includes('Fresco');
      if (selectedTemp === 'frio') return p.family === 'Oriental / Ámbar' || p.family === 'Cuero / Especiada' || p.family === 'Gourmand / Dulce';
      if (selectedTemp === 'fresco') return p.family === 'Amaderada' || p.family === 'Oriental / Ámbar';
      return p.family === 'Aromática / Fougère' || p.vibe.includes('Versátil');
    })
    .slice(0, 3);

  return (
    <section id="clima-olfativo" className="py-20 bg-[#060608] border-t border-zinc-900 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[11px] font-medium tracking-[0.3em] text-zinc-400 uppercase mb-3">
            Guía Técnica de Proyección & Estela
          </p>

          <h2 className="font-serif text-3xl sm:text-5xl font-light text-zinc-100 leading-[1.2]">
            Asesor de Clima & Atomizaciones <br />
            <span className="italic text-gold-gradient font-normal">Calculador de Dosis Diaria.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            La temperatura ambiente y la humedad modifican la velocidad de evaporación de los aceites esenciales. Ajusta tu ubicación en Chile para obtener la dosis exacta recomendada.
          </p>
        </div>

        {/* Advisor Controls & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Controls */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-5 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-900">
              <SlidersHorizontal className="w-4 h-4 text-gold-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                Parámetros de tu Jornada
              </h3>
            </div>

            {/* City */}
            <div>
              <label className="block text-zinc-400 text-xs mb-1.5 font-medium">Ubicación en Chile</label>
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
              >
                <option value="Santiago (RM)">Santiago (Región Metropolitana)</option>
                <option value="Viña del Mar / Valparaíso">Viña del Mar / Valparaíso</option>
                <option value="Concepción / Biobío">Concepción / Biobío</option>
                <option value="Antofagasta">Antofagasta</option>
                <option value="La Serena / Coquimbo">La Serena / Coquimbo</option>
                <option value="Temuco / Araucanía">Temuco / Araucanía</option>
                <option value="Puerto Montt">Puerto Montt / Los Lagos</option>
              </select>
            </div>

            {/* Temp */}
            <div>
              <label className="block text-zinc-400 text-xs mb-1.5 font-medium">Temperatura Estimada</label>
              <select
                value={selectedTemp}
                onChange={e => setSelectedTemp(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
              >
                <option value="calor">Caluroso (+28°C)</option>
                <option value="moderado">Templado / Moderado (20°C - 27°C)</option>
                <option value="fresco">Fresco / Media Estación (14°C - 19°C)</option>
                <option value="frio">Frío / Invierno (&lt; 14°C)</option>
              </select>
            </div>

            {/* Context */}
            <div>
              <label className="block text-zinc-400 text-xs mb-1.5 font-medium">Ocasión / Entorno</label>
              <select
                value={selectedContext}
                onChange={e => setSelectedContext(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500"
              >
                <option value="oficina">Oficina & Trabajo (Espacio Cerrado)</option>
                <option value="cita">Cita Romántica / Cena Nocturna</option>
                <option value="fiesta">Fiesta & Evento Social</option>
                <option value="aire-libre">Aire Libre & Casual Diario</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-gold-500/30 space-y-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-zinc-850">
              <div>
                <span className="text-[10px] font-semibold text-gold-400 uppercase tracking-[0.2em]">
                  Fórmula Recomendada para {selectedCity}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-zinc-100 mt-1 font-light">
                  Dosis Recomendada Hoy
                </h3>
              </div>
              <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-sm sm:text-base font-serif font-bold text-gold-300">
                  {sprayAdvice.sprays}
                </span>
              </div>
            </div>

            {/* Advice Details */}
            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <p>{sprayAdvice.advice}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-850">
                  <span className="text-[10px] font-semibold uppercase text-gold-400 tracking-wider block mb-1">
                    Puntos de Pulso Clave
                  </span>
                  <p className="text-xs text-zinc-300">{sprayAdvice.points}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-850">
                  <span className="text-[10px] font-semibold uppercase text-gold-400 tracking-wider block mb-1">
                    Familia de Mayor Rendimiento
                  </span>
                  <p className="text-xs text-zinc-300">{sprayAdvice.bestFamily}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Fragrances that excel today */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 text-center mb-6">
            Fragancias con Rendimiento Sobresaliente para estas Condiciones
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {weatherPerfumes.map(perfume => (
              <div
                key={perfume.id}
                className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition flex flex-col justify-between group shadow-xl"
              >
                <div className="flex gap-3.5 items-center mb-3">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-850 shrink-0">
                    <Image
                      src={perfume.image}
                      alt={perfume.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-gold-400 truncate block">
                      {perfume.brand}
                    </span>
                    <h5 className="text-xs font-semibold text-zinc-100 truncate mt-0.5">
                      {perfume.name}
                    </h5>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {perfume.family}
                    </p>
                    <p className="text-xs font-serif font-bold text-zinc-100 mt-1">
                      {formatCLP(perfume.price)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-900 text-xs">
                  <button
                    onClick={() => openQuickView(perfume)}
                    className="py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-center border border-zinc-800 text-[11px]"
                  >
                    Ver Notas
                  </button>
                  <button
                    onClick={() => addToCart(perfume)}
                    className="py-2 rounded-lg bg-zinc-100 hover:bg-gold-400 text-black font-semibold text-center text-[11px] transition flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Llevar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
