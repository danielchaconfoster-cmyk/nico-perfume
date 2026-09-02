'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
}

export function TiltedCard({
  children,
  className = '',
  rotateAmplitude = 10,
  scaleOnHover = 1.02,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    setRotateX(-mouseY * rotateAmplitude);
    setRotateY(mouseX * rotateAmplitude);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      whileHover={{ scale: scaleOnHover }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
