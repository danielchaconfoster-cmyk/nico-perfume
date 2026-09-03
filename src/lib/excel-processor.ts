import * as XLSX from 'xlsx';
import { supabaseAdmin } from './supabase-admin';

export interface ProcessExcelOptions {
  retailMarkupPct?: number; // e.g. 48%
  normalMarkupPct?: number; // e.g. 30%
  uploadedBy?: string;
  filename?: string;
}

export interface PriceDiffItem {
  sku: string;
  name: string;
  brand: string;
  oldWholesale: number;
  newWholesale: number;
  oldRetailPrice: number;
  newRetailPrice: number;
  priceDiff: number;
  isNew: boolean;
}

export interface ExcelProcessingResult {
  success: boolean;
  filename: string;
  totalRows: number;
  updatedCount: number;
  createdCount: number;
  unchangedCount: number;
  retailMarkupPct: number;
  normalMarkupPct: number;
  diffs: PriceDiffItem[];
  error?: string;
}

const FAMILY_KEYWORDS: Record<string, string[]> = {
  'Oriental / Ámbar': ['amber', 'ámbar', 'oriental', 'oud', 'vanilla', 'vainilla', 'tonka', 'incienso', 'incense', 'resina', 'khamrah', 'untold', 'paragon', 'rouge', 'golden', 'gold', 'velvet', 'sugar', 'elixir', 'rich', 'baccarat', 'musk', 'almizcle'],
  'Amaderada': ['wood', 'cedro', 'cedar', 'sándalo', 'sandalwood', 'vetiver', 'guaiac', 'ebony', 'oud', 'patchouli', 'pachuli', 'king', 'terred', 'terre', 'woods', 'forest', 'noir', 'black', 'cypress'],
  'Cítrica / Fresca': ['citrus', 'cítrico', 'cítrica', 'bergamot', 'bergamota', 'lemon', 'limón', 'mandarin', 'mandarina', 'grapefruit', 'pomelo', 'aqua', 'acua', 'water', 'marine', 'mar', 'fresh', 'fresco', 'fresca', 'summer', 'bleu', 'blue', 'ck one', 'light blue', 'ocean'],
  'Floral': ['rose', 'rosa', 'jasmine', 'jazmín', 'flor', 'floral', 'iris', 'orquídea', 'orchid', 'tuberosa', 'neroli', 'magnolia', 'peonía', 'peony', 'violet', 'violeta', 'panthera', 'bloom', 'blossom', 'bouquet', 'chloe', 'good girl', 'libre', 'vie est belle', 'miss'],
  'Gourmand / Dulce': ['caramel', 'caramelo', 'chocolate', 'cafe', 'coffee', 'praline', 'praliné', 'miel', 'honey', 'marshmallow', 'gourmand', 'dulce', 'candy', 'sweet', 'pistachio', 'pistacho', 'yara', 'lattafa', 'vanilla'],
  'Cuero / Especiada': ['leather', 'cuero', 'spicy', 'especias', 'pimienta', 'pepper', 'canela', 'cinnamon', 'cardamom', 'cardamomo', 'tobacco', 'tabaco', 'wanted', 'stronger', 'sauvage', 'man', 'intense', 'spice'],
  'Aromática / Fougère': ['lavender', 'lavanda', 'salvia', 'sage', 'menta', 'mint', 'romero', 'rosemary', 'albahaca', 'basil', 'fougere', 'fougère', 'sport', 'club', 'classic', 'homme', 'pour homme', 'legend', 'eros', 'dylan']
};

