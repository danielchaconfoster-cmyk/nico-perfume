import React from 'react';
import { DecantSection } from '@/components/decant-section';
import perfumesData from '@/data/perfumes.json';
import { Perfume } from '@/types/perfume';

export const metadata = {
  title: 'Discovery Sets & Decants 5ml/10ml | Nico Perfume',
  description: 'Packs de decants de 5ml y sets de descubrimiento en cristal sellado. 100% abonable a tu botella de 100ml.'
};

export default function DecantsPage() {
  const perfumes = perfumesData as Perfume[];

  return (
    <div className="min-h-screen bg-[#07070a] pt-6 pb-20">
      <DecantSection perfumes={perfumes} />
    </div>
  );
}
