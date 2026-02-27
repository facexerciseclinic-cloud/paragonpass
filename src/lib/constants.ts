// ============================================================================
// Constants - Paragonpass
// ============================================================================

/** Pass upfront fees (can be overridden from DB) */
export const DEFAULT_PASS_FEES = {
  silver: 299,
  gold: 999,
  paragon: 2999,
} as const;

/** Maximum Gold-tier items per session */
export const GOLD_MAX_ITEMS = 4;

/** Paragon card validity in days */
export const PARAGON_VALIDITY_DAYS = 90;

/** Scenario display config */
export const SCENARIO_CONFIG = {
  normal: {
    slug: "normal",
    name: "ราคาปกติ",
    nameEn: "Normal Price",
    color: "stone",
    bgClass: "bg-stone-50",
    textClass: "text-stone-600",
    borderClass: "border-stone-200",
    iconBg: "bg-stone-100",
    accentClass: "text-stone-500",
  },
  silver: {
    slug: "silver",
    name: "Silver Pass",
    nameEn: "Silver Pass",
    color: "slate",
    bgClass: "bg-gradient-to-br from-gray-50 via-slate-100 to-gray-50",
    textClass: "text-slate-700",
    borderClass: "border-slate-300",
    iconBg: "gradient-silver",
    accentClass: "text-slate-500",
  },
  gold: {
    slug: "gold",
    name: "Gold Pass",
    nameEn: "Gold Pass",
    color: "amber",
    bgClass: "bg-gradient-to-br from-amber-50/80 via-yellow-50 to-orange-50/60",
    textClass: "text-amber-800",
    borderClass: "border-amber-300",
    iconBg: "gradient-gold",
    accentClass: "text-amber-600",
  },
  paragon: {
    slug: "paragon",
    name: "Paragon Card",
    nameEn: "Paragon Card",
    color: "purple",
    bgClass: "bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-rose-50/40",
    textClass: "text-purple-800",
    borderClass: "border-purple-300",
    iconBg: "gradient-paragon",
    accentClass: "text-purple-600",
  },
} as const;

/** Format number as Thai Baht */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("th-TH").format(price);
}

/** Format number as Thai Baht with suffix */
export function formatPriceTHB(price: number): string {
  return `฿${formatPrice(price)}`;
}
