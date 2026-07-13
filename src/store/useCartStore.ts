import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Money } from '../types/common';
import type { Service } from '../features/service-catalog/types/catalog';
import type { CartItem } from '../features/cart/types/cart';

interface CartState {
  items: CartItem[];
  addItem: (service: Service) => void;
  removeItem: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  toggleSelected: (serviceId: string) => void;
  clearCart: () => void;
}

function lineTotalFor(service: Service, quantity: number): Money {
  return { amount: service.price.amount * quantity, currency: service.price.currency };
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (service) =>
        set((state) => {
          const existing = state.items.find((item) => item.serviceId === service.id);
          if (existing) {
            const quantity = existing.quantity + 1;
            return {
              items: state.items.map((item) =>
                item.serviceId === service.id
                  ? { ...item, quantity, lineTotal: lineTotalFor(service, quantity) }
                  : item,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                serviceId: service.id,
                service,
                quantity: 1,
                selected: true,
                lineTotal: lineTotalFor(service, 1),
              },
            ],
          };
        }),
      removeItem: (serviceId) =>
        set((state) => ({ items: state.items.filter((item) => item.serviceId !== serviceId) })),
      updateQuantity: (serviceId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.serviceId === serviceId
              ? {
                  ...item,
                  quantity: Math.max(1, quantity),
                  lineTotal: lineTotalFor(item.service, Math.max(1, quantity)),
                }
              : item,
          ),
        })),
      toggleSelected: (serviceId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.serviceId === serviceId ? { ...item, selected: !item.selected } : item,
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'bb-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

/* ── Derived selectors (pure — call with `store.items`) ── */

function selectedCartItems(items: CartItem[]): CartItem[] {
  return items.filter((item) => item.selected);
}

/** Total unit count across all lines (drives the header/nav cart badge). */
function cartItemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

/** Subtotal of the *selected* lines (pre-discount, pre-tax). */
function cartSubtotal(items: CartItem[]): Money {
  const selected = selectedCartItems(items);
  const amount = selected.reduce((total, item) => total + item.lineTotal.amount, 0);
  const currency = selected[0]?.lineTotal.currency ?? 'INR';
  return { amount, currency };
}

/** Total duration (minutes) of the selected lines. */
function cartSelectedDuration(items: CartItem[]): number {
  return selectedCartItems(items).reduce(
    (total, item) => total + item.service.duration * item.quantity,
    0,
  );
}

/** Whether a service already has a line in the cart. */
function isInCart(items: CartItem[], serviceId: string): boolean {
  return items.some((item) => item.serviceId === serviceId);
}

export {
  cartItemCount,
  cartSelectedDuration,
  cartSubtotal,
  isInCart,
  selectedCartItems,
  useCartStore,
};
export type { CartState };
