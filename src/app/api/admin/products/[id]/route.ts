import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/products/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        passPricing: {
          include: { pass: true },
          orderBy: { pass: { sortOrder: "asc" } },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "ไม่พบหัตถการ" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("GET /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id] - Update product and its pass pricing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, categoryId, normalPrice, promoPrice, isActive, passPricing } =
      body;

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (normalPrice !== undefined)
      updateData.normalPrice = parseFloat(normalPrice);
    if (promoPrice !== undefined)
      updateData.promoPrice = parseFloat(promoPrice);
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    // Update pass pricing if provided
    if (passPricing && Array.isArray(passPricing)) {
      // Delete existing pricing
      await prisma.productPassPricing.deleteMany({
        where: { productId: id },
      });

      // Create new pricing
      await prisma.productPassPricing.createMany({
        data: passPricing.map(
          (pp: {
            passId: string;
            specialPrice?: number | null;
            isAccessible?: boolean;
            usesBestPrice?: boolean;
          }) => ({
            productId: id,
            passId: pp.passId,
            specialPrice: pp.specialPrice ?? null,
            isAccessible: pp.isAccessible ?? true,
            usesBestPrice: pp.usesBestPrice ?? false,
          })
        ),
      });
    }

    // Return updated product with relations
    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        passPricing: {
          include: { pass: true },
          orderBy: { pass: { sortOrder: "asc" } },
        },
      },
    });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error: unknown) {
    console.error("PUT /api/admin/products/[id] error:", error);
    if (
      error instanceof Error &&
      error.message?.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { success: false, error: "ไม่พบหัตถการ" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Cascade delete will handle pass pricing
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "ลบหัตถการสำเร็จ",
    });
  } catch (error: unknown) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    if (
      error instanceof Error &&
      error.message?.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        { success: false, error: "ไม่พบหัตถการ" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
