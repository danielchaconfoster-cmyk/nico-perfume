import os
import sys
import json
import time
import requests
import io
import re
import urllib.parse
from PIL import Image, ImageChops
from concurrent.futures import ThreadPoolExecutor, as_completed

# Asegurar codificación UTF-8 en consola Windows
try:
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

# Configuración de carpetas
IMAGES_DIR = os.path.join('public', 'images', 'perfumes')
DATA_PATH = os.path.join('src', 'data', 'perfumes.json')
STATE_PATH = os.path.join('scripts', 'images_state.json')

os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs('scripts', exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'es-CL,es;q=0.9,en;q=0.8'
}

# Fallbacks de botellas de ultra lujo por familia olfativa (en caso de productos antiguos/descontinuados)
FAMILY_FALLBACKS = {
    'Oriental / Ámbar': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
    'Amaderada': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
    'Cítrica / Fresca': 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80',
    'Floral': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    'Gourmand / Dulce': 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80',
    'Cuero / Especiada': 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800&auto=format&fit=crop&q=80',
    'Aromática / Fougère': 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&auto=format&fit=crop&q=80'
}

def clean_search_title(brand, name):
    title = f"{brand} {name}"
    # Quitar palabras genéricas que interfieren en la búsqueda
    title = re.sub(r'\b(Perfume|Set|Estuche|Tester|Vaporizador|Spray|ml|ML|Hombre|Mujer|Dama|Unisex|EDP|EDT|EDC|Extrait|de|Parfum|Toilette)\b', '', title, flags=re.IGNORECASE)
    title = re.sub(r'\s+', ' ', title).strip()
    words = title.split()
    return ' '.join(words[:4])

def search_shopify_store(domain, query):
    if not query or len(query) < 2:
        return None
    try:
        url = f"https://{domain}/search/suggest.json?q={urllib.parse.quote(query)}&resources[type]=product&resources[limit]=4"
        r = requests.get(url, headers=HEADERS, timeout=5)
        if r.status_code == 200:
            data = r.json()
            products = data.get('resources', {}).get('results', {}).get('products', [])
            for p in products:
                img = p.get('image')
                if img:
                    if img.startswith('//'):
                        img = 'https:' + img
                    elif not img.startswith('http'):
                        img = f'https://{domain}' + img
                    return img
    except Exception:
        pass
    return None

def find_image_url(perfume):
    sku = perfume.get('sku', '').split('-')[0].strip()
    ean = perfume.get('ean', '').strip()
    brand = perfume.get('brand', '').strip()
    name = perfume.get('name', '').strip()

    # 1. Búsqueda directa por SKU en catálogo mayorista Cosmetic Wholesale
    if sku and len(sku) >= 3:
        img = search_shopify_store('cosmeticwholesale.cl', sku)
        if img:
            return img, 'cosmeticwholesale_sku'

    # 2. Búsqueda por SKU en Cosmetic.cl
    if sku and len(sku) >= 3:
        img = search_shopify_store('cosmetic.cl', sku)
        if img:
            return img, 'cosmetic_sku'

    # 3. Búsqueda por EAN (código de barra oficial)
    if ean and len(ean) >= 8:
        for domain in ['cosmeticwholesale.cl', 'cosmetic.cl', 'eliteperfumes.cl']:
            img = search_shopify_store(domain, ean)
            if img:
                return img, f'{domain}_ean'

    # 4. Búsqueda por Título Limpio (Marca + Nombre clave)
    clean_title = clean_search_title(brand, name)
    if clean_title:
        for domain in ['cosmeticwholesale.cl', 'cosmetic.cl', 'eliteperfumes.cl', 'mundoaromas.cl']:
            img = search_shopify_store(domain, clean_title)
            if img:
                return img, f'{domain}_title'

    # 5. Búsqueda por solo Nombre de la Fragancia
    if name:
        short_name = ' '.join(name.split()[:3])
        for domain in ['cosmeticwholesale.cl', 'cosmetic.cl']:
            img = search_shopify_store(domain, short_name)
            if img:
                return img, f'{domain}_name'

    # 6. Fallback por Familia Olfativa
    family = perfume.get('family', 'Oriental / Ámbar')
    fallback_url = FAMILY_FALLBACKS.get(family, FAMILY_FALLBACKS['Oriental / Ámbar'])
    return fallback_url, 'family_fallback'

