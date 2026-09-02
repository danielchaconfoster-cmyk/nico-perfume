'use client';

import React from 'react';
import { useCart } from '@/lib/cart-context';
import { Sparkles } from 'lucide-react';

export function ToastNotification() {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300 pointer-events-none">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-zinc-900/95 text-gold-300 border border-gold-500/40 rounded-xl shadow-2xl shadow-black/80 backdrop-blur-md">
        <Sparkles className="w-5 h-5 text-gold-400 shrink-0" />
        <span className="text-sm font-medium text-zinc-100">{toast}</span>
      </div>
    </div>
  );
}
