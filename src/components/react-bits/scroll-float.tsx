'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollFloatProps {
  children: string;
  className?: string;
  containerClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollOffset?: any;
}

export function ScrollFloat({
  children,
  className = '',
  containerClassName = '',
  animationDuration = 0.8,
  ease = 'easeOut',
  scrollOffset = ['start 0.9', 'start 0.25'],
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = children.split(' ');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: scrollOffset,
  });

  return (
    <div ref={containerRef} className={`inline-flex flex-wrap gap-x-2 ${containerClassName}`}>
      {words.map((word, wordIndex) => {
        const start = wordIndex / words.length;

        // Animate each word smoothly based on scroll progress
        const opacity = useTransform(scrollYProgress, [start * 0.7, start + 0.3], [0.25, 1]);
        const y = useTransform(scrollYProgress, [start * 0.7, start + 0.3], [20, 0]);
        const scale = useTransform(scrollYProgress, [start * 0.7, start + 0.3], [0.96, 1]);

        return (
          <motion.span
            key={wordIndex}
            style={{ opacity, y, scale }}
            className={`inline-block will-change-transform ${className}`}
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}
