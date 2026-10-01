/**
 * Human Biomedical website -> SuperAdmin MongoDB API client.
 *
 * The website never connects to MongoDB directly. All reads/writes go through
 * the existing SuperAdmin API so MongoDB credentials remain on the Admin VPS.
 */

export const DEFAULT_COMPANY_ID = "human";
export const DEFAULT_WEBSITE_ID = "humanbiomedicalcom";
export const DEFAULT_ADMIN_API_BASE_URL = "https://admin.rajbiosis.app";

export function getAdminApiBaseUrl() {
  const url =
    process.env.ADMIN_API_BASE_URL ||
    process.env.ADMIN_API_URL ||
    DEFAULT_ADMIN_API_BASE_URL;

  return url.replace(/\/+$/, "");
}

export function normalizeWebsiteId(str = "") {
  if (!str || typeof str !== "string") return DEFAULT_WEBSITE_ID;
  return str
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-z0-9]/g, "");
}

function noCacheFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      Pragma: "no-cache",
      ...(options.headers || {}),
    },
  });
}

async function readJson(url, options) {
  const response = await noCacheFetch(url, options);
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  if (!response.ok) {
    console.error(`[admin-api] ${response.status} from ${url}`, body);
    return null;
  }
  return body;
}

/**
 * Reads the master catalog from SuperAdmin's MongoDB-backed collection API.
 * Admin route: /api/[org]/catalog
 */
export async function fetchAdminCatalog({
  companyId = DEFAULT_COMPANY_ID,
  websiteId = DEFAULT_WEBSITE_ID,
} = {}) {
  const baseUrl = getAdminApiBaseUrl();
  const siteId = normalizeWebsiteId(websiteId);
  const url = `${baseUrl}/api/${encodeURIComponent(companyId)}/catalog?websiteId=${encodeURIComponent(siteId)}`;
  const json = await readJson(url);

  if (!json?.success) return [];
  // The MongoDB collection API returns products and categories separately.
  if (Array.isArray(json.products)) return json.products;
  if (Array.isArray(json.data)) return json.data;
  return [];
}

/**
 * Reads page content from SuperAdmin's MongoDB pages collection.
 * Admin route: /api/[org]/site-data
 */
export async function fetchAdminSiteData({
  type = "home",
  companyId = DEFAULT_COMPANY_ID,
  websiteId = DEFAULT_WEBSITE_ID,
  page = "",
  district = "",
} = {}) {
  const baseUrl = getAdminApiBaseUrl();
  const siteId = normalizeWebsiteId(websiteId);

  // District data is still maintained through the Admin's legacy website
  // document structure, which is also backed by the Admin MongoDB adapter.
  if (type === "districts" || type === "district") {
    const params = new URLSearchParams({
      type,
      companyId,
      websiteId: siteId,
    });
    if (district) params.set("district", district);
    const legacyUrl = `${baseUrl}/api/site-data?${params.toString()}`;
    const legacyJson = await readJson(legacyUrl);
    if (!legacyJson?.success) return null;
    return legacyJson.data !== undefined ? legacyJson.data : legacyJson.districts ?? null;
  }

  const requestedPage = page || type;
  const params = new URLSearchParams({ websiteId: siteId });
  if (requestedPage) params.set("page", requestedPage);

  const url = `${baseUrl}/api/${encodeURIComponent(companyId)}/site-data?${params.toString()}`;
  const json = await readJson(url);
  if (!json?.success) return null;

  if (requestedPage) return json.data ?? null;
  return json.pages ?? json;
}

export async function fetchAdminDistricts({
  companyId = DEFAULT_COMPANY_ID,
  websiteId = DEFAULT_WEBSITE_ID,
} = {}) {
  const data = await fetchAdminSiteData({ type: "districts", companyId, websiteId });
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.districts)) return data.districts;
  return [];
}

export async function fetchAdminDistrict({
  district = "",
  companyId = DEFAULT_COMPANY_ID,
  websiteId = DEFAULT_WEBSITE_ID,
} = {}) {
  if (!district) return null;
  return fetchAdminSiteData({ type: "district", district, companyId, websiteId });
}

/**
 * Sends contact and product enquiries to the Admin MongoDB queries collection.
 * Admin route: POST /api/[org]/query?websiteId=...
 */
async function submitAdminQuery(data = {}, type = "contact") {
  const baseUrl = getAdminApiBaseUrl();
  const websiteId = normalizeWebsiteId(data.websiteId || DEFAULT_WEBSITE_ID);
  const url = `${baseUrl}/api/${encodeURIComponent(data.companyId || DEFAULT_COMPANY_ID)}/query?websiteId=${encodeURIComponent(websiteId)}`;

  const payload = {
    ...data,
    type,
    companyId: data.companyId || DEFAULT_COMPANY_ID,
    websiteId,
    createdAt: data.createdAt || new Date().toISOString(),
  };

  const json = await readJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (json?.ok || json?.success) return { success: true, ...json };
  return {
    success: false,
    message: "Unable to submit your enquiry. Please try again.",
  };
}

export function submitAdminContactQuery(data = {}) {
  return submitAdminQuery(data, "contact");
}

export function submitAdminProductQuery(data = {}) {
  return submitAdminQuery(data, "product");
}
