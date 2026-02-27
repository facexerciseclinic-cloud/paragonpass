// ============================================================================
// Paragonpass - Cart Calculation Engine
// ============================================================================
// This is the CORE BUSINESS LOGIC for calculating cart totals across all
// 4 scenarios (Normal, Silver, Gold, Paragon).
//
// KEY RULES:
// 1. Normal Price: Walk-in retail price, no pass needed.
// 2. Silver Pass (299 THB): Access Silver-tier prices. Unlimited items.
//    Items marked "-" (isAccessible=false) are LOCKED.
// 3. Gold Pass (999 THB): Access Silver prices (unlimited) + Gold prices
//    (max 4 Gold-tier items). Items marked "-" are LOCKED.
// 4. Paragon Card (2999 THB): Access ALL items at Paragon prices.
//    Valid for 3 months. Unlimited items.
//
// PRICE RESOLUTION (for "/" symbol / usesBestPrice=true):
//   When a tier has usesBestPrice=true, it inherits the LOWEST available
//   price from: its own specialPrice, lower tier prices, or normal/promo.
//
// GOLD TIER LOGIC:
//   A product is "gold-tier-only" if it has a Gold price but Silver is locked.
//   These count against the 4-item limit.
//   Products accessible at both Silver AND Gold use the Silver price under
//   Gold Pass (since Silver items are unlimited under Gold).
// ============================================================================

import type {
  CartItem,
  CartComparison,
  ItemPriceBreakdown,
  PassItemPrice,
  ScenarioTotal,
  UpsellAlert,
  Pass,
  ProductWithPricing,
  ProductPassPricingWithPass,
} from "@/types";

// ============================================================================
// PRICE RESOLUTION
// ============================================================================

/**
 * Resolves the effective price for a product under a specific pass tier.
 *
 * @returns The resolved price, or null if the product is not accessible.
 */
export function resolvePassPrice(
  product: ProductWithPricing,
  passSlug: string,
  allPasses?: Pass[]
): number | null {
  const pricing = product.passPricing.find((pp) => pp.pass.slug === passSlug);

  // No pricing rule exists for this pass → not accessible
  if (!pricing) return null;

  // Explicitly locked ("-" symbol)
  if (!pricing.isAccessible) return null;

  // Has a specific price set
  if (!pricing.usesBestPrice && pricing.specialPrice !== null) {
    return pricing.specialPrice;
  }

  // usesBestPrice = true ("/" symbol): find the best available price
  if (pricing.usesBestPrice) {
    return resolveBestPrice(product, passSlug, allPasses);
  }

  // Fallback: use normal price
  return product.normalPrice;
}

/**
 * For the "/" symbol: finds the lowest available price across all tiers
 * at or below the given pass level.
 *
 * Priority order (lowest wins):
 * 1. Own specialPrice (if set)
 * 2. Lower-tier special prices (Silver < Gold < Paragon)
 * 3. Promo price
 * 4. Normal price
 */
function resolveBestPrice(
  product: ProductWithPricing,
  _passSlug: string,
  _allPasses?: Pass[]
): number {
  const candidates: number[] = [product.normalPrice];

  // Tier hierarchy: silver → gold → paragon
  const tierOrder = ["silver", "gold", "paragon"];

  for (const tierSlug of tierOrder) {
    const pp = product.passPricing.find((p) => p.pass.slug === tierSlug);
    if (!pp) continue;
    if (!pp.isAccessible) continue;

    // Only consider tiers at or below our level
    // (a Gold pass user can see Silver prices too)
    if (pp.specialPrice !== null && pp.specialPrice > 0) {
      candidates.push(pp.specialPrice);
    }
  }

  return Math.min(...candidates);
}

/**
 * Checks if a product is accessible under a specific pass.
 */
export function isProductAccessible(
  product: ProductWithPricing,
  passSlug: string
): boolean {
  const pricing = product.passPricing.find((pp) => pp.pass.slug === passSlug);
  if (!pricing) return false;
  return pricing.isAccessible;
}

/**
 * Determines if a product is a "Gold-tier-only" item.
 * This means it's accessible under Gold but NOT under Silver.
 * These items count against the Gold Pass 4-item limit.
 */
export function isGoldTierOnly(product: ProductWithPricing): boolean {
  const silverPricing = product.passPricing.find(
    (pp) => pp.pass.slug === "silver"
  );
  const goldPricing = product.passPricing.find(
    (pp) => pp.pass.slug === "gold"
  );

  const silverAccessible = silverPricing?.isAccessible ?? false;
  const goldAccessible = goldPricing?.isAccessible ?? false;

  // Gold-tier-only: accessible at Gold but NOT at Silver
  return goldAccessible && !silverAccessible;
}

