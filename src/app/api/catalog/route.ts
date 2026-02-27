import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/catalog - Public endpoint: full catalog for customer frontend
export async function GET() {
  try {
    const [categories, passes] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        include: {
          products: {
            where: { isActive: true },
            include: {
              passPricing: {
                include: { pass: true },
                orderBy: { pass: { sortOrder: "asc" } },
              },
            },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.pass.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: { categories, passes },
    });
  } catch (error) {
    console.error("GET /api/catalog error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch catalog" },
      { status: 500 }
    );
  }
}
