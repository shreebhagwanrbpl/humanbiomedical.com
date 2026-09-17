import Contact from "@/app/contact/page";
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
        title: `Contact Human Biomedical LLP in ${districtData.district} | Laboratory & Hospital Equipment`,
        description: `Contact Human Biomedical LLP for laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, laboratory consumables, and healthcare solutions in ${districtData.district}, ${districtData.state}.`,
        keywords: [
            `medical equipment ${districtData.district}`,
            `hospital equipment ${districtData.district}`,
            `laboratory equipment ${districtData.district}`,
            `diagnostic equipment ${districtData.district}`,
            `Human Biomedical LLP ${districtData.district}`,
        ],
        alternates: {
            canonical: `https://humanbiomedical.com/${district}/contact`,
        },
        openGraph: {
            title: `Contact Human Biomedical LLP in ${districtData.district}`,
            description: `Get in touch with Human Biomedical LLP for laboratory and hospital equipment solutions in ${districtData.district}.`,
            url: `https://humanbiomedical.com/${district}/contact`,
            siteName: "Human Biomedical LLP",
            type: "website",
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function DistrictContact({ params }) {
    const { district } = await params;
    const districtData = await getDistrictBySlug(district);

    if (!districtData) {
        return notFound();
    }

    return <Contact districtData={districtData} />;
}