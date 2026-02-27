import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/pricing - Public endpoint: full pricing table for all passes
export async function GET() {
  try {
    const [passes, categories] = await Promise.all([
      prisma.pass.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
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
    ]);

    return NextResponse.json({
      success: true,
      data: { passes, categories },
    });
  } catch (error) {
    console.error("GET /api/pricing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pricing data" },
      { status: 500 }
    );
  }
}