const NOTE_SETS: Record<string, { top: string[]; heart: string[]; base: string[] }> = {
  'Oriental / Ámbar': {
    top: ['Bergamota de Calabria', 'Azafrán', 'Cardamomo', 'Manzana crujiente', 'Canela de Ceilán', 'Naranja amarga'],
    heart: ['Ámbar gris', 'Jazmín de Egipto', 'Rosa de Damasco', 'Resina de Benjuí', 'Incienso', 'Nuez moscada'],
    base: ['Vainilla de Madagascar', 'Madera de Oud', 'Haba Tonka', 'Almizcle blanco', 'Cedro', 'Pachulí']
  },
  'Amaderada': {
    top: ['Pomelo amargo', 'Pimienta rosa', 'Cardamomo', 'Bergamota', 'Elemi', 'Ciprés'],
    heart: ['Cedro del Atlas', 'Vetiver de Haití', 'Madera de Guayaco', 'Pachulí', 'Iris', 'Geranio'],
    base: ['Sándalo de Mysore', 'Musgo de roble', 'Ámbar negro', 'Cuero suave', 'Benjuí', 'Almizcle amaderado']
  },
  'Cítrica / Fresca': {
    top: ['Bergamota italiana', 'Limón de Amalfi', 'Mandarina jugosa', 'Menta fresca', 'Notas marinas', 'Pomelo'],
    heart: ['Neroli', 'Jazmín acuático', 'Jengibre', 'Cardamomo verde', 'Romero', 'Calone'],
    base: ['Almizcle blanco', 'Cedro blanco', 'Vetiver suave', 'Ámbar gris cristalino', 'Maderas flotantes']
  },
  'Floral': {
    top: ['Pera Williams', 'Mandarina dulce', 'Pimienta rosa', 'Grosellas negras', 'Flor de azahar'],
    heart: ['Rosa de Mayo', 'Jazmín Sambac', 'Tuberosa de la India', 'Iris de Florencia', 'Peonía rosa'],
    base: ['Vainilla bourbon', 'Almizcle sedoso', 'Sándalo cremoso', 'Haba tonka', 'Pachulí refinado']
  },
  'Gourmand / Dulce': {
    top: ['Almendra amarga', 'Frutos rojos', 'Caramelo salado', 'Pera madura', 'Licor de cereza'],
    heart: ['Vainilla de Tahití', 'Praliné', 'Chocolate negro', 'Café tostado', 'Jazmín dulce'],
    base: ['Haba Tonka tostada', 'Ámbar dulce', 'Sándalo', 'Almizcle de malvavisco', 'Miel dorada']
  },
  'Cuero / Especiada': {
    top: ['Pimienta negra', 'Cardamomo', 'Azafrán persa', 'Canela', 'Mandarina especiada'],
    heart: ['Cuero toscano', 'Tabaco cubano', 'Incienso de Omán', 'Clavo de olor', 'Cacao'],
    base: ['Madera de abedul', 'Pachulí oscuro', 'Ámbar resinoso', 'Vainilla ahumada', 'Vetiver oscuro']
  },
  'Aromática / Fougère': {
    top: ['Lavanda francesa', 'Menta piperita', 'Bergamota', 'Manzana verde', 'Cardamomo'],
    heart: ['Salvia esclarea', 'Geranio bourbon', 'Pimienta de Sichuan', 'Hojas de violeta'],
    base: ['Haba tonka', 'Musgo de roble', 'Cedro de Virginia', 'Vetiver', 'Ambroxan']
  }
};

const LUXURY_BOTTLE_IMAGES = [
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80'
];

function determineFamily(name: string, brand: string): string {
  const combined = `${name} ${brand}`.toLowerCase();
  for (const [fam, kws] of Object.entries(FAMILY_KEYWORDS)) {
    if (kws.some(kw => combined.includes(kw))) {
      return fam;
    }
  }
  if (combined.includes('mujer') || combined.includes('woman') || combined.includes('femme')) return 'Floral';
  if (combined.includes('hombre') || combined.includes('man') || combined.includes('homme')) return 'Amaderada';
  return 'Oriental / Ámbar';
}

function extractVolume(name: string): number {
  const match = name.match(/(\d+)\s*(?:ml|ML)/);
  return match ? parseInt(match[1], 10) : 100;
}

function extractConcentration(name: string): string {
  const upper = name.toUpperCase();
  if (upper.includes('EXTRAIT')) return 'Extrait de Parfum';
  if (upper.includes('EDP') || upper.includes('EAU DE PARFUM')) return 'Eau de Parfum';
  if (upper.includes('EDT') || upper.includes('EAU DE TOILETTE')) return 'Eau de Toilette';
  if (upper.includes('EDC') || upper.includes('COLOGNE')) return 'Eau de Cologne';
  if (upper.includes('PARFUM') || upper.includes('ELIXIR')) return 'Parfum';
  return 'Eau de Parfum';
}

function cleanGender(rawGender: string | undefined, name: string): string {
  const raw = (rawGender || '').toLowerCase();
  const nameL = name.toLowerCase();
  if (raw.includes('unisex') || nameL.includes('unisex')) return 'Unisex';
  if (raw.includes('mujer') || raw.includes('woman') || raw.includes('dama') || nameL.includes('femme')) return 'Mujer';
  if (raw.includes('hombre') || raw.includes('man') || nameL.includes('homme')) return 'Hombre';
  return 'Unisex';
}

function cleanTitle(name: string): string {
  return name.replace(/^Perfume\s+/i, '').trim();
}

