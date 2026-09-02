'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface SceneItem {
  id: string;
  type: 'perfume' | 'model';
  pairIndex: number; // 0 to 4 (5 pairs)
  gender: 'Mujer' | 'Hombre' | 'Unisex';
  title: string;
  subtitle: string;
  imageUrl: string;
}

export const CINEMATIC_SCENES: SceneItem[] = [
  // Pair 1: Mujer - Dulzura Viral
  {
    id: 'p1-perfume',
    type: 'perfume',
    pairIndex: 0,
    gender: 'Mujer',
    title: 'Lattafa Yara Rosa (Extrait)',
    subtitle: 'Extracto dulce de vainilla, orquídea y malvavisco',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'p1-model',
    type: 'model',
    pairIndex: 0,
    gender: 'Mujer',
    title: 'Aplicación Femenina Sublime',
    subtitle: 'Rocío en cuello y muñecas para fijación de 12 horas',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1600&auto=format&fit=crop&q=85',
  },

  // Pair 2: Hombre - Seducción Nocturna
  {
    id: 'p2-perfume',
    type: 'perfume',
    pairIndex: 1,
    gender: 'Hombre',
    title: 'Afnan 9 PM Black EDP',
    subtitle: 'Manzana silvestre, canela especiada y vainilla negra',
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'p2-model',
    type: 'model',
    pairIndex: 1,
    gender: 'Hombre',
    title: 'El Ritual de Seducción Masculina',
    subtitle: 'Proyección imponente para citas y eventos nocturnos',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&auto=format&fit=crop&q=85',
  },

  // Pair 3: Unisex - Nicho Real y Oro
  {
    id: 'p3-perfume',
    type: 'perfume',
    pairIndex: 2,
    gender: 'Unisex',
    title: 'Al Haramain Amber Oud Gold',
    subtitle: 'Piña ahumada, bergamota pura y ámbar cristalino',
    imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'p3-model',
    type: 'model',
    pairIndex: 2,
    gender: 'Unisex',
    title: 'Aura Unisex de Alta Costura',
    subtitle: 'Elegancia compartida con estela monumental',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600&auto=format&fit=crop&q=85',
  },

  // Pair 4: Mujer - Glamour & Oriental
  {
    id: 'p4-perfume',
    type: 'perfume',
    pairIndex: 3,
    gender: 'Mujer',
    title: 'Lattafa Khamrah & Good Girl Vibe',
    subtitle: 'Canela de Ceilán, praliné tostado y licor de dátiles',
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'p4-model',
    type: 'model',
    pairIndex: 3,
    gender: 'Mujer',
    title: 'Elegancia Nocturna Inolvidable',
    subtitle: 'Sensualidad cálida que viste cada instante',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1600&auto=format&fit=crop&q=85',
  },

  // Pair 5: Hombre - Poder & Cuero Real
  {
    id: 'p5-perfume',
    type: 'perfume',
    pairIndex: 4,
    gender: 'Hombre',
    title: 'Bharara King Parfum',
    subtitle: 'Naranja sanguina, enebro fresco y maderas nobles',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'p5-model',
    type: 'model',
    pairIndex: 4,
    gender: 'Hombre',
    title: 'Presencia Imponente & Sofisticación',
    subtitle: 'La firma del hombre seguro y carismático',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1600&auto=format&fit=crop&q=85',
  },
];

interface PixelDissolveBackgroundProps {
  onSceneChange?: (scene: SceneItem) => void;
  className?: string;
}

