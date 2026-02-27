"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import type { CatalogData } from "@/types";
import { CategoryTabs } from "./CategoryTabs";
import { ProductGrid } from "./ProductGrid";
import { StickyCart } from "./StickyCart";
import { CartDrawer } from "./CartDrawer";
import { UpsellBanner } from "./UpsellBanner";

export function CatalogClientPage() {
  const [catalog, setCatalogLocal] = useState<CatalogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");
  const [cartOpen, setCartOpen] = useState(false);
  const storeCatalog = useCartStore((s) => s.setCatalog);
  const itemCount = useCartStore((s) => s.itemCount);

  useEffect(() => {
    async function fetchCatalog() {
      try {
        const res = await fetch("/api/catalog");
        const data = await res.json();
        if (data.success) {
          setCatalogLocal(data.data);
          storeCatalog(data.data);
          if (data.data.categories.length > 0) {
            setActiveCategoryId(data.data.categories[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch catalog:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalog();
  }, [storeCatalog]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--brand-cream)] flex items-center justify-center">
        <div className="text-center animate-fadeInUp">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--brand-accent-light)]" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--brand-primary)] animate-spin" />
          </div>
          <p className="text-[var(--neutral-500)] text-sm font-light tracking-wide">กำลังโหลดรายการ...</p>
        </div>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="min-h-screen bg-[var(--brand-cream)] flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-full bg-[var(--brand-blush)] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-[var(--neutral-500)]">ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่</p>
        </div>
      </div>
    );
  }

  const activeCategory = catalog.categories.find(
    (c) => c.id === activeCategoryId
  );

  return (
    <div className="min-h-screen bg-[var(--brand-cream)]">
      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-[var(--neutral-200)]/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-brand">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold gradient-brand-text tracking-tight">
                Paragon Pass
              </h1>
              <p className="text-[10px] text-[var(--neutral-400)] font-light tracking-wider uppercase">
                Dr.den Clinic — ระบบจำลองราคา
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Pricing table link */}
            <a
              href="/pricing"
              className="inline-flex items-center gap-1.5 bg-white/60 backdrop-blur-sm text-[var(--neutral-600)] px-3 py-2 rounded-xl text-xs font-medium hover:bg-white border border-[var(--neutral-200)] transition-all duration-300"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              ตารางราคา
            </a>
            {/* Cart button (mobile) */}
            <button
            onClick={() => setCartOpen(true)}
            className="lg:hidden relative gradient-brand text-white px-4 py-2 rounded-xl text-sm font-medium shadow-brand hover:shadow-lg transition-all duration-300"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              หัตถการที่เลือก
            </span>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                {itemCount}
              </span>
            )}
          </button>
          </div>
        </div>

        {/* Category Tabs */}
        <CategoryTabs
          categories={catalog.categories}
          activeCategoryId={activeCategoryId}
          onSelect={setActiveCategoryId}
        />
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex">
        {/* Left: Product Grid */}
        <div className="flex-1 p-4 lg:p-6 lg:pr-3 pb-32 lg:pb-6">
          {/* Upsell Banner */}
          <UpsellBanner />

          {/* Active Category Title */}
          {activeCategory && (
            <div className="flex items-center gap-3 mb-5 animate-fadeInUp">
              <div className="w-1 h-6 rounded-full gradient-brand" />
              <div>
                <h2 className="text-lg font-semibold text-[var(--neutral-800)]">
                  {activeCategory.name}
                </h2>
                <p className="text-xs text-[var(--neutral-400)] font-light">
                  {activeCategory.products.length} รายการ
                </p>
              </div>
            </div>
          )}

          {/* Products */}
          {activeCategory && (
            <ProductGrid
              products={activeCategory.products}
              passes={catalog.passes}
            />
          )}
        </div>

        {/* Right: Sticky Cart (desktop) */}
        <div className="hidden lg:block w-[420px] flex-shrink-0">
          <StickyCart passes={catalog.passes} />
        </div>
      </div>

      {/* Mobile Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        passes={catalog.passes}
      />

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30">
        <MobileBottomBar onOpenCart={() => setCartOpen(true)} />
      </div>
    </div>
  );
}

function MobileBottomBar({ onOpenCart }: { onOpenCart: () => void }) {
  const comparison = useCartStore((s) => s.comparison);
  const itemCount = useCartStore((s) => s.itemCount);
  const bestTotal = comparison.totals.find((t) => t.isBestValue);

  if (itemCount === 0) return null;

  return (
    <div className="glass border-t border-[var(--neutral-200)]/60 p-3">
      <button
        onClick={onOpenCart}
        className="w-full flex items-center justify-between gradient-brand text-white rounded-2xl px-5 py-3.5 shadow-brand hover:shadow-lg transition-all duration-300"
      >
        <div className="flex items-center gap-2.5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="font-medium">เลือกแล้ว {itemCount} รายการ</span>
        </div>
        <div className="text-right">
          <p className="text-[10px] opacity-75 font-light">
            {bestTotal?.isBestValue ? "★ คุ้มที่สุด: " : ""}{bestTotal?.name}
          </p>
          <p className="text-[9px] opacity-60 font-light">ยอดจ่ายทั้งหมด</p>
          <p className="font-bold tabular-nums">
            ฿{new Intl.NumberFormat("th-TH").format(bestTotal?.grandTotal ?? 0)}
          </p>
        </div>
      </button>
    </div>
  );
}
