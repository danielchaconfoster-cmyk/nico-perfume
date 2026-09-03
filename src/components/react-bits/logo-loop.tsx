'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface LogoItem {
  node?: React.ReactNode;
  src?: string;
  alt?: string;
  title?: string;
  href?: string;
  category?: string;
  origin?: string;
}

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number; // Duration in seconds or relative speed
  direction?: 'left' | 'right' | 'up' | 'down';
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number; // 0 to pause on hover
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel?: string;
  useCustomRender?: boolean;
  className?: string;
}

export function LogoLoop({
  logos = [],
  speed = 40,
  direction = 'left',
  logoHeight = 48,
  gap = 40,
  hoverSpeed = 0,
  scaleOnHover = true,
  fadeOut = true,
  fadeOutColor = '#08080c',
  ariaLabel = 'Brand Partners & Luxury Houses',
  useCustomRender = false,
  className = '',
}: LogoLoopProps) {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate list for infinite seamless marquee
  const duplicatedLogos = [...logos, ...logos, ...logos];

  const isVertical = direction === 'up' || direction === 'down';
  const isReverse = direction === 'right' || direction === 'down';

  // Animation duration calculation (lower speed value = faster; high value = smooth continuous flow)
  const durationSec = Math.max(10, speed);

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => {
        if (hoverSpeed === 0) setIsPaused(true);
      }}
      onMouseLeave={() => {
        if (hoverSpeed === 0) setIsPaused(false);
      }}
      className={`relative overflow-hidden w-full select-none ${className}`}
      style={{
        height: isVertical ? '100%' : 'auto',
      }}
    >
      {/* Edge Gradient Fade Out Masks */}
      {fadeOut && !isVertical && (
        <>
          <div
            className="absolute inset-y-0 left-0 w-24 sm:w-36 pointer-events-none z-10"
            style={{
              background: `linear-gradient(to right, ${fadeOutColor} 0%, transparent 100%)`,
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-24 sm:w-36 pointer-events-none z-10"
            style={{
              background: `linear-gradient(to left, ${fadeOutColor} 0%, transparent 100%)`,
            }}
          />
        </>
      )}

      {fadeOut && isVertical && (
        <>
          <div
            className="absolute inset-x-0 top-0 h-16 pointer-events-none z-10"
            style={{
              background: `linear-gradient(to bottom, ${fadeOutColor} 0%, transparent 100%)`,
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-16 pointer-events-none z-10"
            style={{
              background: `linear-gradient(to top, ${fadeOutColor} 0%, transparent 100%)`,
            }}
          />
        </>
      )}

      {/* Marquee Motion Track */}
      <div
        className={`flex ${isVertical ? 'flex-col' : 'flex-row items-center'} w-max`}
        style={{
          gap: `${gap}px`,
          animation: `${isVertical ? 'marquee-vertical' : 'marquee'} ${durationSec}s linear infinite`,
          animationDirection: isReverse ? 'reverse' : 'normal',
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {duplicatedLogos.map((item, index) => {
          const content = (
            <div
              className={`flex items-center justify-center transition-all duration-300 ${
                scaleOnHover ? 'hover:scale-105 active:scale-95' : ''
              }`}
              style={{
                height: isVertical ? 'auto' : `${logoHeight}px`,
              }}
            >
              {item.node ? (
                <div className="flex items-center gap-2 text-zinc-300 hover:text-gold-300 transition-colors">
                  {item.node}
                  {item.title && (
                    <span className="font-serif text-sm tracking-wider uppercase">{item.title}</span>
                  )}
                </div>
              ) : item.src ? (
                <img
                  src={item.src}
                  alt={item.alt || item.title || 'Brand logo'}
                  className="object-contain filter grayscale contrast-125 opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  style={{ height: `${logoHeight}px` }}
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-zinc-900/40 hover:bg-zinc-850/80 border border-zinc-800/80 hover:border-gold-500/40 transition-colors shadow-sm">
                  <div className="flex flex-col text-left">
                    <span className="font-serif tracking-[0.2em] text-xs sm:text-sm font-medium text-zinc-200 hover:text-gold-300 transition-colors uppercase whitespace-nowrap">
                      {item.title || item.alt}
                    </span>
                    {(item.origin || item.category) && (
                      <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase -mt-0.5">
                        {item.origin} {item.category ? `• ${item.category}` : ''}
                      </span>
                    )}
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400/40 shrink-0 ml-1" />
                </div>
              )}
            </div>
          );

          if (item.href) {
            return (
              <Link
                key={index}
                href={item.href}
                className="shrink-0 block focus:outline-none focus:ring-1 focus:ring-gold-400 rounded-2xl"
                tabIndex={0}
              >
                {content}
              </Link>
            );
          }

          return (
            <div key={index} className="shrink-0">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LogoLoop;
