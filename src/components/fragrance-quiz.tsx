'use client';

import React, { useState } from 'react';
import { Perfume, QuizPreferences } from '@/types/perfume';
import { getQuizRecommendations } from '@/lib/recommendation-engine';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import { Compass, Check, ArrowRight, RotateCcw, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface FragranceQuizProps {
  perfumes: Perfume[];
}

export function FragranceQuiz({ perfumes }: FragranceQuizProps) {
  const { addToCart, openQuickView } = useCart();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<QuizPreferences>({
    gender: 'Todos',
    occasion: 'Cualquiera',
    family: 'Cualquiera',
    budget: 'Cualquiera'
  });
  const [showResults, setShowResults] = useState(false);

  const totalSteps = 4;

  const handleSelectOption = (key: keyof QuizPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setPreferences({
      gender: 'Todos',
      occasion: 'Cualquiera',
      family: 'Cualquiera',
      budget: 'Cualquiera'
    });
    setStep(1);
    setShowResults(false);
  };

  const recommendedPerfumes = showResults
    ? getQuizRecommendations(perfumes, preferences, 4)
    : [];

  return (
    <section id="sommelier-quiz" className="py-20 bg-[#060608] border-t border-zinc-900 scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] font-medium tracking-[0.3em] text-zinc-400 uppercase mb-3">
            Diagnóstico de Preferencias Olfativas
          </p>

          <h2 className="font-serif text-3xl sm:text-5xl font-light text-zinc-100 leading-[1.2]">
            Descubre tu Firma Personal <br />
            <span className="italic text-gold-gradient font-normal">En Cuatro Pasos Simples.</span>
          </h2>

          <p className="mt-4 text-sm text-zinc-400 font-light leading-relaxed">
            Responde las preguntas de nuestro test sensorial para filtrar entre las opciones con mejor calificación y rendimiento en piel.
          </p>
        </div>

        {!showResults ? (
          <div className="p-6 sm:p-10 rounded-2xl bg-zinc-950 border border-zinc-850 shadow-2xl">
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
              <span className="text-[11px] uppercase tracking-wider">Paso {step} de {totalSteps}</span>
              <span className="text-gold-400 font-medium text-[11px]">{Math.round((step / totalSteps) * 100)}% Completado</span>
            </div>
            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-8">
              <div
                className="bg-gold-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>

            {/* STEP 1: GÉNERO */}
            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-base sm:text-lg font-serif font-normal text-zinc-100 text-center mb-6">
                  1. ¿Para quién buscas este perfume?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Hombre', desc: 'Aromas masculinos, intensos y magnéticos', val: 'Hombre' },
                    { label: 'Mujer', desc: 'Aromas florales, gourmand y envolventes', val: 'Mujer' },
                    { label: 'Unisex / Sin Género', desc: 'Alta versatilidad y elegancia moderna', val: 'Unisex' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('gender', opt.val)}
                      className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-gold-500/50 hover:bg-zinc-900 transition text-left group"
                    >
                      <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-gold-300 transition">
                        {opt.label}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: OCASIÓN */}
            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-base sm:text-lg font-serif font-normal text-zinc-100 text-center mb-6">
                  2. ¿En qué momentos te gustaría usarlo principalmente?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Noche, Citas & Fiesta', desc: 'Alta proyección, seductor y llamativo', val: 'Noche' },
                    { label: 'Uso Diario & Oficina', desc: 'Limpio, elegante y discreto', val: 'Oficina' },
                    { label: 'Verano & Clima Cálido', desc: 'Fresco, acuático y cítrico revitalizante', val: 'Verano' },
                    { label: 'Firma / Cualquier Momento', desc: 'Totalmente versátil para todo el año', val: 'Versátil' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('occasion', opt.val)}
                      className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-gold-500/50 hover:bg-zinc-900 transition text-left group"
                    >
                      <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-gold-300 transition">
                        {opt.label}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: FAMILIA OLFATIVA */}
            {step === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-base sm:text-lg font-serif font-normal text-zinc-100 text-center mb-6">
                  3. ¿Qué familia de acordes prefieres destacar?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Ámbar & Vainilla', desc: 'Cálido, sensual, dulce y exótico', val: 'Oriental / Ámbar' },
                    { label: 'Maderas Nobles', desc: 'Cedro, sándalo, sobrio y varonil', val: 'Amaderada' },
                    { label: 'Cítricos & Frescura', desc: 'Bergamota, notas marinas y chispeantes', val: 'Cítrica / Fresca' },
                    { label: 'Gourmand & Dulce', desc: 'Caramelo, praliné, chocolate y café', val: 'Gourmand / Dulce' },
                    { label: 'Cuero & Especias', desc: 'Canela, pimienta negra, tabaco y cuero', val: 'Cuero / Especiada' },
                    { label: 'Cualquier Familia', desc: 'Sorpréndeme con los más elogiados', val: 'Cualquiera' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('family', opt.val)}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-gold-500/50 hover:bg-zinc-900 transition text-left group"
                    >
                      <h4 className="text-xs font-semibold text-zinc-100 group-hover:text-gold-300 transition">
                        {opt.label}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: PRESUPUESTO */}
            {step === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-base sm:text-lg font-serif font-normal text-zinc-100 text-center mb-6">
                  4. ¿Qué rango de inversión buscas?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Económico', desc: 'Menos de $40.000 CLP (Máximo rendimiento por valor)', val: 'Económico (< $40.000)' },
                    { label: 'Gama Media', desc: '$40.000 - $70.000 CLP (Joyas árabes y diseñador)', val: 'Gama Media ($40.000 - $70.000)' },
                    { label: 'Gama Alta / Nicho', desc: 'Más de $70.000 CLP (Extractos puros y exclusivos)', val: 'Gama Alta / Nicho (> $70.000)' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('budget', opt.val)}
                      className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-gold-500/50 hover:bg-zinc-900 transition text-left group"
                    >
                      <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-gold-300 transition">
                        {opt.label}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* RESULTS */
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950 border border-zinc-850">
              <div>
                <span className="text-[10px] font-semibold text-gold-400 uppercase tracking-widest">
                  Resultados del Diagnóstico
                </span>
                <h3 className="text-lg font-serif text-zinc-100">
                  Tus Mejores Opciones Encontradas
                </h3>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs uppercase tracking-wider font-medium border border-zinc-800 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gold-400" />
                <span>Repetir Quiz</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedPerfumes.map(perfume => (
                <div
                  key={perfume.id}
                  className="p-5 rounded-2xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-900 mb-3 border border-zinc-850">
                      <Image
                        src={perfume.image}
                        alt={perfume.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-gold-300 text-[10px] font-bold">
                        98% Afín
                      </span>
                    </div>

                    <span className="text-[10px] uppercase font-bold text-gold-400 block truncate">
                      {perfume.brand}
                    </span>
                    <h4 className="text-xs font-semibold text-zinc-100 truncate mt-0.5">
                      {perfume.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      {perfume.family}
                    </p>
                    <p className="text-sm font-serif font-bold text-zinc-100 mt-2">
                      {formatCLP(perfume.price)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-850 text-xs">
                    <button
                      onClick={() => openQuickView(perfume)}
                      className="py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-center border border-zinc-800 text-[11px]"
                    >
                      Notas
                    </button>
                    <button
                      onClick={() => addToCart(perfume)}
                      className="py-2 rounded-lg bg-zinc-100 hover:bg-gold-400 text-black font-semibold text-center text-[11px] transition flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Comprar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
