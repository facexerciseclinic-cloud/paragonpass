"use client";

import { useState, useEffect, useCallback } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  _count: { products: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [formActive, setFormActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/categories?search=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      if (data.success) {
        setCategories(data.data.items);
      }
    } catch {
      console.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSortOrder(categories.length);
    setFormActive(true);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSortOrder(cat.sortOrder);
    setFormActive(cat.isActive);
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      setError("กรุณากรอกชื่อหมวดหมู่");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          sortOrder: formSortOrder,
          isActive: formActive,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      setShowModal(false);
      fetchCategories();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (
      !confirm(
        `ต้องการลบหมวดหมู่ "${cat.name}" หรือไม่?\n\nหมวดนี้มี ${cat._count.products} หัตถการ`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "ไม่สามารถลบได้");
        return;
      }
      fetchCategories();
    } catch {
      alert("เกิดข้อผิดพลาด");
    }
  };

  const toggleActive = async (cat: Category) => {
    try {
      await fetch(`/api/admin/categories/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !cat.isActive }),
      });
      fetchCategories();
    } catch {
      console.error("Toggle failed");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-[var(--neutral-800)]">จัดการหมวดหมู่</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 gradient-brand text-white rounded-xl hover:shadow-brand transition-all duration-300 font-medium text-sm shadow-sm"
        >
          + เพิ่มหมวดหมู่
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="ค้นหาหมวดหมู่..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none text-sm bg-white/70 transition"
        />
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[var(--neutral-200)]/60 overflow-hidden shadow-soft">
        {loading ? (
          <div className="p-8 text-center text-[var(--neutral-400)]">กำลังโหลด...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-[var(--neutral-400)]">
            ไม่พบหมวดหมู่
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--brand-blush)]/50 border-b border-[var(--neutral-200)]/60">
                <th className="text-left px-6 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                  ลำดับ
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                  ชื่อหมวดหมู่
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                  จำนวนหัตถการ
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--neutral-200)]/40">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[var(--brand-blush)]/30 transition-colors">
                  <td className="px-6 py-3 text-sm text-[var(--neutral-400)] tabular-nums">
                    {cat.sortOrder}
                  </td>
                  <td className="px-6 py-3 text-sm text-[var(--neutral-700)] font-medium">
                    {cat.name}
                  </td>
                  <td className="px-6 py-3 text-sm text-[var(--neutral-500)] text-center tabular-nums">
                    {cat._count.products}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => toggleActive(cat)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                        cat.isActive
                          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          : "bg-[var(--neutral-100)] text-[var(--neutral-400)] hover:bg-[var(--neutral-200)]"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          cat.isActive ? "bg-emerald-500" : "bg-[var(--neutral-400)]"
                        }`}
                      />
                      {cat.isActive ? "เปิด" : "ปิด"}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="text-sm text-[var(--brand-primary)] hover:underline font-medium"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="text-sm text-rose-400 hover:text-rose-600 hover:underline"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-fadeInUp">
            <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-4">
              {editingCategory ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
                  ชื่อหมวดหมู่ *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none text-sm bg-white/70 transition"
                  placeholder="เช่น Drip ผิว, Botox"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
                  ลำดับการแสดง
                </label>
                <input
                  type="number"
                  value={formSortOrder}
                  onChange={(e) => setFormSortOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none text-sm bg-white/70 transition"
                />
              </div>

              <div className="flex items-center gap-2">
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
