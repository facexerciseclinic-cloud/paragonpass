"use client";

import { useState } from "react";
import { generateCartSummaryText } from "@/hooks/useCart";
import { useCartStore } from "@/store/cart";

export function ShareButton() {
  const itemCount = useCartStore((s) => s.itemCount);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (itemCount === 0) return null;

  const summaryText = generateCartSummaryText();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = summaryText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleShareLine() {
    const encoded = encodeURIComponent(summaryText);
    window.open(`https://line.me/R/share?text=${encoded}`, "_blank");
  }

  function handleShareWhatsApp() {
    const encoded = encodeURIComponent(summaryText);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full gradient-brand" />
        <p className="text-xs font-semibold text-[var(--neutral-600)] uppercase tracking-wider">
          แชร์ / ส่งสรุป
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            copied
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-[var(--brand-blush)] text-[var(--neutral-600)] hover:bg-[var(--brand-accent-light)]/50 border border-[var(--neutral-200)]/60"
          }`}
        >
          {copied ? "✓ คัดลอกแล้ว!" : "คัดลอก"}
        </button>

        <button
          onClick={handleShareLine}
          className="flex-1 py-2.5 bg-[#06C755] text-white rounded-xl text-sm font-medium hover:bg-[#05B54D] transition-colors shadow-sm"
        >
          LINE
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="py-2.5 px-4 bg-[#25D366] text-white rounded-xl text-sm font-medium hover:bg-[#20BD5A] transition-colors shadow-sm"
        >
          WA
        </button>
      </div>

      {/* Preview Toggle */}
      <button
        onClick={() => setShowPreview(!showPreview)}
        className="text-xs text-[var(--neutral-400)] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-1 font-light"
      >
        <svg className={`w-3 h-3 transition-transform ${showPreview ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {showPreview ? "ซ่อนตัวอย่าง" : "ดูตัวอย่างข้อความ"}
      </button>

      {showPreview && (
        <pre className="mt-1 p-3.5 bg-[var(--brand-blush)]/50 rounded-xl text-[11px] text-[var(--neutral-600)] whitespace-pre-wrap font-mono border border-[var(--neutral-200)]/40 max-h-48 overflow-y-auto scrollbar-thin">
          {summaryText}
        </pre>
      )}
    </div>
  );
}
