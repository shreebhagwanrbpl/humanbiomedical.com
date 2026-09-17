import Services from "@/app/services/page";
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
        title: `Laboratory & Hospital Equipment Services in ${districtData.district} | Human Biomedical LLP`,
        description: `Human Biomedical LLP provides laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, laboratory consumables, and healthcare solutions in ${districtData.district}, ${districtData.state}.`,
        keywords: [
            `medical equipment services ${districtData.district}`,
            `hospital equipment ${districtData.district}`,
            `laboratory equipment ${districtData.district}`,
            `diagnostic equipment ${districtData.district}`,
            `medical devices ${districtData.district}`,
            `healthcare equipment ${districtData.district}`,
            `pathology analyzers ${districtData.district}`,
            `laboratory consumables ${districtData.district}`,
            "Human Biomedical LLP",
        ],
        alternates: {
            canonical: `https://humanbiomedical.com/${district}/services`,
        },
        openGraph: {
            title: `Laboratory & Hospital Equipment Services in ${districtData.district} | Human Biomedical LLP`,
            description: `Trusted supplier of laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, laboratory consumables, and healthcare solutions in ${districtData.district}.`,
            url: `https://humanbiomedical.com/${district}/services`,
            siteName: "Human Biomedical LLP",
            type: "website",
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function DistrictServices({ params }) {
    const { district } = await params;
    const districtData = await getDistrictBySlug(district);

    if (!districtData) {
        return notFound();
    }

    return <Services districtData={districtData} />;
}