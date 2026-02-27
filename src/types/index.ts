// ============================================================================
// Paragonpass - TypeScript Type Definitions
// ============================================================================
// These types mirror the Prisma schema and define the shapes used across
// the frontend, API routes, and business logic engine.
// ============================================================================

// ============================================================================
// DATABASE ENTITY TYPES (matching Prisma models)
// ============================================================================

export interface Pass {
  id: string;
  name: string;
  slug: string; // "silver" | "gold" | "paragon"
  upfrontFee: number;
  description: string | null;
  conditionsText: string | null;
  maxItems: number | null; // null = unlimited
  validityDays: number | null; // null = per session
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  normalPrice: number;
  promoPrice: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductPassPricing {
  id: string;
  productId: string;
  passId: string;
  specialPrice: number | null;
  isAccessible: boolean;
  usesBestPrice: boolean;
}

// ============================================================================
// COMPOSITE / JOINED TYPES (for API responses)
// ============================================================================

/** Product with its category and all pass pricing info */
export interface ProductWithPricing extends Product {
  category: Category;
  passPricing: ProductPassPricingWithPass[];
}

/** Pass pricing with the pass details included */
export interface ProductPassPricingWithPass extends ProductPassPricing {
  pass: Pass;
}

/** Category with all its products (and their pricing) */
export interface CategoryWithProducts extends Category {
  products: ProductWithPricing[];
}

/** Full catalog structure for the frontend */
export interface CatalogData {
  categories: CategoryWithProducts[];
  passes: Pass[];
}

// ============================================================================
// CART TYPES
// ============================================================================

/** A single item in the cart */
export interface CartItem {
  productId: string;
  product: ProductWithPricing;
  quantity: number;
}

/** Price breakdown for a single item across all scenarios */
export interface ItemPriceBreakdown {
  productId: string;
  productName: string;
  quantity: number;
  normalUnitPrice: number;
  normalTotal: number;
  prices: PassItemPrice[];
}

/** Price for a specific pass tier for one item */
export interface PassItemPrice {
  passSlug: string;
  passName: string;
  unitPrice: number | null; // null = not accessible
  total: number | null; // null = not accessible
  isAccessible: boolean;
  isLocked: boolean; // true when product is "-" for this pass
  isGoldTierLimited: boolean; // true when this counts toward Gold's 4-item limit
}

// ============================================================================
// CART COMPARISON / TOTALS
// ============================================================================

/** The full comparison across all 4 scenarios */
export interface CartComparison {
  items: ItemPriceBreakdown[];
  totals: ScenarioTotal[];
  bestScenario: string; // slug of the most worthwhile scenario
  upsellAlert: UpsellAlert | null;
}

/** Total for one scenario (Normal, Silver, Gold, Paragon) */
export interface ScenarioTotal {
  slug: string; // "normal" | "silver" | "gold" | "paragon"
  name: string;
  upfrontFee: number;
  itemsTotal: number;
  grandTotal: number; // upfrontFee + itemsTotal
  savings: number; // compared to normal price
  savingsPercent: number;
  isBestValue: boolean;
  hasLockedItems: boolean; // true if any item in cart is locked for this tier
  lockedItemNames: string[]; // names of items locked for this tier
  goldItemCount?: number; // how many gold-tier items are in the cart
  goldItemLimit?: number; // max gold items allowed (4)
  isOverGoldLimit?: boolean;
}

/** Upsell / nudge alert */
export interface UpsellAlert {
  fromPass: string; // e.g., "silver"
  toPass: string; // e.g., "gold"
  additionalCost: number; // how much more to upgrade
  additionalSavings: number; // how much more they'd save
  message: string; // formatted alert message
}

// ============================================================================
// ADMIN FORM TYPES
// ============================================================================

/** Form data for creating/editing a product */
export interface ProductFormData {
  name: string;
  categoryId: string;
  normalPrice: number;
  promoPrice: number;
  isActive: boolean;
  passPricing: PassPricingFormData[];
}

/** Per-pass pricing form input */
export interface PassPricingFormData {
  passId: string;
  passSlug: string;
  /** 
   * "price" = specific price, "locked" = not accessible ("-"), 
   * "best" = use best price ("/"), "inherit" = use normal/promo price 
   */
  accessType: "price" | "locked" | "best" | "inherit";
  specialPrice: number | null;
}

/** Form data for creating/editing a category */
export interface CategoryFormData {
  name: string;
  sortOrder: number;
  isActive: boolean;
}

/** Form data for editing a pass */
export interface PassFormData {
  name: string;
  upfrontFee: number;
  description: string;
  conditionsText: string;
  maxItems: number | null;
  validityDays: number | null;
  isActive: boolean;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// PASS SLUG ENUM (for type safety)
// ============================================================================

export const PASS_SLUGS = {
  SILVER: "silver",
  GOLD: "gold",
  PARAGON: "paragon",
} as const;

export type PassSlug = (typeof PASS_SLUGS)[keyof typeof PASS_SLUGS];

// ============================================================================
// SCENARIO SLUG (includes "normal" which is not a pass)
// ============================================================================

export const SCENARIO_SLUGS = {
  NORMAL: "normal",
  SILVER: "silver",
  GOLD: "gold",
  PARAGON: "paragon",
} as const;

export type ScenarioSlug =
  (typeof SCENARIO_SLUGS)[keyof typeof SCENARIO_SLUGS];
