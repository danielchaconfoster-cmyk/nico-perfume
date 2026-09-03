'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled client exception:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#08080a] text-zinc-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 shadow-xl shadow-rose-500/10">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-light text-zinc-100">
            Algo no salió como esperábamos
          </h2>
          <p className="text-xs text-zinc-400 font-light">
            Ha ocurrido un problema momentáneo en la conexión. Puedes reintentar la acción o volver a la tienda.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold uppercase tracking-wider transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
          <Link
            href="/"
            className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Inicio</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
