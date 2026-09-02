'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Perfume, CartItem } from '@/types/perfume';

interface CartContextType {
  cart: CartItem[];
  addToCart: (perfume: Perfume, quantity?: number) => void;
  removeFromCart: (perfumeId: string) => void;
  updateQuantity: (perfumeId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  freeShippingProgress: number;
  freeShippingRemaining: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (perfumeId: string) => void;
  isInWishlist: (perfumeId: string) => boolean;
  
  // Compare Fragrances
  compareList: Perfume[];
  addToCompare: (perfume: Perfume) => void;
  removeFromCompare: (perfumeId: string) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;

  // Quick View Modal
  quickViewPerfume: Perfume | null;
  openQuickView: (perfume: Perfume) => void;
  closeQuickView: () => void;

  // Checkout Modal
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  // Toast
  toast: string | null;
  showToast: (msg: string) => void;
}

const FREE_SHIPPING_THRESHOLD = 60000; // CLP

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Perfume[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [quickViewPerfume, setQuickViewPerfume] = useState<Perfume | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('nico_perfume_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('nico_perfume_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error('Error loading cart from storage', e);
    }
  }, []);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('nico_perfume_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [cart]);

  // Save wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem('nico_perfume_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist', e);
    }
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const addToCart = (perfume: Perfume, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.perfume.id === perfume.id);
      if (existing) {
        return prev.map(item =>
          item.perfume.id === perfume.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { perfume, quantity }];
    });
    showToast(`✨ ${perfume.name} agregado a tu bolsa`);
    setIsCartOpen(true);
  };

  const removeFromCart = (perfumeId: string) => {
    setCart(prev => prev.filter(item => item.perfume.id !== perfumeId));
    showToast('Producto eliminado de la bolsa');
  };

  const updateQuantity = (perfumeId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(perfumeId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.perfume.id === perfumeId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (perfumeId: string) => {
    setWishlist(prev => {
      if (prev.includes(perfumeId)) {
        showToast('Eliminado de tus fragancias favoritas');
        return prev.filter(id => id !== perfumeId);
      } else {
        showToast('❤️ Guardado en tus fragancias favoritas');
        return [...prev, perfumeId];
      }
    });
  };

  const isInWishlist = (perfumeId: string) => {
    return wishlist.includes(perfumeId);
  };

  const addToCompare = (perfume: Perfume) => {
    if (compareList.some(p => p.id === perfume.id)) {
      showToast('Esta fragancia ya está en el comparador');
      setIsCompareOpen(true);
      return;
    }
    if (compareList.length >= 3) {
      showToast('Puedes comparar hasta 3 fragancias simultáneamente');
      setIsCompareOpen(true);
      return;
    }
    setCompareList(prev => [...prev, perfume]);
    showToast(`⚖️ ${perfume.name} añadido a la comparativa`);
    setIsCompareOpen(true);
  };

  const removeFromCompare = (perfumeId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== perfumeId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const openQuickView = (perfume: Perfume) => {
    setQuickViewPerfume(perfume);
  };

  const closeQuickView = () => {
    setQuickViewPerfume(null);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.perfume.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const freeShippingProgress = Math.min(
    100,
    Math.round((cartTotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        freeShippingProgress,
        freeShippingRemaining,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
        quickViewPerfume,
        openQuickView,
        closeQuickView,
        isCheckoutOpen,
        setIsCheckoutOpen,
        toast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
