import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  allPerfumes,
  getPerfumeBySlug,
  getPerfumeSlug,
  generateProductJsonLd,
  generateBreadcrumbJsonLd
} from '@/lib/perfumes';
import { ProductDetailView } from '@/components/product-detail-view';
import { formatCLP } from '@/lib/utils';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Pre-renderiza los slugs principales para rendimiento estático ultra rápido
 */
export async function generateStaticParams() {
  // Pre-generar los 100 perfumes más populares / bestsellers
  const topPerfumes = allPerfumes.slice(0, 100);
  return topPerfumes.map(perfume => ({
    slug: getPerfumeSlug(perfume),
  }));
}

/**
 * Genera metadatos dinámicos para SEO (Google, OpenGraph, Twitter Cards, WhatsApp)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const perfume = getPerfumeBySlug(slug);

  if (!perfume) {
    return {
      title: 'Perfume no encontrado | Nico Perfume Chile',
      description: 'El perfume que buscas no se encuentra disponible en nuestro catálogo.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nicoperfume.cl';
  const canonicalUrl = `${siteUrl}/producto/${getPerfumeSlug(perfume)}`;
  const title = `${perfume.fullName || `${perfume.brand} ${perfume.name}`} | Nico Perfume Chile`;
  const description = `Compra ${perfume.name} de ${perfume.brand} en Chile al mejor precio (${formatCLP(perfume.price)}). Concentración ${perfume.concentration}, familia ${perfume.family}. 100% Original sellado con batch code verificable. Despacho rápido a todo Chile.`;

  return {
    title,
    description,
    keywords: [
      perfume.name,
      perfume.brand,
      `${perfume.brand} chile`,
      `${perfume.name} precio chile`,
      'perfumes originales chile',
      'perfumes santiago',
      perfume.family,
      perfume.concentration,
      'perfumes arabes chile'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Nico Perfume',
      locale: 'es_CL',
      type: 'website',
      images: [
        {
          url: perfume.image,
          width: 800,
          height: 800,
          alt: perfume.fullName || perfume.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [perfume.image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const perfume = getPerfumeBySlug(slug);

  if (!perfume) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nicoperfume.cl';
  const canonicalUrl = `${siteUrl}/producto/${getPerfumeSlug(perfume)}`;

  // Schema.org JSON-LD para Rich Snippets
  const productJsonLd = generateProductJsonLd(perfume, canonicalUrl);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Inicio', url: siteUrl },
    { name: 'Catálogo', url: `${siteUrl}/catalogo` },
    { name: perfume.brand, url: `${siteUrl}/catalogo?marca=${encodeURIComponent(perfume.brand)}` },
    { name: perfume.name, url: canonicalUrl },
  ]);

  return (
    <>
      {/* Microdatos Schema.org para Google Search & Merchant */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ProductDetailView perfume={perfume} />
    </>
  );
}
