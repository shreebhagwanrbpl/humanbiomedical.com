import { NextResponse } from "next/server";
import { submitAdminContactQuery } from "@/lib/admin-api";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body || (!body.name && !body.email && !body.phone)) {
      return NextResponse.json(
        { success: false, error: "Name, email or phone is required" },
        { status: 400 }
      );
    }

    const result = await submitAdminContactQuery({
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
      company: body.company || "",
      message: body.message || "",
      district: body.district || "India",
      source: body.source || "contact_form",
      websiteId: body.websiteId || "humanbiomedicalcom",
      companyId: body.companyId || "human",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact query received successfully",
        result,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("API /api/contact-query Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to process contact query",
      },
      { status: 500 }
    );
  }
}
