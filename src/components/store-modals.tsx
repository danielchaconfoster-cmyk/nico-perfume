'use client';

import React, { useState } from 'react';
import { CartDrawer } from './cart-drawer';
import { ProductModal } from './product-modal';
import { CheckoutModal } from './checkout-modal';
import { CompareModal } from './compare-modal';
import { WishlistModal } from './wishlist-modal';
import { ToastNotification } from './toast-notification';
import { Navbar } from './navbar';

interface StoreModalsProps {
  children: React.ReactNode;
}

export function StoreModalsWrapper({ children }: StoreModalsProps) {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  return (
    <>
      <Navbar onOpenWishlist={() => setIsWishlistOpen(true)} />
      {children}
      <CartDrawer />
      <ProductModal />
      <CheckoutModal />
      <CompareModal />
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
      <ToastNotification />
    </>
  );
}
