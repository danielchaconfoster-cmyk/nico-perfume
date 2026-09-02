import React from 'react';
import { FragranceQuiz } from '@/components/fragrance-quiz';
import perfumesData from '@/data/perfumes.json';
import { Perfume } from '@/types/perfume';

export const metadata = {
  title: 'Test de Perfumes | Nico Perfume Chile',
  description: 'Descubre en 30 segundos qué perfume se adapta mejor a tu estilo, ocasión y presupuesto.'
};

export default function SommelierQuizPage() {
  const perfumes = perfumesData as Perfume[];

  return (
    <div className="min-h-screen bg-[#07070a] pt-6 pb-20">
      <FragranceQuiz perfumes={perfumes} />
    </div>
  );
}
