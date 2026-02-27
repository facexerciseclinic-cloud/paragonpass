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
 * Generate a professional cart summary text for sharing.
 * Works for: User → Admin, Admin → Branch, Branch self-review.
 */
export function generateCartSummaryText(): string {
  const { items, comparison } = useCartStore.getState();

  if (items.length === 0) return "ตะกร้าว่าง";

  const now = new Date();
  const dateStr = now.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const best = comparison.totals.find((t) => t.isBestValue);
  const normal = comparison.totals.find((t) => t.slug === "normal");

  const lines: string[] = [];

  // ─── Header
  lines.push("╔══════════════════════════╗");
  lines.push("║  Dr.den Clinic — Paragon Pass  ║");
  lines.push("║       สรุปรายการหัตถการ       ║");
  lines.push("╚══════════════════════════╝");
  lines.push("");
  lines.push(`📅 วันที่: ${dateStr}`);
  lines.push(`⏰ เวลา: ${timeStr}`);
  lines.push(`📋 จำนวน: ${items.length} รายการ (${items.reduce((s, i) => s + i.quantity, 0)} ชิ้น)`);
  lines.push("");

  // ─── Items Detail
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("📝 รายการหัตถการ");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━");

  items.forEach((item, idx) => {
    const unitPrice = item.product.normalPrice;
    const total = unitPrice * item.quantity;
    lines.push(`${idx + 1}. ${item.product.name}`);
    lines.push(`   ราคา/ชิ้น: ฿${fmt(unitPrice)}  x${item.quantity}  = ฿${fmt(total)}`);

    // Show best pass price for this item
    const breakdown = comparison.items.find((b) => b.productId === item.productId);
    if (breakdown && best && best.slug !== "normal") {
      const passPrice = breakdown.prices.find((p) => p.passSlug === best.slug);
      if (passPrice?.unitPrice != null && passPrice.unitPrice < unitPrice) {
        const itemSaving = (unitPrice - passPrice.unitPrice) * item.quantity;
        lines.push(`   → ${best.name}: ฿${fmt(passPrice.unitPrice)}/ชิ้น (ประหยัด ฿${fmt(itemSaving)})`);
      }
    }
  });

  // ─── Normal total
  lines.push("");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push(`💰 รวมราคาปกติ (ไม่ใช้ Pass): ฿${fmt(normal?.grandTotal ?? 0)}`);
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // ─── Comparison Table
  lines.push("");
  lines.push("📊 เปรียบเทียบทุก Pass:");
  lines.push("┌─────────────────────────┐");

  comparison.totals.forEach((t) => {
    const star = t.isBestValue ? " ⭐" : "";
    const savingsText = t.savings > 0 ? ` (-${t.savingsPercent.toFixed(2)}%)` : "";

    lines.push(`│ ${t.name}${star}`);

    if (t.slug === "normal") {
      lines.push(`│   รวม: ฿${fmt(t.grandTotal)}`);
    } else {
      lines.push(`│   ค่าหัตถการ: ฿${fmt(t.itemsTotal)}`);
      lines.push(`│   ค่า Pass:   ฿${fmt(t.upfrontFee)}`);
      lines.push(`│   รวมทั้งหมด: ฿${fmt(t.grandTotal)}${savingsText}`);
      if (t.savings > 0) {
        lines.push(`│   ✅ ประหยัด: ฿${fmt(t.savings)}`);
      }
      if (t.hasLockedItems && t.lockedItemNames && t.lockedItemNames.length > 0) {
        lines.push(`│   ⚠️ ไม่รองรับ Pass นี้:`);
        t.lockedItemNames.forEach((name) => {
          lines.push(`│      • ${name}`);
        });
        lines.push(`│      (คิดราคาปกติแทน)`);
      }
      if (t.isOverGoldLimit) {
        lines.push(`│   ⚠️ เกินลิมิต Gold (${t.goldItemCount}/${t.goldItemLimit})`);
      }
    }
    lines.push("│");
  });

  lines.push("└─────────────────────────┘");

  // ─── Recommendation
  if (best && best.slug !== "normal" && best.savings > 0) {
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push(`🏆 แนะนำ: ใช้ ${best.name}`);
    lines.push(`   จ่ายรวม ฿${fmt(best.grandTotal)} (ประหยัด ฿${fmt(best.savings)}, ลด ${best.savingsPercent.toFixed(2)}%)`);
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━");
  }

  // ─── Upsell alert
  if (comparison.upsellAlert) {
    const ua = comparison.upsellAlert;
    lines.push("");
    lines.push(`💡 ${ua.message}`);
  }

  // ─── Footer
  lines.push("");
  lines.push("─────────────────────────");
  lines.push("📱 จำลองราคาเพิ่มเติม:");
  lines.push("🔗 paragonpass-omega.vercel.app");
  lines.push("─────────────────────────");

  return lines.join("\n");
}

function fmt(n: number): string {
  return new Intl.NumberFormat("th-TH").format(Math.round(n));
}
