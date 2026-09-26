import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/data/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const products = await getAllProducts();

    return NextResponse.json(
      {
        success: true,
        companyId: "human",
        websiteId: "humanbiomedicalcom",
        count: products.length,
        products: products,
        data: products,
        timestamp: Date.now(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
          "Surrogate-Control": "no-store",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (err) {
    console.error("API /api/catalog Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to fetch master catalog",
        products: [],
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
