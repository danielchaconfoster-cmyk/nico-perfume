'use client';

import React, { useState } from 'react';
import { Perfume } from '@/types/perfume';
import { formatCLP } from '@/lib/utils';
import {
  Building2,
  TrendingUp,
  Percent,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface WholesalePortalProps {
  perfumes: Perfume[];
}

export function WholesalePortal({ perfumes }: WholesalePortalProps) {
  const [estimatedUnits, setEstimatedUnits] = useState(12);

  // Determine discount tier
  const discountTier =
    estimatedUnits >= 24
      ? { name: 'Nivel Oro VIP Distribuidor', discount: 52, badge: '52% DESCUENTO' }
      : estimatedUnits >= 12
      ? { name: 'Nivel Plata Pro Boutique', discount: 45, badge: '45% DESCUENTO' }
      : { name: 'Nivel Bronce Starter', discount: 35, badge: '35% DESCUENTO' };

  // Calculate sample wholesale order estimate
  const avgRetailPrice = 45000;
  const unitWholesalePrice = Math.round(avgRetailPrice * (1 - discountTier.discount / 100));
  const estimatedInvestment = unitWholesalePrice * estimatedUnits;
  const estimatedRetailRevenue = avgRetailPrice * estimatedUnits;
  const estimatedProfit = estimatedRetailRevenue - estimatedInvestment;

  const handleWhatsAppWholesale = () => {
    const text = encodeURIComponent(
      `Hola Nico Perfume B2B. Deseo información comercial para compras mayoristas (${estimatedUnits} unidades, ${discountTier.name}). Solicito la lista de precios mayorista actualizada y condiciones de facturación.`
    );
    window.open(`https://wa.me/56912345678?text=${text}`, '_blank');
  };

  return (
    <section id="mayorista" className="py-20 bg-[#050508] border-t border-zinc-900 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[11px] font-medium tracking-[0.3em] text-zinc-400 uppercase mb-3">
            División B2B & Distribución Comercial
          </p>

          <h2 className="font-serif text-3xl sm:text-5xl font-light text-zinc-100 leading-[1.2]">
            Abastecimiento Mayorista Directo <br />
            <span className="italic text-gold-gradient font-normal">Para Boutiques y Emprendedores.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Acceso a precios de importación en perfumería árabe y de diseñador desde 6 unidades. Emisión de Factura o Boleta Electrónica con RUT empresa y logística prioritaria a todo Chile.
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Bronce */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 hover:border-zinc-750 transition flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400 uppercase">
                Desde 6 Unidades
              </span>
              <h3 className="font-serif text-xl text-zinc-100 mt-2 font-normal">Nivel Bronce Starter</h3>
              <p className="text-2xl font-serif font-light text-gold-300 mt-1">35% Descuento</p>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Ideal para compras iniciales o creación de catálogo propio.
              </p>

              <ul className="mt-5 space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Compra mínima 6 unidades mixtas</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Acceso a marcas árabes y diseñador</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Factura electrónica con IVA desglosado</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setEstimatedUnits(6)}
              className="mt-6 w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium tracking-[0.15em] uppercase transition"
            >
              Simular Plan Bronce
            </button>
          </div>

          {/* Plata */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-gold-500/40 relative shadow-2xl flex flex-col justify-between">
            <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gold-400 text-black text-[9px] font-bold uppercase tracking-[0.2em]">
              Más Solicitado
            </span>
            <div>
              <span className="text-[10px] tracking-[0.2em] font-semibold text-gold-400 uppercase">
                Desde 12 Unidades
              </span>
              <h3 className="font-serif text-xl text-zinc-100 mt-2 font-normal">Nivel Plata Pro</h3>
              <p className="text-2xl font-serif font-light text-gold-300 mt-1">45% Descuento</p>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                El plan estándar para boutiques y tiendas especializadas.
              </p>

              <ul className="mt-5 space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Compra mínima 12 unidades</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Reserva prioritaria de novedades virales</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Fichas técnicas y material digital para reventa</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setEstimatedUnits(12)}
              className="mt-6 w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-gold-400 text-black text-xs font-medium tracking-[0.15em] uppercase transition"
            >
              Simular Plan Plata
            </button>
          </div>

          {/* Oro */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 hover:border-zinc-750 transition flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400 uppercase">
                Desde 24 Unidades
              </span>
              <h3 className="font-serif text-xl text-zinc-100 mt-2 font-normal">Nivel Oro VIP Distribuidor</h3>
              <p className="text-2xl font-serif font-light text-gold-300 mt-1">52% Descuento</p>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Tarifa máxima para distribuidores y revendedores regionales.
              </p>

              <ul className="mt-5 space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Compra mínima 24 unidades</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Despacho 100% bonificado a regiones</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Atención ejecutiva 1 a 1 por WhatsApp</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setEstimatedUnits(24)}
              className="mt-6 w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium tracking-[0.15em] uppercase transition"
            >
              Simular Plan Oro
            </button>
          </div>
        </div>

        {/* Interactive Wholesale Simulator */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold-400">
                Calculadora Comercial B2B
              </p>
              <h3 className="font-serif text-xl sm:text-2xl text-zinc-100 mt-1 font-normal">
                Estima tu Margen y Retorno de Inversión
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Desplaza el selector para simular la inversión según la cantidad de unidades y la ganancia esperada con precios promedio de mercado.
              </p>

              {/* Slider */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-300">Volumen Simulado:</span>
                  <span className="text-gold-300 font-bold">{estimatedUnits} Unidades</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="60"
                  step="2"
                  value={estimatedUnits}
                  onChange={e => setEstimatedUnits(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-gold-400"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>6 un. (35%)</span>
                  <span>12 un. (45%)</span>
                  <span>24+ un. (52%)</span>
                  <span>60 un. (Distribución)</span>
                </div>
              </div>
            </div>

            {/* Profit Card */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-xs text-zinc-400">Escala Aplicada:</span>
                <span className="text-xs font-medium text-gold-300">
                  {discountTier.name} ({discountTier.discount}% OFF)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Inversión Estimada:</span>
                <span className="text-zinc-200 font-medium font-serif">{formatCLP(estimatedInvestment)}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Venta Retail Proyectada:</span>
                <span className="text-zinc-200 font-medium font-serif">{formatCLP(estimatedRetailRevenue)}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Margen Neto Estimado:</span>
                <span className="text-xl font-serif text-gold-300">{formatCLP(estimatedProfit)}</span>
              </div>

              <button
                onClick={handleWhatsAppWholesale}
                className="w-full mt-4 py-3.5 px-4 rounded-xl bg-zinc-100 hover:bg-gold-400 text-black font-medium text-xs tracking-[0.15em] uppercase transition text-center shadow-lg"
              >
                Contactar Ejecutivo Mayorista por WhatsApp
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
