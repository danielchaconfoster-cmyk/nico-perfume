import React from 'react';
import { StoreModalsWrapper } from '@/components/store-modals';
import { Footer } from '@/components/footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <StoreModalsWrapper>
        <main className="flex-1">{children}</main>
      </StoreModalsWrapper>
      <Footer />
    </div>
  );
}
