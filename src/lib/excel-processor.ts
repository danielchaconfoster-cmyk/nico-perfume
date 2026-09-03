import * as XLSX from 'xlsx';
import { supabaseAdmin } from './supabase-admin';

export interface ProcessExcelOptions {
  uploadedBy?: string;
  filename?: string;
}

export interface PriceDiffItem {
  sku: string;
  name: string;
  brand: string;
  oldPrice: number;
  newPrice: number;
  oldReferential: number;
  newReferential: number;
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
  diffs: PriceDiffItem[];
  error?: string;
}

const LUXURY_BOTTLE_IMAGES = [
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80'
];

function cleanTitle(name: string): string {
  return name.replace(/^Perfume\s+/i, '').trim();
}

export async function processExcelBuffer(
  buffer: Buffer,
  options: ProcessExcelOptions = {}
): Promise<ExcelProcessingResult> {
  const uploadedBy = options.uploadedBy ?? 'Nico Admin';
  const filename = options.filename ?? 'lista_precios.xlsx';

  // 1. Read workbook
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames.find(s => s.toUpperCase().includes('PRECIO') || s.toUpperCase().includes('LISTA')) || workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error('No se encontró ninguna hoja válida en el archivo Excel.');
  }

  const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  // 2. Fetch all existing perfumes from Supabase
  const { data: existingPerfumes, error: fetchErr } = await supabaseAdmin
    .from('perfumes')
    .select('*');

  if (fetchErr) {
    throw new Error(`Error al conectar con Supabase: ${fetchErr.message}`);
  }

  const skuMap = new Map<string, any>();
  const idMap = new Map<string, any>();
  const fullNameMap = new Map<string, any>();
  const nameMap = new Map<string, any>();

  for (const p of existingPerfumes || []) {
    if (p.sku) skuMap.set(p.sku.trim().toLowerCase(), p);
    if (p.id) idMap.set(p.id.trim().toLowerCase(), p);
    if (p.full_name) fullNameMap.set(p.full_name.trim().toLowerCase(), p);
    if (p.name) nameMap.set(p.name.trim().toLowerCase(), p);
  }

  const updatesMap = new Map<string, any>();
  const diffs: PriceDiffItem[] = [];
  let updatedCount = 0;
  let createdCount = 0;
  let unchangedCount = 0;
  let validRowsCount = 0;

  for (let r = 13; r < rawRows.length; r++) {
    const row = rawRows[r];
    if (!row || row.length === 0) continue;

    const brand = String(row[0] || '').trim() || 'Prestige Perfumes';
    const rawName = String(row[1] || '').trim();
    const rawSku = String(row[2] || '').trim();
    const rawEan = String(row[3] || '').trim();
    const rawFormat = String(row[5] || '').trim() || 'REGULAR';
    const rawPrice = Number(row[6]); // Exact final selling price from Excel

    // Skip empty rows, sub-headers, or invalid prices
    if (!rawName || rawName.toLowerCase() === 'nombre' || isNaN(rawPrice) || rawPrice <= 0) {
      continue;
    }

    validRowsCount++;
    const rowSku = rawSku || `PERF-${r + 1}`;
    const rowId = `perf-${r + 1}`;

    // Final selling price is EXACTLY the price from the Excel
    const sellingPrice = Math.round(rawPrice);
    // Referential retail price (Falabella/Mall) with ~23% OFF badge
    const originalPrice = Math.round((sellingPrice * 1.30) / 100) * 100;
    const wholesalePrice = Math.round(sellingPrice * 0.70);

    // Match priority: SKU -> ID -> Full Name -> Clean Name
    const existing = 
      (rawSku ? skuMap.get(rawSku.toLowerCase()) : null) ||
      idMap.get(rowId.toLowerCase()) ||
      fullNameMap.get(rawName.toLowerCase()) ||
      nameMap.get(cleanTitle(rawName).toLowerCase());

    if (existing) {
      const priceDiff = sellingPrice - (existing.price || 0);

      if (priceDiff !== 0) {
        updatedCount++;
        diffs.push({
          sku: existing.sku,
          name: existing.name,
          brand: existing.brand,
          oldPrice: existing.price || 0,
          newPrice: sellingPrice,
          oldReferential: existing.original_price || 0,
          newReferential: originalPrice,
          priceDiff,
          isNew: false
        });
      } else {
        unchangedCount++;
      }

      updatesMap.set(existing.id, {
        id: existing.id,
        sku: existing.sku,
        ean: rawEan || existing.ean,
        name: existing.name,
        full_name: existing.full_name || rawName,
        brand: existing.brand || brand,
        gender: existing.gender || 'Unisex',
        format: rawFormat,
        volume: existing.volume || 100,
        concentration: existing.concentration || 'Eau de Parfum',
        family: existing.family || 'Oriental / Ámbar',
        wholesale_price: wholesalePrice,
        price: sellingPrice,
        original_price: originalPrice,
        stock: existing.stock ?? 15,
        top_notes: existing.top_notes || [],
        heart_notes: existing.heart_notes || [],
        base_notes: existing.base_notes || [],
        all_notes: existing.all_notes || [],
        vibe: existing.vibe || '',
        longevity: existing.longevity || '',
        sillage: existing.sillage || '',
        occasions: existing.occasions || [],
        rating: existing.rating || 4.8,
        reviews: existing.reviews || 25,
        image: existing.image || LUXURY_BOTTLE_IMAGES[0],
        is_best_seller: Boolean(existing.is_best_seller),
        is_new: Boolean(existing.is_new),
        description: existing.description || '',
        updated_at: new Date().toISOString()
      });
    } else {
      // New product
      createdCount++;
      const title = cleanTitle(rawName);

      diffs.push({
        sku: rowSku,
        name: title,
        brand,
        oldPrice: 0,
        newPrice: sellingPrice,
        oldReferential: 0,
        newReferential: originalPrice,
        priceDiff: sellingPrice,
        isNew: true
      });

      updatesMap.set(rowId, {
        id: rowId,
        sku: rowSku,
        ean: rawEan || null,
        name: title,
        full_name: rawName,
        brand,
        gender: 'Unisex',
        format: rawFormat,
        volume: 100,
        concentration: 'Eau de Parfum',
        family: 'Oriental / Ámbar',
        price: sellingPrice,
        original_price: originalPrice,
        wholesale_price: wholesalePrice,
        stock: 15,
        top_notes: ['Bergamota', 'Lavanda', 'Cardamomo'],
        heart_notes: ['Jazmín', 'Ámbar', 'Cedro'],
        base_notes: ['Vainilla', 'Almizcle', 'Pachulí'],
        all_notes: ['Bergamota', 'Lavanda', 'Cardamomo', 'Jazmín', 'Ámbar', 'Cedro', 'Vainilla', 'Almizcle', 'Pachulí'],
        vibe: 'Elegante, Sofisticado, Firma Personal',
        longevity: '9/10 (10-12 hrs)',
        sillage: 'Alta',
        occasions: ['Versátil', 'Todo el año', 'Uso Diario'],
        rating: 4.8,
        reviews: 25,
        image: LUXURY_BOTTLE_IMAGES[0],
        is_best_seller: false,
        is_new: true,
        description: `${title} de ${brand} es una creación olfativa excepcional.`,
        updated_at: new Date().toISOString()
      });
    }
  }

  if (validRowsCount === 0) {
    throw new Error('El archivo Excel no contiene ninguna fila válida con precios y nombres de productos.');
  }

  // 3. Batch upsert in chunks of 100
  const upsertList = Array.from(updatesMap.values());
  const chunkSize = 100;
  for (let i = 0; i < upsertList.length; i += chunkSize) {
    const chunk = upsertList.slice(i, i + chunkSize);
    const { error: upsertErr } = await supabaseAdmin
      .from('perfumes')
      .upsert(chunk, { onConflict: 'id' });

    if (upsertErr) {
      throw new Error(`Error al guardar lote en Supabase: ${upsertErr.message}`);
    }
  }

  // 4. Save audit log
  await supabaseAdmin.from('price_update_logs').insert([{
    filename,
    total_rows: validRowsCount,
    updated_count: updatedCount,
    created_count: createdCount,
    unchanged_count: unchangedCount,
    markup_retail_pct: 0,
    markup_normal_pct: 30,
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
    diffs
  };
}
