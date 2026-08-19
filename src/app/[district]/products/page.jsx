import { notFound } from "next/navigation";
import ProductsPage from "@/app/products/page";
import { getDistrictBySlug, getAllDistricts } from "@/lib/data/districts";

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

  const canonical = `https://humanbiomedical.com/${districtData.slug}/products`;

  return {
    title: `Laboratory & Hospital Equipment Products in ${districtData.district} | Human Biomedical LLP`,
    description: `Explore laboratory instruments, diagnostic analyzers, hospital equipment, pathology reagents, and healthcare solutions in ${districtData.district}, ${districtData.state}.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `Laboratory & Hospital Equipment in ${districtData.district} | Human Biomedical LLP`,
      description: `Human Biomedical LLP supplies laboratory instruments, diagnostic systems, pathology analyzers, and healthcare solutions in ${districtData.district}.`,
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

export default async function DistrictProducts({ params }) {
  const { district } = await params;
  const districtData = await getDistrictBySlug(district);

  if (!districtData) {
    return notFound();
  }

  return <ProductsPage districtData={districtData} />;
}