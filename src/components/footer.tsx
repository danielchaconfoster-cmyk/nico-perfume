'use client';

import React from 'react';
import Link from 'next/link';
import { BrandsMarquee } from './brands-marquee';
import { PhoneCall, Mail, MapPin, ShieldCheck, Truck, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#050508] border-t border-zinc-800 text-zinc-400 text-xs">
      {/* 1. Infinite Logo Loop Ribbon for Prestigious Brands */}
      <BrandsMarquee variant="footer" />

      {/* 2. Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-2xl font-bold tracking-wider text-zinc-100 group-hover:text-gold-300 transition-colors">
                NICO PERFUME
              </span>
              <p className="text-[10px] tracking-widest text-zinc-400 uppercase font-sans">
                Perfumes 100% Originales en Chile
              </p>
            </Link>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Tu tienda de confianza en Santiago de Chile. Fragancias originales de diseñador, perfumes árabes virales y asesoría personalizada directa por WhatsApp.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/56912345678?text=Hola%20Nico%20Perfume,%20necesito%20asesoria%20con%20una%20fragancia"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">+56 9 1234 5678</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Explorar
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/catalogo" className="hover:text-gold-400 transition">
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link href="/fragancias-gemelas" className="hover:text-gold-400 transition">
                  Perfumes Similares (Clones)
                </Link>
              </li>
              <li>
                <Link href="/sommelier-quiz" className="hover:text-gold-400 transition">
                  Test de Perfumes
                </Link>
              </li>
              <li>
                <Link href="/mayorista" className="hover:text-gold-400 transition">
                  Venta Mayorista (Emprendedores)
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-gold-400 transition">
                  Finalizar Compra / Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Categorías
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/catalogo?genero=Hombre" className="hover:text-gold-400 transition">
                  Perfumes para Hombre
                </Link>
              </li>
              <li>
                <Link href="/catalogo?genero=Mujer" className="hover:text-gold-400 transition">
                  Perfumes para Mujer
                </Link>
              </li>
              <li>
                <Link href="/catalogo?genero=Unisex" className="hover:text-gold-400 transition">
                  Perfumes Unisex
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-gold-400 transition">
                  Colección Árabe & Extrait
                </Link>
              </li>
            </ul>
          </div>

          {/* Guarantees & Despacho */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Garantía & Envíos
            </h3>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Envíos a todo Chile vía Starken y Blue Express con número de seguimiento.</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Garantía de autenticidad: 100% perfumes originales sellados.</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>Santiago de Chile. Despacho rápido a Región Metropolitana y Regiones.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} NICO PERFUME. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <span>Envíos seguros a todo Chile</span>
            <span>•</span>
            <span>Pago con Webpay Plus & Transferencia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
