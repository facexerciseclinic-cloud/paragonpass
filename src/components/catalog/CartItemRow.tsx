"use client";

import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/constants";

interface Props {
  productId: string;
  productName: string;
  quantity: number;
  normalUnitPrice: number;
}

export function CartItemRow({ productId, productName, quantity, normalUnitPrice }: Props) {
  const decrementItem = useCartStore((s) => s.decrementItem);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex items-center gap-3 py-3 border-b border-[var(--neutral-200)]/40 last:border-b-0 group">
      {/* Product Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--neutral-800)] truncate">
          {productName}
        </p>
        <p className="text-[11px] text-[var(--neutral-400)] font-light tabular-nums">
          ราคาปกติ ฿{formatPrice(normalUnitPrice)} / ครั้ง
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-0.5 bg-[var(--brand-blush)] rounded-xl flex-shrink-0">
        <button
          onClick={() => decrementItem(productId)}
          className="w-7 h-7 flex items-center justify-center rounded-l-xl text-[var(--neutral-500)] hover:bg-[var(--brand-accent-light)]/50 transition-colors text-xs font-medium"
        >
          −
        </button>
        <span className="w-7 text-center text-xs font-bold text-[var(--neutral-700)] tabular-nums">
          {quantity}
        </span>
        <button
          onClick={() => incrementItem(productId)}
          className="w-7 h-7 flex items-center justify-center rounded-r-xl text-[var(--neutral-500)] hover:bg-[var(--brand-accent-light)]/50 transition-colors text-xs font-medium"
        >
          +
        </button>
      </div>

      {/* Total */}
      <div className="text-right flex-shrink-0 w-20">
        <p className="text-[9px] text-[var(--neutral-400)] font-light">รวม</p>
        <p className="text-sm font-bold text-[var(--neutral-700)] tabular-nums">
          ฿{formatPrice(normalUnitPrice * quantity)}
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(productId)}
        className="opacity-60 lg:opacity-0 group-hover:opacity-100 transition-opacity text-[var(--neutral-400)] hover:text-rose-400 flex-shrink-0 w-5 h-5 flex items-center justify-center"
        title="ลบรายการนี้"
        aria-label={`ลบ ${productName}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
