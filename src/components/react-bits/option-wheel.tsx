'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface OptionWheelProps {
  items: string[];
  defaultSelected?: number;
  textColor?: string;
  activeColor?: string;
  side?: 'left' | 'right' | 'center';
  fontSize?: number;
  spacing?: number;
  curve?: number;
  tilt?: number;
  blur?: number;
  fade?: number;
  smoothing?: number;
  inset?: number;
  loop?: boolean;
  draggable?: boolean;
  soundUrl?: string;
  soundVolume?: number;
  onChange?: (index: number, item: string) => void;
  onSelect?: (index: number, item: string) => void;
  className?: string;
}

// Gentle synthetic tick using Web Audio API
function playSyntheticTick(volume: number = 0.2) {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch {
    // Silent fallback
  }
}

export function OptionWheel({
  items = [],
  defaultSelected = 0,
  textColor = '#a1a1aa',
  activeColor = '#ffffff',
  side = 'right',
  fontSize = 2.0,
  spacing = 1.25,
  loop = true,
  draggable = true,
  soundUrl,
  soundVolume = 0.2,
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
  const hasMovedRef = useRef<boolean>(false);
  const lastRoundedIdxRef = useRef<number>(initialIdx);

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

  // Buttery-smooth spring loop
  useEffect(() => {
    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;

      const diff = targetPosRef.current - posRef.current;

      // Silky spring easing
      if (Math.abs(diff) > 0.001) {
        posRef.current += diff * 0.22;
        setDisplayPos(posRef.current);
      } else if (posRef.current !== targetPosRef.current) {
        posRef.current = targetPosRef.current;
        setDisplayPos(posRef.current);
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
  }, [count, loop, items, triggerTick, onChange]);

  // Navigate to previous item
  const handlePrev = useCallback(() => {
    targetPosRef.current = Math.round(targetPosRef.current) - 1;
    if (!loop) targetPosRef.current = Math.max(0, targetPosRef.current);
  }, [loop]);

  // Navigate to next item
  const handleNext = useCallback(() => {
    targetPosRef.current = Math.round(targetPosRef.current) + 1;
    if (!loop) targetPosRef.current = Math.min(count - 1, targetPosRef.current);
  }, [loop, count]);

  // Direct Click on any item (instant selection & snap)
  const handleItemClick = (idx: number, text: string) => {
    if (loop) {
      const currentNorm = ((posRef.current % count) + count) % count;
      let diff = idx - currentNorm;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;
      targetPosRef.current = posRef.current + diff;
    } else {
      targetPosRef.current = idx;
    }

    onSelect?.(idx, text);
  };

  // Touch & Pointer Drag Handlers (DO NOT capture pointer to allow clean clicks!)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartYRef.current = e.clientY;
    dragStartTargetRef.current = targetPosRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaY = e.clientY - dragStartYRef.current;
    if (Math.abs(deltaY) > 6) {
      hasMovedRef.current = true;
    }
    const itemHeightPx = 44;
    const deltaStep = -deltaY / itemHeightPx;

    targetPosRef.current = dragStartTargetRef.current + deltaStep;
    if (!loop) {
      targetPosRef.current = Math.max(0, Math.min(count - 1, targetPosRef.current));
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    targetPosRef.current = Math.round(targetPosRef.current);
  };

  const VISIBLE_COUNT = 2; // -2, -1, 0, 1, 2 for clean mobile view

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={"relative select-none flex flex-col justify-center overflow-visible touch-pan-y " + className}
      style={{
        minHeight: '180px',
      }}
    >
      {/* 1. Quick Up/Down Controls for 1-Tap Accessibility */}
      <div className="flex items-center justify-between sm:justify-end gap-2 mb-1 px-1 z-30">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Opción anterior"
          className="p-1.5 rounded-full bg-black/70 hover:bg-gold-500/20 text-zinc-400 hover:text-gold-300 border border-white/10 hover:border-gold-500/40 transition active:scale-95 shadow-md flex items-center justify-center cursor-pointer"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-mono text-zinc-400 sm:hidden">
          {activeIdx + 1} / {count}
        </span>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Siguiente opción"
          className="p-1.5 rounded-full bg-black/70 hover:bg-gold-500/20 text-zinc-400 hover:text-gold-300 border border-white/10 hover:border-gold-500/40 transition active:scale-95 shadow-md flex items-center justify-center cursor-pointer"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Wheel Stack Container */}
      <div className="relative h-[150px] sm:h-[170px] w-full flex items-center justify-center sm:justify-end overflow-visible">
        {Array.from({ length: VISIBLE_COUNT * 2 + 1 }).map((_, slotIdx) => {
          const slotOffset = slotIdx - VISIBLE_COUNT;
          const baseCenterInt = Math.floor(displayPos);
          const fractionalOffset = displayPos - baseCenterInt;

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
          const isSelected = absDist < 0.45;

          const translateY = continuousDist * 38;
          const scale = Math.max(0.74, 1 - absDist * 0.15);
          const itemOpacity = Math.max(0.2, 1 - absDist * 0.42);

          const isLongName = itemText.length > 13;
          const isVeryLongName = itemText.length > 16;

          return (
            <div
              key={targetIndex + '-' + slotIdx}
              onClick={(e) => {
                e.stopPropagation();
                if (!hasMovedRef.current) {
                  handleItemClick(targetIndex, itemText);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={itemText}
              className="absolute left-0 right-0 flex items-center justify-center sm:justify-end cursor-pointer group transition-all duration-200 py-1"
              style={{
                top: '50%',
                transform: "translateY(" + translateY + "px) translateY(-50%) scale(" + scale + ")",
                opacity: itemOpacity,
                zIndex: Math.round(20 - absDist * 5),
              }}
            >
              <div
                className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 border " + (
                  isSelected
                    ? 'bg-black/80 border-gold-400/60 shadow-lg shadow-gold-500/15 ring-1 ring-gold-400/30'
                    : 'bg-transparent border-transparent hover:border-white/10'
                )}
              >
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse shrink-0" />
                )}
                <span
                  className={"font-serif uppercase transition-all duration-200 truncate max-w-[270px] sm:max-w-[340px] " + (
                    isVeryLongName
                      ? 'text-xs sm:text-sm md:text-base tracking-wider'
                      : isLongName
                      ? 'text-sm sm:text-base md:text-lg tracking-wider'
                      : 'text-base sm:text-lg md:text-xl tracking-[0.15em]'
                  ) + " " + (
                    isSelected
                      ? 'text-zinc-100 font-medium drop-shadow-[0_2px_8px_rgba(197,168,128,0.4)]'
                      : 'text-zinc-400 group-hover:text-zinc-200 font-light'
                  )}
                >
                  {itemText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OptionWheel;
