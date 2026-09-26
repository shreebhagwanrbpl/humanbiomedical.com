import { NextResponse } from "next/server";
import { fetchAdminSiteData } from "@/lib/admin-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "home";
    const page = searchParams.get("page") || "";
    const district = searchParams.get("district") || "";
    const companyId = searchParams.get("companyId") || "human";
    const websiteId = searchParams.get("websiteId") || "humanbiomedicalcom";

    const data = await fetchAdminSiteData({
      type,
      companyId,
      websiteId,
      page,
      district,
    });

    return NextResponse.json(
      {
        success: true,
        type,
        companyId,
        websiteId,
        data,
        ...(type === "districts"
          ? {
              districts: Array.isArray(data)
                ? data
                : Array.isArray(data?.districts)
                ? data.districts
                : [],
            }
          : {}),
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
    console.error("API /api/site-data Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to fetch site data",
        data: null,
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
