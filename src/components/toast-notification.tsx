'use client';

import React from 'react';
import { useCart } from '@/lib/cart-context';
import { Check } from 'lucide-react';

export function ToastNotification() {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-fadeIn pointer-events-none">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-[#0a0a0e]/95 text-zinc-100 border border-zinc-700/80 rounded-xl shadow-2xl backdrop-blur-md">
        <div className="w-5 h-5 rounded-full bg-zinc-800 text-gold-400 flex items-center justify-center shrink-0">
          <Check className="w-3 h-3" />
        </div>
        <span className="text-xs font-normal tracking-wide text-zinc-200">{toast}</span>
      </div>
    </div>
  );
}
