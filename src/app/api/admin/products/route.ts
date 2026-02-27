import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/products - List products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const where: Record<string, unknown> = {};
    if (search) {
      where.name = { contains: search };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          passPricing: {
            include: { pass: true },
            orderBy: { pass: { sortOrder: "asc" } },
          },
        },
        orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: products,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create a product with pass pricing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      categoryId,
      normalPrice,
      promoPrice,
      isActive = true,
      passPricing = [],
    } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "กรุณากรอกชื่อหัตถการ" },
        { status: 400 }
      );
    }
    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: "กรุณาเลือกหมวดหมู่" },
        { status: 400 }
      );
    }
    if (normalPrice === undefined || normalPrice < 0) {
      return NextResponse.json(
        { success: false, error: "กรุณากรอกราคาปกติ" },
        { status: 400 }
      );
    }

    // Get max sort order for the category
    const maxSort = await prisma.product.findFirst({
      where: { categoryId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        categoryId,
        normalPrice: parseFloat(normalPrice),
        promoPrice: parseFloat(promoPrice ?? normalPrice),
        sortOrder: (maxSort?.sortOrder ?? -1) + 1,
        isActive,
        passPricing: {
          create: passPricing.map(
            (pp: {
              passId: string;
              specialPrice?: number | null;
              isAccessible?: boolean;
              usesBestPrice?: boolean;
            }) => ({
              passId: pp.passId,
              specialPrice: pp.specialPrice ?? null,
              isAccessible: pp.isAccessible ?? true,
              usesBestPrice: pp.usesBestPrice ?? false,
            })
          ),
        },
      },
      include: {
        category: true,
        passPricing: { include: { pass: true } },
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/admin/products error:", error);
    if (
      error instanceof Error &&
      error.message?.includes("Unique constraint")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "มีหัตถการชื่อนี้อยู่แล้วในหมวดหมู่เดียวกัน",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
