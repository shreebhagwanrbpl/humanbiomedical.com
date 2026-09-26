import { NextResponse } from "next/server";
import { submitAdminProductQuery } from "@/lib/admin-api";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body || (!body.email && !body.phone)) {
      return NextResponse.json(
        { success: false, error: "Email or phone number is required" },
        { status: 400 }
      );
    }

    const result = await submitAdminProductQuery({
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
      productName: body.productName || body.product || "Get Quote",
      productId: body.productId || "",
      slug: body.slug || "",
      message: body.message || "",
      district: body.district || "India",
      source: body.source || "product_details_quote",
      websiteId: body.websiteId || "humanbiomedicalcom",
      companyId: body.companyId || "human",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product query received successfully",
        result,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("API /api/product-query Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to process product query",
      },
      { status: 500 }
    );
  }
}
