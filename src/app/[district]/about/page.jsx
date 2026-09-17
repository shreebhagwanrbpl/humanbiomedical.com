import AboutPage from "@/app/about/page";
import { getDistrictBySlug } from "@/lib/data/districts";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
    const { district } = await params;
    const districtData = await getDistrictBySlug(district);

    if (!districtData) {
        return {
            title: "District Not Found",
        };
    }

    return {
        title: `Laboratory & Hospital Equipment Supplier in ${districtData.district} | Human Biomedical LLP`,
        description: `Human Biomedical LLP supplies laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, laboratory consumables, and healthcare solutions in ${districtData.district}, ${districtData.state}.`,
    };
}

export default async function About({ params }) {
    const { district } = await params;
    const districtData = await getDistrictBySlug(district);

    if (!districtData) {
        return notFound();
    }

    return <AboutPage districtData={districtData} />;
}