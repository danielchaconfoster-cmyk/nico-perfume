'use client';

import React, { useState } from 'react';
import { Perfume } from '@/types/perfume';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import {
  CloudSun,
  Droplets,
  Wind,
  Sparkles,
  MapPin,
  Flame,
  CheckCircle2,
  ShoppingBag,
  Info
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
      advice: 'En altas temperaturas los aceites se evaporan rápidamente y proyectan con más violencia. Aplica menos sprays para no fatigar el olfato ajeno.',
      points: 'Base del cuello, parte posterior de los codos y pecho.',
      bestFamily: 'Cítrica / Fresca',
      avoid: 'Evitar perfumes excesivamente dulces o cueros pesados.'
    },
    moderado: {
      sprays: '4 - 5 Atomizaciones',
      advice: 'Clima ideal donde casi cualquier fragancia se desempeña en su punto óptimo de fijación y estela.',
      points: 'Lados del cuello, detrás de las orejas y muñecas.',
      bestFamily: 'Aromática / Fougère',
      avoid: 'Ninguna restricción, excelente para versátiles.'
    },
    fresco: {
      sprays: '5 - 6 Atomizaciones',
      advice: 'Las temperaturas frescas ralentizan la evaporación, lo que permite que las notas de fondo amaderadas y ambaradas brillen durante más de 12 horas.',
      points: 'Cuello, clavículas, muñecas y una atomización en la ropa (abrigo o bufanda).',
      bestFamily: 'Amaderada',
      avoid: 'Los perfumes ultra acuáticos pueden perder algo de proyección.'
    },
    frio: {
      sprays: '6 - 7 Atomizaciones',
      advice: 'El frío comprime las moléculas aromáticas. Es el momento perfecto para usar las "bestias negras" de vainilla, oud, especias y cuero.',
      points: 'Cuello, nuca, muñecas, pecho y hombros sobre la ropa.',
      bestFamily: 'Oriental / Ámbar',
      avoid: 'Evita cítricos ligeros; no tendrán fuerza suficiente.'
    }
  }[selectedTemp as 'calor' | 'moderado' | 'fresco' | 'frio'];

  // Filter recommended perfumes for today's weather
  const weatherPerfumes = perfumes
    .filter(p => {
      if (selectedTemp === 'calor') return p.family === 'Cítrica / Fresca' || p.vibe.includes('Fresco');
      if (selectedTemp === 'frio') return p.family === 'Oriental / Ámbar' || p.family === 'Cuero / Especiada' || p.family === 'Gourmand / Dulce';
      if (selectedTemp === 'fresco') return p.family === 'Amaderada' || p.family === 'Oriental / Ámbar';
      return p.family === 'Aromática / Fougère' || p.vibe.includes('Versátil');
    })
    .slice(0, 3);

  return (
    <section id="clima-olfativo" className="py-20 bg-gradient-to-b from-zinc-950 via-[#0a0a0f] to-zinc-950 border-t border-zinc-800/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-300 text-xs font-bold tracking-wider uppercase mb-4">
            <CloudSun className="w-4 h-4 text-blue-400" />
            <span>Aplicación Interactiva: Asesor de Clima & Atomizaciones</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-light text-zinc-100">
            ¿Cuántos Sprays Aplicar Hoy? <br />
            <span className="italic text-gold-gradient font-normal">Calculador de Fijación en Chile.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            La temperatura y la humedad cambian radicalmente la proyección de un perfume. Selecciona tu ciudad y el clima de hoy para calcular tus atomizaciones perfectas.
          </p>
        </div>

        {/* Interactive App Workspace */}
        <div className="p-6 sm:p-10 rounded-3xl bg-zinc-900/60 border border-gold-500/30 shadow-2xl backdrop-blur-md max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-zinc-800">
            {/* City Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold-400 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> 1. Tu Ciudad en Chile
              </label>
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700/80 text-zinc-200 text-xs rounded-xl p-3 focus:outline-none focus:border-gold-500"
              >
                <option value="Santiago (RM)">Santiago (Región Metropolitana)</option>
                <option value="Viña del Mar / Valparaíso">Viña del Mar / Valparaíso (Costero)</option>
                <option value="Concepción">Concepción / Biobío</option>
                <option value="Antofagasta / Iquique">Norte Grande (Antofagasta / Iquique)</option>
                <option value="La Serena / Coquimbo">La Serena / Coquimbo</option>
                <option value="Temuco / Valdivia">Sur (Temuco / Valdivia / P. Montt)</option>
                <option value="Punta Arenas">Punta Arenas / Magallanes (Frío Extremo)</option>
              </select>
            </div>

            {/* Temperature / Climate Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold-400 mb-2 flex items-center gap-1.5">
                <CloudSun className="w-3.5 h-3.5" /> 2. Clima / Temperatura
              </label>
              <select
                value={selectedTemp}
                onChange={e => setSelectedTemp(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700/80 text-zinc-200 text-xs rounded-xl p-3 focus:outline-none focus:border-gold-500"
              >
                <option value="calor">☀️ Calor Intenso (&gt; 27°C)</option>
                <option value="moderado">🌤️ Templado / Agradable (18°C - 24°C)</option>
                <option value="fresco">🍂 Fresco / Otoño (12°C - 17°C)</option>
                <option value="frio">❄️ Frío / Invierno (&lt; 10°C)</option>
              </select>
            </div>

            {/* Context / Ocasion */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold-400 mb-2 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5" /> 3. Entorno de Uso
              </label>
              <select
                value={selectedContext}
                onChange={e => setSelectedContext(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700/80 text-zinc-200 text-xs rounded-xl p-3 focus:outline-none focus:border-gold-500"
              >
                <option value="oficina">💼 Oficina / Espacio Cerrado</option>
                <option value="cita">🌙 Cita Romántica / Noche</option>
                <option value="fiesta">🔥 Fiesta / Evento concurrido</option>
                <option value="aire-libre">🌲 Al Aire Libre / Paseo</option>
              </select>
            </div>
          </div>

          {/* Results: Spray Formula & Body Points */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center mb-8">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-gold-500/40 text-center">
              <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest">
                Dosis Recomendada Hoy
              </span>
              <h3 className="text-3xl font-serif font-bold text-zinc-100 mt-2 text-gold-gradient">
                {sprayAdvice.sprays}
              </h3>
              <p className="text-xs text-zinc-400 mt-2">
                Para {selectedCity} bajo clima {selectedTemp} en {selectedContext}.
              </p>
            </div>

            <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-zinc-100">Puntos de aplicación:</strong> {sprayAdvice.points}</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-zinc-100">Estrategia olfativa:</strong> {sprayAdvice.advice}</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-400 text-[11px] pt-1">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{sprayAdvice.avoid}</span>
              </div>
            </div>
          </div>

          {/* Recommended Fragrances for this Weather */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Fragancias Ganadoras para este Clima
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {weatherPerfumes.map(p => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-gold-500/40 transition flex flex-col justify-between group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-gold-400 uppercase truncate block">{p.brand}</span>
                      <h5 className="text-xs font-semibold text-zinc-100 truncate">{p.name}</h5>
                      <span className="text-xs font-bold text-zinc-200 font-serif mt-1 block">{formatCLP(p.price)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-900 text-xs">
                    <button
                      onClick={() => openQuickView(p)}
                      className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-medium text-center transition"
                    >
                      Ficha
                    </button>
                    <button
                      onClick={() => addToCart(p)}
                      className="py-1.5 px-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-[11px] font-bold text-center transition"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
