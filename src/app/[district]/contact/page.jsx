import { db } from "@/lib/firebase";

import Contact from "@/app/contact/page";

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
        title: `Contact Human Biomedical LLP in ${data.district} | Laboratory & Hospital Equipment`,

        description: `Contact Human Biomedical LLP for laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, laboratory consumables, and healthcare solutions in ${data.district}, ${data.state}.`,

        keywords: [
            `medical equipment ${data.district}`,
            `hospital equipment ${data.district}`,
            `laboratory equipment ${data.district}`,
            `diagnostic equipment ${data.district}`,
            `Human Biomedical LLP ${data.district}`,
        ],

        alternates: {
            canonical: `https://humanbiomedical.com/${district}/contact`,
        },

        openGraph: {
            title: `Contact Human Biomedical LLP in ${data.district}`,
            description: `Get in touch with Human Biomedical LLP for laboratory and hospital equipment solutions in ${data.district}.`,
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

export default async function DistrictContact({
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
        <Contact
            districtData={districtData}
        />
    );
}