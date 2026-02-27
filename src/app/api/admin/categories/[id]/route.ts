import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/categories/[id] - Get a single category
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          include: { passPricing: { include: { pass: true } } },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "ไม่พบหมวดหมู่" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("GET /api/admin/categories/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, sortOrder, isActive } = body;

    if (name !== undefined && !name?.trim()) {
      return NextResponse.json(
        { success: false, error: "กรุณากรอกชื่อหมวดหมู่" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) {
      updateData.name = name.trim();
      updateData.slug =
        name
          .toLowerCase()
          .replace(/[^\w\sก-๙]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim() || `category-${Date.now()}`;
    }
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error: unknown) {
    console.error("PUT /api/admin/categories/[id] error:", error);
    if (error instanceof Error && error.message?.includes("Record to update not found")) {
      return NextResponse.json(
        { success: false, error: "ไม่พบหมวดหมู่" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/categories/[id] - Delete a category
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `ไม่สามารถลบได้ หมวดหมู่นี้มี ${productCount} รายการหัตถการ กรุณาย้ายหรือลบรายการก่อน`,
        },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "ลบหมวดหมู่สำเร็จ",
    });
  } catch (error: unknown) {
    console.error("DELETE /api/admin/categories/[id] error:", error);
    if (error instanceof Error && error.message?.includes("Record to delete does not exist")) {
      return NextResponse.json(
        { success: false, error: "ไม่พบหมวดหมู่" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
