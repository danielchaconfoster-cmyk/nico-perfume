'use client';

import React, { useState } from 'react';
import { DECANT_PACKS } from '@/data/decants';
import { Perfume } from '@/types/perfume';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import {
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Gift,
  Plus,
  ArrowRight,
  FlaskConical
} from 'lucide-react';
import Image from 'next/image';

interface DecantSectionProps {
  perfumes: Perfume[];
}

export function DecantSection({ perfumes }: DecantSectionProps) {
  const { addToCart, showToast } = useCart();

  // Custom box builder state (users can pick 3 perfumes for $14.990)
  const [customVials, setCustomVials] = useState<Perfume[]>([]);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [searchCustom, setSearchCustom] = useState('');

  const filteredPerfumesForCustom = perfumes.filter(p =>
    searchCustom.trim()
      ? p.name.toLowerCase().includes(searchCustom.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchCustom.toLowerCase())
      : true
  ).slice(0, 8);

  const addVialToCustom = (p: Perfume) => {
    if (customVials.length >= 3) {
      showToast('Ya has seleccionado tus 3 decants');
      return;
    }
    if (customVials.some(v => v.id === p.id)) {
      showToast('Ya agregaste esta fragancia a tu pack');
      return;
    }
    setCustomVials([...customVials, p]);
  };

  const removeVial = (index: number) => {
    setCustomVials(customVials.filter((_, i) => i !== index));
  };

  const handleAddCustomBoxToCart = () => {
    if (customVials.length < 3) {
      showToast('Selecciona 3 fragancias para completar tu Custom Box');
      return;
    }

    const customBoxPerfume: Perfume = {
      id: `custom-decant-${Date.now()}`,
      sku: 'DECANT-BOX-3',
      ean: '',
      name: `Custom Discovery Set 3x5ml (${customVials.map(v => v.name.slice(0, 15)).join(', ')})`,
      fullName: `Custom Box 3 Decants 5ml: ${customVials.map(v => v.name).join(' + ')}`,
      brand: 'Discovery Studio',
      gender: 'Unisex',
      format: 'DECANT',
      volume: 15,
      concentration: 'Eau de Parfum',
      family: 'Oriental / Ámbar',
      price: 14990,
      originalPrice: 24990,
      wholesalePrice: 9000,
      stock: 50,
      topNotes: ['Selección Personalizada'],
      heartNotes: ['Acordes de Autor'],
      baseNotes: ['Fijación Premium'],
      allNotes: ['Personalizado'],
      vibe: 'Exclusivo, Personalizado, Variado',
      longevity: '9/10',
      sillage: 'Alta',
      occasions: ['Cualquier Ocasión'],
      rating: 5.0,
      reviews: 48,
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      isBestSeller: true,
      isNew: true,
      description: 'Caja personalizada de 3 atomizadores de vidrio de 5ml.'
    };

    addToCart(customBoxPerfume, 1, 'decant', '5ml');
    setCustomVials([]);
    setIsBuilderOpen(false);
  };

  const handleAddPresetPack = (pack: typeof DECANT_PACKS[0]) => {
    const packPerfume: Perfume = {
      id: pack.id,
      sku: `PACK-${pack.id}`,
      ean: '',
      name: pack.title,
      fullName: `${pack.title} (${pack.vialSize})`,
      brand: 'Discovery Set',
      gender: 'Unisex',
      format: 'DECANT PACK',
      volume: 25,
      concentration: 'Eau de Parfum',
      family: 'Oriental / Ámbar',
      price: pack.price,
      originalPrice: pack.originalPrice,
      wholesalePrice: Math.round(pack.price * 0.6),
      stock: 40,
      topNotes: ['Muestras de Colección'],
      heartNotes: ['Gama Árabe y Diseñador'],
      baseNotes: ['Aceites Puros'],
      allNotes: ['Discovery'],
      vibe: 'Ideal para probar sin riesgo',
      longevity: '9.5/10',
      sillage: 'Alta',
      occasions: ['Regalo / Prueba'],
      rating: pack.rating,
      reviews: 62,
      image: pack.image,
      isBestSeller: true,
      isNew: false,
      description: pack.description
    };

    addToCart(packPerfume, 1, 'decant', '5ml');
  };

  return (
    <section id="decants" className="py-20 bg-[#07070a] border-t border-zinc-900 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[11px] font-medium tracking-[0.3em] text-zinc-400 uppercase mb-3">
            Discovery Sets & Decants • 5ml y 10ml
          </p>

          <h2 className="font-serif text-3xl sm:text-5xl font-light text-zinc-100 leading-[1.2]">
            Experimenta la Fragancia en Piel <br />
            <span className="italic text-gold-gradient font-normal">Antes de la Botella Completa.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Atomizadores de cristal con cierre sellado para probar la evolución de las notas en tu propia piel. El valor de cualquier Discovery Set es <strong className="text-zinc-200 font-medium">100% abonable a tu botella de 100ml</strong> durante los primeros 30 días.
          </p>
        </div>

        {/* Curated Decant Discovery Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {DECANT_PACKS.map(pack => (
            <div
              key={pack.id}
              className="p-5 rounded-2xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div>
                {/* Image */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-900 mb-4 border border-zinc-850">
                  <Image
                    src={pack.image}
                    alt={pack.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                </div>

                {/* Subtitle & Title */}
                <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-gold-400">
                  {pack.vialSize}
                </span>
                <h3 className="text-base font-serif font-medium text-zinc-100 mt-1 group-hover:text-gold-300 transition">
                  {pack.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {pack.tagline}
                </p>

                {/* Fragrance List Included */}
                <div className="mt-4 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-850 space-y-1.5 text-xs">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Fragancias en el Set:</p>
                  {pack.perfumeNames.map((name, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-zinc-300 text-[11px] truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400/80 shrink-0" />
                      <span className="truncate">{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-5 pt-3 border-t border-zinc-850">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-lg font-semibold font-serif text-zinc-100">
                      {formatCLP(pack.price)}
                    </span>
                    <span className="text-xs text-zinc-500 line-through ml-2">
                      {formatCLP(pack.originalPrice)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleAddPresetPack(pack)}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-100 hover:bg-gold-400 text-black text-[11px] font-medium tracking-[0.15em] uppercase transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Adquirir Discovery Set</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Box Builder */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold-400">
                Curaduría Personalizada
              </p>
              <h3 className="font-serif text-xl sm:text-2xl text-zinc-100 mt-1 font-normal">
                Diseña tu Propio Discovery Set (3 viales de 5ml por $14.990)
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Elige libremente 3 fragancias de nuestro catálogo para recibirlas en atomizadores de viaje de alta gama.
              </p>
            </div>

            <button
              onClick={() => setIsBuilderOpen(!isBuilderOpen)}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white hover:bg-zinc-800 text-xs font-medium tracking-[0.15em] uppercase transition"
            >
              {isBuilderOpen ? 'Cerrar Selección' : 'Armar mi Pack a Medida'}
            </button>
          </div>

          {/* Builder Workspace */}
          {isBuilderOpen && (
            <div className="mt-6 space-y-6 animate-fadeIn">
              {/* Selected Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map(index => {
                  const vial = customVials[index];
                  return (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between min-h-[110px]"
                    >
                      {vial ? (
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase text-gold-400 tracking-wider">Vial #{index + 1}</span>
                            <button
                              onClick={() => removeVial(index)}
                              className="text-xs text-zinc-500 hover:text-rose-400"
                            >
                              Cambiar
                            </button>
                          </div>
                          <h4 className="text-xs font-semibold text-zinc-100 mt-1 truncate">{vial.name}</h4>
                          <p className="text-[11px] text-zinc-400">{vial.brand} • 5ml vidrio</p>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <span className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium flex items-center justify-center mx-auto mb-1.5">
                            {index + 1}
                          </span>
                          <p className="text-xs text-zinc-400">Selecciona una fragancia abajo</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Search & Selector list */}
              <div>
                <input
                  type="text"
                  placeholder="Buscar perfume para agregar a tu set (ej: Bharara, Sauvage, Wanted)..."
                  value={searchCustom}
                  onChange={e => setSearchCustom(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-gold-500 mb-4"
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                  {filteredPerfumesForCustom.map(p => (
                    <button
                      key={p.id}
                      onClick={() => addVialToCustom(p)}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-850 hover:border-zinc-700 text-left transition group flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[9px] font-bold text-gold-400 uppercase truncate block">{p.brand}</span>
                        <p className="text-xs font-medium text-zinc-200 group-hover:text-gold-300 truncate">{p.name}</p>
                      </div>
                      <Plus className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Custom Pack to Cart */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-850">
                <span className="text-xs text-zinc-400">
                  {customVials.length} de 3 viales seleccionados
                </span>
                <button
                  onClick={handleAddCustomBoxToCart}
                  disabled={customVials.length < 3}
                  className={`py-3 px-6 rounded-xl font-medium text-xs uppercase tracking-[0.15em] transition ${
                    customVials.length === 3
                      ? 'bg-zinc-100 hover:bg-gold-400 text-black shadow-md'
                      : 'bg-zinc-850 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Agregar Discovery Set ($14.990) a la Bolsa
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
