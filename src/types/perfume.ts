export type OlfactoryFamily =
  | 'Oriental / Ámbar'
  | 'Amaderada'
  | 'Cítrica / Fresca'
  | 'Floral'
  | 'Gourmand / Dulce'
  | 'Cuero / Especiada'
  | 'Aromática / Fougère';

export type FragranceGender = 'Hombre' | 'Mujer' | 'Unisex';

export type FragranceConcentration =
  | 'Extrait de Parfum'
  | 'Parfum'
  | 'Eau de Parfum'
  | 'Eau de Toilette'
  | 'Eau de Cologne';

export interface Perfume {
  id: string;
  sku: string;
  ean: string;
  name: string;
  fullName: string;
  brand: string;
  gender: FragranceGender;
  format: string;
  volume: number; // in ml
  concentration: FragranceConcentration;
  family: OlfactoryFamily;
  price: number; // in CLP (Chilean Pesos)
  originalPrice: number; // suggested / regular price
  wholesalePrice: number;
  stock: number;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  allNotes: string[];
  vibe: string;
  longevity: string;
  sillage: string;
  occasions: string[];
  rating: number;
  reviews: number;
  image: string;
  isBestSeller: boolean;
  isNew: boolean;
  description: string;
}

export interface CartItem {
  perfume: Perfume;
  quantity: number;
}

export interface RecommendationResult {
  perfume: Perfume;
  matchScore: number; // 0 to 100 percentage
  reasons: string[];
  matchingNotes: string[];
  matchingFamily: boolean;
  matchingVibe: boolean;
}

export interface MetaCatalog {
  total: number;
  brands: string[];
  families: string[];
  genders: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

export interface QuizPreferences {
  gender?: FragranceGender | 'Todos';
  occasion?: string;
  family?: string;
  intensity?: 'Suave & Limpio' | 'Moderado & Elegante' | 'Intenso & Proyectante';
  budget?: 'Cualquiera' | 'Económico (< $40.000)' | 'Gama Media ($40.000 - $70.000)' | 'Alta Gama (> $70.000)';
}
