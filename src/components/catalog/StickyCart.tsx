"use client";

import { useCartStore } from "@/store/cart";
import type { Pass } from "@/types";
import { CartItemRow } from "./CartItemRow";
import { ComparisonTable } from "./ComparisonTable";
import { ShareButton } from "./ShareButton";

export function StickyCart({ passes }: { passes: Pass[] }) {
  const items = useCartStore((s) => s.items);
  const comparison = useCartStore((s) => s.comparison);
  const clearCart = useCartStore((s) => s.clearCart);
  const itemCount = useCartStore((s) => s.itemCount);

  return (
    <div className="sticky top-[110px] h-[calc(100vh-120px)] flex flex-col bg-white/80 backdrop-blur-xl border-l border-[var(--neutral-200)]/60">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--neutral-200)]/60">
        <h3 className="text-sm font-semibold text-[var(--neutral-800)] flex items-center gap-2">
          <svg className="w-4 h-4 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          หัตถการที่เลือก
          {itemCount > 0 && (
            <span className="text-[10px] gradient-brand text-white px-2 py-0.5 rounded-full font-bold">
              {itemCount}
            </span>
          )}
        </h3>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-[var(--neutral-400)] hover:text-rose-500 transition-colors font-light"
          >
            ล้างทั้งหมด
          </button>
        )}
      </div>

      {/* Cart Items - scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-2">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--brand-blush)] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[var(--brand-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-sm text-[var(--neutral-500)] font-medium">ยังไม่มีหัตถการที่เลือก</p>
            <p className="text-xs text-[var(--neutral-400)] font-light mt-1">
              เลือกหัตถการจากรายการด้านซ้าย
            </p>
          </div>
        ) : (
          <div>
            {/* Item List */}
            <div className="mb-4">
              {comparison.items.map((item) => (
                <CartItemRow
                  key={item.productId}
                  productId={item.productId}
                  productName={item.productName}
                  quantity={item.quantity}
                  normalUnitPrice={item.normalUnitPrice}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-[var(--neutral-200)]/60 pt-4 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full gradient-brand" />
                <h4 className="text-xs font-semibold text-[var(--neutral-600)] uppercase tracking-wider">
                  เปรียบเทียบราคาแต่ละ Pass
                </h4>
              </div>
            </div>

            {/* Comparison Table */}
            <ComparisonTable passes={passes} />

            {/* Share */}
            <div className="mt-5 pt-4 border-t border-[var(--neutral-200)]/60">
              <ShareButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