/**
 * Gets the effective price for a product under Gold Pass.
 *
 * Gold Pass rules:
 * - If product is Silver-accessible → use Silver price (unlimited)
 * - If product is Gold-only → use Gold price (counts toward 4-item limit)
 * - If product is locked for both → not accessible
 */
export function resolveGoldPassPrice(
  product: ProductWithPricing,
  allPasses?: Pass[]
): { price: number | null; isGoldTierItem: boolean } {
  const silverPrice = resolvePassPrice(product, "silver", allPasses);
  const goldPricing = product.passPricing.find(
    (pp) => pp.pass.slug === "gold"
  );

  // If Silver-accessible, Gold Pass users get Silver price (unlimited)
  if (silverPrice !== null) {
    // But check if Gold has a better (lower) price
    const goldPrice = resolvePassPrice(product, "gold", allPasses);
    if (goldPrice !== null && goldPrice < silverPrice) {
      // Gold has a better price — but this counts toward the 4-item limit
      return { price: goldPrice, isGoldTierItem: true };
    }
    // Use Silver price (doesn't count toward limit)
    return { price: silverPrice, isGoldTierItem: false };
  }

  // Not Silver-accessible, check Gold directly
  if (goldPricing?.isAccessible) {
    const goldPrice = resolvePassPrice(product, "gold", allPasses);
    return { price: goldPrice, isGoldTierItem: true };
  }

  // Not accessible under Gold Pass at all
  return { price: null, isGoldTierItem: false };
}

// ============================================================================
// CART COMPARISON CALCULATOR
// ============================================================================

/**
 * Calculates the full cart comparison across all 4 scenarios.
 * This is the main function called by the frontend.
 */
export function calculateCartComparison(
  cartItems: CartItem[],
  passes: Pass[]
): CartComparison {
  if (cartItems.length === 0) {
    return {
      items: [],
      totals: buildEmptyTotals(passes),
      bestScenario: "normal",
      upsellAlert: null,
    };
  }

  // Build item-level breakdowns
  const items: ItemPriceBreakdown[] = cartItems.map((item) =>
    calculateItemBreakdown(item, passes)
  );

  // Calculate scenario totals
  const totals = calculateScenarioTotals(items, passes, cartItems);

  // Find best scenario (lowest grandTotal that has no locked items and is within limits)
  const bestScenario = findBestScenario(totals);

  // Generate upsell alert
  const upsellAlert = generateUpsellAlert(totals, passes);

  return { items, totals, bestScenario, upsellAlert };
}

// ============================================================================
// ITEM BREAKDOWN
// ============================================================================

function calculateItemBreakdown(
  item: CartItem,
  passes: Pass[]
): ItemPriceBreakdown {
  const { product, quantity } = item;
  const normalUnitPrice = product.normalPrice;
  const normalTotal = normalUnitPrice * quantity;

  const prices: PassItemPrice[] = passes.map((pass) => {
    if (pass.slug === "gold") {
      // Special handling for Gold Pass
      const { price, isGoldTierItem } = resolveGoldPassPrice(product, passes);
      return {
        passSlug: pass.slug,
        passName: pass.name,
        unitPrice: price,
        total: price !== null ? price * quantity : null,
        isAccessible: price !== null,
        isLocked: price === null,
        isGoldTierLimited: isGoldTierItem,
      };
    }

    // Silver and Paragon
    const price = resolvePassPrice(product, pass.slug, passes);
    return {
      passSlug: pass.slug,
      passName: pass.name,
      unitPrice: price,
      total: price !== null ? price * quantity : null,
      isAccessible: price !== null,
      isLocked: price === null,
      isGoldTierLimited: false,
    };
  });

  return {
    productId: item.productId,
    productName: product.name,
    quantity,
    normalUnitPrice,
    normalTotal,
    prices,
  };
}

// ============================================================================
// SCENARIO TOTALS
// ============================================================================

