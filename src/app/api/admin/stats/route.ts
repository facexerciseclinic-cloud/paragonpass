import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/stats - Dashboard statistics
export async function GET() {
  try {
    const [
      totalCategories,
      totalProducts,
      activeProducts,
      totalPasses,
      passList,
    ] = await Promise.all([
      prisma.category.count(),
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.pass.count(),
      prisma.pass.findMany({
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          upfrontFee: true,
          _count: { select: { productPricing: true } },
        },
      }),
    ]);

    // Products per category
    const categoryCounts = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalCategories,
        totalProducts,
        activeProducts,
        inactiveProducts: totalProducts - activeProducts,
        totalPasses,
        passes: passList,
        categoryCounts,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
