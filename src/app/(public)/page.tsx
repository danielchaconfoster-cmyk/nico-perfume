import React from 'react';
import { HeroBanner } from '@/components/hero-banner';
import { MarketingBanner } from '@/components/marketing-banner';
import { FragranceMatchmaker } from '@/components/fragrance-matchmaker';
import { FragranceQuiz } from '@/components/fragrance-quiz';
import { DecantSection } from '@/components/decant-section';
import { DupeSavingsCalculator } from '@/components/dupe-savings-calculator';
import { SillageWeatherApp } from '@/components/sillage-weather-app';
import { WholesalePortal } from '@/components/wholesale-portal';
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

      {/* 4. Decant Discovery Sets (5ml / 10ml) - Zero-Risk Trial */}
      <DecantSection perfumes={perfumes} />

      {/* 5. Interactive Sommelier Quiz */}
      <FragranceQuiz perfumes={perfumes} />

      {/* 6. Dupe Vault & Savings Calculator */}
      <DupeSavingsCalculator perfumes={perfumes} />

      {/* 7. Live Weather & Sillage Spray Advisor App */}
      <SillageWeatherApp perfumes={perfumes} />

      {/* 8. Bestsellers & Viral Fragrances */}
      <BestsellersSection perfumes={perfumes} />

      {/* 9. Complete Catalog with Faceted Filters */}
      <ProductGrid
        perfumes={perfumes}
        brands={brands}
        families={families}
        genders={genders}
      />

      {/* 10. B2B Wholesale Portal & Reseller Program */}
      <WholesalePortal perfumes={perfumes} />

      {/* 11. Educational Olfactory Families Guide */}
      <OlfactoryGuide />

      {/* 12. Customer Testimonials & Reviews */}
      <ReviewsSection />
    </div>
  );
}
