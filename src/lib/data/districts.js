import {
  fetchAdminDistricts,
  fetchAdminDistrict,
} from "@/lib/admin-api";

let districtCache = null;
let districtCacheTime = 0;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function getAllDistricts() {
  const now = Date.now();
  if (districtCache && now - districtCacheTime < CACHE_TTL) {
    return districtCache;
  }

  try {
    const rawDistricts = await fetchAdminDistricts({
      companyId: "human",
      websiteId: "humanbiomedicalcom",
    });

    if (Array.isArray(rawDistricts) && rawDistricts.length > 0) {
      const districts = rawDistricts.map((item) => {
        const id = item.id || item.slug || "";
        const slug = (item.slug || id).toLowerCase().trim();
        const districtName =
          item.district ||
          item.name ||
          slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        return {
          id: id || slug,
          slug,
          district: districtName,
          state: item.state || "India",
          nearby: item.nearby || [],
          description: item.description || "",
        };
      });

      districtCache = districts;
      districtCacheTime = now;
      return districts;
    }
  } catch (error) {
    console.error("Error fetching districts from SuperAdmin MongoDB API:", error.message);
  }

  if (districtCache) return districtCache;
  return [];
}

export async function getDistrictBySlug(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).toLowerCase().trim();

  // 1. Check in loaded districts
  const districts = await getAllDistricts();
  if (Array.isArray(districts) && districts.length > 0) {
    const found = districts.find(
      (d) => d.slug === decoded || String(d.id).toLowerCase() === decoded
    );
    if (found) return found;
  }

  // 2. Fetch directly from Admin API
  try {
    const directData = await fetchAdminDistrict({
      district: decoded,
      companyId: "human",
      websiteId: "humanbiomedicalcom",
    });

    if (directData && (directData.district || directData.slug || directData.name)) {
      const id = directData.id || directData.slug || decoded;
      return {
        id,
        slug: (directData.slug || id).toLowerCase(),
        district:
          directData.district ||
          directData.name ||
          decoded.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        state: directData.state || "India",
        nearby: directData.nearby || [],
        description: directData.description || "",
      };
    }
  } catch (err) {
    console.error(`Error fetching district ${slug} from Admin API:`, err.message);
  }

  // 3. Fallback: format name from slug so district pages continue to work
  const formattedDistrict = decoded
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    id: decoded,
    slug: decoded,
    district: formattedDistrict,
    state: "India",
    nearby: [],
    description: "",
  };
}
