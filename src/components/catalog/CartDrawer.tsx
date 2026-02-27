"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";
import type { Pass } from "@/types";
import { CartItemRow } from "./CartItemRow";
import { ComparisonTable } from "./ComparisonTable";
import { ShareButton } from "./ShareButton";

interface Props {
  open: boolean;
  onClose: () => void;
  passes: Pass[];
}

export function CartDrawer({ open, onClose, passes }: Props) {
  const items = useCartStore((s) => s.items);
  const comparison = useCartStore((s) => s.comparison);
  const clearCart = useCartStore((s) => s.clearCart);
  const itemCount = useCartStore((s) => s.itemCount);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[88vh] flex flex-col animate-slideUp shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-[var(--neutral-300)] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-[var(--neutral-200)]/60">
          <h3 className="text-base font-semibold text-[var(--neutral-800)] flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            หัตถการที่เลือก
            <span className="text-sm font-light text-[var(--neutral-400)]">
              ({itemCount} รายการ)
            </span>
          </h3>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-[var(--neutral-400)] hover:text-rose-500 font-light"
              >
                ล้างทั้งหมด
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--brand-blush)] text-[var(--neutral-500)] hover:bg-[var(--neutral-200)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-[var(--brand-blush)] flex items-center justify-center mx-auto mb-5">
                <svg className="w-9 h-9 text-[var(--brand-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-[var(--neutral-500)] font-medium">ยังไม่มีหัตถการที่เลือก</p>
              <p className="text-sm text-[var(--neutral-400)] font-light mt-1">
                เลือกหัตถการจากรายการ
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-6 py-2.5 gradient-brand text-white rounded-2xl text-sm font-medium shadow-brand"
              >
                เลือกหัตถการเลย
              </button>
            </div>
          ) : (
            <>
              {/* Items */}
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

              {/* Comparison */}
              <div className="border-t border-[var(--neutral-200)]/60 pt-4 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full gradient-brand" />
                  <h4 className="text-xs font-semibold text-[var(--neutral-600)] uppercase tracking-wider">
                    เปรียบเทียบราคาแต่ละ Pass
                  </h4>
                </div>
              </div>
              <ComparisonTable passes={passes} />

              {/* Share */}
              <div className="mt-5 pt-4 border-t border-[var(--neutral-200)]/60 pb-6">
                <ShareButton />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
