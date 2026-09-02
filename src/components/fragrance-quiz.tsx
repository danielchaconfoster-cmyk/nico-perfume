'use client';

import React, { useState } from 'react';
import { Perfume, QuizPreferences } from '@/types/perfume';
import { getQuizRecommendations } from '@/lib/recommendation-engine';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import { Compass, Sparkles, Check, ArrowRight, RotateCcw, ShoppingBag, Eye } from 'lucide-react';
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
    <section id="sommelier-quiz" className="py-20 bg-zinc-950 border-y border-zinc-800/80 scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-4">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Quiz Sommelier 30 Segundos</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-zinc-100">
            ¿No sabes qué perfume elegir? <br />
            <span className="italic text-gold-gradient font-normal">Te guiamos paso a paso.</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400">
            Responde 4 preguntas rápidas y nuestro sommelier te presentará tus fragancias ganadoras.
          </p>
        </div>

        {!showResults ? (
          <div className="p-6 sm:p-10 rounded-3xl bg-zinc-900/60 border border-gold-500/20 shadow-2xl backdrop-blur-md">
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
              <span>Paso {step} de {totalSteps}</span>
              <span className="text-gold-400 font-semibold">{Math.round((step / totalSteps) * 100)}% Completado</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-8">
              <div
                className="bg-gradient-to-r from-gold-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>

            {/* STEP 1: GÉNERO */}
            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg sm:text-xl font-medium text-zinc-100 text-center mb-6">
                  1. ¿Para quién buscas este perfume?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Hombre', desc: 'Aromas masculinos, intensos y magnéticos', val: 'Hombre', icon: '👔' },
                    { label: 'Mujer', desc: 'Aromas florales, gourmand y seductores', val: 'Mujer', icon: '✨' },
                    { label: 'Unisex / Sin Género', desc: 'Alta versatilidad y elegancia moderna', val: 'Unisex', icon: '🌟' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('gender', opt.val)}
                      className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-gold-500/60 hover:bg-zinc-900 transition text-left group"
                    >
                      <span className="text-2xl mb-2 block">{opt.icon}</span>
                      <h4 className="text-base font-semibold text-zinc-100 group-hover:text-gold-300 transition">
                        {opt.label}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: OCASIÓN */}
            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg sm:text-xl font-medium text-zinc-100 text-center mb-6">
                  2. ¿En qué momentos te gustaría usarlo más?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Noche, Citas & Fiesta', desc: 'Alta proyección, seductor y llamativo', val: 'Noche', icon: '🌙' },
                    { label: 'Uso Diario & Oficina', desc: 'Limpio, elegante, no empalagoso', val: 'Oficina', icon: '💼' },
                    { label: 'Verano & Clima Cálido', desc: 'Fresco, acuático y cítrico revitalizante', val: 'Verano', icon: '☀️' },
                    { label: 'Firma / Cualquier Momento', desc: 'Totalmente versátil para todo el año', val: 'Versátil', icon: '🎯' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('occasion', opt.val)}
                      className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-gold-500/60 hover:bg-zinc-900 transition text-left group"
                    >
                      <span className="text-2xl mb-2 block">{opt.icon}</span>
                      <h4 className="text-base font-semibold text-zinc-100 group-hover:text-gold-300 transition">
                        {opt.label}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: FAMILIA OLFATIVA */}
            {step === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg sm:text-xl font-medium text-zinc-100 text-center mb-6">
                  3. ¿Qué sensación de aroma prefieres sentir?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Ámbar & Vainilla', desc: 'Cálido, sensual, dulce y exótico', val: 'Oriental / Ámbar', icon: '🏺' },
                    { label: 'Maderas Nobles', desc: 'Cedro, sándalo, sobrio y varonil', val: 'Amaderada', icon: '🌲' },
                    { label: 'Cítricos & Frescura', desc: 'Bergamota, notas marinas y chispeantes', val: 'Cítrica / Fresca', icon: '🍋' },
                    { label: 'Gourmand & Dulce', desc: 'Caramelo, praliné, chocolate y café', val: 'Gourmand / Dulce', icon: '🍫' },
                    { label: 'Cuero & Especias', desc: 'Canela, pimienta negra, tabaco y cuero', val: 'Cuero / Especiada', icon: '🔥' },
                    { label: 'Cualquier Familia', desc: 'Sorpréndeme con los más elogiados', val: 'Cualquiera', icon: '✨' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('family', opt.val)}
                      className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-gold-500/60 hover:bg-zinc-900 transition text-left group"
                    >
                      <span className="text-xl mb-1 block">{opt.icon}</span>
                      <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-gold-300 transition">
                        {opt.label}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: PRESUPUESTO */}
            {step === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg sm:text-xl font-medium text-zinc-100 text-center mb-6">
                  4. ¿Qué rango de inversión buscas?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Económico', desc: 'Menos de $40.000 CLP (Máximo valor por tu dinero)', val: 'Económico (< $40.000)', icon: '🏷️' },
                    { label: 'Gama Media', desc: '$40.000 - $70.000 CLP (Joyas árabes y diseñadores TOP)', val: 'Gama Media ($40.000 - $70.000)', icon: '💎' },
                    { label: 'Alta Gama & Nicho', desc: 'Más de $70.000 CLP (Extrait de parfum y exclusividad)', val: 'Alta Gama (> $70.000)', icon: '👑' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('budget', opt.val)}
                      className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-gold-500/60 hover:bg-zinc-900 transition text-left group"
                    >
                      <span className="text-2xl mb-2 block">{opt.icon}</span>
                      <h4 className="text-base font-semibold text-zinc-100 group-hover:text-gold-300 transition">
                        {opt.label}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Results Screen */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-gold-500/30 mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                <div>
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Selección Personalizada de Sommelier
                  </span>
                  <h3 className="font-serif text-2xl text-zinc-100 mt-1">
                    Tus Mejores Opciones Encontradas
                  </h3>
                </div>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-700/80 text-zinc-300 hover:text-gold-400 text-xs font-medium transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repetir Quiz</span>
                </button>
              </div>

              {/* Recommended Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
                {recommendedPerfumes.map(p => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-gold-500/50 transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-zinc-900 mb-3 border border-zinc-800">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-500"
                        />
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                          98% Afín
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider">
                        {p.brand}
                      </span>
                      <h4 className="text-sm font-medium text-zinc-100 line-clamp-2 mt-0.5">
                        {p.name}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">
                        {p.family} • {p.volume}ml
                      </p>
                      <div className="mt-2 text-base font-bold text-zinc-100 font-serif">
                        {formatCLP(p.price)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-800/80">
                      <button
                        onClick={() => openQuickView(p)}
                        className="py-2 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium text-center transition"
                      >
                        Ver Ficha
                      </button>
                      <button
                        onClick={() => addToCart(p)}
                        className="py-2 px-2 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 hover:brightness-110 text-black text-xs font-bold text-center transition"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
