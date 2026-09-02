import React from 'react';
import { HeroBanner } from '@/components/hero-banner';
import { MarketingBanner } from '@/components/marketing-banner';
import { FragranceMatchmaker } from '@/components/fragrance-matchmaker';
import { FragranceQuiz } from '@/components/fragrance-quiz';
import { BestsellersSection } from '@/components/bestsellers-section';
import { ProductGrid } from '@/components/product-grid';
import { OlfactoryGuide } from '@/components/olfactory-guide';
import { ReviewsSection } from '@/components/reviews-section';
import perfumesData from '@/data/perfumes.json';
import metaData from '@/data/meta.json';
import { Perfume } from '@/types/perfume';

export default function HomePage() {
  const perfumes = perfumesData as Perfume[];
  const { brands, families, genders } = metaData;

  return (
    <div className="space-y-0">
      {/* 1. Hero Cinematic Banner */}
      <HeroBanner />

      {/* 2. Marketing & Trust Pillars */}
      <MarketingBanner />

      {/* 3. Fragrance Twin Matchmaker (Key Recommender Feature) */}
      <FragranceMatchmaker perfumes={perfumes} />

      {/* 4. Interactive Sommelier Quiz */}
      <FragranceQuiz perfumes={perfumes} />

      {/* 5. Bestsellers & Viral Fragrances */}
      <BestsellersSection perfumes={perfumes} />

      {/* 6. Complete Catalog with Faceted Filters */}
      <ProductGrid
        perfumes={perfumes}
        brands={brands}
        families={families}
        genders={genders}
      />

      {/* 7. Educational Olfactory Families Guide */}
      <OlfactoryGuide />

      {/* 8. Customer Testimonials & Reviews */}
      <ReviewsSection />
    </div>
  );
}
