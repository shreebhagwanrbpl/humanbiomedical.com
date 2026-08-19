import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

let districtCache = null;
let districtCacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

export async function getAllDistricts() {
  const now = Date.now();
  if (districtCache && now - districtCacheTime < CACHE_TTL) {
    return districtCache;
  }

  try {
    const districtSnapshot = await getDocs(
      collection(db, "websites", "humanbiomedicalcom", "districts")
    );

    const districts = districtSnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        slug: docSnap.id.toLowerCase(),
        district: data.district || docSnap.id,
        state: data.state || "India",
      };
    });

    districtCache = districts;
    districtCacheTime = now;
    return districts;
  } catch (error) {
    console.error("Error fetching districts:", error);
    if (districtCache) return districtCache;
    return [];
  }
}

export async function getDistrictBySlug(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).toLowerCase();
  try {
    const docRef = doc(db, "websites", "humanbiomedicalcom", "districts", decoded);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: snap.id,
        slug: snap.id,
        district: data.district || snap.id,
        state: data.state || "India",
      };
    }
  } catch (err) {
    console.error(`Error fetching district ${slug}:`, err);
  }
  return null;
}
