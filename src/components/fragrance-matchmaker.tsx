'use client';

import React, { useState, useMemo } from 'react';
import { Perfume, RecommendationResult } from '@/types/perfume';
import { getTwinPerfumeRecommendations } from '@/lib/recommendation-engine';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import {
  Sparkles,
  Search,
  X,
  Plus,
  ArrowRight,
  Flame,
  CheckCircle2,
  HelpCircle,
  Eye,
  ShoppingBag,
  Layers,
  Heart
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

  // Compute recommendations
  const recommendations: RecommendationResult[] = useMemo(() => {
    if (selectedPerfumes.length === 0) return [];
    return getTwinPerfumeRecommendations(perfumes, selectedPerfumes, 6);
  }, [perfumes, selectedPerfumes]);

  // Quick preset selections
  const handleSelectPreset = (p1Name: string, p2Name?: string) => {
    const p1 = perfumes.find(p => p.name.toLowerCase().includes(p1Name.toLowerCase()) || p.fullName.toLowerCase().includes(p1Name.toLowerCase()));
    const p2 = p2Name ? perfumes.find(p => p.name.toLowerCase().includes(p2Name.toLowerCase()) || p.fullName.toLowerCase().includes(p2Name.toLowerCase())) : undefined;

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
    <section id="recomendador" className="py-20 bg-gradient-to-b from-[#08080a] via-[#0d0d12] to-[#08080a] relative scroll-mt-16">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gold-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-950/80 border border-gold-500/40 text-gold-300 text-xs font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Motor de Afinidad Olfativa</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-zinc-100">
            Encuentra tu <span className="italic text-gold-gradient font-normal">Fragancia Gemela</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            ¿Tienes uno o dos perfumes favoritos y quieres descubrir nuevas opciones con el mismo ADN olfativo? Selecciónalos abajo y nuestro algoritmo analizará más de 1.300 perfumes por familia de notas, intensidad y acordes.
          </p>
        </div>

        {/* Preset Quick Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs">
          <span className="text-zinc-400 mr-2 flex items-center gap-1 font-medium">
            <Flame className="w-3.5 h-3.5 text-gold-400" /> Combos Virales:
          </span>
          <button
            onClick={() => handleSelectPreset('9 PM', 'Amber Oud')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 hover:border-gold-500/50 transition"
          >
            🔥 Afnan 9 PM + Amber Oud
          </button>
          <button
            onClick={() => handleSelectPreset('King', 'Wanted')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 hover:border-gold-500/50 transition"
          >
            👑 Bharara King + Azzaro Wanted
          </button>
          <button
            onClick={() => handleSelectPreset('CK One')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 hover:border-gold-500/50 transition"
          >
            🌿 Solo CK One (Fresco Diario)
          </button>
        </div>

        {/* Twin Selector Interactive Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-14">
          {/* SLOT 1 */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-gold-500/30 backdrop-blur-sm relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center text-[11px] font-bold">1</span>
                  Primer Perfume Favorito
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
                <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950/80 border border-gold-500/40">
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                    <Image
                      src={selectedPerfumes[0].image}
                      alt={selectedPerfumes[0].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] uppercase tracking-wider text-gold-400 font-semibold">
                      {selectedPerfumes[0].brand}
                    </span>
                    <h4 className="text-sm font-medium text-zinc-100 truncate">
                      {selectedPerfumes[0].name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
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
                      placeholder="Busca tu perfume (ej: 9 PM, Sauvage, King)..."
                      value={searchQuery1}
                      onFocus={() => setIsDropdown1Open(true)}
                      onChange={e => {
                        setSearchQuery1(e.target.value);
                        setIsDropdown1Open(true);
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950/90 border border-zinc-700/80 text-zinc-100 text-sm focus:outline-none focus:border-gold-500 transition"
                    />
                  </div>

                  {/* Dropdown Options */}
                  {isDropdown1Open && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-30 max-h-60 overflow-y-auto rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl divide-y divide-zinc-900">
                      {filteredOptions1.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleSelectSlot1(p)}
                          className="w-full text-left p-3 hover:bg-zinc-900/90 transition flex items-center justify-between group"
                        >
                          <div>
                            <p className="text-xs font-semibold text-gold-400">{p.brand}</p>
                            <p className="text-sm text-zinc-200 group-hover:text-gold-300 font-medium truncate">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-zinc-400">{p.family} • {p.gender}</p>
                          </div>
                          <Plus className="w-4 h-4 text-zinc-500 group-hover:text-gold-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 mt-4">
              {selectedPerfumes[0] ? '✓ Perfume de referencia seleccionado' : 'Elige el aroma que más disfrutas usar'}
            </p>
          </div>

          {/* SLOT 2 (Dual Match Option) */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-[11px] font-bold">2</span>
                  Segundo Perfume (Opcional - Fusión)
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
                <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950/80 border border-zinc-700/80">
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                    <Image
                      src={selectedPerfumes[1].image}
                      alt={selectedPerfumes[1].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] uppercase tracking-wider text-gold-400 font-semibold">
                      {selectedPerfumes[1].brand}
                    </span>
                    <h4 className="text-sm font-medium text-zinc-100 truncate">
                      {selectedPerfumes[1].name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
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
                      placeholder="Agrega un 2do perfume para fusionar aromas..."
                      value={searchQuery2}
                      onFocus={() => setIsDropdown2Open(true)}
                      onChange={e => {
                        setSearchQuery2(e.target.value);
                        setIsDropdown2Open(true);
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950/90 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-gold-500 transition"
                    />
                  </div>

                  {/* Dropdown Options */}
                  {isDropdown2Open && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-30 max-h-60 overflow-y-auto rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl divide-y divide-zinc-900">
                      {filteredOptions2.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleSelectSlot2(p)}
                          className="w-full text-left p-3 hover:bg-zinc-900/90 transition flex items-center justify-between group"
                        >
                          <div>
                            <p className="text-xs font-semibold text-gold-400">{p.brand}</p>
                            <p className="text-sm text-zinc-200 group-hover:text-gold-300 font-medium truncate">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-zinc-400">{p.family} • {p.gender}</p>
                          </div>
                          <Plus className="w-4 h-4 text-zinc-500 group-hover:text-gold-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 mt-4">
              Combina dos fragancias para encontrar el punto medio exacto de aroma
            </p>
          </div>
        </div>

        {/* Recommendations Grid */}
        {selectedPerfumes.length > 0 ? (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-800">
              <div>
                <h3 className="font-serif text-2xl text-zinc-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-400" />
                  <span>Fragancias Recomendadas con Mayor Afinidad</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Basado en {selectedPerfumes.map(p => p.name).join(' + ')}
                </p>
              </div>
              <div className="text-xs text-gold-400 bg-gold-950/60 border border-gold-500/30 px-3 py-1.5 rounded-full font-medium">
                {recommendations.length} Coincidencias de Alta Precisión
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(rec => {
                const p = rec.perfume;
                const inWishlist = isInWishlist(p.id);

                return (
                  <div
                    key={p.id}
                    className="group relative rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-gold-500/40 p-5 transition duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-gold-500/10"
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-950 to-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        {rec.matchScore}% Match Olfativo
                      </span>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className={`p-2 rounded-full border transition ${
                          inWishlist
                            ? 'bg-rose-950/80 border-rose-500/60 text-rose-400'
                            : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-gold-400'
                        }`}
                        title="Guardar en favoritos"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Image & Main Info */}
                    <div className="flex gap-4 mb-4">
                      <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/80 shrink-0">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <span className="text-[11px] font-semibold text-gold-400 uppercase tracking-wider">
                          {p.brand}
                        </span>
                        <h4 className="text-base font-medium text-zinc-100 line-clamp-2 mt-0.5 group-hover:text-gold-300 transition">
                          {p.name}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-1">
                          {p.concentration} • {p.volume}ml
                        </p>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-lg font-bold text-zinc-100 font-serif">
                            {formatCLP(p.price)}
                          </span>
                          {p.originalPrice > p.price && (
                            <span className="text-xs text-zinc-500 line-through">
                              {formatCLP(p.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Match Reasons Analysis */}
                    <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/90 mb-4 space-y-1.5 text-xs text-zinc-300">
                      <p className="text-[11px] font-semibold text-gold-400/90 uppercase tracking-wider flex items-center gap-1">
                        <Layers className="w-3 h-3" /> ¿Por qué es tu fragancia gemela?
                      </p>
                      {rec.reasons.map((reason, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-1.5 text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{reason}</span>
                        </div>
                      ))}
                      {rec.matchingNotes.length > 0 && (
                        <div className="pt-1.5 border-t border-zinc-800/80 flex flex-wrap gap-1">
                          {rec.matchingNotes.slice(0, 4).map((note, nIdx) => (
                            <span
                              key={nIdx}
                              className="px-2 py-0.5 rounded-md bg-zinc-900 border border-gold-500/20 text-[10px] text-gold-300"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80">
                      <button
                        onClick={() => openQuickView(p)}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-xs font-medium transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Ver Ficha</span>
                      </button>
                      <button
                        onClick={() => addToCart(p)}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:brightness-110 active:scale-95 text-black text-xs font-semibold shadow-md transition"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-black" />
                        <span>Comprar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-3xl bg-zinc-950/50 border border-zinc-800/60 max-w-2xl mx-auto">
            <Sparkles className="w-10 h-10 text-gold-500/60 mx-auto mb-4 animate-pulse-slow" />
            <h3 className="text-lg font-serif text-zinc-200">
              Selecciona tus fragancias arriba para comenzar
            </h3>
            <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto">
              Escribe el nombre de tu perfume de cabecera o haz clic en alguno de los combos virales para descubrir fragancias con notas idénticas y proyección sobresaliente.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
