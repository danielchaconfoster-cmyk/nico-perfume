import React from 'react';
import { FragranceMatchmaker } from '@/components/fragrance-matchmaker';
import perfumesData from '@/data/perfumes.json';
import { Perfume } from '@/types/perfume';

export const metadata = {
  title: 'Laboratorio de Fragancias Gemelas | Nico Perfume',
  description: 'Descubre perfumes idénticos y gemelos olfativos a partir de tus fragancias favoritas.'
};

export default function FraganciasGemelasPage() {
  const perfumes = perfumesData as Perfume[];

  return (
    <div className="min-h-screen bg-[#060609] pt-6 pb-20">
      <FragranceMatchmaker perfumes={perfumes} />
    </div>
  );
}
