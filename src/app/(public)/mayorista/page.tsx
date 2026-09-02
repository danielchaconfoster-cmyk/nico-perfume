import React from 'react';
import { WholesalePortal } from '@/components/wholesale-portal';
import perfumesData from '@/data/perfumes.json';
import { Perfume } from '@/types/perfume';

export const metadata = {
  title: 'Venta Mayorista B2B & Distribución | Nico Perfume',
  description: 'Abastecimiento mayorista de perfumería árabe y de autor desde 6 unidades con Factura Electrónica en Chile.'
};

export default function MayoristaPage() {
  const perfumes = perfumesData as Perfume[];

  return (
    <div className="min-h-screen bg-[#050508] pt-6 pb-20">
      <WholesalePortal perfumes={perfumes} />
    </div>
  );
}