def process_and_save_webp(img_data, output_path, target_size=(800, 800)):
    img = Image.open(io.BytesIO(img_data))
    
    # Manejar canal alpha / transparencia
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        img = img.convert('RGBA')
        bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
        img = Image.alpha_composite(bg, img).convert('RGB')
    else:
        img = img.convert('RGB')
        
    # Auto-recortar márgenes blancos excesivos si los hay
    try:
        bg_color = Image.new(img.mode, img.size, (255, 255, 255))
        diff = ImageChops.difference(img, bg_color)
        bbox = diff.getbbox()
        if bbox:
            w, h = img.size
            x0, y0, x1, y1 = bbox
            pad = 10
            bbox_padded = (max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad))
            img = img.crop(bbox_padded)
    except Exception:
        pass

    # Redimensionar para encajar con margen estético (canvas 800x800, imagen máx 700x700)
    img.thumbnail((target_size[0] - 100, target_size[1] - 100), Image.Resampling.LANCZOS)
    
    # Canvas blanco puro
    canvas = Image.new('RGB', target_size, (255, 255, 255))
    offset = ((target_size[0] - img.size[0]) // 2, (target_size[1] - img.size[1]) // 2)
    canvas.paste(img, offset)
    
    # Guardar en WebP comprimido y de alta definición
    canvas.save(output_path, 'WEBP', quality=86, method=6)

def process_single_perfume(perfume, idx, total):
    perf_id = perfume['id']
    out_file = os.path.join(IMAGES_DIR, f"{perf_id}.webp")
    local_rel_path = f"/images/perfumes/{perf_id}.webp"

    # Si ya existe y pesa más de 2KB, no volver a descargar
    if os.path.exists(out_file) and os.path.getsize(out_file) > 2048:
        return {
            'id': perf_id,
            'status': 'EXISTING',
            'localPath': local_rel_path,
            'sizeKb': os.path.getsize(out_file) // 1024,
            'source': 'cache'
        }

    img_url, source = find_image_url(perfume)
    
    try:
        r = requests.get(img_url, headers=HEADERS, timeout=12)
        if r.status_code == 200:
            process_and_save_webp(r.content, out_file)
            size_kb = os.path.getsize(out_file) // 1024
            return {
                'id': perf_id,
                'status': 'DOWNLOADED',
                'localPath': local_rel_path,
                'sizeKb': size_kb,
                'source': source
            }
        else:
            # Fallback de emergencia
            fb_url = FAMILY_FALLBACKS.get(perfume.get('family', 'Oriental / Ámbar'))
            fb_res = requests.get(fb_url, headers=HEADERS, timeout=10)
            process_and_save_webp(fb_res.content, out_file)
            return {
                'id': perf_id,
                'status': 'FALLBACK_HTTP',
                'localPath': local_rel_path,
                'sizeKb': os.path.getsize(out_file) // 1024,
                'source': 'fallback'
            }
    except Exception as e:
        # Fallback de emergencia
        try:
            fb_url = FAMILY_FALLBACKS.get(perfume.get('family', 'Oriental / Ámbar'))
            fb_res = requests.get(fb_url, headers=HEADERS, timeout=10)
            process_and_save_webp(fb_res.content, out_file)
            return {
                'id': perf_id,
                'status': 'FALLBACK_ERR',
                'localPath': local_rel_path,
                'sizeKb': os.path.getsize(out_file) // 1024,
                'source': 'fallback',
                'error': str(e)
            }
        except Exception as e2:
            return {
                'id': perf_id,
                'status': 'FAILED',
                'localPath': local_rel_path,
                'error': str(e2)
            }

def run_batch(max_workers=16, limit=None):
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        all_perfumes = json.load(f)

    perfumes_to_process = all_perfumes[:limit] if limit else all_perfumes

    total = len(perfumes_to_process)
    print(f"[*] Iniciando procesamiento de {total} perfumes con {max_workers} hilos concurrentes...\n", flush=True)

    results = {}
    completed = 0
    start_time = time.time()

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_perfume = {
            executor.submit(process_single_perfume, p, i, total): p
            for i, p in enumerate(perfumes_to_process)
        }

        for future in as_completed(future_to_perfume):
            p = future_to_perfume[future]
            completed += 1
            try:
                res = future.result()
                results[res['id']] = res
                
                # Actualizar el objeto perfume con la ruta local
                p['image'] = res['localPath']

                pct = (completed / total) * 100
                tag = "[OK]" if res['status'] in ('DOWNLOADED', 'EXISTING') else "[WARN]"
                print(f"[{completed:4d}/{total:4d}] ({pct:5.1f}%) {tag} {p['id']} ({p['brand']} - {p['name'][:30]}): {res['status']} ({res.get('source', '')} - {res.get('sizeKb', 0)}KB)", flush=True)
            except Exception as exc:
                print(f"[{completed:4d}/{total:4d}] [FAIL] {p['id']}: Excepción {exc}", flush=True)

    # Actualizar all_perfumes con las rutas de los resultados
    for p in all_perfumes:
        if p['id'] in results:
            p['image'] = results[p['id']]['localPath']

    elapsed = time.time() - start_time
    print(f"\n[+] Procesamiento completado en {elapsed:.1f} segundos ({elapsed/60:.1f} min).", flush=True)

    # Guardar perfumes.json actualizado con rutas locales 100%
    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(all_perfumes, f, ensure_ascii=False, indent=2)
    print(f"[+] Guardado src/data/perfumes.json con todas las rutas locales actualizadas.", flush=True)

    # Guardar estado y estadísticas
    stats = {
        'total': total,
        'downloaded': sum(1 for r in results.values() if r['status'] == 'DOWNLOADED'),
        'existing': sum(1 for r in results.values() if r['status'] == 'EXISTING'),
        'fallback': sum(1 for r in results.values() if 'FALLBACK' in r['status']),
        'failed': sum(1 for r in results.values() if r['status'] == 'FAILED'),
        'elapsedSeconds': round(elapsed, 1),
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
    }
    with open(STATE_PATH, 'w', encoding='utf-8') as f:
        json.dump({'stats': stats, 'details': results}, f, ensure_ascii=False, indent=2)
    print(f"[i] Estadisticas finales:", json.dumps(stats, indent=2), flush=True)

if __name__ == '__main__':
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else None
    run_batch(max_workers=16, limit=limit)
