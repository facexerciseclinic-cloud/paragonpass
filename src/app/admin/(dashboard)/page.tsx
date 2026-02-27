import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalCategories, totalProducts, activeProducts, passes, categoryCounts] =
    await Promise.all([
      prisma.category.count(),
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.pass.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
          _count: { select: { productPricing: true } },
        },
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { products: true } },
        },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--neutral-800)] mb-6">แดชบอร์ด</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="หมวดหมู่ทั้งหมด"
          value={totalCategories}
          icon={
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          }
          color="brand"
        />
        <StatCard
          label="หัตถการทั้งหมด"
          value={totalProducts}
          icon={
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          }
          color="accent"
        />
        <StatCard
          label="เปิดใช้งาน"
          value={activeProducts}
          icon={
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="emerald"
        />
        <StatCard
          label="ปิดใช้งาน"
          value={totalProducts - activeProducts}
          icon={
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="neutral"
        />
      </div>

      {/* Pass Cards */}
      <h2 className="text-lg font-semibold text-[var(--neutral-700)] mb-4">ข้อมูล Pass</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {passes.map((pass) => (
          <div
            key={pass.id}
            className={`p-5 rounded-2xl border ${
              pass.slug === "silver"
                ? "border-[var(--neutral-200)] bg-gradient-to-br from-slate-50 to-gray-100/60"
                : pass.slug === "gold"
                ? "border-[var(--brand-accent)]/30 bg-gradient-to-br from-amber-50/80 to-[var(--brand-blush)]"
                : "border-[var(--brand-primary)]/20 bg-gradient-to-br from-[var(--brand-blush)] to-purple-50/60"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[var(--neutral-800)]">{pass.name}</h3>
              <span className="text-lg font-bold text-[var(--neutral-700)] tabular-nums">
                ฿{formatPrice(pass.upfrontFee)}
              </span>
            </div>
            <p className="text-sm text-[var(--neutral-400)] mb-3 font-light">{pass.conditionsText}</p>
            <div className="flex items-center justify-between text-xs text-[var(--neutral-400)]">
              <span>{pass._count.productPricing} รายการราคา</span>
              <Link
                href={`/admin/passes`}
                className="text-[var(--brand-primary)] hover:underline font-medium"
              >
                แก้ไข →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <h2 className="text-lg font-semibold text-[var(--neutral-700)] mb-4">
        จำนวนหัตถการต่อหมวดหมู่
      </h2>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[var(--neutral-200)]/60 overflow-hidden shadow-soft">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--brand-blush)]/50 border-b border-[var(--neutral-200)]/60">
              <th className="text-left px-6 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                หมวดหมู่
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                จำนวน
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--neutral-200)]/40">
            {categoryCounts.map((cat) => (
              <tr key={cat.id} className="hover:bg-[var(--brand-blush)]/30 transition-colors">
                <td className="px-6 py-3 text-sm text-[var(--neutral-700)] font-medium">
                  {cat.name}
                </td>
                <td className="px-6 py-3 text-sm text-[var(--neutral-500)] text-right tabular-nums">
                  {cat._count.products} รายการ
                </td>
                <td className="px-6 py-3 text-right">
                  <Link
                    href={`/admin/products?categoryId=${cat.id}`}
                    className="text-sm text-[var(--brand-primary)] hover:underline font-medium"
                  >
                    ดูรายการ →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    brand: "from-[var(--brand-primary)] to-[var(--brand-accent-rose)]",
    accent: "from-[var(--brand-accent)] to-amber-400",
    emerald: "from-emerald-500 to-emerald-400",
    neutral: "from-[var(--neutral-400)] to-[var(--neutral-300)]",
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[var(--neutral-200)]/60 p-5 shadow-soft hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-sm`}
        >
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--neutral-800)] tabular-nums">{value}</p>
          <p className="text-xs text-[var(--neutral-400)] font-light">{label}</p>
        </div>
      </div>
    </div>
  );
}
