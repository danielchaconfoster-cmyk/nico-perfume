'use client';

import React, { useState, useMemo } from 'react';
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

export function ProductGrid({ perfumes, brands, families, genders }: ProductGridProps) {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('Todos');
  const [selectedBrand, setSelectedBrand] = useState<string>('Todas');
  const [selectedFamily, setSelectedFamily] = useState<string>('Todas');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [page, setPage] = useState(1);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Quick category pills
  const categoryPills = [
    { label: 'Todos los Perfumes', gender: 'Todos', filterSpecial: null },
    { label: 'Hombre', gender: 'Hombre', filterSpecial: null },
    { label: 'Mujer', gender: 'Mujer', filterSpecial: null },
    { label: 'Unisex', gender: 'Unisex', filterSpecial: null },
    { label: 'Joyas Árabes', gender: 'Todos', filterSpecial: 'arabes' },
    { label: 'Más Vendidos', gender: 'Todos', filterSpecial: 'bestseller' },
  ];

  const [activeSpecial, setActiveSpecial] = useState<string | null>(null);

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

    // 2. Gender
    if (selectedGender !== 'Todos') {
      result = result.filter(p => p.gender === selectedGender);
    }

    // 3. Special filters
    if (activeSpecial === 'arabes') {
      const arabBrands = ['Afnan', 'Al Haramain', 'Bharara', 'Armaf', 'Lattafa', 'Maison Alhambra', 'Asdaaf', 'Athoor al Alam', 'Anfar 1950', 'Attri', 'AURAA'];
      result = result.filter(p => arabBrands.some(ab => p.brand.toLowerCase().includes(ab.toLowerCase())));
    } else if (activeSpecial === 'bestseller') {
      result = result.filter(p => p.isBestSeller);
    }

    // 4. Brand
    if (selectedBrand !== 'Todas') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // 5. Olfactory Family
    if (selectedFamily !== 'Todas') {
      result = result.filter(p => p.family === selectedFamily);
    }

    // 6. Price Range
    if (selectedPriceRange !== 'Todos') {
      if (selectedPriceRange === 'under30') result = result.filter(p => p.price < 30000);
      else if (selectedPriceRange === '30to50') result = result.filter(p => p.price >= 30000 && p.price <= 50000);
      else if (selectedPriceRange === '50to80') result = result.filter(p => p.price > 50000 && p.price <= 80000);
      else if (selectedPriceRange === 'over80') result = result.filter(p => p.price > 80000);
    }

    // 7. Sort
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
    setActiveSpecial(null);
    setSortBy('popular');
    setPage(1);
  };

  const activeFilterCount =
    (selectedGender !== 'Todos' ? 1 : 0) +
    (selectedBrand !== 'Todas' ? 1 : 0) +
    (selectedFamily !== 'Todas' ? 1 : 0) +
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
              Explora Nuestro <span className="italic text-gold-gradient font-normal">Catálogo</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Mostrando <span className="text-zinc-200 font-semibold">{filteredPerfumes.length}</span> fragancias de alta gama disponibles
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, marca o nota..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-gold-500 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {categoryPills.map((pill, idx) => {
            const isActive =
              (pill.filterSpecial === activeSpecial && pill.gender === selectedGender) ||
              (!pill.filterSpecial && !activeSpecial && pill.gender === selectedGender);

            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedGender(pill.gender);
                  setActiveSpecial(pill.filterSpecial);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition border ${
                  isActive
                    ? 'bg-gold-500 text-black border-gold-400 shadow-md shadow-gold-500/20'
                    : 'bg-zinc-900/60 text-zinc-300 border-zinc-800 hover:border-gold-500/40 hover:text-gold-300'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Filter Controls & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-gold-500/50 text-xs font-medium text-zinc-200 transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-gold-400" />
              <span>Filtros Avanzados</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-gold-500 text-black text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-zinc-400 hover:text-rose-400 transition flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Limpiar todo
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 hidden sm:inline">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-zinc-900 border border-zinc-700/80 text-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-gold-500 text-xs"
            >
              <option value="popular">Más Populares & Vendidos</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Calificados</option>
              <option value="name">Nombre: A - Z</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Expandable Panel */}
        {isFilterDrawerOpen && (
          <div className="p-6 rounded-2xl bg-zinc-950 border border-gold-500/20 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">
                Marca / Casa Olfativa
              </label>
              <select
                value={selectedBrand}
                onChange={e => {
                  setSelectedBrand(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-gold-500"
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
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">
                Familia Olfativa
              </label>
              <select
                value={selectedFamily}
                onChange={e => {
                  setSelectedFamily(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-gold-500"
              >
                <option value="Todas">Todas las Familias ({families.length})</option>
                {families.map(f => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">
                Rango de Precio
              </label>
              <select
                value={selectedPriceRange}
                onChange={e => {
                  setSelectedPriceRange(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-gold-500"
              >
                <option value="Todos">Cualquier Precio</option>
                <option value="under30">Menos de $30.000 CLP</option>
                <option value="30to50">$30.000 - $50.000 CLP</option>
                <option value="50to80">$50.000 - $80.000 CLP</option>
                <option value="over80">Más de $80.000 CLP</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">
                Género
              </label>
              <select
                value={selectedGender}
                onChange={e => {
                  setSelectedGender(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-gold-500"
              >
                <option value="Todos">Todos los Géneros</option>
                {genders.map(g => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {displayedPerfumes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedPerfumes.map(perfume => (
              <ProductCard key={perfume.id} perfume={perfume} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-2xl bg-zinc-950 border border-zinc-800">
            <Filter className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-medium text-zinc-200">
              No encontramos perfumes con esos filtros
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              Prueba modificando los términos de búsqueda o limpiando los filtros seleccionados.
            </p>
            <button
              onClick={resetFilters}
              className="mt-5 px-5 py-2.5 rounded-xl bg-gold-500 text-black text-xs font-semibold tracking-wider uppercase hover:brightness-110 transition"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-gold-300 border border-gold-500/40 hover:border-gold-400 text-xs font-semibold tracking-wider uppercase transition shadow-lg active:scale-95"
            >
              <span>Cargar Más Fragancias ({filteredPerfumes.length - displayedPerfumes.length} restantes)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
