import { notFound } from "next/navigation";
import Home from "@/app/page";
import { getDistrictBySlug, getAllDistricts } from "@/lib/data/districts";
import { generateLocalBusinessSchema } from "@/lib/seo/schema";

export async function generateStaticParams() {
  const districts = await getAllDistricts();
  return districts.map((d) => ({ district: d.slug }));
}

export async function generateMetadata({ params }) {
  const { district } = await params;
  const districtData = await getDistrictBySlug(district);

  if (!districtData) {
    return { title: "District Not Found" };
  }

  const canonical = `https://humanbiomedical.com/${districtData.slug}`;

  return {
    title: `Laboratory & Hospital Equipment Supplier in ${districtData.district}, ${districtData.state} | Human Biomedical LLP`,
    description: `Human Biomedical LLP is a trusted supplier of laboratory instruments, diagnostic systems, pathology analyzers, medical devices, and hospital solutions in ${districtData.district}, ${districtData.state}.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `Laboratory & Hospital Equipment Supplier in ${districtData.district} | Human Biomedical LLP`,
      description: `Trusted supplier of diagnostic analyzers and medical equipment in ${districtData.district}, ${districtData.state}.`,
      url: canonical,
      siteName: "Human Biomedical LLP",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function DistrictHomePage({ params }) {
  const { district } = await params;
  const districtData = await getDistrictBySlug(district);

  if (!districtData) {
    return notFound();
  }

  const localBusinessSchema = generateLocalBusinessSchema(
    districtData.district,
    districtData.state
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Home districtData={districtData} />
    </>
  );
}