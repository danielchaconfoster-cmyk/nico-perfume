'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneCall, Mail, MapPin, ShieldCheck, Sparkles, Globe, Share2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-gold-500/15 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-gold-gradient">
                NICO PERFUME
              </span>
              <p className="text-[10px] tracking-[0.35em] text-zinc-400 uppercase">
                Haute Parfumerie & Nicho
              </p>
            </Link>
            <p className="text-zinc-400 text-xs max-w-sm leading-relaxed">
              Boutique especializada en fragancias auténticas de diseñador, alta perfumería árabe y colecciones nicho. Asesoría olfativa personalizada para todo Chile.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-gold-400 hover:border-gold-500/50 transition"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-gold-400 hover:border-gold-500/50 transition"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/56912345678"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 hover:brightness-125 transition"
                aria-label="WhatsApp"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Navegación
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#catalogo" className="hover:text-gold-400 transition">
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link href="#recomendador" className="hover:text-gold-400 transition">
                  Fragancias Gemelas
                </Link>
              </li>
              <li>
                <Link href="#sommelier-quiz" className="hover:text-gold-400 transition">
                  Quiz Sommelier
                </Link>
              </li>
              <li>
                <Link href="#bestsellers" className="hover:text-gold-400 transition">
                  Más Vendidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Perfume Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Colecciones
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#catalogo" className="hover:text-gold-400 transition">
                  Perfumería Árabe
                </Link>
              </li>
              <li>
                <Link href="#catalogo" className="hover:text-gold-400 transition">
                  Perfumes de Hombre
                </Link>
              </li>
              <li>
                <Link href="#catalogo" className="hover:text-gold-400 transition">
                  Perfumes de Mujer
                </Link>
              </li>
              <li>
                <Link href="#catalogo" className="hover:text-gold-400 transition">
                  Extrait de Parfum
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Dispatch Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Atención & Despachos
            </h3>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Las Condes, Santiago, Chile</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>+56 9 1234 5678</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>contacto@nicoperfume.cl</span>
              </p>
              <p className="text-[11px] text-zinc-400 pt-1">
                Lunes a Sábado: 09:00 - 20:00 hrs
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <p>© {new Date().getFullYear()} Nico Perfume SpA. Todos los derechos reservados. Hecho con ❤️ en Chile.</p>
          <div className="flex items-center gap-4">
            <span>Términos y Condiciones</span>
            <span>•</span>
            <span>Políticas de Privacidad</span>
            <span>•</span>
            <span>Garantía de Originalidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
