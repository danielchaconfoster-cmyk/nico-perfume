'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Package, 
  Lock, 
  User,
  LogOut, 
  Search, 
  History, 
  ArrowRight, 
  Sparkles,
  Database,
  Tag,
  Eye,
  EyeOff,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DiffItem {
  sku: string;
  name: string;
  brand: string;
  oldPrice: number;
  newPrice: number;
  oldReferential: number;
  newReferential: number;
  priceDiff: number;
  isNew: boolean;
}

interface UploadResult {
  success: boolean;
  filename: string;
  totalRows: number;
  updatedCount: number;
  createdCount: number;
  unchangedCount: number;
  diffs: DiffItem[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'upload' | 'products' | 'logs'>('upload');

  // Excel Upload State
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Products State with Full Pagination & Brands
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Logs State
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Check initial authentication
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      if (res.ok) {
        setIsAuthenticated(true);
        loadInitialData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const loadInitialData = () => {
    fetchProducts(1, searchQuery, selectedBrand, pageSize);
    fetchLogs();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, pin: password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        loadInitialData();
      } else {
        setLoginError(data.message || 'Credenciales de acceso incorrectas');
      }
    } catch (err: any) {
      setLoginError('Error de conexión con el servidor');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
    setPassword('');
  };

  // Fetch Products with pagination & filters
  const fetchProducts = async (
    page = currentPage, 
    search = searchQuery, 
    brand = selectedBrand, 
    limit = pageSize
  ) => {
    setIsLoadingProducts(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search: search.trim(),
        brand: brand === 'all' ? '' : brand
      });

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.data || []);
        setTotalProducts(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.page || 1);
        if (data.brands && data.brands.length > 0) {
          setAvailableBrands(data.brands);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch Logs
  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/admin/logs');
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Excel Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls')) {
        setFile(droppedFile);
        setUploadError('');
      } else {
        setUploadError('Por favor sube un archivo Excel válido (.xlsx o .xls)');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadError('');
    }
  };

  const handleUploadExcel = async () => {
    if (!file) {
      setUploadError('Selecciona un archivo Excel primero.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload-excel', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUploadResult(data);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        fetchProducts(1, searchQuery, selectedBrand, pageSize);
        fetchLogs();
      } else {
        setUploadError(data.error || 'Error al procesar el archivo');
      }
    } catch (err: any) {
      setUploadError('Error de red al subir el archivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProduct = async (product: any) => {
    setIsSavingProduct(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          price: Number(product.price),
          wholesale_price: Number(product.wholesale_price),
          stock: Number(product.stock),
          is_best_seller: Boolean(product.is_best_seller),
          is_new: Boolean(product.is_new)
        })
      });

      if (res.ok) {
        setEditingProduct(null);
        fetchProducts(currentPage, searchQuery, selectedBrand, pageSize);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const formatCLP = (val: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val || 0);
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#07090e]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-sm tracking-widest uppercase text-amber-400 font-medium">Verificando Credenciales...</p>
        </div>
      </div>
    );
  }

  // Login Screen with User & Password
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#07090e] via-[#0d121d] to-[#07090e]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl bg-[#0e1422]/95 border border-amber-500/20 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-4 text-amber-400 shadow-lg shadow-amber-500/10">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide">NICO PERFUME</h1>
            <p className="text-xs uppercase tracking-widest text-amber-400/80 mt-1 font-semibold">Portal de Administración</p>
            <p className="text-sm text-slate-400 mt-2">Ingresa tu usuario y contraseña de administrador</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Usuario / Correo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin o nico@nicoperfume.cl"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !password}
              className="w-full py-3.5 px-6 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold tracking-wide shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
            >
              {isLoggingIn ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Supabase PostgreSQL
            </span>
            <span>Seguridad SSL • 2026</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0a0f1d]/95 border-b border-amber-500/15 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold text-base sm:text-lg shrink-0">
              N
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide flex items-center gap-2">
                Nico Perfume
                <span className="text-[9px] sm:text-[10px] uppercase font-sans tracking-widest bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Admin Pro
                </span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 hidden xs:block">Sincronización Automática con Supabase DB</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              <Database className="h-3.5 w-3.5" />
              <span>Base de Datos Conectada</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-6 sm:pt-8">
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1422] border border-slate-800 flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Package className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Perfumes</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{totalProducts || 1371}</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1422] border border-slate-800 flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Layers className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">Marcas en Catálogo</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{availableBrands.length || 78}</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1422] border border-slate-800 flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">Estado Catálogo</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400">100% Online</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1422] border border-slate-800 flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <History className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">Cargas</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{logs.length}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation with mobile horizontal scroll */}
        <div className="flex border-b border-slate-800 gap-1 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 sm:gap-2 pb-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition shrink-0 ${
              activeTab === 'upload'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Cargar Lista Excel</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('products');
              fetchProducts(1, searchQuery, selectedBrand, pageSize);
            }}
            className={`flex items-center gap-1.5 sm:gap-2 pb-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition shrink-0 ${
              activeTab === 'products'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>Gestor de Precios ({totalProducts || 1371})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('logs');
              fetchLogs();
            }}
            className={`flex items-center gap-1.5 sm:gap-2 pb-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition shrink-0 ${
              activeTab === 'logs'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Historial de Cargas</span>
          </button>
        </div>

        {/* TAB 1: EXCEL UPLOAD (CLEAN, NO MARGIN SLIDERS) */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#0e1422] border border-slate-800 p-6 sm:p-8 space-y-6">
              <div className="max-w-2xl">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-amber-400" />
                  Actualización Semanal de Lista de Precios
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Arrastrá el archivo Excel que te envió tu distribuidor para actualizar instantáneamente todos los costos y precios de venta en la web.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition flex flex-col items-center justify-center gap-4 bg-[#090d16] ${
                  isDragging
                    ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                    : file
                    ? 'border-emerald-500/60 bg-emerald-500/5'
                    : 'border-slate-700 hover:border-amber-500/50 hover:bg-slate-900/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {file ? (
                  <>
                    <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                      <FileSpreadsheet className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-semibold text-white">{file.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB • Archivo Listo</p>
                    </div>
                    <span className="text-xs text-amber-400 hover:underline">Hacé clic para cambiar de archivo</span>
                  </>
                ) : (
                  <>
                    <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Upload className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-semibold text-white">Arrastrá aquí tu lista semanal de Excel</p>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">o hacé clic para buscar en tus archivos (.xlsx, .xls)</p>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">Soporta listas oficiales de proveedores con columnas de Marca, Perfume, SKU y Precios Mayoristas</span>
                  </>
                )}
              </div>

              {uploadError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Action Button & Info */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Cálculo automático de margen retail y precio tachado aplicado en servidor.</span>
                </div>

                <button
                  onClick={handleUploadExcel}
                  disabled={!file || isUploading}
                  className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold tracking-wide shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm shrink-0"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Procesando y Sincronizando con Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Actualizar Precios en Vivo</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Section */}
            {uploadResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-4"
              >
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-white">¡Lista de Precios Actualizada con Éxito!</h4>
                      <p className="text-xs text-emerald-300 mt-0.5">
                        Se procesaron <strong>{uploadResult.totalRows}</strong> filas. 
                        {uploadResult.updatedCount > 0 && <span> <strong>{uploadResult.updatedCount}</strong> precios actualizados.</span>}
                        {uploadResult.createdCount > 0 && <span> <strong>{uploadResult.createdCount}</strong> productos nuevos creados.</span>}
                        {uploadResult.unchangedCount > 0 && <span> <strong>{uploadResult.unchangedCount}</strong> productos sin variación de precio.</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/30">
                      {uploadResult.updatedCount} Modificados
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 font-semibold text-xs border border-blue-500/30">
                      {uploadResult.createdCount} Nuevos
                    </span>
                  </div>
                </div>

                {/* Diff Table */}
                {uploadResult.diffs.length > 0 && (
                  <div className="rounded-2xl bg-[#0e1422] border border-slate-800 overflow-hidden">
                    <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-amber-400" />
                        Detalle de Variaciones de Precios
                      </h4>
                      <span className="text-xs text-slate-400">{uploadResult.diffs.length} modificaciones</span>
                    </div>

                    <div className="overflow-x-auto max-h-96">
                      <table className="w-full text-left text-xs min-w-[700px]">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider sticky top-0">
                          <tr>
                            <th className="p-3.5">Perfume</th>
                            <th className="p-3.5">Marca</th>
                            <th className="p-3.5">SKU</th>
                            <th className="p-3.5">Precio Anterior</th>
                            <th className="p-3.5">Precio Nuevo (Excel)</th>
                            <th className="p-3.5">Ref. Falabella (~23% OFF)</th>
                            <th className="p-3.5">Variación</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                          {uploadResult.diffs.map((diff, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/30 transition">
                              <td className="p-3.5 font-medium text-white">{diff.name}</td>
                              <td className="p-3.5 text-amber-400">{diff.brand}</td>
                              <td className="p-3.5 font-mono text-[11px] text-slate-400">{diff.sku}</td>
                              <td className="p-3.5 font-mono text-slate-400 line-through">
                                {diff.oldPrice > 0 ? formatCLP(diff.oldPrice) : 'Nuevo'}
                              </td>
                              <td className="p-3.5 font-mono font-bold text-white">
                                {formatCLP(diff.newPrice)}
                              </td>
                              <td className="p-3.5 font-mono text-slate-400">
                                {formatCLP(diff.newReferential)}
                              </td>
                              <td className="p-3.5 font-mono">
                                {diff.priceDiff > 0 ? (
                                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                                    <TrendingUp className="h-3 w-3" />
                                    +{formatCLP(diff.priceDiff)}
                                  </span>
                                ) : diff.priceDiff < 0 ? (
                                  <span className="text-rose-400 flex items-center gap-1 font-semibold">
                                    <TrendingDown className="h-3 w-3" />
                                    {formatCLP(diff.priceDiff)}
                                  </span>
                                ) : (
                                  <span className="text-slate-500">Sin cambio</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGER (WITH FULL A-Z PAGINATION & BRANDS FILTER) */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Filter Toolbar */}
            <div className="rounded-2xl bg-[#0e1422] border border-slate-800 p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Search */}
                <div className="relative sm:col-span-2">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por perfume, marca o SKU..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      fetchProducts(1, e.target.value, selectedBrand, pageSize);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                {/* Brand Filter Dropdown */}
                <div className="relative">
                  <select
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      fetchProducts(1, searchQuery, e.target.value, pageSize);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 transition cursor-pointer"
                  >
                    <option value="all">Todas las marcas ({availableBrands.length || 78})</option>
                    {availableBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rows per page & Status bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span>Mostrar:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      const newSize = Number(e.target.value);
                      setPageSize(newSize);
                      fetchProducts(1, searchQuery, selectedBrand, newSize);
                    }}
                    className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="50">50 por página</option>
                    <option value="100">100 por página</option>
                    <option value="250">250 por página</option>
                    <option value="1500">Todos los 1.371</option>
                  </select>
                  <span className="text-slate-500">•</span>
                  <span>Total en base de datos: <strong className="text-white">{totalProducts}</strong> perfumes</span>
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-1.5">
                  <span className="mr-2">Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong></span>
                  <button
                    onClick={() => {
                      if (currentPage > 1) {
                        fetchProducts(currentPage - 1, searchQuery, selectedBrand, pageSize);
                      }
                    }}
                    disabled={currentPage <= 1 || isLoadingProducts}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (currentPage < totalPages) {
                        fetchProducts(currentPage + 1, searchQuery, selectedBrand, pageSize);
                      }
                    }}
                    disabled={currentPage >= totalPages || isLoadingProducts}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => fetchProducts(currentPage, searchQuery, selectedBrand, pageSize)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 ml-2"
                    title="Recargar"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isLoadingProducts ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl bg-[#0e1422] border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto max-h-[650px]">
                <table className="w-full text-left text-xs min-w-[750px]">
                  <thead className="bg-slate-950/90 text-slate-400 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                      <th className="p-3.5">Perfume</th>
                      <th className="p-3.5">Marca</th>
                      <th className="p-3.5">Familia</th>
                      <th className="p-3.5">Precio Venta (Excel)</th>
                      <th className="p-3.5">Ref. Falabella (Tachado)</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3.5 font-medium text-white max-w-xs truncate">{p.name}</td>
                        <td className="p-3.5 text-amber-400 font-semibold">{p.brand}</td>
                        <td className="p-3.5 text-slate-400">{p.family}</td>
                        <td className="p-3.5 font-mono font-bold text-amber-400">{formatCLP(p.price)}</td>
                        <td className="p-3.5 font-mono text-slate-400 line-through">{formatCLP(p.original_price)}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            p.stock > 10 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {p.stock} un.
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-300 font-medium text-xs transition"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#0e1422] border border-slate-800 overflow-hidden">
              <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <History className="h-4 w-4 text-amber-400" />
                    Historial de Cargas Semanales
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Auditoría completa de todas las listas de Excel procesadas</p>
                </div>
                <button
                  onClick={fetchLogs}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs flex items-center gap-1"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                  <span>Actualizar</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Fecha y Hora</th>
                      <th className="p-3.5">Archivo Excel</th>
                      <th className="p-3.5">Filas Procesadas</th>
                      <th className="p-3.5">Precios Actualizados</th>
                      <th className="p-3.5">Nuevos Perfumes</th>
                      <th className="p-3.5">Usuario</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3.5 font-mono text-slate-400">
                          {new Date(log.created_at).toLocaleString('es-CL')}
                        </td>
                        <td className="p-3.5 font-medium text-white">{log.filename}</td>
                        <td className="p-3.5 font-mono">{log.total_rows}</td>
                        <td className="p-3.5 font-mono text-emerald-400 font-semibold">{log.updated_count}</td>
                        <td className="p-3.5 font-mono text-blue-400 font-semibold">{log.created_count}</td>
                        <td className="p-3.5 text-slate-400">{log.uploaded_by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-[#0e1422] border border-amber-500/30 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{editingProduct.name}</h3>
                  <p className="text-xs text-amber-400 font-semibold">{editingProduct.brand} • SKU: {editingProduct.sku}</p>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Precio Mayorista (CLP)</label>
                  <input
                    type="number"
                    value={editingProduct.wholesale_price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, wholesale_price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Precio Retail Final (CLP)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Stock Disponible</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.is_best_seller)}
                      onChange={(e) => setEditingProduct({ ...editingProduct, is_best_seller: e.target.checked })}
                      className="rounded accent-amber-500"
                    />
                    <span className="text-slate-300">Destacado</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleSaveProduct(editingProduct)}
                  disabled={isSavingProduct}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-2"
                >
                  {isSavingProduct ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
