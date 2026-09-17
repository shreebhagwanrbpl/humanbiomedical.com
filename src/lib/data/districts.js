const PROJECT_ID = "rajbiosis-central";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

let districtCache = null;
let districtCacheTime = 0;
let activeDistrictsPromise = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

function parseFirestoreFields(fields) {
  const obj = {};
  if (!fields) return obj;
  for (const [key, value] of Object.entries(fields)) {
    if ("stringValue" in value) {
      obj[key] = value.stringValue;
    } else if ("booleanValue" in value) {
      obj[key] = value.booleanValue;
    } else if ("integerValue" in value) {
      obj[key] = parseInt(value.integerValue, 10);
    } else if ("doubleValue" in value) {
      obj[key] = parseFloat(value.doubleValue);
    } else if ("arrayValue" in value) {
      const values = value.arrayValue.values || [];
      obj[key] = values.map((val) => {
        if ("stringValue" in val) return val.stringValue;
        if ("mapValue" in val) return parseFirestoreFields(val.mapValue.fields);
        return val;
      });
    } else if ("mapValue" in value) {
      obj[key] = parseFirestoreFields(value.mapValue.fields);
    }
  }
  return obj;
}

export async function getAllDistricts() {
  const now = Date.now();
  if (districtCache && now - districtCacheTime < CACHE_TTL) {
    return districtCache;
  }

  if (activeDistrictsPromise) {
    return activeDistrictsPromise;
  }

  activeDistrictsPromise = (async () => {
    try {
      let pageToken = "";
      let allDocs = [];

      do {
        const queryUrl = `${BASE_URL}/websites/humanbiomedicalcom/districts?pageSize=300${
          pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""
        }`;

        const res = await fetch(queryUrl, {
          next: { revalidate: 86400 },
        });

        if (res.status !== 200) {
          console.warn(`Firestore districts fetch returned status: ${res.status}`);
          break;
        }

        const data = await res.json();
        if (data.documents && Array.isArray(data.documents)) {
          allDocs.push(...data.documents);
        }

        pageToken = data.nextPageToken || "";
      } while (pageToken);

      if (allDocs.length > 0) {
        const districts = allDocs.map((docItem) => {
          const id = docItem.name.split("/").pop();
          const parsed = parseFirestoreFields(docItem.fields);
          return {
            id,
            slug: (parsed.slug || id).toLowerCase(),
            district: parsed.district || id,
            state: parsed.state || "India",
          };
        });

        districtCache = districts;
        districtCacheTime = Date.now();
        return districts;
      }
    } catch (error) {
      console.error("Error fetching districts from Firestore REST:", error.message);
    } finally {
      activeDistrictsPromise = null;
    }

    if (districtCache) return districtCache;
    return [];
  })();

  return activeDistrictsPromise;
}

export async function getDistrictBySlug(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).toLowerCase();

  // 1. Check in cache if available
  if (districtCache && districtCache.length > 0) {
    const found = districtCache.find((d) => d.slug === decoded || d.id.toLowerCase() === decoded);
    if (found) return found;
  }

  // 2. Fetch single document directly via REST API
  try {
    const res = await fetch(`${BASE_URL}/websites/humanbiomedicalcom/districts/${encodeURIComponent(decoded)}`, {
      next: { revalidate: 86400 },
    });

    if (res.status === 200) {
      const docItem = await res.json();
      const id = docItem.name.split("/").pop();
      const parsed = parseFirestoreFields(docItem.fields);
      return {
        id,
        slug: (parsed.slug || id).toLowerCase(),
        district: parsed.district || id,
        state: parsed.state || "India",
      };
    }
  } catch (err) {
    console.error(`Error fetching district ${slug} from REST API:`, err.message);
  }

  // 3. Fallback: generate formatted district data from slug
  const formattedDistrict = decoded
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    id: decoded,
    slug: decoded,
    district: formattedDistrict,
    state: "India",
  };
}
