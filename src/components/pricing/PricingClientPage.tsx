"use client";

import { useEffect, useState, useMemo } from "react";
import { formatPrice } from "@/lib/constants";
import type { Pass, CategoryWithProducts } from "@/types";

interface PricingData {
  passes: Pass[];
  categories: CategoryWithProducts[];
}

export function PricingClientPage() {
  const [data, setData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPricing() {
      try {
        const res = await fetch("/api/pricing");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch pricing:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPricing();
  }, []);

  // Filtered products
  const filteredCategories = useMemo(() => {
    if (!data) return [];
    const q = searchQuery.trim().toLowerCase();

    return data.categories
      .filter((cat) => activeCategoryId === "all" || cat.id === activeCategoryId)
      .map((cat) => ({
        ...cat,
        products: cat.products.filter(
          (p) => !q || p.name.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.products.length > 0);
  }, [data, activeCategoryId, searchQuery]);

  // Total product count
  const totalProducts = useMemo(
    () => filteredCategories.reduce((sum, cat) => sum + cat.products.length, 0),
    [filteredCategories]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--brand-cream)] flex items-center justify-center">
        <div className="text-center animate-fadeInUp">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--brand-accent-light)]" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--brand-primary)] animate-spin" />
          </div>
          <p className="text-[var(--neutral-500)] text-sm font-light tracking-wide">
            กำลังโหลดตารางราคา...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
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

  return (
    <div className="min-h-screen bg-[var(--brand-cream)]">
      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-[var(--neutral-200)]/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-brand group-hover:scale-105 transition-transform">
                <span className="text-white text-sm font-bold">P</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold gradient-brand-text tracking-tight">
                  Paragon Pass
                </h1>
                <p className="text-[10px] text-[var(--neutral-400)] font-light tracking-wider uppercase">
                  ตารางราคาทั้งหมด
                </p>
              </div>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/catalog"
              className="gradient-brand text-white px-4 py-2 rounded-xl text-sm font-medium shadow-brand hover:shadow-lg transition-all duration-300"
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                จำลองราคา
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <div className="text-center mb-8 animate-fadeInUp">
          <h2 className="text-2xl md:text-3xl font-bold gradient-brand-text mb-2">
            ตารางราคาหัตถการทั้งหมด
          </h2>
          <p className="text-sm text-[var(--neutral-500)] font-light max-w-xl mx-auto">
            เปรียบเทียบราคาหัตถการทุกรายการ ระหว่างราคาปกติ กับราคาสมาชิกแต่ละ Pass
          </p>
        </div>

        {/* Pass Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
          {data.passes.map((pass) => {
            const cfg = getPassConfig(pass.slug);
            const isCard = pass.slug === "paragon";

            return (
              <div
                key={pass.id}
                className={`relative rounded-2xl border ${cfg.borderClass} ${cfg.bgClass} backdrop-blur-sm overflow-hidden`}
              >
                {/* Ticket perforated edge for Silver/Gold */}
                {!isCard && (
                  <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col justify-around py-4 z-10">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-[var(--brand-cream)]" />
                    ))}
                  </div>
                )}

                <div className={`${!isCard ? "pl-5" : "pl-5"} pr-5 py-5`}>
                  <div className="flex items-start gap-3 mb-3">
                    {/* Visual: Ticket or Card */}
                    {!isCard ? (
                      <div className="w-12 h-12 flex-shrink-0">
                        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                          <rect x="4" y="10" width="40" height="28" rx="4"
                            className={pass.slug === "silver" ? "fill-slate-200/80 stroke-slate-400" : "fill-amber-200/60 stroke-amber-400"}
                            strokeWidth="1.5"/>
                          <path d="M16 10V38"
                            className={pass.slug === "silver" ? "stroke-slate-300" : "stroke-amber-300"}
                            strokeWidth="1.5" strokeDasharray="3 3"/>
                          <circle cx="24" cy="24" r="6"
                            className={pass.slug === "silver" ? "fill-slate-400/30 stroke-slate-500" : "fill-amber-300/40 stroke-amber-500"}
                            strokeWidth="1"/>
                          <text x="24" y="27" textAnchor="middle"
                            className={`${pass.slug === "silver" ? "fill-slate-600" : "fill-amber-700"} text-[10px] font-bold`}>
                            {pass.name[0]}
                          </text>
                        </svg>
                      </div>
                    ) : (
                      <div className="w-14 h-10 flex-shrink-0">
                        <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
                          <rect x="2" y="2" width="52" height="36" rx="6" className="fill-purple-200/50 stroke-purple-400" strokeWidth="1.5"/>
                          <rect x="2" y="10" width="52" height="6" className="fill-purple-400/40"/>
                          <rect x="8" y="22" width="16" height="4" rx="1" className="fill-purple-300/60"/>
                          <rect x="8" y="29" width="24" height="3" rx="1" className="fill-purple-200/60"/>
                          <circle cx="44" cy="26" r="5" className="fill-purple-300/40 stroke-purple-500" strokeWidth="0.8"/>
                          <text x="44" y="29" textAnchor="middle" className="fill-purple-700 text-[8px] font-bold">P</text>
                        </svg>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold ${cfg.textClass}`}>{pass.name}</p>
                      <p className={`text-[10px] tracking-wider uppercase mt-0.5 ${
                        isCard ? "text-purple-400" : pass.slug === "silver" ? "text-slate-400" : "text-amber-400"
                      }`}>
                        {isCard ? "Membership Card" : "Single-use Ticket"}
                      </p>
                      <p className="text-xs text-[var(--neutral-400)] mt-1">
                        {pass.description || cfg.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1.5 mt-3 pt-3 border-t border-current/10">
                    <span className="text-xs text-[var(--neutral-400)] font-light">
                      {isCard ? "ค่าบัตร" : "ค่าตั๋ว"}
                    </span>
                    <span className={`text-xl font-bold ${cfg.textClass} tabular-nums`}>
                      ฿{formatPrice(pass.upfrontFee)}
                    </span>
                  </div>
                  {pass.conditionsText && (
                    <p className="text-[10px] text-[var(--neutral-400)] mt-2 font-light leading-relaxed">
                      {pass.conditionsText}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fadeInUp" style={{ animationDelay: "0.15s" }}>
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาหัตถการ..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 backdrop-blur-sm border border-[var(--neutral-200)] text-sm text-[var(--neutral-700)] placeholder:text-[var(--neutral-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--neutral-400)] hover:text-[var(--neutral-600)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategoryId("all")}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategoryId === "all"
                  ? "gradient-brand text-white shadow-brand"
                  : "bg-white/60 text-[var(--neutral-500)] hover:bg-white border border-[var(--neutral-200)]"
              }`}
            >
              ทั้งหมด
            </button>
            {data.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategoryId === cat.id
                    ? "gradient-brand text-white shadow-brand"
                    : "bg-white/60 text-[var(--neutral-500)] hover:bg-white border border-[var(--neutral-200)]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-[var(--neutral-400)] mb-4 font-light">
          แสดง {totalProducts} รายการ
          {searchQuery && <span> — ค้นหา &quot;{searchQuery}&quot;</span>}
        </p>
      </div>

      {/* Pricing Tables */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--brand-blush)] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[var(--neutral-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-[var(--neutral-500)] text-sm">ไม่พบรายการที่ค้นหา</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} className="mb-10 animate-fadeInUp">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-7 rounded-full gradient-brand" />
                <div>
                  <h3 className="text-lg font-semibold text-[var(--neutral-800)]">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[var(--neutral-400)] font-light">
                    {category.products.length} รายการ
                  </p>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-clip rounded-2xl border border-[var(--neutral-200)]/60 bg-white/70 backdrop-blur-sm shadow-soft">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--neutral-200)]/60 sticky top-[61px] z-10">
                      <th className="text-left text-xs font-medium text-[var(--neutral-500)] px-5 py-3.5 bg-[#faf6f3] w-[30%]">
                        หัตถการ
                      </th>
                      <th className="text-center text-xs font-medium text-[var(--neutral-500)] px-3 py-3.5 bg-[#faf6f3]">
                        <span className="block">ราคาปกติ</span>
                        <span className="block text-[10px] font-light text-[var(--neutral-400)]">ไม่ต้องใช้ Pass</span>
                      </th>
                      {data.passes.map((pass) => {
                        const cfg = getPassConfig(pass.slug);
                        return (
                          <th
                            key={pass.id}
                            className={`text-center text-xs font-medium px-3 py-3.5 ${cfg.headerBg}`}
                          >
                            <span className={`block ${cfg.textClass}`}>{pass.name}</span>
                            <span className="block text-[10px] font-light text-[var(--neutral-400)]">
                              ค่าบัตร ฿{formatPrice(pass.upfrontFee)}
                            </span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {category.products.map((product, idx) => {
                      // Determine the best (lowest) price across all scenarios
                      const allPrices: number[] = [product.normalPrice];
                      product.passPricing.forEach((pp) => {
                        if (pp.isAccessible) {
                          allPrices.push(resolvePassPrice(product.passPricing, pp, product.normalPrice));
                        }
                      });
                      const bestPrice = Math.min(...allPrices);

                      return (
                        <tr
                          key={product.id}
                          className={`border-b border-[var(--neutral-200)]/40 last:border-b-0 hover:bg-[var(--brand-blush)]/30 transition-colors ${
                            idx % 2 === 0 ? "" : "bg-[var(--neutral-50)]/50"
                          }`}
                        >
                          <td className="px-5 py-3">
                            <p className="text-sm font-medium text-[var(--neutral-800)]">
                              {product.name}
                            </p>
                          </td>
                          {/* Normal Price */}
                          <td className="text-center px-3 py-3">
                            <span className="text-sm tabular-nums text-[var(--neutral-600)]">
                              ฿{formatPrice(product.normalPrice)}
                            </span>
                          </td>
                          {/* Pass Prices */}
                          {data.passes.map((pass) => {
                            const cfg = getPassConfig(pass.slug);
                            const pp = product.passPricing.find(
                              (p) => p.passId === pass.id
                            );
                            if (!pp || !pp.isAccessible) {
                              return (
                                <td key={pass.id} className={`text-center px-3 py-3 ${cfg.cellBg}`}>
                                  <span className="text-xs text-[var(--neutral-300)] font-light">
                                    ไม่เปิดให้
                                  </span>
                                </td>
                              );
                            }
                            const price = resolvePassPrice(product.passPricing, pp, product.normalPrice);
                            const isBest = price === bestPrice;
                            const savingsAmt = product.normalPrice - price;
                            const savingsPct = product.normalPrice > 0 ? Math.round((savingsAmt / product.normalPrice) * 100) : 0;
                            return (
                              <td key={pass.id} className={`text-center px-3 py-3 ${cfg.cellBg}`}>
                                <span
                                  className={`text-sm tabular-nums font-medium ${
                                    isBest
                                      ? "text-[var(--brand-primary)] font-bold"
                                      : "text-[var(--neutral-700)]"
                                  }`}
                                >
                                  ฿{formatPrice(price)}
                                </span>
                                {isBest && (
                                  <span className="block text-[9px] text-[var(--brand-primary)] font-medium mt-0.5">
                                    ★ ราคาดีสุด
                                  </span>
                                )}
                                {savingsAmt > 0 && (
                                  <>
                                    <span className="block text-[9px] text-emerald-500 font-light mt-0.5">
                                      ประหยัด ฿{formatPrice(savingsAmt)} <span className="font-semibold">(-{savingsPct}%)</span>
                                    </span>
                                    <div className="mt-1 mx-auto w-14 bg-neutral-100 rounded-full h-1 overflow-hidden">
                                      <div
                                        className="h-full rounded-full bg-emerald-400 transition-all"
                                        style={{ width: `${Math.min(savingsPct, 100)}%` }}
                                      />
                                    </div>
                                  </>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {category.products.map((product) => {
                  const allPrices: number[] = [product.normalPrice];
                  product.passPricing.forEach((pp) => {
                    if (pp.isAccessible) {
                      allPrices.push(resolvePassPrice(product.passPricing, pp, product.normalPrice));
                    }
                  });
                  const bestPrice = Math.min(...allPrices);

                  return (
                    <div
                      key={product.id}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[var(--neutral-200)]/60 p-4 shadow-soft"
                    >
                      <p className="text-sm font-semibold text-[var(--neutral-800)] mb-3">
                        {product.name}
                      </p>

                      {/* Base price */}
                      <div className="mb-3 pb-3 border-b border-[var(--neutral-200)]/40">
                        <div>
                          <p className="text-[10px] text-[var(--neutral-400)] font-light mb-0.5">ราคาปกติ (ไม่ต้องใช้ Pass)</p>
                          <p className="text-sm tabular-nums text-[var(--neutral-600)]">
                            ฿{formatPrice(product.normalPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Pass prices */}
                      <div className="space-y-2">
                        {data.passes.map((pass) => {
                          const pp = product.passPricing.find(
                            (p) => p.passId === pass.id
                          );
                          const cfg = getPassConfig(pass.slug);

                          if (!pp || !pp.isAccessible) {
                            return (
                              <div key={pass.id} className="flex items-center justify-between">
                                <span className={`text-xs ${cfg.textClass} font-medium`}>{pass.name}</span>
                                <span className="text-xs text-[var(--neutral-300)] font-light">ไม่เปิดให้</span>
                              </div>
                            );
                          }

                          const price = resolvePassPrice(product.passPricing, pp, product.normalPrice);
                          const isBest = price === bestPrice;
                          const savingsAmt = product.normalPrice - price;
                          const savingsPct = product.normalPrice > 0 ? Math.round((savingsAmt / product.normalPrice) * 100) : 0;

                          return (
                            <div key={pass.id} className="flex items-center justify-between">
                              <span className={`text-xs ${cfg.textClass} font-medium`}>{pass.name}</span>
                              <div className="text-right">
                                <span
                                  className={`text-sm tabular-nums ${
                                    isBest ? "text-[var(--brand-primary)] font-bold" : "text-[var(--neutral-700)] font-medium"
                                  }`}
                                >
                                  ฿{formatPrice(price)}
                                  {isBest && <span className="text-[9px] ml-1">★</span>}
                                </span>
                                {savingsAmt > 0 && (
                                  <span className="block text-[9px] text-emerald-500 font-light">
                                    ประหยัด ฿{formatPrice(savingsAmt)} <span className="font-semibold">(-{savingsPct}%)</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-[var(--neutral-200)]/60 p-5">
          <p className="text-xs font-semibold text-[var(--neutral-600)] mb-3">คำอธิบาย</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs text-[var(--neutral-500)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--neutral-400)]" />
              <span><strong>ราคาปกติ</strong> — ราคาหน้าร้าน ไม่ต้องซื้อ Pass</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--brand-primary)] font-bold text-sm">★</span>
              <span><strong>ราคาดีสุด</strong> — ราคาต่ำสุดของหัตถการนั้น</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 text-xs font-medium">-X%</span>
              <span>— เปอร์เซ็นต์ส่วนลดเทียบราคาปกติ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-6 bg-neutral-100 rounded-full h-1 overflow-hidden"><span className="block h-full w-3/4 rounded-full bg-emerald-400" /></span>
              <span>— แถบแสดงสัดส่วนส่วนลด</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--neutral-300)] text-[10px]">ไม่เปิดให้</span>
              <span>— Pass นี้ไม่มีราคาสำหรับหัตถการนี้</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-4 pb-12 text-center">
        <p className="text-sm text-[var(--neutral-500)] mb-4 font-light">
          สนใจซื้อ Pass? ลองจำลองราคาเพื่อดูว่า Pass ไหนคุ้มค่าที่สุดสำหรับคุณ
        </p>
        <a
          href="/catalog"
          className="inline-flex items-center gap-2 gradient-brand text-white px-8 py-3.5 rounded-2xl font-medium shadow-brand hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          เริ่มจำลองราคา
          <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </div>
    </div>
  );
}

// Helper: resolve effective price for a pass (handles usesBestPrice)
function resolvePassPrice(
  allPricing: { isAccessible: boolean; specialPrice: number | null; usesBestPrice: boolean }[],
  pp: { specialPrice: number | null; usesBestPrice: boolean },
  fallbackPrice: number
): number {
  if (pp.specialPrice != null) return pp.specialPrice;

  // usesBestPrice: find the lowest specialPrice among all accessible tiers
  const accessiblePrices = allPricing
    .filter((p) => p.isAccessible && p.specialPrice != null)
    .map((p) => p.specialPrice as number);

  return accessiblePrices.length > 0 ? Math.min(...accessiblePrices) : fallbackPrice;
}

// Helper to get pass visual config
function getPassConfig(slug: string) {
  switch (slug) {
    case "silver":
      return {
        bgClass: "bg-gradient-to-br from-gray-50 via-slate-100 to-gray-50",
        headerBg: "bg-[#f1f3f5]",
        cellBg: "bg-slate-50/50",
        textClass: "text-slate-700",
        borderClass: "border-slate-300",
        iconBg: "gradient-silver",
        desc: "ปลดล็อกราคา Silver",
      };
    case "gold":
      return {
        bgClass: "bg-gradient-to-br from-amber-50/80 via-yellow-50 to-orange-50/60",
        headerBg: "bg-[#fef9f0]",
        cellBg: "bg-amber-50/40",
        textClass: "text-amber-800",
        borderClass: "border-amber-300",
        iconBg: "gradient-gold",
        desc: "ราคา Silver + Gold",
      };
    case "paragon":
      return {
        bgClass: "bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-rose-50/40",
        headerBg: "bg-[#f8f0fa]",
        cellBg: "bg-purple-50/30",
        textClass: "text-purple-800",
        borderClass: "border-purple-300",
        iconBg: "gradient-paragon",
        desc: "ราคาดีที่สุดทุกรายการ",
      };
    default:
      return {
        bgClass: "bg-gray-50",
        headerBg: "bg-gray-100",
        cellBg: "",
        textClass: "text-gray-700",
        borderClass: "border-gray-300",
        iconBg: "bg-gray-200",
        desc: "",
      };
  }
}
