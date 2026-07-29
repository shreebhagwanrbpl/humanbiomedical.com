import { db } from "@/lib/firebase";

import AboutPage from "@/app/about/page";

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

    const districtData = snap.data();

    return {
        title: `Laboratory & Hospital Equipment Supplier in ${districtData.district} | Human Biomedical LLP`,

        description: `Human Biomedical LLP supplies laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, laboratory consumables, and healthcare solutions in ${districtData.district}, ${districtData.state}.`,
    };
}

export default async function About({
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

    const districtData = snap.data();

    return (
        <AboutPage
            districtData={districtData}
        />
    );
}