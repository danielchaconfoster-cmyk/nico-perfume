import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { AnalyticsScripts } from '@/components/analytics-scripts';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nicoperfume.cl'),
  title: {
    default: 'Nico Perfume | Alta Perfumería & Recomendador Inteligente',
    template: '%s | Nico Perfume'
  },
  description:
    'Descubre tu fragancia firma en Nico Perfume. Más de 1.300 perfumes de diseñador, nicho y árabes con asesoría personalizada y motor de recomendación de fragancias gemelas.',
  keywords: [
    'perfumes chile',
    'perfumes arabes',
    'perfumeria santiago',
    'recomendador de perfumes',
    'perfumes originales',
    'afnan',
    'al haramain',
    'lattafa',
    'bharara'
  ],
  openGraph: {
    title: 'Nico Perfume | Alta Perfumería & Recomendador Inteligente',
    description: 'Más de 1.300 perfumes 100% originales sellados con motor de fragancias gemelas y test sommelier.',
    url: 'https://nicoperfume.cl',
    siteName: 'Nico Perfume',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nico Perfume | Fragancias de Autor',
    description: 'Catálogo de más de 1.300 perfumes originales con envíos a todo Chile por Starken y Blue Express.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="bg-[#08080a] text-zinc-100 min-h-screen antialiased selection:bg-gold-500 selection:text-black">
        <CartProvider>
          {children}
        </CartProvider>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
