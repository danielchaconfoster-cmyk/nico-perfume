import React from 'react';
import { StoreModalsWrapper } from '@/components/store-modals';
import { Footer } from '@/components/footer';
import perfumesData from '@/data/perfumes.json';
import { Perfume } from '@/types/perfume';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const perfumes = perfumesData as Perfume[];

  return (
    <div className="flex flex-col min-h-screen">
      <StoreModalsWrapper perfumes={perfumes}>
        <main className="flex-1">{children}</main>
      </StoreModalsWrapper>
      <Footer />
    </div>
  );
}
