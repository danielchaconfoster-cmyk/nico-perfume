import React from 'react';
import { ProductGrid } from '@/components/product-grid';
import perfumesData from '@/data/perfumes.json';
import metaData from '@/data/meta.json';
import { Perfume } from '@/types/perfume';

export const metadata = {
  title: 'Catálogo de Fragancias & Joyas de Autor | Nico Perfume',
  description: 'Explora nuestra colección de perfumería árabe de alta fijación, extractos puros y casas de diseñador en Santiago de Chile.'
};

export default function CatalogoPage() {
  const perfumes = perfumesData as Perfume[];
  const { brands, families, genders } = metaData;

  return (
    <div className="min-h-screen bg-[#050507] pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <p className="text-[11px] font-medium tracking-[0.3em] text-gold-400 uppercase mb-2">
          Colección Completa
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-zinc-100 font-light">
          Catálogo de Fragancias & Extractos
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-light max-w-2xl leading-relaxed">
          Filtra por casa olfativa, familia de notas, ocasión o rango de precio. Cada botella cuenta con batch code verificado y garantía de autenticidad.
        </p>
      </div>

      <ProductGrid
        perfumes={perfumes}
        brands={brands}
        families={families}
        genders={genders}
      />
    </div>
  );
}
