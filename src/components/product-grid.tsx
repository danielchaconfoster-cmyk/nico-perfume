'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Perfume } from '@/types/perfume';
import { ProductCard } from './product-card';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Sparkles,
  ArrowUpDown,
  Filter,
  Grid3X3,
  Layers
} from 'lucide-react';

interface ProductGridProps {
  perfumes: Perfume[];
  brands: string[];
  families: string[];
  genders: string[];
}

const ITEMS_PER_PAGE = 24;

function ProductGridContent({ perfumes, brands, families, genders }: ProductGridProps) {
  const searchParams = useSearchParams();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('Todos');
  const [selectedBrand, setSelectedBrand] = useState<string>('Todas');
  const [selectedFamily, setSelectedFamily] = useState<string>('Todas');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('Todos');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Todas');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [page, setPage] = useState(1);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeSpecial, setActiveSpecial] = useState<string | null>(null);

  // Sync state with URL query params (?genero=..., ?marca=..., ?ocasion=..., ?q=...)
  useEffect(() => {
    if (!searchParams) return;

    // 1. Gender
    const generoParam = searchParams.get('genero');
    if (generoParam) {
      const match = genders.find(g => g.toLowerCase() === generoParam.toLowerCase());
      setSelectedGender(match || generoParam);
    }

    // 2. Brand
    const marcaParam = searchParams.get('marca');
    if (marcaParam) {
      const match = brands.find(b => b.toLowerCase() === marcaParam.toLowerCase());
      setSelectedBrand(match || marcaParam);
    }

    // 3. Search query
    const qParam = searchParams.get('q');
    if (qParam) {
      setSearchQuery(qParam);
    }

    // 4. Occasion
    const ocasionParam = searchParams.get('ocasion');
    if (ocasionParam) {
      setSelectedOccasion(ocasionParam);
    }

    // 5. Special filters (?filtro=arabes | ?filtro=bestseller)
    const filtroParam = searchParams.get('filtro');
    if (filtroParam) {
      setActiveSpecial(filtroParam);
    }
  }, [searchParams, genders, brands]);

  // Quick category pills
  const categoryPills = [
    { label: 'Todos los Perfumes', gender: 'Todos', filterSpecial: null },
    { label: 'Hombre', gender: 'Hombre', filterSpecial: null },
    { label: 'Mujer', gender: 'Mujer', filterSpecial: null },
    { label: 'Unisex', gender: 'Unisex', filterSpecial: null },
    { label: 'Joyas Árabes', gender: 'Todos', filterSpecial: 'arabes' },
    { label: 'Más Vendidos', gender: 'Todos', filterSpecial: 'bestseller' },
  ];

  // Filtered perfumes calculation
  const filteredPerfumes = useMemo(() => {
    let result = [...perfumes];

    // 1. Live Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.fullName.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.allNotes.some(n => n.toLowerCase().includes(q))
      );
    }

    // 2. Gender (Case-Insensitive)
    if (selectedGender !== 'Todos') {
      result = result.filter(p => p.gender.toLowerCase() === selectedGender.toLowerCase());
    }

    // 3. Special filters
    if (activeSpecial === 'arabes') {
      const arabBrands = ['Afnan', 'Al Haramain', 'Bharara', 'Armaf', 'Lattafa', 'Maison Alhambra', 'Asdaaf', 'Athoor al Alam', 'Anfar 1950', 'Attri', 'AURAA'];
      result = result.filter(p => arabBrands.some(ab => p.brand.toLowerCase().includes(ab.toLowerCase())));
    } else if (activeSpecial === 'bestseller') {
      result = result.filter(p => p.isBestSeller);
    }

    // 4. Brand (Case-Insensitive)
    if (selectedBrand !== 'Todas') {
      result = result.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // 5. Olfactory Family
    if (selectedFamily !== 'Todas') {
      result = result.filter(p => p.family === selectedFamily);
    }

    // 6. Occasion / Vibe (Flexible match in vibe/description/occasions/allNotes)
    if (selectedOccasion !== 'Todas') {
      const occ = selectedOccasion.toLowerCase();
      result = result.filter(p =>
        (p.description && p.description.toLowerCase().includes(occ)) ||
        (p.vibe && p.vibe.toLowerCase().includes(occ)) ||
        (p.occasions && p.occasions.some(o => o.toLowerCase().includes(occ))) ||
        p.allNotes.some(n => n.toLowerCase().includes(occ))
      );
    }

    // 7. Price Range
    if (selectedPriceRange !== 'Todos') {
      if (selectedPriceRange === 'under30') result = result.filter(p => p.price < 30000);
      else if (selectedPriceRange === '30to50') result = result.filter(p => p.price >= 30000 && p.price <= 50000);
      else if (selectedPriceRange === '50to80') result = result.filter(p => p.price > 50000 && p.price <= 80000);
      else if (selectedPriceRange === 'over80') result = result.filter(p => p.price > 80000);
    }

    // 8. Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: Popular / Best Sellers first
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviews - a.reviews);
    }

    return result;
  }, [
    perfumes,
    searchQuery,
    selectedGender,
    activeSpecial,
    selectedBrand,
    selectedFamily,
    selectedOccasion,
    selectedPriceRange,
    sortBy
  ]);

  // Paginated slice
  const displayedPerfumes = useMemo(() => {
    return filteredPerfumes.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredPerfumes, page]);

  const hasMore = displayedPerfumes.length < filteredPerfumes.length;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGender('Todos');
    setSelectedBrand('Todas');
    setSelectedFamily('Todas');
    setSelectedPriceRange('Todos');
    setSelectedOccasion('Todas');
    setActiveSpecial(null);
    setSortBy('popular');
    setPage(1);
  };

  const activeFilterCount =
    (selectedGender !== 'Todos' ? 1 : 0) +
    (selectedBrand !== 'Todas' ? 1 : 0) +
    (selectedFamily !== 'Todas' ? 1 : 0) +
    (selectedOccasion !== 'Todas' ? 1 : 0) +
    (selectedPriceRange !== 'Todos' ? 1 : 0) +
    (activeSpecial ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <section id="catalogo" className="py-16 bg-[#08080a] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Colección Completa</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-zinc-100 font-light">
              Catálogo de Fragancias & Joyas de Autor
            </h2>
            <p className="text-zinc-400 text-sm mt-1.5 font-light max-w-2xl">
              Explora más de 1.300 perfumes 100% originales sellados. Filtra por casa, género, familia olfativa o rango de precio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 font-mono">
              Mostrando <strong className="text-gold-300 font-semibold">{filteredPerfumes.length}</strong> de {perfumes.length} perfumes
            </span>
          </div>
        </div>

        {/* Quick Category Tabs / Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categoryPills.map(pill => {
            const isGenderMatch = pill.gender !== 'Todos' && selectedGender.toLowerCase() === pill.gender.toLowerCase() && !activeSpecial;
            const isSpecialMatch = pill.filterSpecial && activeSpecial === pill.filterSpecial;
            const isAllMatch = pill.gender === 'Todos' && !pill.filterSpecial && selectedGender === 'Todos' && !activeSpecial;
            const isActive = isGenderMatch || isSpecialMatch || isAllMatch;

            return (
              <button
                key={pill.label}
                onClick={() => {
                  if (pill.filterSpecial) {
                    setActiveSpecial(pill.filterSpecial);
                    setSelectedGender('Todos');
                  } else {
                    setActiveSpecial(null);
                    setSelectedGender(pill.gender);
                  }
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold shadow-lg shadow-gold-500/20 scale-[1.02]'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Search and Main Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-8">
          
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar por nombre, casa, nota (ej. Vainilla, Oud)..."
              className="w-full pl-10 pr-9 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-gold-500 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Brand Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedBrand}
              onChange={e => {
                setSelectedBrand(e.target.value);
                setPage(1);
              }}
              className="w-full py-2.5 px-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-gold-500 transition cursor-pointer"
            >
              <option value="Todas">Todas las Marcas ({brands.length})</option>
              {brands.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Olfactory Family Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedFamily}
              onChange={e => {
                setSelectedFamily(e.target.value);
                setPage(1);
              }}
              className="w-full py-2.5 px-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-gold-500 transition cursor-pointer"
            >
              <option value="Todas">Todas las Familias ({families.length})</option>
              {families.map(f => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-gold-500 transition cursor-pointer font-medium"
            >
              <option value="popular">Más Populares</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Calificados</option>
              <option value="name">Nombre: A - Z</option>
            </select>
          </div>

        </div>

        {/* Active Filters Badges */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-gold-400" /> Filtros Activos ({activeFilterCount}):
            </span>

            {selectedGender !== 'Todos' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-850 text-gold-300 border border-gold-500/30 text-[11px]">
                Género: {selectedGender}
                <button onClick={() => setSelectedGender('Todos')} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedBrand !== 'Todas' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-850 text-gold-300 border border-gold-500/30 text-[11px]">
                Marca: {selectedBrand}
                <button onClick={() => setSelectedBrand('Todas')} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedFamily !== 'Todas' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-850 text-gold-300 border border-gold-500/30 text-[11px]">
                Familia: {selectedFamily}
                <button onClick={() => setSelectedFamily('Todas')} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {activeSpecial && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-850 text-gold-300 border border-gold-500/30 text-[11px]">
                Colección: {activeSpecial === 'arabes' ? 'Joyas Árabes' : 'Más Vendidos'}
                <button onClick={() => setActiveSpecial(null)} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-850 text-gold-300 border border-gold-500/30 text-[11px]">
                Búsqueda: &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-[11px] text-zinc-400 hover:text-gold-300 underline underline-offset-4 ml-auto"
            >
              Limpiar todos
            </button>
          </div>
        )}

        {/* Products Grid */}
        {displayedPerfumes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedPerfumes.map(perfume => (
              <ProductCard key={perfume.id} perfume={perfume} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 bg-zinc-950/40 rounded-3xl border border-zinc-850">
            <div className="w-12 h-12 mx-auto rounded-full bg-zinc-900 flex items-center justify-center text-gold-400">
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg text-zinc-200">No encontramos perfumes con esos filtros</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Prueba buscando con otro término o limpiando los filtros seleccionados para ver más de 1.300 opciones.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs uppercase tracking-wider transition shadow-lg shadow-gold-500/20"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="pt-12 text-center">
            <button
              onClick={() => setPage(p => p + 1)}
              className="px-8 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-gold-500/40 text-xs font-semibold tracking-wider uppercase transition shadow-xl hover:shadow-gold-500/10 active:scale-95"
            >
              Cargar Más Perfumes ({filteredPerfumes.length - displayedPerfumes.length} restantes)
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

export function ProductGrid(props: ProductGridProps) {
  return (
    <Suspense fallback={<div className="py-16 text-center text-zinc-500 text-xs">Cargando catálogo...</div>}>
      <ProductGridContent {...props} />
    </Suspense>
  );
}

export default ProductGrid;
