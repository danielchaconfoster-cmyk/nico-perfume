'use client';

import React from 'react';
import { useCart } from '@/lib/cart-context';
import { formatCLP } from '@/lib/utils';
import { X, Scale, ShoppingBag, Trash2, Layers, Clock, Wind } from 'lucide-react';
import Image from 'next/image';

export function CompareModal() {
  const { compareList, isCompareOpen, setIsCompareOpen, removeFromCompare, clearCompare, addToCart } = useCart();

  if (!isCompareOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c0c10] border border-gold-500/30 p-6 sm:p-8 shadow-2xl shadow-black">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-gold-400" />
            <h2 className="font-serif text-xl sm:text-2xl text-zinc-100 font-light">
              Comparativa Olfativa Cara a Cara
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-zinc-400 hover:text-rose-400 transition"
              >
                Limpiar lista
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition"
              aria-label="Cerrar comparador"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {compareList.length === 0 ? (
          <div className="text-center py-16">
            <Scale className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-300 font-medium">No has añadido fragancias para comparar</p>
            <p className="text-xs text-zinc-400 mt-1">
              Haz clic en el icono de balanza en cualquier perfume del catálogo para contrastar sus notas y proyección.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="p-3 text-zinc-500 font-semibold w-1/4">Característica</th>
                  {compareList.map(p => (
                    <th key={p.id} className="p-3 w-1/4">
                      <div className="relative">
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          className="absolute -top-1 right-0 text-zinc-500 hover:text-rose-400 p-1"
                          title="Eliminar de comparativa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 mx-auto mb-2">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <p className="text-[10px] text-gold-400 uppercase font-bold text-center truncate">{p.brand}</p>
                        <h4 className="text-xs font-semibold text-zinc-100 text-center truncate">{p.name}</h4>
                        <p className="text-sm font-bold text-gold-300 text-center font-serif mt-1">{formatCLP(p.price)}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                <tr>
                  <td className="p-3 font-semibold text-zinc-400">Familia Olfativa</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-3 text-zinc-200 font-medium">{p.family}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-400">Concentración & Formato</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-3 text-zinc-300">{p.concentration} ({p.volume}ml)</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-400">Notas de Salida</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-3 text-zinc-300">{p.topNotes.join(', ')}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-400">Notas de Corazón</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-3 text-zinc-300">{p.heartNotes.join(', ')}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-400">Notas de Fondo</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-3 text-zinc-300">{p.baseNotes.join(', ')}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-400">Longevidad Estimada</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-3 text-zinc-200 font-medium">{p.longevity}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-400">Proyección / Estela</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-3 text-zinc-200 font-medium">{p.sillage}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-400">Comprar</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-3">
                      <button
                        onClick={() => {
                          addToCart(p);
                          setIsCompareOpen(false);
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Agregar</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
