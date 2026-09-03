'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

export interface SceneItem {
  id: string;
  type: 'perfume' | 'model';
  pairIndex: number;
  gender: 'Mujer' | 'Hombre' | 'Unisex';
  title: string;
  subtitle: string;
  imageUrl: string;
  focalX?: number; // 0.0 (left) to 1.0 (right), default 0.5
  focalY?: number; // 0.0 (top) to 1.0 (bottom), default 0.45
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
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1400&auto=format&fit=crop&q=80',
    focalX: 0.5,
    focalY: 0.45,
  },
  {
    id: 'p1-model',
    type: 'model',
    pairIndex: 0,
    gender: 'Mujer',
    title: 'Aplicación Femenina Sublime',
    subtitle: 'Rocío en cuello y muñecas para fijación de 12 horas',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1400&auto=format&fit=crop&q=80',
    focalX: 0.5,
    focalY: 0.28,
  },

  // Pair 2: Hombre - Seducción Nocturna
  {
    id: 'p2-perfume',
    type: 'perfume',
    pairIndex: 1,
    gender: 'Hombre',
    title: 'Afnan 9 PM Black EDP',
    subtitle: 'Manzana silvestre, canela especiada y vainilla negra',
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1400&auto=format&fit=crop&q=80',
    focalX: 0.5,
    focalY: 0.45,
  },
  {
    id: 'p2-model',
    type: 'model',
    pairIndex: 1,
    gender: 'Hombre',
    title: 'El Ritual de Seducción Masculina',
    subtitle: 'Proyección imponente para citas y eventos nocturnos',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&auto=format&fit=crop&q=80',
    focalX: 0.5,
    focalY: 0.28,
  },

  // Pair 3: Unisex - Nicho Real y Oro
  {
    id: 'p3-perfume',
    type: 'perfume',
    pairIndex: 2,
    gender: 'Unisex',
    title: 'Al Haramain Amber Oud Gold',
    subtitle: 'Piña ahumada, bergamota pura y ámbar cristalino',
    imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1400&auto=format&fit=crop&q=80',
    focalX: 0.5,
    focalY: 0.45,
  },
  {
    id: 'p3-model',
    type: 'model',
    pairIndex: 2,
    gender: 'Unisex',
    title: 'Aura Unisex de Alta Costura',
    subtitle: 'Elegancia compartida con estela monumental',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1400&auto=format&fit=crop&q=80',
    focalX: 0.5,
    focalY: 0.3,
  },

  // Pair 4: Mujer - Glamour & Oriental
  {
    id: 'p4-perfume',
    type: 'perfume',
    pairIndex: 3,
    gender: 'Mujer',
    title: 'Lattafa Khamrah & Good Girl Vibe',
    subtitle: 'Canela de Ceilán, praliné tostado y licor de dátiles',
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1400&auto=format&fit=crop&q=80',
    focalX: 0.5,
    focalY: 0.45,
  },
  {
    id: 'p4-model',
    type: 'model',
    pairIndex: 3,
    gender: 'Mujer',
    title: 'Elegancia Nocturna Inolvidable',
    subtitle: 'Sensualidad cálida que viste cada instante',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1400&auto=format&fit=crop&q=80',
    focalX: 0.5,
    focalY: 0.3,
  },

  // Pair 5: Hombre - Poder & Cuero Real
  {
    id: 'p5-perfume',
    type: 'perfume',
    pairIndex: 4,
    gender: 'Hombre',
    title: 'Bharara King Parfum',
    subtitle: 'Naranja sanguina, enebro fresco y maderas nobles',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1400&auto=format&fit=crop&q=80',
    focalX: 0.5,
    focalY: 0.45,
  },
  {
    id: 'p5-model',
    type: 'model',
    pairIndex: 4,
    gender: 'Hombre',
    title: 'Presencia Imponente & Sofisticación',
    subtitle: 'La firma del hombre seguro y carismático',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1400&auto=format&fit=crop&q=80',
    focalX: 0.5,
    focalY: 0.28,
  },
];

