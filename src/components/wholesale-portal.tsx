'use client';

import React, { useState } from 'react';
import { Perfume } from '@/types/perfume';
import { formatCLP } from '@/lib/utils';
import {
  Building2,
  TrendingUp,
  Percent,
  FileSpreadsheet,
  MessageCircle,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface WholesalePortalProps {
  perfumes: Perfume[];
}

export function WholesalePortal({ perfumes }: WholesalePortalProps) {
  const [estimatedUnits, setEstimatedUnits] = useState(12);

  // Determine discount tier
  const discountTier =
    estimatedUnits >= 24
      ? { name: 'Nivel Oro VIP', discount: 52, badge: '52% DESCUENTO' }
      : estimatedUnits >= 12
      ? { name: 'Nivel Plata Pro', discount: 45, badge: '45% DESCUENTO' }
      : { name: 'Nivel Bronce Starter', discount: 35, badge: '35% DESCUENTO' };

  // Calculate sample wholesale order estimate
  const avgRetailPrice = 45000;
  const unitWholesalePrice = Math.round(avgRetailPrice * (1 - discountTier.discount / 100));
  const estimatedInvestment = unitWholesalePrice * estimatedUnits;
  const estimatedRetailRevenue = avgRetailPrice * estimatedUnits;
  const estimatedProfit = estimatedRetailRevenue - estimatedInvestment;

  const handleWhatsAppWholesale = () => {
    const text = encodeURIComponent(
      `Hola Nico Perfume B2B! Quiero información para compras al por mayor (${estimatedUnits} unidades, ${discountTier.name}). ¿Me pueden enviar la lista de precios mayorista actualizada y las condiciones de despacho a regiones?`
    );
    window.open(`https://wa.me/56912345678?text=${text}`, '_blank');
  };

  return (
    <section id="mayorista" className="py-20 bg-zinc-950 border-t border-zinc-800/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wider uppercase mb-4">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Portal Mayorista & Revendedores B2B</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-light text-zinc-100">
            Emprende en Perfumería con <br />
            <span className="italic text-gold-gradient font-normal">Márgenes de hasta 100%.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Abastécete con precios de importador directo desde 6 unidades. Entregamos factura o boleta electrónica, despacho prioritario a todo Chile y stock asegurado en más de 1.300 perfumes.
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Bronce */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-gold-500/30 transition flex flex-col justify-between">
            <div>
              <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase tracking-wider">
                Desde 6 Unidades
              </span>
              <h3 className="font-serif text-xl text-zinc-100 mt-2 font-normal">Nivel Bronce Starter</h3>
              <p className="text-2xl font-bold text-gold-400 font-serif mt-1">35% OFF</p>
              <p className="text-xs text-zinc-400 mt-2">Ideal para iniciar tu negocio de perfumería o compras grupales.</p>

              <ul className="mt-4 space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Compra mínima 6 unidades</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Variedad de marcas mixtas</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Factura con RUT empresa</li>
              </ul>
            </div>
            <button
              onClick={() => setEstimatedUnits(6)}
              className="mt-6 w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-semibold transition"
            >
              Simular Plan Bronce
            </button>
          </div>

          {/* Plata */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-gold-500/50 relative shadow-xl shadow-gold-500/10 flex flex-col justify-between">
            <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gold-500 text-black text-[10px] font-bold uppercase tracking-wider">
              MÁS POPULAR ⭐
            </span>
            <div>
              <span className="px-3 py-1 rounded-full bg-gold-950/80 border border-gold-500/40 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                Desde 12 Unidades
              </span>
              <h3 className="font-serif text-xl text-zinc-100 mt-2 font-normal">Nivel Plata Pro</h3>
              <p className="text-2xl font-bold text-gold-400 font-serif mt-1">45% OFF</p>
              <p className="text-xs text-zinc-400 mt-2">El plan preferido por boutiques y revendedores consolidados.</p>

              <ul className="mt-4 space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Compra mínima 12 unidades</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Acceso prioritario a novedades árabes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Asesoría comercial y material gráfico</li>
              </ul>
            </div>
            <button
              onClick={() => setEstimatedUnits(12)}
              className="mt-6 w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold uppercase tracking-wider transition"
            >
              Simular Plan Plata
            </button>
          </div>

          {/* Oro */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-gold-500/30 transition flex flex-col justify-between">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                Desde 24 Unidades
              </span>
              <h3 className="font-serif text-xl text-zinc-100 mt-2 font-normal">Nivel Oro VIP Distribuidor</h3>
              <p className="text-2xl font-bold text-emerald-400 font-serif mt-1">52% OFF</p>
              <p className="text-xs text-zinc-400 mt-2">Máximo descuento de importación para distribuidores regionales.</p>

              <ul className="mt-4 space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Compra mínima 24 unidades</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Despacho 100% GRATIS a regiones</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ejecutivo B2B exclusivo por WhatsApp</li>
              </ul>
            </div>
            <button
              onClick={() => setEstimatedUnits(24)}
              className="mt-6 w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-semibold transition"
            >
              Simular Plan Oro
            </button>
          </div>
        </div>

        {/* Interactive Wholesale Simulator */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-gold-500/30 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5" /> Simulador de Ganancia B2B
              </span>
              <h3 className="font-serif text-2xl text-zinc-100 mt-1">
                Calcula tu Retorno de Inversión
              </h3>
              <p className="text-xs text-zinc-400 mt-2">
                Ajusta el volumen de unidades para ver tu descuento y tu ganancia estimada al revender a precio sugerido de mercado.
              </p>

              {/* Slider */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-300">Cantidad de Perfumes:</span>
                  <span className="text-gold-400 font-bold text-sm">{estimatedUnits} Unidades</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="60"
                  step="2"
                  value={estimatedUnits}
                  onChange={e => setEstimatedUnits(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>6 un. (35%)</span>
                  <span>12 un. (45%)</span>
                  <span>24+ un. (52%)</span>
                  <span>60 un. (VIP)</span>
                </div>
              </div>
            </div>

            {/* Profit Card */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
                <span className="text-xs text-zinc-400">Nivel Alcanzado:</span>
                <span className="text-xs font-bold text-gold-400 bg-gold-950 px-2.5 py-1 rounded border border-gold-500/30">
                  {discountTier.name} ({discountTier.discount}% OFF)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Inversión Estimada:</span>
                <span className="text-zinc-200 font-medium">{formatCLP(estimatedInvestment)}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Venta Retail Estimada:</span>
                <span className="text-zinc-200 font-medium">{formatCLP(estimatedRetailRevenue)}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                <span className="text-sm font-bold text-emerald-400">Tu Ganancia Neta Estimada:</span>
                <span className="text-xl font-bold text-emerald-400 font-serif">{formatCLP(estimatedProfit)}</span>
              </div>

              <button
                onClick={handleWhatsAppWholesale}
                className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contactar Ejecutivo Mayorista WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