function generateNotes(name: string, family: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  
  const notes = NOTE_SETS[family] || NOTE_SETS['Oriental / Ámbar'];
  const sample = (arr: string[], count: number) => {
    const shuffled = [...arr].sort((a, b) => ((hash + a.charCodeAt(0)) % 7) - ((hash + b.charCodeAt(0)) % 7));
    return shuffled.slice(0, count);
  };

  const top = sample(notes.top, 3);
  const heart = sample(notes.heart, 3);
  const base = sample(notes.base, 3);

  const vibes = [
    'Elegante, Sofisticado, Firma Personal',
    'Seductor, Nocturno, Enigmático',
    'Fresco, Enérgico, Versátil para Diario',
    'Cálido, Acogedor, Sensual',
    'Poderoso, Proyectante, Alta Distinción',
    'Magnético, Vibrante, Moderno'
  ];
  const vibe = vibes[hash % vibes.length];
  const longevities = ['8.5/10 (8-10 hrs)', '9/10 (10-12 hrs)', '9.5/10 (12+ hrs)', '7.5/10 (6-8 hrs)'];
  const sillages = ['Alta', 'Moderada a Alta', 'Enorme', 'Proyectante'];

  return {
    top,
    heart,
    base,
    vibe,
    longevity: longevities[hash % longevities.length],
    sillage: sillages[hash % sillages.length]
  };
}