interface PixelDissolveBackgroundProps {
  onSceneChange?: (scene: SceneItem) => void;
  targetGender?: 'Hombre' | 'Mujer' | 'Unisex' | null;
  className?: string;
}

export function PixelDissolveBackground({
  onSceneChange,
  targetGender = null,
  className = '',
}: PixelDissolveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [, setCurrentIdx] = useState(0);
  const [, setNextIdx] = useState(1);

  // Single reusable offscreen canvas
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const targetGenderRef = useRef<'Hombre' | 'Mujer' | 'Unisex' | null>(targetGender);
  targetGenderRef.current = targetGender;

  useEffect(() => {
    if (!offscreenCanvasRef.current && typeof document !== 'undefined') {
      offscreenCanvasRef.current = document.createElement('canvas');
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let isCancelled = false;
    let animationFrameId: number;

    // Preload all image assets
    const loadedImages: HTMLImageElement[] = [];
    CINEMATIC_SCENES.forEach((scene, i) => {
      const img = new (window.Image || Image)();
      img.crossOrigin = 'anonymous';
      img.src = scene.imageUrl;
      loadedImages[i] = img;
    });

    const resizeCanvas = () => {
      if (!canvas) return;
      try {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.max(320, Math.floor(rect.width * dpr));
        canvas.height = Math.max(320, Math.floor(rect.height * dpr));
      } catch (err) {
        console.warn('Canvas resize error:', err);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const HOLD_TIME_MS = 4000;
    const TRANSITION_TIME_MS = 1200;
    const TOTAL_STEP_MS = HOLD_TIME_MS + TRANSITION_TIME_MS;

    let startTime = performance.now();
    let localCurrentIdx = 0;
    let localNextIdx = 1;
    let lastControlledGender: string | null = null;

    const drawCoverImage = (
      img: HTMLImageElement,
      pixelFactor: number,
      scaleZoom: number = 1.0,
      focalX: number = 0.5,
      focalY: number = 0.4
    ) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;
      if (cw === 0 || ch === 0) return;

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = cw / ch;

      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

      if (imgAspect > canvasAspect) {
        // Image is wider than portrait canvas (e.g. mobile screen) -> crop sides anchored on focalX
        sw = img.naturalHeight * canvasAspect;
        const targetCenter = img.naturalWidth * focalX;
        sx = Math.max(0, Math.min(img.naturalWidth - sw, targetCenter - sw / 2));
      } else {
        // Image is taller than landscape canvas -> crop top/bottom anchored on focalY
        sh = img.naturalWidth / canvasAspect;
        const targetCenter = img.naturalHeight * focalY;
        sy = Math.max(0, Math.min(img.naturalHeight - sh, targetCenter - sh / 2));
      }

      if (pixelFactor >= 0.95) {
        // High-res smooth render
        ctx.imageSmoothingEnabled = true;
        ctx.save();
        if (scaleZoom !== 1.0) {
          ctx.translate(cw / 2, ch / 2);
          ctx.scale(scaleZoom, scaleZoom);
          ctx.translate(-cw / 2, -ch / 2);
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
        ctx.restore();
      } else {
        // Pixelated render via reusable offscreen canvas
        const offscreen = offscreenCanvasRef.current;
        if (!offscreen) return;

        const pw = Math.max(6, Math.floor(cw * pixelFactor));
        const ph = Math.max(6, Math.floor(ch * pixelFactor));
        offscreen.width = pw;
        offscreen.height = ph;

        const offCtx = offscreen.getContext('2d');
        if (!offCtx) return;

        offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, pw, ph);

        ctx.imageSmoothingEnabled = false;
        ctx.save();
        if (scaleZoom !== 1.0) {
          ctx.translate(cw / 2, ch / 2);
          ctx.scale(scaleZoom, scaleZoom);
          ctx.translate(-cw / 2, -ch / 2);
        }
        ctx.drawImage(offscreen, 0, 0, pw, ph, 0, 0, cw, ch);
        ctx.restore();
      }
    };

    const render = (time: number) => {
      if (isCancelled) return;

      try {
        // Check if user manually requested a gender change
        const currentTargetGender = targetGenderRef.current;
        if (currentTargetGender && currentTargetGender !== lastControlledGender) {
          lastControlledGender = currentTargetGender;
          // Find first scene with matching gender
          const matchIdx = CINEMATIC_SCENES.findIndex(
            (s) => s.gender.toLowerCase() === currentTargetGender.toLowerCase()
          );
          if (matchIdx !== -1 && matchIdx !== localCurrentIdx) {
            localCurrentIdx = matchIdx;
            localNextIdx = (matchIdx + 1) % CINEMATIC_SCENES.length;
            startTime = time - HOLD_TIME_MS * 0.2; // Start quickly
            setCurrentIdx(localCurrentIdx);
            setNextIdx(localNextIdx);
            onSceneChange?.(CINEMATIC_SCENES[localCurrentIdx]);
          }
        }

        const elapsed = time - startTime;
        const progressInCycle = elapsed % TOTAL_STEP_MS;
        const activeIdx = Math.floor(elapsed / TOTAL_STEP_MS) % CINEMATIC_SCENES.length;
        const targetNextIdx = (activeIdx + 1) % CINEMATIC_SCENES.length;

        if (activeIdx !== localCurrentIdx && !targetGenderRef.current) {
          localCurrentIdx = activeIdx;
          localNextIdx = targetNextIdx;
          setCurrentIdx(localCurrentIdx);
          setNextIdx(localNextIdx);
          onSceneChange?.(CINEMATIC_SCENES[localCurrentIdx]);
        }

        const currentScene = CINEMATIC_SCENES[localCurrentIdx] || CINEMATIC_SCENES[0];
        const nextScene = CINEMATIC_SCENES[localNextIdx] || CINEMATIC_SCENES[1];

        const currentImg = loadedImages[localCurrentIdx];
        const nextImg = loadedImages[localNextIdx];

        ctx.fillStyle = '#08080c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (progressInCycle < HOLD_TIME_MS) {
          // Steady crisp stage with gentle zoom
          const holdProgress = progressInCycle / HOLD_TIME_MS;
          const zoom = 1.0 + holdProgress * 0.03;
          if (currentImg && currentImg.complete) {
            drawCoverImage(
              currentImg,
              1.0,
              zoom,
              currentScene.focalX ?? 0.5,
              currentScene.focalY ?? 0.4
            );
          }
        } else {
          // Pixel Dissolve Transition stage
          const transProgress = (progressInCycle - HOLD_TIME_MS) / TRANSITION_TIME_MS;

          if (transProgress < 0.5) {
            // Phase 1: Pixelate out
            const p = transProgress / 0.5;
            const factor = Math.max(0.015, Math.pow(1 - p, 2.2));
            const zoom = 1.03 + p * 0.02;
            if (currentImg && currentImg.complete) {
              drawCoverImage(
                currentImg,
                factor,
                zoom,
                currentScene.focalX ?? 0.5,
                currentScene.focalY ?? 0.4
              );
            }
          } else {
            // Phase 2: Unpixelate in
            const p = (transProgress - 0.5) / 0.5;
            const factor = Math.max(0.015, Math.pow(p, 2.2));
            const zoom = 1.0 + (1 - p) * 0.02;
            if (nextImg && nextImg.complete) {
              drawCoverImage(
                nextImg,
                factor,
                zoom,
                nextScene.focalX ?? 0.5,
                nextScene.focalY ?? 0.4
              );
            }
          }
        }
      } catch (err) {
        // Gracefully catch any animation render issues
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
        className="w-full h-full object-cover scale-[1.01] filter brightness-[0.78] contrast-[1.08]"
      />

      {/* 2. Responsive Luxury Film Vignette (Preserves clear center on mobile) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-[#07070b]/40 to-[#07070b]/60 sm:via-[#07070b]/55 sm:to-[#07070b]/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07070b]/90 via-[#07070b]/20 to-[#07070b]/80 sm:via-transparent" />

      {/* 3. Subtle Luxury Gold Glow */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-gold-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-72 h-72 sm:w-96 sm:h-96 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
    </div>
  );
}
