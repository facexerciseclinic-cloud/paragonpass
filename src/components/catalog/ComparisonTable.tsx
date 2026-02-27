"use client";

import { useCartStore } from "@/store/cart";
import { SCENARIO_CONFIG, formatPrice } from "@/lib/constants";
import type { Pass, ScenarioTotal } from "@/types";

export function ComparisonTable({ passes }: { passes: Pass[] }) {
  const comparison = useCartStore((s) => s.comparison);
  const itemCount = useCartStore((s) => s.itemCount);

  if (itemCount === 0) {
    return (
      <div className="text-center py-10 text-[var(--neutral-400)] text-sm font-light">
        เพิ่มรายการเพื่อเปรียบเทียบราคา
      </div>
    );
  }

  const scenarios = comparison.totals;
  const normalTotal = scenarios.find((s) => s.slug === "normal");

  return (
    <div className="space-y-2">
      {/* Explanation */}
      <p className="text-[10px] text-[var(--neutral-400)] font-light mb-1 leading-relaxed">
        ระบบคำนวณ 4 สถานการณ์ให้โดยอัตโนมัติ — ค่าบัตร + ค่าหัตถการ = ยอดจ่ายทั้งหมด
      </p>

      {/* Scenario Cards */}
      {scenarios.map((scenario) => (
        <ScenarioCard
          key={scenario.slug}
          scenario={scenario}
          normalGrandTotal={normalTotal?.grandTotal ?? 0}
        />
      ))}

      {/* Per-item breakdown (collapsed by default) */}
      <details className="mt-4 group">
        <summary className="text-xs text-[var(--neutral-400)] cursor-pointer hover:text-[var(--brand-primary)] transition-colors flex items-center gap-1.5 font-light">
          <svg className="w-3 h-3 group-open:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          ดูราคาแต่ละรายการ
        </summary>
        <p className="text-[10px] text-[var(--neutral-400)] font-light mt-2 mb-2">
          เปรียบเทียบราคาของแต่ละหัตถการในแต่ละสถานการณ์
        </p>
        <div className="mt-2 space-y-2">
          {comparison.items.map((item) => (
            <div key={item.productId} className="bg-[var(--brand-blush)]/50 rounded-xl p-2.5">
              <p className="text-[11px] font-medium text-[var(--neutral-700)] mb-1.5">
                {item.productName} ×{item.quantity}
              </p>
              <div className="grid grid-cols-4 gap-1">
                {/* Normal */}
                <div className="text-center">
                  <p className="text-[9px] text-[var(--neutral-400)] font-light">ไม่มี Pass</p>
                  <p className="text-[11px] font-medium text-[var(--neutral-600)] tabular-nums">
                    ฿{formatPrice(item.normalTotal)}
                  </p>
                </div>
                {/* Pass prices */}
                {item.prices.map((pp) => (
                  <div key={pp.passSlug} className="text-center">
                    <p className="text-[9px] text-[var(--neutral-400)] font-light">
                      {pp.passSlug === "silver"
                        ? "Silver"
                        : pp.passSlug === "gold"
                          ? "Gold"
                          : "Paragon"}
                    </p>
                    {pp.isLocked ? (
                      <p className="text-[11px] text-[var(--neutral-300)]">ไม่เปิดให้</p>
                    ) : (
                      <p className="text-[11px] font-medium text-[var(--neutral-600)] tabular-nums">
                        ฿{formatPrice(pp.total ?? 0)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

function ScenarioCard({
  scenario,
  normalGrandTotal,
}: {
  scenario: ScenarioTotal;
  normalGrandTotal: number;
}) {
  const config =
    SCENARIO_CONFIG[scenario.slug as keyof typeof SCENARIO_CONFIG] ??
    SCENARIO_CONFIG.normal;

  const isBest = scenario.isBestValue;

  return (
    <div
      className={`
        relative rounded-2xl p-3.5 border-2 transition-all duration-300
        ${isBest ? `${config.borderClass} ${config.bgClass} shadow-soft` : "border-[var(--neutral-200)]/60 bg-white/60 backdrop-blur-sm"}
        ${scenario.hasLockedItems ? "opacity-60" : ""}
      `}
    >
      {/* Best Value Badge */}
      {isBest && (
        <span className="absolute -top-2.5 right-3 gradient-brand text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-brand">
          ★ คุ้มค่าที่สุด
        </span>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Mini ticket/card icon */}
          {scenario.slug !== "normal" && (
            scenario.slug === "paragon" ? (
              <svg viewBox="0 0 28 20" fill="none" className="w-6 h-4 flex-shrink-0 opacity-60">
                <rect x="1" y="1" width="26" height="18" rx="3" className="fill-purple-200/60 stroke-purple-400" strokeWidth="1"/>
                <rect x="1" y="5" width="26" height="3" className="fill-purple-400/40"/>
                <rect x="4" y="11" width="8" height="2" rx="0.5" className="fill-purple-300/60"/>
                <rect x="4" y="14.5" width="12" height="1.5" rx="0.5" className="fill-purple-200/60"/>
              </svg>
            ) : (
              <svg viewBox="0 0 28 20" fill="none" className="w-6 h-4 flex-shrink-0 opacity-60">
                <rect x="1" y="2" width="26" height="16" rx="2.5"
                  className={scenario.slug === "silver" ? "fill-slate-200/80 stroke-slate-400" : "fill-amber-200/60 stroke-amber-400"}
                  strokeWidth="1"/>
                <path d="M9 2V18"
                  className={scenario.slug === "silver" ? "stroke-slate-300" : "stroke-amber-300"}
                  strokeWidth="1" strokeDasharray="2 2"/>
              </svg>
            )
          )}
          <div>
            <h4 className={`text-sm font-semibold ${config.textClass}`}>
              {config.name}
            </h4>
            <p className="text-[9px] text-[var(--neutral-400)] font-light">
              {scenario.slug === "normal"
                ? "ไม่ต้องซื้อบัตร"
                : scenario.slug === "paragon"
                  ? `ซื้อบัตร ฿${formatPrice(scenario.upfrontFee)} + ราคาสมาชิก`
                  : `ซื้อตั๋ว ฿${formatPrice(scenario.upfrontFee)} + ราคาสมาชิก`}
            </p>
          </div>
        </div>
        {scenario.hasLockedItems && (
          <span className="text-[10px] bg-rose-50 text-rose-400 px-2 py-0.5 rounded-full font-light">
            บางรายการใช้ไม่ได้
          </span>
        )}
      </div>

      {/* Breakdown Row */}
      <div className="flex items-end justify-between">
        <div className="space-y-0.5">
          {scenario.upfrontFee > 0 && (
            <p className="text-[11px] text-[var(--neutral-400)] font-light tabular-nums">
              {scenario.slug === "paragon" ? "ค่าบัตร (Card)" : "ค่าตั๋ว (Pass)"}: ฿{formatPrice(scenario.upfrontFee)}
            </p>
          )}
          <p className="text-[11px] text-[var(--neutral-400)] font-light tabular-nums">
            ค่าหัตถการ{scenario.slug !== "normal" ? " (ราคาสมาชิก)" : ""}: ฿{formatPrice(scenario.itemsTotal)}
          </p>
          {/* Gold limit info */}
          {scenario.slug === "gold" &&
            scenario.goldItemCount !== undefined &&
            scenario.goldItemLimit !== undefined && (
              <p
                className={`text-[10px] font-light ${
                  scenario.isOverGoldLimit ? "text-rose-500 font-medium" : "text-amber-600"
                }`}
              >
                รายการระดับ Gold: {scenario.goldItemCount}/{scenario.goldItemLimit}
                {scenario.isOverGoldLimit && " ⚠ เกินลิมิต 4 รายการ"}
              </p>
            )}
        </div>

        <div className="text-right">
          <p
            className={`text-xl font-bold tabular-nums ${
              isBest ? config.textClass : "text-[var(--neutral-700)]"
            }`}
          >
            ฿{formatPrice(scenario.grandTotal)}
          </p>
          <p className="text-[9px] text-[var(--neutral-400)] font-light">ยอดจ่ายทั้งหมด</p>
          {scenario.savings > 0 && (
            <p className="text-[11px] text-emerald-600 font-medium tabular-nums">
              ประหยัด ฿{formatPrice(scenario.savings)} ({scenario.savingsPercent.toFixed(2)}%)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
