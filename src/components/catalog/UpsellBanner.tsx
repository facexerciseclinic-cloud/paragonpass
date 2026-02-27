"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/constants";

export function UpsellBanner() {
  const upsellAlert = useCartStore((s) => s.comparison.upsellAlert);
  const [dismissed, setDismissed] = useState(false);

  if (!upsellAlert || dismissed) return null;

  const borderColor =
    upsellAlert.toPass === "gold"
      ? "border-[var(--tier-gold)]/40 bg-[var(--tier-gold-bg)]"
      : upsellAlert.toPass === "paragon"
        ? "border-[var(--brand-primary)]/30 bg-[var(--tier-paragon-bg)]"
        : "border-[var(--tier-silver)]/40 bg-[var(--tier-silver-bg)]";

  const textColor =
    upsellAlert.toPass === "gold"
      ? "text-amber-800"
      : upsellAlert.toPass === "paragon"
        ? "text-[var(--brand-primary-dark)]"
        : "text-slate-800";

  return (
    <div
      className={`
        relative rounded-2xl border p-4 mb-5
        ${borderColor}
        animate-fadeInUp
      `}
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-[var(--neutral-300)] hover:text-[var(--neutral-500)] transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">
          <span className="text-base">✨</span>
        </div>
        <div>
          <p className={`text-sm font-semibold ${textColor}`}>
            {upsellAlert.message}
          </p>
          <p className="text-xs text-[var(--neutral-500)] mt-1 font-light tabular-nums">
            เพิ่มเพียง ฿{formatPrice(upsellAlert.additionalCost)} →{" "}
            ประหยัดเพิ่ม ฿{formatPrice(upsellAlert.additionalSavings)}
          </p>
        </div>
      </div>
    </div>
  );
}