export function PixelDissolveBackground({ onSceneChange, className = '' }: PixelDissolveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let isCancelled = false;
    let animationFrameId: number;

    // Preload all images
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    CINEMATIC_SCENES.forEach((scene, i) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = scene.imageUrl;
      img.onload = () => {
        loadedCount++;
      };
      loadedImages[i] = img;
    });

    // Dimensions
    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation Timing
    const HOLD_TIME_MS = 3800; // Time holding crisp image
    const TRANSITION_TIME_MS = 1400; // Duration of pixel dissolve transition
    const TOTAL_STEP_MS = HOLD_TIME_MS + TRANSITION_TIME_MS;

    let startTime = performance.now();
    let currentIdx = 0;
    let nextIdx = 1;

    // Helper to draw image scaled to cover canvas
    const drawCoverImage = (
      img: HTMLImageElement,
      targetCanvas: HTMLCanvasElement | CanvasRenderingContext2D,
      pixelFactor: number,
      scaleZoom: number = 1.0
    ) => {
      if (!img.complete || img.naturalWidth === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;

      // Downsampled buffer size
      const pw = Math.max(8, Math.floor(cw * pixelFactor));
      const ph = Math.max(8, Math.floor(ch * pixelFactor));

      // Calculate object-cover aspect ratio
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = cw / ch;

      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      if (imgAspect > canvasAspect) {
        sw = img.naturalHeight * canvasAspect;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / canvasAspect;
        sy = (img.naturalHeight - sh) / 2;
      }

      // Create or reuse temporary low-res offscreen canvas
      const offscreen = document.createElement('canvas');
      offscreen.width = pw;
      offscreen.height = ph;
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      // Draw onto tiny canvas
      offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, pw, ph);

      // Draw blown up with pixelation
      ctx.imageSmoothingEnabled = false;
      ctx.save();
      
      // Subtle zoom around center
      if (scaleZoom !== 1.0) {
        ctx.translate(cw / 2, ch / 2);
        ctx.scale(scaleZoom, scaleZoom);
        ctx.translate(-cw / 2, -ch / 2);
      }

      ctx.drawImage(offscreen, 0, 0, pw, ph, 0, 0, cw, ch);
      ctx.restore();
    };

    const render = (time: number) => {
      if (isCancelled) return;

      const elapsed = time - startTime;
      const progressInCycle = elapsed % TOTAL_STEP_MS;
      const activeIdx = Math.floor(elapsed / TOTAL_STEP_MS) % CINEMATIC_SCENES.length;
      const targetNextIdx = (activeIdx + 1) % CINEMATIC_SCENES.length;

      if (activeIdx !== currentIdx) {
        currentIdx = activeIdx;
        nextIdx = targetNextIdx;
        setCurrentSceneIndex(currentIdx);
        onSceneChange?.(CINEMATIC_SCENES[currentIdx]);
      }

      const currentImg = loadedImages[currentIdx];
      const nextImg = loadedImages[nextIdx];

      ctx.fillStyle = '#08080c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (progressInCycle < HOLD_TIME_MS) {
        // Steady state: crisp image with subtle breathing zoom (1.0 -> 1.03)
        const holdProgress = progressInCycle / HOLD_TIME_MS;
        const zoom = 1.0 + holdProgress * 0.035;
        if (currentImg && currentImg.complete) {
          drawCoverImage(currentImg, ctx, 1.0, zoom);
        }
      } else {
        // Pixel Transition State: Dissolving between currentImg and nextImg
        const transProgress = (progressInCycle - HOLD_TIME_MS) / TRANSITION_TIME_MS; // 0 to 1

        if (transProgress < 0.5) {
          // Phase 1: Pixelate out current image (factor 1.0 -> 0.02)
          const p = transProgress / 0.5; // 0 to 1
          const factor = Math.max(0.015, Math.pow(1 - p, 2.2));
          const zoom = 1.035 + p * 0.02;
          if (currentImg && currentImg.complete) {
            drawCoverImage(currentImg, ctx, factor, zoom);
          }
        } else {
          // Phase 2: Unpixelate next image (factor 0.02 -> 1.0)
          const p = (transProgress - 0.5) / 0.5; // 0 to 1
          const factor = Math.max(0.015, Math.pow(p, 2.2));
          const zoom = 1.0 + (1 - p) * 0.02;
          if (nextImg && nextImg.complete) {
            drawCoverImage(nextImg, ctx, factor, zoom);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [onSceneChange]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* 1. Canvas Pixel Engine Layer */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover scale-[1.02] filter brightness-[0.72] contrast-[1.12]"
      />

      {/* 2. Luxury Dark Film Vignette & Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-[#07070b]/65 to-[#07070b]/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07070b] via-transparent to-[#07070b]/90" />
      <div className="absolute inset-0 bg-radial-vignette opacity-50" />

      {/* 3. Subtle Luxury Gold Particle Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gold-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
}
