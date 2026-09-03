'use client';

import React from 'react';
import { MetallicPaint } from '@/components/react-bits/metallic-paint';

interface BrandLogoMetalProps {
  variant?: 'gold' | 'chrome' | 'rose-gold';
  width?: string;
  height?: string;
  className?: string;
}

export function BrandLogoMetal({
  variant = 'gold',
  width = '100%',
  height = '180px',
  className = '',
}: BrandLogoMetalProps) {
  // Color presets
  const presets = {
    gold: {
      lightColor: '#fff5d6',
      darkColor: '#1c1508',
      tintColor: '#d4af37',
    },
    chrome: {
      lightColor: '#ffffff',
      darkColor: '#0a0a12',
      tintColor: '#9bb5d9',
    },
    'rose-gold': {
      lightColor: '#fff0f3',
      darkColor: '#1f0d14',
      tintColor: '#e098a7',
    },
  };

  const currentPreset = presets[variant] || presets.gold;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <MetallicPaint
        imageSrc="/nico-perfume-logo.svg"
        seed={42}
        scale={3.5}
        patternSharpness={1.2}
        noiseScale={0.6}
        speed={0.35}
        liquid={0.8}
        mouseAnimation={true}
        brightness={2.2}
        contrast={0.6}
        refraction={0.02}
        blur={0.01}
        chromaticSpread={2.5}
        fresnel={1.2}
        angle={45}
        waveAmplitude={1.2}
        distortion={1.1}
        contour={0.3}
        lightColor={currentPreset.lightColor}
        darkColor={currentPreset.darkColor}
        tintColor={currentPreset.tintColor}
      />
    </div>
  );
}

export default BrandLogoMetal;
