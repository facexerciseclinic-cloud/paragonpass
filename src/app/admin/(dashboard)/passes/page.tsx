"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/constants";

interface Pass {
  id: string;
  name: string;
  slug: string;
  upfrontFee: number;
  description: string | null;
  conditionsText: string | null;
  maxItems: number | null;
  validityDays: number | null;
  isActive: boolean;
  sortOrder: number;
  _count: { productPricing: number };
}

export default function PassesPage() {
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPass, setEditingPass] = useState<Pass | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formFee, setFormFee] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formConditions, setFormConditions] = useState("");
  const [formMaxItems, setFormMaxItems] = useState("");
  const [formValidityDays, setFormValidityDays] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchPasses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/passes");
      const data = await res.json();
      if (data.success) setPasses(data.data);
    } catch {
      console.error("Failed to fetch passes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const openEditModal = (pass: Pass) => {
    setEditingPass(pass);
    setFormName(pass.name);
    setFormFee(pass.upfrontFee.toString());
    setFormDescription(pass.description || "");
    setFormConditions(pass.conditionsText || "");
    setFormMaxItems(pass.maxItems?.toString() || "");
    setFormValidityDays(pass.validityDays?.toString() || "");
    setFormActive(pass.isActive);
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingPass) return;
    if (!formFee || parseFloat(formFee) < 0) {
      setError("กรุณากรอกค่าธรรมเนียม");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/passes/${editingPass.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          upfrontFee: parseFloat(formFee),
          description: formDescription || null,
          conditionsText: formConditions || null,
          maxItems: formMaxItems ? parseInt(formMaxItems) : null,
          validityDays: formValidityDays ? parseInt(formValidityDays) : null,
          isActive: formActive,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      setShowModal(false);
      fetchPasses();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  };

  const getPassStyle = (slug: string) => {
    switch (slug) {
      case "silver":
        return "border-[var(--neutral-200)] bg-gradient-to-br from-slate-50 to-gray-100/60";
      case "gold":
        return "border-[var(--brand-accent)]/30 bg-gradient-to-br from-amber-50/80 to-[var(--brand-blush)]";
      case "paragon":
        return "border-[var(--brand-primary)]/20 bg-gradient-to-br from-[var(--brand-blush)] to-purple-50/60";
      default:
        return "border-[var(--neutral-200)] bg-white";
    }
  };

  const getPassGradient = (slug: string) => {
    switch (slug) {
      case "silver":
        return "gradient-silver";
      case "gold":
        return "gradient-gold";
      case "paragon":
        return "gradient-paragon";
      default:
        return "gradient-brand";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--neutral-800)] mb-2">จัดการ Pass</h1>
      <p className="text-sm text-[var(--neutral-400)] mb-6 font-light">
        ปรับค่าธรรมเนียม เงื่อนไข และสถานะของแต่ละ Pass
      </p>

      {loading ? (
        <div className="text-center text-[var(--neutral-400)] py-8">กำลังโหลด...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {passes.map((pass) => (
            <div
              key={pass.id}
              className={`rounded-2xl border p-6 shadow-soft hover:shadow-md transition-shadow duration-300 ${getPassStyle(pass.slug)} ${
                !pass.isActive ? "opacity-50" : ""
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${getPassGradient(pass.slug)} flex items-center justify-center shadow-sm`}>
                  <span className="text-white text-lg font-bold">{pass.name[0]}</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[var(--neutral-800)]">
                    {pass.name}
                  </h2>
                  <p className={`text-xs font-medium ${pass.isActive ? "text-emerald-500" : "text-[var(--neutral-400)]"}`}>
                    {pass.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                  </p>
                </div>
              </div>

              {/* Fee */}
              <div className="text-center py-4 mb-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <p className="text-3xl font-bold text-[var(--neutral-800)] tabular-nums">
                  ฿{formatPrice(pass.upfrontFee)}
                </p>
                <p className="text-xs text-[var(--neutral-400)] mt-1 font-light">ค่าธรรมเนียม</p>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-[var(--neutral-600)] mb-4">
                {pass.description && <p className="font-light">{pass.description}</p>}
                {pass.conditionsText && (
                  <p className="text-xs text-[var(--neutral-500)] bg-white/40 backdrop-blur-sm p-2 rounded-xl">
                    {pass.conditionsText}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {pass.maxItems && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-white/60 rounded-lg text-xs text-[var(--neutral-500)]">
                      สูงสุด {pass.maxItems} รายการ
                    </span>
                  )}
                  {pass.validityDays && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-white/60 rounded-lg text-xs text-[var(--neutral-500)]">
                      ใช้ได้ {pass.validityDays} วัน
                    </span>
                  )}
                  <span className="inline-flex items-center px-2.5 py-1 bg-white/60 rounded-lg text-xs text-[var(--neutral-500)]">
                    {pass._count.productPricing} รายการราคา
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => openEditModal(pass)}
                className="w-full py-2.5 bg-white/80 hover:bg-white border border-[var(--neutral-200)]/60 rounded-xl text-sm font-medium text-[var(--neutral-600)] transition hover:shadow-sm"
              >
                แก้ไข
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editingPass && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 my-8 shadow-xl animate-fadeInUp">
            <h2 className="text-lg font-semibold text-[var(--neutral-800)] mb-4">
              แก้ไข {editingPass.name}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
                  ชื่อ Pass
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none text-sm bg-white/70 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
                  ค่าธรรมเนียม (THB) *
                </label>
                <input
                  type="number"
                  value={formFee}
                  onChange={(e) => setFormFee(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none text-sm bg-white/70 transition"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
                  คำอธิบาย
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none text-sm bg-white/70 transition"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
                  เงื่อนไขการใช้งาน
                </label>
                <textarea
                  value={formConditions}
                  onChange={(e) => setFormConditions(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none text-sm bg-white/70 transition"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
                    จำกัดจำนวน (Gold items)
                  </label>
                  <input
                    type="number"
                    value={formMaxItems}
                    onChange={(e) => setFormMaxItems(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none text-sm bg-white/70 transition"
                    placeholder="ไม่จำกัด"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
                    ระยะเวลาใช้ได้ (วัน)
                  </label>
                  <input
                    type="number"
                    value={formValidityDays}
                    onChange={(e) => setFormValidityDays(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--neutral-200)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] outline-none text-sm bg-white/70 transition"
                    placeholder="ต่อครั้ง"
                    min="0"
                  />
                </div>
              </div>

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
