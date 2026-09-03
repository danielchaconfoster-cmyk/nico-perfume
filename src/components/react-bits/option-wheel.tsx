'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface OptionWheelProps {
  items: string[];
  defaultSelected?: number;
  textColor?: string;
  activeColor?: string;
  side?: 'left' | 'right';
  fontSize?: number; // In rem units (e.g. 2.5 or 3)
  spacing?: number; // Distance multiplier between items
  curve?: number; // 3D depth curvature intensity
  tilt?: number; // 3D tilt angle in degrees
  blur?: number; // Maximum blur in px for edge items
  fade?: number; // Opacity decay factor (0 to 1)
  smoothing?: number; // Transition smoothing in ms
  inset?: number; // Margin from the chosen side in px
  loop?: boolean;
  draggable?: boolean;
  soundUrl?: string;
  soundVolume?: number;
  onChange?: (index: number, item: string) => void;
  onSelect?: (index: number, item: string) => void;
  className?: string;
}

// Synthetic haptic click audio synthesizer via Web Audio API
function playSyntheticTick(volume: number = 0.3) {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch {
    // Graceful fallback if audio is blocked
  }
}

export function OptionWheel({
  items = [],
  defaultSelected = 0,
  textColor = '#a6a6a6',
  activeColor = '#ffffff',
  side = 'right',
  fontSize = 2.8,
  spacing = 1.35,
  curve = 1,
  tilt = 6,
  blur = 2,
  fade = 0.28,
  smoothing = 220,
  inset = 0,
  loop = true,
  draggable = true,
  soundUrl,
  soundVolume = 0.3,
  onChange,
  onSelect,
  className = '',
}: OptionWheelProps) {
  const [selectedIndex, setSelectedIndex] = useState(
    Math.min(Math.max(0, defaultSelected), Math.max(0, items.length - 1))
  );
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStartY = useRef(0);
  const dragStartOffset = useRef(0);
  const lastWheelTime = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevIndexRef = useRef(selectedIndex);

  // Initialize sound if URL provided
  useEffect(() => {
    if (soundUrl && typeof Audio !== 'undefined') {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.volume = soundVolume;
    }
  }, [soundUrl, soundVolume]);

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      playSyntheticTick(soundVolume);
    }
  }, [soundVolume]);

  // Trigger sound and onChange when selectedIndex changes
  useEffect(() => {
    if (prevIndexRef.current !== selectedIndex) {
      prevIndexRef.current = selectedIndex;
      playSound();
      if (items[selectedIndex]) {
        onChange?.(selectedIndex, items[selectedIndex]);
      }
    }
  }, [selectedIndex, items, onChange, playSound]);

  // Sync if defaultSelected changes externally
  useEffect(() => {
    if (defaultSelected >= 0 && defaultSelected < items.length) {
      setSelectedIndex(defaultSelected);
    }
  }, [defaultSelected, items.length]);

  const changeIndex = useCallback(
    (newIdx: number) => {
      let finalIdx = newIdx;
      if (loop) {
        finalIdx = ((newIdx % items.length) + items.length) % items.length;
      } else {
        finalIdx = Math.max(0, Math.min(items.length - 1, newIdx));
      }
      setSelectedIndex(finalIdx);
    },
    [loop, items.length]
  );

  // Wheel event handler
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastWheelTime.current < 180) return;
      lastWheelTime.current = now;

      if (e.deltaY > 10 || e.deltaX > 10) {
        changeIndex(selectedIndex + 1);
      } else if (e.deltaY < -10 || e.deltaX < -10) {
        changeIndex(selectedIndex - 1);
      }
    },
    [selectedIndex, changeIndex]
  );

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartOffset.current = offset;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStartY.current;
    const itemHeightPx = fontSize * 16 * spacing;
    const steps = -deltaY / itemHeightPx;

    if (Math.abs(steps) >= 1) {
      const stepInt = Math.round(steps);
      changeIndex(selectedIndex + stepInt);
      dragStartY.current = e.clientY;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Visible window of items around selectedIndex
  const VISIBLE_COUNT = 3; // 3 items above, 3 items below
  const renderedIndices: number[] = [];

  for (let i = -VISIBLE_COUNT; i <= VISIBLE_COUNT; i++) {
    const rawIdx = selectedIndex + i;
    if (loop) {
      const normalizedIdx = ((rawIdx % items.length) + items.length) % items.length;
      renderedIndices.push(normalizedIdx);
    } else {
      if (rawIdx >= 0 && rawIdx < items.length) {
        renderedIndices.push(rawIdx);
      }
    }
  }

  const isRight = side === 'right';

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative select-none flex flex-col justify-center overflow-visible touch-none cursor-grab active:cursor-grabbing ${className}`}
      style={{
        perspective: '1000px',
        paddingRight: isRight ? `${inset}px` : '0',
        paddingLeft: !isRight ? `${inset}px` : '0',
        alignItems: isRight ? 'flex-end' : 'flex-start',
        minHeight: `${(VISIBLE_COUNT * 2 + 1) * fontSize * 1.5}rem`,
      }}
    >
      <div className="relative flex flex-col items-inherit w-full">
        {Array.from({ length: VISIBLE_COUNT * 2 + 1 }).map((_, slotIdx) => {
          const distance = slotIdx - VISIBLE_COUNT; // -3, -2, -1, 0, 1, 2, 3
          let targetIndex = selectedIndex + distance;

          if (loop) {
            targetIndex = ((targetIndex % items.length) + items.length) % items.length;
          } else {
            if (targetIndex < 0 || targetIndex >= items.length) {
              return <div key={slotIdx} className="h-0 pointer-events-none" />;
            }
          }

          const itemText = items[targetIndex];
          const isSelected = distance === 0;
          const absDist = Math.abs(distance);

          // 3D Cylindrical Transformation Math
          const translateY = distance * (fontSize * 16 * spacing * 0.72);
          const rotateX = -distance * (14 * curve);
          const rotateY = isRight ? -(distance * tilt * 0.6) : distance * tilt * 0.6;
          const rotateZ = isRight ? -(distance * 2) : distance * 2;
          const translateZ = -absDist * (35 * curve);
          const scale = Math.max(0.7, 1 - absDist * 0.1);
          const itemOpacity = Math.max(0.12, 1 - absDist * fade);
          const itemBlur = absDist * blur * 0.6;

          return (
            <div
              key={`${targetIndex}-${slotIdx}`}
              onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                  onSelect?.(targetIndex, itemText);
                } else {
                  changeIndex(targetIndex);
                }
              }}
              className="absolute left-0 right-0 flex items-center transition-all cursor-pointer group"
              style={{
                justifyContent: isRight ? 'flex-end' : 'flex-start',
                top: '50%',
                transformOrigin: isRight ? 'right center' : 'left center',
                transform: `translateY(${translateY}px) translateY(-50%) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                opacity: itemOpacity,
                filter: itemBlur > 0.1 ? `blur(${itemBlur}px)` : 'none',
                transitionDuration: `${smoothing}ms`,
                transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                zIndex: 20 - absDist,
              }}
            >
              <span
                className={`font-serif tracking-[0.2em] uppercase transition-colors duration-200 whitespace-nowrap ${
                  isSelected
                    ? 'font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#fff5d6] via-[#d4af37] to-[#fcebc2] drop-shadow-[0_0_25px_rgba(212,175,55,0.6)]'
                    : 'font-light hover:text-gold-300/80'
                }`}
                style={{
                  fontSize: `${fontSize}rem`,
                  color: isSelected ? activeColor : textColor,
                  textShadow: isSelected
                    ? '0 0 35px rgba(212, 175, 55, 0.4), 0 2px 10px rgba(0, 0, 0, 0.8)'
                    : '0 2px 6px rgba(0,0,0,0.5)',
                }}
              >
                {itemText}
              </span>

              {/* Glowing active indicator dot */}
              {isSelected && (
                <span
                  className={`w-2 h-2 rounded-full bg-gold-400 shadow-[0_0_12px_#d4af37] animate-pulse ${
                    isRight ? 'ml-3' : 'mr-3 order-first'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OptionWheel;
