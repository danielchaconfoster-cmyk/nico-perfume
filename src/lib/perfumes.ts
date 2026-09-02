import perfumesData from '@/data/perfumes.json';
import { Perfume } from '@/types/perfume';

export const allPerfumes: Perfume[] = perfumesData as Perfume[];

/**
 * Convierte un texto a formato slug seguro para URL y SEO
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar tildes y diacríticos
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres no alfanuméricos por guiones
    .replace(/^-+|-+$/g, '') // Quitar guiones al inicio y al final
    .replace(/-{2,}/g, '-'); // Quitar guiones duplicados
}

// Mapa para garantizar slugs 100% únicos y búsqueda O(1)
const slugToPerfumeMap = new Map<string, Perfume>();
const idToSlugMap = new Map<string, string>();

// Inicializar mapeo de slugs
(() => {
  const seenSlugs = new Map<string, number>();

  for (const perfume of allPerfumes) {
    let baseSlug = slugify(perfume.name);
    
    // Si el baseSlug es muy corto o vacío, usamos brand + name
    if (!baseSlug || baseSlug.length < 3) {
      baseSlug = slugify(`${perfume.brand}-${perfume.name}`);
    }

    let finalSlug = baseSlug;
    if (seenSlugs.has(baseSlug)) {
      const count = (seenSlugs.get(baseSlug) || 1) + 1;
      seenSlugs.set(baseSlug, count);
      // Agregar sku o sufijo para garantizar unicidad absoluta
      finalSlug = `${baseSlug}-${perfume.sku ? slugify(perfume.sku) : count}`;
    } else {
      seenSlugs.set(baseSlug, 1);
    }

    slugToPerfumeMap.set(finalSlug, perfume);
    idToSlugMap.set(perfume.id, finalSlug);
  }
})();

/**
 * Obtiene el slug SEO canónico de un perfume
 */
export function getPerfumeSlug(perfume: Perfume | { id: string; name: string; sku?: string }): string {
  if (idToSlugMap.has(perfume.id)) {
    return idToSlugMap.get(perfume.id)!;
  }
  return slugify(perfume.name);
}

/**
 * Busca un perfume por su slug SEO o por su ID / SKU como fallback
 */
export function getPerfumeBySlug(slug: string): Perfume | undefined {
  if (!slug) return undefined;
  
  // 1. Búsqueda directa por slug
  if (slugToPerfumeMap.has(slug)) {
    return slugToPerfumeMap.get(slug);
  }

  // 2. Fallback: búsqueda por ID directo (ej: perf-14)
  const byId = allPerfumes.find(p => p.id === slug || p.sku.toLowerCase() === slug.toLowerCase());
  if (byId) return byId;

  // 3. Fallback: slug normalizado flexible
  const normalizedSearch = slugify(slug);
  for (const [key, perfume] of slugToPerfumeMap.entries()) {
    if (key === normalizedSearch || key.startsWith(normalizedSearch) || normalizedSearch.startsWith(key)) {
      return perfume;
    }
  }

  return undefined;
}

/**
 * Retorna todos los slugs disponibles (útil para sitemaps y generateStaticParams)
 */
export function getAllPerfumeSlugs(): string[] {
  return Array.from(slugToPerfumeMap.keys());
}

/**
 * Retorna perfumes relacionados (por misma marca, misma familia olfativa o género)
 */
export function getRelatedPerfumes(currentPerfume: Perfume, limit: number = 4): Perfume[] {
  return allPerfumes
    .filter(p => p.id !== currentPerfume.id)
    .sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Misma marca (+3)
      if (a.brand === currentPerfume.brand) scoreA += 3;
      if (b.brand === currentPerfume.brand) scoreB += 3;

      // Misma familia olfativa (+2)
      if (a.family === currentPerfume.family) scoreA += 2;
      if (b.family === currentPerfume.family) scoreB += 2;

      // Mismo género (+1)
      if (a.gender === currentPerfume.gender) scoreA += 1;
      if (b.gender === currentPerfume.gender) scoreB += 1;

      return scoreB - scoreA;
    })
    .slice(0, limit);
}

/**
 * Genera el Schema.org JSON-LD de Producto para Google Rich Snippets
 */
export function generateProductJsonLd(perfume: Perfume, canonicalUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: perfume.fullName || `${perfume.brand} ${perfume.name}`,
    image: [perfume.image],
    description: perfume.description,
    sku: perfume.sku,
    gtin13: perfume.ean || undefined,
    mpn: perfume.sku,
    brand: {
      '@type': 'Brand',
      name: perfume.brand
    },
    category: `Perfumes > ${perfume.gender} > ${perfume.family}`,
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'CLP',
      price: perfume.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: perfume.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Nico Perfume Chile'
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'CL',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: perfume.price >= 60000 ? 0 : 3990,
          currency: 'CLP'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'CL'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY'
          }
        }
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: perfume.rating.toString(),
      reviewCount: perfume.reviews.toString(),
      bestRating: '5',
      worstRating: '1'
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Concentración',
        value: perfume.concentration
      },
      {
        '@type': 'PropertyValue',
        name: 'Volumen',
        value: `${perfume.volume} ml`
      },
      {
        '@type': 'PropertyValue',
        name: 'Familia Olfativa',
        value: perfume.family
      },
      {
        '@type': 'PropertyValue',
        name: 'Género',
        value: perfume.gender
      },
      {
        '@type': 'PropertyValue',
        name: 'Notas de Salida',
        value: perfume.topNotes.join(', ')
      },
      {
        '@type': 'PropertyValue',
        name: 'Notas de Corazón',
        value: perfume.heartNotes.join(', ')
      },
      {
        '@type': 'PropertyValue',
        name: 'Notas de Fondo',
        value: perfume.baseNotes.join(', ')
      },
      {
        '@type': 'PropertyValue',
        name: 'Longevidad',
        value: perfume.longevity
      },
      {
        '@type': 'PropertyValue',
        name: 'Estela / Proyección',
        value: perfume.sillage
      }
    ]
  };
}

/**
 * Genera el Schema.org JSON-LD de Breadcrumbs para Google
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
