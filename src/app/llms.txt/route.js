import { NextResponse } from "next/server";
import { getAllProducts, getAllCategories } from "@/lib/data/products";
import { getAllDistricts } from "@/lib/data/districts";

const DOMAIN = "https://humanbiomedical.com";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const [products, categories, districts] = await Promise.all([
      getAllProducts(),
      getAllCategories(),
      getAllDistricts(),
    ]);

    const publishedProducts = products.filter(
      (item) => item.isPublished !== false
    );

    // Categories
    const categoryText =
      categories.length > 0
        ? categories
            .map((cat) => {
              const productList = (cat.products || [])
                .map((item) => `- ${item.title}`)
                .join("\n");

              return `
## ${cat.name || cat.category || cat.id}

Category ID:
${cat.id}

Total Products:
${cat.products?.length || 0}

Products

${productList || "No Products"}
`;
            })
            .join("\n")
        : "No Categories Found";

    // Products
    const productText =
      publishedProducts.length > 0
        ? publishedProducts
            .map((product) => {
              return `
# ${product.title}

Category:
${product.category || "N/A"}

Brand:
${product.brand || "N/A"}

Model:
${product.model || "N/A"}

Description:
${product.desc || product.description || "No description available"}

Instrument:
${product.instrument || "N/A"}

Automation:
${product.automation || "N/A"}

Usage:
${product.usage || "N/A"}

Throughput:
${product.throughput || "N/A"}

Capacity:
${product.capacity || "N/A"}

Availability:
${product.availability || "N/A"}

Price:
${product.price || "Contact for Price"}

Product URL:
${DOMAIN}/products/${product.slug || product.id}
`;
            })
            .join("\n")
        : "No Products Found";

    // Districts
    const districtText =
      districts.length > 0
        ? districts
            .map((item) => `${DOMAIN}/${item.slug}`)
            .join("\n")
        : "No Districts Found";

    const content = `
## Statistics

Products:
${publishedProducts.length}

Categories:
${categories.length}

Districts:
${districts.length}

# Human Biomedical LLP

India's Trusted Biomedical & Laboratory Equipment Partner

Website

${DOMAIN}

Published Products

${publishedProducts.length}

Categories

${categories.length}

District Pages

${districts.length}

Company

Human Biomedical LLP is one of India's trusted Biomedical & Laboratory Equipment suppliers.

Services

- Laboratory Instruments Supply
- Diagnostic Analyzers
- Hospital & ICU Equipment
- Installation & Turnkey Setup
- AMC & Technical Maintenance
- Calibration & Support
- Pan-India Delivery

------------------------------------------------

## Categories

${categoryText}

------------------------------------------------

## Products

${productText}

------------------------------------------------

## District Pages

${districtText}

------------------------------------------------

Sitemap

${DOMAIN}/sitemap.xml

Robots

${DOMAIN}/robots.txt

Contact

${DOMAIN}/contact

Last Updated

${new Date().toISOString()}
`;

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (e) {
    console.error("API /llms.txt error:", e);
    return NextResponse.json(
      {
        success: false,
        error: e.message,
      },
      {
        status: 500,
      }
    );
  }
}