function calculateScenarioTotals(
  items: ItemPriceBreakdown[],
  passes: Pass[],
  cartItems: CartItem[]
): ScenarioTotal[] {
  // Normal scenario
  const normalItemsTotal = items.reduce((sum, item) => sum + item.normalTotal, 0);
  const normalTotal: ScenarioTotal = {
    slug: "normal",
    name: "ราคาปกติ",
    upfrontFee: 0,
    itemsTotal: normalItemsTotal,
    grandTotal: normalItemsTotal,
    savings: 0,
    savingsPercent: 0,
    isBestValue: false,
    hasLockedItems: false,
  };

  // Pass scenarios
  const passScenarios: ScenarioTotal[] = passes.map((pass) => {
    const hasLockedItems = items.some((item) => {
      const passPrice = item.prices.find((p) => p.passSlug === pass.slug);
      return passPrice?.isLocked ?? false;
    });

    let itemsTotal = 0;
    let goldItemCount = 0;
    let isOverGoldLimit = false;

    if (pass.slug === "gold") {
      // Gold Pass: special handling for the 4-item limit
      const goldMaxItems = pass.maxItems ?? 4;

      // Separate gold-tier-only items from silver-accessible items
      const goldTierItems: { breakdown: ItemPriceBreakdown; cartItem: CartItem }[] = [];
      const silverTierItems: { breakdown: ItemPriceBreakdown }[] = [];

      items.forEach((itemBreakdown, idx) => {
        const goldPrice = itemBreakdown.prices.find(
          (p) => p.passSlug === "gold"
        );
        if (!goldPrice || goldPrice.isLocked) {
          // Item is locked for Gold — use normal price
          itemsTotal += itemBreakdown.normalTotal;
        } else if (goldPrice.isGoldTierLimited) {
          goldTierItems.push({
            breakdown: itemBreakdown,
            cartItem: cartItems[idx],
          });
        } else {
          silverTierItems.push({ breakdown: itemBreakdown });
        }
      });

      // Add silver-tier items (unlimited, use silver/best price)
      for (const { breakdown } of silverTierItems) {
        const goldPrice = breakdown.prices.find((p) => p.passSlug === "gold");
        itemsTotal += goldPrice?.total ?? breakdown.normalTotal;
      }

      // Add gold-tier items (max 4 total quantity)
      // Sort by savings (biggest savings first) to optimize for user
      goldTierItems.sort((a, b) => {
        const aSavings =
          a.breakdown.normalTotal -
          (a.breakdown.prices.find((p) => p.passSlug === "gold")?.total ??
            a.breakdown.normalTotal);
        const bSavings =
          b.breakdown.normalTotal -
          (b.breakdown.prices.find((p) => p.passSlug === "gold")?.total ??
            b.breakdown.normalTotal);
        return bSavings - aSavings; // most savings first
      });

      let remainingGoldSlots = goldMaxItems;
      for (const { breakdown, cartItem } of goldTierItems) {
        const goldPrice = breakdown.prices.find((p) => p.passSlug === "gold");
        const unitPrice = goldPrice?.unitPrice ?? breakdown.normalUnitPrice;

        if (remainingGoldSlots >= cartItem.quantity) {
          // All units fit within limit
          itemsTotal += unitPrice * cartItem.quantity;
          goldItemCount += cartItem.quantity;
          remainingGoldSlots -= cartItem.quantity;
        } else if (remainingGoldSlots > 0) {
          // Partial: some at gold price, rest at normal
          itemsTotal += unitPrice * remainingGoldSlots;
          itemsTotal +=
            breakdown.normalUnitPrice *
            (cartItem.quantity - remainingGoldSlots);
          goldItemCount += remainingGoldSlots;
          remainingGoldSlots = 0;
          isOverGoldLimit = true;
        } else {
          // No more gold slots — use normal price
          itemsTotal += breakdown.normalTotal;
          isOverGoldLimit = true;
        }
      }
    } else {
      // Silver & Paragon: straightforward sum
      for (const itemBreakdown of items) {
        const passPrice = itemBreakdown.prices.find(
          (p) => p.passSlug === pass.slug
        );
        if (passPrice && passPrice.isAccessible && passPrice.total !== null) {
          itemsTotal += passPrice.total;
        } else {
          // Locked item → use normal price
          itemsTotal += itemBreakdown.normalTotal;
        }
      }
    }

    const grandTotal = pass.upfrontFee + itemsTotal;
    const savings = normalItemsTotal - grandTotal;
    const savingsPercent =
      normalItemsTotal > 0 ? Math.round(((savings / normalItemsTotal) * 100) * 100) / 100 : 0;

    const scenario: ScenarioTotal = {
      slug: pass.slug,
      name: pass.name,
      upfrontFee: pass.upfrontFee,
      itemsTotal,
      grandTotal,
      savings,
      savingsPercent,
      isBestValue: false,
      hasLockedItems,
    };

    if (pass.slug === "gold") {
      scenario.goldItemCount = goldItemCount;
      scenario.goldItemLimit = pass.maxItems ?? 4;
      scenario.isOverGoldLimit = isOverGoldLimit;
    }

    return scenario;
  });

  return [normalTotal, ...passScenarios];
}

// ============================================================================
// BEST SCENARIO FINDER
// ============================================================================

