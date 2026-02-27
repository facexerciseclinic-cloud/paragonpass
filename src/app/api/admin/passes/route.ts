import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/passes - List all passes
export async function GET() {
  try {
    const passes = await prisma.pass.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { productPricing: true } },
      },
    });

    return NextResponse.json({ success: true, data: passes });
  } catch (error) {
    console.error("GET /api/admin/passes error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch passes" },
      { status: 500 }
    );
  }
}
