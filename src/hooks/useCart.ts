// ============================================================================
// Paragonpass - Cart Hooks & Helpers
// ============================================================================
// Convenience hooks that wrap the Zustand store for common operations.
// ============================================================================

import { useCartStore } from "@/store/cart";
import { isGoldTierOnly, getGoldTierItemCount } from "@/lib/cart-engine";
import type { ProductWithPricing } from "@/types";

/**
 * Hook: Get the quantity of a specific product in the cart.
 */
export function useCartItemQuantity(productId: string): number {
  return useCartStore(
    (s) => s.items.find((i) => i.productId === productId)?.quantity ?? 0
  );
}

/**
 * Hook: Get the total number of items in the cart.
 */
export function useCartItemCount(): number {
  return useCartStore((s) => s.itemCount);
}

/**
 * Hook: Check if cart is empty.
 */
export function useIsCartEmpty(): boolean {
  return useCartStore((s) => s.items.length === 0);
}

/**
 * Hook: Get the current comparison data.
 */
export function useCartComparison() {
  return useCartStore((s) => s.comparison);
}

/**
 * Hook: Get the upsell alert if any.
 */
export function useUpsellAlert() {
  return useCartStore((s) => s.comparison.upsellAlert);
}

/**
 * Hook: Get info about Gold tier limit status.
 */
export function useGoldTierStatus() {
  const items = useCartStore((s) => s.items);
  const passes = useCartStore((s) => s.passes);
  const goldPass = passes.find((p) => p.slug === "gold");
  const maxItems = goldPass?.maxItems ?? 4;
  const currentCount = getGoldTierItemCount(items);

  return {
    currentCount,
    maxItems,
    remaining: Math.max(0, maxItems - currentCount),
    isAtLimit: currentCount >= maxItems,
    isOverLimit: currentCount > maxItems,
  };
}

/**
 * Hook: Check if a specific product can be added under Gold pass constraints.
 */
export function useCanAddForGold(product: ProductWithPricing): boolean {
  const items = useCartStore((s) => s.items);
  const passes = useCartStore((s) => s.passes);
  const goldPass = passes.find((p) => p.slug === "gold");
  const maxItems = goldPass?.maxItems ?? 4;

  if (!isGoldTierOnly(product)) return true; // Not Gold-tier-only, always allowed

  const currentCount = getGoldTierItemCount(items);
  return currentCount < maxItems;
}

/**
 * Generate a cart summary text for sharing (LINE OA, WhatsApp).
 */
export function generateCartSummaryText(): string {
  const { items, comparison } = useCartStore.getState();

  if (items.length === 0) return "ตะกร้าว่าง";

  const lines: string[] = [
    "🏥 Paragonpass - สรุปรายการ",
    "═══════════════════════",
    "",
  ];

  // Items list
  items.forEach((item, idx) => {
    lines.push(
      `${idx + 1}. ${item.product.name} x${item.quantity} = ฿${fmt(
        item.product.normalPrice * item.quantity
      )}`
    );
  });

  lines.push("");
  lines.push("═══════════════════════");
  lines.push("📊 เปรียบเทียบ:");
  lines.push("");

  // Totals
  comparison.totals.forEach((t) => {
    const star = t.isBestValue ? " ⭐ คุ้มที่สุด!" : "";
    const fee = t.upfrontFee > 0 ? ` (ค่า Pass ฿${fmt(t.upfrontFee)})` : "";
    const savings = t.savings > 0 ? ` ประหยัด ฿${fmt(t.savings)}` : "";
    lines.push(`${t.name}: ฿${fmt(t.grandTotal)}${fee}${savings}${star}`);
  });

  lines.push("");
  lines.push("═══════════════════════");
  lines.push("💬 สนใจสอบถามเพิ่มเติม @ParagonPass");

  return lines.join("\n");
}

function fmt(n: number): string {
  return new Intl.NumberFormat("th-TH").format(Math.round(n));
}
