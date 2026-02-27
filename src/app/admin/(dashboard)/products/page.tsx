"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { formatPrice } from "@/lib/constants";

interface Pass {
  id: string;
  name: string;
  slug: string;
  upfrontFee: number;
  sortOrder: number;
}

interface PassPricing {
  id: string;
  passId: string;
  specialPrice: number | null;
  isAccessible: boolean;
  usesBestPrice: boolean;
  pass: Pass;
}

interface Product {
  id: string;
  name: string;
  categoryId: string;
  normalPrice: number;
  promoPrice: number;
  sortOrder: number;
  isActive: boolean;
  category: { id: string; name: string };
  passPricing: PassPricing[];
}

interface Category {
  id: string;
  name: string;
}

interface PassPricingForm {
  passId: string;
  passSlug: string;
  passName: string;
  accessType: "price" | "locked" | "best";
  specialPrice: string;
}

export default function ProductsPage() {
  return (
    <React.Suspense
      fallback={<div className="p-8 text-[var(--neutral-400)]">กำลังโหลด...</div>}
    >
      <ProductsContent />
    </React.Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategoryId = searchParams.get("categoryId") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState(initialCategoryId);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formNormalPrice, setFormNormalPrice] = useState("");
  const [formPromoPrice, setFormPromoPrice] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formPassPricing, setFormPassPricing] = useState<PassPricingForm[]>([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch categories and passes on mount
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, passRes] = await Promise.all([
          fetch("/api/admin/categories?pageSize=100"),
          fetch("/api/admin/passes"),
        ]);
        const catData = await catRes.json();
        const passData = await passRes.json();
        if (catData.success) setCategories(catData.data.items);
        if (passData.success) setPasses(passData.data);
      } catch {
        console.error("Failed to fetch metadata");
      }
    };
    fetchMeta();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterCategory) params.set("categoryId", filterCategory);
      params.set("page", page.toString());
      params.set("pageSize", "20");

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.items);
        setTotalPages(data.data.totalPages);
        setTotal(data.data.total);
      }
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [search, filterCategory, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Initialize pass pricing form
  const initPassPricingForm = (
    existingPricing?: PassPricing[]
  ): PassPricingForm[] => {
    return passes.map((pass) => {
      const existing = existingPricing?.find((pp) => pp.passId === pass.id);
      if (existing) {
        let accessType: "price" | "locked" | "best" = "best";
        let specialPrice = "";
        if (!existing.isAccessible) {
          accessType = "locked";
        } else if (existing.usesBestPrice) {
          accessType = "best";
        } else if (existing.specialPrice !== null) {
          accessType = "price";
          specialPrice = existing.specialPrice.toString();
        }
        return {
          passId: pass.id,
          passSlug: pass.slug,
          passName: pass.name,
          accessType,
          specialPrice,
        };
      }
      return {
        passId: pass.id,
        passSlug: pass.slug,
        passName: pass.name,
        accessType: "best",
        specialPrice: "",
      };
    });
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory(filterCategory || (categories[0]?.id ?? ""));
    setFormNormalPrice("");
    setFormPromoPrice("");
    setFormActive(true);
    setFormPassPricing(initPassPricingForm());
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.categoryId);
    setFormNormalPrice(product.normalPrice.toString());
    setFormPromoPrice(product.promoPrice.toString());
    setFormActive(product.isActive);
    setFormPassPricing(initPassPricingForm(product.passPricing));
    setFormError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      setFormError("กรุณากรอกชื่อหัตถการ");
      return;
    }
    if (!formCategory) {
      setFormError("กรุณาเลือกหมวดหมู่");
      return;
    }
    if (!formNormalPrice || parseFloat(formNormalPrice) < 0) {
      setFormError("กรุณากรอกราคาปกติ");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const passPricingPayload = formPassPricing.map((pp) => ({
        passId: pp.passId,
        isAccessible: pp.accessType !== "locked",
        usesBestPrice: pp.accessType === "best",
        specialPrice:
          pp.accessType === "price" && pp.specialPrice
            ? parseFloat(pp.specialPrice)
            : null,
      }));

      const body = {
        name: formName.trim(),
        categoryId: formCategory,
        normalPrice: parseFloat(formNormalPrice),
        promoPrice: parseFloat(formPromoPrice || formNormalPrice),
        isActive: formActive,
        passPricing: passPricingPayload,
      };

      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!data.success) {
        setFormError(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      setShowModal(false);
      fetchProducts();
    } catch {
      setFormError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`ต้องการลบ "${product.name}" หรือไม่?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "ไม่สามารถลบได้");
        return;
      }
      fetchProducts();
    } catch {
      alert("เกิดข้อผิดพลาด");
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      fetchProducts();
    } catch {
      console.error("Toggle failed");
    }
  };

  /** Get display text for pass pricing */
  const getPricingDisplay = (product: Product, passSlug: string) => {
    const pp = product.passPricing.find((p) => p.pass.slug === passSlug);
    if (!pp) return <span className="text-[var(--neutral-300)]">—</span>;
    if (!pp.isAccessible)
      return <span className="text-rose-400 font-medium">🔒 ไม่เปิด</span>;
    if (pp.usesBestPrice)
      return <span className="text-[var(--brand-primary)] font-medium">/ ราคาดีสุด</span>;
    if (pp.specialPrice !== null)
      return (
        <span className="text-emerald-600 font-medium">
          ฿{formatPrice(pp.specialPrice)}
        </span>
      );
    return <span className="text-[var(--neutral-300)]">—</span>;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--neutral-800)]">จัดการหัตถการ</h1>
          <p className="text-sm text-[var(--neutral-400)] mt-1 font-light">
            ทั้งหมด {total} รายการ
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 gradient-brand text-white rounded-xl hover:shadow-brand transition-all duration-300 font-medium text-sm shadow-sm"
        >
          + เพิ่มหัตถการ
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="ค้นหาชื่อหัตถการ..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 max-w-md px-4 py-2 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none text-sm bg-white/70 transition"
        />
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setPage(1);
            // Update URL without full reload
            const params = new URLSearchParams();
            if (e.target.value) params.set("categoryId", e.target.value);
            router.push(`/admin/products?${params.toString()}`);
          }}
          className="px-4 py-2 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none text-sm bg-white/70 transition"
        >
          <option value="">ทุกหมวดหมู่</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[var(--neutral-200)]/60 overflow-x-auto shadow-soft">
        {loading ? (
          <div className="p-8 text-center text-[var(--neutral-400)]">กำลังโหลด...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-[var(--neutral-400)]">ไม่พบหัตถการ</div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-[var(--brand-blush)]/50 border-b border-[var(--neutral-200)]/60">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                  ชื่อหัตถการ
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                  หมวดหมู่
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                  ราคาปกติ
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                  โปรโมชั่น
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider bg-slate-50/40">
                  Silver
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider bg-amber-50/40">
                  Gold
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider bg-[var(--brand-blush)]/40">
                  Paragon
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--neutral-200)]/40">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`hover:bg-[var(--brand-blush)]/30 transition-colors ${
                    !product.isActive ? "opacity-50" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-[var(--neutral-700)] font-medium max-w-[200px] truncate">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--neutral-500)]">
                    {product.category.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--neutral-700)] text-right tabular-nums">
                    ฿{formatPrice(product.normalPrice)}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--neutral-500)] text-right tabular-nums">
                    ฿{formatPrice(product.promoPrice)}
                  </td>
                  <td className="px-4 py-3 text-sm text-center bg-slate-50/30">
                    {getPricingDisplay(product, "silver")}
                  </td>
                  <td className="px-4 py-3 text-sm text-center bg-amber-50/30">
                    {getPricingDisplay(product, "gold")}
                  </td>
                  <td className="px-4 py-3 text-sm text-center bg-[var(--brand-blush)]/30">
                    {getPricingDisplay(product, "paragon")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(product)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition ${
                        product.isActive
                          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          : "bg-[var(--neutral-100)] text-[var(--neutral-400)] hover:bg-[var(--neutral-200)]"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          product.isActive ? "bg-emerald-500" : "bg-[var(--neutral-400)]"
                        }`}
                      />
                      {product.isActive ? "เปิด" : "ปิด"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-xs text-[var(--brand-primary)] hover:underline font-medium"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="text-xs text-rose-400 hover:text-rose-600 hover:underline"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 border border-[var(--neutral-200)] rounded-xl text-sm disabled:opacity-30 hover:bg-[var(--brand-blush)] transition"
          >
            ← ก่อนหน้า
          </button>
          <span className="text-sm text-[var(--neutral-500)] tabular-nums">
            หน้า {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 border border-[var(--neutral-200)] rounded-xl text-sm disabled:opacity-30 hover:bg-[var(--brand-blush)] transition"
          >
            ถัดไป →
          </button>
        </div>
      )}

      {/* Product Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8 shadow-xl animate-fadeInUp">
            <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-4">
              {editingProduct ? "แก้ไขหัตถการ" : "เพิ่มหัตถการใหม่"}
            </h2>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1">
                    ชื่อหัตถการ *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none text-sm"
                    placeholder="เช่น Hutox 100 U"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1">
                    หมวดหมู่ *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none text-sm bg-white"
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1">
                    ราคาปกติ (Normal) *
                  </label>
                  <input
                    type="number"
                    value={formNormalPrice}
                    onChange={(e) => setFormNormalPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none text-sm"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1">
                    ราคาโปรโมชั่น (Promo)
                  </label>
                  <input
                    type="number"
                    value={formPromoPrice}
                    onChange={(e) => setFormPromoPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none text-sm"
                    placeholder="เท่ากับราคาปกติ"
                    min="0"
                  />
                </div>
              </div>

              {/* Pass Pricing Section */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-[var(--neutral-600)] mb-3">
                  ราคาตาม Pass
                </h3>
                <div className="space-y-3">
                  {formPassPricing.map((pp, idx) => (
                    <div
                      key={pp.passId}
                      className={`p-3 rounded-xl border ${
                        pp.passSlug === "silver"
                          ? "border-[var(--neutral-200)] bg-slate-50/50"
                          : pp.passSlug === "gold"
                          ? "border-[var(--brand-accent)]/20 bg-amber-50/50"
                          : "border-[var(--brand-primary)]/20 bg-[var(--brand-blush)]"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-medium text-[var(--neutral-600)] min-w-[100px]">
                          {pp.passName}
                        </span>

                        {/* Access type radio buttons */}
                        <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                          <input
                            type="radio"
                            name={`access-${pp.passId}`}
                            checked={pp.accessType === "best"}
                            onChange={() => {
                              const updated = [...formPassPricing];
                              updated[idx] = { ...pp, accessType: "best" };
                              setFormPassPricing(updated);
                            }}
                            className="accent-[var(--brand-primary)]"
                          />
                          <span>/ ราคาดีสุด</span>
                        </label>

                        <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                          <input
                            type="radio"
                            name={`access-${pp.passId}`}
                            checked={pp.accessType === "price"}
                            onChange={() => {
                              const updated = [...formPassPricing];
                              updated[idx] = { ...pp, accessType: "price" };
                              setFormPassPricing(updated);
                            }}
                            className="accent-[var(--brand-primary)]"
                          />
                          <span>ราคาเฉพาะ</span>
                        </label>

                        <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                          <input
                            type="radio"
                            name={`access-${pp.passId}`}
                            checked={pp.accessType === "locked"}
                            onChange={() => {
                              const updated = [...formPassPricing];
                              updated[idx] = { ...pp, accessType: "locked" };
                              setFormPassPricing(updated);
                            }}
                            className="accent-[var(--brand-primary)]"
                          />
                          <span>🔒 ไม่เปิดให้</span>
                        </label>

                        {pp.accessType === "price" && (
                          <input
                            type="number"
                            value={pp.specialPrice}
                            onChange={(e) => {
                              const updated = [...formPassPricing];
                              updated[idx] = {
                                ...pp,
                                specialPrice: e.target.value,
                              };
                              setFormPassPricing(updated);
                            }}
                            className="w-28 px-2 py-1 border border-[var(--neutral-200)] rounded text-sm"
                            placeholder="ราคา"
                            min="0"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFormActive(!formActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formActive ? "bg-[var(--brand-primary)]" : "bg-[var(--neutral-300)]"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                      formActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-[var(--neutral-600)]">
                  {formActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-[var(--neutral-200)] text-[var(--neutral-600)] rounded-xl hover:bg-[var(--brand-blush)] transition text-sm font-medium"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 gradient-brand text-white rounded-xl shadow-brand hover:shadow-lg transition-all duration-300 text-sm font-medium disabled:opacity-50"
              >
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