export async function processExcelBuffer(
  buffer: Buffer,
  options: ProcessExcelOptions = {}
): Promise<ExcelProcessingResult> {
  const retailMarkup = options.retailMarkupPct ?? 48;
  const normalMarkup = options.normalMarkupPct ?? 30;
  const uploadedBy = options.uploadedBy ?? 'admin';
  const filename = options.filename ?? 'lista_precios.xlsx';

  // 1. Read workbook
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames.find(s => s.toUpperCase().includes('PRECIO') || s.toUpperCase().includes('LISTA')) || workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`No se encontró ninguna hoja válida en el archivo Excel.`);
  }

  const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  // 2. Locate starting row of data
  let startRowIndex = 0;
  for (let r = 0; r < Math.min(rawRows.length, 25); r++) {
    const row = rawRows[r];
    if (row && row.some(cell => typeof cell === 'string' && (cell.toLowerCase().includes('marca') || cell.toLowerCase().includes('producto') || cell.toLowerCase().includes('precio')))) {
      startRowIndex = r + 1;
      break;
    }
  }
  if (startRowIndex === 0) startRowIndex = 13;

  // 3. Fetch existing perfumes from Supabase
  const { data: existingPerfumes, error: fetchErr } = await supabaseAdmin
    .from('perfumes')
    .select('*');

  if (fetchErr) {
    throw new Error(`Error al conectar con Supabase: ${fetchErr.message}`);
  }

  const skuMap = new Map<string, any>();
  const nameMap = new Map<string, any>();
  for (const p of existingPerfumes || []) {
    if (p.sku) skuMap.set(p.sku.trim().toLowerCase(), p);
    if (p.name) nameMap.set(p.name.trim().toLowerCase(), p);
  }

  const uniqueUpsertMap = new Map<string, any>();
  const seenSkusThisFile = new Set<string>();
  const diffs: PriceDiffItem[] = [];
  let updatedCount = 0;
  let createdCount = 0;
  let unchangedCount = 0;
  let validRowsCount = 0;

  for (let r = startRowIndex; r < rawRows.length; r++) {
    const row = rawRows[r];
    if (!row || row.length === 0) continue;

    const brand = String(row[0] || '').trim() || 'Prestige Perfumes';
    const rawName = String(row[1] || '').trim();
    let rawSku = String(row[2] || '').trim();
    const rawEan = String(row[3] || '').trim();
    const rawGender = String(row[4] || '').trim();
    const rawFormat = String(row[5] || '').trim() || 'REGULAR';
    const rawWholesale = Number(row[6]);

    if (!rawName || isNaN(rawWholesale) || rawWholesale <= 0) {
      continue;
    }

    validRowsCount++;
    if (!rawSku) {
      rawSku = `PERF-${r + 1}`;
    }

    if (seenSkusThisFile.has(rawSku)) {
      rawSku = `${rawSku}-${r + 1}`;
    }
    seenSkusThisFile.add(rawSku);

    const cleanSkuKey = rawSku.toLowerCase();
    const cleanNameKey = rawName.toLowerCase();

    // Calculate retail price and original price
    const retailPrice = Math.round((rawWholesale * (1 + retailMarkup / 100)) / 100) * 100;
    const originalPrice = Math.round((retailPrice * (1 + normalMarkup / 100)) / 100) * 100;

    const existing = skuMap.get(cleanSkuKey) || nameMap.get(cleanNameKey);

    if (existing) {
      const priceDiff = retailPrice - (existing.price || 0);
      const wholesaleDiff = rawWholesale - (existing.wholesale_price || 0);

      if (priceDiff !== 0 || wholesaleDiff !== 0) {
        updatedCount++;
        diffs.push({
          sku: existing.sku,
          name: existing.name,
          brand: existing.brand,
          oldWholesale: existing.wholesale_price || 0,
          newWholesale: rawWholesale,
          oldRetailPrice: existing.price || 0,
          newRetailPrice: retailPrice,
          priceDiff,
          isNew: false
        });
      } else {
        unchangedCount++;
      }

      uniqueUpsertMap.set(existing.sku, {
        ...existing,
        name: existing.name || cleanTitle(rawName),
        full_name: existing.full_name || rawName,
        brand: existing.brand || brand,
        gender: existing.gender || cleanGender(rawGender, rawName),
        family: existing.family || determineFamily(rawName, brand),
        wholesale_price: rawWholesale,
        price: retailPrice,
        original_price: originalPrice,
        format: rawFormat,
        updated_at: new Date().toISOString()
      });
    } else {
      // New product enrichment
      createdCount++;
      const family = determineFamily(rawName, brand);
      const gender = cleanGender(rawGender, rawName);
      const title = cleanTitle(rawName);
      const volume = extractVolume(rawName);
      const concentration = extractConcentration(rawName);
      const notes = generateNotes(rawName, family);
      
      let imgHash = 0;
      for (let i = 0; i < rawName.length; i++) imgHash = (imgHash * 31 + rawName.charCodeAt(i)) >>> 0;
      const image = LUXURY_BOTTLE_IMAGES[imgHash % LUXURY_BOTTLE_IMAGES.length];

      diffs.push({
        sku: rawSku,
        name: title,
        brand,
        oldWholesale: 0,
        newWholesale: rawWholesale,
        oldRetailPrice: 0,
        newRetailPrice: retailPrice,
        priceDiff: retailPrice,
        isNew: true
      });

      uniqueUpsertMap.set(rawSku, {
        id: `perf-${Date.now()}-${r}`,
        sku: rawSku,
        ean: rawEan || null,
        name: title,
        full_name: rawName,
        brand,
        gender,
        format: rawFormat,
        volume,
        concentration,
        family,
        price: retailPrice,
        original_price: originalPrice,
        wholesale_price: rawWholesale,
        stock: 15,
        top_notes: notes.top,
        heart_notes: notes.heart,
        base_notes: notes.base,
        all_notes: Array.from(new Set([...notes.top, ...notes.heart, ...notes.base])),
        vibe: notes.vibe,
        longevity: notes.longevity,
        sillage: notes.sillage,
        occasions: ['Versátil', 'Todo el año', 'Uso Diario'],
        rating: 4.8,
        reviews: 20,
        image,
        is_best_seller: false,
        is_new: true,
        description: `${title} de ${brand} es una creación olfativa de la familia ${family}.`,
        updated_at: new Date().toISOString()
      });
    }
  }

  // 4. Batch upsert in chunks of 100 with strictly unique SKUs
  const upsertList = Array.from(uniqueUpsertMap.values());
  const chunkSize = 100;
  for (let i = 0; i < upsertList.length; i += chunkSize) {
    const chunk = upsertList.slice(i, i + chunkSize);
    const { error: upsertErr } = await supabaseAdmin
      .from('perfumes')
      .upsert(chunk, { onConflict: 'sku' });

    if (upsertErr) {
      throw new Error(`Error al guardar lote en Supabase: ${upsertErr.message}`);
    }
  }

  // 5. Save log to price_update_logs
  await supabaseAdmin.from('price_update_logs').insert([{
    filename,
    total_rows: validRowsCount,
    updated_count: updatedCount,
    created_count: createdCount,
    unchanged_count: unchangedCount,
    markup_retail_pct: retailMarkup,
    markup_normal_pct: normalMarkup,
    uploaded_by: uploadedBy,
    summary_json: {
      totalProcessed: validRowsCount,
      updated: updatedCount,
      created: createdCount,
      unchanged: unchangedCount,
      sampleDiffs: diffs.slice(0, 100)
    }
  }]);

  return {
    success: true,
    filename,
    totalRows: validRowsCount,
    updatedCount,
    createdCount,
    unchangedCount,
    retailMarkupPct: retailMarkup,
    normalMarkupPct: normalMarkup,
    diffs
  };
}
