import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/passes/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pass = await prisma.pass.findUnique({
      where: { id },
      include: {
        _count: { select: { productPricing: true } },
      },
    });

    if (!pass) {
      return NextResponse.json(
        { success: false, error: "ไม่พบ Pass" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: pass });
  } catch (error) {
    console.error("GET /api/admin/passes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pass" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/passes/[id] - Update pass details (fee, conditions, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      upfrontFee,
      description,
      conditionsText,
      maxItems,
      validityDays,
      isActive,
    } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (upfrontFee !== undefined) updateData.upfrontFee = parseFloat(upfrontFee);
    if (description !== undefined) updateData.description = description;
    if (conditionsText !== undefined) updateData.conditionsText = conditionsText;
    if (maxItems !== undefined) updateData.maxItems = maxItems;
    if (validityDays !== undefined) updateData.validityDays = validityDays;
    if (isActive !== undefined) updateData.isActive = isActive;

    const pass = await prisma.pass.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: pass });
  } catch (error: unknown) {
    console.error("PUT /api/admin/passes/[id] error:", error);
    if (
      error instanceof Error &&
      error.message?.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { success: false, error: "ไม่พบ Pass" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update pass" },
      { status: 500 }
    );
  }
}
