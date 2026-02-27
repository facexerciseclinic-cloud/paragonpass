"use client";

import type { ProductWithPricing, Pass } from "@/types";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/constants";

interface ProductGridProps {
  products: ProductWithPricing[];
  passes: Pass[];
}

export function ProductGrid({ products, passes }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--neutral-400)]">
        <div className="w-12 h-12 rounded-full bg-[var(--brand-blush)] flex items-center justify-center mx-auto mb-3">
          <span className="text-xl">✨</span>
        </div>
        <p className="font-light">ไม่มีรายการในหมวดนี้</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {products.map((product, idx) => (
        <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${Math.min(idx * 0.04, 0.3)}s`, animationFillMode: 'both' }}>
          <ProductCard product={product} passes={passes} />
        </div>
      ))}
    </div>
  );
}

interface ProductCardProps {
  product: ProductWithPricing;
  passes: Pass[];
}

function ProductCard({ product, passes }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const incrementItem = useCartStore((s) => s.incrementItem);

  const existingItem = items.find((i) => i.productId === product.id);
  const qty = existingItem?.quantity ?? 0;

  const discount = product.normalPrice > 0
    ? Math.round(((product.normalPrice - product.promoPrice) / product.normalPrice) * 100)
    : 0;

  // Collect pass pricing badges
  const passBadges = passes.map((pass) => {
    const pp = product.passPricing.find((p) => p.passId === pass.id);
    if (!pp) return null;

    if (!pp.isAccessible) {
      return { slug: pass.slug, label: "ไม่เปิดให้", color: "bg-gray-100 text-gray-400" };
    }
    if (pp.usesBestPrice) {
      return { slug: pass.slug, label: "ราคาดีสุด", color: getBadgeColor(pass.slug) };
    }
    if (pp.specialPrice !== null) {
      return {
        slug: pass.slug,
        label: `฿${formatPrice(pp.specialPrice)}`,
        color: getBadgeColor(pass.slug),
      };
    }
    return null;
  }).filter(Boolean) as { slug: string; label: string; color: string }[];

  function handleAdd() {
    if (existingItem) {
      incrementItem(product.id);
    } else {
      addItem(product);
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[var(--neutral-200)]/60 p-4 card-hover flex flex-col group">
      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-medium text-[var(--neutral-800)] text-sm leading-snug mb-2.5">
          {product.name}
        </h3>

        {/* Prices */}
        <div className="flex items-baseline gap-2 mb-1">
          {product.normalPrice !== product.promoPrice && (
            <span className="text-xs text-[var(--neutral-400)] line-through font-light">
              ฿{formatPrice(product.normalPrice)}
            </span>
          )}
          <span className="text-lg font-bold text-[var(--brand-primary)]">
            ฿{formatPrice(product.promoPrice)}
          </span>
          {discount > 0 && (
            <span className="text-[10px] bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full font-semibold">
              -{discount}%
            </span>
          )}
        </div>
        {product.normalPrice !== product.promoPrice ? (
          <p className="text-[10px] text-[var(--neutral-400)] font-light mb-2">ราคาโปรโมชั่น (ไม่ต้องใช้ Pass)</p>
        ) : (
          <p className="text-[10px] text-[var(--neutral-400)] font-light mb-2">ราคาปกติ (ไม่ต้องใช้ Pass)</p>
        )}

        {/* Pass Pricing Badges */}
        {passBadges.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] text-[var(--neutral-400)] font-light mb-1.5">ราคาสมาชิก Pass:</p>
            <div className="flex flex-wrap gap-1.5">
            {passBadges.map((badge) => (
              <span
                key={badge.slug}
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${badge.color}`}
              >
                {getShortPassName(badge.slug)}: {badge.label}
              </span>
            ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Button */}
      <div className="mt-auto pt-3 border-t border-[var(--neutral-200)]/50">
        {qty === 0 ? (
          <button
            onClick={handleAdd}
            className="w-full py-2.5 gradient-brand text-white rounded-xl text-sm font-medium shadow-brand hover:shadow-lg active:scale-[0.97] transition-all duration-200"
          >
            + เพิ่มลงตะกร้า
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <QuantityControl productId={product.id} quantity={qty} />
            <button
              onClick={handleAdd}
              className="px-3 py-2 bg-[var(--brand-primary)]/8 text-[var(--brand-primary)] rounded-xl text-sm font-medium hover:bg-[var(--brand-primary)]/15 transition-colors"
            >
              + เพิ่ม
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuantityControl({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) {
  const decrementItem = useCartStore((s) => s.decrementItem);
  const incrementItem = useCartStore((s) => s.incrementItem);

  return (
    <div className="flex items-center gap-0.5 bg-[var(--brand-blush)] rounded-xl">
      <button
        onClick={() => decrementItem(productId)}
        className="w-8 h-8 flex items-center justify-center rounded-l-xl text-[var(--neutral-600)] hover:bg-[var(--brand-accent-light)]/50 transition-colors font-medium"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-bold text-[var(--neutral-700)] tabular-nums">
        {quantity}
      </span>
      <button
        onClick={() => incrementItem(productId)}
        className="w-8 h-8 flex items-center justify-center rounded-r-xl text-[var(--neutral-600)] hover:bg-[var(--brand-accent-light)]/50 transition-colors font-medium"
      >
        +
      </button>
    </div>
  );
}

function getBadgeColor(slug: string): string {
  switch (slug) {
    case "silver":
      return "bg-gray-100 text-gray-600 border border-gray-200";
    case "gold":
      return "bg-amber-50 text-amber-700 border border-amber-200/60";
    case "paragon":
      return "bg-purple-50/80 text-[var(--brand-primary)] border border-purple-200/60";
    default:
      return "bg-stone-100 text-stone-600";
  }
}

function getShortPassName(slug: string): string {
  switch (slug) {
    case "silver":
      return "Silver";
    case "gold":
      return "Gold";
    case "paragon":
      return "Paragon";
    default:
      return slug;
  }
}
