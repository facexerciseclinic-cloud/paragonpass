"use client";

import { useRef, useState, useCallback } from "react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/constants";

/**
 * Renders a hidden styled summary card, captures it with html2canvas,
 * and provides a download button.
 */
export function SummaryImageCard() {
  const items = useCartStore((s) => s.items);
  const comparison = useCartStore((s) => s.comparison);
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const best = comparison.totals.find((t) => t.isBestValue);
  const normal = comparison.totals.find((t) => t.slug === "normal");
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  const now = new Date();
  const dateStr = now.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#FBF8F4",
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `paragon-pass-summary-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setGenerating(false);
    }
  }, []);

  if (items.length === 0) return null;

  return (
    <>
      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={generating}
        className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
          generating
            ? "bg-[var(--neutral-100)] text-[var(--neutral-400)] cursor-wait"
            : "bg-gradient-to-r from-[#8B5E83] to-[#C9A87C] text-white hover:shadow-lg hover:scale-[1.01]"
        }`}
      >
        {generating ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
            </svg>
            กำลังสร้างรูป...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            ดาวน์โหลดรูปสรุป
          </>
        )}
      </button>

      {/* Hidden rendered card for html2canvas capture */}
      <div
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <div
          ref={cardRef}
          style={{
            width: "480px",
            fontFamily: "'Prompt', 'Inter', sans-serif",
            background: "linear-gradient(180deg, #FBF8F4 0%, #F5EDE8 100%)",
            padding: "0",
            color: "#292524",
          }}
        >
          {/* ═══ Header ═══ */}
          <div
            style={{
              background: "linear-gradient(135deg, #8B5E83 0%, #C9A87C 100%)",
              padding: "28px 32px 24px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <div
              style={{
                position: "absolute",
                top: "-30px",
                right: "-20px",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                left: "-15px",
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
              }}
            />
            <p
              style={{
                fontSize: "10px",
                letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Dr.den Clinic
            </p>
            <p
              style={{
                fontSize: "26px",
                fontWeight: "700",
                color: "#ffffff",
                letterSpacing: "-0.5px",
                marginBottom: "4px",
              }}
            >
              Paragon Pass
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.75)",
                fontWeight: "300",
              }}
            >
              สรุปรายการหัตถการ
            </p>
          </div>

          {/* ═══ Date/Meta ═══ */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "14px 32px",
              fontSize: "11px",
              color: "#78716C",
              borderBottom: "1px solid #E8E5E0",
            }}
          >
            <span>📅 {dateStr}</span>
            <span>⏰ {timeStr}</span>
            <span>📋 {items.length} รายการ ({totalQty} ชิ้น)</span>
          </div>

          {/* ═══ Items ═══ */}
          <div style={{ padding: "20px 32px 16px" }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#44403C",
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  width: "3px",
                  height: "16px",
                  borderRadius: "2px",
                  background: "linear-gradient(180deg, #8B5E83, #C9A87C)",
                  display: "inline-block",
                }}
              />
              รายการหัตถการ
            </p>

            {items.map((item, idx) => {
              const unitPrice = item.product.normalPrice;
              const total = unitPrice * item.quantity;
              const breakdown = comparison.items.find(
                (b) => b.productId === item.productId
              );
              const bestPassPrice =
                best && best.slug !== "normal" && breakdown
                  ? breakdown.prices.find((p) => p.passSlug === best.slug)
                  : null;
              const hasSaving =
                bestPassPrice?.unitPrice != null &&
                bestPassPrice.unitPrice < unitPrice;

              return (
                <div
                  key={item.productId}
                  style={{
                    background: idx % 2 === 0 ? "#ffffff" : "#FAFAF9",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    marginBottom: "6px",
                    border: "1px solid #E8E5E0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#292524",
                          marginBottom: "2px",
                        }}
                      >
                        {idx + 1}. {item.product.name}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#A8A29E",
                          fontWeight: "300",
                        }}
                      >
                        ฿{formatPrice(unitPrice)} × {item.quantity}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "#44403C",
                        }}
                      >
                        ฿{formatPrice(total)}
                      </p>
                      {hasSaving && bestPassPrice?.unitPrice != null && (
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#10b981",
                            fontWeight: "500",
                          }}
                        >
                          → {best!.name}: ฿{formatPrice(bestPassPrice.unitPrice)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Normal total */}
            <div
              style={{
                marginTop: "12px",
                padding: "12px 16px",
                background: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #D4D0CA",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={{ fontSize: "13px", fontWeight: "500", color: "#57534E" }}>
                💰 รวมราคาปกติ (ไม่ใช้ Pass)
              </p>
              <p style={{ fontSize: "16px", fontWeight: "700", color: "#292524" }}>
                ฿{formatPrice(normal?.grandTotal ?? 0)}
              </p>
            </div>
          </div>

          {/* ═══ Comparison ═══ */}
          <div style={{ padding: "4px 32px 20px" }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#44403C",
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  width: "3px",
                  height: "16px",
                  borderRadius: "2px",
                  background: "linear-gradient(180deg, #8B5E83, #C9A87C)",
                  display: "inline-block",
                }}
              />
              เปรียบเทียบทุก Pass
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              {comparison.totals
                .filter((t) => t.slug !== "normal")
                .map((t) => {
                  const isBest = t.isBestValue;
                  const tierColors: Record<string, { bg: string; border: string; text: string; accent: string }> = {
                    silver: { bg: "#F3F4F6", border: "#D1D5DB", text: "#475569", accent: "#64748B" },
                    gold: { bg: "#FEF9EC", border: "#F59E0B", text: "#92400E", accent: "#D97706" },
                    paragon: { bg: "#F5F0F7", border: "#A855F7", text: "#6B21A8", accent: "#8B5E83" },
                  };
                  const c = tierColors[t.slug] ?? tierColors.silver;

                  return (
                    <div
                      key={t.slug}
                      style={{
                        background: isBest
                          ? "linear-gradient(135deg, #8B5E83 0%, #C9A87C 100%)"
                          : c.bg,
                        borderRadius: "14px",
                        padding: "14px 16px",
                        border: isBest ? "2px solid #C9A87C" : `1px solid ${c.border}`,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {isBest && (
                        <div
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            background: "#F59E0B",
                            color: "#ffffff",
                            fontSize: "8px",
                            fontWeight: "700",
                            padding: "2px 8px 2px 10px",
                            borderRadius: "0 12px 0 8px",
                            letterSpacing: "0.5px",
                          }}
                        >
                          ⭐ คุ้มสุด
                        </div>
                      )}
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: isBest ? "#ffffff" : c.text,
                          marginBottom: "2px",
                        }}
                      >
                        {t.name}
                      </p>
                      <p
                        style={{
                          fontSize: "9px",
                          color: isBest ? "rgba(255,255,255,0.7)" : "#A8A29E",
                          fontWeight: "300",
                          marginBottom: "8px",
                        }}
                      >
                        ค่า Pass ฿{formatPrice(t.upfrontFee)}
                      </p>
                      <p
                        style={{
                          fontSize: "18px",
                          fontWeight: "800",
                          color: isBest ? "#ffffff" : c.text,
                          marginBottom: "4px",
                        }}
                      >
                        ฿{formatPrice(t.grandTotal)}
                      </p>
                      {t.savings > 0 && (
                        <p
                          style={{
                            fontSize: "10px",
                            fontWeight: "600",
                            color: isBest ? "#FDE68A" : "#10b981",
                          }}
                        >
                          ประหยัด ฿{formatPrice(t.savings)} (-{t.savingsPercent.toFixed(2)}%)
                        </p>
                      )}
                      {t.hasLockedItems && (
                        <p
                          style={{
                            fontSize: "9px",
                            color: isBest ? "rgba(255,255,255,0.6)" : "#EF4444",
                            marginTop: "4px",
                          }}
                        >
                          ⚠️ บางรายการไม่รองรับ
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* ═══ Recommendation ═══ */}
          {best && best.slug !== "normal" && best.savings > 0 && (
            <div style={{ padding: "0 32px 20px" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #8B5E83 0%, #5E3A56 100%)",
                  borderRadius: "16px",
                  padding: "18px 20px",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-15px",
                    right: "-10px",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "rgba(201,168,124,0.15)",
                  }}
                />
                <p
                  style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: "300",
                    marginBottom: "6px",
                    letterSpacing: "0.1em",
                  }}
                >
                  🏆 แนะนำ
                </p>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: "4px",
                  }}
                >
                  ใช้ {best.name}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: "400",
                  }}
                >
                  จ่ายรวม ฿{formatPrice(best.grandTotal)} · ประหยัด ฿
                  {formatPrice(best.savings)} ({best.savingsPercent.toFixed(2)}%)
                </p>
              </div>
            </div>
          )}

          {/* ═══ Footer ═══ */}
          <div
            style={{
              padding: "16px 32px 20px",
              borderTop: "1px solid #E8E5E0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "10px",
                  color: "#A8A29E",
                  fontWeight: "300",
                  marginBottom: "2px",
                }}
              >
                จำลองราคาเพิ่มเติม
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "#8B5E83",
                  fontWeight: "500",
                }}
              >
                🔗 paragonpass-omega.vercel.app
              </p>
            </div>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #8B5E83, #C9A87C)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "700",
              }}
            >
              P
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
