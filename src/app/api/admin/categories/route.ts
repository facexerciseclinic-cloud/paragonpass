import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");

    const where = search
      ? { name: { contains: search } }
      : {};

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: {
          _count: { select: { products: true } },
        },
        orderBy: { sortOrder: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.category.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: categories,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/admin/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, sortOrder = 0, isActive = true } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "กรุณากรอกชื่อหมวดหมู่" },
        { status: 400 }
      );
    }

    // Generate slug
    const slug =
      name
        .toLowerCase()
        .replace(/[^\w\sก-๙]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim() || `category-${Date.now()}`;

    const category = await prisma.category.create({
      data: { name: name.trim(), slug, sortOrder, isActive },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/admin/categories error:", error);
    if (
      error instanceof Error &&
      error.message?.includes("Unique constraint")
    ) {
      return NextResponse.json(
        { success: false, error: "ชื่อหมวดหมู่นี้มีอยู่แล้ว" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
