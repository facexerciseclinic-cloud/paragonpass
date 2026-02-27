// ============================================================================
// Paragonpass - Zustand Cart Store
// ============================================================================
// Central state management for the customer-facing cart.
// Uses Zustand for lightweight, performant state management.
//
// Features:
// - Add/remove/update items
// - Auto-compute comparison across all 4 scenarios
// - Persist cart in localStorage
// - Track gold-tier item limits
// ============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CartItem,
  CartComparison,
  Pass,
  ProductWithPricing,
  CatalogData,
} from "@/types";
import { calculateCartComparison } from "@/lib/cart-engine";

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface CartStore {
  // Data
  items: CartItem[];
  passes: Pass[];
  catalog: CatalogData | null;

  // Computed
  comparison: CartComparison;
  itemCount: number;

  // Actions
  setCatalog: (catalog: CatalogData) => void;
  addItem: (product: ProductWithPricing) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  clearCart: () => void;

  // Internal
  _recompute: () => void;
}

// ============================================================================
// DEFAULT COMPARISON
// ============================================================================

const emptyComparison: CartComparison = {
  items: [],
  totals: [
    {
      slug: "normal",
      name: "ราคาปกติ",
      upfrontFee: 0,
      itemsTotal: 0,
      grandTotal: 0,
      savings: 0,
      savingsPercent: 0,
      isBestValue: true,
      hasLockedItems: false,
    },
  ],
  bestScenario: "normal",
  upsellAlert: null,
};

// ============================================================================
// STORE DEFINITION
// ============================================================================

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      passes: [],
      catalog: null,
      comparison: emptyComparison,
      itemCount: 0,

      // Set catalog data (called on page load)
      setCatalog: (catalog: CatalogData) => {
        set({ catalog, passes: catalog.passes });

        // Rehydrate product data for persisted items
        const currentItems = get().items;
        if (currentItems.length > 0) {
          const allProducts = catalog.categories.flatMap((c) => c.products);
          const rehydrated = currentItems
            .map((item) => {
              const freshProduct = allProducts.find(
                (p) => p.id === item.productId
              );
              if (freshProduct) {
                return { ...item, product: freshProduct };
              }
              return null; // Product no longer available
            })
            .filter(Boolean) as CartItem[];

          set({ items: rehydrated });
        }

        get()._recompute();
      },

      // Add item to cart
      addItem: (product: ProductWithPricing) => {
        const { items } = get();
        const existing = items.find((i) => i.productId === product.id);

        if (existing) {
          // Increment quantity
          set({
            items: items.map((i) =>
              i.productId === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          // Add new item
          set({
            items: [
              ...items,
              { productId: product.id, product, quantity: 1 },
            ],
          });
        }

        get()._recompute();
      },

      // Remove item completely
      removeItem: (productId: string) => {
        set({
          items: get().items.filter((i) => i.productId !== productId),
        });
        get()._recompute();
      },

      // Set specific quantity
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
        get()._recompute();
      },

      // Increment
      incrementItem: (productId: string) => {
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        });
        get()._recompute();
      },

      // Decrement (removes if quantity would be 0)
      decrementItem: (productId: string) => {
        const item = get().items.find((i) => i.productId === productId);
        if (!item) return;

        if (item.quantity <= 1) {
          get().removeItem(productId);
        } else {
          set({
            items: get().items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: i.quantity - 1 }
                : i
            ),
          });
          get()._recompute();
        }
      },

      // Clear all items
      clearCart: () => {
        set({ items: [], comparison: emptyComparison, itemCount: 0 });
      },

      // Recompute comparison (called after every change)
      _recompute: () => {
        const { items, passes } = get();
        const comparison = calculateCartComparison(items, passes);
        const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
        set({ comparison, itemCount });
      },
    }),
    {
      name: "paragonpass-cart",
      // Only persist items (not computed data or catalog)
      partialize: (state) => ({
        items: state.items.map((i) => ({
          productId: i.productId,
          product: i.product,
          quantity: i.quantity,
        })),
      }),
    }
  )
);
