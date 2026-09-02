'use client';

import React, { useState, useMemo } from 'react';
import { Perfume, RecommendationResult } from '@/types/perfume';
import { getTwinPerfumeRecommendations } from '@/lib/recommendation-engine';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import {
  Search,
  X,
  Plus,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Eye,
  ShoppingBag,
  Layers,
  Heart,
  FlaskConical,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';

interface FragranceMatchmakerProps {
  perfumes: Perfume[];
}

export function FragranceMatchmaker({ perfumes }: FragranceMatchmakerProps) {
  const { addToCart, openQuickView, toggleWishlist, isInWishlist, addToCompare } = useCart();

  // Selected perfumes (up to 2)
  const [selectedPerfumes, setSelectedPerfumes] = useState<Perfume[]>([]);
  
  // Search queries for selector dropdowns
  const [searchQuery1, setSearchQuery1] = useState('');
  const [isDropdown1Open, setIsDropdown1Open] = useState(false);

  const [searchQuery2, setSearchQuery2] = useState('');
  const [isDropdown2Open, setIsDropdown2Open] = useState(false);

  // Search filtered options
  const filteredOptions1 = useMemo(() => {
    if (!searchQuery1.trim()) return perfumes.slice(0, 10);
    const q = searchQuery1.toLowerCase();
    return perfumes.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [perfumes, searchQuery1]);

  const filteredOptions2 = useMemo(() => {
    if (!searchQuery2.trim()) return perfumes.slice(0, 10);
    const q = searchQuery2.toLowerCase();
    const firstId = selectedPerfumes[0]?.id;
    return perfumes.filter(
      p =>
        p.id !== firstId &&
        (p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.fullName.toLowerCase().includes(q))
    ).slice(0, 10);
  }, [perfumes, searchQuery2, selectedPerfumes]);

  // Generate recommendations
  const recommendations: RecommendationResult[] = useMemo(() => {
    if (selectedPerfumes.length === 0) return [];
    return getTwinPerfumeRecommendations(perfumes, selectedPerfumes, 6);
  }, [perfumes, selectedPerfumes]);

  // Preset Selection Handlers (Clean, no emojis)
  const handleSelectPreset = (name1: string, name2?: string) => {
    const p1 = perfumes.find(p => p.name.toLowerCase().includes(name1.toLowerCase()));
    const p2 = name2 ? perfumes.find(p => p.name.toLowerCase().includes(name2.toLowerCase())) : undefined;
    const list: Perfume[] = [];
    if (p1) list.push(p1);
    if (p2) list.push(p2);
    setSelectedPerfumes(list);
    setSearchQuery1('');
    setSearchQuery2('');
  };

  const handleSelectSlot1 = (p: Perfume) => {
    setSelectedPerfumes(prev => {
      const remaining = prev.filter(item => item.id !== p.id);
      return [p, ...remaining].slice(0, 2);
    });
    setSearchQuery1('');
    setIsDropdown1Open(false);
  };

  const handleSelectSlot2 = (p: Perfume) => {
    setSelectedPerfumes(prev => {
      if (prev.length === 0) return [p];
      return [prev[0], p];
    });
    setSearchQuery2('');
    setIsDropdown2Open(false);
  };

  const removeSlot = (index: number) => {
    setSelectedPerfumes(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <section id="recomendador" className="py-20 bg-[#060609] relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-[11px] font-medium tracking-[0.3em] text-gold-400 uppercase mb-3">
            Laboratoire Olfactif • Estudio de Afinidad
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-zinc-100">
            Encuentra tu <span className="italic text-gold-gradient font-normal">Fragancia Gemela</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Selecciona uno o dos perfumes que utilices habitualmente. Nuestro motor analiza pirámides de notas, familias de acordes y concentración para descubrir fragancias con un ADN aromático equivalente.
          </p>
        </div>

        {/* Preset Selections (Editorial Minimalist Tabs) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-xs">
          <span className="text-zinc-500 mr-2 text-[11px] tracking-wider uppercase font-medium">
            Selecciones Rápidas:
          </span>
          <button
            onClick={() => handleSelectPreset('9 PM', 'Amber Oud')}
            className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-gold-500/40 transition text-xs"
          >
            Afnan 9 PM + Amber Oud
          </button>
          <button
            onClick={() => handleSelectPreset('King', 'Wanted')}
            className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-gold-500/40 transition text-xs"
          >
            Bharara King + Azzaro Wanted
          </button>
          <button
            onClick={() => handleSelectPreset('CK One')}
            className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-gold-500/40 transition text-xs"
          >
            Calvin Klein CK One (Fresco Diario)
          </button>
        </div>

        {/* Twin Selector Interactive Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-14">
          {/* SLOT 1 */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition relative flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 text-gold-300 flex items-center justify-center text-[10px] font-bold">1</span>
                  Primer Perfume de Referencia
                </span>
                {selectedPerfumes[0] && (
                  <button
                    onClick={() => removeSlot(0)}
                    className="text-xs text-zinc-400 hover:text-rose-400 transition flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Cambiar
                  </button>
                )}
              </div>

              {selectedPerfumes[0] ? (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <div className="w-16 h-20 relative rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                    <Image
                      src={selectedPerfumes[0].image}
                      alt={selectedPerfumes[0].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold">
                      {selectedPerfumes[0].brand}
                    </span>
                    <h4 className="text-sm font-semibold text-zinc-100 truncate mt-0.5">
                      {selectedPerfumes[0].name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      {selectedPerfumes[0].family} • {selectedPerfumes[0].volume}ml
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre o marca (ej: 9 PM, Sauvage, King)..."
                      value={searchQuery1}
                      onChange={e => {
                        setSearchQuery1(e.target.value);
                        setIsDropdown1Open(true);
                      }}
                      onFocus={() => setIsDropdown1Open(true)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-gold-500 transition"
                    />
                  </div>

                  {isDropdown1Open && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-1.5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl max-h-56 overflow-y-auto z-20">
                      {filteredOptions1.length === 0 ? (
                        <p className="text-xs text-zinc-500 p-3 text-center">No encontramos coincidencias</p>
                      ) : (
                        filteredOptions1.map(p => (
                          <button
                            key={p.id}
                            onClick={() => handleSelectSlot1(p)}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-900 text-left text-xs text-zinc-300 hover:text-white transition group"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="text-[10px] uppercase font-bold text-gold-400 block truncate">{p.brand}</span>
                              <span className="font-medium text-zinc-200 group-hover:text-gold-300 truncate block">{p.name}</span>
                            </div>
                            <span className="text-[11px] text-zinc-500 shrink-0 font-serif">{formatCLP(p.price)}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-zinc-500">
              {selectedPerfumes[0] ? 'Perfume fijado como base de notas' : 'Escribe para elegir tu fragancia base'}
            </div>
          </div>

          {/* SLOT 2 */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition relative flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center text-[10px] font-bold">2</span>
                  Segundo Perfume (Fusión Opcional)
                </span>
                {selectedPerfumes[1] && (
                  <button
                    onClick={() => removeSlot(1)}
                    className="text-xs text-zinc-400 hover:text-rose-400 transition flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Quitar
                  </button>
                )}
              </div>

              {selectedPerfumes[1] ? (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <div className="w-16 h-20 relative rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                    <Image
                      src={selectedPerfumes[1].image}
                      alt={selectedPerfumes[1].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold">
                      {selectedPerfumes[1].brand}
                    </span>
                    <h4 className="text-sm font-semibold text-zinc-100 truncate mt-0.5">
                      {selectedPerfumes[1].name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      {selectedPerfumes[1].family} • {selectedPerfumes[1].volume}ml
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Añade un segundo perfume para fusionar aromas..."
                      value={searchQuery2}
                      onChange={e => {
                        setSearchQuery2(e.target.value);
                        setIsDropdown2Open(true);
                      }}
                      onFocus={() => setIsDropdown2Open(true)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-gold-500 transition"
                    />
                  </div>

                  {isDropdown2Open && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-1.5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl max-h-56 overflow-y-auto z-20">
                      {filteredOptions2.length === 0 ? (
                        <p className="text-xs text-zinc-500 p-3 text-center">No encontramos coincidencias</p>
                      ) : (
                        filteredOptions2.map(p => (
                          <button
                            key={p.id}
                            onClick={() => handleSelectSlot2(p)}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-900 text-left text-xs text-zinc-300 hover:text-white transition group"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="text-[10px] uppercase font-bold text-gold-400 block truncate">{p.brand}</span>
                              <span className="font-medium text-zinc-200 group-hover:text-gold-300 truncate block">{p.name}</span>
                            </div>
                            <span className="text-[11px] text-zinc-500 shrink-0 font-serif">{formatCLP(p.price)}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-zinc-500">
              {selectedPerfumes[1]
                ? 'Fusión dual activa: balanceando acordes de ambos perfumes'
                : 'Opcional: fusiona 2 perfumes para encontrar el punto medio exacto'}
            </div>
          </div>
        </div>

        {/* Recommendation Results Showcase */}
        {selectedPerfumes.length > 0 && recommendations.length > 0 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-zinc-100">
                Fragancias Recomendadas con Mayor Afinidad
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-lg mx-auto">
                Basadas en la intersección de pirámides olfativas y fijación de{' '}
                <strong className="text-zinc-200 font-semibold">{selectedPerfumes.map(p => p.name).join(' y ')}</strong>.
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(({ perfume, matchScore, reasons, matchingNotes }) => {
                const inWishlist = isInWishlist(perfume.id);

                return (
                  <div
                    key={perfume.id}
                    className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-gold-500/40 transition duration-300 flex flex-col justify-between group shadow-xl"
                  >
                    <div>
                      {/* Top Bar: Match Score */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] tracking-[0.1em] uppercase font-bold text-gold-300">
                          {matchScore}% Match Olfativo
                        </span>
                        <button
                          onClick={() => toggleWishlist(perfume.id)}
                          className={`p-2 rounded-full border transition ${
                            inWishlist
                              ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-rose-400'
                          }`}
                          aria-label="Añadir a favoritos"
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>

                      {/* Product Thumbnail & Details */}
                      <div className="flex gap-4 mb-4">
                        <div className="relative w-20 h-28 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-850">
                          <Image
                            src={perfume.image}
                            alt={perfume.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase font-bold text-gold-400 block truncate">
                            {perfume.brand}
                          </span>
                          <h4 className="text-sm font-semibold text-zinc-100 line-clamp-2 mt-0.5">
                            {perfume.name}
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1">
                            {perfume.family} • {perfume.concentration}
                          </p>
                          <div className="mt-2 text-base font-bold text-zinc-100 font-serif">
                            {formatCLP(perfume.price)}
                          </div>
                        </div>
                      </div>

                      {/* Why it matches */}
                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-850 space-y-1.5 text-xs text-zinc-300">
                        <p className="text-[10px] font-semibold text-gold-400 uppercase tracking-wider">
                          ¿Por qué es tu fragancia gemela?
                        </p>
                        {reasons.slice(0, 2).map((reason, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-zinc-300 leading-snug">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-850 text-xs">
                      <button
                        onClick={() => openQuickView(perfume)}
                        className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium text-center border border-zinc-800 transition"
                      >
                        Ver Notas
                      </button>
                      <button
                        onClick={() => addToCart(perfume)}
                        className="py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-gold-400 text-black font-semibold text-center transition flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Comprar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
