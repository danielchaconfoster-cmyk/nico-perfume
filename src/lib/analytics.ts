/**
 * Analytics & Conversion Tracking Utility
 * Supports Google Analytics 4 (GA4) & Meta Pixel (Facebook/Instagram Ads)
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

// Track page views
export function trackPageView(url: string) {
  if (typeof window === 'undefined') return;

  // GA4
  if (window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA4_ID || '', {
      page_path: url,
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
}

// Track view item (Product Detail / Modal View)
export function trackViewItem(perfume: {
  id: string;
  name: string;
  brand: string;
  price: number;
}) {
  if (typeof window === 'undefined') return;

  // GA4
  if (window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'CLP',
      value: perfume.price,
      items: [
        {
          item_id: perfume.id,
          item_name: perfume.name,
          item_brand: perfume.brand,
          price: perfume.price,
        },
      ],
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [perfume.id],
      content_name: perfume.name,
      content_category: perfume.brand,
      value: perfume.price,
      currency: 'CLP',
    });
  }
}

// Track Add To Cart
export function trackAddToCart(
  perfume: { id: string; name: string; brand: string; price: number },
  quantity: number = 1
) {
  if (typeof window === 'undefined') return;

  // GA4
  if (window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'CLP',
      value: perfume.price * quantity,
      items: [
        {
          item_id: perfume.id,
          item_name: perfume.name,
          item_brand: perfume.brand,
          price: perfume.price,
          quantity,
        },
      ],
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [perfume.id],
      content_name: perfume.name,
      content_category: perfume.brand,
      value: perfume.price * quantity,
      currency: 'CLP',
    });
  }
}

// Track Initiate Checkout
export function trackInitiateCheckout(total: number, itemsCount: number) {
  if (typeof window === 'undefined') return;

  // GA4
  if (window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'CLP',
      value: total,
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: total,
      currency: 'CLP',
      num_items: itemsCount,
    });
  }
}

// Track Purchase / Conversion
export function trackPurchase(
  orderId: string,
  total: number,
  items: Array<{ id: string; name: string; price: number; quantity: number }>
) {
  if (typeof window === 'undefined') return;

  // GA4
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      value: total,
      currency: 'CLP',
      items: items.map(i => ({
        item_id: i.id,
        item_name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      value: total,
      currency: 'CLP',
      content_type: 'product',
      order_id: orderId,
    });
  }
}
