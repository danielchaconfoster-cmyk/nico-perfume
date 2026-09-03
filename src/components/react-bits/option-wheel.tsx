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
  smoothing?: number; // Inertia smoothing factor (0.1 to 0.3)
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
function playSyntheticTick(volume: number = 0.25) {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(volume * 0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch {
    // Graceful fallback
  }
}

export function OptionWheel({
  items = [],
  defaultSelected = 0,
  textColor = '#8e8e93',
  activeColor = '#ffffff',
  side = 'right',
  fontSize = 2.6,
  spacing = 1.35,
  curve = 1.1,
  tilt = 6.5,
  blur = 2.5,
  fade = 0.3,
  smoothing = 0.16, // Continuous RAF spring dampening
  inset = 0,
  loop = true,
  draggable = true,
  soundUrl,
  soundVolume = 0.25,
  onChange,
  onSelect,
  className = '',
}: OptionWheelProps) {
  const count = items.length || 1;
  const initialIdx = Math.min(Math.max(0, defaultSelected), count - 1);

  // Position state (floating point for continuous silky animation)
  const [displayPos, setDisplayPos] = useState<number>(initialIdx);
  const [activeIdx, setActiveIdx] = useState<number>(initialIdx);

  const posRef = useRef<number>(initialIdx);
  const targetPosRef = useRef<number>(initialIdx);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartYRef = useRef<number>(0);
  const dragStartTargetRef = useRef<number>(initialIdx);
  const lastSnapTimeRef = useRef<number>(0);
  const lastRoundedIdxRef = useRef<number>(initialIdx);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number>(0);

  // Initialize sound if URL provided
  useEffect(() => {
    if (soundUrl && typeof Audio !== 'undefined') {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.volume = soundVolume;
    }
  }, [soundUrl, soundVolume]);

  const triggerTick = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      playSyntheticTick(soundVolume);
    }
  }, [soundVolume]);

  // Sync external changes to defaultSelected
  useEffect(() => {
    if (defaultSelected >= 0 && defaultSelected < count) {
      targetPosRef.current = defaultSelected;
      posRef.current = defaultSelected;
      setDisplayPos(defaultSelected);
      setActiveIdx(defaultSelected);
      lastRoundedIdxRef.current = defaultSelected;
    }
  }, [defaultSelected, count]);

  // Continuous physics loop for ultra-smooth fluid momentum
  useEffect(() => {
    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;

      const diff = targetPosRef.current - posRef.current;

      // Spring dampening interpolation
      if (Math.abs(diff) > 0.001) {
        posRef.current += diff * smoothing;
        setDisplayPos(posRef.current);
      } else if (posRef.current !== targetPosRef.current) {
        posRef.current = targetPosRef.current;
        setDisplayPos(posRef.current);
      }

      // Auto-snap to nearest integer when user stops scrolling/dragging
      const now = Date.now();
      if (!isDraggingRef.current && now - lastSnapTimeRef.current > 120) {
        const rounded = Math.round(targetPosRef.current);
        if (Math.abs(targetPosRef.current - rounded) > 0.001) {
          targetPosRef.current += (rounded - targetPosRef.current) * 0.12;
        }
      }

      // Calculate current normalized active integer index
      let currentInt = Math.round(posRef.current);
      if (loop) {
        currentInt = ((currentInt % count) + count) % count;
      } else {
        currentInt = Math.max(0, Math.min(count - 1, currentInt));
      }

      if (currentInt !== lastRoundedIdxRef.current && items[currentInt]) {
        lastRoundedIdxRef.current = currentInt;
        setActiveIdx(currentInt);
        triggerTick();
        onChange?.(currentInt, items[currentInt]);
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [count, loop, items, smoothing, triggerTick, onChange]);

  // Instant response Wheel Handler (no debounce blocking!)
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Fluid sensitivity for trackpad & mouse wheel
      const delta = (e.deltaY || e.deltaX) * 0.0028;
      targetPosRef.current += delta;

      if (!loop) {
        targetPosRef.current = Math.max(-0.4, Math.min(count - 0.6, targetPosRef.current));
      }

      lastSnapTimeRef.current = Date.now();
    },
    [loop, count]
  );

  // Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    isDraggingRef.current = true;
    dragStartYRef.current = e.clientY;
    dragStartTargetRef.current = targetPosRef.current;
    lastSnapTimeRef.current = Date.now();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaY = e.clientY - dragStartYRef.current;
    const itemHeightPx = fontSize * 16 * spacing * 0.9;
    const deltaStep = -deltaY / itemHeightPx;

    targetPosRef.current = dragStartTargetRef.current + deltaStep;
    if (!loop) {
      targetPosRef.current = Math.max(-0.4, Math.min(count - 0.6, targetPosRef.current));
    }
    lastSnapTimeRef.current = Date.now();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    lastSnapTimeRef.current = Date.now();
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Direct Click on any item (instant snap and navigate)
  const handleItemClick = (idx: number, text: string) => {
    // Snap target to clicked index
    if (loop) {
      // Find shortest angular distance in loop
      const currentNorm = ((posRef.current % count) + count) % count;
      let diff = idx - currentNorm;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;
      targetPosRef.current = posRef.current + diff;
    } else {
      targetPosRef.current = idx;
    }

    lastSnapTimeRef.current = Date.now();
    onSelect?.(idx, text);
  };

  const VISIBLE_COUNT = 3;
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
        perspective: '1200px',
        perspectiveOrigin: isRight ? '85% 50%' : '15% 50%',
        paddingRight: isRight ? `${inset}px` : '0',
        paddingLeft: !isRight ? `${inset}px` : '0',
        alignItems: isRight ? 'flex-end' : 'flex-start',
        minHeight: `${(VISIBLE_COUNT * 2 + 1) * fontSize * 1.4}rem`,
      }}
    >
      <div className="relative flex flex-col items-inherit w-full">
        {Array.from({ length: VISIBLE_COUNT * 2 + 1 }).map((_, slotIdx) => {
          const slotOffset = slotIdx - VISIBLE_COUNT; // -3, -2, -1, 0, 1, 2, 3
          const baseCenterInt = Math.floor(displayPos);
          const fractionalOffset = displayPos - baseCenterInt; // [0, 1)

          // Continuous relative distance from exact center
          const rawItemIndex = baseCenterInt + slotOffset;
          const continuousDist = slotOffset - fractionalOffset;

          let targetIndex = rawItemIndex;
          if (loop) {
            targetIndex = ((rawItemIndex % count) + count) % count;
          } else {
            if (targetIndex < 0 || targetIndex >= count) {
              return <div key={slotIdx} className="h-0 pointer-events-none" />;
            }
          }

          const itemText = items[targetIndex] || '';
          const absDist = Math.abs(continuousDist);
          const isSelected = absDist < 0.5;

          // Continuous 3D Cylindrical Transformation Math
          const translateY = continuousDist * (fontSize * 16 * spacing * 0.72);
          const rotateX = -continuousDist * (14 * curve);
          const rotateY = isRight ? -(continuousDist * tilt * 0.6) : continuousDist * tilt * 0.6;
          const rotateZ = isRight ? -(continuousDist * 1.8) : continuousDist * 1.8;
          const translateZ = -absDist * (32 * curve);
          const scale = Math.max(0.68, 1 - absDist * 0.11);
          const itemOpacity = Math.max(0.12, 1 - absDist * fade);
          const itemBlur = absDist * blur * 0.55;

          return (
            <div
              key={`${targetIndex}-${slotIdx}`}
              onClick={(e) => {
                e.stopPropagation();
                handleItemClick(targetIndex, itemText);
              }}
              className="absolute left-0 right-0 flex items-center cursor-pointer group transition-colors duration-150"
              style={{
                justifyContent: isRight ? 'flex-end' : 'flex-start',
                top: '50%',
                transformOrigin: isRight ? 'right center' : 'left center',
                transform: `translateY(${translateY}px) translateY(-50%) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                opacity: itemOpacity,
                filter: itemBlur > 0.15 ? `blur(${itemBlur}px)` : 'none',
                zIndex: Math.round(30 - absDist * 5),
              }}
            >
              <span
                className={`font-serif tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#fff5d6] via-[#d4af37] to-[#fcebc2]'
                    : 'font-light hover:text-gold-300/90'
                }`}
                style={{
                  fontSize: `${fontSize}rem`,
                  color: isSelected ? activeColor : textColor,
                  textShadow: isSelected
                    ? '0 0 35px rgba(212, 175, 55, 0.45), 0 2px 10px rgba(0, 0, 0, 0.85)'
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
