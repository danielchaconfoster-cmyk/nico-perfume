import React from 'react';
import { HeroBanner } from '@/components/hero-banner';
import { MarketingBanner } from '@/components/marketing-banner';
import { FragranceMatchmaker } from '@/components/fragrance-matchmaker';
import { DupeSavingsCalculator } from '@/components/dupe-savings-calculator';
import { BestsellersSection } from '@/components/bestsellers-section';
import { ProductGrid } from '@/components/product-grid';
import { ReviewsSection } from '@/components/reviews-section';
import perfumesData from '@/data/perfumes.json';
import metaData from '@/data/meta.json';
import { Perfume } from '@/types/perfume';

export default function HomePage() {
  const perfumes = perfumesData as Perfume[];
  const { brands, families, genders } = metaData;

  return (
    <div className="space-y-0">
      {/* 1. Hero Banner con Collage Humano & Llamado a la Acción */}
      <HeroBanner />

      {/* 2. Pilares de Confianza y Despacho */}
      <MarketingBanner />

      {/* 3. Los Perfumes Más Vendidos y Virales */}
      <BestsellersSection perfumes={perfumes} />

      {/* 4. Recomendador de Perfumes Similares / Clones */}
      <FragranceMatchmaker perfumes={perfumes} />

      {/* 5. Comparador de Ahorro Inteligente vs Retail */}
      <DupeSavingsCalculator perfumes={perfumes} />

      {/* 6. Catálogo con Filtros por Género, Marca y Ocasión */}
      <ProductGrid
        perfumes={perfumes}
        brands={brands}
        families={families}
        genders={genders}
      />

      {/* 7. Reseñas y Testimonios de Clientes */}
      <ReviewsSection />
    </div>
  );
}
