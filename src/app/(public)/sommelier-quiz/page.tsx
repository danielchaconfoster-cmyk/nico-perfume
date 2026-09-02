import React from 'react';
import { FragranceQuiz } from '@/components/fragrance-quiz';
import perfumesData from '@/data/perfumes.json';
import { Perfume } from '@/types/perfume';

export const metadata = {
  title: 'Sommelier Olfativo 30s | Nico Perfume',
  description: 'Diagnóstico interactivo de fragancias según tu ocasión, notas deseadas y presupuesto.'
};

export default function SommelierQuizPage() {
  const perfumes = perfumesData as Perfume[];

  return (
    <div className="min-h-screen bg-[#060608] pt-6 pb-20">
      <FragranceQuiz perfumes={perfumes} />
    </div>
  );
}