function findBestScenario(totals: ScenarioTotal[]): string {
  // Find the scenario with the lowest grandTotal
  // (consider all scenarios — even ones with locked items, since the locked
  // items fall back to normal price they can still be cheaper overall)
  let best = totals[0];
  for (const scenario of totals) {
    if (scenario.grandTotal < best.grandTotal) {
      best = scenario;
    }
  }

  // Mark it
  best.isBestValue = true;
  return best.slug;
}

// ============================================================================
// UPSELL ALERT GENERATOR
// ============================================================================

/**
 * Generates an upsell alert if upgrading to a higher pass would save money.
 *
 * Rules:
 * - If Silver total is approaching or exceeding Gold total → suggest Gold
 * - If Gold total is approaching or exceeding Paragon total → suggest Paragon
 * - "Approaching" = within 500 THB or if upgrade saves > 20%
 */
function generateUpsellAlert(
  totals: ScenarioTotal[],
  _passes: Pass[]
): UpsellAlert | null {
  const silverTotal = totals.find((t) => t.slug === "silver");
  const goldTotal = totals.find((t) => t.slug === "gold");
  const paragonTotal = totals.find((t) => t.slug === "paragon");

  // Try Silver → Gold upgrade
  if (silverTotal && goldTotal) {
    const silverGrand = silverTotal.grandTotal;
    const goldGrand = goldTotal.grandTotal;

    if (silverGrand > 0 && goldGrand < silverGrand) {
      const additionalCost = goldTotal.upfrontFee - silverTotal.upfrontFee;
      const additionalSavings = silverGrand - goldGrand;

      return {
        fromPass: "silver",
        toPass: "gold",
        additionalCost,
        additionalSavings,
        message: `อัปเกรดเป็น Gold Pass เพิ่มเพียง ${formatNum(additionalCost)} บาท ประหยัดเพิ่ม ${formatNum(additionalSavings)} บาท!`,
      };
    }

    // approaching: within 500 THB
    const diff = silverGrand - goldGrand;
    if (diff > -500 && diff <= 0) {
      const additionalCost = Math.abs(diff);
      return {
        fromPass: "silver",
        toPass: "gold",
        additionalCost,
        additionalSavings: 0,
        message: `เพิ่มอีกแค่ ${formatNum(additionalCost)} บาท ก็อัปเกรดเป็น Gold Pass ได้แล้ว!`,
      };
    }
  }

  // Try Gold → Paragon upgrade
  if (goldTotal && paragonTotal) {
    const goldGrand = goldTotal.grandTotal;
    const paragonGrand = paragonTotal.grandTotal;

    if (goldGrand > 0 && paragonGrand < goldGrand) {
      const additionalCost = paragonTotal.upfrontFee - goldTotal.upfrontFee;
      const additionalSavings = goldGrand - paragonGrand;

      return {
        fromPass: "gold",
        toPass: "paragon",
        additionalCost,
        additionalSavings,
        message: `อัปเกรดเป็น Paragon Card เพิ่มเพียง ${formatNum(additionalCost)} บาท ประหยัดเพิ่ม ${formatNum(additionalSavings)} บาท!`,
      };
    }
  }

  return null;
}

function formatNum(n: number): string {
  return new Intl.NumberFormat("th-TH").format(Math.round(n));
}

// ============================================================================
// EMPTY TOTALS (for empty cart)
// ============================================================================

function buildEmptyTotals(passes: Pass[]): ScenarioTotal[] {
  const normal: ScenarioTotal = {
    slug: "normal",
    name: "ราคาปกติ",
    upfrontFee: 0,
    itemsTotal: 0,
    grandTotal: 0,
    savings: 0,
    savingsPercent: 0,
    isBestValue: true,
    hasLockedItems: false,
  };

  const passScenarios = passes.map((pass) => ({
    slug: pass.slug,
    name: pass.name,
    upfrontFee: pass.upfrontFee,
    itemsTotal: 0,
    grandTotal: pass.upfrontFee,
    savings: -pass.upfrontFee,
    savingsPercent: 0,
    isBestValue: false,
    hasLockedItems: false,
  }));

  return [normal, ...passScenarios];
}

// ============================================================================
// HELPER: Get all gold-tier-only items count from cart
// ============================================================================

export function getGoldTierItemCount(cartItems: CartItem[]): number {
  return cartItems.reduce((count, item) => {
    if (isGoldTierOnly(item.product)) {
      return count + item.quantity;
    }
    return count;
  }, 0);
}

/**
 * Checks if adding a product to the cart would exceed the Gold 4-item limit.
 */
export function wouldExceedGoldLimit(
  currentCartItems: CartItem[],
  newProduct: ProductWithPricing,
  goldMaxItems: number = 4
): boolean {
  if (!isGoldTierOnly(newProduct)) return false;
  const currentCount = getGoldTierItemCount(currentCartItems);
  return currentCount >= goldMaxItems;
}
