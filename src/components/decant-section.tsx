'use client';

import React, { useState } from 'react';
import { DECANT_PACKS } from '@/data/decants';
import { Perfume } from '@/types/perfume';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import {
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Gift,
  HelpCircle,
  Eye,
  Star,
  Plus
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

    // Create a virtual custom box perfume item
    const customBoxPerfume: Perfume = {
      id: `custom-decant-${Date.now()}`,
      sku: 'DECANT-BOX-3',
      ean: '',
      name: `Custom Box 3x5ml (${customVials.map(v => v.name.slice(0, 15)).join(', ')})`,
      fullName: `Custom Box 3 Decants 5ml: ${customVials.map(v => v.name).join(' + ')}`,
      brand: 'Nico Perfume Discovery',
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
    <section id="decants" className="py-20 bg-gradient-to-b from-[#08080a] via-zinc-950 to-[#08080a] border-t border-zinc-800/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with 100% Refundable Guarantee */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wider uppercase mb-4">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Kits de Decants & Discovery Sets (5ml y 10ml)</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-light text-zinc-100">
            Prueba Antes de Comprar <br />
            <span className="italic text-gold-gradient font-normal">Sin Riesgo a Ciegas.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Atomizadores de vidrio de alta precisión con sellado hermético. Si compras cualquier pack y luego decides llevar la botella completa de 100ml, <strong className="text-gold-300 font-semibold">¡te abonamos el 100% del valor del pack como descuento!</strong>
          </p>

          {/* Guarantee Pill */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Garantía Nico Perfume: 100% Reembolsable en tu próxima botella</span>
          </div>
        </div>

        {/* Curated Decant Discovery Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {DECANT_PACKS.map(pack => (
            <div
              key={pack.id}
              className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-gold-500/40 transition duration-300 flex flex-col justify-between group hover:shadow-xl hover:shadow-black/60"
            >
              <div>
                {/* Image */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-950 mb-4 border border-zinc-800">
                  <Image
                    src={pack.image}
                    alt={pack.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-sm border border-gold-500/40 text-gold-300 text-[10px] font-bold">
                    {pack.badge}
                  </span>
                </div>

                {/* Tagline & Title */}
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  {pack.vialSize}
                </span>
                <h3 className="text-base font-serif font-medium text-zinc-100 mt-0.5 group-hover:text-gold-300 transition">
                  {pack.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2">
                  {pack.tagline}
                </p>

                {/* Fragrance List Included */}
                <div className="mt-3 p-3 rounded-xl bg-zinc-950 border border-zinc-850 space-y-1 text-xs">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Incluye:</p>
                  {pack.perfumeNames.map((name, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-zinc-300 text-[11px] truncate">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="mt-5 pt-3 border-t border-zinc-800/80">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold font-serif text-zinc-100">
                      {formatCLP(pack.price)}
                    </span>
                    <span className="text-xs text-zinc-500 line-through ml-2">
                      {formatCLP(pack.originalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gold-400">
                    <Star className="w-3 h-3 fill-gold-400 mr-1" />
                    <span>{pack.rating}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAddPresetPack(pack)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-gold-500 hover:brightness-110 active:scale-95 text-black text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Comprar Discovery Set</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Custom Box Builder: "Arma tu propio pack de 3 decants" */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-gold-500/30 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Personalizador a Medida
              </span>
              <h3 className="font-serif text-2xl text-zinc-100 mt-1">
                Arma tu Propio Pack de 3 Decants (5ml c/u) por $14.990
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Elige cualquier combinación de los más de 1.300 perfumes de nuestro catálogo.
              </p>
            </div>

            <button
              onClick={() => setIsBuilderOpen(!isBuilderOpen)}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-gold-500/40 text-gold-300 hover:text-white text-xs font-semibold tracking-wider uppercase transition"
            >
              {isBuilderOpen ? 'Cerrar Personalizador' : '✨ Armar mi Pack Ahora'}
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
                      className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between min-h-[120px]"
                    >
                      {vial ? (
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-gold-400">Decant #{index + 1}</span>
                            <button
                              onClick={() => removeVial(index)}
                              className="text-xs text-zinc-500 hover:text-rose-400"
                            >
                              Quitar
                            </button>
                          </div>
                          <h4 className="text-xs font-semibold text-zinc-100 mt-1 truncate">{vial.name}</h4>
                          <p className="text-[11px] text-zinc-400">{vial.brand} • 5ml vidrio</p>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <span className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center mx-auto mb-2">
                            {index + 1}
                          </span>
                          <p className="text-xs text-zinc-500">Selecciona una fragancia abajo</p>
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
                  placeholder="Buscar perfume para agregar a tu pack (ej: Bharara, Sauvage, Wanted)..."
                  value={searchCustom}
                  onChange={e => setSearchCustom(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-gold-500 mb-4"
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                  {filteredPerfumesForCustom.map(p => (
                    <button
                      key={p.id}
                      onClick={() => addVialToCustom(p)}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-gold-500/50 text-left transition group flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold text-gold-400 uppercase truncate block">{p.brand}</span>
                        <p className="text-xs font-medium text-zinc-200 group-hover:text-gold-300 truncate">{p.name}</p>
                      </div>
                      <Plus className="w-4 h-4 text-zinc-500 group-hover:text-gold-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Custom Pack to Cart */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <span className="text-xs text-zinc-400">
                  {customVials.length}/3 fragancias seleccionadas
                </span>
                <button
                  onClick={handleAddCustomBoxToCart}
                  disabled={customVials.length < 3}
                  className={`py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                    customVials.length === 3
                      ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-black hover:brightness-110 shadow-lg shadow-gold-500/20'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Agregar Custom Box ($14.990) a la Bolsa
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
