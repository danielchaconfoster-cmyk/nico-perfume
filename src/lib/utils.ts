import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('56')) return `+${cleaned}`;
  return `+56${cleaned}`;
}

export function generateWhatsAppOrderUrl(
  items: { name: string; brand: string; quantity: number; price: number; sku: string }[],
  total: number,
  customerName?: string,
  customerAddress?: string,
  customerCity?: string,
  phone: string = '56912345678'
): string {
  let message = `*✨ NUEVO PEDIDO — NICO PERFUME ✨*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  
  if (customerName) {
    message += `👤 *Cliente:* ${customerName}\n`;
  }
  if (customerAddress) {
    message += `📍 *Dirección de Envío:* ${customerAddress}, ${customerCity || 'Chile'}\n`;
  }
  message += `📅 *Fecha:* ${new Date().toLocaleDateString('es-CL')}\n\n`;
  
  message += `📦 *DETALLE DE PRODUCTOS:*\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.brand} - ${item.name}*\n`;
    message += `   SKU: \`${item.sku}\` | Cant: ${item.quantity} x ${formatCLP(item.price)}\n`;
    message += `   Subtotal: ${formatCLP(item.quantity * item.price)}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL A PAGAR: ${formatCLP(total)}*\n`;
  message += `🚚 *Envío:* ${total >= 60000 ? 'GRATIS a todo Chile' : 'Por pagar / $3.990 Santiago'}\n\n`;
  message += `💬 _Hola! Quiero confirmar este pedido y coordinar el pago por transferencia o Webpay. ¿Tienen disponibilidad inmediata?_`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encoded}`;
}
