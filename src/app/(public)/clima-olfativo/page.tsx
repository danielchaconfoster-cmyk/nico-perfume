import React from 'react';
import { SillageWeatherApp } from '@/components/sillage-weather-app';
import perfumesData from '@/data/perfumes.json';
import { Perfume } from '@/types/perfume';

export const metadata = {
  title: 'Asesor de Clima & Atomizaciones | Nico Perfume',
  description: 'Calcula la dosis de sprays diaria según la temperatura y humedad en las ciudades de Chile.'
};

export default function ClimaOlfativoPage() {
  const perfumes = perfumesData as Perfume[];

  return (
    <div className="min-h-screen bg-[#060608] pt-6 pb-20">
      <SillageWeatherApp perfumes={perfumes} />
    </div>
  );
}
