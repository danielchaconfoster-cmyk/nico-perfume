import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Panel de Administración | Nico Perfume',
  description: 'Gestor de catálogo, listas de precios Excel y sincronización con Supabase.',
  robots: 'noindex, nofollow'
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-amber-500 selection:text-black font-sans antialiased">
      {children}
    </div>
  );
}
