import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';

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
  title: 'Nico Perfume | Alta Perfumería & Recomendador Inteligente',
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
      </body>
    </html>
  );
}
