import { db } from "@/lib/firebase";

import Products from "@/app/products/page";

import {
    doc,
    getDoc,
} from "firebase/firestore";

import {
    notFound,
} from "next/navigation";

export async function generateMetadata({
    params,
}) {
    const { district } = await params;

    const docRef = doc(
        db,
        "websites",
        "humanbiomedicalcom",
        "districts",
        district
    );

    const snap = await getDoc(docRef);

    if (!snap.exists()) {
        return {
            title: "District Not Found",
        };
    }

    const data = snap.data();

    return {
        title: `Laboratory & Hospital Equipment in ${data.district} | Human Biomedical LLP`,

        description: `Explore laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, laboratory consumables, and healthcare solutions from Human Biomedical LLP in ${data.district}, ${data.state}.`,

        keywords: [
            `medical equipment ${data.district}`,
            `hospital equipment ${data.district}`,
            `laboratory equipment ${data.district}`,
            `diagnostic equipment ${data.district}`,
            `pathology analyzers ${data.district}`,
            `medical devices ${data.district}`,
            `laboratory consumables ${data.district}`,
            "Human Biomedical LLP",
        ],

        alternates: {
            canonical: `https://humanbiomedical.com/${district}/products`,
        },

        openGraph: {
            title: `Laboratory & Hospital Equipment in ${data.district} | Human Biomedical LLP`,
            description: `Human Biomedical LLP supplies laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, and healthcare solutions in ${data.district}.`,
            url: `https://humanbiomedical.com/${district}/products`,
            siteName: "Human Biomedical LLP",
            type: "website",
        },

        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function DistrictProducts({
    params,
}) {
    const { district } = await params;

    const docRef = doc(
        db,
        "websites",
        "humanbiomedicalcom",
        "districts",
        district
    );

    const snap = await getDoc(docRef);

    if (!snap.exists()) {
        return notFound();
    }

    const data = snap.data();

    const districtData = {
        district: data.district,
        slug: data.slug,
        state: data.state,
    };

    return (
        <Products
            districtData={districtData}
        />
    );
}